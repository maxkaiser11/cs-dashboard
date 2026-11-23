import { InventoryClient } from "./modules/inventory/inventory.client.js";

const inv = await new InventoryClient().fetchInventory("76561198298708643");
console.log(`${inv.length} items, first: ${inv[0]?.markethashname ?? "none"}`);
