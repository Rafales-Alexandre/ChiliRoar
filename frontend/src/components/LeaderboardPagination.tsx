import React from 'react';

interface LeaderboardPaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function LeaderboardPagination({ current, total, onChange }: LeaderboardPaginationProps) {
  const pages = [];
  for (let i = 1; i <= Math.min(total, 5); i++) {
    pages.push(i);
  }
  return (
    <div className="flex gap-1 mt-4 items-center">
      <button
        className="px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        {'<'}
      </button>
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded ${current === page ? 'bg-green-600 text-white font-bold' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
          onClick={() => onChange(page)}
        >
          {page}
        </button>
      ))}
      {total > 5 && <span className="px-2">...</span>}
      <button
        className="px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        {'>'}
      </button>
    </div>
  );
} 