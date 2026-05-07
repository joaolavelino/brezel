import { Entry } from "@/generated/prisma/client";
import { EntryDetail, EntryListItem } from "@/types/entries";
import { CreateEntrySchema, EditEntrySchema } from "@/validation/entrySchemas";
import z from "zod";

export async function getEntries(): Promise<EntryListItem[]> {
  const response = await fetch("/api/entries");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
}

type CreateEntryPayload = z.infer<typeof CreateEntrySchema>;

export async function createEntry(payload: CreateEntryPayload): Promise<Entry> {
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

export async function getEntry(id: string): Promise<EntryDetail> {
  const response = await fetch(`/api/entries/${id}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

export async function setPrimaryDefinition(payload: {
  entryId: string;
  definitionId: string;
}): Promise<Entry> {
  const response = await fetch(`/api/entries/${payload.entryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ primaryDefinitionId: payload.definitionId }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

type EditEntryPayload = z.infer<typeof EditEntrySchema>;
export type CompleteCreateEntryPayload = {
  entryId: string;
  payload: EditEntryPayload;
};

export async function updateEntry(
  payload: CompleteCreateEntryPayload,
): Promise<Entry> {
  const { entryId, payload: formPayload } = payload;
  const response = await fetch(`/api/entries/${entryId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formPayload),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

export async function deleteEntry(
  id: string,
): Promise<{ id: string; term: string }> {
  const response = await fetch(`/api/entries/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}

export async function restoreEntry(
  entryId: string,
): Promise<{ id: string; term: string }> {
  const response = await fetch(`/api/entries/${entryId}/restore`, {
    method: "PATCH",
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}
