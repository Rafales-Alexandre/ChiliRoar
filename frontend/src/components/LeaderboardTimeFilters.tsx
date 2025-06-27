import React from 'react';

interface LeaderboardTimeFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

const timeFilters = [
  '24H', '48H', '7D', '30D', '3M', '6M', '12M', 'All'
];

export default function LeaderboardTimeFilters({ active, onChange }: LeaderboardTimeFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      {timeFilters.map((filter) => (
        <button
          key={filter}
          className={`px-3 py-1 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 transition border border-transparent ${active === filter ? 'bg-green-600 text-white font-bold border-green-400' : ''}`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
} 