"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyRoute = void 0;
const express_1 = __importDefault(require("express"));
const party_controllers_1 = require("./party.controllers");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const party_validation_1 = require("./party.validation");
const route = express_1.default.Router();
route.post("/", (0, validationRequest_1.default)(party_validation_1.partyValidaton.createParty), party_controllers_1.PartyControllers.createParty);
route.get("/", party_controllers_1.PartyControllers.getAllParty);
route.get("/:id", party_controllers_1.PartyControllers.getPartyById);
route.put("/:id", (0, validationRequest_1.default)(party_validation_1.partyValidaton.UpdateParty), party_controllers_1.PartyControllers.updatePartyById);
route.delete("/:id", party_controllers_1.PartyControllers.deletePartyById);
exports.PartyRoute = route;
