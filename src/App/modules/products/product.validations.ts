import z from "zod";

const CreateProductValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Product name is required" }).trim(),
    description: z.string({
      required_error: "Product Description is required",
    }),
    subCategoryId: z.number(),
    minPrice: z.number().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
  }),
});

const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name is required" })
      .trim()
      .optional(),
    description: z
      .string({
        required_error: "Product Description is required",
      })
      .optional(),
    subCategoryId: z.number().optional(),
    minPrice: z.number().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
  }),
});

export const ProductValidation = {
  CreateProductValidationSchema,
  updateProductValidationSchema,
};
