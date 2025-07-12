import { useState, useEffect } from 'react';
import { PromotionalCampaign, CampaignRegistration } from '../types/campaigns';
import { getActiveCampaigns, getUserCampaignRegistrations, isUserRegisteredForCampaign } from '../lib/campaigns';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveCampaigns();
      setCampaigns(data);
    } catch (err) {
      console.error('Erreur lors du chargement des campagnes:', err);
      setError('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    refetch: loadCampaigns
  };
}

export function useUserCampaigns(userId?: string) {
  const [registrations, setRegistrations] = useState<CampaignRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadUserRegistrations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserCampaignRegistrations(userId);
        setRegistrations(data);
      } catch (err) {
        console.error('Erreur lors du chargement des inscriptions:', err);
        setError('Erreur lors du chargement des inscriptions');
      } finally {
        setLoading(false);
      }
    };

    loadUserRegistrations();
  }, [userId]);

  return {
    registrations,
    loading,
    error
  };
}

export function useCampaignRegistration(campaignId: string, userId?: string) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !campaignId) {
      setLoading(false);
      return;
    }

    const checkRegistration = async () => {
      try {
        setLoading(true);
        const registered = await isUserRegisteredForCampaign(campaignId, userId);
        setIsRegistered(registered);
      } catch (err) {
        console.error('Erreur lors de la vérification de l\'inscription:', err);
      } finally {
        setLoading(false);
      }
    };

    checkRegistration();
  }, [campaignId, userId]);

  return {
    isRegistered,
    loading
  };
} 