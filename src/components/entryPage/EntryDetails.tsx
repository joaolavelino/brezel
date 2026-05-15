"use client";

import { useDeleteEntry, useGetEntry } from "@/hooks/Query/useEntries";
import {
  AlertTriangle,
  ArrowRight,
  Link,
  MoreHorizontal,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Chip } from "../Chip";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DefinitionList } from "./DefinitionList";
import { LinksList } from "./LinksList";
import { useState } from "react";
import { ResponsiveDialog } from "../ResponsiveDialog";
import { CaptureForm } from "../forms/captureForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { toast } from "sonner";

interface EntryDetailsProps {
  id: string;
}

export const EntryDetails = ({ id }: EntryDetailsProps) => {
  const { data: entry, isLoading, isError } = useGetEntry(id);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const { mutate: deleteEntry } = useDeleteEntry();
  const router = useRouter();

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !entry) return <p>Entrada não encontrada.</p>;

  const handleDeleteEntry = (entryId: string) => {
    deleteEntry(entryId, {
      onSuccess: (data) => {
        toast.success(`A entrada "${data.term}" foi deletada`, {
          description: "Acesse o menu superior caso gostaria de restaurá-la",
        });
        router.push("/");
      },
    });
  };

  return (
    <div className="p-4 overflow-scroll">
      <div className="flex gap-2 relative">
        <div className="absolute top-[-8px] right-0">
          <Button
            size={"icon-lg"}
            variant={"ghost"}
            onClick={() => setIsConfirmDelete(true)}
          >
            <Trash />
          </Button>
          <Button
            size={"icon-lg"}
            variant={"ghost"}
            onClick={() => setIsEditOpen(true)}
          >
            <Pen />
          </Button>
        </div>
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

      <Sheet open={isConfirmDelete} onOpenChange={setIsConfirmDelete}>
        <SheetContent
          side="bottom"
          className="rounded-md m-2 bg-surface-subtle p-2 "
        >
          <SheetHeader>
            <SheetTitle className="flex flex-col gap-2 items-center text-lg font-semibold w-full ">
              <div className="p-3 bg-warning/20 rounded-full">
                <AlertTriangle size={20} className="text-warning" />
              </div>
              Deletar entrada?
            </SheetTitle>
            <SheetDescription>
              Você gostaria realmente de deletar esta entrada? Entradas podem
              ser restauradas utilizado o menu superior.
            </SheetDescription>
          </SheetHeader>

          <SheetFooter>
            <Button type="button" onClick={() => handleDeleteEntry(entry.id)}>
              Deletar entrada
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ResponsiveDialog
        onOpenChange={() => setIsEditOpen(false)}
        open={isEditOpen}
        title="Editar entrada"
        description="Edite as informações da entrada"
      >
        <CaptureForm
          handleEditSuccess={() => setIsEditOpen(false)}
          entry={entry}
        />
      </ResponsiveDialog>
    </div>
  );
};
