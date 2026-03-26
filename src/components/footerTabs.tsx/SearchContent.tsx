"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { tagsMock } from "@/data/_mock-data/tags";
import { entriesMock } from "@/data/_mock-data/entries";
import { getContrastColor } from "@/lib/utils/getContrastColor";
import { useEntrySearch } from "@/hooks/useEntrySearch";
import { motion, AnimatePresence } from "framer-motion";

interface SearchProps {
  isSearchMode: boolean;
  isCaptureMode: boolean;
  enableSearchMode: () => void;
  disableSearchMode: () => void;
}
export function SearchContent({
  isSearchMode,
  isCaptureMode,
  enableSearchMode,
  disableSearchMode,
}: SearchProps) {
  const {
    query,
    setQuery,
    selectedTagId,
    setSelectedTagId,
    filteredEntries,
    resetSearch,
  } = useEntrySearch(entriesMock);

  //mock data
  const tags = tagsMock;

  const selectedTag = tags.find((el) => el.id === selectedTagId);

  function closeSearch() {
    resetSearch();
    setSelectedTagId(null);
    disableSearchMode();
  }
  return (
    <>
      {!isCaptureMode && (
        <div className="flex gap-4 items-center pt-2">
          <Input
            className="rounded-full text-center"
            placeholder="Busca"
            onFocus={enableSearchMode}
            onChange={(e) => setQuery(e.target.value)}
            value={isSearchMode ? query : "Busca"}
          />

          {isSearchMode && (
            <Button
              size={"icon"}
              onClick={closeSearch}
              className="rounded-full"
            >
              <X />
            </Button>
          )}
        </div>
      )}
      {isSearchMode && (
        <div className="flex flex-col flex-1 min-h-0">
          {query.length > 2 && (
            <div className="flex gap-2 w-full items-center justify-between pt-2">
              <p>Resultados para: {query}</p>
              <Button variant="link" onClick={() => setQuery("")} size="xs">
                <X />
                Limpar Busca
              </Button>
            </div>
          )}
          {/* Tag filter */}
          <div className="space-y-2 py-4">
            {selectedTag ? (
              <button
                className={`flex justify-center items-center gap-2 rounded-md p-2 w-full font-bold ${
                  selectedTag.color
                    ? getContrastColor(selectedTag.color)
                    : "text-text-fixed-light"
                }`}
                style={{
                  backgroundColor: selectedTag.color ?? "var(--text-light)",
                }}
                onClick={() => setSelectedTagId(null)}
              >
                <X />
                {selectedTag.name}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {tagsMock.map((tag) => (
                  <button
                    key={tag.id}
                    className={`flex justify-center items-center rounded-md text-xs p-2 font-bold ${
                      tag.color
                        ? getContrastColor(tag.color)
                        : "text-text-fixed-light"
                    }`}
                    style={{
                      backgroundColor: tag.color ?? "var(--text-light)",
                    }}
                    onClick={() => setSelectedTagId(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result List */}
          <div className="space-y-2 overflow-auto flex-1 min-h-0">
            <AnimatePresence mode="popLayout">
              {filteredEntries.map((entry) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 40,
                    mass: 1,
                  }}
                  key={entry.id}
                  className="bg-surface-subtle p-2 rounded-md border border-white/5"
                >
                  <h3 className="capitalize text-primary">{entry.term}</h3>
                  <p className="text-xs italic text-text-light">
                    {entry.notes}
                  </p>
                  {entry.primaryDefinition && (
                    <div className="pt-1">
                      <p className="text-xs ">Definiçao principal</p>
                      <p className="text-sm">
                        {entry.primaryDefinition?.translation}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
}
