import express from "express";
import { transactionControllers } from "./transaction.controllers";

const route = express.Router();

route.get("/", transactionControllers.getAllBankAccount);
route.get("/:id", transactionControllers.getBankAccountById);

export const TransactionRoute = route;
