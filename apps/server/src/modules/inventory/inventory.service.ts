import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { NotFoundError, TooManyRequestsError } from "../../lib/errors.js";
import { InventoryClient, type SteamWebApiItem } from "./inventory.client.js";

/** Manual syncs (POST /sync) are allowed at most this often per user. */
export const SYNC_COOLDOWN_MS = 5 * 60 * 1000;
/** Reading the inventory (GET /me) resyncs first when the data is older than this. */
export const STALE_AFTER_MS = 60 * 60 * 1000;

const WEAR_LABELS: Record<NonNullable<SteamWebApiItem["wear"]>, string> = {
  fn: "Factory New",
  mw: "Minimal Wear",
  ft: "Field-Tested",
  ww: "Well-Worn",
  bs: "Battle-Scarred",
};

function toRow(
  userId: number,
  item: SteamWebApiItem,
): Prisma.InventoryItemUncheckedCreateInput {
  return {
    userId,
    assetId: item.assetid,
    marketHashName: item.markethashname,
    name: item.marketname,
    type: item.tag1,
    exterior: item.wear ? WEAR_LABELS[item.wear] : null,
    priceCents:
      item.pricelatest != null ? Math.round(item.pricelatest * 100) : null,
    priceSource: "steamwebapi",
    currency: "USD",
    floatValue: item.float.floatvalue,
    paintSeed: item.float.paintseed,
    paintIndex: item.float.paintindex,
    phase: item.float.phase,
    iconUrl: item.image,
    tradable: item.tradable,
    marketable: item.marketable ?? false,
    tradeProtected: item.tradeprotected,
  };
}

export type SyncResult = {
  syncedAt: Date;
  nextSyncAvailableAt: Date;
  itemCount: number;
  totalCents: number;
  added: number;
  updated: number;
  removed: number;
};

export class InventoryService {
  /** One sync per user at a time; concurrent callers share the same promise. */
  private inFlight = new Map<number, Promise<SyncResult>>();

  constructor(private client = new InventoryClient()) {}

  private async getUser(steamId: string) {
    const user = await prisma.user.findUnique({ where: { steamId } });
    if (!user) throw new NotFoundError("User does not exist");
    return user;
  }

  /**
   * When this user's inventory was last synced: the newest snapshot, falling back to the
   * newest item row (inventories synced before snapshots existed). null = never synced.
   */
  private async lastSyncedAt(userId: number): Promise<Date | null> {
    const [snapshot, items] = await Promise.all([
      prisma.inventorySnapshot.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.inventoryItem.aggregate({
        where: { userId },
        _max: { lastUpdated: true },
      }),
    ]);

    const candidates = [snapshot?.createdAt, items._max.lastUpdated].filter(
      (d): d is Date => d != null,
    );
    if (candidates.length === 0) return null;
    return new Date(Math.max(...candidates.map((d) => d.getTime())));
  }

  /**
   * Fetch the inventory from the Steam Web API and reconcile the DB with it:
   * update items still owned, insert new ones, delete ones that are gone, and record a
   * snapshot. All in one transaction, so a failure leaves the previous inventory intact.
   *
   * `enforceCooldown` is for user-triggered syncs; internal stale refreshes skip it.
   */
  async syncInventory(
    steamId: string,
    { enforceCooldown = true }: { enforceCooldown?: boolean } = {},
  ): Promise<SyncResult> {
    const user = await this.getUser(steamId);

    const running = this.inFlight.get(user.id);
    if (running) return running;

    if (enforceCooldown) {
      const last = await this.lastSyncedAt(user.id);
      if (last) {
        const waitMs = last.getTime() + SYNC_COOLDOWN_MS - Date.now();
        if (waitMs > 0) {
          throw new TooManyRequestsError(
            "Inventory was synced recently, try again later",
            Math.ceil(waitMs / 1000),
          );
        }
      }
    }

    const promise = this.runSync(user.id, steamId).finally(() => {
      this.inFlight.delete(user.id);
    });
    this.inFlight.set(user.id, promise);
    return promise;
  }

  private async runSync(userId: number, steamId: string): Promise<SyncResult> {
    const items = await this.client.fetchInventory(steamId, { fresh: true });
    const rows = items.map((item) => toRow(userId, item));
    const assetIds = rows.map((r) => r.assetId);

    const existingIds = new Set(
      (
        await prisma.inventoryItem.findMany({
          where: { userId },
          select: { assetId: true },
        })
      ).map((r) => r.assetId),
    );

    const totalCents = rows.reduce((sum, r) => sum + (r.priceCents ?? 0), 0);

    const [deleted, ...rest] = await prisma.$transaction([
      // Gone: sold, traded or consumed since the last sync.
      prisma.inventoryItem.deleteMany({
        where: { userId, assetId: { notIn: assetIds } },
      }),
      // Still owned (update price / trade lock) or new (insert).
      ...rows.map((row) =>
        prisma.inventoryItem.upsert({
          where: { userId_assetId: { userId, assetId: row.assetId } },
          create: row,
          update: row,
        }),
      ),
      // Point for the value-over-time chart.
      prisma.inventorySnapshot.create({
        data: { userId, totalValueCents: totalCents, itemCount: rows.length },
      }),
    ]);

    const snapshot = rest[rest.length - 1] as { createdAt: Date };
    const added = assetIds.filter((id) => !existingIds.has(id)).length;

    return {
      syncedAt: snapshot.createdAt,
      nextSyncAvailableAt: new Date(snapshot.createdAt.getTime() + SYNC_COOLDOWN_MS),
      itemCount: rows.length,
      totalCents,
      added,
      updated: rows.length - added,
      removed: deleted.count,
    };
  }

  /**
   * Returns the stored inventory, syncing first if there is none yet or it is stale.
   * If a stale refresh fails (Steam down, rate limited), the stored items are served instead.
   */
  async getOrSyncInventory(steamId: string) {
    const user = await this.getUser(steamId);
    const last = await this.lastSyncedAt(user.id);
    const isStale = !last || Date.now() - last.getTime() > STALE_AFTER_MS;

    if (isStale) {
      try {
        await this.syncInventory(steamId, { enforceCooldown: false });
      } catch (err) {
        // Nothing stored yet → nothing to fall back to.
        if (!last) throw err;
        console.error(`Stale inventory refresh failed for ${steamId}:`, err);
      }
    }

    return prisma.inventoryItem.findMany({ where: { userId: user.id } });
  }

  async getInventoryValue(steamId: string) {
    const user = await this.getUser(steamId);

    const [result, syncedAt] = await Promise.all([
      prisma.inventoryItem.aggregate({
        where: { userId: user.id },
        _sum: { priceCents: true },
        _count: true,
      }),
      this.lastSyncedAt(user.id),
    ]);

    return {
      itemCount: result._count,
      totalCents: result._sum.priceCents ?? 0,
      syncedAt,
      nextSyncAvailableAt: syncedAt
        ? new Date(syncedAt.getTime() + SYNC_COOLDOWN_MS)
        : null,
    };
  }
}
