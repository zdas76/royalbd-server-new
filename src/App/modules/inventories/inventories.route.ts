import validationRequiest from "../../middlewares/validationRequest";
import { InventoryValidation } from "./invendoty.validation";
import { InventoryControllers } from "./inventories.controllers";
import express from "express";

const route = express.Router();

route.get("/", InventoryControllers.getnventory);

route.get("/inventorytotal", InventoryControllers.getInventoryAggigetValue);

route.get("/:id", InventoryControllers.getInventoryById);

route.put("/", InventoryControllers.updateInventory);

route.put("/", InventoryControllers.deleteInventory);

export const InventoryRoute = route;
