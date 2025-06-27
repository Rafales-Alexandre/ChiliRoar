"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// Types pour les airdrops
interface Airdrop {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorLogo: string;
  token: {
    symbol: string;
    name: string;
    amount: number;
    value: number;
  };
  requirements: string[];
  eligibility: {
    minHoldings?: number;
    minActivity?: number;
    whitelist?: boolean;
    kyc?: boolean;
  };
  status: 'upcoming' | 'active' | 'ended' | 'claimed';
  startDate: string;
  endDate: string;
  totalAllocation: number;
  participants: number;
  maxParticipants?: number;
  tags: string[];
  isWhitelisted?: boolean;
  hasClaimed?: boolean;
}

interface UserAirdropStats {
  totalClaimed: number;
  totalValue: number;
  airdropsParticipated: number;
  whitelistedCount: number;
  nextAirdrop?: string;
}

// Données des airdrops
const airdrops: Airdrop[] = [
  {
    id: '1',
    title: 'PSG FanToken Airdrop',
    description: 'Distribution gratuite de tokens PSG pour les supporters du Paris Saint-Germain. Participez à notre communauté et recevez des tokens PSG !',
    sponsor: 'Paris Saint-Germain',
    sponsorLogo: '/PSG.png',
    token: {
      symbol: 'PSG',
      name: 'PSG FanToken',
      amount: 100,
      value: 141
    },
    requirements: [
      'Être inscrit sur ChiliRoar',
      'Avoir un compte actif depuis 7 jours',
      'Participer à au moins 3 discussions'
    ],
    eligibility: {
      minActivity: 7,
      whitelist: true
    },
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    totalAllocation: 1000000,
    participants: 847,
    maxParticipants: 1000,
    tags: ['Football', 'PSG', 'FanToken', 'Whitelist'],
    isWhitelisted: true,
    hasClaimed: false
  },
  {
    id: '2',
    title: 'OG Gaming Rewards',
    description: 'Récompenses spéciales pour la communauté gaming d\'OG Esports. Tokens OG pour les fans de Dota 2 et d\'esports !',
    sponsor: 'OG Esports',
    sponsorLogo: '/OG.png',
    token: {
      symbol: 'OG',
      name: 'OG Token',
      amount: 50,
      value: 194
    },
    requirements: [
      'Être fan d\'esports',
      'Avoir participé à des discussions gaming',
      'Suivre le compte OG officiel'
    ],
    eligibility: {
      minActivity: 3,
      whitelist: false
    },
    status: 'upcoming',
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    totalAllocation: 500000,
    participants: 0,
    maxParticipants: 2000,
    tags: ['Gaming', 'OG', 'Esports', 'Dota2']
  },
  {
    id: '3',
    title: 'AS Roma Community Drop',
    description: 'Distribution de tokens ASR pour la communauté italienne et les supporters de l\'AS Roma. Forza Roma !',
    sponsor: 'AS Roma',
    sponsorLogo: '/ASR.png',
    token: {
      symbol: 'ASR',
      name: 'AS Roma FanToken',
      amount: 75,
      value: 183
    },
    requirements: [
      'Être membre de la communauté ChiliRoar',
      'Avoir un profil complet',
      'Participer à la communauté'
    ],
    eligibility: {
      minActivity: 5,
      whitelist: true
    },
    status: 'ended',
    startDate: '2024-01-15',
    endDate: '2024-02-01',
    totalAllocation: 750000,
    participants: 1203,
    maxParticipants: 1500,
    tags: ['Football', 'ASR', 'Italy', 'Community'],
    isWhitelisted: true,
    hasClaimed: true
  },
  {
    id: '4',
    title: 'ChiliRoar Genesis Airdrop',
    description: 'Airdrop inaugural de ChiliRoar pour les premiers utilisateurs de la plateforme. Rejoignez l\'aventure dès le début !',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    token: {
      symbol: 'CHZ',
      name: 'Chiliz',
      amount: 500,
      value: 250
    },
    requirements: [
      'Être parmi les 1000 premiers utilisateurs',
      'Avoir complété le profil',
      'Être actif sur la plateforme'
    ],
    eligibility: {
      minActivity: 10,
      whitelist: true,
      kyc: true
    },
    status: 'claimed',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    totalAllocation: 500000,
    participants: 1000,
    maxParticipants: 1000,
    tags: ['Genesis', 'ChiliRoar', 'Early Adopters', 'KYC'],
    isWhitelisted: true,
    hasClaimed: true
  },
  {
    id: '5',
    title: 'Barcelona FanToken Drop',
    description: 'Distribution de tokens BAR pour les supporters du FC Barcelona. Visca Barça !',
    sponsor: 'FC Barcelona',
    sponsorLogo: '/LOGO.png',
    token: {
      symbol: 'BAR',
      name: 'Barcelona FanToken',
      amount: 60,
      value: 61.8
    },
    requirements: [
      'Être fan du FC Barcelona',
      'Participer aux discussions football',
      'Avoir un compte vérifié'
    ],
    eligibility: {
      minActivity: 7,
      whitelist: true
    },
    status: 'upcoming',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    totalAllocation: 600000,
    participants: 0,
    maxParticipants: 1500,
    tags: ['Football', 'Barcelona', 'La Liga', 'Spain']
  }
];

