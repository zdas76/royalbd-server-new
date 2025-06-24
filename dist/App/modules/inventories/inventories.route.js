"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRoute = void 0;
const inventories_controllers_1 = require("./inventories.controllers");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.get("/", inventories_controllers_1.InventoryControllers.getnventory);
route.get("/inventorytotal", inventories_controllers_1.InventoryControllers.getInventoryAggigetValue);
route.get("/:id", inventories_controllers_1.InventoryControllers.getInventoryById);
route.put("/", inventories_controllers_1.InventoryControllers.updateInventory);
route.put("/", inventories_controllers_1.InventoryControllers.deleteInventory);
exports.InventoryRoute = route;
