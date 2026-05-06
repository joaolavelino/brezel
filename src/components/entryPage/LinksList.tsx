import { useGetEntry } from "@/hooks/Query/useEntries";
import { LinkCard } from "./LinkCard";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { LinkForm } from "../forms/LinkForm";
import { EmptyStateCard } from "../EmptyStateCard";

interface LinksListProps {
  entryId: string;
}

export const LinksList = ({ entryId }: LinksListProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { data: entry } = useGetEntry(entryId);

  if (!entry) return <p>No entry found</p>;

  const linkedEntries = entry.links.map((link) => link.id);
  return (
    <section className="mt-4">
      <header className="flex justify-between items-center">
        <h3 className="flex gap-1 items-center text-primary font-bold">
          <Link size={16} />
          Links
        </h3>

        <Button
          size={"icon-sm"}
          className="rounded-full"
          onClick={() => setIsCreating(true)}
        >
          <Plus />
        </Button>
      </header>

      <motion.div
        className="space-y-2 mt-2"
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isCreating && (
            <LinkForm
              entryId={entryId}
              onClose={() => setIsCreating(false)}
              linkedEntries={linkedEntries}
            />
          )}

          {!isCreating && entry.links.length == 0 && (
            <EmptyStateCard
              action={() => setIsCreating(true)}
              actionText="Criar primeiro link"
              description="Adicione links para outros termos que são relacionadas a este."
              title="Nenhum link encontrado"
            />
          )}

          {entry.links.map((link) => {
            return (
              !!link && (
                <LinkCard key={link.id} entryId={entryId} linkedEntry={link} />
              )
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};
