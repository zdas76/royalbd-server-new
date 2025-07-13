"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogtoRawRoute = void 0;
const express_1 = __importDefault(require("express"));
const logToRaw_controllers_1 = require("./logToRaw.controllers");
const router = express_1.default.Router();
router.post("/", logToRaw_controllers_1.LogtoRawControllers.createLogToRow);
router.get("/", logToRaw_controllers_1.LogtoRawControllers.getLogCagetory);
router.get("/:id", logToRaw_controllers_1.LogtoRawControllers.getLogCagetoryById);
router.put("/:id", logToRaw_controllers_1.LogtoRawControllers.updateLogCagetoryById);
exports.LogtoRawRoute = router;
