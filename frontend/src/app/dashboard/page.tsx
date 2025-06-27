"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import TableSection from '../../components/TableSection';
import Treemap from '../../components/Treemap';
import FanTokenStats from '../../components/FanTokenStats';
import { getTopFanTokens } from '../fanTokens';
import { useFanTokenMarketData } from '../hooks/useFanTokenData';
import { useFanTokenHistory } from '../hooks/useFanTokenData';
import { HistoryPeriod } from '../types';

const treemapTickers = ['OG','ASR','PSG','GAL','BAR','JUV','CITY','ATM','ACM','INTER','SPURS','EFC'];
const PERIODS: { label: string; value: HistoryPeriod }[] = [
  { label: '24H', value: '24h' },
  { label: '7J', value: '7d' },
  { label: '30J', value: '30d' },
  { label: '3M', value: '90d' },
  { label: '6M', value: '180d' },
  { label: '1A', value: '1y' },
];

export default function Dashboard() {
  const [period, setPeriod] = useState<HistoryPeriod>('24h');

  const { data: marketData, loading } = useFanTokenMarketData(treemapTickers);
  const { data: historyData, loading: loadingHistory } = useFanTokenHistory(treemapTickers, period);

  // Top FanTokens Gainers (variation 24h)
  const topGainers = [
    { name: 'OG', value: marketData['OG']?.change24h !== undefined ? `${marketData['OG'].change24h.toFixed(2)}%` : '15.2%', delta: '+1520bps', color: 'bg-purple-600', variation: marketData['OG']?.change24h },
    { name: 'ASR', value: marketData['ASR']?.change24h !== undefined ? `${marketData['ASR'].change24h.toFixed(2)}%` : '12.8%', delta: '+1280bps', color: 'bg-red-600', variation: marketData['ASR']?.change24h },
    { name: 'PSG', value: marketData['PSG']?.change24h !== undefined ? `${marketData['PSG'].change24h.toFixed(2)}%` : '8.5%', delta: '+850bps', color: 'bg-blue-600', variation: marketData['PSG']?.change24h },
    { name: 'GAL', value: marketData['GAL']?.change24h !== undefined ? `${marketData['GAL'].change24h.toFixed(2)}%` : '6.3%', delta: '+630bps', color: 'bg-yellow-500', variation: marketData['GAL']?.change24h },
    { name: 'BAR', value: marketData['BAR']?.change24h !== undefined ? `${marketData['BAR'].change24h.toFixed(2)}%` : '5.7%', delta: '+570bps', color: 'bg-red-500', variation: marketData['BAR']?.change24h },
    { name: 'JUV', value: marketData['JUV']?.change24h !== undefined ? `${marketData['JUV'].change24h.toFixed(2)}%` : '4.2%', delta: '+420bps', color: 'bg-black', variation: marketData['JUV']?.change24h },
    { name: 'CITY', value: marketData['CITY']?.change24h !== undefined ? `${marketData['CITY'].change24h.toFixed(2)}%` : '3.8%', delta: '+380bps', color: 'bg-blue-500', variation: marketData['CITY']?.change24h },
    { name: 'ATM', value: marketData['ATM']?.change24h !== undefined ? `${marketData['ATM'].change24h.toFixed(2)}%` : '2.9%', delta: '+290bps', color: 'bg-red-400', variation: marketData['ATM']?.change24h },
    { name: 'ACM', value: marketData['ACM']?.change24h !== undefined ? `${marketData['ACM'].change24h.toFixed(2)}%` : '2.1%', delta: '+210bps', color: 'bg-red-600', variation: marketData['ACM']?.change24h },
    { name: 'INTER', value: marketData['INTER']?.change24h !== undefined ? `${marketData['INTER'].change24h.toFixed(2)}%` : '1.5%', delta: '+150bps', color: 'bg-blue-600', variation: marketData['INTER']?.change24h },
  ];

  // Top FanTokens Losers (variation 24h)
  const topLosers = [
    { name: 'SPURS', value: marketData['SPURS']?.change24h !== undefined ? `${marketData['SPURS'].change24h.toFixed(2)}%` : '3.2%', delta: '-320bps', color: 'bg-white', variation: marketData['SPURS']?.change24h },
    { name: 'EFC', value: marketData['EFC']?.change24h !== undefined ? `${marketData['EFC'].change24h.toFixed(2)}%` : '2.8%', delta: '-280bps', color: 'bg-blue-600', variation: marketData['EFC']?.change24h },
    { name: 'LUFC', value: marketData['LUFC']?.change24h !== undefined ? `${marketData['LUFC'].change24h.toFixed(2)}%` : '2.1%', delta: '-210bps', color: 'bg-yellow-500', variation: marketData['LUFC']?.change24h },
  ];

  // Top Roars Performers (basé sur les données des Roars)
  const topRoars = [
    { name: 'Nick Ducoff', value: '306', delta: '+45', color: 'bg-yellow-500' },
    { name: 'based16z', value: '232', delta: '+32', color: 'bg-gray-400' },
    { name: 'Mosi', value: '224', delta: '+28', color: 'bg-orange-500' },
    { name: 'mary', value: '187', delta: '+23', color: 'bg-pink-400' },
    { name: 'mert', value: '186', delta: '+21', color: 'bg-blue-500' },
    { name: 'moon', value: '158', delta: '+18', color: 'bg-purple-600' },
    { name: 'Makina', value: '149', delta: '+15', color: 'bg-green-500' },
    { name: 'Wazz', value: '127', delta: '+12', color: 'bg-red-500' },
    { name: 'Noah', value: '108', delta: '+9', color: 'bg-gray-600' },
    { name: 'Taiki', value: '104', delta: '+7', color: 'bg-blue-600' },
  ];

  // Données pour le Treemap (variation 24h + prix en petit + historique)
  const treemapData = treemapTickers.map(ticker => ({
    name: ticker,
    value: marketData[ticker]?.change24h ?? 0,
    price: marketData[ticker]?.price,
    color: getColorForTicker(ticker),
    crown: getCrownForTicker(ticker),
    icon: getIconForTicker(ticker),
    history: historyData[ticker] ?? [],
  }));

  function getColorForTicker(ticker: string) {
    switch (ticker) {
      case 'OG': return 'bg-purple-600';
      case 'ASR': return 'bg-red-600';
      case 'PSG': return 'bg-blue-600';
      case 'GAL': return 'bg-yellow-500';
      case 'BAR': return 'bg-red-500';
      case 'JUV': return 'bg-black';
      case 'CITY': return 'bg-blue-500';
      case 'ATM': return 'bg-red-400';
      case 'ACM': return 'bg-red-600';
      case 'INTER': return 'bg-blue-600';
      case 'SPURS': return 'bg-white';
      case 'EFC': return 'bg-blue-600';
      default: return 'bg-gray-700';
    }
  }
  function getCrownForTicker(ticker: string) {
    switch (ticker) {
      case 'OG': return 1;
      case 'ASR': return 2;
      case 'PSG': return 3;
      default: return undefined;
    }
  }
  function getIconForTicker(ticker: string) {
    switch (ticker) {
      case 'OG': return '';
      default: return '';
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        {/* Section FanTokens */}
        <div className="mb-8">
          <FanTokenStats />
        </div>
        <div className="flex gap-8">
          {/* Colonne gauche */}
          <div className="w-1/3">
            <h2 className="text-xl font-bold mb-4 text-white">🏆 ChiliRoar Arena</h2>
            <TableSection title="Top FanTokens" data={topGainers} positive={true} />
            <TableSection title="Top Roars" data={topRoars} positive={true} />
            <TableSection title="FanTokens en baisse" data={topLosers} positive={false} />
          </div>
          {/* Colonne droite */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-white">FanTokens par Popularité &gt; Performance &gt; Volume</div>
              <div className="flex gap-2">
                {PERIODS.map(p => (
                  <button
                    key={p.value}
                    className={`bg-gray-800 px-3 py-1 rounded ${period === p.value ? 'text-green-400 font-bold border border-green-400' : 'text-gray-200'}`}
                    onClick={() => setPeriod(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <Treemap data={treemapData} loading={loading || loadingHistory} />
          </div>
        </div>
      </main>
    </div>
  );
} 