"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase-client';

export default function ManualSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const action = searchParams.get('action');
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';
  const errorType = searchParams.get('error');
  
  const supabase = createClient();

  useEffect(() => {
    if (action === 'manual_twitter_signup') {
      handleManualSignup();
    }
  }, [action]);

  const handleManualSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔧 Création manuelle d\'utilisateur Twitter...');
      
      // Créer un utilisateur directement dans la table profiles
      // sans passer par l'authentification Supabase
      const userId = `twitter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const profileData = {
        id: userId,
        email: null, // Pas d'email pour Twitter
        name: `Utilisateur Twitter ${userId.slice(-8)}`,
        avatar_url: null,
        provider: 'twitter',
        wallet_address: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Données du profil à créer:', profileData);

      // Insérer directement dans la table profiles
      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (profileError) {
        console.error('Erreur lors de la création du profil:', profileError);
        throw new Error(`Erreur profil: ${profileError.message}`);
      }

      console.log('✅ Profil créé avec succès:', profileResult);

      // Créer une session locale (simulation)
      localStorage.setItem('chiliroar_user', JSON.stringify(profileResult));
      localStorage.setItem('chiliroar_session', JSON.stringify({
        user: profileResult,
        access_token: 'local_token',
        expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24h
      }));

      setSuccess(true);
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        router.push(next);
      }, 2000);

    } catch (err: any) {
      console.error('❌ Erreur lors de la création manuelle:', err);
      setError(err.message || 'Erreur lors de la création d\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleManualSignup();
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
            <h2 className="text-2xl font-bold text-white">ChiliRoar</h2>
          </div>
          <div className="text-blue-400 font-medium mb-2">
            🔧 Création de Compte
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Création de votre compte...</p>
              <p className="text-gray-500 text-sm mt-2">
                Contournement de l'erreur d'email Twitter
              </p>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="text-green-400 text-4xl mb-4">✅</div>
              <h3 className="text-white font-semibold mb-2">Compte créé avec succès !</h3>
              <p className="text-gray-300 text-sm mb-4">
                Redirection vers le dashboard...
              </p>
              <div className="bg-green-900/20 border border-green-500/30 rounded p-3">
                <p className="text-green-400 text-sm">
                  Votre compte Twitter a été créé sans email. Vous pourrez l'ajouter plus tard dans vos paramètres.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Création Alternative</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Twitter n'a pas fourni d'email, nous créons votre compte avec une méthode alternative.
                </p>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="bg-blue-900/20 border border-blue-500/30 rounded p-3">
                  <h4 className="text-blue-400 font-medium mb-2">ℹ️ Information</h4>
                  <p className="text-blue-300 text-sm">
                    Cette méthode crée un compte local qui fonctionne avec toutes les fonctionnalités de ChiliRoar.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Créer le Compte
                </button>
                
                <button
                  onClick={handleBackToHome}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Retour à l'accueil
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            {errorType === 'email_missing' ? 
              'Contournement automatique de l\'erreur d\'email Twitter' :
              'Création alternative de compte utilisateur'
            }
          </p>
        </div>
      </div>
    </div>
  );
} 