import { nounArticle, partOfSpeech } from "@/constants/definitions";
import { Definition, Entry } from "@/generated/prisma/client";
import { NounArticle, PartOfSpeech } from "@/generated/prisma/enums";
import { useCreateEntry, useGetEntries } from "@/hooks/Query/useEntries";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FieldWrapper } from "../FieldWrapper";
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
import { Textarea } from "../ui/textarea";
import { CompleteDefinition } from "@/types/entries";
import {
  useCreateDefinition,
  useUpdateDefinition,
} from "@/hooks/Query/useDefinitions";
import { toast } from "sonner";

const DefinitionSchema = z
  .object({
    termOverride: z.string().optional(),
    translation: z.string().min(1, "Este campo não pode ser vazio").trim(),
    notes: z.string().optional(),
    partOfSpeech: z.enum(PartOfSpeech).optional(),
    nounArticle: z.enum(NounArticle).optional(),
  })
  .refine(
    (data) => {
      // Se for "noun", o nounArticle não pode ser vazio/undefined
      if (data.partOfSpeech === "noun") {
        return !!data.nounArticle;
      }
      return true;
    },
    {
      message: "O artigo é obrigatório para substantivos (nouns)",
      path: ["nounArticle"], // Isso faz o erro aparecer no campo específico do formulário
    },
  );

type DefinitionFormType = z.infer<typeof DefinitionSchema>;

interface DefinitionFormProps {
  entryId: string;
  handleSuccess: (definition: CompleteDefinition) => void;
  definition?: Definition | null;
  onClose: () => void;
  drawerClose: () => void;
}

export function DefinitionForm({
  entryId,
  handleSuccess,
  definition,
  onClose,
  drawerClose,
}: DefinitionFormProps) {
  const { control, register, handleSubmit, watch, formState } =
    useForm<DefinitionFormType>({
      resolver: zodResolver(DefinitionSchema),
      defaultValues: {
        termOverride: definition?.termOverride ?? "",
        notes: definition?.notes ?? "",
        translation: definition?.translation ?? "",
        partOfSpeech: definition?.partOfSpeech ?? "other",
        nounArticle: definition?.nounArticle ?? "unknown",
      },
    });
  const { errors, isSubmitting } = formState;

  const partOfSpeechFormValue = watch("partOfSpeech");

  const isNoun = partOfSpeechFormValue === "noun";

  const { mutate: createDefinition, isPending: isCreatePending } =
    useCreateDefinition(entryId);
  const { mutate: updateDefinition, isPending: isUpdatePending } =
    useUpdateDefinition(entryId);

  const onSubmit = (data: DefinitionFormType) => {
    console.log(data, errors);

    const payload = {
      ...data,
      termOverride: data.termOverride || undefined,
      notes: data.notes || undefined,
    };

    if (!definition) {
      createDefinition(
        { entryId: entryId, payload },
        {
          onError: (error) => {
            const message =
              error.message === "Failed to fetch"
                ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
                : error.message;
            toast.error(message);
          },
          onSuccess: handleSuccess,
        },
      );
    } else {
      updateDefinition(
        { definitionId: definition.id, entryId, payload },
        {
          onError: (error) => {
            const message =
              error.message === "Failed to fetch"
                ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
                : error.message;
            toast.error(message);
          },
          onSuccess: handleSuccess,
        },
      );
    }
  };

  return (
    <>
      <motion.form className="w-full" layout onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper
          label="Variação"
          inputId="termOverride"
          errorMessage={errors?.termOverride?.message}
        >
          <Input
            className="border-primary-muted text-text-fixed-dark"
            placeholder="Há uma variação no termo original?"
            {...register("termOverride")}
          />
          <p className="text-xs italic">
            Este campo é opcional. Preencha apenas se quiser adicionar uma
            grafia alternativa para esta definição.
          </p>
        </FieldWrapper>

        <FieldWrapper
          inputId="translation"
          label="Tradução"
          errorMessage={errors.translation?.message}
        >
          <Input
            className=" text-text-fixed-dark border-primary-muted"
            placeholder="Qual a tradução deste termo?"
            {...register("translation")}
          />
        </FieldWrapper>
        <div className="flex gap-2 ">
          <FieldWrapper
            inputId="partOfSpeech"
            label="Classe gramatical"
            errorMessage={errors.partOfSpeech?.message}
          >
            <Controller
              name="partOfSpeech"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full border-primary-muted text-text-fixed-dark">
                    <SelectValue placeholder="Escolha uma classe" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface-subtle">
                    <SelectGroup>
                      <SelectLabel>Selecione um</SelectLabel>
                      {Object.entries(partOfSpeech).map(([value, label]) => (
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
          {isNoun && (
            <FieldWrapper
              inputId="nounArticle"
              label="Artigo"
              errorMessage={errors.nounArticle?.message}
            >
              <Controller
                name="nounArticle"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full border-primary-muted text-text-fixed-dark">
                      <SelectValue placeholder="Escolha uma classe" />
                    </SelectTrigger>
                    <SelectContent className="bg-surface-subtle">
                      <SelectGroup>
                        <SelectLabel>Selecione um</SelectLabel>
                        {Object.entries(nounArticle).map(([value, label]) => (
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
          )}
        </div>
        <FieldWrapper
          inputId="notes"
          label="Anotações"
          errorMessage={errors.notes?.message}
        >
          <Textarea
            placeholder="Conte um pouco mais sobre essa definição..."
            className="border-primary-muted text-text-fixed-dark min-h-20 w-full"
            rows={5}
            {...register("notes")}
          />
        </FieldWrapper>
        <Button
          type="submit"
          variant="secondary"
          className=" w-full rounded-full "
          style={{ fontWeight: "bold" }}
          onClick={() => console.log("button is clicked")}
          disabled={isCreatePending || isUpdatePending}
        >
          Confirmar
        </Button>
        <Button
          type="button"
          variant="ghost"
          className=" w-full rounded-full"
          style={{ fontWeight: "bold" }}
          onClick={definition ? onClose : drawerClose}
          disabled={isCreatePending || isUpdatePending}
        >
          Cancelar
        </Button>
      </motion.form>
    </>
  );
}
