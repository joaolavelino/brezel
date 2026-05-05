import z from "zod";

export const CreateLinkSchema = z.object({
  targetId: z.cuid(),
});
