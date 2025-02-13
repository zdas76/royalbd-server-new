import { z } from "zod";

const createEmployee = z.object({
  password: z.string({ required_error: "Password is required" }),
  employee: z.object({
    userName: z.string({ required_error: "Name is  required" }),
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required" }),
    fatherName: z.string({ required_error: "Father name is required" }),
    motherName: z.string({ required_error: "Father name is required" }),
    workingPlase: z.string({ required_error: "Father name is required" }),
    address: z.string({ required_error: "Father name is required" }),
    mobile: z.string({ required_error: "Father name is required" }),
  }),
});

const createAdmin = z.object({
  password: z.string({ required_error: "Password is required" }),
  employee: z.object({
    userName: z.string({ required_error: "Name is  required" }),
    email: z.string({ required_error: "Email is required" }),
    name: z.string({ required_error: "Name is required" }),
    fatherName: z.string({ required_error: "Father name is required" }),
    motherName: z.string({ required_error: "Father name is required" }),
    photo: z.string({ required_error: "Father name is required" }),
    address: z.string({ required_error: "Father name is required" }),
    mobile: z.string({ required_error: "Father name is required" }),
  }),
});

export const userValidaton = {
  createEmployee,
  createAdmin,
};
