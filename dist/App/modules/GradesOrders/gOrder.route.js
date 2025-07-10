"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradesOrderRouter = void 0;
const express_1 = __importDefault(require("express"));
const gOrder_controllers_1 = require("./gOrder.controllers");
const route = express_1.default.Router();
route.post("/", gOrder_controllers_1.OrderControllers.createOrder);
route.get("/categoryTotal", gOrder_controllers_1.OrderControllers.getTotelByCategoryId);
route.get("/", gOrder_controllers_1.OrderControllers.getAllOrder);
exports.GradesOrderRouter = route;
