// Fonctions pour gérer les campagnes promotionnelles
import { createClient } from './supabase-client';
import { PromotionalCampaign, CampaignRegistration } from '../types/campaigns';

const supabase = createClient();

// Récupérer toutes les campagnes actives
export async function getActiveCampaigns(): Promise<PromotionalCampaign[]> {
  const { data, error } = await supabase
    .from('promotional_campaigns')
    .select('*')
    .eq('status', 'active')
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des campagnes:', error);
    return [];
  }

  // Transformer les données de la base au format attendu par l'interface
  const campaigns = (data || []).map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    hashtags: campaign.hashtags,
    requirements: campaign.requirements,
    rewards: {
      amount: campaign.reward_amount,
      currency: campaign.reward_currency,
      token: campaign.reward_token
    },
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    status: campaign.status,
    maxParticipants: campaign.max_participants,
    currentParticipants: campaign.current_participants || 0,
    image: campaign.image_url,
    sponsor: campaign.sponsor,
    sponsorLogo: campaign.sponsor_logo,
    category: campaign.category,
    difficulty: campaign.difficulty
  }));

  return campaigns;
}

// S'inscrire à une campagne
export async function registerForCampaign(
  campaignId: string,
  userId: string,
  email: string,
  twitterHandle?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier si l'utilisateur est déjà inscrit
    const { data: existingRegistration } = await supabase
      .from('campaign_registrations')
      .select('id')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();

    if (existingRegistration) {
      return { success: false, error: 'Vous êtes déjà inscrit à cette campagne' };
    }

    // Créer une nouvelle inscription
    const { error } = await supabase
      .from('campaign_registrations')
      .insert([
        {
          campaign_id: campaignId,
          user_id: userId,
          email: email,
          twitter_handle: twitterHandle,
          registration_date: new Date().toISOString(),
          status: 'registered'
        }
      ]);

    if (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { success: false, error: 'Erreur lors de l\'inscription' };
    }

    // Mettre à jour le nombre de participants
    await updateCampaignParticipantCount(campaignId);

    return { success: true };
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    return { success: false, error: 'Erreur lors de l\'inscription' };
  }
}

// Vérifier si un utilisateur est inscrit à une campagne
export async function isUserRegisteredForCampaign(
  campaignId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('campaign_registrations')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
    .single();

  return !!data;
}

// Mettre à jour le nombre de participants
async function updateCampaignParticipantCount(campaignId: string) {
  const { count } = await supabase
    .from('campaign_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  await supabase
    .from('promotional_campaigns')
    .update({ current_participants: count || 0 })
    .eq('id', campaignId);
}

// Récupérer les inscriptions d'un utilisateur
export async function getUserCampaignRegistrations(
  userId: string
): Promise<CampaignRegistration[]> {
  const { data, error } = await supabase
    .from('campaign_registrations')
    .select(`
      *,
      promotional_campaigns (
        name,
        description,
        hashtags,
        end_date,
        status
      )
    `)
    .eq('user_id', userId)
    .order('registration_date', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return [];
  }

  return data || [];
}

// Fonction pour créer les campagnes d'exemple en base de données
export async function createSampleCampaigns(): Promise<{ success: boolean; error?: string }> {
  try {
    const sampleCampaigns = [
      {
        name: 'PSG Champions League Challenge',
        description: 'Participez au défi PSG Champions League ! Partagez votre prédiction pour le prochain match avec les hashtags requis.',
        hashtags: ['#PSGChampions', '#ChiliRoar', '#FanToken'],
        requirements: ['Suivre @ChiliRoar sur Twitter', 'Publier une prédiction pour le match PSG', 'Utiliser tous les hashtags requis', 'Mentionner @PSG_inside'],
        reward_amount: 100,
        reward_currency: 'CHZ',
        reward_token: 'PSG',
        start_date: '2024-01-15T00:00:00Z',
        end_date: '2024-02-15T23:59:59Z',
        status: 'active',
        max_participants: 1000,
        current_participants: 0,
        image_url: '/PSG.png',
        sponsor: 'Paris Saint-Germain',
        sponsor_logo: '/PSG.png',
        category: 'social',
        difficulty: 'easy'
      },
      {
        name: 'OG Esports Content Creator',
        description: 'Créez du contenu original sur OG Esports et leurs performances récentes. Les meilleures créations seront récompensées !',
        hashtags: ['#OGEsports', '#ChiliRoar', '#ContentCreator'],
        requirements: ['Créer du contenu original (vidéo/article/post)', 'Publier sur au moins 2 plateformes', 'Utiliser tous les hashtags requis', 'Mentionner @OGesports'],
        reward_amount: 200,
        reward_currency: 'CHZ',
        reward_token: 'OG',
        start_date: '2024-01-10T00:00:00Z',
        end_date: '2024-02-28T23:59:59Z',
        status: 'active',
        max_participants: 500,
        current_participants: 0,
        image_url: '/OG.png',
        sponsor: 'OG Esports',
        sponsor_logo: '/OG.png',
        category: 'content',
        difficulty: 'medium'
      },
      {
        name: 'AS Roma Trading Tournament',
        description: 'Participez au tournoi de trading ASR ! Montrez vos compétences et gagnez des tokens ASR.',
        hashtags: ['#ASRTrading', '#ChiliRoar', '#TradingTournament'],
        requirements: ['Volume de trading minimum de 1000 CHZ', 'Publier votre stratégie de trading', 'Utiliser tous les hashtags requis', 'Être dans le top 50 du tournoi'],
        reward_amount: 500,
        reward_currency: 'CHZ',
        reward_token: 'ASR',
        start_date: '2024-01-20T00:00:00Z',
        end_date: '2024-02-20T23:59:59Z',
        status: 'active',
        max_participants: 200,
        current_participants: 0,
        image_url: '/ASR.png',
        sponsor: 'AS Roma',
        sponsor_logo: '/ASR.png',
        category: 'trading',
        difficulty: 'hard'
      },
      {
        name: 'Community Ambassador Program',
        description: 'Devenez ambassadeur ChiliRoar ! Aidez à faire grandir notre communauté et gagnez des récompenses exclusives.',
        hashtags: ['#ChiliRoarAmbassador', '#Community', '#FanTokens'],
        requirements: ['Inviter au moins 10 nouveaux utilisateurs', 'Être actif sur Discord et Twitter', 'Créer du contenu éducatif', 'Aider les nouveaux utilisateurs'],
        reward_amount: 1000,
        reward_currency: 'CHZ',
        reward_token: null,
        start_date: '2024-01-01T00:00:00Z',
        end_date: '2024-03-31T23:59:59Z',
        status: 'active',
        max_participants: 50,
        current_participants: 0,
        image_url: '/LOGO.png',
        sponsor: 'ChiliRoar',
        sponsor_logo: '/LOGO.png',
        category: 'community',
        difficulty: 'hard'
      }
    ];

    const { error } = await supabase
      .from('promotional_campaigns')
      .insert(sampleCampaigns);

    if (error) {
      console.error('Erreur lors de la création des campagnes d\'exemple:', error);
      return { success: false, error: 'Erreur lors de la création des campagnes d\'exemple' };
    }

    return { success: true };
  } catch (err) {
    console.error('Erreur lors de la création des campagnes d\'exemple:', err);
    return { success: false, error: 'Erreur lors de la création des campagnes d\'exemple' };
  }
} 