import { InventoryClient } from "./modules/inventory/inventory.client";

const inv:  = await new InventoryClient().fetchInventory("76561198298708643");
console.log(inv.total_inventory_count, inv.assets?.length);
