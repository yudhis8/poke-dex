"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePokedex } from "@/app/context/PokedexContext";

export default function Navbar() {
  const { compareList } = usePokedex();
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-3 group'>
          {/* Pokéball icon */}
          <div className='relative w-8 h-8'>
            <div className='w-8 h-8 rounded-full bg-red-600 overflow-hidden border-2 border-slate-400 group-hover:border-white transition-colors'>
              <div className='w-full h-1/2 bg-red-600' />
              <div className='w-full h-1/2 bg-white' />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-full h-0.5 bg-slate-800' />
              </div>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-3 h-3 rounded-full bg-white border-2 border-slate-800' />
              </div>
            </div>
          </div>
          <span className='text-xl font-black tracking-wider text-white group-hover:text-red-400 transition-colors'>
            POKÉDEX
          </span>
        </Link>

        {/* Nav links */}
        <nav className='flex items-center gap-3'>
          <Link
            href='/'
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/"
                ? "text-white bg-slate-700"
                : "text-gray-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            Home
          </Link>
          <Link
            href='/compare'
            className={`relative text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
              pathname === "/compare"
                ? "text-white bg-slate-700"
                : "text-gray-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='23 6 13.5 15.5 8.5 10.5 1 18' />
              <polyline points='17 6 23 6 23 12' />
            </svg>
            Compare
            {compareList.length > 0 && (
              <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
                {compareList.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
