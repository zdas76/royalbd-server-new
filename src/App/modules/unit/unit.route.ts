import express from "express";
import { UnitControllers } from "./unit.controllers";

const route = express.Router();

route.post("/", UnitControllers.createUnit);

route.get("/", UnitControllers.getAllUnit);

route.get("/:id", UnitControllers.getUnitById);

route.put("/:id", UnitControllers.updateUnit);

export const UnitRoute = route;
