// create

import { Entry } from "@/generated/prisma/client";
import { CreateLinkSchema } from "@/validation/linksSchemas";
import z from "zod";

type CreateLinkPayloadType = z.infer<typeof CreateLinkSchema>;

type completeLinkPayload = {
  payload: CreateLinkPayloadType;
  entryId: string;
};

export async function createEntryLink(
  payload: completeLinkPayload,
): Promise<{ term1: string; term2: string }> {
  const { entryId, payload: formPayload } = payload;
  const response = await fetch(`/api/entries/${entryId}/link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formPayload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

// delete
export async function deleteEntryLink(
  payload: completeLinkPayload,
): Promise<{ term1: string; term2: string }> {
  const { entryId, payload: deletePayload } = payload;
  const response = await fetch(`/api/entries/${entryId}/link`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deletePayload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data.data;
}
