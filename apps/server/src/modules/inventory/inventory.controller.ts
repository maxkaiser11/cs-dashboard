import type { NextFunction, Request, Response } from "express";
import { InventoryService } from "./inventory.service.js";
import { NotFoundError, TooManyRequestsError } from "../../lib/errors.js";

/** Turns known service errors into JSON responses; anything else goes to Express. */
function handleError(err: unknown, res: Response, next: NextFunction) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof TooManyRequestsError) {
    res.setHeader("Retry-After", String(err.retryAfterSeconds));
    return res
      .status(429)
      .json({ error: err.message, retryAfter: err.retryAfterSeconds });
  }
  next(err);
}

class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // Arrow functions so `this` survives being passed to the router.
  getInventory = async (
    req: Request<{ steamId: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { steamId } = req.params;

      if (!/^\d{17}$/.test(steamId)) {
        return res.status(400).json({ error: "Invalid SteamId" });
      }

      const items = await this.inventoryService.getOrSyncInventory(steamId);
      res.json(items);
    } catch (err) {
      handleError(err, res, next);
    }
  };

  getMyInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await this.inventoryService.getOrSyncInventory(
        req.user!.steamId,
      );
      res.json(items);
    } catch (err) {
      handleError(err, res, next);
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
      handleError(err, res, next);
    }
  };

  syncMyInventory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.inventoryService.syncInventory(
        req.user!.steamId,
      );
      res.json({ ...result, currency: "USD" });
    } catch (err) {
      handleError(err, res, next);
    }
  };
}

export default new InventoryController(new InventoryService());
