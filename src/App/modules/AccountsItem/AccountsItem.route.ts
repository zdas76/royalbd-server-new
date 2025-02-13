import express from "express";
import { AccountItemController } from "./AccountsItem.controllers";

const router = express.Router();

router.post("/", AccountItemController.createAccountItem);

router.get("/", AccountItemController.getAccountItem);

router.get("/:id", AccountItemController.getAccountItemById);

router.put("/:id", AccountItemController.updateAccountItemById);

export const AccountItemRoute = router;
