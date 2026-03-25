"use client";

import { Fragment } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePokedex } from "@/app/context/PokedexContext";
import TypeBadge from "@/app/components/atomics/TypeBadge.atomic";
import StatBar from "@/app/components/atomics/StatBar.atomic";
import Button from "@/app/components/atomics/Button.atomic";
import {
  getPokemonSprite,
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  getPrimaryTypeColor,
  getPokemonTotalStats,
} from "@/app/utils/pokemon";
import { STAT_LABELS } from "@/app/constants/pokemon";

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = usePokedex();

  if (compareList.length === 0) {
    return (
      <main className='flex-1 flex flex-col items-center justify-center gap-6 px-4'>
        <div className='text-8xl'>⚖️</div>
        <h1 className='text-2xl font-black text-white'>
          No Pokémon to Compare
        </h1>
        <p className='text-gray-500 text-sm text-center max-w-xs'>
          Add Pokémon from the home page or a detail page to compare their stats
          side by side.
        </p>
        <Link href='/'>
          <Button variant='primary'>Browse Pokémon</Button>
        </Link>
      </main>
    );
  }

  if (compareList.length === 1) {
    return (
      <main className='flex-1 flex flex-col items-center justify-center gap-6 px-4'>
        <div className='text-8xl'>+</div>
        <h1 className='text-2xl font-black text-white'>Add More Pokémon</h1>
        <p className='text-gray-500 text-sm text-center max-w-xs'>
          You have{" "}
          <span className='text-white font-bold'>
            {formatPokemonName(compareList[0].name)}
          </span>{" "}
          in compare. Add at least one more to start comparing.
        </p>
        <Link href='/'>
          <Button variant='primary'>Add More</Button>
        </Link>
      </main>
    );
  }

  const allStatNames =
    compareList[0]?.pokemon_v2_pokemonstats.map(
      (s) => s.pokemon_v2_stat.name,
    ) ?? [];

  // For each stat, find the max value across all pokemon in compare
  const statMaxMap: Record<string, number> = {};
  allStatNames.forEach((statName) => {
    statMaxMap[statName] = Math.max(
      ...compareList.map(
        (p) =>
          p.pokemon_v2_pokemonstats.find(
            (s) => s.pokemon_v2_stat.name === statName,
          )?.base_stat ?? 0,
      ),
    );
  });

  const totals = compareList.map((p) =>
    getPokemonTotalStats(p.pokemon_v2_pokemonstats),
  );
  const maxTotal = Math.max(...totals);

  return (
    <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-black text-white tracking-tight'>
            Compare Pokémon
          </h1>
          <p className='text-gray-500 text-sm mt-1'>
            Side-by-side stat comparison
          </p>
        </div>
        <Button variant='ghost' size='sm' onClick={clearCompare}>
          Clear All
        </Button>
      </div>

      {/* Compare table */}
      <div className='overflow-x-auto'>
        <div
          className='grid gap-4'
          style={{
            gridTemplateColumns: `180px repeat(${compareList.length}, minmax(0, 1fr))`,
          }}
        >
          {/* Header row: pokemon cards */}
          <div className='flex items-end pb-4'>
            <span className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
              Stats
            </span>
          </div>
          {compareList.map((pokemon) => {
            const primaryColor = getPrimaryTypeColor(
              pokemon.pokemon_v2_pokemontypes,
            );
            return (
              <div
                key={pokemon.id}
                className='flex flex-col items-center gap-3 pb-4'
              >
                {/* Pokemon header card */}
                <div
                  className='w-full rounded-2xl p-4 flex flex-col items-center gap-2 border relative'
                  style={{
                    backgroundColor: `${primaryColor}22`,
                    borderColor: `${primaryColor}44`,
                  }}
                >
                  <button
                    onClick={() => removeFromCompare(pokemon.id)}
                    className='absolute top-2 right-2 text-gray-500 hover:text-red-400 transition-colors'
                    aria-label={`Remove ${pokemon.name}`}
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
                  <div className='relative w-24 h-24'>
                    <Image
                      src={getPokemonSprite(pokemon.id)}
                      alt={formatPokemonName(pokemon.name)}
                      fill
                      className='object-contain'
                      unoptimized
                    />
                  </div>
                  <Link
                    href={`/pokemon/${pokemon.id}`}
                    className='text-center hover:opacity-80 transition-opacity'
                  >
                    <p className='text-xs text-gray-500 font-semibold'>
                      {formatPokemonId(pokemon.id)}
                    </p>
                    <p className='text-sm font-black text-white'>
                      {formatPokemonName(pokemon.name)}
                    </p>
                  </Link>
                  <div className='flex flex-wrap justify-center gap-1'>
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
              </div>
            );
          })}

          {/* Physical info rows */}
          {[
            {
              label: "Height",
              values: compareList.map((p) => formatHeight(p.height)),
            },
            {
              label: "Weight",
              values: compareList.map((p) => formatWeight(p.weight)),
            },
            {
              label: "Base XP",
              values: compareList.map((p) => p.base_experience ?? "N/A"),
            },
          ].map(({ label, values }) => (
            <Fragment key={label}>
              <div className='flex items-center text-xs font-semibold text-gray-400 py-2 border-b border-slate-800'>
                {label}
              </div>
              {values.map((val, i) => (
                <div
                  key={`val-${label}-${i}`}
                  className='flex items-center justify-center text-sm font-semibold text-white py-2 border-b border-slate-800'
                >
                  {val}
                </div>
              ))}
            </Fragment>
          ))}

          {/* Stat rows */}
          {allStatNames.map((statName) => {
            const statValues = compareList.map(
              (p) =>
                p.pokemon_v2_pokemonstats.find(
                  (s) => s.pokemon_v2_stat.name === statName,
                )?.base_stat ?? 0,
            );
            const maxVal = statMaxMap[statName];

            return (
              <Fragment key={statName}>
                <div className='flex items-center text-xs font-semibold text-gray-400 py-3 border-b border-slate-800 pr-4'>
                  {STAT_LABELS[statName] ?? statName.toUpperCase()}
                </div>
                {statValues.map((val, i) => (
                  <div
                    key={`stat-${statName}-${i}`}
                    className='flex items-center py-3 border-b border-slate-800 px-2'
                  >
                    <StatBar
                      statName={statName}
                      value={val}
                      showLabel={false}
                      isMax={val === maxVal && compareList.length > 1}
                    />
                  </div>
                ))}
              </Fragment>
            );
          })}

          {/* Total row */}
          <div className='flex items-center text-xs font-bold text-gray-300 uppercase tracking-wider pt-3'>
            Total
          </div>
          {totals.map((total, i) => (
            <div
              key={`total-${i}`}
              className={`flex items-center justify-center pt-3 text-lg font-black ${
                total === maxTotal ? "text-yellow-400" : "text-white"
              }`}
            >
              {total}
              {total === maxTotal && compareList.length > 1 && (
                <span className='ml-1 text-xs'>👑</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8 flex justify-center'>
        <Link href='/'>
          <Button variant='outline'>← Back to Pokédex</Button>
        </Link>
      </div>
    </main>
  );
}
