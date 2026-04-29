"use client";

import { Definition } from "@/generated/prisma/client";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { MoreHorizontal, Star } from "lucide-react";
import { CompleteDefinition } from "@/types/entries";
import { useState } from "react";
import { Button } from "../ui/button";

interface DefinitionCardProps {
  definition: CompleteDefinition;
  isPrimary?: boolean;
  onClick: () => void;
}

export const DefinitionCard = ({
  definition,
  isPrimary = false,
  onClick,
}: DefinitionCardProps) => {
  return (
    <Card className="p-4 relative gap-2" onClick={onClick}>
      <div className="flex gap-2 items-center absolute top-4 right-4 ">
        <Button variant={"ghost"} aria-label="Ver mais e editar">
          <MoreHorizontal />
        </Button>
        {isPrimary && <Star className="w-4 fill-secondary text-transparent" />}
      </div>
      <CardHeader className="px-0">
        <CardTitle className="flex flex-col gap-0 font-bold text-lg leading-tight">
          <span className="text-xs font-light leading-tights">
            {definition.partOfSpeech}
          </span>
          {definition.translation}
          <span className="text-xs font-light italic">{definition.notes}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <h4 className="font-bold text-primary text-xs">Exemplos</h4>
        <div className="space-y-2">
          {definition.examples.map((example) => (
            <div key={example.id} className="">
              <p className="font-semibold">{example.text}</p>
              <p className="text-xs italic">{example.notes}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
