import { ReactNode } from "react";

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
    <div>
      <label htmlFor={inputId}>{label}</label>
      {children}
      <p className="min-h-1rem" aria-live="polite">
        {errorMessage}
      </p>
    </div>
  );
}
