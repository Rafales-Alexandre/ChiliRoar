import React from 'react';

interface LeaderboardFiltersProps {
  active: string;
  onChange: (filter: string) => void;
}

const filters = [
  'Top Roars',
  'Emerging',
  'My Following',
];

export default function LeaderboardFilters({ active, onChange }: LeaderboardFiltersProps) {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`px-4 py-1 rounded bg-gray-800 text-gray-200 hover:bg-gray-700 transition border border-transparent ${active === filter ? 'bg-gradient-to-r from-green-400 to-cyan-500 text-white font-bold border-green-400' : ''}`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
} 