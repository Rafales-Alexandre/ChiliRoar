import React, { useState } from 'react';

export interface LeaderboardRow {
  rank: number | string;
  avatar?: string;
  name: string;
  tag?: string;
  badge?: 'gold' | 'silver' | 'bronze';
  roars?: number | string;
  earnedRoars?: number | string;
  referralRoars?: number | string;
  smartFollowers?: number | string;
  followers?: number | string;
  smartPercent?: number | string;
}

interface LeaderboardTableProps {
  rows: LeaderboardRow[];
}

const badgeIcons = {
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉',
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

// Fonction pour générer une couleur basée sur le nom
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Composant Avatar avec fallback
const Avatar = ({ src, name, size = 'w-7 h-7' }: { src?: string; name: string; size?: string }) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  if (!src || imageError) {
    return (
      <div className={`${size} ${bgColor} rounded-full flex items-center justify-center text-white text-xs font-bold border border-gray-700`}>
        {initials}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className={`${size} rounded-full border border-gray-700 object-cover`}
      onError={() => setImageError(true)}
    />
  );
};

export default function LeaderboardTable({ rows }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-900 border border-gray-800">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-800 text-gray-400 border-b border-gray-700">
          <tr>
            <th className="px-6 py-4 font-semibold">Rank</th>
            <th className="px-6 py-4 font-semibold">Créateur</th>
            <th className="px-6 py-4 font-semibold text-center">Total Roars</th>
            <th className="px-6 py-4 font-semibold text-center">Roars Gagnés</th>
            <th className="px-6 py-4 font-semibold text-center">Roars Parrainage</th>
            <th className="px-6 py-4 font-semibold text-center">Smart Followers</th>
            <th className="px-6 py-4 font-semibold text-center">Followers</th>
            <th className="px-6 py-4 font-semibold text-center">Smart %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr 
              key={i} 
              className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
            >
              <td className="px-6 py-4 font-bold">
                {row.badge ? (
                  <span className="text-2xl">{badgeIcons[row.badge]}</span>
                ) : (
                  <span className="text-gray-300">#{row.rank}</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar src={row.avatar} name={row.name} />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{row.name}</span>
                    {row.tag && (
                      <span className="text-xs text-gray-400">{row.tag}</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="font-bold text-green-400">{row.roars ?? '-'}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-blue-400">{row.earnedRoars ?? '-'}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-purple-400">{row.referralRoars ?? '-'}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-yellow-400">{row.smartFollowers?.toLocaleString() ?? '-'}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="text-gray-300">{row.followers?.toLocaleString() ?? '-'}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`font-semibold ${
                  row.smartPercent && row.smartPercent !== '-' 
                    ? parseFloat(row.smartPercent.toString().replace('%', '')) > 10 
                      ? 'text-green-400' 
                      : parseFloat(row.smartPercent.toString().replace('%', '')) > 5 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {row.smartPercent ?? '-'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 