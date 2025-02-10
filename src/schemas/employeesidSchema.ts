import { z } from "zod";

export const employeesIDSchema = z.object({
  empid: z
    .string()
    .min(2, { message: "Employee ID must be at least 2 characters." }),
  empname: z
    .string()
    .min(2, { message: "Employee Name must be at least 2 characters." }),
    emprole: z
    .string()
    .min(2, { message: "Employee Name must be at least 2 characters." }),
  empmobile: z
    .string()
    .min(10, { message: "Employee Mobile No. must be at least 10 digits." }),
  empemergencymobile: z
    .string()
    .min(10, {
      message: "Employee Emergency Mobile No. must be at least 10 digits.",
    }),
  empbloodgroup: z.enum(["A+", "A-", "B-", "O+", "O-", "AB+", "AB-", "B+"], {
    message: "Please select a Blood Group",
  }),
  empimage: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5 MB in bytes
    { message: "Image file size must not exceed 5 MB." }
  ),
  empaddress: z
  .string()
  .min(2, { message: "Employee Name must be at least 2 characters." }),
});

export const updateEmployeeSchema = employeesIDSchema.extend({
  empimage: z.instanceof(File).optional(), // ✅ Image is optional when updating
});