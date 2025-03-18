"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawMaterialRoute = void 0;
const express_1 = __importDefault(require("express"));
const raw_Controllers_1 = require("./raw.Controllers");
const route = express_1.default.Router();
route.post("/", raw_Controllers_1.RawMaterialControllers.createRawMaterial);
route.get("/:id", raw_Controllers_1.RawMaterialControllers.deleteRawMaterialById);
route.get("/", raw_Controllers_1.RawMaterialControllers.getAllRawMaterial);
route.put("/:id", raw_Controllers_1.RawMaterialControllers.updateRawMaterialById);
route.delete("/:id", raw_Controllers_1.RawMaterialControllers.deleteRawMaterialById);
exports.RawMaterialRoute = route;
