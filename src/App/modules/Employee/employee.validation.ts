import { z } from "zod";

const createEmployee = z.object({
  employee: z.object({
    email: z.string({ required_error: "Email is required" }),
    password: z.string({ required_error: "Password is required" }),
    name: z.string({ required_error: "Name is required" }),
    nid: z.string({ required_error: "NID number required" }).optional(),
    dob: z.string({ required_error: "Father name is required" }).optional(),
    workingPlase: z.string({ required_error: "Father name is required" }),
    address: z.string({ required_error: "Father name is required" }),
    mobile: z.string({ required_error: "Father name is required" }),
  }),
});

const updateEmployee = z.object({
  employee: z.object({
    name: z.string({ required_error: "Name is required" }).optional(),
    nid: z.string({ required_error: "NID number required" }).optional(),
    dob: z.string({ required_error: "Father name is required" }).optional(),
    workingPlase: z
      .string({ required_error: "Father name is required" })
      .optional(),
    address: z.string({ required_error: "Father name is required" }).optional(),
    mobile: z.string({ required_error: "Father name is required" }).optional(),
  }),
});

export const userValidaton = {
  createEmployee,
  updateEmployee,
};
