import express from "express";
import { CreateProductControllers } from "./createProduct.controllers";

const route = express.Router();

route.post("/", CreateProductControllers.createProductFromRowMaterial);

export const createProductRoute = route;
