import React from 'react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-56 min-h-screen flex flex-col p-4">
      <div className="flex items-center mb-8">
        <span className="font-bold text-xl">KAITO</span>
        <span className="ml-2 bg-blue-600 text-xs px-2 py-1 rounded">YAPS</span>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="bg-gray-800 rounded px-3 py-2 font-semibold flex items-center gap-2">
            <span>🏛️</span> Pre-TGE Arena
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🏆</span> Yapper Leaderboards
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>💬</span>
            <Link href="/yaps" className="w-full h-full block">Yaps</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>📰</span>
            <Link href="/yapper-feeds" className="w-full h-full block">Yapper Feeds</Link>
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>💰</span> Kaito Earn
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🎁</span> Airdrops
          </li>
          <li className="hover:bg-gray-800 rounded px-3 py-2 flex items-center gap-2">
            <span>🔒</span> Stake KAITO
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
        <div className="mt-4">© 2025 Kaito All Rights Reserved.</div>
      </div>
    </aside>
  );
} 