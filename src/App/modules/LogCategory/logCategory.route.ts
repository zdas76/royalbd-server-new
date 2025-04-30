import express from "express";
import { LogCategoryControllers } from "./logCategory.controllers";

const router = express.Router();

router.post("/", LogCategoryControllers.createLogCagetory);

router.get("/", LogCategoryControllers.getLogCagetory);

router.get("/:id", LogCategoryControllers.getLogCagetoryById);

router.put("/:id", LogCategoryControllers.updateLogCagetoryById);

export const LogCategoryRoute = router;
