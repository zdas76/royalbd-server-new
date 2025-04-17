import express from "express";
import { JournalControllers } from "./journal.controllers";

const route = express.Router();

route.post("/purchase", JournalControllers.addPurcherReceived);

route.post("/sales", JournalControllers.createSalseVoucher);

route.post("/received", JournalControllers.addPurcherReceived);

route.post("/payment", JournalControllers.addPurcherReceived);

route.post("/journal", JournalControllers.addPurcherReceived);

route.post("/contra", JournalControllers.addPurcherReceived);

route.get("/");

route.get("/:id");

route.put("/");

route.delete("/");

export const JournalRoute = route;
