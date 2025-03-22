import { PartyType } from "@prisma/client";
import { z } from "zod";

const CreateJournalSchema = z.object({
  body: z.object({
    date: z.date(),
    invoiceNo: z.string().min(1, "Invoice number is required"),
    partyType: z.enum(["SUPPLIER", "CUSTOMER"]).nullable(),
    partyOrcustomerId: z.number().int().positive().nullable(),
    debitAccountsItemId: z.number().int().positive().nullable(),
    creditAccountsItemId: z.number().int().positive().nullable(),
    inventoryItemId: z.number().int().positive().nullable(),
    creditAmount: z.number().nonnegative().default(0).optional(),
    debitAmount: z.number().nonnegative().default(0).optional(),

    narration: z.string().min(1, "Narration is required"),
  }),
});

export const JournalSchema = {
  CreateJournalSchema,
};
