"use client";

import Image from "next/image";
import Link from "next/link";
import { usePokedex } from "@/app/context/PokedexContext";
import {
  getPokemonSprite,
  formatPokemonName,
  formatPokemonId,
} from "@/app/utils/pokemon";
import { MAX_COMPARE } from "@/app/constants/pokemon";

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = usePokedex();

  if (compareList.length === 0) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 border-t border-slate-700 backdrop-blur-md shadow-2xl'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
        <div className='flex items-center gap-4'>
          <span className='text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0'>
            Compare ({compareList.length}/{MAX_COMPARE})
          </span>

          {/* Pokemon slots */}
          <div className='flex gap-3 flex-1 overflow-x-auto'>
            {compareList.map((p) => (
              <div
                key={p.id}
                className='flex items-center gap-2 bg-slate-800 rounded-xl px-3 py-2 border border-slate-700 shrink-0'
              >
                <div className='relative w-10 h-10'>
                  <Image
                    src={getPokemonSprite(p.id)}
                    alt={p.name}
                    fill
                    className='object-contain'
                    unoptimized
                  />
                </div>
                <div className='leading-none'>
                  <p className='text-[10px] text-gray-500'>
                    {formatPokemonId(p.id)}
                  </p>
                  <p className='text-xs font-semibold text-white'>
                    {formatPokemonName(p.name)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  className='ml-1 text-gray-500 hover:text-red-400 transition-colors'
                  aria-label={`Remove ${p.name} from compare`}
                >
                  <svg
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2.5'
                  >
                    <line x1='18' y1='6' x2='6' y2='18' />
                    <line x1='6' y1='6' x2='18' y2='18' />
                  </svg>
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: MAX_COMPARE - compareList.length }).map(
              (_, i) => (
                <div
                  key={`empty-${i}`}
                  className='flex items-center justify-center w-32 h-14 bg-slate-800/50 rounded-xl border border-dashed border-slate-700 shrink-0'
                >
                  <span className='text-xs text-gray-600'>Empty</span>
                </div>
              ),
            )}
          </div>

          {/* Actions */}
          <div className='flex gap-2 shrink-0'>
            <button
              onClick={clearCompare}
              className='text-xs font-semibold text-gray-500 hover:text-red-400 transition-colors px-2 py-1'
            >
              Clear
            </button>
            <Link
              href='/compare'
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                compareList.length >= 2
                  ? "bg-red-600 hover:bg-red-500 text-white"
                  : "bg-slate-700 text-gray-500 cursor-not-allowed pointer-events-none"
              }`}
              aria-disabled={compareList.length < 2}
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
