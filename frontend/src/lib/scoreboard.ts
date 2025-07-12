import { createClient } from './supabase-client';
import { ScoreboardEntry, LeaderboardEntry, ScoreUpdate } from '@/types/scoreboard';

const supabase = createClient();

// Récupérer le leaderboard public
export async function getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return [];
  }
}

// Récupérer les informations du scoreboard pour un utilisateur
export async function getUserScoreboard(userId: string): Promise<ScoreboardEntry | null> {
  try {
    const { data, error } = await supabase
      .from('scoreboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération du scoreboard utilisateur:', error);
    return null;
  }
}

// Mettre à jour le score d'un utilisateur
export async function updateUserScore(userId: string, scoreUpdate: ScoreUpdate): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_user_score', {
      p_user_id: userId,
      p_score_increment: scoreUpdate.score_increment || 0,
      p_fan_tokens_increment: scoreUpdate.fan_tokens_increment || 0,
      p_campaigns_increment: scoreUpdate.campaigns_increment || 0,
      p_trading_volume_increment: scoreUpdate.trading_volume_increment || 0,
      p_social_engagement_increment: scoreUpdate.social_engagement_increment || 0
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du score:', error);
    return false;
  }
}

// Ajouter un badge à un utilisateur
export async function addUserBadge(userId: string, badgeName: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('add_user_badge', {
      p_user_id: userId,
      p_badge_name: badgeName
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du badge:', error);
    return false;
  }
}

// Initialiser le scoreboard pour un nouvel utilisateur (fallback si le trigger échoue)
export async function initializeUserScoreboard(
  userId: string,
  username?: string,
  email?: string,
  twitterHandle?: string,
  walletAddress?: string
): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('initialize_user_scoreboard', {
      p_user_id: userId,
      p_username: username,
      p_email: email,
      p_twitter_handle: twitterHandle,
      p_wallet_address: walletAddress
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du scoreboard:', error);
    return false;
  }
}

// Récupérer le top N des utilisateurs
export async function getTopUsers(limit: number = 10): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération du top des utilisateurs:', error);
    return [];
  }
}

// Récupérer la position d'un utilisateur dans le classement
export async function getUserRank(userId: string): Promise<number | null> {
  try {
    const { data, error } = await supabase
      .from('scoreboard')
      .select('current_rank')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.current_rank || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rang utilisateur:', error);
    return null;
  }
}

// Fonctions utilitaires pour l'attribution automatique de badges
export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  try {
    const userScoreboard = await getUserScoreboard(userId);
    if (!userScoreboard) return [];

    const newBadges: string[] = [];

    // Badge Early Adopter (premier mois)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    if (new Date(userScoreboard.created_at) < oneMonthAgo && !userScoreboard.badges_earned.includes('Early Adopter')) {
      await addUserBadge(userId, 'Early Adopter');
      newBadges.push('Early Adopter');
    }

    // Badge Fan Token Holder (au moins 1 fan token)
    if (userScoreboard.fan_tokens_held >= 1 && !userScoreboard.badges_earned.includes('Fan Token Holder')) {
      await addUserBadge(userId, 'Fan Token Holder');
      newBadges.push('Fan Token Holder');
    }

    // Badge Collector (au moins 10 fan tokens)
    if (userScoreboard.fan_tokens_held >= 10 && !userScoreboard.badges_earned.includes('Collector')) {
      await addUserBadge(userId, 'Collector');
      newBadges.push('Collector');
    }

    // Badge Campaign Master (au moins 5 campagnes complétées)
    if (userScoreboard.campaigns_completed >= 5 && !userScoreboard.badges_earned.includes('Campaign Master')) {
      await addUserBadge(userId, 'Campaign Master');
      newBadges.push('Campaign Master');
    }

    // Badge Active Trader (volume de trading > 1000)
    if (userScoreboard.trading_volume >= 1000 && !userScoreboard.badges_earned.includes('Active Trader')) {
      await addUserBadge(userId, 'Active Trader');
      newBadges.push('Active Trader');
    }

    // Badge Top Trader (volume de trading > 10000)
    if (userScoreboard.trading_volume >= 10000 && !userScoreboard.badges_earned.includes('Top Trader')) {
      await addUserBadge(userId, 'Top Trader');
      newBadges.push('Top Trader');
    }

    // Badge Social Butterfly (score social > 5000)
    if (userScoreboard.social_engagement_score >= 5000 && !userScoreboard.badges_earned.includes('Social Butterfly')) {
      await addUserBadge(userId, 'Social Butterfly');
      newBadges.push('Social Butterfly');
    }

    // Badge Community Leader (top 10 du classement)
    if (userScoreboard.current_rank && userScoreboard.current_rank <= 10 && !userScoreboard.badges_earned.includes('Community Leader')) {
      await addUserBadge(userId, 'Community Leader');
      newBadges.push('Community Leader');
    }

    // Badge Roar Champion (rang #1)
    if (userScoreboard.current_rank === 1 && !userScoreboard.badges_earned.includes('Roar Champion')) {
      await addUserBadge(userId, 'Roar Champion');
      newBadges.push('Roar Champion');
    }

    return newBadges;
  } catch (error) {
    console.error('Erreur lors de la vérification des badges:', error);
    return [];
  }
}

// Fonction pour récompenser les actions utilisateur
export async function rewardUserAction(userId: string, action: string): Promise<boolean> {
  const scoreUpdates: Record<string, ScoreUpdate> = {
    'campaign_completed': {
      score_increment: 100,
      campaigns_increment: 1,
      social_engagement_increment: 50
    },
    'fan_token_purchased': {
      score_increment: 50,
      fan_tokens_increment: 1
    },
    'fan_token_sold': {
      score_increment: 25,
      trading_volume_increment: 1
    },
    'social_share': {
      score_increment: 20,
      social_engagement_increment: 25
    },
    'daily_login': {
      score_increment: 10,
      social_engagement_increment: 5
    }
  };

  const update = scoreUpdates[action];
  if (!update) return false;

  const success = await updateUserScore(userId, update);
  if (success) {
    // Vérifier et attribuer de nouveaux badges
    await checkAndAwardBadges(userId);
  }

  return success;
} 