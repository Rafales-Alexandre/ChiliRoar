"use client";
import React, { useState, useMemo } from 'react';
import FanTokenCard from '../../components/FanTokenCard';
import FanTokenTable from '../../components/FanTokenTable';
import { fanTokens, FanToken, getFanTokensByCategory, getFanTokensByCountry, getTopFanTokens } from '../fanTokens';
import { useFanTokenPrices, useFanTokenHistory, useFanTokenMarketData } from '../hooks/useFanTokenData';
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

  // Hook pour les prix dynamiques
  const tickers = useMemo(() => fanTokens.map(t => t.ticker), []);
  const { data: prices, loading } = useFanTokenPrices(tickers);

  // Hook pour l'historique des prix (sparklines)
  const { data: historyData, loading: historyLoading } = useFanTokenHistory(tickers, chartPeriod);

  // Hook pour les données de marché (variations)
  const { data: marketData, loading: marketLoading } = useFanTokenMarketData(tickers);

  // Obtenir les catégories et pays uniques
  const categories = useMemo(() => {
    const cats = Array.from(new Set(fanTokens.map(token => token.category)));
    return cats.sort();
  }, []);

  const countries = useMemo(() => {
    const countries = Array.from(new Set(fanTokens.map(token => token.country).filter(Boolean)));
    return countries.sort();
  }, []);

  // Filtrer et trier les tokens
  const filteredTokens = useMemo(() => {
    let filtered = fanTokens;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.league?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(token => token.category === selectedCategory);
    }

    // Filtre par pays
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(token => token.country === selectedCountry);
    }

    // Tri
    filtered.sort((a, b) => {
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

    return filtered;
  }, [searchTerm, selectedCategory, selectedCountry, sortBy, sortOrder, prices]);

  const topTokens = getTopFanTokens(5);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">FanTokens</h1>
          <p className="text-gray-300 mb-6">
            Découvrez et échangez les tokens de vos équipes et clubs préférés sur Chiliz
          </p>
        </div>

        {/* Top Tokens Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🔥 Top 5 FanTokens</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topTokens.map((token, index) => (
              <div key={token.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <span className={`text-lg ${
                      index === 0 ? 'text-yellow-400' : 
                      index === 1 ? 'text-gray-300' : 'text-orange-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  </div>
                )}
                <FanTokenCard 
                  token={token} 
                  price={prices[token.ticker]?.price} 
                  loading={loading}
                  historyData={historyData?.[token.ticker] ?? []}
                  historyLoading={historyLoading}
                  marketData={marketData?.[token.ticker]}
                  marketLoading={marketLoading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Recherche */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rechercher
              </label>
              <input
                type="text"
                placeholder="Nom, ticker, pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as FanToken['category'] | 'all')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'football' ? '⚽ Football' :
                     category === 'esports' ? '🎮 Esports' :
                     category === 'f1' ? '🏎️ F1' : '🏆 Autres'}
                  </option>
                ))}
              </select>
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pays
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="all">Tous les pays</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Tri */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trier par
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'ticker')}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="price">Prix</option>
                  <option value="name">Nom</option>
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

            {/* Mode d'affichage */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affichage
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:border-green-400 ${
                    viewMode === 'cards'
                      ? 'bg-green-600 border-green-400 text-white'
                      : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  }`}
                >
                  📱
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:border-green-400 ${
                    viewMode === 'table'
                      ? 'bg-green-600 border-green-400 text-white'
                      : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                  }`}
                >
                  📊
                </button>
              </div>
            </div>

            {/* Période du graphique */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Période
              </label>
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as HistoryPeriod)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="24h">24H</option>
                <option value="7d">7J</option>
                <option value="30d">30J</option>
                <option value="90d">3M</option>
                <option value="180d">6M</option>
                <option value="1y">1A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">
              {filteredTokens.length} FanToken{filteredTokens.length !== 1 ? 's' : ''} trouvé{filteredTokens.length !== 1 ? 's' : ''}
            </h2>
          </div>

          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTokens.map((token) => (
                <FanTokenCard
                  key={token.id}
                  token={token}
                  price={prices[token.ticker]?.price}
                  loading={loading}
                  historyData={historyData?.[token.ticker] ?? []}
                  historyLoading={historyLoading}
                  marketData={marketData?.[token.ticker]}
                  marketLoading={marketLoading}
                />
              ))}
            </div>
          ) : (
            <FanTokenTable
              tokens={filteredTokens}
              prices={prices}
              loading={loading}
              historyData={historyData}
              historyLoading={historyLoading}
              marketData={marketData}
              marketLoading={marketLoading}
            />
          )}
        </div>
      </main>
    </div>
  );
} 