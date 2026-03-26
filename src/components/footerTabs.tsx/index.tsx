"use client";

import { useState } from "react";
import { SearchContent } from "./SearchContent";
import { CaptureContent } from "./CaptureContent";

export function FooterTabs() {
  const [mode, setMode] = useState<null | "capture" | "search">(null);

  const toggleCapture = () => {
    if (mode !== "capture") {
      setMode("capture");
    } else setMode(null);
  };
  const enableSearch = () => {
    setMode("search");
  };
  const disableSearch = () => {
    setMode(null);
  };

  return (
    <div className="fixed w-full bottom-0">
      <div
        className={`bg-surface-muted pt-2  rounded-t-4xl px-8 relative top-4 z-10 overflow-hidden flex flex-col ${
          mode === "search"
            ? "max-h-[calc(100dvh-80px)] h-[calc(100dvh-80px)] pb-8"
            : mode === "capture"
            ? "h-0 pb-6"
            : "h-0 pb-20"
        }`}
        style={{
          transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <SearchContent
          isCaptureMode={mode === "capture"}
          isSearchMode={mode === "search"}
          disableSearchMode={disableSearch}
          enableSearchMode={enableSearch}
        />
      </div>
      <div
        className={`text-center bg-primary text-text-fixed-light py-2 rounded-t-4xl overflow-hidden relative z-20 max-h-[calc(100dvh-40px)] ${
          mode === "capture" ? "h-[calc(100dvh-40px)]" : "h-16"
        }`}
        style={{
          transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <CaptureContent
          isCaptureMode={mode == "capture"}
          toggleCapture={toggleCapture}
        />
      </div>
    </div>
  );
}
