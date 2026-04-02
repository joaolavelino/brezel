import { CreateEntrySchema } from "@/app/api/entries/route";
import z from "zod";

export async function getEntries() {
  const response = await fetch("/api/entries");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
}

type CreateEntryPayload = z.infer<typeof CreateEntrySchema>;

export async function createEntry(payload: CreateEntryPayload) {
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
