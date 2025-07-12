"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { PromotionalCampaign } from '../../types/campaigns';
import { getActiveCampaigns, registerForCampaign, isUserRegisteredForCampaign, createSampleCampaigns } from '../../lib/campaigns';

// Données mock pour le développement
const mockCampaigns: PromotionalCampaign[] = [
  {
    id: '1',
    name: 'PSG Champions League Challenge',
    description: 'Participez au défi PSG Champions League ! Partagez votre prédiction pour le prochain match avec les hashtags requis.',
    hashtags: ['#PSGChampions', '#ChiliRoar', '#FanToken'],
    requirements: [
      'Suivre @ChiliRoar sur Twitter',
      'Publier une prédiction pour le match PSG',
      'Utiliser tous les hashtags requis',
      'Mentionner @PSG_inside'
    ],
    rewards: {
      amount: 100,
      currency: 'CHZ',
      token: 'PSG'
    },
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-02-15T23:59:59Z',
    status: 'active',
    maxParticipants: 1000,
    currentParticipants: 247,
    image: '/PSG.png',
    sponsor: 'Paris Saint-Germain',
    sponsorLogo: '/PSG.png',
    category: 'social',
    difficulty: 'easy'
  },
  {
    id: '2',
    name: 'OG Esports Content Creator',
    description: 'Créez du contenu original sur OG Esports et leurs performances récentes. Les meilleures créations seront récompensées !',
    hashtags: ['#OGEsports', '#ChiliRoar', '#ContentCreator'],
    requirements: [
      'Créer du contenu original (vidéo/article/post)',
      'Publier sur au moins 2 plateformes',
      'Utiliser tous les hashtags requis',
      'Mentionner @OGesports'
    ],
    rewards: {
      amount: 200,
      currency: 'CHZ',
      token: 'OG'
    },
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-02-28T23:59:59Z',
    status: 'active',
    maxParticipants: 500,
    currentParticipants: 89,
    image: '/OG.png',
    sponsor: 'OG Esports',
    sponsorLogo: '/OG.png',
    category: 'content',
    difficulty: 'medium'
  },
  {
    id: '3',
    name: 'AS Roma Trading Tournament',
    description: 'Participez au tournoi de trading ASR ! Montrez vos compétences et gagnez des tokens ASR.',
    hashtags: ['#ASRTrading', '#ChiliRoar', '#TradingTournament'],
    requirements: [
      'Volume de trading minimum de 1000 CHZ',
      'Publier votre stratégie de trading',
      'Utiliser tous les hashtags requis',
      'Être dans le top 50 du tournoi'
    ],
    rewards: {
      amount: 500,
      currency: 'CHZ',
      token: 'ASR'
    },
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-02-20T23:59:59Z',
    status: 'active',
    maxParticipants: 200,
    currentParticipants: 156,
    image: '/ASR.png',
    sponsor: 'AS Roma',
    sponsorLogo: '/ASR.png',
    category: 'trading',
    difficulty: 'hard'
  },
  {
    id: '4',
    name: 'Community Ambassador Program',
    description: 'Devenez ambassadeur ChiliRoar ! Aidez à faire grandir notre communauté et gagnez des récompenses exclusives.',
    hashtags: ['#ChiliRoarAmbassador', '#Community', '#FanTokens'],
    requirements: [
      'Inviter au moins 10 nouveaux utilisateurs',
      'Être actif sur Discord et Twitter',
      'Créer du contenu éducatif',
      'Aider les nouveaux utilisateurs'
    ],
    rewards: {
      amount: 1000,
      currency: 'CHZ'
    },
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-03-31T23:59:59Z',
    status: 'active',
    maxParticipants: 50,
    currentParticipants: 23,
    image: '/LOGO.png',
    sponsor: 'ChiliRoar',
    sponsorLogo: '/LOGO.png',
    category: 'community',
    difficulty: 'hard'
  }
];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<PromotionalCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<PromotionalCampaign | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [twitterHandle, setTwitterHandle] = useState('');
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [userRegistrations, setUserRegistrations] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'trading' | 'content' | 'community'>('all');

  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (user) {
      checkUserRegistrations();
    }
  }, [user, campaigns]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      // Essayer de charger les vraies données depuis la base de données
      try {
        const data = await getActiveCampaigns();
        if (data.length > 0) {
          setCampaigns(data);
        } else {
          // Si aucune donnée en base, créer les campagnes d'exemple
          console.log('Aucune campagne trouvée, création des campagnes d\'exemple...');
          const createResult = await createSampleCampaigns();
          if (createResult.success) {
            // Recharger les campagnes après création
            const newData = await getActiveCampaigns();
            setCampaigns(newData);
          } else {
            // Si la création échoue, utiliser les données mock
            console.warn('Impossible de créer les campagnes d\'exemple, utilisation des données mock');
            setCampaigns(mockCampaigns);
          }
        }
      } catch (dbError) {
        console.warn('Impossible de charger les données de la base, utilisation des données mock:', dbError);
        setCampaigns(mockCampaigns);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des campagnes:', error);
      showError('Erreur lors du chargement des campagnes');
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistrations = async () => {
    if (!user) return;

    const registrations = new Set<string>();
    for (const campaign of campaigns) {
      try {
        // Vérifier les vraies inscriptions depuis la base de données
        const isRegistered = await isUserRegisteredForCampaign(campaign.id, user.id);
        if (isRegistered) {
          registrations.add(campaign.id);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des inscriptions:', error);
      }
    }
    setUserRegistrations(registrations);
  };

  const handleRegister = async () => {
    if (!user || !selectedCampaign) return;

    // Vérifier si l'utilisateur est déjà inscrit (double vérification)
    if (userRegistrations.has(selectedCampaign.id)) {
      showError('Vous êtes déjà inscrit à cette campagne');
      return;
    }

    // Vérifier que l'utilisateur a un email
    if (!user.email) {
      showError('Un email est requis pour s\'inscrire à une campagne. Veuillez mettre à jour votre profil.');
      return;
    }

    setRegistrationLoading(true);
    try {
      // Enregistrer l'inscription en base de données
      const result = await registerForCampaign(
        selectedCampaign.id,
        user.id,
        user.email || '',
        twitterHandle || undefined
      );

      if (result.success) {
        showSuccess(`Inscription réussie à la campagne "${selectedCampaign.name}" ! Vous pouvez maintenant participer en utilisant les hashtags requis.`);
        // Mettre à jour l'état local
        setUserRegistrations(prev => {
          const newSet = new Set(prev);
          newSet.add(selectedCampaign.id);
          return newSet;
        });
        setShowRegistrationModal(false);
        setTwitterHandle('');
        
        // Recharger les campagnes pour mettre à jour le nombre de participants
        await loadCampaigns();
        
        // Afficher une info supplémentaire
        setTimeout(() => {
          showInfo(`N'oubliez pas d'utiliser les hashtags : ${selectedCampaign.hashtags.join(', ')}`);
        }, 2000);
      } else {
        showError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      showError('Erreur lors de l\'inscription');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'hard': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-600 text-white';
      case 'upcoming': return 'bg-blue-600 text-white';
      case 'ended': return 'bg-gray-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => 
    selectedCategory === 'all' || campaign.category === selectedCategory
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
            <img src="/trophy.png" alt="Campagnes" className="w-8 h-8 mr-3" />
            Campagnes Promotionnelles
          </h1>
          <p className="text-gray-300 mb-6">
            Participez aux campagnes promotionnelles et gagnez des tokens en partageant du contenu avec des hashtags spécifiques
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-gray-900 rounded-xl p-4 mb-6">
          <div className="flex gap-2">
            <span className="text-gray-300 text-sm font-medium flex items-center mr-4">Catégorie:</span>
            {(['all', 'social', 'trading', 'content', 'community'] as const).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'Toutes' : 
                 category === 'social' ? 'Social' :
                 category === 'trading' ? 'Trading' :
                 category === 'content' ? 'Contenu' : 'Communauté'}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des campagnes */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-white">Chargement des campagnes...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={campaign.sponsorLogo} 
                      alt={campaign.sponsor} 
                      className="w-12 h-12 rounded-lg object-cover border border-gray-700"
                    />
                    <div>
                      <h3 className="font-bold text-white text-lg">{campaign.name}</h3>
                      <p className="text-gray-400 text-sm">Par {campaign.sponsor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(campaign.difficulty)}`}>
                      {campaign.difficulty.toUpperCase()}
                    </span>
                    <span className="text-2xl">{getCategoryIcon(campaign.category)}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{campaign.description}</p>

                {/* Hashtags */}
                <div className="mb-4">
                  <h4 className="text-white text-sm font-medium mb-2">Hashtags requis :</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.hashtags.map(hashtag => (
                      <span 
                        key={hashtag}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Récompenses */}
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Récompense</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">
                        {campaign.rewards.amount} {campaign.rewards.currency}
                      </span>
                      {campaign.rewards.token && (
                        <span className="text-xs text-gray-400">({campaign.rewards.token})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Participants et dates */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>
                    {campaign.currentParticipants}
                    {campaign.maxParticipants && `/${campaign.maxParticipants}`} participants
                  </span>
                  <span>Fin le {formatDate(campaign.endDate)}</span>
                </div>

                {/* Bouton d'action */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'active' ? 'En cours' :
                     campaign.status === 'upcoming' ? 'À venir' : 'Terminée'}
                  </span>
                  
                  {user ? (
                    userRegistrations.has(campaign.id) ? (
                      <span className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
                        <img src="/trophy.png" alt="Inscrit" className="w-4 h-4" />
                        Inscrit
                      </span>
                    ) : campaign.status === 'active' ? (
                      <button
                        onClick={() => {
                          // Vérification supplémentaire avant d'ouvrir le modal
                          if (userRegistrations.has(campaign.id)) {
                            showError('Vous êtes déjà inscrit à cette campagne');
                            return;
                          }
                          setSelectedCampaign(campaign);
                          setShowRegistrationModal(true);
                        }}
                        disabled={userRegistrations.has(campaign.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          userRegistrations.has(campaign.id)
                            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {userRegistrations.has(campaign.id) ? 'Déjà inscrit' : 'S\'inscrire'}
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm font-medium">
                        {campaign.status === 'upcoming' ? 'Bientôt' : 'Terminée'}
                      </span>
                    )
                  ) : (
                    <span className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg text-sm font-medium">
                      Connexion requise
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCampaigns.length === 0 && !loading && (
          <div className="text-center py-12">
            <img src="/trophy.png" alt="Aucune campagne" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">Aucune campagne disponible</h3>
            <p className="text-gray-400">
              {selectedCategory === 'all' 
                ? 'Aucune campagne active pour le moment. Revenez bientôt !'
                : `Aucune campagne active dans la catégorie "${selectedCategory}".`}
            </p>
          </div>
        )}

        {/* Modal d'inscription */}
        {showRegistrationModal && selectedCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Inscription à la campagne</h3>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-white mb-2">{selectedCampaign.name}</h4>
                <p className="text-gray-300 text-sm mb-4">{selectedCampaign.description}</p>
                
                <div className="bg-gray-800 rounded-lg p-3 mb-4">
                  <h5 className="text-white text-sm font-medium mb-2">Hashtags à utiliser :</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.hashtags.map(hashtag => (
                      <span 
                        key={hashtag}
                        className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full border border-blue-600/30"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-3">
                  <h5 className="text-white text-sm font-medium mb-2">Exigences :</h5>
                  <ul className="text-gray-300 text-xs space-y-1">
                    {selectedCampaign.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">
                  Pseudo Twitter (optionnel)
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  placeholder="@votre_pseudo"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Votre pseudo Twitter nous aidera à vérifier vos publications
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRegister}
                  disabled={registrationLoading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {registrationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Inscription...
                    </>
                  ) : (
                    'S\'inscrire'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 