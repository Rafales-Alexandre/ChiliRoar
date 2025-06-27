"use client"
import React, { useState } from 'react';
import LeaderboardFilters from '../../components/LeaderboardFilters';
import LeaderboardTimeFilters from '../../components/LeaderboardTimeFilters';
import LeaderboardTable, { LeaderboardRow } from '../../components/LeaderboardTable';
import LeaderboardPagination from '../../components/LeaderboardPagination';
import Sidebar from '../../components/Sidebar';

// Fonction pour générer des avatars avec DiceBear
const generateAvatar = (name: string, style: 'adventurer' | 'avataaars' | 'big-ears' | 'bottts' | 'croodles' | 'fun-emoji' = 'adventurer') => {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

// Fonction pour obtenir les initiales d'un nom
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const mockRows: LeaderboardRow[] = [
  { 
    rank: '-', 
    avatar: generateAvatar('alex'), 
    name: 'alex', 
    tag: '@alexandrerafal3', 
    roars: '-', 
    earnedRoars: '-', 
    referralRoars: '-', 
    smartFollowers: 672, 
    followers: 14723, 
    smartPercent: '4.56%' 
  },
  { 
    rank: 1, 
    avatar: generateAvatar('Nick Ducoff'), 
    name: 'Nick Ducoff', 
    tag: '@nickducoff', 
    badge: 'gold', 
    roars: 306, 
    earnedRoars: 306, 
    referralRoars: '-', 
    smartFollowers: 3235, 
    followers: 94936, 
    smartPercent: '3.41%' 
  },
  { 
    rank: 2, 
    avatar: generateAvatar('based16z'), 
    name: 'based16z', 
    tag: '@based16z', 
    badge: 'silver', 
    roars: 232, 
    earnedRoars: 232, 
    referralRoars: '-', 
    smartFollowers: 1129, 
    followers: 9378, 
    smartPercent: '12.04%' 
  },
  { 
    rank: 3, 
    avatar: generateAvatar('Mosi'), 
    name: 'Mosi', 
    tag: '@VannaCharmer', 
    badge: 'bronze', 
    roars: 224, 
    earnedRoars: 224, 
    referralRoars: '-', 
    smartFollowers: 1764, 
    followers: 12724, 
    smartPercent: '13.86%' 
  },
  { 
    rank: 4, 
    avatar: generateAvatar('mary'), 
    name: 'mary', 
    tag: '@howdymerry', 
    roars: 187, 
    earnedRoars: 187, 
    referralRoars: 0, 
    smartFollowers: 5328, 
    followers: 238711, 
    smartPercent: '2.23%' 
  },
  { 
    rank: 5, 
    avatar: generateAvatar('mert helius.dev'), 
    name: 'mert | helius.dev', 
    tag: '@0xMert_', 
    roars: 186, 
    earnedRoars: 186, 
    referralRoars: 0, 
    smartFollowers: 4148, 
    followers: 303359, 
    smartPercent: '1.37%' 
  },
  { 
    rank: 6, 
    avatar: generateAvatar('moon'), 
    name: 'moon', 
    tag: '@MoonOverlord', 
    roars: 158, 
    earnedRoars: 158, 
    referralRoars: '-', 
    smartFollowers: 176, 
    followers: 1720, 
    smartPercent: '10.23%' 
  },
  { 
    rank: 7, 
    avatar: generateAvatar('Makina'), 
    name: 'Makina', 
    tag: '@makinafi', 
    roars: 149, 
    earnedRoars: 149, 
    referralRoars: '-', 
    smartFollowers: 1917, 
    followers: 53198, 
    smartPercent: '3.60%' 
  },
  { 
    rank: 8, 
    avatar: generateAvatar('Wazz'), 
    name: 'Wazz', 
    tag: '@WazzCrypto', 
    roars: 127, 
    earnedRoars: 124, 
    referralRoars: 3, 
    smartFollowers: 797, 
    followers: 17958, 
    smartPercent: '4.44%' 
  },
  { 
    rank: 9, 
    avatar: generateAvatar('Noah'), 
    name: 'Noah', 
    tag: '@redacted_noah', 
    roars: 108, 
    earnedRoars: 108, 
    referralRoars: '-', 
    smartFollowers: 2957, 
    followers: 99626, 
    smartPercent: '2.97%' 
  },
  { 
    rank: 10, 
    avatar: generateAvatar('Taiki Maeda'), 
    name: 'Taiki Maeda', 
    tag: '@TaikiMaeda2', 
    roars: 104, 
    earnedRoars: 104, 
    referralRoars: '-', 
    smartFollowers: 3723, 
    followers: 144759, 
    smartPercent: '2.57%' 
  },
  { 
    rank: 11, 
    avatar: generateAvatar('Ignas DeFi'), 
    name: 'Ignas | DeFi', 
    tag: '@DefiIgnas', 
    roars: 104, 
    earnedRoars: 96, 
    referralRoars: 8, 
    smartFollowers: 532, 
    followers: 9435, 
    smartPercent: '5.64%' 
  },
  { 
    rank: 12, 
    avatar: generateAvatar('Nico'), 
    name: 'Nico', 
    tag: '@nicodotfun', 
    roars: 103, 
    earnedRoars: 103, 
    referralRoars: '-', 
    smartFollowers: 0, 
    followers: 0, 
    smartPercent: '-' 
  },
];

export default function RoarsPage() {
  const [activeFilter, setActiveFilter] = useState('Top Roars');
  const [activeTime, setActiveTime] = useState('24H');
  const [page, setPage] = useState(1);

  // Calculer les statistiques
  const totalRoars = mockRows.reduce((sum, row) => sum + (typeof row.roars === 'number' ? row.roars : 0), 0);
  const totalFollowers = mockRows.reduce((sum, row) => sum + (typeof row.followers === 'number' ? row.followers : 0), 0);
  const avgSmartPercent = mockRows
    .filter(row => row.smartPercent !== '-')
    .reduce((sum, row) => sum + parseFloat(row.smartPercent?.toString().replace('%', '') || '0'), 0) / 
    mockRows.filter(row => row.smartPercent !== '-').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header avec statistiques */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🦁 Roars Leaderboard</h1>
          <p className="text-gray-300 mb-6">
            Découvrez les meilleurs créateurs et contenus sur ChiliRoar. 
            <a href="/roar-feeds" className="text-green-400 hover:underline ml-2">Voir les Roar Feeds &gt;</a>
          </p>
          
          {/* Statistiques générales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-white">{mockRows.length}</div>
              <div className="text-sm text-gray-300">Top Créateurs</div>
            </div>
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
              <div className="text-2xl font-bold text-white">{totalRoars.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Total Roars</div>
            </div>
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/20">
              <div className="text-2xl font-bold text-white">{totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-gray-300">Followers Totaux</div>
            </div>
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/20">
              <div className="text-2xl font-bold text-white">{avgSmartPercent.toFixed(1)}%</div>
              <div className="text-sm text-gray-300">Smart % Moyen</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <LeaderboardFilters active={activeFilter} onChange={setActiveFilter} />
            </div>
            <div className="flex gap-2">
              <LeaderboardTimeFilters active={activeTime} onChange={setActiveTime} />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="mb-6">
          <LeaderboardTable rows={mockRows} />
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <LeaderboardPagination current={page} total={25} onChange={setPage} />
          <p className="text-xs text-gray-500">
            📊 Données mises à jour quotidiennement. Arrondies au nombre entier le plus proche.
          </p>
        </div>
      </main>
    </div>
  );
} 