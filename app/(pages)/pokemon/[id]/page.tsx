import PokemonDetailClient from "./PokemonDetailClient";

// Generate static params for all known Pokémon (generations 1–9, IDs 1–1025)
export function generateStaticParams() {
  return Array.from({ length: 1025 }, (_, i) => ({ id: String(i + 1) }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PokemonDetailPage({ params }: PageProps) {
  return <PokemonDetailClient params={params} />;
}
