"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRoute = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controllers_1 = require("./transaction.controllers");
const route = express_1.default.Router();
route.get("/", transaction_controllers_1.transactionControllers.getAllBankAccount);
route.get("/:id", transaction_controllers_1.transactionControllers.getBankAccountById);
exports.TransactionRoute = route;
