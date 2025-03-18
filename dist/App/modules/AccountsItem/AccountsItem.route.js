"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountItemRoute = void 0;
const express_1 = __importDefault(require("express"));
const AccountsItem_controllers_1 = require("./AccountsItem.controllers");
const router = express_1.default.Router();
router.post("/", AccountsItem_controllers_1.AccountItemController.createAccountItem);
router.get("/", AccountsItem_controllers_1.AccountItemController.getAccountItem);
router.get("/:id", AccountsItem_controllers_1.AccountItemController.getAccountItemById);
router.put("/:id", AccountsItem_controllers_1.AccountItemController.updateAccountItemById);
exports.AccountItemRoute = router;
