import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FieldWrapperProps {
  inputId: string;
  label: string;
  errorMessage?: string;
  children: ReactNode;
}

export function FieldWrapper({
  errorMessage,
  children,
  label,
  inputId,
}: FieldWrapperProps) {
  return (
    <motion.div className="flex flex-col items-start w-full">
      <label htmlFor={inputId} className="font-bold">
        {label}
      </label>
      {children}
      <div className="min-h-4">
        {errorMessage && (
          <p aria-live="polite" className="text-xs">
            {errorMessage}
          </p>
        )}
      </div>
    </motion.div>
  );
}
