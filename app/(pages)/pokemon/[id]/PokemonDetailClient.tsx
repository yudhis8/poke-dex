"use client";

import { use, useEffect, useState } from "react";
import { request } from "graphql-request";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TypeBadge from "@/app/components/atomics/TypeBadge.atomic";
import StatBar from "@/app/components/atomics/StatBar.atomic";
import Spinner from "@/app/components/atomics/Spinner.atomic";
import Button from "@/app/components/atomics/Button.atomic";
import { usePokedex } from "@/app/context/PokedexContext";
import { GRAPHQL_ENDPOINT, GET_POKEMON_DETAIL } from "@/app/constants/graphql";
import {
  getPokemonSprite,
  formatPokemonName,
  formatPokemonId,
  formatHeight,
  formatWeight,
  getPrimaryTypeColor,
  getPokemonTotalStats,
} from "@/app/utils/pokemon";
import type {
  Pokemon,
  PokemonDetailResponse,
  PokemonListItem,
} from "@/app/types/pokemon";
import { MAX_COMPARE } from "@/app/constants/pokemon";

interface PokemonDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailClient({ params }: PokemonDetailClientProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCompare, removeFromCompare, isInCompare, compareList } =
    usePokedex();

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  const numericId = parseInt(id, 10);
  const inCompare = isInCompare(numericId);
  const canAdd = compareList.length < MAX_COMPARE;

  useEffect(() => {
    if (isNaN(numericId)) return;

    const controller = new AbortController();
    setStatus("loading");

    request<PokemonDetailResponse>(GRAPHQL_ENDPOINT, GET_POKEMON_DETAIL, {
      id: numericId,
    })
      .then((res) => {
        if (controller.signal.aborted) return;
        if (!res.pokemon_v2_pokemon_by_pk) {
          setError("Pokémon not found");
          setStatus("error");
          return;
        }
        setPokemon(res.pokemon_v2_pokemon_by_pk);
        setStatus("success");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(
          err instanceof Error ? err.message : "Failed to fetch Pokémon",
        );
        setStatus("error");
      });

    return () => controller.abort();
  }, [numericId]);

  if (isNaN(numericId)) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4'>
        <p className='text-red-400'>Invalid Pokémon ID</p>
        <Button variant='secondary' onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className='flex-1 flex items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (status === "error" || !pokemon) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-4'>
        <p className='text-red-400'>{error ?? "Something went wrong"}</p>
        <Button variant='secondary' onClick={() => router.back()}>
          Go back
        </Button>
      </div>
    );
  }

  const primaryColor = getPrimaryTypeColor(pokemon.pokemon_v2_pokemontypes);
  const totalStats = getPokemonTotalStats(pokemon.pokemon_v2_pokemonstats);
  const flavorText =
    pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesflavortexts[0]?.flavor_text?.replace(
      /\f/g,
      " ",
    ) ?? "";
  const evolutionChain =
    pokemon.pokemon_v2_pokemonspecy?.pokemon_v2_evolutionchain
      ?.pokemon_v2_pokemonspecies ?? [];

  const listItem: PokemonListItem = {
    id: pokemon.id,
    name: pokemon.name,
    base_experience: pokemon.base_experience,
    height: pokemon.height,
    weight: pokemon.weight,
    pokemon_v2_pokemontypes: pokemon.pokemon_v2_pokemontypes,
    pokemon_v2_pokemonstats: pokemon.pokemon_v2_pokemonstats,
    pokemon_v2_pokemonsprites: pokemon.pokemon_v2_pokemonsprites,
  };

  return (
    <main className='flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group'
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          className='group-hover:-translate-x-1 transition-transform'
        >
          <line x1='19' y1='12' x2='5' y2='12' />
          <polyline points='12 19 5 12 12 5' />
        </svg>
        <span className='text-sm font-semibold'>Back</span>
      </button>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left column: image + physical info */}
        <div className='space-y-6'>
          {/* Image card */}
          <div
            className='relative rounded-3xl overflow-hidden p-8 flex items-center justify-center min-h-64'
            style={{
              backgroundColor: `${primaryColor}22`,
              border: `1px solid ${primaryColor}44`,
            }}
          >
            {/* Pokéball watermark */}
            <div
              className='absolute -right-10 -bottom-10 w-56 h-56 rounded-full opacity-10 border-30'
              style={{ borderColor: primaryColor }}
            />
            <div className='relative w-52 h-52'>
              <Image
                src={getPokemonSprite(pokemon.id)}
                alt={formatPokemonName(pokemon.name)}
                fill
                className='object-contain drop-shadow-2xl'
                priority
                unoptimized
              />
            </div>
          </div>

          {/* Physical stats */}
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: "Height", value: formatHeight(pokemon.height) },
              { label: "Weight", value: formatWeight(pokemon.weight) },
              { label: "Base XP", value: pokemon.base_experience ?? "N/A" },
              {
                label: "Capture Rate",
                value: pokemon.pokemon_v2_pokemonspecy?.capture_rate ?? "N/A",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className='bg-slate-800 rounded-2xl p-3 border border-slate-700'
              >
                <p className='text-xs font-semibold text-gray-500 mb-1'>
                  {label}
                </p>
                <p className='text-sm font-bold text-white'>{value}</p>
              </div>
            ))}
          </div>

          {/* Abilities */}
          <div className='bg-slate-800 rounded-2xl p-4 border border-slate-700'>
            <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>
              Abilities
            </h3>
            <div className='flex flex-wrap gap-2'>
              {pokemon.pokemon_v2_pokemonabilities.map((a) => (
                <span
                  key={a.pokemon_v2_ability.name}
                  className={`text-sm px-3 py-1.5 rounded-xl font-semibold ${
                    a.is_hidden
                      ? "bg-slate-700 text-gray-400 border border-dashed border-slate-600"
                      : "bg-slate-700 text-white border border-slate-600"
                  }`}
                >
                  {formatPokemonName(a.pokemon_v2_ability.name)}
                  {a.is_hidden && (
                    <span className='text-[10px] text-gray-500 ml-1'>
                      (hidden)
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: info + stats */}
        <div className='space-y-6'>
          {/* Header */}
          <div>
            <p className='text-sm font-bold text-gray-500 mb-1'>
              {formatPokemonId(pokemon.id)}
            </p>
            <h1 className='text-4xl font-black text-white tracking-tight mb-3'>
              {formatPokemonName(pokemon.name)}
            </h1>
            <div className='flex flex-wrap gap-2 mb-4'>
              {pokemon.pokemon_v2_pokemontypes
                .sort((a, b) => a.slot - b.slot)
                .map((t) => (
                  <TypeBadge
                    key={t.pokemon_v2_type.name}
                    type={t.pokemon_v2_type.name}
                    size='lg'
                  />
                ))}
            </div>
            {/* Compare button */}
            <div className='flex gap-3'>
              <Button
                variant={inCompare ? "danger" : "primary"}
                size='sm'
                onClick={() =>
                  inCompare
                    ? removeFromCompare(pokemon.id)
                    : addToCompare(listItem)
                }
                disabled={!inCompare && !canAdd}
                title={
                  !canAdd && !inCompare
                    ? `Max ${MAX_COMPARE} Pokémon`
                    : undefined
                }
              >
                {inCompare ? (
                  <>
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
                    Remove from Compare
                  </>
                ) : (
                  <>
                    <svg
                      width='14'
                      height='14'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2.5'
                    >
                      <line x1='12' y1='5' x2='12' y2='19' />
                      <line x1='5' y1='12' x2='19' y2='12' />
                    </svg>
                    Add to Compare
                  </>
                )}
              </Button>
              {compareList.length >= 2 && (
                <Link href='/compare'>
                  <Button variant='secondary' size='sm'>
                    View Compare
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Flavor text */}
          {flavorText && (
            <div className='bg-slate-800/50 rounded-2xl p-4 border border-slate-700'>
              <p className='text-sm text-gray-300 leading-relaxed italic'>
                &ldquo;{flavorText}&rdquo;
              </p>
            </div>
          )}

          {/* Base stats */}
          <div className='bg-slate-800 rounded-2xl p-4 border border-slate-700'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                Base Stats
              </h3>
              <span className='text-xs font-bold text-gray-400'>
                Total:{" "}
                <span className='text-white font-black'>{totalStats}</span>
              </span>
            </div>
            <div className='space-y-2.5'>
              {pokemon.pokemon_v2_pokemonstats.map((s) => (
                <StatBar
                  key={s.pokemon_v2_stat.name}
                  statName={s.pokemon_v2_stat.name}
                  value={s.base_stat}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution chain */}
      {evolutionChain.length > 1 && (
        <div className='mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700'>
          <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-5'>
            Evolution Chain
          </h3>
          <div className='flex items-center justify-center flex-wrap gap-4'>
            {evolutionChain.map((species, idx) => {
              const evoId = species.pokemon_v2_pokemons[0]?.id;
              if (!evoId) return null;
              return (
                <div key={species.id} className='flex items-center gap-4'>
                  {idx > 0 && (
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      className='text-gray-600'
                    >
                      <polyline points='9 18 15 12 9 6' />
                    </svg>
                  )}
                  <Link
                    href={`/pokemon/${evoId}`}
                    className={`flex flex-col items-center gap-2 group ${
                      evoId === pokemon.id
                        ? "opacity-100"
                        : "opacity-70 hover:opacity-100"
                    } transition-opacity`}
                  >
                    <div
                      className={`relative w-18 h-18 rounded-2xl p-2 ${
                        evoId === pokemon.id
                          ? "ring-2 ring-offset-1 ring-offset-slate-800"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          evoId === pokemon.id
                            ? `${primaryColor}22`
                            : "#ffffff08",
                      }}
                    >
                      <div className='relative w-14 h-14'>
                        <Image
                          src={getPokemonSprite(evoId)}
                          alt={formatPokemonName(species.name)}
                          fill
                          className='object-contain'
                          unoptimized
                        />
                      </div>
                    </div>
                    <span className='text-xs font-semibold text-gray-400 group-hover:text-white transition-colors'>
                      {formatPokemonName(species.name)}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      <div className='flex justify-between mt-8'>
        {numericId > 1 && (
          <Link href={`/pokemon/${numericId - 1}`}>
            <Button variant='outline' size='sm'>
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
              >
                <line x1='19' y1='12' x2='5' y2='12' />
                <polyline points='12 19 5 12 12 5' />
              </svg>
              {formatPokemonId(numericId - 1)}
            </Button>
          </Link>
        )}
        <div className='flex-1' />
        <Link href={`/pokemon/${numericId + 1}`}>
          <Button variant='outline' size='sm'>
            {formatPokemonId(numericId + 1)}
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
            >
              <line x1='5' y1='12' x2='19' y2='12' />
              <polyline points='12 5 19 12 12 19' />
            </svg>
          </Button>
        </Link>
      </div>
    </main>
  );
}
