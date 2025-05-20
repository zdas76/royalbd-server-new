import express from "express";
import { OrderControllers } from "./gOrder.controllers";

const route = express.Router();

route.post("/", OrderControllers.createOrder);

route.get("/", OrderControllers.getAllOrder);

export const GradesOrderRouter = route;
