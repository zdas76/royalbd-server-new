import express from "express";
import { SubCategoryControllers } from "./subCategory.controllers";

const router = express.Router();

router.post("/", SubCategoryControllers.createSubCategory);

router.get("/", SubCategoryControllers.getSubCategory);

router.get("/:id", SubCategoryControllers.getSubCategoryById);

router.put("/:id", SubCategoryControllers.updateSubCategory);

export const SubCategoryRouter = router;
