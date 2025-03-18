"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const User_validation_1 = require("./User.validation");
const uploads_1 = __importDefault(require("../../../helpars/uploads"));
const router = express_1.default.Router();
router.post("/create-employee", uploads_1.default.single("photo"), (req, res, next) => {
    req.body = User_validation_1.userValidaton.createEmployee.parse(JSON.parse(req.body.data));
    return User_controller_1.UserControllers.createEmployee(req, res, next);
});
router.post("/creat-admin", uploads_1.default.single("photo"), (req, res, next) => {
    req.body = User_validation_1.userValidaton.createAdmin.parse(JSON.parse(req.body.data));
    return User_controller_1.UserControllers.createAdmin(req, res, next);
});
router.get("/", User_controller_1.UserControllers.getAllUser);
exports.UserRouter = router;
