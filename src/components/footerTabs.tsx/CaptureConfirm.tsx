import { useGetEntries } from "@/hooks/Query/useEntries";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CaptureConfirmProps {
  entryId: string;
  handleClose: () => void;
  handleNewEntry: () => void;
}

export const CaptureConfirm = ({
  entryId,
  handleClose,
  handleNewEntry,
}: CaptureConfirmProps) => {
  const { data: entries = [] } = useGetEntries();
  const router = useRouter();

  const entry = useMemo(() => {
    if (!entryId) return undefined;
    const foundEntry = entries.find((el) => el.id === entryId);
    return foundEntry;
  }, [entryId, entries]);

  if (!entry) {
    return null;
  }
  //AFTER HERE I DON'T WANT TO NEED TO ALWAYS CHECK THAT THERE'S NO ENTRY... AND SINCE ENTRY.DEFINITIONS IS ALWAYS AN ARRAY, THAT THE FILTERED DEFINITIONS ARE NEVER UNDEFINED

  return (
    <div className="w-full h-full mb-2 min-h-[600px]  flex flex-1 flex-col justify-between">
      <header className="flex flex-col items-start ">
        <div className="mb-1 flex ">
          {entry?.entryTags?.map((tag) => (
            <p
              key={tag.tagId}
              className="text-xs uppercase text-primary bg-text-fixed-light py-0.5 px-1 font-semibold"
            >
              {tag.tag.name}
            </p>
          ))}
        </div>
        <h2 className="text-4xl font-bold">{entry?.term}</h2>
        <p className="text-xl font-bold">foi salvo na sua biblioteca!</p>
        <p className="text-left  mt-4">
          Voce pode adicionar ir para sua página e adicionar novas informações a
          ela, como definições ou ligá-la a outras entradas.
        </p>
      </header>
      <div className="space-y-4">
        <Button
          className="bg-primary-muted text-primary w-full rounded-full"
          onClick={() => router.push(`/entries/${entryId}`)}
        >
          Ver detalhes da entrada
        </Button>
        <Button
          className="w-full border-2 border-primary-muted rounded-full"
          onClick={handleNewEntry}
        >
          Adicionar nova entrada
        </Button>
      </div>
    </div>
  );
};
