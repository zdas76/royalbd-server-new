"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhillersRoute = void 0;
const express_1 = __importDefault(require("express"));
const Pillers_controllers_1 = require("./Pillers.controllers");
const router = express_1.default.Router();
router.post("/", Pillers_controllers_1.PillersControllers.createPillers);
router.get("/", Pillers_controllers_1.PillersControllers.getPillers);
exports.PhillersRoute = router;
