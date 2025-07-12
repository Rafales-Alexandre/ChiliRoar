"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';

interface Raffle {
  id: string;
  name: string;
  description: string;
  prize: string;
  prizeValue: string;
  entryCost: number; // en RoarPoints
  status: 'active' | 'upcoming' | 'completed';
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  winners?: string[];
  image: string;
  category: 'fanToken' | 'nft' | 'merchandise' | 'experience';
}

interface Winner {
  id: string;
  raffleId: string;
  raffleName: string;
  winner: string;
  prize: string;
  date: string;
  transactionHash: string;
}

// Données mock pour les raffles
const mockRaffles: Raffle[] = [
  {
    id: '1',
    name: 'PSG FanToken Mega Raffle',
    description: 'Gagnez 1000 PSG FanTokens dans cette raffle exclusive pour les supporters du PSG !',
    prize: '1000 PSG FanTokens',
    prizeValue: '$1500',
    entryCost: 50,
    status: 'active',
    participants: 234,
    maxParticipants: 500,
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    image: '/PSG.png',
    category: 'fanToken'
  },
  {
    id: '2',
    name: 'OG Esports NFT Collection',
    description: 'Raffle pour gagner une collection exclusive de NFTs OG Esports !',
    prize: 'OG Esports NFT Collection',
    prizeValue: '$2500',
    entryCost: 100,
    status: 'active',
    participants: 156,
    maxParticipants: 300,
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    image: '/OG.png',
    category: 'nft'
  },
  {
    id: '3',
    name: 'ASR Roma Jersey Signed',
    description: 'Maillot officiel de l\'AS Roma signé par l\'équipe !',
    prize: 'ASR Roma Jersey Signed',
    prizeValue: '$800',
    entryCost: 25,
    status: 'upcoming',
    participants: 0,
    maxParticipants: 200,
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    image: '/ASR.png',
    category: 'merchandise'
  },
  {
    id: '4',
    name: 'VIP Match Experience',
    description: 'Expérience VIP pour assister à un match en tribune officielle !',
    prize: 'VIP Match Experience',
    prizeValue: '$1200',
    entryCost: 75,
    status: 'completed',
    participants: 180,
    maxParticipants: 180,
    startDate: '2023-12-01',
    endDate: '2024-01-01',
    winners: ['0x1234...5678', '0x8765...4321'],
    image: '/trophy.png',
    category: 'experience'
  }
];

// Historique des gagnants
const mockWinners: Winner[] = [
  {
    id: '1',
    raffleId: '4',
    raffleName: 'VIP Match Experience',
    winner: '0x1234...5678',
    prize: 'VIP Match Experience',
    date: '2024-01-01',
    transactionHash: '0xabc123...def456'
  },
  {
    id: '2',
    raffleId: '4',
    raffleName: 'VIP Match Experience',
    winner: '0x8765...4321',
    prize: 'VIP Match Experience',
    date: '2024-01-01',
    transactionHash: '0xdef456...ghi789'
  },
  {
    id: '3',
    raffleId: '5',
    raffleName: 'ChiliRoar Genesis Raffle',
    winner: '0x9876...5432',
    prize: '500 ROAR Tokens',
    date: '2023-12-15',
    transactionHash: '0xghi789...jkl012'
  }
];

