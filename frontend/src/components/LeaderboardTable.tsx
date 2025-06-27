import React from 'react';

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

export default function LeaderboardTable({ rows }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl shadow bg-gray-900">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-800 text-gray-400">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Total Roars</th>
            <th className="px-4 py-2">Earned Roars</th>
            <th className="px-4 py-2">Referral Roars</th>
            <th className="px-4 py-2">Smart Followers</th>
            <th className="px-4 py-2">Followers</th>
            <th className="px-4 py-2">Smart %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition">
              <td className="px-4 py-2 font-bold">
                {row.badge ? badgeIcons[row.badge] : row.rank}
              </td>
              <td className="px-4 py-2 flex items-center gap-2">
                {row.avatar && (
                  <img src={row.avatar} alt={row.name} className="w-7 h-7 rounded-full border border-gray-700" />
                )}
                <span className="font-semibold text-white">{row.name}</span>
                {row.tag && <span className="text-xs text-gray-400">{row.tag}</span>}
              </td>
              <td className="px-4 py-2">{row.roars ?? '-'}</td>
              <td className="px-4 py-2">{row.earnedRoars ?? '-'}</td>
              <td className="px-4 py-2">{row.referralRoars ?? '-'}</td>
              <td className="px-4 py-2">{row.smartFollowers ?? '-'}</td>
              <td className="px-4 py-2">{row.followers ?? '-'}</td>
              <td className="px-4 py-2">{row.smartPercent ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 