"use client";

import { useGetEntry } from "@/hooks/Query/useEntries";
import { ArrowRight, Link, MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chip } from "../Chip";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DefinitionList } from "./DefinitionList";
import { LinksList } from "./LinksList";
import { useState } from "react";

interface EntryDetailsProps {
  id: string;
}

export const EntryDetails = ({ id }: EntryDetailsProps) => {
  const { data: entry, isLoading, isError } = useGetEntry(id);

  const router = useRouter();

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !entry) return <p>Entrada não encontrada.</p>;

  return (
    <div className="p-4 max-h-164  overflow-scroll">
      <div className="flex gap-2">
        {entry.entryTags.map((tag) => (
          <Chip
            name={tag.tag.name}
            key={tag.tagId}
            color={tag.tag.color ?? undefined}
          />
        ))}
      </div>
      <h2 className="text-4xl italic font-semibold text-secondary">
        {entry.term}
      </h2>
      <p>{entry.notes}</p>

      <DefinitionList entry={entry} />

      <LinksList entryId={entry.id} />
    </div>
  );
};
