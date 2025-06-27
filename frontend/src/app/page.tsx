import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TableSection from '../components/TableSection';
import Treemap from '../components/Treemap';
import './globals.css';

const topGainers = [
  { name: 'MOONBERG', value: '8.05%', delta: '+805bps', color: 'bg-black' },
  { name: 'ANOMA', value: '10.78%', delta: '+658bps', color: 'bg-red-500' },
  { name: 'SAHARAAI', value: '2.53%', delta: '+142bps', color: 'bg-yellow-400' },
  { name: 'LUMITERRA', value: '2.17%', delta: '+78bps', color: 'bg-amber-200' },
  { name: 'BOUNDLESS', value: '1.64%', delta: '+54bps', color: 'bg-gray-400' },
  { name: 'MONAD', value: '2.90%', delta: '+48bps', color: 'bg-purple-600' },
  { name: 'PUFFPAW', value: '0.64%', delta: '+42bps', color: 'bg-red-400' },
  { name: 'TRUST', value: '0.35%', delta: '+20bps', color: 'bg-green-400' },
  { name: 'MULTIBANK', value: '0.84%', delta: '+18bps', color: 'bg-gray-700' },
  { name: 'YEET', value: '0.32%', delta: '+8bps', color: 'bg-pink-400' },
];

const topLosers = [
  { name: 'HUMANITY', value: '1.13%', delta: '-221bps', color: 'bg-orange-500' },
  { name: 'OPENLEDGER', value: '5.53%', delta: '-183bps', color: 'bg-red-400' },
];

const treemapData = [
  { name: 'ANOMA', value: 10.81, color: 'bg-green-500', crown: 1, icon: '🇨' },
  { name: 'MOONBERG', value: 8.03, color: 'bg-black', crown: 2, icon: '⚫' },
  { name: 'OPENLEDGER', value: 5.53, color: 'bg-red-400', crown: 3, icon: '🟠' },
  { name: 'INFINEX', value: 4.18, color: 'bg-red-500', icon: '🟤' },
  { name: 'MONAD', value: 2.94, color: 'bg-purple-600', icon: '🟣' },
  { name: 'PUMP', value: 2.63, color: 'bg-green-900', icon: '🟢' },
  { name: 'WARD', value: 2.43, color: 'bg-gray-900', icon: '🟤' },
  { name: 'BLESS', value: 2.41, color: 'bg-gray-700', icon: '⚪' },
  { name: 'CALDERA', value: 2.20, color: 'bg-orange-600', icon: '🟠' },
  { name: 'LUMITERRA', value: 2.17, color: 'bg-amber-200', icon: '🟡' },
  { name: 'NOYA', value: 2.09, color: 'bg-red-700', icon: '🔴' },
  { name: 'HANA', value: 2.01, color: 'bg-pink-600', icon: '💗' },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <Header />
        <div className="flex gap-8">
          {/* Colonne gauche */}
          <div className="w-1/3">
            <h2 className="text-xl font-bold mb-4">Pre-TGE Mindshare Arena</h2>
            <TableSection title="Top Gainer" data={topGainers} positive={true} />
            <TableSection title="Top Loser" data={topLosers} positive={false} />
          </div>
          {/* Colonne droite */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold">Top20 &gt; Top21-Top50 &gt; Top51-Top100</div>
              <div className="flex gap-2">
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">All Languages</button>
                <button className="bg-gray-800 text-green-400 px-3 py-1 rounded">24H</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">48H</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">7D</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">30D</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">3M</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">6M</button>
                <button className="bg-gray-800 text-gray-200 px-3 py-1 rounded">12M</button>
              </div>
            </div>
            <Treemap data={treemapData} />
          </div>
        </div>
      </main>
    </div>
  );
} 