"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRoute = void 0;
const express_1 = __importDefault(require("express"));
const bank_controllers_1 = require("./bank.controllers");
const route = express_1.default.Router();
route.post("/", bank_controllers_1.BankControllers.createBankAccount);
route.get("/", bank_controllers_1.BankControllers.getAllBankAccount);
route.get("/:id", bank_controllers_1.BankControllers.getAllBankAccount);
route.put("/:id", bank_controllers_1.BankControllers.updateBankAccountById);
exports.BankRoute = route;
