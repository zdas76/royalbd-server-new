"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const createProduct_controllers_1 = require("./createProduct.controllers");
const route = express_1.default.Router();
route.post("/", createProduct_controllers_1.CreateProductControllers.createProductFromRowMaterial);
exports.createProductRoute = route;
