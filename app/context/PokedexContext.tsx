"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { PokemonListItem, SortOption, SortOrder } from "../types/pokemon";
import { MAX_COMPARE } from "../constants/pokemon";

interface PokedexContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  clearTypes: () => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  sortOrder: SortOrder;
  setSortOrder: (o: SortOrder) => void;
  compareList: PokemonListItem[];
  addToCompare: (p: PokemonListItem) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
}

const PokedexContext = createContext<PokedexContextType | null>(null);

export function PokedexProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [compareList, setCompareList] = useState<PokemonListItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("pokedex-compare");
      return saved ? (JSON.parse(saved) as PokemonListItem[]) : [];
    } catch {
      return [];
    }
  });

  // Persist compare list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pokedex-compare", JSON.stringify(compareList));
    } catch {
      // silently ignore storage errors
    }
  }, [compareList]);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const clearTypes = useCallback(() => setSelectedTypes([]), []);

  const addToCompare = useCallback((pokemon: PokemonListItem) => {
    setCompareList((prev) => {
      if (prev.some((p) => p.id === pokemon.id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, pokemon];
    });
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => setCompareList([]), []);

  const isInCompare = useCallback(
    (id: number) => compareList.some((p) => p.id === id),
    [compareList],
  );

  return (
    <PokedexContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedTypes,
        toggleType,
        clearTypes,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </PokedexContext.Provider>
  );
}

export function usePokedex(): PokedexContextType {
  const ctx = useContext(PokedexContext);
  if (!ctx) throw new Error("usePokedex must be used within PokedexProvider");
  return ctx;
}
