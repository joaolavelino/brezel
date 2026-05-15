"use client";

import { useState } from "react"; // Adicionamos estado interno
import { motion, AnimatePresence, Transition } from "framer-motion";
import { X, ChevronDown, ChevronUp, Tag } from "lucide-react";
import { getContrastColor } from "@/lib/utils/getContrastColor";
import Image from "next/image";
import brezelIcon from "@/assets/brezel-icon.png";

export type TagSearchItem = {
  id: string;
  name: string;
  color: string | null;
};

interface SearchTagFilterProps<T extends TagSearchItem> {
  tags: T[];
  selectedTagId: string | null;
  onSelectTag: (id: string | null) => void;
}

export function SearchTagFilter({
  tags,
  selectedTagId,
  onSelectTag,
}: SearchTagFilterProps<TagSearchItem>) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedTag = tags.find((t) => t.id === selectedTagId);

  // O SEGREDO: Limitar a exibição inicial (ex: 4 tags)
  const LIMIT = 4;
  const hasTooManyTags = tags.length > LIMIT;
  const visibleTags = isExpanded ? tags : tags.slice(0, LIMIT);

  const fastSpring: Transition = {
    type: "spring",
    stiffness: 600,
    damping: 40,
  };

  return (
    <div className="space-y-2 py-4">
      <AnimatePresence>
        {selectedTag ? (
          /* MODO: TAG ÚNICA SELECIONADA (Fica fixo no topo) */
          <motion.button
            key="selected"
            layout // Mola suave na transição
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              position: "absolute",
              transition: { duration: 0.05 },
            }}
            transition={fastSpring}
            onClick={() => onSelectTag(null)}
            className={`flex justify-center items-center gap-2 rounded-full p-2 w-full font-bold shadow-sm text-[14px] leading-none ${selectedTag.name == "Brezel" && "font-brand"}`}
            style={{
              backgroundColor: selectedTag.color ?? "var(--text-light)",
              color: selectedTag.color
                ? getContrastColor(selectedTag.color)
                : "white",
            }}
          >
            <X size={16} />
            {selectedTag.name}
          </motion.button>
        ) : (
          /* MODO: GRID DINÂMICO */
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <motion.div layout className="grid grid-cols-2 gap-1">
              <AnimatePresence>
                {visibleTags.map((tag) => (
                  <motion.button
                    layout
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={fastSpring}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectTag(tag.id)}
                    className={`flex gap-2 justify-center items-center rounded-full text-sm leading-none p-2 font-bold capitalize tracking-tight ${tag.name == "Brezel" && "font-brand"}`}
                    style={{
                      backgroundColor: tag.color ?? "#555",
                      color: tag.color ? getContrastColor(tag.color) : "white",
                      fontSize: "14px",
                    }}
                  >
                    {tag.name == "Brezel" ? (
                      <Image
                        src={brezelIcon}
                        alt="Brezel em forma de um B"
                        height={14}
                      />
                    ) : (
                      <Tag size={14} />
                    )}
                    {tag.name}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* BOTÃO "VER MAIS" - Só aparece se houver excesso */}
            {hasTooManyTags && (
              <motion.button
                layout
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-1 text-[9px] leading-none font-bold text-text-light flex items-center justify-center gap-1 rounded-full hover:bg-white/5 transition-colors"
                style={{ fontSize: "12px" }}
              >
                {isExpanded ? (
                  <>
                    {" "}
                    <ChevronUp size={12} /> VER MENOS{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <ChevronDown size={12} /> VER TODAS CATEGORIAS (
                    {tags.length}){" "}
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
