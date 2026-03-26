import { useMemo, useState } from "react";
import { normalizeForSearch, sortByRelevance } from "@/lib/search-utils";

export type EntrySearchItem = {
  term: string;
  entryTags: Array<{ tagId: string }>;
  definitions?: Array<{
    translation: string;
    termOverride?: string | null;
  }>;
};

export function useEntrySearch<T extends EntrySearchItem>(entries: T[]) {
  const [query, setQuery] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const filteredByTag = !selectedTagId
      ? entries
      : entries.filter((el) =>
          el.entryTags.some((et) => et.tagId === selectedTagId)
        );

    const cleanQuery = normalizeForSearch(query);
    if (!cleanQuery || query.length < 3) return filteredByTag;

    const filtered = filteredByTag.filter((entry) => {
      // 1. Termo principal
      if (normalizeForSearch(entry.term).includes(cleanQuery)) return true;

      // 2. Camada de definições
      return entry.definitions?.some((def) => {
        const matchTranslation = normalizeForSearch(def.translation).includes(
          cleanQuery
        );
        const matchOverride =
          def.termOverride &&
          normalizeForSearch(def.termOverride).includes(cleanQuery);

        return matchTranslation || matchOverride;
      });
    });

    return [...filtered].sort((a, b) =>
      sortByRelevance(a.term, b.term, cleanQuery)
    );
  }, [query, entries, selectedTagId]);

  return {
    query,
    setQuery,
    selectedTagId,
    setSelectedTagId,
    filteredEntries,
    resetSearch: () => setQuery(""),
    hasResults: filteredEntries.length > 0,
  };
}
