export interface ScoreboardEntry {
  id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  twitter_handle: string | null;
  wallet_address: string | null;
  
  // Scores et métriques
  total_score: number;
  fan_tokens_held: number;
  campaigns_completed: number;
  trading_volume: number;
  social_engagement_score: number;
  
  // Classements
  current_rank: number | null;
  previous_rank: number | null;
  rank_change: number;
  
  // Récompenses et badges
  badges_earned: string[];
  total_rewards_earned: number;
  
  // Métadonnées
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

export interface LeaderboardEntry {
  current_rank: number;
  username: string;
  total_score: number;
  fan_tokens_held: number;
  campaigns_completed: number;
  badges_earned: string[];
  rank_change: number;
  rank_trend: 'up' | 'down' | 'stable';
}

export interface ScoreUpdate {
  score_increment?: number;
  fan_tokens_increment?: number;
  campaigns_increment?: number;
  trading_volume_increment?: number;
  social_engagement_increment?: number;
}

export interface BadgeInfo {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const AVAILABLE_BADGES: Record<string, BadgeInfo> = {
  'Early Adopter': {
    name: 'Early Adopter',
    description: 'Parmi les premiers utilisateurs de ChiliRoar',
    icon: '🚀',
    rarity: 'rare'
  },
  'Social Butterfly': {
    name: 'Social Butterfly',
    description: 'Très actif sur les réseaux sociaux',
    icon: '🦋',
    rarity: 'common'
  },
  'Top Trader': {
    name: 'Top Trader',
    description: 'Excellent trader de fan tokens',
    icon: '📈',
    rarity: 'epic'
  },
  'Community Leader': {
    name: 'Community Leader',
    description: 'Leader dans la communauté ChiliRoar',
    icon: '👑',
    rarity: 'legendary'
  },
  'Fan Token Holder': {
    name: 'Fan Token Holder',
    description: 'Détient des fan tokens',
    icon: '🎫',
    rarity: 'common'
  },
  'Collector': {
    name: 'Collector',
    description: 'Collectionne de nombreux fan tokens',
    icon: '🏆',
    rarity: 'rare'
  },
  'Active Trader': {
    name: 'Active Trader',
    description: 'Trade régulièrement des fan tokens',
    icon: '💹',
    rarity: 'common'
  },
  'Campaign Master': {
    name: 'Campaign Master',
    description: 'A complété de nombreuses campagnes',
    icon: '🎯',
    rarity: 'epic'
  },
  'Roar Champion': {
    name: 'Roar Champion',
    description: 'Champion ultime de ChiliRoar',
    icon: '🔥',
    rarity: 'legendary'
  }
}; 