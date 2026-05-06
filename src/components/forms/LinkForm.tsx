"use client";

import { useCreateLink } from "@/hooks/Query/useLinks";
import { CreateLinkSchema } from "@/validation/linksSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FieldWrapper } from "../FieldWrapper";
import { LinkCombobox } from "../LinksCombobox";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface LinkFormProps {
  entryId: string;
  onClose: () => void;
  targetId?: string | null;
  linkedEntries: string[];
}

type LinkFormType = z.infer<typeof CreateLinkSchema>;

export const LinkForm = ({
  entryId,
  onClose,
  targetId = null,
}: LinkFormProps) => {
  const { handleSubmit, formState, control } = useForm<LinkFormType>({
    resolver: zodResolver(CreateLinkSchema),
    defaultValues: {
      targetId: targetId ?? "",
    },
  });

  const { errors, isSubmitting } = formState;
  const { mutate: createLink } = useCreateLink(entryId);

  const onSubmit = (data: LinkFormType) => {
    createLink(
      { entryId, payload: data },
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
            `A ligação entre ${data.term1} e ${data.term2} foi criada com sucesso!`,
          );
          onClose();
        },
      },
    );
  };

  return (
    <Card className="p-4">
      <motion.form className="w-full" layout onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper
          label="Entrada"
          inputId="tags"
          errorMessage={errors?.targetId?.message}
        >
          <Controller
            name="targetId"
            control={control}
            render={({ field }) => (
              <LinkCombobox
                entryId={entryId}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FieldWrapper>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="secondary"
            className=" flex-2 rounded-full "
            style={{ fontWeight: "bold" }}
            onClick={() => console.log("button is clicked")}
            disabled={isSubmitting}
          >
            Confirmar
          </Button>
          <Button
            type="button"
            variant="ghost"
            className=" flex-1 rounded-full"
            style={{ fontWeight: "bold" }}
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </motion.form>
    </Card>
  );
};
