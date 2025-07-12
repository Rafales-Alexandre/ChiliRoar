"use client";
import React, { useState, useMemo } from 'react';
import FanTokenCard from '../../components/FanTokenCard';
import FanTokenTable from '../../components/FanTokenTable';
import { fanTokens, FanToken, getFanTokensByCategory, getFanTokensByCountry, getTopFanTokens } from '../fanTokens';
import { useFanTokenMarketData, useFanTokenHistory } from '../hooks/useFanTokenData';
import { HistoryPeriod } from '../types';
import Sidebar from '../../components/Sidebar';

export default function FanTokensPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FanToken['category'] | 'all'>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'ticker'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [chartPeriod, setChartPeriod] = useState<HistoryPeriod>('7d');

  // Hook unifié pour toutes les données de marché (prix, variations, etc.)
  const tickers = useMemo(() => fanTokens.map(t => t.ticker), []);
  const { data: marketData, loading, error } = useFanTokenMarketData(tickers);

  // Get unique categories and countries
  const categories = useMemo(() => {
    const cats = Array.from(new Set(fanTokens.map(token => token.category)));
    return cats.sort();
  }, []);

  const countries = useMemo(() => {
    const countries = Array.from(new Set(fanTokens.map(token => token.country).filter(Boolean)));
    return countries.sort();
  }, []);

  // Filter and sort tokens
  const filteredTokens = useMemo(() => {
    let filtered = fanTokens;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.league?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(token => token.category === selectedCategory);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(token => token.country === selectedCountry);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'price':
          aValue = marketData[a.ticker]?.price ?? a.price;
          bValue = marketData[b.ticker]?.price ?? b.price;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'ticker':
          aValue = a.ticker.toLowerCase();
          bValue = b.ticker.toLowerCase();
          break;
        default:
          aValue = marketData[a.ticker]?.price ?? a.price;
          bValue = marketData[b.ticker]?.price ?? b.price;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, selectedCountry, sortBy, sortOrder, marketData]);

  // Nouveau : on charge la courbe pour les 3 premiers tokens filtrés
  const selectedToken1 = filteredTokens[0]?.ticker;
  const selectedToken2 = filteredTokens[1]?.ticker;
  const selectedToken3 = filteredTokens[2]?.ticker;
  const { data: historyData1, loading: historyLoading1, error: historyError1, isUsingFallback: isUsingFallback1 } = useFanTokenHistory(selectedToken1, chartPeriod);
  const { data: historyData2, loading: historyLoading2, error: historyError2, isUsingFallback: isUsingFallback2 } = useFanTokenHistory(selectedToken2, chartPeriod);
  const { data: historyData3, loading: historyLoading3, error: historyError3, isUsingFallback: isUsingFallback3 } = useFanTokenHistory(selectedToken3, chartPeriod);

  // Gestion des erreurs 429
  const isRateLimited = error?.message?.includes('Rate limit exceeded') || historyError1?.message?.includes('Rate limit exceeded') || historyError2?.message?.includes('Rate limit exceeded') || historyError3?.message?.includes('Rate limit exceeded');

  const topTokens = getTopFanTokens(5);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/trophy.png" alt="FanTokens" className="w-8 h-8 mr-3" />
            FanTokens
          </h1>
          <p className="text-gray-300 mb-6">
            Discover and trade tokens of your favorite teams and clubs on Chiliz
          </p>
        </div>

        {/* Message d'erreur pour les erreurs 429 */}
        {isRateLimited && (
          <div className="mb-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
            <div className="flex items-center">
              <img src="/flame.png" alt="Warning" className="w-5 h-5 mr-2" />
              <p className="text-yellow-200">
                Les données de prix sont temporairement indisponibles en raison de limitations de l'API. 
                Veuillez réessayer dans quelques minutes.
              </p>
            </div>
          </div>
        )}

        {/* Message pour les données de fallback */}
        {(isUsingFallback1 || isUsingFallback2 || isUsingFallback3) && (
          <div className="mb-6 p-4 bg-blue-900 border border-blue-700 rounded-lg">
            <div className="flex items-center">
              <img src="/flame.png" alt="Info" className="w-5 h-5 mr-2" />
              <p className="text-blue-200">
                Certains graphiques utilisent des données simulées en raison de limitations temporaires de l'API CoinGecko.
              </p>
            </div>
          </div>
        )}

        {/* Message pour les vraies données */}
        {!isUsingFallback1 && !isUsingFallback2 && !isUsingFallback3 && (selectedToken1 || selectedToken2 || selectedToken3) && (
          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="flex items-center">
              <img src="/flame.png" alt="Success" className="w-5 h-5 mr-2" />
              <p className="text-green-200">
                Graphiques en temps réel : Les données proviennent directement de l'API CoinGecko.
              </p>
            </div>
          </div>
        )}

        {/* Top Tokens Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <img src="/price.png" alt="Top" className="w-6 h-6 mr-2" />
            Top 5 FanTokens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topTokens.map((token, index) => (
              <div key={token.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <img 
                      src={index === 0 ? "/gold.png" : index === 1 ? "/silver.png" : "/bronze.png"} 
                      alt={`Rank ${index + 1}`} 
                      className="w-6 h-6"
                    />
                  </div>
                )}
                <FanTokenCard 
                  token={token} 
                  price={marketData[token.ticker]?.price} 
                  loading={loading}
                  historyData={[]} // Pas d'historique pour les top tokens
                  historyLoading={false}
                  marketData={marketData[token.ticker]}
                  marketLoading={loading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Name, ticker, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as FanToken['category'] | 'all')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="all">All categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'football' ? '⚽ Football' :
                     category === 'esports' ? '🎮 Esports' :
                     category === 'f1' ? '🏎️ F1' : '🏆 Others'}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="all">All countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sort by
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'ticker')}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                  <option value="ticker">Ticker</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:border-green-400"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>

            {/* View mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                View
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    viewMode === 'table'
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Table
                </button>
              </div>
            </div>

            {/* Chart period - réactivé */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chart period
              </label>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as HistoryPeriod)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="24h">24H</option>
                <option value="7d">7D</option>
                <option value="30d">30D</option>
                <option value="90d">3M</option>
                <option value="180d">6M</option>
                <option value="1y">1Y</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-400">
            Showing {filteredTokens.length} of {fanTokens.length} FanTokens
            {(selectedToken1 || selectedToken2 || selectedToken3) && (
              <span className="ml-2 text-yellow-400">
                (Graphiques disponibles pour {selectedToken1}
                {selectedToken2 && `, ${selectedToken2}`}
                {selectedToken3 && `, ${selectedToken3}`}
                {(isUsingFallback1 || isUsingFallback2 || isUsingFallback3) && " - données de démonstration"})
              </span>
            )}
          </p>
        </div>

        {/* Results */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTokens.map((token, idx) => (
              <FanTokenCard 
                key={token.id}
                token={token} 
                price={marketData[token.ticker]?.price} 
                loading={loading}
                historyData={idx === 0 ? historyData1 : idx === 1 ? historyData2 : idx === 2 ? historyData3 : []}
                historyLoading={idx === 0 ? historyLoading1 : idx === 1 ? historyLoading2 : idx === 2 ? historyLoading3 : false}
                marketData={marketData[token.ticker]}
                marketLoading={loading}
              />
            ))}
          </div>
        ) : (
          <FanTokenTable 
            tokens={filteredTokens}
            prices={marketData}
            loading={loading}
            historyData={{
              ...(selectedToken1 ? { [selectedToken1]: historyData1 } : {}),
              ...(selectedToken2 ? { [selectedToken2]: historyData2 } : {}),
              ...(selectedToken3 ? { [selectedToken3]: historyData3 } : {})
            }}
            historyLoading={historyLoading1 || historyLoading2 || historyLoading3}
            marketData={marketData}
            marketLoading={loading}
          />
        )}

        {filteredTokens.length === 0 && (
          <div className="text-center py-12">
            <img src="/trophy.png" alt="No results" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No FanTokens found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedCountry('all');
              }}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 