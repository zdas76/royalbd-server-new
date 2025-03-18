"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const subCategory_controllers_1 = require("./subCategory.controllers");
const router = express_1.default.Router();
router.post("/", subCategory_controllers_1.SubCategoryControllers.createSubCategory);
router.get("/", subCategory_controllers_1.SubCategoryControllers.getSubCategory);
router.get("/:id", subCategory_controllers_1.SubCategoryControllers.getSubCategoryById);
router.put("/:id", subCategory_controllers_1.SubCategoryControllers.updateSubCategory);
exports.SubCategoryRouter = router;
