import { STAT_COLORS, STAT_LABELS } from "@/app/constants/pokemon";
import { getStatPercentage } from "@/app/utils/pokemon";

interface StatBarProps {
  statName: string;
  value: number;
  showLabel?: boolean;
  compareValue?: number;
  isMax?: boolean;
}

export default function StatBar({
  statName,
  value,
  showLabel = true,
  compareValue,
  isMax = false,
}: StatBarProps) {
  const pct = getStatPercentage(statName, value);
  const color = STAT_COLORS[statName] ?? "#9DB7F5";
  const label = STAT_LABELS[statName] ?? statName.toUpperCase();

  return (
    <div className='flex items-center gap-2 w-full'>
      {showLabel && (
        <span className='text-xs font-semibold text-gray-400 w-16 shrink-0 text-right'>
          {label}
        </span>
      )}
      <span
        className={`text-xs font-bold w-8 shrink-0 text-right ${isMax ? "text-yellow-400" : "text-white"}`}
      >
        {value}
      </span>
      <div className='flex-1 h-2.5 bg-gray-700 rounded-full overflow-hidden'>
        <div
          className='h-full rounded-full transition-all duration-700 ease-out'
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {compareValue !== undefined && (
        <span
          className={`text-xs font-bold w-8 shrink-0 ${
            compareValue > value
              ? "text-green-400"
              : compareValue < value
                ? "text-red-400"
                : "text-gray-400"
          }`}
        >
          {compareValue}
        </span>
      )}
    </div>
  );
}
