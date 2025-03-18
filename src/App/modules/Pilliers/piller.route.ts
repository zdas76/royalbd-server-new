import express from "express";
import { PillersControllers } from "./Pillers.controllers";

const router = express.Router();

router.post("/", PillersControllers.createPillers);

router.get("/", PillersControllers.getPillers);

export const PhillersRoute = router;
