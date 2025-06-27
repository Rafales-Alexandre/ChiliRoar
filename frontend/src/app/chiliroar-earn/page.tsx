"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// Fonction pour générer des avatars avec DiceBear
const generateAvatar = (name: string) => {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};

// Types pour les missions et récompenses
interface Mission {
  id: string;
  title: string;
  description: string;
  sponsor: string;
  sponsorLogo: string;
  reward: {
    amount: number;
    currency: string;
    token?: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'social' | 'trading' | 'content' | 'community';
  requirements: string[];
  progress: number;
  maxProgress: number;
  deadline?: string;
  isActive: boolean;
  tags: string[];
}

interface UserStats {
  totalEarned: number;
  missionsCompleted: number;
  currentStreak: number;
  rank: string;
  level: number;
  xp: number;
  nextLevelXp: number;
}

// Données des missions
const missions: Mission[] = [
  {
    id: '1',
    title: 'Partagez votre FanToken préféré',
    description: 'Créez un post sur les réseaux sociaux parlant de votre FanToken préféré et utilisez le hashtag #ChiliRoar',
    sponsor: 'PSG FanToken',
    sponsorLogo: '/PSG.png',
    reward: { amount: 50, currency: 'CHZ', token: 'PSG' },
    difficulty: 'easy',
    category: 'social',
    requirements: ['Post sur Twitter/X', 'Hashtag #ChiliRoar', 'Mention @ChiliRoar'],
    progress: 0,
    maxProgress: 1,
    deadline: '2024-02-15',
    isActive: true,
    tags: ['Social Media', 'PSG', 'FanToken']
  },
  {
    id: '2',
    title: 'Analyse technique OG Token',
    description: 'Réalisez une analyse technique complète du token OG et partagez vos insights',
    sponsor: 'OG Esports',
    sponsorLogo: '/OG.png',
    reward: { amount: 100, currency: 'CHZ', token: 'OG' },
    difficulty: 'medium',
    category: 'content',
    requirements: ['Analyse technique', 'Graphiques', 'Prédictions'],
    progress: 0,
    maxProgress: 1,
    isActive: true,
    tags: ['Trading', 'OG', 'Analysis']
  },
  {
    id: '3',
    title: 'Tournoi de trading ASR',
    description: 'Participez au tournoi de trading ASR et atteignez le top 10',
    sponsor: 'AS Roma',
    sponsorLogo: '/ASR.png',
    reward: { amount: 200, currency: 'CHZ', token: 'ASR' },
    difficulty: 'hard',
    category: 'trading',
    requirements: ['Participation au tournoi', 'Top 10 classement', 'Volume minimum'],
    progress: 0,
    maxProgress: 1,
    deadline: '2024-02-20',
    isActive: true,
    tags: ['Trading', 'ASR', 'Tournament']
  },
  {
    id: '4',
    title: 'Créateur de contenu émergent',
    description: 'Créez 5 posts de qualité sur ChiliRoar et atteignez 1000 vues',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 75, currency: 'CHZ' },
    difficulty: 'medium',
    category: 'content',
    requirements: ['5 posts créés', '1000 vues totales', 'Contenu original'],
    progress: 2,
    maxProgress: 5,
    isActive: true,
    tags: ['Content', 'Creator', 'Growth']
  },
  {
    id: '5',
    title: 'Ambassadeur communauté',
    description: 'Aidez 10 nouveaux utilisateurs à rejoindre ChiliRoar',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 150, currency: 'CHZ' },
    difficulty: 'hard',
    category: 'community',
    requirements: ['10 parrainages', 'Utilisateurs actifs', 'Support'],
    progress: 3,
    maxProgress: 10,
    isActive: true,
    tags: ['Community', 'Referral', 'Support']
  },
  {
    id: '6',
    title: 'Daily Check-in',
    description: 'Connectez-vous quotidiennement pendant 7 jours',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 25, currency: 'CHZ' },
    difficulty: 'easy',
    category: 'social',
    requirements: ['7 jours consécutifs', 'Check-in quotidien'],
    progress: 5,
    maxProgress: 7,
    isActive: true,
    tags: ['Daily', 'Streak', 'Engagement']
  }
];

// Statistiques utilisateur
const userStats: UserStats = {
  totalEarned: 1250,
  missionsCompleted: 23,
  currentStreak: 12,
  rank: 'Gold',
  level: 8,
  xp: 1250,
  nextLevelXp: 2000
};

