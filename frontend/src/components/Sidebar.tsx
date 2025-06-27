import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-56 min-h-screen flex flex-col p-4">
      <div className="flex items-center mb-8">
        <img src="/LOGO.png" alt="ChiliRoar Logo" className="w-10 h-10" />
        <span className="font-bold text-xl">ChiliRoar</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="bg-gray-800 rounded px-3 py-2 font-semibold flex items-center gap-2">
            <span>🏛️</span><Link href="/" className="w-full h-full block">Arena</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🏠</span>
            <Link href="/dashboard" className="w-full h-full block">Dashboard</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🏆</span>
            <Link href="/roars" className="w-full h-full block">Roar Leaderboards</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>📰</span>
            <Link href="/roar-feeds" className="w-full h-full block">Roar Feeds</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🏆</span>
            <Link href="/fan-tokens" className="w-full h-full block">FanTokens</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>💰</span>
            <Link href="/chiliroar-earn" className="w-full h-full block">ChiliRoar Earn</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🎁</span>
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