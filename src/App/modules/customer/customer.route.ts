import express from "express";
import { CustomerControllers } from "./customer.controller";

const route = express.Router();

route.get("/", CustomerControllers.getCustomer);

export const CustomerRouter = route;
