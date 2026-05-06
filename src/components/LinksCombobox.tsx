import { useGetEntries, useGetEntry } from "@/hooks/Query/useEntries";
import { EntryListItem } from "@/types/entries";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, EraserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface LinkComboboxProps {
  entryId: string;
  value: string;
  onChange: (id: string) => void;
}

export function LinkCombobox({ onChange, value, entryId }: LinkComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: entries = [] } = useGetEntries();
  const { data: entry } = useGetEntry(entryId);
  const linkedEntries = entry?.links.map((link) => link.id);

  const filteredEntries = useMemo(() => {
    return entries
      .filter((el) => el.id !== entryId)
      .filter((el) => !linkedEntries?.includes(el.id))
      .filter((el) => el.termNormalized.includes(query));
  }, [entries, entryId, query, linkedEntries]);

  const handleSelect = (entry: EntryListItem) => {
    setIsOpen(false);
    onChange(entry.id);
    setQuery("");
  };

  const selectedEntry = useMemo(() => {
    return entries.find((el) => el.id === value);
  }, [entries, value]);

  return (
    <motion.div className="space-y-1 w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full flex justify-between bg-surface-subtle text-text-fixed-dark border border-surface-muted">
            {value ? selectedEntry?.term : "Escolha uma entrada"}{" "}
            {!isOpen ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Command>
            <motion.div className="flex items-center gap-4 w-full mb-2">
              <CommandInput
                value={query}
                placeholder="Pesquise por uma tag"
                onValueChange={(value) => setQuery(value)}
              />
              {query.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuery("")}
                >
                  <EraserIcon />
                </Button>
              )}
            </motion.div>
            <CommandList className="space-y-2">
              <CommandEmpty>Nenhuma entrada encontrada</CommandEmpty>
              <CommandGroup>
                {filteredEntries.map((el) => (
                  <CommandItem
                    key={el.id}
                    onSelect={() => handleSelect(el)}
                    className="cursor-pointer"
                  >
                    {el.term}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
