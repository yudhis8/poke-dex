"use client";

import { useEffect, useState, useCallback } from "react";
import { request } from "graphql-request";
import PokemonCard from "@/app/components/molecules/PokemonCard.molecule";
import FilterSort from "@/app/components/molecules/FilterSort.molecule";
import Spinner from "@/app/components/atomics/Spinner.atomic";
import Button from "@/app/components/atomics/Button.atomic";
import { usePokedex } from "@/app/context/PokedexContext";
import {
  GRAPHQL_ENDPOINT,
  GET_POKEMON_LIST,
  GET_POKEMON_LIST_BY_TYPE,
} from "@/app/constants/graphql";
import { POKEMON_PER_PAGE } from "@/app/constants/pokemon";
import { buildOrderBy } from "@/app/utils/pokemon";
import type { PokemonListResponse } from "@/app/types/pokemon";

export default function HomePage() {
  const { searchQuery, selectedTypes, sortBy, sortOrder } = usePokedex();
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedTypes, sortBy, sortOrder]);

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const variables = {
        limit: POKEMON_PER_PAGE,
        offset: page * POKEMON_PER_PAGE,
        nameSearch: `%${searchQuery}%`,
        orderBy: buildOrderBy(sortBy, sortOrder),
      };

      let result: PokemonListResponse;
      if (selectedTypes.length > 0) {
        result = await request<PokemonListResponse>(
          GRAPHQL_ENDPOINT,
          GET_POKEMON_LIST_BY_TYPE,
          { ...variables, types: selectedTypes },
        );
      } else {
        result = await request<PokemonListResponse>(
          GRAPHQL_ENDPOINT,
          GET_POKEMON_LIST,
          variables,
        );
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Pokémon data",
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedTypes, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const totalCount = data?.pokemon_v2_pokemon_aggregate.aggregate.count ?? 0;
  const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE);
  const pokemons = data?.pokemon_v2_pokemon ?? [];

  return (
    <main className='flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-black text-white tracking-tight mb-1'>
          POKÉDEX
        </h1>
        <p className='text-gray-500 text-sm'>
          Search, filter, and compare all your favorite Pokémon
        </p>
      </div>

      {/* Filters */}
      <div className='mb-8 bg-slate-800/50 rounded-2xl p-4 border border-slate-700'>
        <FilterSort />
      </div>

      {/* Results info */}
      {!loading && !error && (
        <div className='flex items-center justify-between mb-5'>
          <p className='text-sm text-gray-500'>
            Showing{" "}
            <span className='text-white font-semibold'>
              {page * POKEMON_PER_PAGE + 1}–
              {Math.min((page + 1) * POKEMON_PER_PAGE, totalCount)}
            </span>{" "}
            of <span className='text-white font-semibold'>{totalCount}</span>{" "}
            Pokémon
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className='flex flex-col items-center justify-center py-24 gap-4'>
          <p className='text-red-400 text-sm font-medium'>{error}</p>
          <Button variant='primary' onClick={fetchPokemons}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className='flex items-center justify-center py-24'>
          <Spinner size='lg' />
        </div>
      )}

      {/* Pokemon grid */}
      {!loading && !error && pokemons.length === 0 && (
        <div className='flex flex-col items-center justify-center py-24 gap-3'>
          <span className='text-6xl'>🔍</span>
          <p className='text-gray-400 text-lg font-semibold'>
            No Pokémon found
          </p>
          <p className='text-gray-600 text-sm'>Try adjusting your filters</p>
        </div>
      )}

      {!loading && !error && pokemons.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-10'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            «
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ‹ Prev
          </Button>

          {/* Page number buttons */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(0, Math.min(page - 2, totalPages - 5));
            const pageNum = start + i;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                  pageNum === page
                    ? "bg-red-600 text-white"
                    : "bg-slate-800 border border-slate-600 text-gray-400 hover:text-white hover:border-slate-500"
                }`}
              >
                {pageNum + 1}
              </button>
            );
          })}

          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next ›
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage(totalPages - 1)}
            disabled={page >= totalPages - 1}
          >
            »
          </Button>
        </div>
      )}
    </main>
  );
}
