"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const CreateProductValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "Product name is required" }).trim(),
        description: zod_1.default.string({
            required_error: "Product Description is required",
        }),
        subCategoryId: zod_1.default.number(),
        minPrice: zod_1.default.number().optional(),
        color: zod_1.default.string().optional(),
        size: zod_1.default.string().optional(),
    }),
});
const updateProductValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default
            .string({ required_error: "Product name is required" })
            .trim()
            .optional(),
        description: zod_1.default
            .string({
            required_error: "Product Description is required",
        })
            .optional(),
        subCategoryId: zod_1.default.number().optional(),
        minPrice: zod_1.default.number().optional(),
        color: zod_1.default.string().optional(),
        size: zod_1.default.string().optional(),
    }),
});
exports.ProductValidation = {
    CreateProductValidationSchema,
    updateProductValidationSchema,
};
