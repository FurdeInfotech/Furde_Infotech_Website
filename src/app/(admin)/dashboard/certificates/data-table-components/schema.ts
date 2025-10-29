import { z } from "zod";

export const certificateSchema = z.object({
  _id: z.string(),
  employeeName: z.string(),
  certificateType: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dateAwarded: z.string(),
  createdAt: z.string(),
});

export type Certificate = z.infer<typeof certificateSchema>;
