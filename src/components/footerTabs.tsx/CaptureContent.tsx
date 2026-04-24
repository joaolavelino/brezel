import { Star, X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { CaptureForm } from "../forms/captureForm";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Entry } from "@/generated/prisma/client";
import { CaptureConfirm } from "./CaptureConfirm";

interface CaptureProps {
  isCaptureMode: boolean;
  toggleCapture: () => void;
  hasEntries: boolean;
}

export function CaptureContent({
  isCaptureMode,
  toggleCapture,
  hasEntries,
}: CaptureProps) {
  const [createdEntry, setCreatedEntry] = useState<{
    term: string;
    id: string;
  } | null>({ term: "Netzwerk", id: "cmmfcevsu0005788zzy72ybku" });

  const handleCreateSuccess = (entry: Entry) =>
    setCreatedEntry({ id: entry.id, term: entry.term });

  const handleClose = () => {
    setCreatedEntry(null);
    toggleCapture();
  };

  return (
    <>
      {!isCaptureMode ? (
        <>
          {!hasEntries ? (
            <div className="flex h-full flex-col space-y-4 items-center justify-center p-12">
              <Star className="text-secondary" />
              <h3 className="font-bold text-xl">
                Seu caderno ainda está vazio!
              </h3>
              <p className="text-sm">
                Capture sua primeira palavra e comece a criar seu companheiro de
                jornada para o alemão!
              </p>
              <Button className="w-full bg-secondary " onClick={toggleCapture}>
                Criar primeira entrada!
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="w-full" onClick={toggleCapture}>
              Captura
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-between min-h-full w-full items-start px-8 py-4">
          <div className="flex items-center gap-4">
            <div>
              <Image
                width={24}
                height={24}
                src={"/Brezel.svg"}
                alt="Brezel image"
                className="object-contain "
              />
            </div>
            <h1 className="font-brand font-bold text-2xl">Brezel</h1>
          </div>
          <AnimatePresence>
            {!createdEntry ? (
              <motion.div layout className="flex flex-col items-start w-full">
                <h2 className="text-4xl font-bold">Nova Entrada</h2>
                <motion.div
                  layout
                  className="flex flex-col mb-2  min-h-135 justify-end w-full"
                >
                  <CaptureForm
                    handleSuccess={(entry: Entry) => handleCreateSuccess(entry)}
                  />
                </motion.div>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={toggleCapture}
                >
                  <X />
                  Cancelar
                </Button>
              </motion.div>
            ) : (
              <motion.div layout className="flex flex-col items-start w-full">
                <CaptureConfirm
                  entryId={createdEntry.id}
                  handleClose={() => {}}
                />
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleClose}
                >
                  <X />
                  Cancelar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
