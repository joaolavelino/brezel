import { X } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

interface CaptureProps {
  isCaptureMode: boolean;
  toggleCapture: () => void;
}

export function CaptureContent({ isCaptureMode, toggleCapture }: CaptureProps) {
  return (
    <>
      {!isCaptureMode ? (
        <Button variant="ghost" className="w-full" onClick={toggleCapture}>
          Captura
        </Button>
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
