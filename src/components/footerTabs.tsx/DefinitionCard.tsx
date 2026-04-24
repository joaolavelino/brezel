import { EntryListItem } from "@/types/entries";
import { Lightbulb, Plus, Star, StarHalf, StarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface DefinitionCardProps {
  entry: EntryListItem;
}

export const DefinitionCard = ({ entry }: DefinitionCardProps) => {
  return (
    <motion.div
      layout
      className="bg-primary-muted rounded-md p-4 w-full flex-1"
    >
      <div className="flex gap-2 items-center text-primary ">
        <div className="flex flex-2">
          <Lightbulb size={20} />
          <h3 className="font-semibold">
            Definições ({entry?.definitions?.length})
          </h3>
        </div>
        {entry && entry?.definitions?.length > 0 && (
          <Button size={"icon"} className="rounded-full bg-secondary">
            <Plus />
          </Button>
        )}
      </div>
      <div className="max-h-[275px] overflow-y-scroll">
        {entry?.definitions.length === 0 ? (
          <div className="text-text-fixed-dark space-y-2 mt-2">
            <p className="text-sm">
              Ainda não há definições salvas nesta entrada
            </p>
            <Button className="rounded-full w-full bg-secondary">
              Criar primeira entrada
            </Button>
          </div>
        ) : (
          <div className="space-y-2 ">
            {entry.definitions.map((definition) => (
              <div
                key={definition.id}
                className="w-full flex border-l-2 border-secondary pl-2 space-y-0"
              >
                <div className="flex flex-col items-start">
                  <div>
                    <p className="text-xs text-primary">
                      {definition.partOfSpeech}
                    </p>
                  </div>
                  <p className="text-text-fixed-dark text-sm">
                    {definition.translation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
