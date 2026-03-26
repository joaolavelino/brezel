"use client";

import { useState } from "react";
import { SearchContent } from "./SearchContent";
import { CaptureContent } from "./CaptureContent";
import { AnimatePresence, motion, Transition } from "framer-motion";

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

  //Animation
  const springConfig: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <div className="fixed w-full bottom-0">
      <AnimatePresence>
        <motion.div
          key="searchTab"
          transition={springConfig}
          initial={false}
          animate={{
            // Se for search: sobe tudo.
            // Se for capture: desce 100% (some).
            // Se for null: fica com 64px (h-16) no rodapé.
            height:
              mode === "search"
                ? "calc(100dvh - 80px)"
                : mode === "capture"
                ? 0
                : "64px",
            y: mode === "capture" ? "100%" : 0,
          }}
          className={`bg-surface-muted pt-2  rounded-t-4xl px-8 top-6 relative z-10 overflow-hidden flex flex-col ${
            mode === "search" ? "pb-8" : mode === "capture" ? "pb-20" : "pb-20 "
          }`}
        >
          <SearchContent
            isCaptureMode={mode === "capture"}
            isSearchMode={mode === "search"}
            disableSearchMode={disableSearch}
            enableSearchMode={enableSearch}
          />
        </motion.div>
        <motion.div
          key="captureTab"
          transition={springConfig}
          initial={false}
          animate={{
            // Se for capture: sobe. Se for search: desce 100%. Se null: 64px.
            height: mode === "capture" ? "calc(100dvh - 40px)" : "64px",
            // y: mode === "search" ? "100%" : 0,
          }}
          className={`text-center bg-primary text-text-fixed-light py-2 rounded-t-4xl overflow-hidden relative z-20 ${
            mode === "capture" ? "" : "h-16"
          }`}
        >
          <CaptureContent
            isCaptureMode={mode == "capture"}
            toggleCapture={toggleCapture}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
