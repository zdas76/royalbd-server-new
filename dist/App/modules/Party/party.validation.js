"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.partyValidaton = void 0;
const zod_1 = __importDefault(require("zod"));
const createParty = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "Name is required" }).trim(),
        contactNo: zod_1.default.string({ required_error: "Contact Number is required" }),
        partyType: zod_1.default.enum(["VENDOR", "SUPPLIER"]),
        address: zod_1.default.string().optional(),
    }),
});
const UpdateParty = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "Name is required" }).trim().optional(),
        contactNo: zod_1.default
            .string({ required_error: "Contact Number is required" })
            .optional(),
        partyType: zod_1.default
            .enum(["VENDOR", "SUPPLIER"], {
            required_error: "Party type is required",
        })
            .optional(),
        address: zod_1.default.string().optional(),
    }),
});
exports.partyValidaton = {
    createParty,
    UpdateParty,
};
