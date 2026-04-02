import { getContrastColor } from "@/lib/utils/getContrastColor";
import { X } from "lucide-react";

export function Chip({
  name,
  onDelete,
  color,
}: {
  name: string;
  onDelete?: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onDelete) onDelete();
      }}
      style={{
        backgroundColor: color ? color : undefined,
        color: color ? getContrastColor(color) : undefined,
        fontSize: "12px",
        fontWeight: "600",
      }}
      className="rounded-xs px-1 py-0.5 text-xs bg-secondary text-text-fixed-light flex items-center uppercase gap-1 tracking-wider"
    >
      {onDelete && <X size={12} fontWeight={10} />}
      {name}
    </button>
  );
}
