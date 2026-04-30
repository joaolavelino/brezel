"use client";

import { useState } from "react";
import { SearchContent } from "./SearchContent";
import { CaptureContent } from "./CaptureContent";
import { AnimatePresence, motion, Transition } from "framer-motion";
import { entriesMock } from "@/data/_mock-data/entries"; // Ajuste o path se necessário

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

  const entries = entriesMock;

  const hasEntries = entries.length > 0;

  //Animation
  const springConfig: Transition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  return (
    <motion.div layout className="fixed w-full bottom-0">
      <AnimatePresence>
        {hasEntries && (
          <motion.div
            key="searchTab"
            transition={springConfig}
            initial={false}
            animate={{
              height:
                mode === "search"
                  ? "calc(100dvh - 80px)"
                  : mode === "capture"
                    ? 0
                    : "64px",
              y: mode === "capture" ? "100%" : 0,
            }}
            className={`bg-surface-muted pt-2  rounded-t-4xl px-8 top-6 relative z-10 overflow-hidden flex flex-col max-h-[calc(100dvh-80px)] ${
              mode === "search"
                ? "pb-8"
                : mode === "capture"
                  ? "pb-20"
                  : "pb-20 "
            }`}
          >
            <SearchContent
              isCaptureMode={mode === "capture"}
              isSearchMode={mode === "search"}
              disableSearchMode={disableSearch}
              enableSearchMode={enableSearch}
            />
          </motion.div>
        )}
        <motion.div
          key="captureTab"
          initial={false}
          animate={{
            height:
              mode === "capture"
                ? "calc(100dvh - 40px)"
                : !hasEntries
                  ? "400px"
                  : "64px",
            // Se NÃO tiver entries e estiver em modo null, ele dá um "pulse"
            scale: !hasEntries && mode === null ? [1, 1.01, 1] : 1,
          }}
          transition={{
            ...springConfig,
            ...(!hasEntries &&
              mode === null && {
                scale: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                  repeatDelay: 1.5,
                },
              }),
          }}
          className={`text-center bg-primary text-text-fixed-light py-2 rounded-t-4xl overflow-hidden relative z-20 ${
            !hasEntries && mode === null
              ? "shadow-[0_-10px_40px_rgba(168,85,247,0.3)]"
              : ""
          }`}
        >
          <CaptureContent
            isCaptureMode={mode === "capture"}
            toggleCapture={toggleCapture}
            hasEntries={hasEntries}
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
