import { Router, type NextFunction } from "express";
import inventoryController from "./inventory.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";


const inventoryRouter = Router();

inventoryRouter.get("/me", requireAuth, inventoryController.getMyInventory);
inventoryRouter.get('/value', requireAuth, inventoryController.getTotalValue);
inventoryRouter.get('/:steamId', inventoryController.getInventory);

export default inventoryRouter;
