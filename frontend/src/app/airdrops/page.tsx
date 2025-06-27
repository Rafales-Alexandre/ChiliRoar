"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// Types for airdrops
interface Airdrop {
  id: string;
  name: string;
  description: string;
  token: string;
  amount: string;
  value: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  requirements: string[];
  participants: number;
  maxParticipants?: number;
  image?: string;
}

interface UserAirdropStats {
  totalClaimed: number;
  totalValue: number;
  airdropsParticipated: number;
  whitelistedCount: number;
  nextAirdrop?: string;
}

// Airdrop data
const mockAirdrops: Airdrop[] = [
  {
    id: '1',
    name: 'ChiliRoar Genesis Airdrop',
    description: 'The first airdrop for early ChiliRoar community members. Reward for being part of our journey from the beginning.',
    token: 'ROAR',
    amount: '100 ROAR',
    value: '$50',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    requirements: ['Hold at least 1 FanToken', 'Have 10+ Roars', 'Be active for 30+ days'],
    participants: 1250,
    maxParticipants: 2000,
    image: '/airdrop.png'
  },
  {
    id: '2',
    name: 'PSG FanToken Rewards',
    description: 'Exclusive airdrop for PSG FanToken holders. Special rewards for the most loyal PSG supporters.',
    token: 'PSG',
    amount: '50 PSG',
    value: '$75',
    status: 'upcoming',
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    requirements: ['Hold PSG FanToken', 'Minimum 100 PSG tokens', 'Complete PSG missions'],
    participants: 0,
    maxParticipants: 500,
    image: '/PSG.png'
  },
  {
    id: '3',
    name: 'OG Community Airdrop',
    description: 'Rewards for OG token holders who actively participate in the community and create content.',
    token: 'OG',
    amount: '25 OG',
    value: '$125',
    status: 'upcoming',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    requirements: ['Hold OG FanToken', 'Create 5+ Roars', 'Have 100+ followers'],
    participants: 0,
    maxParticipants: 1000,
    image: '/OG.png'
  },
  {
    id: '4',
    name: 'ASR Trading Competition',
    description: 'Airdrop for the top traders of ASR FanToken. Rewards based on trading volume and performance.',
    token: 'ASR',
    amount: '75 ASR',
    value: '$90',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    requirements: ['Trade ASR FanToken', 'Minimum $1000 volume', 'Top 100 traders'],
    participants: 850,
    maxParticipants: 100,
    image: '/ASR.png'
  },
  {
    id: '5',
    name: 'ChiliRoar Beta Tester Rewards',
    description: 'Special airdrop for users who participated in the ChiliRoar beta testing phase.',
    token: 'ROAR',
    amount: '200 ROAR',
    value: '$100',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2024-01-01',
    requirements: ['Beta tester', 'Reported bugs', 'Provided feedback'],
    participants: 500,
    image: '/airdrop.png'
  }
];

// User statistics
const userStats: UserAirdropStats = {
  totalClaimed: 3,
  totalValue: 625,
  airdropsParticipated: 4,
  whitelistedCount: 3,
  nextAirdrop: '2024-02-15'
};

function AirdropCard({ airdrop }: { airdrop: Airdrop }) {
  const getStatusColor = (status: Airdrop['status']) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-blue-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: Airdrop['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    if (!airdrop.maxParticipants) return 0;
    return Math.min((airdrop.participants / airdrop.maxParticipants) * 100, 100);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img 
            src={airdrop.image || '/airdrop.png'} 
            alt={airdrop.name}
            className="w-12 h-12 rounded-lg mr-3"
          />
          <div>
            <h3 className="text-lg font-semibold text-white">{airdrop.name}</h3>
            <p className="text-sm text-gray-400">{airdrop.token} Token</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(airdrop.status)}`}>
          {getStatusText(airdrop.status)}
        </span>
      </div>

      <p className="text-gray-300 mb-4 text-sm">{airdrop.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-400">Reward</div>
          <div className="text-lg font-semibold text-white">{airdrop.amount}</div>
          <div className="text-sm text-green-400">{airdrop.value}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Participants</div>
          <div className="text-lg font-semibold text-white">
            {airdrop.participants.toLocaleString()}
            {airdrop.maxParticipants && ` / ${airdrop.maxParticipants.toLocaleString()}`}
          </div>
          {airdrop.maxParticipants && (
            <div className="text-sm text-gray-400">
              {Math.round((airdrop.participants / airdrop.maxParticipants) * 100)}% filled
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-sm text-gray-400 mb-2">Requirements:</div>
        <ul className="space-y-1">
          {airdrop.requirements.map((req, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-center">
              <img src="/price.png" alt="Requirement" className="w-3 h-3 mr-2" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <span>Start: {formatDate(airdrop.startDate)}</span>
        <span>End: {formatDate(airdrop.endDate)}</span>
      </div>

      <button
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          airdrop.status === 'active'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : airdrop.status === 'upcoming'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
        disabled={airdrop.status === 'completed'}
      >
        {airdrop.status === 'active' ? 'Participate Now' :
         airdrop.status === 'upcoming' ? 'Coming Soon' :
         'Completed'}
      </button>
    </div>
  );
}

function UserAirdropStatsCard({ stats }: { stats: UserAirdropStats }) {
  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-lg font-semibold text-white mb-4">Your Airdrop Stats</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-2xl font-bold text-white">{stats.totalClaimed}</p>
          <p className="text-sm text-gray-300">Total Claimed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-green-400">${stats.totalValue}</p>
          <p className="text-sm text-gray-300">Total Value</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{stats.airdropsParticipated}</p>
          <p className="text-sm text-gray-300">Participated</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-400">{stats.whitelistedCount}</p>
          <p className="text-sm text-gray-300">Whitelisted</p>
        </div>
      </div>
      {stats.nextAirdrop && (
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg">
          <p className="text-sm text-blue-300">
            Next airdrop: {new Date(stats.nextAirdrop).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
      )}
    </div>
  );
}

export default function AirdropsPage() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAirdrops = mockAirdrops.filter(airdrop => {
    const matchesStatus = selectedStatus === 'all' || airdrop.status === selectedStatus;
    const matchesSearch = airdrop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         airdrop.token.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/airdrop.png" alt="Airdrops" className="w-8 h-8 mr-3" />
            Airdrops
          </h1>
          <p className="text-gray-300 mb-6">
            Discover and participate in exclusive airdrops from your favorite FanTokens and the ChiliRoar platform
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-white">
              {mockAirdrops.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-300">Active Airdrops</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-white">
              {mockAirdrops.filter(a => a.status === 'upcoming').length}
            </div>
            <div className="text-sm text-gray-300">Upcoming</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">
              {mockAirdrops.reduce((sum, a) => sum + a.participants, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Total Participants</div>
          </div>
          <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/20">
            <div className="text-2xl font-bold text-white">
              ${mockAirdrops.reduce((sum, a) => sum + parseFloat(a.value.replace('$', '')), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-300">Total Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search airdrops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'upcoming', 'completed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedStatus === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Airdrops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAirdrops.map(airdrop => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>

        {filteredAirdrops.length === 0 && (
          <div className="text-center py-12">
            <img src="/airdrop.png" alt="No airdrops" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No airdrops found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
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