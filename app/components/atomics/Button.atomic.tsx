import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-red-600 hover:bg-red-500 text-white border-transparent",
  secondary: "bg-slate-700 hover:bg-slate-600 text-white border-transparent",
  danger: "bg-rose-700 hover:bg-rose-600 text-white border-transparent",
  ghost: "bg-transparent hover:bg-slate-700 text-gray-300 border-transparent",
  outline:
    "bg-transparent hover:bg-slate-700 text-gray-300 border-slate-600 hover:border-slate-500",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg",
  md: "text-sm px-4 py-2 rounded-xl",
  lg: "text-base px-6 py-3 rounded-xl",
};

export default function Button({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
