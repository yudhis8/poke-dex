export interface PokemonTypeInfo {
  slot: number;
  pokemon_v2_type: {
    name: string;
  };
}

export interface PokemonStatInfo {
  base_stat: number;
  pokemon_v2_stat: {
    name: string;
  };
}

export interface PokemonAbilityInfo {
  is_hidden: boolean;
  slot: number;
  pokemon_v2_ability: {
    name: string;
  };
}

export interface PokemonSprite {
  sprites: string;
}

export interface FlavorTextEntry {
  flavor_text: string;
}

export interface EvolutionSpecies {
  id: number;
  name: string;
  order: number;
  pokemon_v2_pokemons: {
    id: number;
    pokemon_v2_pokemonsprites: PokemonSprite[];
  }[];
}

export interface PokemonSpecies {
  capture_rate: number;
  base_happiness: number;
  gender_rate: number;
  pokemon_v2_pokemonspeciesflavortexts: FlavorTextEntry[];
  pokemon_v2_evolutionchain?: {
    pokemon_v2_pokemonspecies: EvolutionSpecies[];
  };
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: PokemonTypeInfo[];
  pokemon_v2_pokemonstats: PokemonStatInfo[];
  pokemon_v2_pokemonabilities: PokemonAbilityInfo[];
  pokemon_v2_pokemonsprites: PokemonSprite[];
  pokemon_v2_pokemonspecy?: PokemonSpecies;
}

export interface PokemonListItem {
  id: number;
  name: string;
  base_experience: number | null;
  height: number;
  weight: number;
  pokemon_v2_pokemontypes: PokemonTypeInfo[];
  pokemon_v2_pokemonstats: PokemonStatInfo[];
  pokemon_v2_pokemonsprites: PokemonSprite[];
}

export type SortOption =
  | "id"
  | "name"
  | "base_experience"
  | "height"
  | "weight";
export type SortOrder = "asc" | "desc";

export interface PokemonListResponse {
  pokemon_v2_pokemon: PokemonListItem[];
  pokemon_v2_pokemon_aggregate: {
    aggregate: {
      count: number;
    };
  };
}

export interface PokemonDetailResponse {
  pokemon_v2_pokemon_by_pk: Pokemon;
}
