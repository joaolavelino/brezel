import { FieldWrapper } from "../FieldWrapper";
import { Input } from "../ui/input";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { EntryForm } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagCombobox } from "../TagCombobox";

const CreateEntrySchema = z.object({
  term: z.string().min(1).trim(),
  notes: z.string().optional(),
  form: z.enum(EntryForm).optional(),
  tags: z.array(z.any()),
});

type CaptureFormDataType = z.infer<typeof CreateEntrySchema>;

export function CaptureForm() {
  const { control, register, handleSubmit, formState } =
    useForm<CaptureFormDataType>({
      resolver: zodResolver(CreateEntrySchema),
      defaultValues: {
        term: "",
        notes: "",
        tags: [],
      },
    });
  const { errors, isSubmitting } = formState;
  return (
    <form className="w-full">
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagCombobox value={field.value} onChange={field.onChange} />
        )}
      />

      <FieldWrapper inputId="term" label="Termo">
        <Input />
      </FieldWrapper>
    </form>
  );
}
