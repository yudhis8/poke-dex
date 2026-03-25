"use client";

import Image from "next/image";
import Link from "next/link";
import TypeBadge from "@/app/components/atomics/TypeBadge.atomic";
import { usePokedex } from "@/app/context/PokedexContext";
import {
  getPokemonSprite,
  formatPokemonName,
  formatPokemonId,
  getPrimaryTypeColor,
} from "@/app/utils/pokemon";
import type { PokemonListItem } from "@/app/types/pokemon";
import { MAX_COMPARE } from "@/app/constants/pokemon";

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } =
    usePokedex();
  const inCompare = isInCompare(pokemon.id);
  const canAdd = compareList.length < MAX_COMPARE;

  const primaryColor = getPrimaryTypeColor(pokemon.pokemon_v2_pokemontypes);
  const spriteUrl = getPokemonSprite(pokemon.id);

  function handleCompareToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(pokemon.id);
    } else if (canAdd) {
      addToCompare(pokemon);
    }
  }

  return (
    <Link href={`/pokemon/${pokemon.id}`} className='group block'>
      <div className='relative rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 cursor-pointer h-full'>
        {/* Card top: type-colored background with sprite */}
        <div
          className='relative flex items-center justify-center pt-6 pb-4 px-4'
          style={{ backgroundColor: `${primaryColor}22` }}
        >
          {/* Background pokeball watermark */}
          <div
            className='absolute -right-4 -bottom-4 w-28 h-28 rounded-full border-16 opacity-10'
            style={{ borderColor: primaryColor }}
          />
          <div
            className='absolute -right-4 -bottom-4 w-7 h-7 rounded-full'
            style={{ backgroundColor: primaryColor, opacity: 0.1 }}
          />

          {/* ID badge */}
          <span className='absolute top-3 left-3 text-xs font-bold text-gray-400'>
            {formatPokemonId(pokemon.id)}
          </span>

          {/* Compare toggle button */}
          <button
            onClick={handleCompareToggle}
            disabled={!inCompare && !canAdd}
            title={
              inCompare
                ? "Remove from compare"
                : canAdd
                  ? "Add to compare"
                  : `Max ${MAX_COMPARE} Pokemon to compare`
            }
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 border ${
              inCompare
                ? "bg-red-600 border-red-500 text-white"
                : canAdd
                  ? "bg-slate-700 border-slate-600 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-slate-600 hover:text-white"
                  : "bg-slate-800 border-slate-700 text-gray-600 cursor-not-allowed opacity-0 group-hover:opacity-60"
            }`}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          >
            {inCompare ? (
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
            ) : (
              <svg
                width='12'
                height='12'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
              >
                <line x1='12' y1='5' x2='12' y2='19' />
                <line x1='5' y1='12' x2='19' y2='12' />
              </svg>
            )}
          </button>

          {/* Pokemon image */}
          <div className='relative w-28 h-28'>
            <Image
              src={spriteUrl}
              alt={formatPokemonName(pokemon.name)}
              fill
              className='object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110'
              unoptimized
            />
          </div>
        </div>

        {/* Card bottom: info */}
        <div className='px-4 pb-4 pt-3'>
          <h3 className='text-sm font-bold text-white mb-2 truncate'>
            {formatPokemonName(pokemon.name)}
          </h3>
          <div className='flex flex-wrap gap-1'>
            {pokemon.pokemon_v2_pokemontypes
              .sort((a, b) => a.slot - b.slot)
              .map((t) => (
                <TypeBadge
                  key={t.pokemon_v2_type.name}
                  type={t.pokemon_v2_type.name}
                  size='sm'
                />
              ))}
          </div>
        </div>

        {/* Hover highlight border */}
        <div
          className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none border-2'
          style={{ borderColor: primaryColor }}
        />
      </div>
    </Link>
  );
}
