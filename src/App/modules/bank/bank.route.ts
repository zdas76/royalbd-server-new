import express from "express";
import { BankControllers } from "./bank.controllers";

const route = express.Router();

route.post("/", BankControllers.createBankAccount);

route.get("/", BankControllers.getAllBankAccount);

route.get("/:id", BankControllers.getAllBankAccount);

route.put("/:id", BankControllers.updateBankAccountById);

export const BankRoute = route;
