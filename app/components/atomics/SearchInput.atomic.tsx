import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export default function SearchInput({
  onClear,
  value,
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search icon */}
      <svg
        className='absolute left-3 text-gray-400 pointer-events-none'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='11' cy='11' r='8' />
        <line x1='21' y1='21' x2='16.65' y2='16.65' />
      </svg>
      <input
        value={value}
        className='w-full bg-slate-800 border border-slate-600 text-white placeholder-gray-500 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors'
        {...props}
      />
      {/* Clear button */}
      {value && onClear && (
        <button
          type='button'
          onClick={onClear}
          className='absolute right-3 text-gray-400 hover:text-white transition-colors'
          aria-label='Clear search'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
          >
            <line x1='18' y1='6' x2='6' y2='18' />
            <line x1='6' y1='6' x2='18' y2='18' />
          </svg>
        </button>
      )}
    </div>
  );
}
