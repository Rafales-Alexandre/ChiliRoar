// Types pour les campagnes promotionnelles
export interface PromotionalCampaign {
  id: string;
  name: string;
  description: string;
  hashtags: string[];
  requirements: string[];
  rewards: {
    amount: number;
    currency: string;
    token?: string;
  };
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'ended';
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  sponsor: string;
  sponsorLogo: string;
  category: 'social' | 'trading' | 'content' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CampaignRegistration {
  id: string;
  campaign_id: string;
  user_id: string;
  twitter_handle?: string;
  email: string;
  registration_date: string;
  status: 'registered' | 'completed' | 'disqualified';
  submission_url?: string;
  completion_date?: string;
}

export interface CampaignSubmission {
  id: string;
  campaign_id: string;
  user_id: string;
  submission_url: string;
  submission_type: 'tweet' | 'post' | 'video' | 'article';
  hashtags_used: string[];
  submission_date: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  reward_distributed: boolean;
} 