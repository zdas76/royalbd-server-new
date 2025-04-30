import express from "express";
import { GradeControllers } from "./grades.controllers";

const route = express.Router();

route.post("/", GradeControllers.createLogGrades);

route.get("/", GradeControllers.getAllLogGrades);

route.get("/:id", GradeControllers.getLogGradesById);

route.put("/:id", GradeControllers.updateLogGradesById);

export const GradesRoutes = route;
