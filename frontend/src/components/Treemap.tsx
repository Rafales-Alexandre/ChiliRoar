import React from 'react';

interface TreemapItem {
  name: string;
  value: number;
  color: string;
  crown?: number;
  icon?: string;
}

interface TreemapProps {
  data: TreemapItem[];
}

const crownColors = [
  'border-yellow-400', // 1er
  'border-gray-300',   // 2e
  'border-orange-700', // 3e
];

export default function Treemap({ data }: TreemapProps) {
  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      {data.map((item, i) => (
        <div
          key={i}
          className={`relative flex flex-col justify-end p-3 h-32 rounded-lg shadow ${item.color} ${item.crown ? crownColors[item.crown-1] + ' border-4' : ''}`}
        >
          {item.crown && (
            <span className="absolute top-2 right-2 text-yellow-300 text-xl">
              {item.crown === 1 ? '🥇' : item.crown === 2 ? '🥈' : '🥉'}
            </span>
          )}
          <span className="absolute top-2 left-2 text-2xl">{item.icon}</span>
          <span className="text-lg font-bold text-white mt-auto">{item.name}</span>
          <span className="text-white text-sm">{item.value}%</span>
        </div>
      ))}
    </div>
  );
} 