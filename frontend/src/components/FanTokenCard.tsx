"use client"
import React from 'react';
import { FanToken } from '../app/fanTokens';
import { FanTokenMarketData } from '../app/useFanTokenMarketData';

interface FanTokenCardProps {
  token: FanToken;
  price?: number;
  loading?: boolean;
  onClick?: () => void;
  selected?: boolean;
  historyData?: number[];
  historyLoading?: boolean;
  marketData?: FanTokenMarketData;
  marketLoading?: boolean;
}

// Fonction utilitaire pour lisser la courbe (Catmull-Rom to Bezier)
function getSmoothPath(points: {x: number, y: number}[]) {
  if (points.length < 2) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function FanTokenCard({ 
  token, 
  price, 
  loading = false, 
  onClick, 
  selected = false,
  historyData,
  historyLoading = false,
  marketData,
  marketLoading = false
}: FanTokenCardProps) {
  const getCategoryIcon = (category: FanToken['category']) => {
    switch (category) {
      case 'football':
        return '';
      case 'esports':
        return '';
      case 'f1':
        return '';
      default:
        return '';
    }
  };

  // Fonction pour déterminer la couleur basée sur la variation
  const getVariationColor = () => {
    if (marketLoading || !marketData?.change24h) {
      return 'bg-gray-900/50 border-gray-700';
    }

    const change = marketData.change24h;
    if (change > 0) {
      return 'bg-green-500/20 border-green-500/30';
    } else if (change < 0) {
      return 'bg-red-500/20 border-red-500/30';
    } else {
      return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  // Fonction pour déterminer la couleur du texte de variation
  const getVariationTextColor = () => {
    if (marketLoading || !marketData?.change24h) {
      return 'text-gray-400';
    }

    const change = marketData.change24h;
    if (change > 0) {
      return 'text-green-400';
    } else if (change < 0) {
      return 'text-red-400';
    } else {
      return 'text-gray-400';
    }
  };

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return 'N/A';
    if (price === 0) return 'N/A';
    return `$${price.toFixed(4)}`;
  };

  const formatVariation = (change?: number) => {
    if (change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <div
      className={`relative overflow-hidden p-4 rounded-xl border cursor-pointer transition-all hover:scale-105 min-h-[120px] ${
        selected 
          ? 'bg-gradient-to-r from-green-500/30 to-cyan-500/30 border-green-400 shadow-lg shadow-green-500/25' 
          : getVariationColor()
      }`}
      onClick={onClick}
    >
      {/* Sparkline en fond */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-end">
        {/* Sparkline prend toute la largeur/hauteur */}
        <svg width="100%" height="100%" viewBox="0 0 120 48" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {(() => {
            if (historyLoading || !historyData || historyData.length === 0) {
              return <rect x="0" y="0" width="120" height="48" fill="rgba(255,255,255,0.05)" />;
            }
            // Downsample
            const maxPoints = 40;
            const step = Math.max(1, Math.floor(historyData.length / maxPoints));
            const downsampled = historyData.filter((_, i) => i % step === 0);
            // Moyenne mobile simple
            const smoothData = downsampled.map((_, i, arr) => {
              const window = arr.slice(Math.max(0, i - 2), i + 3);
              return window.reduce((a, b) => a + b, 0) / window.length;
            });
            const data = smoothData.filter(price => price > 0);
            if (data.length === 0) {
              return <rect x="0" y="0" width="120" height="48" fill="rgba(255,255,255,0.05)" />;
            }
            const minPrice = Math.min(...data);
            const maxPrice = Math.max(...data);
            const priceRange = maxPrice - minPrice;
            const xStep = 120 / (data.length - 1);
            const yScale = priceRange > 0 ? 48 / priceRange : 1;
            const pointsArr = data.map((price, index) => {
              const x = index * xStep;
              const y = 48 - (price - minPrice) * yScale;
              return { x, y };
            });
            let strokeColor = 'rgba(255,255,255,0.18)';
            if (marketData?.change24h !== undefined) {
              if (marketData.change24h > 0) strokeColor = 'rgba(16,185,129,0.18)';
              else if (marketData.change24h < 0) strokeColor = 'rgba(239,68,68,0.18)';
            } else {
              const firstPrice = data[0];
              const lastPrice = data[data.length - 1];
              const isPositive = lastPrice >= firstPrice;
              strokeColor = isPositive ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)';
            }
            const d = getSmoothPath(pointsArr);
            return (
              <path
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
                d={d}
              />
            );
          })()}
        </svg>
      </div>
      {/* Contenu au-dessus */}
      <div className="relative z-10 flex flex-col h-full justify-between min-h-[90px]">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(token.category)}</span>
          <div>
            <h3 className="font-bold text-white text-sm">{token.ticker}</h3>
            <p className="text-xs text-gray-400">{token.category}</p>
          </div>
        </div>
        <div className="mt-2">
          <div className="font-bold text-white text-lg">
            {loading ? <span className="animate-pulse text-gray-400">Chargement…</span> : formatPrice(price ?? token.price)}
          </div>
          {marketData?.change24h !== undefined && (
            <div className={`text-xs font-medium ${getVariationTextColor()}`}>
              {formatVariation(marketData.change24h)}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <div className="mt-3 pt-2 border-t border-green-400/30 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-400">Sélectionné</span>
            <span className="text-white">✓</span>
          </div>
        </div>
      )}
    </div>
  );
} 
