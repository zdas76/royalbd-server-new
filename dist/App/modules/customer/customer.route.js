"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRouter = void 0;
const express_1 = __importDefault(require("express"));
const customer_controller_1 = require("./customer.controller");
const route = express_1.default.Router();
route.get("/contactNumber", customer_controller_1.CustomerControllers.getCustomerById);
exports.CustomerRouter = route;
