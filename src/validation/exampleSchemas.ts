import z from "zod";

export const CreateExampleSchema = z.object({
  text: z.string().min(1).trim(),
  notes: z.string().min(1).trim().optional(),
});

export const UpdateExampleSchema = z.object({
  text: z.string().min(1).trim().optional(),
  notes: z.string().min(1).trim().nullable().optional(),
});
