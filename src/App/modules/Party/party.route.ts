import express from "express";
import { PartyControllers } from "./party.controllers";
import validationRequiest from "../../middlewares/validationRequest";
import { partyValidaton } from "./party.validation";

const route = express.Router();

route.post(
  "/",
  validationRequiest(partyValidaton.createParty),
  PartyControllers.createParty
);

route.get("/", PartyControllers.getAllParty);

route.get("/:id", PartyControllers.getPartyById);

route.put(
  "/:id",
  validationRequiest(partyValidaton.UpdateParty),
  PartyControllers.updatePartyById
);

route.delete("/:id", PartyControllers.deletePartyById);

export const PartyRoute = route;
