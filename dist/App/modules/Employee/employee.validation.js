"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidaton = void 0;
const zod_1 = require("zod");
const createEmployee = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Email is required" }),
    password: zod_1.z.string({ required_error: "Password is required" }),
    name: zod_1.z.string({ required_error: "Name is required" }),
    nid: zod_1.z.string({ required_error: "NID number required" }).optional(),
    dob: zod_1.z.string({ required_error: "Father name is required" }).optional(),
    workingPlase: zod_1.z.string({ required_error: "Working Place is required" }),
    address: zod_1.z.string({ required_error: "Address is required" }),
    mobile: zod_1.z.string({ required_error: "Mobile number is required" }),
});
const updateEmployee = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Name is required" }).optional(),
    nid: zod_1.z.string({ required_error: "NID number required" }).optional(),
    dob: zod_1.z.string({ required_error: "Father name is required" }).optional(),
    workingPlase: zod_1.z
        .string({ required_error: "Working Place is required" })
        .optional(),
    address: zod_1.z.string({ required_error: "Address is required" }).optional(),
    mobile: zod_1.z.string({ required_error: "Working Place is required" }).optional(),
});
exports.userValidaton = {
    createEmployee,
    updateEmployee,
};
