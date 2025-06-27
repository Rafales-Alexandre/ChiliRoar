import React, { useState, useMemo } from 'react';
import { fanTokens, FanToken } from '../app/fanTokens';
import { FanTokenMarketData } from '../app/contexts/FanTokenDataContext';

interface FanTokenTableProps {
  tokens?: FanToken[];
  prices?: Record<string, { price?: number }>;
  loading?: boolean;
  historyData?: Record<string, number[]>;
  historyLoading?: boolean;
  marketData?: Record<string, FanTokenMarketData>;
  marketLoading?: boolean;
}

export default function FanTokenTable({ 
  tokens = fanTokens,
  prices = {}, 
  loading = false,
  historyData = {},
  historyLoading = false,
  marketData = {},
  marketLoading = false
}: FanTokenTableProps) {
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'ticker' | 'category'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedTokens = useMemo(() => {
    return tokens.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'price':
          aValue = prices[a.ticker]?.price ?? a.price;
          bValue = prices[b.ticker]?.price ?? b.price;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'ticker':
          aValue = a.ticker.toLowerCase();
          bValue = b.ticker.toLowerCase();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = prices[a.ticker]?.price ?? a.price;
          bValue = prices[b.ticker]?.price ?? b.price;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [tokens, sortBy, sortOrder, prices]);

  const getCategoryIcon = (category: FanToken['category']) => {
    switch (category) {
      case 'football':
        return '⚽';
      case 'esports':
        return '🎮';
      case 'f1':
        return '🏎️';
      default:
        return '🏆';
    }
  };

  const getCategoryColor = (category: FanToken['category']) => {
    switch (category) {
      case 'football':
        return 'text-green-400';
      case 'esports':
        return 'text-purple-400';
      case 'f1':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  // Fonction pour déterminer la couleur de la ligne basée sur la variation
  const getRowColor = (ticker: string) => {
    const data = marketData[ticker];
    if (marketLoading || !data?.change24h) {
      return 'hover:bg-gray-800';
    }

    const change = data.change24h;
    if (change > 0) {
      return 'hover:bg-green-500/10 bg-green-500/5';
    } else if (change < 0) {
      return 'hover:bg-red-500/10 bg-red-500/5';
    } else {
      return 'hover:bg-gray-800 bg-gray-800/50';
    }
  };

  // Fonction pour déterminer la couleur du texte de variation
  const getVariationTextColor = (ticker: string) => {
    const data = marketData[ticker];
    if (marketLoading || !data?.change24h) {
      return 'text-gray-400';
    }

    const change = data.change24h;
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

  // Fonction pour créer le sparkline SVG
  const renderSparkline = (ticker: string) => {
    const data = historyData[ticker];
    
    if (historyLoading || !data || data.length === 0) {
      return (
        <div className="w-16 h-8 bg-gray-800 rounded animate-pulse"></div>
      );
    }

    const width = 64;
    const height = 32;
    const padding = 2;
    
    const filteredData = data.filter(price => price > 0);
    if (filteredData.length === 0) {
      return (
        <div className="w-16 h-8 bg-gray-800 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">N/A</span>
        </div>
      );
    }

    const minPrice = Math.min(...filteredData);
    const maxPrice = Math.max(...filteredData);
    const priceRange = maxPrice - minPrice;
    
    const xStep = (width - padding * 2) / (filteredData.length - 1);
    const yScale = priceRange > 0 ? (height - padding * 2) / priceRange : 1;
    
    const points = filteredData.map((price, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (price - minPrice) * yScale;
      return `${x},${y}`;
    }).join(' ');

    // Déterminer la couleur basée sur la variation 24h si disponible, sinon sur la tendance de la courbe
    let strokeColor = '#6b7280'; // Gris par défaut
    
    const marketDataForToken = marketData[ticker];
    if (marketDataForToken?.change24h !== undefined) {
      if (marketDataForToken.change24h > 0) {
        strokeColor = '#10b981'; // Vert
      } else if (marketDataForToken.change24h < 0) {
        strokeColor = '#ef4444'; // Rouge
      }
    } else {
      // Fallback sur la tendance de la courbe
      const firstPrice = filteredData[0];
      const lastPrice = filteredData[filteredData.length - 1];
      const isPositive = lastPrice >= firstPrice;
      strokeColor = isPositive ? '#10b981' : '#ef4444';
    }

    return (
      <svg width={width} height={height} className="rounded">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };

  const handleSort = (column: 'price' | 'name' | 'ticker' | 'category') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: 'price' | 'name' | 'ticker' | 'category') => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded mb-4"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Token
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('price')}
              >
                Prix {getSortIcon('price')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                24h %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Graphique
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('category')}
              >
                Catégorie {getSortIcon('category')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedTokens.map((token) => (
              <tr key={token.id} className={`${getRowColor(token.ticker)} transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-lg">{getCategoryIcon(token.category)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{token.name}</div>
                      <div className="text-sm text-gray-400">{token.ticker}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-white">
                    {formatPrice(prices[token.ticker]?.price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getVariationTextColor(token.ticker)}`}>
                    {formatVariation(marketData[token.ticker]?.change24h)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderSparkline(token.ticker)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getCategoryIcon(token.category)}</span>
                    <span className={`text-sm ${getCategoryColor(token.category)}`}>
                      {token.category === 'football' ? 'Football' :
                       token.category === 'esports' ? 'Esports' :
                       token.category === 'f1' ? 'F1' : 'Autres'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 