// Composant pour afficher une mission
function MissionCard({ mission }: { mission: Mission }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return '📱';
      case 'trading': return '📈';
      case 'content': return '✍️';
      case 'community': return '👥';
      default: return '🎯';
    }
  };

  const progressPercentage = (mission.progress / mission.maxProgress) * 100;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={mission.sponsorLogo} 
            alt={mission.sponsor} 
            className="w-12 h-12 rounded-lg object-cover border border-gray-700"
          />
          <div>
            <h3 className="font-bold text-white text-lg">{mission.title}</h3>
            <p className="text-gray-400 text-sm">Sponsorisé par {mission.sponsor}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
            {mission.difficulty.toUpperCase()}
          </span>
          <span className="text-2xl">{getCategoryIcon(mission.category)}</span>
        </div>
      </div>

      <p className="text-gray-300 mb-4">{mission.description}</p>

      {/* Récompense */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-3 mb-4 border border-green-500/20">
        <div className="flex items-center justify-between">
          <span className="text-green-400 font-semibold">Récompense</span>
          <div className="text-right">
            <div className="text-white font-bold text-lg">{mission.reward.amount} {mission.reward.currency}</div>
            {mission.reward.token && (
              <div className="text-green-400 text-sm">+ {mission.reward.amount} {mission.reward.token}</div>
            )}
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progression</span>
          <span className="text-white">{mission.progress}/{mission.maxProgress}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mission.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* Bouton pour voir plus */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors duration-200"
      >
        {isExpanded ? 'Voir moins' : 'Voir les détails'}
      </button>

      {/* Détails expandus */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="font-semibold text-white mb-2">Exigences :</h4>
          <ul className="space-y-1 mb-4">
            {mission.requirements.map((req, index) => (
              <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                <span className="text-green-400">✓</span>
                {req}
              </li>
            ))}
          </ul>
          
          {mission.deadline && (
            <div className="text-sm text-gray-400 mb-4">
              <span className="font-medium">Date limite :</span> {new Date(mission.deadline).toLocaleDateString('fr-FR')}
            </div>
          )}

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
            Commencer la mission
          </button>
        </div>
      )}
    </div>
  );
}

// Composant pour les statistiques utilisateur
function UserStatsCard({ stats }: { stats: UserStats }) {
  const levelProgress = (stats.xp / stats.nextLevelXp) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Vos Statistiques</h2>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.rank}</div>
          <div className="text-purple-400 text-sm">Niveau {stats.level}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalEarned}</div>
          <div className="text-sm text-gray-400">CHZ Gagnés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.missionsCompleted}</div>
          <div className="text-sm text-gray-400">Missions Terminées</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">XP</span>
          <span className="text-white">{stats.xp}/{stats.nextLevelXp}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
            style={{ width: `${levelProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-lg font-bold text-yellow-400">🔥 {stats.currentStreak} jours</div>
        <div className="text-sm text-gray-400">Streak actuel</div>
      </div>
    </div>
  );
}

export default function ChiliRoarEarnPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');

  const filters = [
    { id: 'all', label: 'Toutes', icon: '🎯' },
    { id: 'social', label: 'Social', icon: '📱' },
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'content', label: 'Contenu', icon: '✍️' },
    { id: 'community', label: 'Communauté', icon: '👥' }
  ];

  const difficulties = [
    { id: 'all', label: 'Toutes', color: 'text-gray-400' },
    { id: 'easy', label: 'Facile', color: 'text-green-400' },
    { id: 'medium', label: 'Moyen', color: 'text-yellow-400' },
    { id: 'hard', label: 'Difficile', color: 'text-red-400' }
  ];

  const filteredMissions = missions.filter(mission => {
    const categoryMatch = activeFilter === 'all' || mission.category === activeFilter;
    const difficultyMatch = activeDifficulty === 'all' || mission.difficulty === activeDifficulty;
    return categoryMatch && difficultyMatch;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">💰 ChiliRoar Earn</h1>
          <p className="text-gray-400 mb-6">
            Gagnez des récompenses en réalisant des missions sponsorisées par vos FanTokens préférés
          </p>
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
                            ? 'bg-green-600 text-white'
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulté</label>
                  <div className="flex gap-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty.id}
                        onClick={() => setActiveDifficulty(difficulty.id)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          activeDifficulty === difficulty.id
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {difficulty.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Missions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>

            {filteredMissions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Aucune mission trouvée</h3>
                <p className="text-gray-400">Essayez de modifier vos filtres</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Statistiques utilisateur */}
              <UserStatsCard stats={userStats} />

              {/* Sponsors actifs */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold text-white mb-4">🏆 Sponsors Actifs</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <img src="/PSG.png" alt="PSG" className="w-8 h-8 rounded object-cover" />
                    <div>
                      <div className="text-white font-medium">PSG FanToken</div>
                      <div className="text-green-400 text-sm">3 missions actives</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <img src="/OG.png" alt="OG" className="w-8 h-8 rounded object-cover" />
                    <div>
                      <div className="text-white font-medium">OG Esports</div>
                      <div className="text-green-400 text-sm">2 missions actives</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <img src="/ASR.png" alt="ASR" className="w-8 h-8 rounded object-cover" />
                    <div>
                      <div className="text-white font-medium">AS Roma</div>
                      <div className="text-green-400 text-sm">1 mission active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Récompenses populaires */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-bold text-white mb-4">🔥 Récompenses Populaires</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-500/20">
                    <div>
                      <div className="text-white font-medium">Tournoi Trading</div>
                      <div className="text-green-400 text-sm">200 CHZ + ASR</div>
                    </div>
                    <div className="text-2xl">🥇</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/20">
                    <div>
                      <div className="text-white font-medium">Analyse OG</div>
                      <div className="text-blue-400 text-sm">100 CHZ + OG</div>
                    </div>
                    <div className="text-2xl">📊</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg border border-yellow-500/20">
                    <div>
                      <div className="text-white font-medium">Daily Streak</div>
                      <div className="text-yellow-400 text-sm">25 CHZ</div>
                    </div>
                    <div className="text-2xl">🔥</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 