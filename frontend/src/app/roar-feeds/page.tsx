"use client";
import React, { useState } from 'react';

const filters = ['Top Roars', 'Emerging Roars'];
const top10 = [
  { rank: 1, avatar: '/avatars/nick.png', name: 'Nick Ducoff', tag: '@nickducoff', badge: 'gold' },
  { rank: 2, avatar: '/avatars/based16z.png', name: 'based16z', tag: '@based16z', badge: 'silver' },
  { rank: 3, avatar: '/avatars/mosi.png', name: 'Mosi', tag: '@VannaCharmer', badge: 'bronze' },
  { rank: 4, avatar: '/avatars/mary.png', name: 'mary', tag: '@howdymerry' },
  { rank: 5, avatar: '/avatars/mert.png', name: 'mert | helius.dev', tag: '@0xMert_' },
  { rank: 6, avatar: '/avatars/moon.png', name: 'moon', tag: '@MoonOverlord' },
  { rank: 7, avatar: '/avatars/makina.png', name: 'Makina', tag: '@makinafi' },
  { rank: 8, avatar: '/avatars/wazz.png', name: 'Wazz', tag: '@WazzCrypto' },
  { rank: 9, avatar: '/avatars/noah.png', name: 'Noah', tag: '@redacted_noah' },
  { rank: 10, avatar: '/avatars/zenllama.png', name: 'ZenLlama', tag: '@zen_llama' },
];
const badgeIcons = { gold: '🥇', silver: '🥈', bronze: '🥉' };

const posts = [
  {
    avatar: '/avatars/based16z.png',
    name: 'based16z',
    tag: '@based16z',
    time: '26h',
    smartFollowers: 3235,
    lifetimeRoars: 7604,
    text: `Here's my crypto returns by year.\nI do gamble on perps and mess around on chain but p much all my returns is from 1 or 2 bets every year\n\n2020 - OTM bitcoin calls on ledgerx and spot eth\n2021 - loot NFTs, solana, solana monkey business NFTs\n2022 - didn't trade, finished college\n2023 - rollbit, blur airdrop\n2024 - hype\n...`,
    showMore: true,
    image: '/images/table-mock.png',
  },
];

function RoarFeedFilters({ active, onChange }: { active: string; onChange: (f: string) => void }) {
  return (
    <div className="flex gap-6 border-b border-gray-800 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          className={`py-2 px-1 text-lg font-semibold border-b-2 transition ${active === f ? 'border-green-400 text-green-300' : 'border-transparent text-gray-300 hover:text-white'}`}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function RoarFeedPost({ post }: { post: typeof posts[0] }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6 shadow max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <img src={post.avatar} alt={post.name} className="w-10 h-10 rounded-full border border-gray-700" />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{post.name}</span>
            <span className="text-gray-400">{post.tag}</span>
            <span className="text-xs text-gray-500">· {post.time}</span>
          </div>
          <div className="text-xs text-gray-400">
            {post.smartFollowers.toLocaleString()} Smart Followers &nbsp; {post.lifetimeRoars.toLocaleString()} Lifetime Roars
          </div>
        </div>
      </div>
      <div className="whitespace-pre-line text-gray-200 mb-2">{post.text}</div>
      {post.showMore && <button className="text-green-400 text-sm hover:underline mb-2">Show more</button>}
      {post.image && (
        <div className="rounded-xl overflow-hidden mt-2 border border-gray-800 bg-black">
          <img src={post.image} alt="table" className="w-full" />
        </div>
      )}
    </div>
  );
}

function RoarFeedSidebar() {
  return (
    <aside className="bg-gray-900 rounded-xl p-4 w-80 ml-8 shadow flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-white">Top 10 Roars</span>
        <button className="bg-gray-800 text-green-400 px-3 py-1 rounded text-xs">24H</button>
      </div>
      <a href="#" className="text-green-400 text-xs mb-2 hover:underline">See full Roars ranking &gt;</a>
      <ol className="space-y-2">
        {top10.map((roar) => (
          <li key={roar.rank} className={`flex items-center gap-2 px-2 py-1 rounded ${roar.badge ? 'bg-gradient-to-r from-gray-800 to-gray-900' : ''}`}>
            <span className={`w-6 text-center font-bold ${roar.badge === 'gold' ? 'text-yellow-300' : roar.badge === 'silver' ? 'text-gray-300' : roar.badge === 'bronze' ? 'text-orange-400' : 'text-gray-400'}`}>{roar.badge ? badgeIcons[roar.badge] : roar.rank}</span>
            <img src={roar.avatar} alt={roar.name} className="w-7 h-7 rounded-full border border-gray-700" />
            <span className="text-white font-semibold text-sm truncate">{roar.name}</span>
            <span className="text-xs text-gray-400 truncate">{roar.tag}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export default function RoarFeedsPage() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  return (
    <div className="p-8 flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-1">Roar Feeds</h1>
      <p className="text-gray-400 mb-6">Stay Close to Where Attention Flows on CT</p>
      <div className="flex flex-1 gap-8">
        <div className="flex-1">
          <RoarFeedFilters active={activeFilter} onChange={setActiveFilter} />
          {posts.map((post, i) => (
            <RoarFeedPost key={i} post={post} />
          ))}
        </div>
        <RoarFeedSidebar />
      </div>
    </div>
  );
} 