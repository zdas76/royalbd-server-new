import express from "express";
import { LogtoRawControllers } from "./logToRaw.controllers";

const router = express.Router();

router.post("/", LogtoRawControllers.createLogToRow);

router.get("/", LogtoRawControllers.getLogCagetory);

router.get("/:id", LogtoRawControllers.getLogCagetoryById);

export const LogtoRawRoute = router;
