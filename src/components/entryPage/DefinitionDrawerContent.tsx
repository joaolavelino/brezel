import { CompleteDefinition, EntryDetail } from "@/types/entries";
import { Button } from "../ui/button";
import {
  AlertTriangle,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Star,
} from "lucide-react";
import { useState } from "react";
import { Example } from "@/generated/prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DefinitionForm } from "../forms/DefinitionForm";

interface DefinitionDrawerContentProps {
  definition: CompleteDefinition | null;
  entry: EntryDetail;
}

export const DefinitionDrawerContent = ({
  definition: currentDefinition,
  entry,
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
  };

  const formTitleCard = !!definition ? "Editar definição" : "Criar definição";

  return (
    <div className="space-y-4">
      <section>
        {isPrimary ? (
          <div className="flex gap-2 border-2 border-surface-muted p-2 py-1.5 items-center justify-center rounded-full">
            <Star className="fill-secondary text-transparent" size={18} />
            <p className="">Esta é a definição principal da entrada!</p>
          </div>
        ) : (
          <Button className="rounded-full w-full">
            <Star />
            Fixar esta como definição principal
          </Button>
        )}
      </section>
      <Card className="p-4 gap-2">
        <CardHeader className="p-0">
          <CardTitle>
            {showDefinitionForm ? formTitleCard : "Ver definição"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!definition ? (
            <DefinitionForm
              handleSuccess={(definition: CompleteDefinition) =>
                handleSuccess(definition)
              }
              onClose={handleCloseDefinitionForm}
            />
          ) : showDefinitionForm ? (
            <DefinitionForm
              handleSuccess={(definition: CompleteDefinition) =>
                handleSuccess(definition)
              }
              definition={definition}
              onClose={handleCloseDefinitionForm}
            />
          ) : (
            <>
              <p>HOY</p>
              <Button
                onClick={handleDefinitionEditView}
                className="w-full rounded-full"
                size={"sm"}
              >
                Editar definição
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {!!definition && (
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
          {hasNoExamples && (
            <div className="w-full p-4 border-2 border-primary-muted rounded-md mt-2 flex flex-col items-center gap-4">
              <div className="p-3 bg-primary-muted rounded-full w-fit">
                <AlertTriangle size={20} className="text-primary " />
              </div>
              <p>Nenhum exemplo foi encontrado!</p>
              <Button
                variant={"default"}
                className="w-full rounded-full"
                onClick={handleExampleCreateView}
              >
                Criar um exemplo
              </Button>
            </div>
          )}
          {showExampleForm ? (
            <div>
              <p>FORM</p>
              <Button onClick={handleCloseExampleForm}>Back</Button>
            </div>
          ) : (
            <div className="space-y-2 mt-2">
              {definition?.examples.map((ex) => (
                <Card
                  key={ex.id}
                  className="gap-0 p-4 pr-8 relative"
                  onClick={() => handleExampleEditView(ex)}
                >
                  <Button
                    variant={"ghost"}
                    className="absolute right-1 top-1"
                    onClick={() => handleExampleEditView(ex)}
                  >
                    <MoreHorizontal />
                  </Button>
                  <CardHeader className="p-0">
                    <CardTitle>{ex.text}</CardTitle>
                  </CardHeader>
                  {ex.notes && (
                    <CardContent className="p-0">
                      <p className="text-xs italic">{ex.notes}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
