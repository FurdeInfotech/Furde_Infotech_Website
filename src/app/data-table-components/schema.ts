import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const EmployeeID = z.object({
    empid: z
    .string()
    .min(2, { message: "Employee ID must be at least 2 characters." }),
  empname: z
    .string()
    .min(2, { message: "Employee Name must be at least 2 characters." }),
  empmobile: z
    .number()
    .min(10, { message: "Employee Mobile No. must be at least 10 digits." }),
  empemergencymobile: z
    .number()
    .min(10, {
      message: "Employee Emergency Mobile No. must be at least 10 digits.",
    }),
  empbloodgroup: z.enum(["A+", "A-", "B-", "O+", "O-", "AB+", "AB-", "B+"], {
    message: "Please select a Blood Group",
  }),
  empimage: z.string(),
  empaddress: z.string(),
  emprole: z.string(),
});

export type Expense = z.infer<typeof EmployeeID>;