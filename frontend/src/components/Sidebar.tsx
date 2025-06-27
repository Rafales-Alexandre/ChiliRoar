"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="bg-gray-900 text-white w-56 min-h-screen flex flex-col p-4">
      <div className="flex items-center mb-8">
        <img src="/LOGO.png" alt="ChiliRoar Logo" className="w-10 h-10" />
        <span className="font-bold text-xl">ChiliRoar</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="arena.png" alt="Arena" className="w-6 h-6" />
            <Link href="/" className="w-full h-full block">Arena</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/dashboard') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="dashboard.png" alt="Dashboard" className="w-6 h-6" />
            <Link href="/dashboard" className="w-full h-full block">Dashboard</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/roars') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="leaderboard.png" alt="Roars" className="w-6 h-6" />
            <Link href="/roars" className="w-full h-full block">Roar Leaderboards</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/roar-feeds') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="roar.png" alt="Roar Feeds" className="w-6 h-6" />
            <Link href="/roar-feeds" className="w-full h-full block">Roar Feeds</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/fan-tokens') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="trophy.png" alt="FanTokens" className="w-6 h-6" />
            <Link href="/fan-tokens" className="w-full h-full block">FanTokens</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/chiliroar-earn') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="price.png" alt="Earn" className="w-6 h-6" />
            <Link href="/chiliroar-earn" className="w-full h-full block">ChiliRoar Earn</Link>
          </li>
          <li className={`rounded px-3 py-2 flex items-center gap-3 transition-all duration-200 ${
            isActive('/airdrops') 
              ? 'bg-green-600 text-white font-semibold shadow-lg' 
              : 'hover:bg-gray-800'
          }`}>
            <img src="airdrop.png" alt="Airdrops" className="w-6 h-6" />
            <Link href="/airdrops" className="w-full h-full block">Airdrops</Link>
          </li>
        </ul>
      </nav>
      <div className="mt-8 text-xs text-gray-400">
        <div className="mb-2">Social Card</div>
        <div className="flex items-center gap-2 mb-2">
          <span>❓</span> FAQ
        </div>
        <div className="flex items-center gap-2">
          <span>👤</span> alex
        </div>
        <div className="mt-4">© 2025 ChiliRoar All Rights Reserved.</div>
      </div>
    </aside>
  );
} 