"use client";

import { useCallback, useRef, useState } from "react";
import SearchInput from "@/app/components/atomics/SearchInput.atomic";
import TypeBadge from "@/app/components/atomics/TypeBadge.atomic";
import Button from "@/app/components/atomics/Button.atomic";
import { usePokedex } from "@/app/context/PokedexContext";
import { ALL_TYPES, SORT_OPTIONS } from "@/app/constants/pokemon";

export default function FilterSort() {
  const {
    setSearchQuery,
    selectedTypes,
    toggleType,
    clearTypes,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = usePokedex();

  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearchQuery(val), 350);
    },
    [setSearchQuery],
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    setSearchQuery("");
  }, [setSearchQuery]);

  return (
    <div className='space-y-4'>
      {/* Search */}
      <SearchInput
        placeholder='Search Pokémon by name...'
        onChange={handleSearch}
        onClear={handleClear}
        value={inputValue}
        aria-label='Search Pokémon'
      />

      {/* Type filter row */}
      <div className='flex flex-wrap gap-2 items-center'>
        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
          Type:
        </span>
        {ALL_TYPES.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            size='sm'
            active={selectedTypes.length === 0 || selectedTypes.includes(type)}
            onClick={() => toggleType(type)}
          />
        ))}
        {selectedTypes.length > 0 && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearTypes}
            className='ml-1'
          >
            Clear
          </Button>
        )}
      </div>

      {/* Sort row */}
      <div className='flex items-center gap-3'>
        <span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
          Sort:
        </span>
        <div className='flex gap-2 flex-wrap'>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors border ${
                sortBy === opt.value
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-slate-800 border-slate-600 text-gray-400 hover:text-white hover:border-slate-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {/* Direction toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className='flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-semibold bg-slate-800 border border-slate-600 text-gray-400 hover:text-white hover:border-slate-500 transition-colors'
          aria-label='Toggle sort order'
        >
          {sortOrder === "asc" ? (
            <>
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
              >
                <line x1='12' y1='5' x2='12' y2='19' />
                <polyline points='5 12 12 5 19 12' />
              </svg>
              ASC
            </>
          ) : (
            <>
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
              >
                <line x1='12' y1='5' x2='12' y2='19' />
                <polyline points='19 12 12 19 5 12' />
              </svg>
              DESC
            </>
          )}
        </button>
      </div>
    </div>
  );
}
