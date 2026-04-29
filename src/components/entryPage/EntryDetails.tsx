"use client";

import { useGetEntry } from "@/hooks/Query/useEntries";
import { ArrowRight, Link, MoreHorizontal, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chip } from "../Chip";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DefinitionList } from "./DefinitionList";

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
      <section className="mt-4">
        <header className="flex justify-between items-center">
          <h3 className="flex gap-1 items-center text-primary font-bold">
            <Link size={16} />
            Links
          </h3>

          <Button size={"icon-sm"} className="rounded-full">
            <Plus />
          </Button>
        </header>
        <div className="space-y-2 mt-2">
          {entry.links.map((link) => (
            <Card key={link.id} className="p-4 py-1">
              <CardHeader className="p-0 flex">
                <CardTitle className="flex w-full justify-between items-center">
                  {link.term}
                  <div>
                    <Button variant={"link"} aria-label="Ver mais">
                      <MoreHorizontal />
                    </Button>
                    <Button
                      variant={"link"}
                      aria-label={`Ir para a entrada ${entry.term}`}
                      onClick={() => router.push(`/entries/${link.id}`)}
                    >
                      <ArrowRight />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
