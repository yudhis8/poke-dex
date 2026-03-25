import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PokedexProvider } from "./context/PokedexContext";
import Navbar from "./components/molecules/Navbar.molecule";
import CompareDrawer from "./components/molecules/CompareDrawer.molecule";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex — Search, Filter & Compare Pokémon",
  description:
    "A full-featured Pokédex built with Next.js, TypeScript, TailwindCSS, and GraphQL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col bg-slate-900 text-white'>
        <PokedexProvider>
          <Navbar />
          <div className='flex-1 flex flex-col pb-24'>{children}</div>
          <CompareDrawer />
        </PokedexProvider>
      </body>
    </html>
  );
}
