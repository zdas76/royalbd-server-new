import express from "express";
import { CustomerControllers } from "./customer.controller";

const route = express.Router();

route.get("/", CustomerControllers.getCustomerById);

export const CustomerRouter = route;
