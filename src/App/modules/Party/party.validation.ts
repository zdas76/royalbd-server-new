import z from "zod";

const createParty = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim(),
    contactNo: z.string({ required_error: "Contact Number is required" }),
    partyType: z.enum(["VENDOR", "SUPPLIER"]),
    address: z.string().optional(),
  }),
});

const UpdateParty = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim().optional(),
    contactNo: z
      .string({ required_error: "Contact Number is required" })
      .optional(),
    partyType: z
      .enum(["VENDOR", "SUPPLIER"], {
        required_error: "Party type is required",
      })
      .optional(),
    address: z.string().optional(),
  }),
});

export const partyValidaton = {
  createParty,
  UpdateParty,
};
