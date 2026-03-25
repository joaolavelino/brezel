"use client";

import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

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
  const [query, setQuery] = useState("");

  function closeSearch() {
    setQuery("");
    disableSearchMode();
  }
  return (
    <>
      {!isCaptureMode && (
        <div className="flex gap-4 items-center">
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
        <div>
          {query.length > 3 && (
            <div className="flex gap-2 w-full items-center justify-between pt-2">
              <p>Resultados para: {query}</p>
              <Button variant="link" onClick={() => setQuery("")} size="xs">
                <X />
                Limpar Busca
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
