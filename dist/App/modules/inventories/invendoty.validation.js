"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = __importDefault(require("zod"));
const createInventoryValidationSchema = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({ required_error: "Name is required" }).min(1).max(255),
        type: zod_1.default.nativeEnum(client_1.ItemType),
        category: zod_1.default.string().max(255).optional(),
        supplier: zod_1.default.string().max(255).optional(),
        unitPrice: zod_1.default.number().nonnegative().default(0.0),
        quantity: zod_1.default.number().nonnegative().default(0.0),
        totalCost: zod_1.default.number().nonnegative().default(0.0),
        closingStocks: zod_1.default.any().optional(),
    }),
});
exports.InventoryValidation = {
    createInventoryValidationSchema,
};
