"use client";

import { displayArticle, partOfSpeech } from "@/constants/definitions";
import { CompleteDefinition, EntryDetail } from "@/types/entries";
import { Button } from "../ui/button";
import { useState } from "react";
import { Card } from "../ui/card";
import { Loader, Trash, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteDefinition } from "@/hooks/Query/useDefinitions";
import { toast } from "sonner";

interface DefinitionDisplayCardProps {
  definition: CompleteDefinition;
  entry: EntryDetail;
  openEditionForm: () => void;
  onDeletionSuccess: () => void;
}

export const DefinitionDisplayCard = ({
  definition,
  entry,
  openEditionForm,
  onDeletionSuccess,
}: DefinitionDisplayCardProps) => {
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const { mutate: deleteDefinition, isPending } = useDeleteDefinition(entry.id);

  const handleDeletion = () => {
    if (!isConfirmDelete) {
      setIsConfirmDelete(true);
      return;
    }
    deleteDefinition(
      { definitionId: definition.id, entryId: entry.id },
      {
        onError: (error) => {
          const message =
            error.message === "Failed to fetch"
              ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
              : error.message;
          toast.error(message);
        },
        onSuccess: (data) => {
          toast.success(
            `A definição '${data.translation}' foi excluída com suceso`,
          );
          setIsConfirmDelete(false); // Resetar o estado após deletar
          onDeletionSuccess();
        },
      },
    );
  };

  const displayTerm = definition?.termOverride
    ? definition.termOverride
    : entry.term;

  return (
    // Adicionamos 'layout' e mudamos para motion.div (Card do shadcn é uma div)
    // O transition spring deixa a mudança de tamanho do card orgânica
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className={`p-4 transition-colors duration-300 ${
          isConfirmDelete ? "ring-destructive bg-destructive/5" : ""
        }`}
      >
        <div className="space-y-2">
          {/* Cabeçalho do termo (pode ter layout prop se o tamanho mudar muito) */}
          <motion.div layout="position">
            <h2 className="text-xl font-bold text-secondary flex items-center gap-1.5">
              {!!definition.nounArticle && (
                <span className="text-muted-foreground font-medium text-lg">
                  {displayArticle[definition.nounArticle]}
                </span>
              )}
              {displayTerm}
            </h2>
            <p className="leading-1 italic text-xs text-muted-foreground">
              {partOfSpeech[definition.partOfSpeech]}
            </p>
          </motion.div>

          {/* Definição e Notas */}
          <motion.div layout="position">
            <p className="text-lg font-semibold leading-tight">
              {definition.translation}
            </p>
            {definition.notes && (
              <p className="text-sm italic leading-tight text-muted-foreground mt-1">
                {definition.notes}
              </p>
            )}
          </motion.div>

          <div className="flex gap-4 mt-4 h-10">
            {" "}
            {/* Altura fixa ajuda a evitar saltos verticais */}
            <AnimatePresence mode="popLayout" initial={false}>
              {!isConfirmDelete ? (
                // ESTADO INICIAL
                <motion.div
                  key="normal-state"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <Button
                    onClick={openEditionForm}
                    className="w-full rounded-full"
                  >
                    Editar definição
                  </Button>
                </motion.div>
              ) : (
                // ESTADO DE CONFIRMAÇÃO
                <motion.div
                  key="confirm-state"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex flex-1 gap-2"
                >
                  <Button
                    variant={"outline"}
                    className=" rounded-full"
                    onClick={() => setIsConfirmDelete(false)}
                  >
                    <X />
                  </Button>
                  <Button
                    variant={"destructive"}
                    className="flex-2 rounded-full gap-2 whitespace-nowrap"
                    onClick={handleDeletion}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Loader className="animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                    Confirmar exclusão
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            {/* BOTÃO DE LIXEIRA (Sempre visível ou apenas o ícone inicial) */}
            {!isConfirmDelete && (
              <Button
                variant={"destructive"}
                className="rounded-full"
                size="icon"
                onClick={handleDeletion}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
