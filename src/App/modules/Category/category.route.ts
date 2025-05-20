import express from "express";
import { CategoryControllers } from "./category.controllers";

const router = express.Router();

router.post("/", CategoryControllers.createCategory);

router.get("/", CategoryControllers.getCategory);

router.get("/:id", CategoryControllers.getCategory);

router.put("/", CategoryControllers.updateCategory);

export const CategoryRouter = router;
