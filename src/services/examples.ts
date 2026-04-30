//create

import { UpdateExampleSchema } from "@/app/api/entries/[id]/definitions/[defId]/examples/[exId]/route";
import { CreateExampleSchema } from "@/app/api/entries/[id]/definitions/[defId]/examples/route";
import { Example } from "@/generated/prisma/client";
import z from "zod";

type CreateExampleFormPayloadType = z.infer<typeof CreateExampleSchema>;
type CompleteCreatePayloadType = {
  payload: CreateExampleFormPayloadType;
  entryId: string;
  definitionId: string;
};

export async function createExample(
  payload: CompleteCreatePayloadType,
): Promise<Example> {
  const { payload: formPayload, entryId, definitionId } = payload;
  const response = await fetch(
    `/api/entries/${entryId}/definitions/${definitionId}/examples`,
    {
      method: "POST",
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
//update

type UpdateExampleFormPayloadType = z.infer<typeof UpdateExampleSchema>;
type CompleteUpdatePayloadType = {
  payload: UpdateExampleFormPayloadType;
  entryId: string;
  definitionId: string;
  exampleId: string;
};

export async function updateExample(
  payload: CompleteUpdatePayloadType,
): Promise<Example> {
  const { payload: formPayload, entryId, definitionId, exampleId } = payload;
  const response = await fetch(
    `/api/entries/${entryId}/definitions/${definitionId}/examples/${exampleId}`,
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

//delete

type CompleteDeletePayloadType = {
  entryId: string;
  definitionId: string;
  exampleId: string;
};

export async function deleteExample(
  payload: CompleteDeletePayloadType,
): Promise<Example> {
  const { entryId, definitionId, exampleId } = payload;
  const response = await fetch(
    `/api/entries/${entryId}/definitions/${definitionId}/examples/${exampleId}`,
    {
      method: "DELETE",
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}
