// Primary GraphQL endpoint (PokeAPI v1beta)
export const GRAPHQL_ENDPOINT = "https://beta.pokeapi.co/graphql/v1beta";
// Alternative v1beta2: 'https://graphql.pokeapi.co/v1beta2/graphql'

export const GET_POKEMON_LIST = `
  query GetPokemonList(
    $limit: Int!
    $offset: Int!
    $nameSearch: String!
    $orderBy: [pokemon_v2_pokemon_order_by!]!
  ) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: {
        name: { _ilike: $nameSearch }
        is_default: { _eq: true }
      }
    ) {
      id
      name
      base_experience
      height
      weight
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type { name }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat { name }
      }
      pokemon_v2_pokemonsprites { sprites }
    }
    pokemon_v2_pokemon_aggregate(
      where: {
        name: { _ilike: $nameSearch }
        is_default: { _eq: true }
      }
    ) {
      aggregate { count }
    }
  }
`;

export const GET_POKEMON_LIST_BY_TYPE = `
  query GetPokemonListByType(
    $limit: Int!
    $offset: Int!
    $nameSearch: String!
    $types: [String!]!
    $orderBy: [pokemon_v2_pokemon_order_by!]!
  ) {
    pokemon_v2_pokemon(
      limit: $limit
      offset: $offset
      order_by: $orderBy
      where: {
        name: { _ilike: $nameSearch }
        is_default: { _eq: true }
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _in: $types } }
        }
      }
    ) {
      id
      name
      base_experience
      height
      weight
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type { name }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat { name }
      }
      pokemon_v2_pokemonsprites { sprites }
    }
    pokemon_v2_pokemon_aggregate(
      where: {
        name: { _ilike: $nameSearch }
        is_default: { _eq: true }
        pokemon_v2_pokemontypes: {
          pokemon_v2_type: { name: { _in: $types } }
        }
      }
    ) {
      aggregate { count }
    }
  }
`;

export const GET_POKEMON_DETAIL = `
  query GetPokemonDetail($id: Int!) {
    pokemon_v2_pokemon_by_pk(id: $id) {
      id
      name
      base_experience
      height
      weight
      pokemon_v2_pokemontypes {
        slot
        pokemon_v2_type { name }
      }
      pokemon_v2_pokemonstats {
        base_stat
        pokemon_v2_stat { name }
      }
      pokemon_v2_pokemonabilities(order_by: { slot: asc }) {
        is_hidden
        slot
        pokemon_v2_ability { name }
      }
      pokemon_v2_pokemonsprites { sprites }
      pokemon_v2_pokemonspecy {
        capture_rate
        base_happiness
        gender_rate
        pokemon_v2_pokemonspeciesflavortexts(
          where: { pokemon_v2_language: { name: { _eq: "en" } } }
          limit: 1
          order_by: { version_id: desc }
        ) {
          flavor_text
        }
        pokemon_v2_evolutionchain {
          pokemon_v2_pokemonspecies(order_by: { order: asc }) {
            id
            name
            order
            pokemon_v2_pokemons(
              limit: 1
              where: { is_default: { _eq: true } }
            ) {
              id
              pokemon_v2_pokemonsprites(limit: 1) { sprites }
            }
          }
        }
      }
    }
  }
`;
