"use client";
import {
  FADE_SIDEWAYS_VARIANTS,
  STAGGER_LIST_VARIANTS,
} from "@/lib/animations";
import { CompleteDefinition, EntryDetail } from "@/types/entries";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lightbulb, Plus } from "lucide-react";
import { useState } from "react";
import { DefinitionCard } from "./DefinitionCard";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../ResponsiveDialog";
import { DefinitionDrawerContent } from "./DefinitionDrawerContent";

interface DefinitionListProps {
  entry: EntryDetail;
}

export const DefinitionList = ({ entry }: DefinitionListProps) => {
  const [isDefinitionListOpen, setIsDefinitionListOpen] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] =
    useState<null | CompleteDefinition>(null);

  const handleOpenCreate = () => {
    setIsDrawerOpen(true);
    setSelectedDefinition(null);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedDefinition(null);
  };

  const handleShowDefinition = (def: CompleteDefinition) => {
    setIsDrawerOpen(true);
    setSelectedDefinition(def);
  };

  const singleDefinition =
    entry.primaryDefinitionId !== null
      ? entry.definitions.filter((el) => el.id === entry.primaryDefinitionId)[0]
      : entry.definitions[0];

  const definitionDisplayList = isDefinitionListOpen
    ? entry.definitions
    : [singleDefinition];
  return (
    <>
      <section className="mt-4">
        <header className="flex justify-between items-center">
          <h3 className="flex gap-1 text-primary font-bold items-center">
            <Lightbulb size={16} />
            Definitions
          </h3>
          <div className="space-x-4">
            <Button
              size={"icon-sm"}
              className="rounded-full"
              onClick={handleOpenCreate}
            >
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
              {definitionDisplayList.map((def) => (
                <motion.div
                  key={def.id}
                  variants={FADE_SIDEWAYS_VARIANTS}
                  layout // O layout prop suaviza a mudança de posição dos outros cards
                >
                  <DefinitionCard
                    key={def.id}
                    definition={def}
                    isPrimary={def.id === entry.primaryDefinitionId}
                    onClick={() => handleShowDefinition(def)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>
      <ResponsiveDialog
        onOpenChange={setIsDrawerOpen}
        open={isDrawerOpen}
        title={`${!!selectedDefinition ? "Ver definição" : "Criar definição"}`}
      >
        <p>{!!selectedDefinition ? "Ver definição" : "Criar definição"}</p>
        <DefinitionDrawerContent
          entry={entry}
          definition={selectedDefinition}
        />
      </ResponsiveDialog>
    </>
  );
};
