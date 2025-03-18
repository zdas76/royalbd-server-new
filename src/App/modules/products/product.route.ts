import express from "express";
import { ProductControllers } from "./product.controllers";
import validationRequiest from "../../middlewares/validationRequest";
import { ProductValidation } from "./product.validations";

const route = express.Router();

route.post(
  "/",
  validationRequiest(ProductValidation.CreateProductValidationSchema),
  ProductControllers.createProduct
);

route.get("/:id", ProductControllers.getProductById);

route.get("/", ProductControllers.getAllProduct);

route.put(
  "/:id",
  validationRequiest(ProductValidation.updateProductValidationSchema),
  ProductControllers.updateProductById
);

route.delete("/:id", ProductControllers.deleteProductById);

export const ProductRoute = route;
