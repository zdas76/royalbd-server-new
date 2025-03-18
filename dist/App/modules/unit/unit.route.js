"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRoute = void 0;
const express_1 = __importDefault(require("express"));
const unit_controllers_1 = require("./unit.controllers");
const route = express_1.default.Router();
route.post("/", unit_controllers_1.UnitControllers.createUnit);
route.get("/", unit_controllers_1.UnitControllers.getAllUnit);
route.get("/:id", unit_controllers_1.UnitControllers.getUnitById);
route.put("/:id", unit_controllers_1.UnitControllers.updateUnit);
exports.UnitRoute = route;
