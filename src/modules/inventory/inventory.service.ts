import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { InventoryClient, type SteamWebApiItem } from "./inventory.client";

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
): Prisma.InventoryItemCreateManyInput {
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
  };
}

export class InventoryService {
  constructor(private client = new InventoryClient()) {}

  async getOrSyncInventory(steamId: string) {
    const user = await prisma.user.findUnique({ where: { steamId } });
    if (!user) throw new Error("User does not exist");

    const existing = await prisma.inventoryItem.findMany({
      where: { userId: user.id },
    });

    if (existing.length > 0) return existing;

  const items  = await this.client.fetchInventory(steamId);
    const rows = items.map((item) => toRow(user.id, item));

    await prisma.inventoryItem.createMany({data: rows, skipDuplicates: true});
    return prisma.inventoryItem.findMany({where: {userId: user.id}});
  }

  async getInventoryValue(steamId: string) {
    const user = await prisma.user.findUnique({where: {steamId}});
    if (!user) throw new Error("User does not exist");

    const result = await prisma.inventoryItem.aggregate({
      where: {userId: user.id},
      _sum: {priceCents: true},
      _count: true
    });
    return {
      itemCount: result._count,
      totalCents: result._sum.priceCents ?? 0,
    }
  }
}
