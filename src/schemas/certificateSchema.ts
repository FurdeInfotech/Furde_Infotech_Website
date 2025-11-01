import { z } from "zod";

export const certificateSchema = z.object({
  employeeName: z.string().min(1, "Employee name is required"),
  certificateType: z.enum([
    "Internship",
    "Appreciation",
    "Game Changer",
    "Excellence",
    "Achievement",
    "Excellence in Performance",
    "Dedication",
    "Team Work",
    "Employee of the Month",
    "Employee of the Year",
    "Outstanding Performance",
    "Leadership Excellence",
    "Strategic Achievement",
    "Excellence in Management",
    "Inspirational Leadership",
    "Team Excellence",
    "Innovation"
  ], {
    required_error: "Certificate type is required",
  }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dateAwarded: z.string().min(1, "Date awarded is required"),
});
