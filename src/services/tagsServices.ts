import { Tag } from "@/generated/prisma/client";

export async function getTags(): Promise<Tag[]> {
  const response = await fetch("/api/tags");
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
}
