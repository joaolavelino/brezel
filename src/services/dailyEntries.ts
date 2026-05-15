import { GreetingEntry } from "@/data/greetings";
import { Entry } from "@/generated/prisma/client";

export async function saveDailyEntry(entry: GreetingEntry): Promise<Entry> {
  const response = await fetch("/api/daily-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(entry),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data.data;
}
