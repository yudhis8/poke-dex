import { getTypeColor } from "@/app/utils/pokemon";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  active?: boolean;
}

export default function TypeBadge({
  type,
  size = "md",
  onClick,
  active = true,
}: TypeBadgeProps) {
  const color = getTypeColor(type);

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  const style = active
    ? { backgroundColor: color }
    : { backgroundColor: color, opacity: 0.35 };

  return (
    <span
      className={`inline-block rounded-full font-semibold text-white uppercase tracking-wider cursor-default select-none transition-opacity ${sizeClasses[size]} ${onClick ? "cursor-pointer hover:opacity-90" : ""}`}
      style={style}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {type}
    </span>
  );
}
