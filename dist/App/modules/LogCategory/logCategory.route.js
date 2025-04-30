"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCategoryRoute = void 0;
const express_1 = __importDefault(require("express"));
const logCategory_controllers_1 = require("./logCategory.controllers");
const router = express_1.default.Router();
router.post("/", logCategory_controllers_1.LogCategoryControllers.createLogCagetory);
router.get("/", logCategory_controllers_1.LogCategoryControllers.getLogCagetory);
router.get("/:id", logCategory_controllers_1.LogCategoryControllers.getLogCagetoryById);
router.put("/:id", logCategory_controllers_1.LogCategoryControllers.updateLogCagetoryById);
exports.LogCategoryRoute = router;
