import { tagsMock } from "@/data/_mock-data/tags";
import { Tag } from "@/generated/prisma/client";
import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandGroup,
} from "./ui/command";
import { Chip } from "./Chip";
import { AnimatePresence, motion } from "framer-motion";

interface TagComboboxProps {
  value: Tag[];
  onChange: (tags: Tag[]) => void;
}

export function TagCombobox({ onChange, value }: TagComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const tags = tagsMock;

  const maxTagAmount = 5;
  const isMaxReached = value.length >= maxTagAmount;

  const filteredTags = useMemo(() => {
    return tags.filter(
      (el) =>
        !value.some((v) => v.id === el.id) &&
        el.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [value, query, tags]);

  const handleSelect = (tag: Tag) => {
    onChange([...value, tag]);
    setQuery("");
  };

  const handleDelete = (tag: Tag) => {
    onChange(value.filter((v) => v.id !== tag.id));
  };

  const handleCreate = () => {
    console.log(query);
  };

  const showCreate =
    query.trim() !== "" &&
    !tags.some((t) => t.name.toLowerCase() === query.toLowerCase());

  return (
    <div className="space-y-1">
      <div className="flex gap-1 flex-wrap">
        <AnimatePresence>
          {value.map((el) => (
            <motion.div
              key={el.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 1,
              }}
            >
              <Chip
                name={el.name}
                onDelete={() => handleDelete(el)}
                key={el.id}
                color={el.color ?? undefined}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isMaxReached}
            className="w-full flex justify-between bg-primary-muted "
          >
            Escolha {!isOpen ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Command>
            <div className="flex items-center gap-4">
              <CommandInput
                value={query}
                placeholder="Pesquise por uma tag"
                onValueChange={(value) => setQuery(value)}
              />
              <Button variant="ghost" size="icon" onClick={() => setQuery("")}>
                Limpar
              </Button>
            </div>
            <CommandList className="space-y-2">
              <CommandEmpty>Nenhuma tag encontrada</CommandEmpty>
              <CommandGroup>
                {filteredTags.map((el) => (
                  <CommandItem
                    key={el.id}
                    onSelect={() => handleSelect(el)}
                    className="cursor-pointer"
                  >
                    {el.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {showCreate && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => handleCreate()}
                    >{`Criar categoria '${query}'`}</CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
