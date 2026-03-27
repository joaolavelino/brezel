import { Star, X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

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
          <h2 className="text-4xl font-bold">Nova Entrada</h2>
          <Button variant="ghost" className="w-full" onClick={toggleCapture}>
            <X />
            Cancelar
          </Button>
        </div>
      )}
    </>
  );
}
