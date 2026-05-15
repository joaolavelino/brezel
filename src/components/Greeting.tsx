import { greetings } from "@/data/greetings";
import { useSaveDailyEntry } from "@/hooks/Query/useDailyEntry";
import { useGetEntries } from "@/hooks/Query/useEntries";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const Greeting = ({}) => {
  function getDailyGreeting() {
    const today = new Date();
    const index = today.getDate() % greetings.length;
    return greetings[index];
  }
  const greeting = getDailyGreeting();

  const { data: entries } = useGetEntries();
  const { mutate: saveGreetingEntry } = useSaveDailyEntry();
  const router = useRouter();

  const isAlreadyAdded = entries?.find((el) => el.term === greeting.entry.term);

  const handleSave = () => {
    saveGreetingEntry(greeting.entry, {
      onSuccess: (data) => {
        toast.success(`'${data.term}' foi adicionado à sua biblioteca`);
        router.push(`/entry/${data.id}`);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <>
      <p className=" text-6xl text-secondary font-semibold font-brand mb-4">
        {greeting.greeting}
      </p>
      {!isAlreadyAdded && (
        <Button
          size={"xs"}
          variant={"outline"}
          className="rounded-full w-fit px-8"
          onClick={handleSave}
        >
          Adicionar às suas entradas
        </Button>
      )}
    </>
  );
};
