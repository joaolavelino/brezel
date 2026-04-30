import { UpdateDefinitionSchema } from "@/app/api/entries/[id]/definitions/[defId]/route";
import { CreateDefinitionSchema } from "@/app/api/entries/[id]/definitions/route";
import { CompleteDefinition } from "@/types/entries";
import z from "zod";

type CreateDefinitionPayload = z.infer<typeof CreateDefinitionSchema>;

type completePayloadType = {
  payload: CreateDefinitionPayload;
  entryId: string;
};

export async function createDefinition(
  payload: completePayloadType,
): Promise<CompleteDefinition> {
  const { payload: formPayload, entryId } = payload;
  const response = await fetch(`/api/entries/${entryId}/definitions`, {
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

type UpdateDefinitionPayload = z.infer<typeof UpdateDefinitionSchema>;

type completeUpdatePayloadType = {
  payload: UpdateDefinitionPayload;
  entryId: string;
  definitionId: string;
};

export async function updateDefinition(
  payload: completeUpdatePayloadType,
): Promise<CompleteDefinition> {
  const { payload: formPayload, entryId, definitionId } = payload;
  const response = await fetch(
    `/api/entries/${entryId}/definitions/${definitionId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formPayload),
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

type completeDeletePayloadType = {
  entryId: string;
  definitionId: string;
};
export async function deleteDefinition(
  payload: completeDeletePayloadType,
): Promise<{ translation: string }> {
  const { entryId, definitionId } = payload;
  const response = await fetch(
    `/api/entries/${entryId}/definitions/${definitionId}`,
    {
      method: "DELETE",
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data.data;
}
