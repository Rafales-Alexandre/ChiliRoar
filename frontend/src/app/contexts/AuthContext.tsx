"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../../lib/supabase-client';
import { User, AuthContextType, AuthState } from '../../types/auth';
import { useWallet } from './WalletContext';
import { initializeUserScoreboard, rewardUserAction } from '../../lib/scoreboard';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<boolean>(false);
  
  const { account, isConnected } = useWallet();
  
  let supabase;
  try {
    supabase = createClient();
  } catch (err) {
    setConfigError(true);
    setIsLoading(false);
    return (
      <AuthContext.Provider value={{
        user: null,
        isLoading: false,
        error: 'Configuration manquante',
        signInWithTwitter: async () => {},
        signInWithWallet: async () => {},
        signOut: async () => {},
        refreshUser: async () => {},
        forceRefreshSession: async () => {},
      }}>
              {children}
    </AuthContext.Provider>
  );
}

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Vérifier d'abord la session locale (pour les utilisateurs Twitter manuels)
        const localUser = localStorage.getItem('chiliroar_user');
        const localSession = localStorage.getItem('chiliroar_session');
        
        if (localUser && localSession) {
          const userData = JSON.parse(localUser);
          const sessionData = JSON.parse(localSession);
          
          // Vérifier si la session locale n'est pas expirée
          if (sessionData.expires_at > Date.now()) {
            console.log('Session locale trouvée:', userData.id);
            setUser(userData);
            setIsLoading(false);
            return;
          } else {
            // Session expirée, nettoyer
            localStorage.removeItem('chiliroar_user');
            localStorage.removeItem('chiliroar_session');
          }
        }
        
        // Vérifier la session Supabase normale
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erreur lors de la vérification de session:', error);
          setError(error.message);
        } else if (session?.user) {
          console.log('Session Supabase trouvée:', session.user.id);
          // Récupérer les données utilisateur complètes
          await fetchUserProfile(session.user.id);
        } else {
          console.log('Aucune session Supabase trouvée');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de session:', err);
        setError('Erreur lors de la vérification de session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        console.log('Session details:', session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Utilisateur connecté:', session.user);
          console.log('Métadonnées utilisateur:', session.user.user_metadata);
          console.log('App metadata:', session.user.app_metadata);
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('Utilisateur déconnecté');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token rafraîchi');
        } else if (event === 'USER_UPDATED') {
          console.log('Utilisateur mis à jour');
        }
      }
    );

    // Écouter l'événement de création de profil
    const handleProfileCreated = (event: CustomEvent) => {
      console.log('📢 Événement profil créé reçu:', event.detail.userId);
      // Forcer la vérification de session
      setTimeout(() => {
        forceRefreshSession();
      }, 500);
    };

    window.addEventListener('userProfileCreated', handleProfileCreated as EventListener);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('userProfileCreated', handleProfileCreated as EventListener);
    };
  }, []);

  // Synchroniser avec le wallet connecté
  useEffect(() => {
    if (isConnected && account && user && !user.wallet_address) {
      // Mettre à jour l'adresse du wallet si l'utilisateur est connecté
      updateWalletAddress(account);
    }
  }, [isConnected, account, user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du profil:', error);
        
        // Si la table n'existe pas, créer un profil par défaut
        if (error.code === 'PGRST106' || error.message.includes('does not exist')) {
          console.log('Table profiles non trouvée, création d\'un profil par défaut');
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser.user) {
            await createUserProfile(authUser.user);
          }
          return;
        }
        
        setError(error.message);
        return;
      }

      if (data) {
        setUser(data);
      } else {
        // Créer un profil par défaut
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          await createUserProfile(authUser.user);
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du profil:', err);
      setError('Erreur lors de la récupération du profil');
    }
  };

  const createUserProfile = async (authUser: any) => {
    try {
      // Gérer les utilisateurs Twitter sans email
      const userName = authUser.user_metadata?.full_name || 
                      authUser.user_metadata?.name || 
                      authUser.user_metadata?.user_name || 
                      `Utilisateur ${authUser.id.slice(0, 8)}`;
      
      const profileData = {
        id: authUser.id,
        email: authUser.email || null, // Permettre null pour Twitter
        name: userName,
        avatar_url: authUser.user_metadata?.avatar_url,
        provider: authUser.app_metadata?.provider,
        wallet_address: account || null,
      };

      console.log('Création du profil utilisateur:', profileData);

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du profil:', error);
        setError(error.message);
        return;
      }

      setUser(data);

      // Initialiser le scoreboard pour le nouvel utilisateur (fallback si le trigger DB échoue)
      try {
        await initializeUserScoreboard(
          authUser.id,
          authUser.user_metadata?.full_name || authUser.user_metadata?.name,
          authUser.email,
          authUser.user_metadata?.user_name, // Twitter handle
          account || undefined
        );

        // Récompenser l'inscription
        await rewardUserAction(authUser.id, 'daily_login');
        
        console.log('Scoreboard initialisé pour le nouvel utilisateur');
      } catch (scoreboardError) {
        console.error('Erreur lors de l\'initialisation du scoreboard:', scoreboardError);
        // Ne pas bloquer la création du profil si le scoreboard échoue
      }
    } catch (err) {
      console.error('Erreur lors de la création du profil:', err);
      setError('Erreur lors de la création du profil');
    }
  };

  const updateWalletAddress = async (address: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', user.id);

      if (error) {
        console.error('Erreur lors de la mise à jour de l\'adresse wallet:', error);
        setError(error.message);
        return;
      }

      setUser(prev => prev ? { ...prev, wallet_address: address } : null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'adresse wallet:', err);
      setError('Erreur lors de la mise à jour de l\'adresse wallet');
    }
  };



  const signInWithTwitter = async () => {
    try {
      setError(null);
      console.log('Tentative de connexion Twitter...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'users.read tweet.read', // Scopes minimaux pour test
          skipBrowserRedirect: false, // Laisser Supabase gérer la redirection
        }
      });
      
      console.log('Réponse Twitter OAuth:', { data, error });
      
      if (error) {
        console.error('Erreur Twitter OAuth:', error);
        setError(`Erreur Twitter: ${error.message}`);
      } else if (data?.url) {
        console.log('Redirection vers Twitter:', data.url);
        // La redirection se fait automatiquement
      }
    } catch (err: any) {
      console.error('Erreur lors de la connexion avec Twitter:', err);
      setError(err.message || 'Erreur lors de la connexion avec Twitter');
    }
  };

  const signInWithWallet = async (address: string) => {
    try {
      setError(null);
      
      // Vérifier si un utilisateur avec cette adresse existe déjà
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError(fetchError.message);
        return;
      }

      if (existingUser) {
        // Utilisateur existant, se connecter
        setUser(existingUser);
      } else {
        // Créer un nouvel utilisateur avec l'adresse wallet
        const { data, error } = await supabase
          .from('profiles')
          .insert([
            {
              email: null,
              name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
              wallet_address: address.toLowerCase(),
              provider: 'wallet',
            }
          ])
          .select()
          .single();

        if (error) {
          setError(error.message);
          return;
        }

        setUser(data);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion avec le wallet');
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      
      // Nettoyer les sessions locales
      localStorage.removeItem('chiliroar_user');
      localStorage.removeItem('chiliroar_session');
      
      // Déconnexion Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
      } else {
        setUser(null);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la déconnexion');
    }
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const forceRefreshSession = async () => {
    console.log('🔄 Rafraîchissement forcé de la session...');
    setIsLoading(true);
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors du rafraîchissement:', error);
        setError(error.message);
      } else if (session?.user) {
        console.log('Session rafraîchie:', session.user.id);
        await fetchUserProfile(session.user.id);
      } else {
        console.log('Aucune session trouvée lors du rafraîchissement');
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement forcé:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    signInWithTwitter,
    signInWithWallet,
    signOut,
    refreshUser,
    forceRefreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 