// Composant pour afficher une raffle
function RaffleCard({ raffle, onEnter }: { raffle: Raffle; onEnter: (raffleId: string, entries: number) => void }) {
  const [entryAmount, setEntryAmount] = useState(1);
  const [isEntering, setIsEntering] = useState(false);
  
  const progressPercentage = (raffle.participants / raffle.maxParticipants) * 100;
  const timeLeft = new Date(raffle.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'upcoming': return 'bg-blue-600';
      case 'completed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fanToken': return '🪙';
      case 'nft': return '🖼️';
      case 'merchandise': return '👕';
      case 'experience': return '🎫';
      default: return '🎁';
    }
  };

  const handleEnter = async () => {
    setIsEntering(true);
    try {
      await onEnter(raffle.id, entryAmount);
    } finally {
      setIsEntering(false);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={raffle.image} 
            alt={raffle.name} 
            className="w-12 h-12 rounded-lg object-cover border border-gray-700"
          />
          <div>
            <h3 className="font-bold text-white text-lg">{raffle.name}</h3>
            <p className="text-gray-400 text-sm">{raffle.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(raffle.status)} text-white`}>
            {raffle.status.toUpperCase()}
          </span>
          <span className="text-2xl">{getCategoryIcon(raffle.category)}</span>
        </div>
      </div>

      {/* Prize */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-3 mb-4 border border-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-400 font-semibold">Prix</span>
            <div className="text-white font-bold text-lg">{raffle.prize}</div>
            <div className="text-gray-400 text-sm">{raffle.prizeValue}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Participants</span>
          <span className="text-sm text-white">{raffle.participants} / {raffle.maxParticipants}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Time left */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Temps restant</span>
          <span className="text-white text-sm font-medium">
            {daysLeft > 0 ? `${daysLeft} jours` : 'Terminé'}
          </span>
        </div>
      </div>

      {/* Entry section */}
      {raffle.status === 'active' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Coût d'entrée</span>
            <span className="text-green-400 font-medium">{raffle.entryCost} RoarPoints</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Nombre d'entrées:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={entryAmount}
              onChange={(e) => setEntryAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm w-16"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Coût total</span>
            <span className="text-white font-bold">{raffle.entryCost * entryAmount} RoarPoints</span>
          </div>
          
          <button
            onClick={handleEnter}
            disabled={isEntering}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isEntering ? 'Participation en cours...' : `Participer (${entryAmount} entrée(s))`}
          </button>
        </div>
      )}

      {raffle.status === 'upcoming' && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">Commence le {new Date(raffle.startDate).toLocaleDateString('fr-FR')}</p>
        </div>
      )}

      {raffle.status === 'completed' && raffle.winners && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-white font-semibold mb-2">Gagnants:</h4>
          <div className="space-y-1">
            {raffle.winners.map((winner, index) => (
              <div key={index} className="text-green-400 text-sm">
                🎉 {winner}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant pour l'historique des gagnants
function WinnersHistory({ winners }: { winners: Winner[] }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <img src="/trophy.png" alt="Winners" className="w-6 h-6 mr-2" />
        Historique des Gagnants
      </h2>
      
      <div className="space-y-3">
        {winners.map((winner) => (
          <div key={winner.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-white font-semibold">{winner.raffleName}</h3>
                <p className="text-gray-400 text-sm">Gagnant: {winner.winner}</p>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-medium">{winner.prize}</div>
                <div className="text-gray-400 text-xs">{new Date(winner.date).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              TX: {winner.transactionHash}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RafflesPage() {
  const { user } = useAuth();
  const { isConnected, account } = useWallet();
  const { showSuccess, showError, showInfo, showLoading } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [userRoarPoints, setUserRoarPoints] = useState(1250); // Mock data

  const filteredRaffles = mockRaffles.filter(raffle => {
    if (selectedFilter === 'all') return true;
    return raffle.status === selectedFilter;
  });

  const handleEnterRaffle = async (raffleId: string, entries: number) => {
    // Simulation d'entrée en raffle
    const raffle = mockRaffles.find(r => r.id === raffleId);
    if (!raffle) return;

    const totalCost = raffle.entryCost * entries;
    
    if (userRoarPoints < totalCost) {
      showError('RoarPoints insuffisants pour participer à cette raffle !');
      return;
    }

    if (!isConnected) {
      showWarning('Veuillez connecter votre wallet pour participer aux raffles.');
      return;
    }

    const loadingToast = showLoading('Participation en cours...');

    try {
      // Simulation de transaction
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simuler délai réseau
      
      // Mettre à jour le solde
      setUserRoarPoints(prev => prev - totalCost);
      
      // Ici, on appellerait le smart contract
      // await enterRaffleContract.write({
      //   args: [raffleId, entries]
      // });
      
      showSuccess(`Participation réussie ! Vous avez ${entries} entrée(s) dans "${raffle.name}"`);
      
    } catch (error) {
      showError('Erreur lors de la participation. Veuillez réessayer.');
      console.error('Erreur raffle:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/trophy.png" alt="Raffles" className="w-8 h-8 mr-3" />
            Espace Raffle
          </h1>
          <p className="text-gray-300 mb-6">
            Participez aux raffles exclusives et gagnez des prix incroyables avec vos RoarPoints
          </p>
        </div>

        {/* User stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-white">{userRoarPoints}</div>
            <div className="text-sm text-gray-300">RoarPoints disponibles</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-white">{filteredRaffles.filter(r => r.status === 'active').length}</div>
            <div className="text-sm text-gray-300">Raffles actives</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">{mockWinners.length}</div>
            <div className="text-sm text-gray-300">Gagnants totaux</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['all', 'active', 'upcoming', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter === 'all' ? 'Toutes' : 
                 filter === 'active' ? 'Actives' :
                 filter === 'upcoming' ? 'À venir' : 'Terminées'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Raffles */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Raffles Disponibles</h2>
            <div className="space-y-6">
              {filteredRaffles.map((raffle) => (
                <RaffleCard 
                  key={raffle.id} 
                  raffle={raffle} 
                  onEnter={handleEnterRaffle}
                />
              ))}
            </div>
          </div>

          {/* Winners History */}
          <div>
            <WinnersHistory winners={mockWinners} />
          </div>
        </div>
      </main>
    </div>
  );
} 