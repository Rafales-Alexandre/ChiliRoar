import React from 'react';
import FanTokenCard from './FanTokenCard';

interface TreemapItem {
  name: string;
  value: number;
  price?: number;
  color: string;
  crown?: number;
  icon?: string;
  history?: number[];
}

interface TreemapProps {
  data: TreemapItem[];
  loading?: boolean;
}

export default function Treemap({ data, loading = false }: TreemapProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((item, i) => (
        <div key={item.name + i} className="h-full">
          <FanTokenCard
            token={{
              ticker: item.name,
              name: item.name,
              category: 'other' as const,
              country: '',
              league: '',
              price: item.price ?? 0,
              id: item.name,
              // Ajoute d'autres champs si besoin
            }}
            price={item.price}
            loading={loading}
            historyData={item.history}
            marketData={{ change24h: item.value }}
            marketLoading={loading}
            selected={!!item.crown}
          />
        </div>
      ))}
    </div>
  );
} 