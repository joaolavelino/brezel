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
        color: color ? getContrastColor(color) : "white",
        fontSize: "14px",
        fontWeight: "bold",
      }}
      className="rounded-xs px-2 py-0.5 text-xs bg-secondary text-text-fixed-light flex items-center font-bold capitalize gap-2A"
    >
      {name}
      {onDelete && <X size={12} fontWeight={10} />}
    </button>
  );
}
