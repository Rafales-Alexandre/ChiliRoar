"use client"
import React, { useState } from 'react';
import LeaderboardFilters from '../../components/LeaderboardFilters';
import LeaderboardTimeFilters from '../../components/LeaderboardTimeFilters';
import LeaderboardTable, { LeaderboardRow } from '../../components/LeaderboardTable';
import LeaderboardPagination from '../../components/LeaderboardPagination';

const mockRows: LeaderboardRow[] = [
  { rank: '-', avatar: '/avatars/alex.png', name: 'alex', tag: '@alexandrerafal3', yaps: '-', earnedYaps: '-', referralYaps: '-', smartFollowers: 672, followers: 14723, smartPercent: '4.56%' },
  { rank: 1, avatar: '/avatars/nick.png', name: 'Nick Ducoff', tag: '@nickducoff', badge: 'gold', yaps: 306, earnedYaps: 306, referralYaps: '-', smartFollowers: 3235, followers: 94936, smartPercent: '3.41%' },
  { rank: 2, avatar: '/avatars/based16z.png', name: 'based16z', tag: '@based16z', badge: 'silver', yaps: 232, earnedYaps: 232, referralYaps: '-', smartFollowers: 1129, followers: 9378, smartPercent: '12.04%' },
  { rank: 3, avatar: '/avatars/mosi.png', name: 'Mosi', tag: '@VannaCharmer', badge: 'bronze', yaps: 224, earnedYaps: 224, referralYaps: '-', smartFollowers: 1764, followers: 12724, smartPercent: '13.86%' },
  { rank: 4, avatar: '/avatars/mary.png', name: 'mary', tag: '@howdymerry', yaps: 187, earnedYaps: 187, referralYaps: 0, smartFollowers: 5328, followers: 238711, smartPercent: '2.23%' },
  { rank: 5, avatar: '/avatars/mert.png', name: 'mert | helius.dev', tag: '@0xMert_', yaps: 186, earnedYaps: 186, referralYaps: 0, smartFollowers: 4148, followers: 303359, smartPercent: '1.37%' },
  { rank: 6, avatar: '/avatars/moon.png', name: 'moon', tag: '@MoonOverlord', yaps: 158, earnedYaps: 158, referralYaps: '-', smartFollowers: 176, followers: 1720, smartPercent: '10.23%' },
  { rank: 7, avatar: '/avatars/makina.png', name: 'Makina', tag: '@makinafi', yaps: 149, earnedYaps: 149, referralYaps: '-', smartFollowers: 1917, followers: 53198, smartPercent: '3.60%' },
  { rank: 8, avatar: '/avatars/wazz.png', name: 'Wazz', tag: '@WazzCrypto', yaps: 127, earnedYaps: 124, referralYaps: 3, smartFollowers: 797, followers: 17958, smartPercent: '4.44%' },
  { rank: 9, avatar: '/avatars/noah.png', name: 'Noah', tag: '@redacted_noah', yaps: 108, earnedYaps: 108, referralYaps: '-', smartFollowers: 2957, followers: 99626, smartPercent: '2.97%' },
  { rank: 10, avatar: '/avatars/taiki.png', name: 'Taiki Maeda', tag: '@TaikiMaeda2', yaps: 104, earnedYaps: 104, referralYaps: '-', smartFollowers: 3723, followers: 144759, smartPercent: '2.57%' },
  { rank: 11, avatar: '/avatars/ignas.png', name: 'Ignas | DeFi', tag: '@DefiIgnas', yaps: 104, earnedYaps: 96, referralYaps: 8, smartFollowers: 532, followers: 9435, smartPercent: '5.64%' },
  { rank: 12, avatar: '/avatars/nico.png', name: 'Nico', tag: '@nicodotfun', yaps: 103, earnedYaps: 103, referralYaps: '-', smartFollowers: 0, followers: 0, smartPercent: '-' },
];

export default function YapsPage() {
  const [activeFilter, setActiveFilter] = useState('Top Yappers');
  const [activeTime, setActiveTime] = useState('24H');
  const [page, setPage] = useState(1);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Yaps</h1>
      <p className="text-gray-300 mb-6">Discover the Best Accounts and Content on CT. <a href="#" className="text-green-400 hover:underline">Check Yapper Feeds &gt;</a></p>
      <LeaderboardFilters active={activeFilter} onChange={setActiveFilter} />
      <LeaderboardTimeFilters active={activeTime} onChange={setActiveTime} />
      <LeaderboardTable rows={mockRows} />
      <LeaderboardPagination current={page} total={25} onChange={setPage} />
      <p className="text-xs text-gray-500 mt-4">Data updates every hour. Rounded to the nearest whole number.</p>
    </div>
  );
} 