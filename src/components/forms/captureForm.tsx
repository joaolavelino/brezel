import { entryFormLabels } from "@/constants/entries";

import { Entry, Prisma } from "@/generated/prisma/client";
import { EntryForm } from "@/generated/prisma/enums";
import {
  useCreateEntry,
  useGetEntries,
  useUpdateEntry,
} from "@/hooks/Query/useEntries";
import { useDebouncer } from "@/hooks/useDebouncer";
import { normalizeTerm } from "@/lib/normalize-term";
import { CompleteCreateEntryPayload } from "@/services/entries";
import { EntryDetail } from "@/types/entries";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FieldWrapper } from "../FieldWrapper";
import { TagCombobox } from "../TagCombobox";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";

const CreateEntrySchema = z.object({
  term: z.string().min(1, "Este campo não pode ser vazio").trim(),
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

interface CaptureFormProps {
  handleCreateSuccess?: (entry: Entry) => void;
  handleEditSuccess?: () => void;
  entry: EntryDetail | null;
}

export function CaptureForm({
  handleCreateSuccess,
  handleEditSuccess,
  entry = null,
}: CaptureFormProps) {
  const [duplicateEntry, setDuplicateEntry] =
    useState<EntryWithRelations | null>(null);
  const { control, register, handleSubmit, watch, formState } =
    useForm<CaptureFormDataType>({
      resolver: zodResolver(CreateEntrySchema),
      defaultValues: {
        term: entry?.term ?? "",
        notes: entry?.notes ?? "",
        tags: entry?.entryTags.map((et) => et.tag) ?? [],
      },
    });
  const { errors, isSubmitting } = formState;

  const { data: entries = [] } = useGetEntries();
  const { mutate: createEntry, isPending } = useCreateEntry();
  const { mutate: updateEntry } = useUpdateEntry(entry?.id || "");

  const termValue = watch("term");

  const debouncedTerm = useDebouncer(termValue, 1000);

  useEffect(() => {
    if (debouncedTerm.length === 0) return;
    const duplicate = entries.find(
      (el) =>
        el.termNormalized === normalizeTerm(debouncedTerm) &&
        el.id !== entry?.id,
    );

    if (duplicate) {
      setDuplicateEntry(duplicate);
    } else {
      setDuplicateEntry(null);
    }
  }, [debouncedTerm, entries, entry]);

  const onSubmit = (data: CaptureFormDataType) => {
    console.log(data, errors);
    const tagsIds = data.tags.map((tag) => tag.id);

    if (!!entry) {
      const updatePayload: CompleteCreateEntryPayload = {
        entryId: entry.id,
        payload: { ...data, tags: data.tags.map((tag) => tag.id) },
      };
      updateEntry(updatePayload, {
        onError: (error) => {
          const message =
            error.message === "Failed to fetch"
              ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
              : error.message;
          toast.error(message);
        },
        onSuccess: handleEditSuccess,
      });
    } else {
      const createPayload = { ...data, tags: tagsIds };
      createEntry(createPayload, {
        onError: (error) => {
          const message =
            error.message === "Failed to fetch"
              ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
              : error.message;
          toast.error(message);
        },
        onSuccess: handleCreateSuccess,
      });
    }
  };

  return (
    <>
      <motion.form className="w-full" layout onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper
          label="Tags"
          inputId="tags"
          errorMessage={errors?.tags?.message}
        >
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagCombobox
                value={field.value}
                onChange={field.onChange}
                isEdit={!!entry}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper
          inputId="term"
          label="Termo"
          errorMessage={errors.term?.message}
        >
          <Input
            className={`${!entry && "bg-primary-muted"} text-text-fixed-dark`}
            placeholder="O que você quer salvar hoje?"
            {...register("term")}
          />
        </FieldWrapper>
        <FieldWrapper
          inputId="form"
          label="Formato"
          errorMessage={errors.form?.message}
        >
          <Controller
            name="form"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={`w-full ${!entry && "bg-primary-muted"} text-text-fixed-dark`}
                >
                  <SelectValue placeholder="Escolha um formato" />
                </SelectTrigger>
                <SelectContent className="bg-surface-subtle">
                  <SelectGroup>
                    <SelectLabel>Selecione um</SelectLabel>
                    {Object.entries(entryFormLabels).map(([value, label]) => (
                      <SelectItem value={value} key={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </FieldWrapper>
        <FieldWrapper
          inputId="notes"
          label="Anotações"
          errorMessage={errors.notes?.message}
        >
          <Textarea
            placeholder="Conte um pouco mais sobre esse termo..."
            className={`${!entry && "bg-primary-muted"} text-text-fixed-dark min-h-20 w-full`}
            rows={5}
            {...register("notes")}
          />
        </FieldWrapper>
        <Button
          type="submit"
          variant={"secondary"}
          className={`${!entry && "bg-primary-muted"}text-primary w-full rounded-full mt-20`}
          style={{ fontWeight: "bold" }}
          onClick={() => console.log("button is clicked", isPending)}
          disabled={isSubmitting}
        >
          Salvar entrada
        </Button>
      </motion.form>
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
