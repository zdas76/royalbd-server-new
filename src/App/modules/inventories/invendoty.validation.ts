import { ItemType } from "@prisma/client";
import z from "zod";

const createInventoryValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(255),
    type: z.nativeEnum(ItemType),
    category: z.string().max(255).optional(),
    supplier: z.string().max(255).optional(),
    unitePrice: z.number().nonnegative().default(0.0),
    quantity: z.number().nonnegative().default(0.0),
    totalCost: z.number().nonnegative().default(0.0),
    closingStocks: z.any().optional(),
  }),
});

export const InventoryValidation = {
  createInventoryValidationSchema,
};
