"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase-client';

export default function CompleteSignup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  
  const action = searchParams.get('action');
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard';
  
  const supabase = createClient();

  useEffect(() => {
    if (action === 'complete_twitter_signup' && code) {
      completeTwitterSignup();
    }
  }, [action, code]);

  const completeTwitterSignup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Finalisation de l\'inscription Twitter...');
      
      // Essayer de récupérer les informations utilisateur depuis Twitter
      // En utilisant une approche alternative
      const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code!);
      
      if (authError) {
        console.log('Erreur lors de l\'échange, tentative alternative...');
        
        // Essayer de créer un utilisateur manuellement avec les données Twitter
        const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
          provider: 'twitter',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            skipBrowserRedirect: true
          }
        });
        
        if (signInError) {
          throw new Error(`Erreur lors de la connexion: ${signInError.message}`);
        }
        
        console.log('Données de connexion Twitter:', signInData);
      } else {
        console.log('Authentification réussie:', authData);
        
        // Rediriger vers le dashboard
        router.push(next);
        return;
      }
      
    } catch (err: any) {
      console.error('Erreur lors de la finalisation:', err);
      setError(err.message || 'Erreur lors de la finalisation de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualContinue = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Créer un utilisateur temporaire avec les données disponibles
      const tempUser = {
        id: `twitter_${Date.now()}`,
        email: null,
        name: 'Utilisateur Twitter',
        provider: 'twitter'
      };

      console.log('Création d\'utilisateur temporaire:', tempUser);
      
      // Rediriger vers le dashboard avec un paramètre spécial
      router.push(`${next}?temp_user=true`);
      
    } catch (err: any) {
      console.error('Erreur lors de la création d\'utilisateur temporaire:', err);
      setError(err.message || 'Erreur lors de la création d\'utilisateur');
    } finally {
      setIsLoading(false);
    }
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
            <img src="/twitter.png" alt="Twitter" className="w-5 h-5 inline mr-2" />Finalisation Twitter
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Finalisation de votre inscription...</p>
            </div>
          ) : (
            <>
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Presque terminé !</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Nous finalisons votre inscription avec Twitter. Cela peut prendre quelques secondes.
                </p>
                
                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded p-3 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={completeTwitterSignup}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Réessayer la connexion
                </button>
                
                <button
                  onClick={handleManualContinue}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Continuer sans email
                </button>
                
                <button
                  onClick={() => router.push('/')}
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
            Cette étape est nécessaire car Twitter n'a pas fourni d'email.
          </p>
        </div>
      </div>
    </div>
  );
} 