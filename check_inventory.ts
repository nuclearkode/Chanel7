import { importedMaterials } from "./src/lib/materials-data";
import { PCW_INVENTORY } from "./src/lib/data/pcw-ingredients";

console.log("Imported Materials Length:", importedMaterials.length);
console.log("PCW Inventory Length:", PCW_INVENTORY.length);

const INITIAL_INVENTORY = [
  ...importedMaterials,
  // 16 hardcoded
  ...PCW_INVENTORY
];

console.log("Total Estimated Inventory:", INITIAL_INVENTORY.length + 16);
