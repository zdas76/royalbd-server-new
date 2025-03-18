"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidaton = void 0;
const zod_1 = require("zod");
const createEmployee = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    employee: zod_1.z.object({
        userName: zod_1.z.string({ required_error: "Name is  required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        name: zod_1.z.string({ required_error: "Name is required" }),
        fatherName: zod_1.z.string({ required_error: "Father name is required" }),
        motherName: zod_1.z.string({ required_error: "Father name is required" }),
        workingPlase: zod_1.z.string({ required_error: "Father name is required" }),
        address: zod_1.z.string({ required_error: "Father name is required" }),
        mobile: zod_1.z.string({ required_error: "Father name is required" }),
    }),
});
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({ required_error: "Password is required" }),
    employee: zod_1.z.object({
        userName: zod_1.z.string({ required_error: "Name is  required" }),
        email: zod_1.z.string({ required_error: "Email is required" }),
        name: zod_1.z.string({ required_error: "Name is required" }),
        fatherName: zod_1.z.string({ required_error: "Father name is required" }),
        motherName: zod_1.z.string({ required_error: "Father name is required" }),
        photo: zod_1.z.string({ required_error: "Father name is required" }),
        address: zod_1.z.string({ required_error: "Father name is required" }),
        mobile: zod_1.z.string({ required_error: "Father name is required" }),
    }),
});
exports.userValidaton = {
    createEmployee,
    createAdmin,
};
