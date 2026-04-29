"use client";

import { useGetEntry } from "@/hooks/Query/useEntries";
import {
  FADE_SIDEWAYS_VARIANTS,
  STAGGER_LIST_VARIANTS,
} from "@/lib/animations";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Link,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Chip } from "../Chip";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DefinitionCard } from "./DefinitionCard";

interface EntryDetailsProps {
  id: string;
}

export const EntryDetails = ({ id }: EntryDetailsProps) => {
  const { data: entry, isLoading, isError } = useGetEntry(id);
  const [isDefinitionListOpen, setIsDefinitionListOpen] = useState(false);

  const router = useRouter();

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !entry) return <p>Entrada não encontrada.</p>;

  const singleDefinition =
    entry.primaryDefinitionId !== null
      ? entry.definitions.filter((el) => el.id === entry.primaryDefinitionId)[0]
      : entry.definitions[0];

  const definitionDisplayList = isDefinitionListOpen
    ? entry.definitions
    : [singleDefinition];

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

      <section className="mt-4">
        <header className="flex justify-between items-center">
          <h3 className="flex gap-1 text-primary font-bold items-center">
            <Lightbulb size={16} />
            Definitions
          </h3>
          <div className="space-x-4">
            <Button size={"icon-sm"} className="rounded-full">
              <Plus />
            </Button>
            {entry.definitions.length > 1 && (
              <Button
                size={"icon-sm"}
                className="rounded-full"
                variant={"ghost"}
                onClick={() => setIsDefinitionListOpen((state) => !state)}
              >
                <ChevronDown
                  className={`${!isDefinitionListOpen && "rotate-180"} transition-transform `}
                />
              </Button>
            )}
          </div>
        </header>
        <motion.div layout className="space-y-2 mt-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={isDefinitionListOpen ? "full-list" : "single-item"} // Chaves diferentes forçam a re-animação
              variants={STAGGER_LIST_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              {definitionDisplayList.map((def, index) => (
                <motion.div
                  key={def.id}
                  variants={FADE_SIDEWAYS_VARIANTS}
                  layout // O layout prop suaviza a mudança de posição dos outros cards
                >
                  <DefinitionCard
                    key={def.id}
                    definition={def}
                    isPrimary={def.id === entry.primaryDefinitionId}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>
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
