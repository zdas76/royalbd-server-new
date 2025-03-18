"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoute = void 0;
const empoyee_controllers_1 = require("./empoyee.controllers");
const express_1 = __importDefault(require("express"));
const uploads_1 = __importDefault(require("../../../helpars/uploads"));
const employee_validation_1 = require("./employee.validation");
const route = express_1.default.Router();
route.post("/create-employee", uploads_1.default.single("photo"), (req, res, next) => {
    req.body = employee_validation_1.userValidaton.createEmployee.parse(JSON.parse(req.body.data));
    return empoyee_controllers_1.EmployeeControllers.createEmployee(req, res, next);
});
route.get("/", empoyee_controllers_1.EmployeeControllers.getEmployee);
route.get("/:id", empoyee_controllers_1.EmployeeControllers.getEmployeeById);
route.put("/:id", uploads_1.default.single("photo"), (req, res, next) => {
    req.body = employee_validation_1.userValidaton.updateEmployee.parse(JSON.parse(req.body.data));
    return empoyee_controllers_1.EmployeeControllers.updateEmployeeById(req, res, next);
});
route.delete("/:id", empoyee_controllers_1.EmployeeControllers.deleteEmployeeById);
exports.EmployeeRoute = route;
