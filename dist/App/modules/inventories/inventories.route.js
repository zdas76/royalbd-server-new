"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryRoute = void 0;
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const invendoty_validation_1 = require("./invendoty.validation");
const inventories_controllers_1 = require("./inventories.controllers");
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
route.post("/", (0, validationRequest_1.default)(invendoty_validation_1.InventoryValidation.createInventoryValidationSchema), inventories_controllers_1.InventoryControllers.createInventory);
route.get("/", inventories_controllers_1.InventoryControllers.getnventory);
route.get("/:", inventories_controllers_1.InventoryControllers.getInventoryById);
route.put("/", inventories_controllers_1.InventoryControllers.updateInventory);
route.put("/", inventories_controllers_1.InventoryControllers.deleteInventory);
exports.InventoryRoute = route;
