import express from "express";
import { JournalControllers } from "./journal.controllers";

const route = express.Router();

route.post("/purchase", JournalControllers.addPurcherReceived);

route.post("/sales", JournalControllers.createSalseVoucher);

route.post("/received", JournalControllers.createReceiptdVoucher);

route.post("/payment", JournalControllers.createPaymentdVoucher);

route.post("/journal", JournalControllers.addPurcherReceived);

route.post("/contra", JournalControllers.addPurcherReceived);

route.get("/", JournalControllers.getAllVoucher);

route.get("/:id");

route.put("/");

route.delete("/");

export const JournalRoute = route;
