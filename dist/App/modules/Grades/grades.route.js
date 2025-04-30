"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const grades_controllers_1 = require("./grades.controllers");
const route = express_1.default.Router();
route.post("/", grades_controllers_1.GradeControllers.createLogGrades);
route.get("/", grades_controllers_1.GradeControllers.getAllLogGrades);
route.get("/:id", grades_controllers_1.GradeControllers.getLogGradesById);
route.put("/:id", grades_controllers_1.GradeControllers.updateLogGradesById);
exports.GradesRoutes = route;
