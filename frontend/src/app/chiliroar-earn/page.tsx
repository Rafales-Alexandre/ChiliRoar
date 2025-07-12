"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useToast } from '../contexts/ToastContext';

// Function to generate avatars with DiceBear
const generateAvatar = (name: string) => {
  const seed = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};

// Types for missions and rewards
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

// Mission data
const missions: Mission[] = [
  {
    id: '1',
    title: 'Share your favorite FanToken',
    description: 'Create a social media post about your favorite FanToken and use the hashtag #ChiliRoar',
    sponsor: 'PSG FanToken',
    sponsorLogo: '/PSG.png',
    reward: { amount: 50, currency: 'CHZ', token: 'PSG' },
    difficulty: 'easy',
    category: 'social',
    requirements: ['Post on Twitter/X', 'Hashtag #ChiliRoar', 'Mention @ChiliRoar'],
    progress: 0,
    maxProgress: 1,
    deadline: '2024-02-15',
    isActive: true,
    tags: ['Social Media', 'PSG', 'FanToken']
  },
  {
    id: '2',
    title: 'OG Token Technical Analysis',
    description: 'Perform a complete technical analysis of the OG token and share your insights',
    sponsor: 'OG Esports',
    sponsorLogo: '/OG.png',
    reward: { amount: 100, currency: 'CHZ', token: 'OG' },
    difficulty: 'medium',
    category: 'content',
    requirements: ['Technical analysis', 'Charts', 'Predictions'],
    progress: 0,
    maxProgress: 1,
    isActive: true,
    tags: ['Trading', 'OG', 'Analysis']
  },
  {
    id: '3',
    title: 'ASR Trading Tournament',
    description: 'Participate in the ASR trading tournament and reach the top 10',
    sponsor: 'AS Roma',
    sponsorLogo: '/ASR.png',
    reward: { amount: 200, currency: 'CHZ', token: 'ASR' },
    difficulty: 'hard',
    category: 'trading',
    requirements: ['Tournament participation', 'Top 10 ranking', 'Minimum volume'],
    progress: 0,
    maxProgress: 1,
    deadline: '2024-02-20',
    isActive: true,
    tags: ['Trading', 'ASR', 'Tournament']
  },
  {
    id: '4',
    title: 'Emerging Content Creator',
    description: 'Create 5 quality posts on ChiliRoar and reach 1000 views',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 75, currency: 'CHZ' },
    difficulty: 'medium',
    category: 'content',
    requirements: ['5 posts created', '1000 total views', 'Original content'],
    progress: 2,
    maxProgress: 5,
    isActive: true,
    tags: ['Content', 'Creator', 'Growth']
  },
  {
    id: '5',
    title: 'Community Ambassador',
    description: 'Help 10 new users join ChiliRoar',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 150, currency: 'CHZ' },
    difficulty: 'hard',
    category: 'community',
    requirements: ['10 referrals', 'Active users', 'Support'],
    progress: 3,
    maxProgress: 10,
    isActive: true,
    tags: ['Community', 'Referral', 'Support']
  },
  {
    id: '6',
    title: 'Daily Check-in',
    description: 'Log in daily for 7 consecutive days',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    reward: { amount: 25, currency: 'CHZ' },
    difficulty: 'easy',
    category: 'social',
    requirements: ['7 consecutive days', 'Daily check-in'],
    progress: 5,
    maxProgress: 7,
    isActive: true,
    tags: ['Daily', 'Streak', 'Engagement']
  }
];

// User statistics
const userStats: UserStats = {
  totalEarned: 1250,
  missionsCompleted: 23,
  currentStreak: 12,
  rank: 'Gold',
  level: 8,
  xp: 1250,
  nextLevelXp: 2000
};

