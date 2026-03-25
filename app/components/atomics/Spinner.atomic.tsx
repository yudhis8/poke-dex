interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-14 h-14 border-4",
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      className={`${sizeMap[size]} rounded-full border-slate-600 border-t-red-500 animate-spin ${className}`}
      role='status'
      aria-label='Loading'
    />
  );
}
