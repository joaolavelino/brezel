import { useGetEntries } from "@/hooks/Query/useEntries";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lamp, Lightbulb, Link, Pencil, Plus, Star, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { DefinitionCard } from "./DefinitionCard";

interface CaptureConfirmProps {
  entryId: string;
  handleClose: () => void;
}

export const CaptureConfirm = ({
  entryId,
  handleClose,
}: CaptureConfirmProps) => {
  const { data: entries = [] } = useGetEntries();

  const entry = useMemo(() => {
    if (!entryId) return undefined;
    const foundEntry = entries.find((el) => el.id === entryId);
    if (!foundEntry) {
      handleClose();
    }

    return foundEntry;
  }, [entryId, entries, handleClose]);

  if (!entry) {
    handleClose();
    return null;
  }

  //AFTER HERE I DON'T WANT TO NEED TO ALWAYS CHECK THAT THERE'S NO ENTRY... AND SINCE ENTRY.DEFINITIONS IS ALWAYS AN ARRAY, THAT THE FILTERED DEFINITIONS ARE NEVER UNDEFINED

  const links = entry
    ? [
        ...entry?.linksAsA.map((link) => link.bEntry),
        ...entry?.linksAsB.map((link) => link.aEntry),
      ]
    : [];

  return (
    <div className="w-full">
      <header className="flex flex-col items-start">
        <div className="mb-1 flex ">
          {entry?.entryTags?.map((tag) => (
            <p
              key={tag.tagId}
              className="text-xs uppercase text-primary bg-text-fixed-light py-0.5 px-1 font-semibold"
            >
              {tag.tag.name}
            </p>
          ))}
        </div>
        <h2 className="text-4xl font-bold">{entry?.term}</h2>
        <p className="text-xl font-bold">foi salvo na sua biblioteca!</p>
        <p className="text-left text-xs">
          Voce pode adicionar novas informações a ela, como definições ou
          ligá-la a outras entradas
        </p>
      </header>

      <motion.div
        layout
        className="flex flex-col my-8   justify-start w-full gap-6 "
      >
        {/* Definitions */}
        <DefinitionCard entry={entry} />
        {/* Links */}
        <motion.div className="bg-primary-muted rounded-md p-4 w-full flex-1">
          <div className="flex gap-2 items-center text-primary ">
            <div className="flex flex-1">
              <Link size={20} />
              <h3 className="font-semibold">Links ({links.length})</h3>
            </div>
            {entry && links?.length > 0 && (
              <Button size={"icon"} className="rounded-full bg-secondary">
                <Plus />
              </Button>
            )}
          </div>
          {links.length === 0 ? (
            <div className="text-text-fixed-dark space-y-2 mt-2">
              <p className="text-sm">Ainda não há links salvos nesta entrada</p>
              <Button className="rounded-full w-full bg-secondary">
                Criar primeiro link
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {links?.map((link) => (
                <div
                  key={link?.id}
                  className="w-full flex border-l-2 border-secondary pl-2 space-y-0"
                >
                  <div className="flex flex-col items-start">
                    <p className="text-xs text-primary capitalize">
                      {link?.term}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
