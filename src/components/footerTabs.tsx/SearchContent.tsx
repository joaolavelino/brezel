"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { tagsMock } from "@/data/_mock-data/tags";
import { entriesMock } from "@/data/_mock-data/entries";
import { useEntrySearch } from "@/hooks/useEntrySearch";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations/staggered";
import { SearchTagFilter } from "./SearchTagFilter";
import { useGetTags } from "@/hooks/Query/useTags";
import { useGetEntries } from "@/hooks/Query/useEntries";

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
  const { data: entries = [] } = useGetEntries();
  const {
    query,
    setQuery,
    selectedTagId,
    setSelectedTagId,
    filteredEntries,
    resetSearch,
    showOnlyIncomplete,
    setShowOnlyIncomplete,
  } = useEntrySearch(entries);

  const incompleteEntriesAmount = entries.filter(
    (el) => el.definitions.length == 0,
  ).length;

  const { data: tags = [] } = useGetTags();

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
        <div className="flex flex-col flex-1 min-h-0 h-full">
          {query.length > 2 && (
            <div className="flex gap-2 w-full items-center justify-between pt-2">
              <p>Resultados para: {query}</p>
              <Button variant="link" onClick={() => setQuery("")} size="xs">
                <X />
                Limpar Busca
              </Button>
            </div>
          )}
          {showOnlyIncomplete ? (
            <div className="flex gap-2 w-full items-center justify-between pt-2 text-destructive text-sm">
              <p>Mostrando incompletas</p>
              <Button
                variant="link"
                onClick={() => setShowOnlyIncomplete(false)}
                size="xs"
                className="text-destructive-contrast"
              >
                <X />
                Mostrar todos
              </Button>
            </div>
          ) : (
            <>
              {incompleteEntriesAmount > 0 && (
                <motion.button
                  animate={{
                    scaleX: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowOnlyIncomplete(true)}
                  className={`
                     rounded-md border-2 text-destructive-contrast bg-destructive/20 border-destructive mt-2 p-1
                     `}
                  style={{ fontSize: "14px" }}
                >
                  Incompletas({incompleteEntriesAmount})
                </motion.button>
              )}
            </>
          )}
          {/* Tag filter */}

          <SearchTagFilter
            onSelectTag={setSelectedTagId}
            selectedTagId={selectedTagId}
            tags={tags}
          />

          {/* Result List */}
          <motion.div
            className="space-y-2 overflow-y-auto flex-1 min-h-0 relative "
            variants={containerVariants}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2" // Mantém o espaçamento do Flex
              >
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
                    variants={itemVariants}
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
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </>
  );
}
