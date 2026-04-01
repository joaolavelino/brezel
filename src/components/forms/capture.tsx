import { FieldWrapper } from "../FieldWrapper";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { EntryForm } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagCombobox } from "../TagCombobox";
import { useEffect, useState } from "react";
import { useDebouncer } from "@/hooks/useDebouncer";
import { entriesMock } from "@/data/_mock-data/entries";
import { Entry, Prisma } from "@/generated/prisma/client";
import { normalizeTerm } from "@/lib/normalize-term";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

const CreateEntrySchema = z.object({
  term: z.string().min(1).trim(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.any()),
});

type CaptureFormDataType = z.infer<typeof CreateEntrySchema>;

type EntryWithRelations = Prisma.EntryGetPayload<{
  include: {
    primaryDefinition: true;
    entryTags: {
      include: { tag: true };
    };
  };
}>;

export function CaptureForm() {
  const [duplicateEntry, setDuplicateEntry] =
    useState<EntryWithRelations | null>(null);
  const { control, register, handleSubmit, watch, formState } =
    useForm<CaptureFormDataType>({
      resolver: zodResolver(CreateEntrySchema),
      defaultValues: {
        term: "",
        notes: "",
        tags: [],
      },
    });
  const { errors, isSubmitting } = formState;

  const entries: EntryWithRelations[] = entriesMock;

  const termValue = watch("term");

  const debouncedTerm = useDebouncer(termValue, 1000);

  useEffect(() => {
    if (debouncedTerm.length === 0) return;
    const duplicate = entries.find(
      (el) =>
        el.termNormalized === normalizeTerm(debouncedTerm) ||
        el.term === normalizeTerm(debouncedTerm),
    );

    if (duplicate) {
      setDuplicateEntry(duplicate);
    } else {
      setDuplicateEntry(null);
    }
  }, [debouncedTerm, entries]);

  return (
    <>
      <form className="w-full">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagCombobox
              value={field.value}
              onChange={field.onChange}
              errorMessage={errors.tags?.message}
            />
          )}
        />

        <FieldWrapper
          inputId="term"
          label="Termo"
          errorMessage={errors.term?.message}
        >
          <Input
            {...register("term")}
            placeholder="O que você quer salvar hoje?"
            className="bg-primary-muted text-text-fixed-dark"
          />
        </FieldWrapper>
        <FieldWrapper
          inputId="term"
          label="Termo"
          errorMessage="selecione apenas uma"
        >
          <Input />
        </FieldWrapper>
      </form>
      <Sheet
        open={!!duplicateEntry}
        onOpenChange={() => setDuplicateEntry(null)}
      >
        <SheetContent
          side="bottom"
          className="rounded-md m-2 bg-surface-subtle p-2 "
        >
          <SheetHeader>
            <SheetTitle className="flex flex-col gap-2 items-center text-lg font-semibold w-full ">
              <div className="p-3 bg-warning/20 rounded-full">
                <AlertTriangle size={20} className="text-warning" />
              </div>
              Entrada duplicada!
            </SheetTitle>
            <SheetDescription>
              O termo {duplicateEntry?.term} já está salvo na sua biblioteca!
            </SheetDescription>
          </SheetHeader>
          <div className="mx-4 p-4 rounded-md bg-primary-muted border-2 ">
            <p className="text-xl font-semibold text-secondary capitalize">
              {duplicateEntry?.term}
            </p>
            <p className="text-xs italic">Definição principal:</p>
            <p>
              <strong>{duplicateEntry?.primaryDefinition?.translation}</strong>
            </p>
          </div>
          <SheetFooter>
            <Button
              type="button"
              onClick={() => console.log(duplicateEntry?.term)}
            >
              {`Ir para "${duplicateEntry?.term}"`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
