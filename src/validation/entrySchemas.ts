import { EntryForm } from "@/generated/prisma/enums";
import z from "zod";

export const EditEntrySchema = z.object({
  term: z.string().min(1).trim().optional(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.string()).optional(),
  primaryDefinitionId: z.string().optional(),
});

export const CreateEntrySchema = z.object({
  term: z.string().min(1).trim(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.string()).optional().default([]),
});