// Statistiques utilisateur
const userStats: UserAirdropStats = {
  totalClaimed: 3,
  totalValue: 625,
  airdropsParticipated: 4,
  whitelistedCount: 3,
  nextAirdrop: '2024-02-15'
};

// Composant pour afficher un airdrop
function AirdropCard({ airdrop }: { airdrop: Airdrop }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-400 bg-blue-400/10';
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'ended': return 'text-gray-400 bg-gray-400/10';
      case 'claimed': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Bientôt disponible';
      case 'active': return 'Actif';
      case 'ended': return 'Terminé';
      case 'claimed': return 'Réclamé';
      default: return 'Inconnu';
    }
  };

  const isEligible = airdrop.isWhitelisted !== false;
  const canClaim = airdrop.status === 'active' && isEligible && !airdrop.hasClaimed;
  const isFull = airdrop.maxParticipants && airdrop.participants >= airdrop.maxParticipants;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={airdrop.sponsorLogo} 
            alt={airdrop.sponsor} 
            className="w-12 h-12 rounded-lg object-cover border border-gray-700"
          />
          <div>
            <h3 className="font-bold text-white text-lg">{airdrop.title}</h3>
            <p className="text-gray-400 text-sm">par {airdrop.sponsor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(airdrop.status)}`}>
            {getStatusText(airdrop.status)}
          </span>
          {airdrop.isWhitelisted && (
            <span className="px-2 py-1 rounded-lg text-xs font-medium text-green-400 bg-green-400/10">
              Whitelist
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-300 mb-4">{airdrop.description}</p>

      {/* Token Info */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-3 mb-4 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-blue-400 font-semibold">Token</span>
            <div className="text-white font-bold text-lg">{airdrop.token.symbol}</div>
            <div className="text-gray-400 text-sm">{airdrop.token.name}</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{airdrop.token.amount} {airdrop.token.symbol}</div>
            <div className="text-green-400 text-sm">≈ ${airdrop.token.value}</div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-400">Participants</span>
        <span className="text-white">{airdrop.participants.toLocaleString()}</span>
        {airdrop.maxParticipants && (
          <span className="text-gray-400">/ {airdrop.maxParticipants.toLocaleString()}</span>
        )}
      </div>

      {/* Progress Bar */}
      {airdrop.maxParticipants && (
        <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(airdrop.participants / airdrop.maxParticipants) * 100}%` }}
          ></div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {airdrop.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* Eligibility Status */}
      <div className="mb-4">
        {isEligible ? (
          <div className="flex items-center gap-2 text-green-400">
            <span className="text-lg">✅</span>
            <span className="text-sm font-medium">Éligible</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <span className="text-lg">❌</span>
            <span className="text-sm font-medium">Non éligible</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {canClaim && !isFull && (
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 mb-4">
          Réclamer {airdrop.token.amount} {airdrop.token.symbol}
        </button>
      )}

      {isFull && (
        <div className="w-full bg-red-600/20 text-red-400 py-2 px-4 rounded-lg font-medium text-center mb-4">
          Airdrop complet
        </div>
      )}

      {airdrop.hasClaimed && (
        <div className="w-full bg-purple-600/20 text-purple-400 py-2 px-4 rounded-lg font-medium text-center mb-4">
          ✅ Réclamé
        </div>
      )}

      {/* Bouton pour voir plus */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200"
      >
        {isExpanded ? 'Voir moins' : 'Voir les détails'}
      </button>

      {/* Détails expandus */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="font-semibold text-white mb-2">Exigences :</h4>
          <ul className="space-y-1 mb-4">
            {airdrop.requirements.map((req, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {req}
              </li>
            ))}
          </ul>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Début :</span>
              <div className="text-white">{new Date(airdrop.startDate).toLocaleDateString('fr-FR')}</div>
            </div>
            <div>
              <span className="text-gray-400">Fin :</span>
              <div className="text-white">{new Date(airdrop.endDate).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          {airdrop.eligibility.kyc && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <span>🔒</span>
                <span className="text-sm font-medium">KYC requis</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Composant pour les statistiques utilisateur
function UserAirdropStatsCard({ stats }: { stats: UserAirdropStats }) {
  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/20">
      <h2 className="text-xl font-bold text-white mb-4">📊 Vos Airdrops</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalClaimed}</div>
          <div className="text-sm text-gray-400">Airdrops réclamés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">${stats.totalValue}</div>
          <div className="text-sm text-gray-400">Valeur totale</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Participations</span>
          <span className="text-white font-medium">{stats.airdropsParticipated}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Whitelist</span>
          <span className="text-green-400 font-medium">{stats.whitelistedCount}</span>
        </div>
      </div>

      {stats.nextAirdrop && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
          <div className="text-blue-400 text-sm font-medium">Prochain airdrop</div>
          <div className="text-white">{new Date(stats.nextAirdrop).toLocaleDateString('fr-FR')}</div>
        </div>
      )}
    </div>
  );
}

export default function AirdropsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');

  const filters = [
    { id: 'all', label: 'Tous', icon: '🎯' },
    { id: 'football', label: 'Football', icon: '⚽' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'genesis', label: 'Genesis', icon: '🌟' }
  ];

  const statuses = [
    { id: 'all', label: 'Tous les statuts' },
    { id: 'upcoming', label: 'Bientôt disponible' },
    { id: 'active', label: 'Actifs' },
    { id: 'ended', label: 'Terminés' },
    { id: 'claimed', label: 'Réclamés' }
  ];

  const filteredAirdrops = airdrops.filter(airdrop => {
    const categoryMatch = activeFilter === 'all' || 
      (activeFilter === 'football' && airdrop.tags.includes('Football')) ||
      (activeFilter === 'gaming' && airdrop.tags.includes('Gaming')) ||
      (activeFilter === 'genesis' && airdrop.tags.includes('Genesis'));
    
    const statusMatch = activeStatus === 'all' || airdrop.status === activeStatus;
    
    return categoryMatch && statusMatch;
  });

  const activeAirdrops = airdrops.filter(a => a.status === 'active').length;
  const upcomingAirdrops = airdrops.filter(a => a.status === 'upcoming').length;
  const totalValue = airdrops.reduce((sum, a) => sum + a.token.value, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🎁 Airdrops</h1>
          <p className="text-gray-400 mb-6">
            Recevez gratuitement des tokens de vos équipes et clubs préférés
          </p>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-white">{activeAirdrops}</div>
            <div className="text-sm text-gray-300">Airdrops actifs</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-white">{upcomingAirdrops}</div>
            <div className="text-sm text-gray-300">Bientôt disponibles</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Valeur totale</div>
          </div>
          <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl p-4 border border-orange-500/20">
            <div className="text-2xl font-bold text-white">{airdrops.length}</div>
            <div className="text-sm text-gray-300">Total airdrops</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-3">
            {/* Filtres */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                  <div className="flex gap-2">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          activeFilter === filter.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <span className="mr-1">{filter.icon}</span>
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
                  <div className="flex gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status.id}
                        onClick={() => setActiveStatus(status.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          activeStatus === status.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Airdrops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAirdrops.map((airdrop) => (
                <AirdropCard key={airdrop.id} airdrop={airdrop} />
              ))}
            </div>

            {filteredAirdrops.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-xl font-bold text-white mb-2">Aucun airdrop trouvé</h3>
                <p className="text-gray-400">Essayez de modifier vos filtres</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Statistiques utilisateur */}
              <UserAirdropStatsCard stats={userStats} />

              {/* Guide des airdrops */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold text-white mb-4">📖 Guide des Airdrops</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">1.</span>
                    <div>
                      <div className="text-white font-medium">Vérifiez l'éligibilité</div>
                      <div className="text-gray-400">Assurez-vous de remplir tous les critères</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">2.</span>
                    <div>
                      <div className="text-white font-medium">Participez activement</div>
                      <div className="text-gray-400">Engagez-vous dans la communauté</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-400 mt-1">3.</span>
                    <div>
                      <div className="text-white font-medium">Réclamez vos tokens</div>
                      <div className="text-gray-400">Cliquez sur "Réclamer" quand disponible</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prochains airdrops */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold text-white mb-4">⏰ Prochains Airdrops</h3>
                <div className="space-y-3">
                  {airdrops
                    .filter(a => a.status === 'upcoming')
                    .slice(0, 3)
                    .map((airdrop) => (
                      <div key={airdrop.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                        <img src={airdrop.sponsorLogo} alt={airdrop.sponsor} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{airdrop.title}</div>
                          <div className="text-blue-400 text-xs">{new Date(airdrop.startDate).toLocaleDateString('fr-FR')}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm font-medium">{airdrop.token.amount} {airdrop.token.symbol}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 