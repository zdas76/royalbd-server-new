"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoute = void 0;
const express_1 = __importDefault(require("express"));
const product_controllers_1 = require("./product.controllers");
const validationRequest_1 = __importDefault(require("../../middlewares/validationRequest"));
const product_validations_1 = require("./product.validations");
const route = express_1.default.Router();
route.post("/", (0, validationRequest_1.default)(product_validations_1.ProductValidation.CreateProductValidationSchema), product_controllers_1.ProductControllers.createProduct);
route.get("/:id", product_controllers_1.ProductControllers.getProductById);
route.get("/", product_controllers_1.ProductControllers.getAllProduct);
route.put("/:id", (0, validationRequest_1.default)(product_validations_1.ProductValidation.updateProductValidationSchema), product_controllers_1.ProductControllers.updateProductById);
route.delete("/:id", product_controllers_1.ProductControllers.deleteProductById);
exports.ProductRoute = route;
