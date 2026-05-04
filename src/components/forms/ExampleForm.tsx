"use client";

import { Example } from "@/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { FieldWrapper } from "../FieldWrapper";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useCreateExample, useUpdateExample } from "@/hooks/Query/useExamples";
import { toast } from "sonner";
import { CreateExampleSchema } from "@/validation/exampleSchemas";

interface ExampleFormProps {
  entryId: string;
  definitionId: string;
  handleCreateSuccess: (example: Example) => void;
  handleUpdateSuccess: (example: Example) => void;
  onClose: () => void;
  example?: Example | null;
}

type ExampleFormType = z.infer<typeof CreateExampleSchema>;

export const ExampleForm = ({
  entryId,
  definitionId,
  handleCreateSuccess,
  handleUpdateSuccess,
  onClose,
  example = null,
}: ExampleFormProps) => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(CreateExampleSchema),
    defaultValues: {
      text: example?.text ?? "",
      notes: example?.notes ?? "",
    },
  });

  const { errors, isSubmitting } = formState;
  const { mutate: createExample } = useCreateExample(entryId);
  const { mutate: updateExample } = useUpdateExample(entryId);

  const onSubmit = (data: ExampleFormType) => {
    if (!example) {
      createExample(
        { definitionId, entryId, payload: data },
        {
          onError: (error) => {
            const message =
              error.message === "Failed to fetch"
                ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
                : error.message;
            toast.error(message);
          },
          onSuccess: (data) => {
            toast.success(`Exemplo ${data.text} foi criado com sucesso!`);
            handleCreateSuccess(data);
          },
        },
      );
    } else {
      updateExample(
        { exampleId: example.id, definitionId, entryId, payload: data },
        {
          onError: (error) => {
            const message =
              error.message === "Failed to fetch"
                ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
                : error.message;
            toast.error(message);
          },
          onSuccess: (data) => {
            handleUpdateSuccess(data);
            toast.success(`Exemplo foi atualizado com sucesso!`);
          },
        },
      );
    }
  };

  return (
    <>
      <motion.form className="w-full" layout onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper
          label="Texto"
          inputId="text"
          errorMessage={errors?.text?.message}
        >
          <Input
            className="border-primary-muted text-text-fixed-dark"
            placeholder="Qual o texto do exemplo?"
            {...register("text")}
          />
        </FieldWrapper>

        <FieldWrapper
          inputId="notes"
          label="Anotações"
          errorMessage={errors.notes?.message}
        >
          <Textarea
            placeholder="Conte um pouco mais sobre esse exemplo..."
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
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
        <Button
          type="button"
          variant="ghost"
          className=" w-full rounded-full"
          style={{ fontWeight: "bold" }}
          onClick={onClose}
        >
          Cancelar
        </Button>
      </motion.form>
    </>
  );
};
