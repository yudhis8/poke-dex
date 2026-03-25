import { TYPE_COLORS, STAT_MAX } from "../constants/pokemon";
import type { SortOption, SortOrder } from "../types/pokemon";

export function getPokemonSprite(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type.toLowerCase()] ?? "#68A090";
}

export function getPrimaryTypeColor(
  types: { pokemon_v2_type: { name: string } }[],
): string {
  if (!types || types.length === 0) return "#68A090";
  return getTypeColor(types[0].pokemon_v2_type.name);
}

export function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatPokemonId(id: number): string {
  return "#" + id.toString().padStart(4, "0");
}

export function formatHeight(height: number): string {
  const meters = height / 10;
  const totalInches = meters * 39.3701;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${meters.toFixed(1)} m (${feet}'${inches}")`;
}

export function formatWeight(weight: number): string {
  const kg = weight / 10;
  const lbs = (kg * 2.20462).toFixed(1);
  return `${kg.toFixed(1)} kg (${lbs} lbs)`;
}

export function getStatPercentage(statName: string, value: number): number {
  const max = STAT_MAX[statName] ?? 255;
  return Math.min((value / max) * 100, 100);
}

export function buildOrderBy(sortBy: SortOption, sortOrder: SortOrder) {
  const direction = sortOrder === "asc" ? "asc_nulls_last" : "desc_nulls_last";
  return [{ [sortBy]: direction }];
}

export function getPokemonTotalStats(stats: { base_stat: number }[]): number {
  return stats.reduce((sum, s) => sum + s.base_stat, 0);
}
