"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchestSchema = void 0;
const zod_1 = require("zod");
const CreatePurchestSchema = zod_1.z.object({
    body: zod_1.z.object({
        date: zod_1.z.date(),
        invoiceNo: zod_1.z.string().min(1, "Invoice number is required"),
        partyType: zod_1.z.enum(["SUPPLIER", "CUSTOMER"]).nullable(),
        partyOrcustomerId: zod_1.z.number().int().positive().nullable(),
        debitAccountsItemId: zod_1.z.number().int().positive().nullable(),
        creditAccountsItemId: zod_1.z.number().int().positive().nullable(),
        inventoryItemId: zod_1.z.number().int().positive().nullable(),
        creditAmount: zod_1.z.number().nonnegative().default(0).optional(),
        debitAmount: zod_1.z.number().nonnegative().default(0).optional(),
        narration: zod_1.z.string().min(1, "Narration is required"),
    }),
});
exports.PurchestSchema = {
    CreatePurchestSchema,
};
