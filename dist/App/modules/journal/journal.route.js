"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JournalRoute = void 0;
const express_1 = __importDefault(require("express"));
const journal_controllers_1 = require("./journal.controllers");
const route = express_1.default.Router();
route.post("/purchase", journal_controllers_1.JournalControllers.addPurcherReceived);
route.post("/sales", journal_controllers_1.JournalControllers.createSalseVoucher);
route.post("/received", journal_controllers_1.JournalControllers.createReceiptdVoucher);
route.post("/payment", journal_controllers_1.JournalControllers.createPaymentdVoucher);
route.post("/journal", journal_controllers_1.JournalControllers.addPurcherReceived);
route.post("/contra", journal_controllers_1.JournalControllers.addPurcherReceived);
route.get("/", journal_controllers_1.JournalControllers.getAllVoucher);
route.get("/ledgerTotal", journal_controllers_1.JournalControllers.getTotalByAccountId);
route.get("/:id");
route.put("/");
route.delete("/");
exports.JournalRoute = route;