// Component to display a mission
function MissionCard({ mission }: { mission: Mission }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();
  
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
            <p className="text-gray-400 text-sm">Sponsored by {mission.sponsor}</p>
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

      {/* Reward */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-3 mb-4 border border-green-500/20">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-400 font-semibold">Reward</span>
            <div className="text-white font-bold text-lg">{mission.reward.amount} {mission.reward.currency}</div>
            {mission.reward.token && (
              <div className="text-gray-400 text-sm">+ {mission.reward.amount} {mission.reward.token}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl">💰</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm text-white">{mission.progress} / {mission.maxProgress}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <h4 className="font-semibold text-white mb-2">Requirements:</h4>
        <ul className="space-y-1">
          {mission.requirements.map((req, index) => (
            <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
              <span className="text-green-400">✓</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mission.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* Action button */}
      <div className="flex gap-2">
        {mission.progress >= mission.maxProgress ? (
          <button 
            onClick={() => {
              showSuccess(`Récompense réclamée ! Vous avez gagné ${mission.reward.amount} ${mission.reward.currency}`);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Claim Reward
          </button>
        ) : (
          <button 
            onClick={() => {
              showInfo(`Mission "${mission.title}" démarrée !`);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Start Mission
          </button>
        )}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isExpanded ? 'Less' : 'Details'}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          {mission.deadline && (
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Deadline: </span>
              <span className="text-white text-sm">{new Date(mission.deadline).toLocaleDateString('en-US')}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Category: </span>
              <span className="text-white capitalize">{mission.category}</span>
            </div>
            <div>
              <span className="text-gray-400">Difficulty: </span>
              <span className="text-white capitalize">{mission.difficulty}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserStatsCard({ stats }: { stats: UserStats }) {
  const levelProgress = (stats.xp / stats.nextLevelXp) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-6 border border-purple-500/20">
      <h2 className="text-xl font-bold text-white mb-4">🏆 Your Progress</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalEarned}</div>
          <div className="text-sm text-gray-400">Total Earned (CHZ)</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.missionsCompleted}</div>
          <div className="text-sm text-gray-400">Missions Completed</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Level {stats.level}</span>
            <span className="text-white">{stats.xp} / {stats.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Current Streak</span>
          <span className="text-orange-400 font-medium">{stats.currentStreak} days 🔥</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Rank</span>
          <span className="text-yellow-400 font-medium">{stats.rank}</span>
        </div>
      </div>
    </div>
  );
}

interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  reward: string;
  value: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  category: 'content' | 'trading' | 'community' | 'referral';
  status: 'available' | 'completed' | 'in-progress';
  progress?: number;
  maxProgress?: number;
  icon?: string;
}

const earningOpportunities: EarningOpportunity[] = [
  {
    id: '1',
    title: 'Create Your First Roar',
    description: 'Share your thoughts about your favorite FanToken and earn ROAR tokens for quality content.',
    reward: '10 ROAR',
    value: '$5',
    difficulty: 'easy',
    timeRequired: '5 min',
    category: 'content',
    status: 'available',
    icon: '/Roar.png'
  },
  {
    id: '2',
    title: 'Trade PSG FanToken',
    description: 'Complete your first trade of PSG FanToken and earn bonus tokens.',
    reward: '25 PSG',
    value: '$37.5',
    difficulty: 'easy',
    timeRequired: '10 min',
    category: 'trading',
    status: 'available',
    icon: '/PSG.png'
  },
  {
    id: '3',
    title: 'Join OG Community',
    description: 'Become an active member of the OG community and earn OG tokens.',
    reward: '15 OG',
    value: '$75',
    difficulty: 'medium',
    timeRequired: '30 min',
    category: 'community',
    status: 'available',
    icon: '/OG.png'
  },
  {
    id: '4',
    title: 'Refer a Friend',
    description: 'Invite friends to ChiliRoar and earn rewards for each successful referral.',
    reward: '50 ROAR',
    value: '$25',
    difficulty: 'easy',
    timeRequired: '2 min',
    category: 'referral',
    status: 'available',
    icon: '/airdrop.png'
  },
  {
    id: '5',
    title: 'ASR Trading Challenge',
    description: 'Trade ASR FanToken with a minimum volume and earn bonus rewards.',
    reward: '30 ASR',
    value: '$36',
    difficulty: 'hard',
    timeRequired: '1 hour',
    category: 'trading',
    status: 'in-progress',
    progress: 750,
    maxProgress: 1000,
    icon: '/ASR.png'
  },
  {
    id: '6',
    title: 'Weekly Content Creator',
    description: 'Create 5 high-quality Roars this week and earn bonus rewards.',
    reward: '100 ROAR',
    value: '$50',
    difficulty: 'medium',
    timeRequired: '2 hours',
    category: 'content',
    status: 'in-progress',
    progress: 3,
    maxProgress: 5,
    icon: '/Roar.png'
  },
  {
    id: '7',
    title: 'Community Moderator',
    description: 'Help moderate the community and earn monthly rewards.',
    reward: '200 ROAR',
    value: '$100',
    difficulty: 'hard',
    timeRequired: '5 hours/week',
    category: 'community',
    status: 'available',
    icon: '/leaderboard.png'
  },
  {
    id: '8',
    title: 'FanToken Portfolio',
    description: 'Hold at least 3 different FanTokens for 30 days.',
    reward: '75 ROAR',
    value: '$37.5',
    difficulty: 'medium',
    timeRequired: '30 days',
    category: 'trading',
    status: 'completed',
    icon: '/trophy.png'
  }
];

export default function ChiliRoarEarnPage() {
  const { showSuccess, showError, showInfo } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'content' | 'trading' | 'community' | 'referral'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredOpportunities = earningOpportunities.filter(opportunity => {
    const matchesCategory = selectedCategory === 'all' || opportunity.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || opportunity.difficulty === selectedDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-blue-600';
      case 'in-progress': return 'bg-yellow-600';
      case 'completed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  // Calculate statistics
  const totalEarnings = earningOpportunities
    .filter(opp => opp.status === 'completed')
    .reduce((sum, opp) => sum + parseFloat(opp.value.replace('$', '')), 0);

  const availableOpportunities = earningOpportunities.filter(opp => opp.status === 'available').length;
  const inProgressOpportunities = earningOpportunities.filter(opp => opp.status === 'in-progress').length;
  const completedOpportunities = earningOpportunities.filter(opp => opp.status === 'completed').length;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/price.png" alt="Earn" className="w-8 h-8 mr-3" />
            ChiliRoar Earn
          </h1>
          <p className="text-gray-300 mb-6">
            Complete missions, create content, and participate in the community to earn tokens and rewards
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border border-green-500/20">
            <div className="text-2xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-gray-300">Total Earned</div>
          </div>
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-xl p-4 border border-blue-500/20">
            <div className="text-2xl font-bold text-white">{availableOpportunities}</div>
            <div className="text-sm text-gray-300">Available</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-500/20">
            <div className="text-2xl font-bold text-white">{inProgressOpportunities}</div>
            <div className="text-sm text-gray-300">In Progress</div>
          </div>
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 border border-purple-500/20">
            <div className="text-2xl font-bold text-white">{completedOpportunities}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-2">
              <span className="text-gray-300 text-sm font-medium flex items-center">Category:</span>
              {(['all', 'content', 'trading', 'community', 'referral'] as const).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-gray-300 text-sm font-medium flex items-center">Difficulty:</span>
              {(['all', 'easy', 'medium', 'hard'] as const).map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {difficulty === 'all' ? 'All' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map(opportunity => (
            <div key={opportunity.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img 
                    src={opportunity.icon || '/price.png'} 
                    alt={opportunity.title}
                    className="w-12 h-12 rounded-lg mr-3"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{opportunity.title}</h3>
                    <p className="text-sm text-gray-400">{opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(opportunity.difficulty)}`}>
                    {opportunity.difficulty.charAt(0).toUpperCase() + opportunity.difficulty.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(opportunity.status)}`}>
                    {getStatusText(opportunity.status)}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 mb-4 text-sm">{opportunity.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Reward</div>
                  <div className="text-lg font-semibold text-white">{opportunity.reward}</div>
                  <div className="text-sm text-green-400">{opportunity.value}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Time Required</div>
                  <div className="text-lg font-semibold text-white">{opportunity.timeRequired}</div>
                </div>
              </div>

              {opportunity.status === 'in-progress' && opportunity.progress !== undefined && opportunity.maxProgress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{opportunity.progress} / {opportunity.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(opportunity.progress / opportunity.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (opportunity.status === 'available') {
                    showInfo(`Opportunité "${opportunity.title}" démarrée !`);
                  } else if (opportunity.status === 'in-progress') {
                    showInfo(`Continuez votre progression dans "${opportunity.title}"`);
                  }
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  opportunity.status === 'available'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : opportunity.status === 'in-progress'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
                disabled={opportunity.status === 'completed'}
              >
                {opportunity.status === 'available' ? 'Start Mission' :
                 opportunity.status === 'in-progress' ? 'Continue' :
                 'Completed'}
              </button>
            </div>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <img src="/price.png" alt="No opportunities" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No earning opportunities found matching your criteria</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
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