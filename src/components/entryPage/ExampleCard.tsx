"use client";
import { Example } from "@/generated/prisma/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader, Minus, MoreHorizontal, Plus, Trash, X } from "lucide-react";
import { Button } from "../ui/button";
import { deleteExample } from "@/services/examples";
import { useDeleteExample } from "@/hooks/Query/useExamples";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface ExampleCardProps {
  example: Example;
  handleOpenEditForm: (example: Example) => void;
  definitionId: string;
  entryId: string;
  onDeletionSuccess: () => void;
}

export const ExampleCard = ({
  entryId,
  definitionId,
  example,
  handleOpenEditForm,
  onDeletionSuccess,
}: ExampleCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const { mutate: deleteExample, isPending } = useDeleteExample(entryId);

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setIsConfirmDelete(false);
      return;
    }
    setIsExpanded(true);
  };

  const handleDeletion = () => {
    if (!isConfirmDelete) {
      setIsConfirmDelete(true);
      return;
    }
    deleteExample(
      { definitionId: definitionId, entryId: entryId, exampleId: example.id },
      {
        onError: (error) => {
          const message =
            error.message === "Failed to fetch"
              ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
              : error.message;
          toast.error(message);
        },
        onSuccess: (data) => {
          toast.success(`O exemplo '${data.text}' foi excluída com suceso`);
          setIsConfirmDelete(false); // Resetar o estado após deletar
          onDeletionSuccess();
        },
      },
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card key={example.id} className="gap-2 p-4 pr-8 relative">
        <Button
          variant={"ghost"}
          size={"icon-lg"}
          className="absolute right-1 top-1"
          onClick={handleToggleExpand}
        >
          {isExpanded ? <Minus /> : <Plus />}
        </Button>

        <CardHeader className="p-0">
          <CardTitle className="leading-4">{example.text}</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {example.notes && <p className="text-xs italic">{example.notes}</p>}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex gap-4 mt-4 h-10">
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
                          onClick={() => handleOpenEditForm(example)}
                          className="w-full rounded-full"
                        >
                          Editar exemplo
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
                          )}{" "}
                          Confirmar exclusão
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
