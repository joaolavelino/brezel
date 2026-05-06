"use client";
import { Entry, EntryLink, Example } from "@/generated/prisma/client";
import { useDeleteExample } from "@/hooks/Query/useExamples";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader, Minus, Plus, Trash, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useDeleteLink } from "@/hooks/Query/useLinks";
import { useGetEntries } from "@/hooks/Query/useEntries";
import { useRouter } from "next/navigation";
import { EntryListItem } from "@/types/entries";

interface LinkCardProps {
  linkedEntry: Entry;
  entryId: string;
}

export const LinkCard = ({ entryId, linkedEntry }: LinkCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const router = useRouter();

  console.log(linkedEntry.id);

  const { mutate: deleteLink, isPending: isDeletePending } =
    useDeleteLink(entryId);

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
    deleteLink(
      { entryId: entryId, payload: { targetId: linkedEntry.id } },
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
            `Os termos '${data.term1}' e ${data.term2} não estão mais conectados`,
          );
          setIsConfirmDelete(false); // Resetar o estado após deletar
        },
      },
    );
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{
          opacity: 0,
          scale: 0.9,
          x: 20,
          transition: { duration: 0.2 },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card key={linkedEntry.id} className="gap-0 px-4 py-2">
          <CardHeader className="p-0 flex justify-between items-center">
            <CardTitle className="leading-4">{linkedEntry.term}</CardTitle>
            <div className="flex gap-2">
              {!isConfirmDelete && (
                <Button
                  variant={"ghost"}
                  className="rounded-full text-destructive"
                  size="icon"
                  onClick={() => setIsConfirmDelete(true)}
                >
                  <Trash size={16} />
                </Button>
              )}
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => router.push(`/entries/${linkedEntry.id}`)}
              >
                <ArrowRight />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <AnimatePresence>
              {isConfirmDelete && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-4 mt-0 h-10">
                    <AnimatePresence mode="popLayout" initial={false}>
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
                          disabled={isDeletePending}
                        >
                          {isDeletePending ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <Trash size={16} />
                          )}{" "}
                          Confirmar exclusão
                        </Button>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
