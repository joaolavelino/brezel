import { Example } from "@/generated/prisma/client";
import { useSetPrimaryDefinition } from "@/hooks/Query/useEntries";
import { CompleteDefinition, EntryDetail } from "@/types/entries";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, MessageCircle, Plus, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DefinitionForm } from "../forms/DefinitionForm";
import { ExampleForm } from "../forms/ExampleForm";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { DefinitionDisplayCard } from "./DefinitionDisplayCard";
import { ExampleCard } from "./ExampleCard";
import { EmptyStateCard } from "../EmptyStateCard";

interface DefinitionDrawerContentProps {
  definition: CompleteDefinition | null;
  entry: EntryDetail;
  onClose: () => void;
}

export const DefinitionDrawerContent = ({
  definition: currentDefinition,
  entry,
  onClose,
}: DefinitionDrawerContentProps) => {
  const [definition, setDefinition] = useState<null | CompleteDefinition>(
    currentDefinition,
  );

  const isPrimary = definition?.id === entry.primaryDefinitionId;
  const isNewDefinition = !definition;

  const hasNoExamples = !isNewDefinition && definition.examples.length == 0;

  const [selectedExample, setSelectExample] = useState<null | Example>(null);
  const [showExampleForm, setShowExampleForm] = useState(false);
  const [showDefinitionForm, setShowDefinitionForm] = useState(false);

  //Manage Example Form
  const handleExampleCreateView = () => {
    setSelectExample(null);
    setShowExampleForm(true);
    setShowDefinitionForm(false);
  };

  const handleExampleEditView = (example: Example) => {
    setSelectExample(example);
    setShowExampleForm(true);
    setShowDefinitionForm(false);
  };

  const handleCloseExampleForm = () => {
    setSelectExample(null);
    setShowExampleForm(false);
  };

  //Manage DefinitionForm
  const handleDefinitionEditView = () => {
    setSelectExample(null);
    setShowExampleForm(false);
    setShowDefinitionForm(true);
  };

  const handleCloseDefinitionForm = () => {
    setSelectExample(null);
    setShowDefinitionForm(false);
  };

  const handleSuccess = (definition: CompleteDefinition) => {
    setDefinition(definition);
    setShowDefinitionForm(false);
  };

  const handleDeletionSuccess = () => {
    setDefinition(null);
    onClose();
  };

  const handleExampleCreationSuccess = (example: Example) => {
    if (!definition) return;
    const updatedDefinition: CompleteDefinition = {
      ...definition,
      examples: [...definition.examples, example],
    };

    setDefinition(updatedDefinition);
    handleCloseExampleForm();
  };

  const handleExampleEditSuccess = (updatedExample: Example) => {
    if (!definition) return;

    const updatedExampleList = definition.examples.map((ex) => {
      if (ex.id === updatedExample.id) {
        return updatedExample;
      }
      return ex;
    });
    const updatedDefinition: CompleteDefinition = {
      ...definition,
      examples: updatedExampleList,
    };

    setDefinition(updatedDefinition);
    handleCloseExampleForm();
  };

  const handleExampleDeleteSuccess = (id: string) => {
    if (!definition) return;
    const updatedDefinition = {
      ...definition,
      examples: definition?.examples.filter((el) => el.id !== id),
    };
    setDefinition(updatedDefinition);
  };

  const showExampleSection = !!definition && !showDefinitionForm;

  const { mutate: setPrimaryDefinition, isPending } = useSetPrimaryDefinition(
    entry.id,
  );

  const setPrimary = (definitionId: string, entryId: string) => {
    setPrimaryDefinition(
      { definitionId, entryId },
      {
        onError: (error) => {
          const message =
            error.message === "Failed to fetch"
              ? "Sem conexão. Verifique a sua rede de internet e tente novamente."
              : error.message;
          toast.error(message);
        },
        onSuccess: () =>
          toast.success(
            "Entrada atualizada. Nova definição principal escolhida!",
          ),
      },
    );
  };

  return (
    <div className="space-y-4">
      {definition && (
        <section>
          {isPrimary ? (
            <div className="flex gap-2 border-2 border-surface-muted p-2 py-1.5 items-center justify-center rounded-full">
              <Star className="fill-secondary text-transparent" size={18} />
              <p className="">Esta é a definição principal da entrada!</p>
            </div>
          ) : (
            <Button
              className="rounded-full w-full"
              onClick={() => setPrimary(definition.id, entry.id)}
            >
              <Star />
              Fixar esta como definição principal
            </Button>
          )}
        </section>
      )}
      {!definition ? (
        <Card className="p-4">
          <DefinitionForm
            entryId={entry.id}
            handleSuccess={(definition: CompleteDefinition) =>
              handleSuccess(definition)
            }
            onClose={handleCloseDefinitionForm}
            drawerClose={onClose}
          />
        </Card>
      ) : showDefinitionForm ? (
        <Card className="p-4">
          <DefinitionForm
            entryId={entry.id}
            handleSuccess={(definition: CompleteDefinition) =>
              handleSuccess(definition)
            }
            definition={definition}
            onClose={handleCloseDefinitionForm}
            drawerClose={onClose}
          />
        </Card>
      ) : (
        <DefinitionDisplayCard
          onDeletionSuccess={handleDeletionSuccess}
          definition={definition}
          entry={entry}
          openEditionForm={handleDefinitionEditView}
        />
      )}

      {showExampleSection && (
        <section>
          <header className="flex justify-between items-center">
            <h3 className="flex gap-1 items-center text-primary font-bold">
              <MessageCircle size={16} />
              Exemplos
            </h3>

            <Button
              size={"icon-sm"}
              className="rounded-full"
              onClick={handleExampleCreateView}
            >
              <Plus />
            </Button>
          </header>
          {!showExampleForm && hasNoExamples && (
            <EmptyStateCard
              title="Nenhum exemplo foi encontrado!"
              description="Crie um exemplo para ajudar a entender a definição."
              action={handleExampleCreateView}
              actionText="Criar um exemplo"
            />
          )}
          {showExampleForm ? (
            <Card className="p-4 gap-2 mt-2">
              <CardTitle>
                {selectedExample ? "Editar exemplo" : "Criar exemplo"}
              </CardTitle>
              <CardContent className="p-0">
                <ExampleForm
                  definitionId={definition.id}
                  entryId={entry.id}
                  handleCreateSuccess={(example: Example) =>
                    handleExampleCreationSuccess(example)
                  }
                  handleUpdateSuccess={(example: Example) =>
                    handleExampleEditSuccess(example)
                  }
                  onClose={handleCloseExampleForm}
                  example={selectedExample}
                />
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="space-y-2 mt-2"
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {definition?.examples.map((ex) => (
                  <ExampleCard
                    key={ex.id}
                    definitionId={definition.id}
                    entryId={entry.id}
                    example={ex}
                    handleOpenEditForm={handleExampleEditView}
                    onDeletionSuccess={() => handleExampleDeleteSuccess(ex.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      )}
    </div>
  );
};
