import type { NextFunction, Request, Response } from "express";
import { InventoryService } from "./inventory.service";
import { NotFoundError } from "../../lib/errors";

class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  async getInventory(
    req: Request<{ steamId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { steamId } = req.params;

      if (!/^\d{17}$/.test(steamId)) {
        return res.status(400).json({ error: "Invalid SteamId" });
      }

      const items = await this.inventoryService.getOrSyncInventory(steamId);
      res.json(items);
    } catch (err) {
      if (err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }

  getMyInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.inventoryService.getOrSyncInventory(
        req.user!.steamId,
      );
      res.json(items);
    } catch (err) {
      next(err);
    }
  };

  getTotalValue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await this.inventoryService.getInventoryValue(
        req.user!.steamId,
      );
      res.json({
        ...value,
        total: (value.totalCents / 100).toFixed(2),
        currency: "USD",
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new InventoryController(new InventoryService());
