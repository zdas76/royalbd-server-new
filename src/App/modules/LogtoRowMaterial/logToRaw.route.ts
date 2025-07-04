import express from "express";
import { LogtoRawControllers } from "./logToRaw.controllers";

const router = express.Router();

router.post("/", LogtoRawControllers.createLogCagetory);

router.get("/", LogtoRawControllers.getLogCagetory);

router.get("/:id", LogtoRawControllers.getLogCagetoryById);

router.put("/:id", LogtoRawControllers.updateLogCagetoryById);

export const LogtoRawRoute = router;
