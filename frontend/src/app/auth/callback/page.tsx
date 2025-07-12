"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabase-client';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const next = searchParams.get('next') || '/dashboard';
  
  const supabase = createClient();

  const createUserProfile = async (authUser: any) => {
    try {
      console.log('🔄 Création du profil utilisateur...');
      
      // Préparer les données du profil
      const userName = authUser.user_metadata?.full_name || 
                      authUser.user_metadata?.name || 
                      authUser.user_metadata?.user_name || 
                      `Utilisateur ${authUser.id.slice(0, 8)}`;
      
      const profileData = {
        id: authUser.id,
        email: authUser.email || null,
        name: userName,
        avatar_url: authUser.user_metadata?.avatar_url,
        provider: authUser.app_metadata?.provider,
        wallet_address: null,
      };

      console.log('Données du profil à créer:', profileData);

      // Vérifier si le profil existe déjà
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        // Mettre à jour le profil existant
        console.log('📝 Mise à jour du profil existant...');
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            email: profileData.email,
            name: profileData.name,
            avatar_url: profileData.avatar_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', authUser.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        console.log('✅ Profil mis à jour:', updatedProfile);
      } else {
        // Créer un nouveau profil
        console.log('🆕 Création d\'un nouveau profil...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        console.log('✅ Profil créé:', newProfile);
      }

    } catch (error) {
      console.error('❌ Erreur lors de la création/mise à jour du profil:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (errorParam) {
      // Erreur explicite de Twitter
      setStatus('error');
      setError(errorParam);
      setTimeout(() => {
        router.push('/auth/auth-code-error?error=' + errorParam);
      }, 2000);
      return;
    }

    if (code) {
      handleCallback();
    } else {
      setStatus('error');
      setError('Code d\'authentification manquant');
      setTimeout(() => {
        router.push('/auth/auth-code-error?error=missing_code');
      }, 2000);
    }
  }, [code, errorParam]);

  const handleCallback = async () => {
    try {
      console.log('🔄 Traitement du callback Twitter...');
      setStatus('loading');
      
      // Essayer l'échange de code avec Supabase
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code!);
      
      console.log('Résultat échange:', { 
        hasData: !!data, 
        hasSession: !!data?.session,
        error: exchangeError?.message 
      });
      
      if (!exchangeError && data?.session) {
        // Succès - créer le profil utilisateur
        console.log('✅ Authentification réussie');
        console.log('Données utilisateur:', data.user);
        
        try {
          // Créer ou mettre à jour le profil utilisateur
          await createUserProfile(data.user);
          
          // Déclencher un événement pour notifier l'AuthContext
          window.dispatchEvent(new CustomEvent('userProfileCreated', {
            detail: { userId: data.user.id }
          }));
          
          setStatus('success');
          
          // Attendre un peu plus pour laisser le temps à l'AuthContext de se mettre à jour
          setTimeout(() => {
            console.log('🔄 Redirection vers:', next);
            router.push(next);
          }, 2000);
          return;
        } catch (profileError) {
          console.error('❌ Erreur création profil:', profileError);
          // Continuer quand même vers le dashboard
          setStatus('success');
          setTimeout(() => {
            console.log('🔄 Redirection vers:', next, '(avec erreur profil)');
            router.push(next);
          }, 2000);
          return;
        }
      }
      
      // Erreur détectée
      if (exchangeError) {
        console.log('❌ Erreur détectée:', exchangeError.message);
        
        // Vérifier si c'est l'erreur d'email Twitter
        if (exchangeError.message?.includes('email') || 
            exchangeError.message?.includes('external provider')) {
          
          console.log('🔧 Redirection vers création manuelle...');
          
          // Rediriger vers la création manuelle
          const params = new URLSearchParams({
            action: 'manual_twitter_signup',
            code: code!,
            next: next,
            error: 'email_missing'
          });
          
          router.push(`/auth/manual-signup?${params.toString()}`);
          return;
        }
        
        // Autre erreur
        setStatus('error');
        setError(exchangeError.message);
        setTimeout(() => {
          router.push('/auth/auth-code-error?error=' + encodeURIComponent(exchangeError.message));
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('❌ Erreur lors du callback:', err);
      setStatus('error');
      setError(err.message || 'Erreur inconnue');
      setTimeout(() => {
        router.push('/auth/auth-code-error?error=' + encodeURIComponent(err.message || 'unknown'));
      }, 2000);
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
                          <img src="/twitter.png" alt="Twitter" className="w-5 h-5 inline mr-2" />Connexion Twitter
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-300">Traitement de votre connexion...</p>
              <p className="text-gray-500 text-sm mt-2">
                Vérification avec Twitter et Supabase
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-400 text-4xl mb-4">✅</div>
              <p className="text-gray-300">Connexion réussie !</p>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Redirection vers le dashboard...
              </p>
              <button
                onClick={() => router.push(next)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Continuer manuellement
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-400 text-4xl mb-4">❌</div>
              <p className="text-gray-300">Erreur de connexion</p>
              {error && (
                <p className="text-gray-500 text-sm mt-2">
                  {error}
                </p>
              )}
              <p className="text-gray-500 text-sm mt-2">
                Redirection vers la page d'erreur...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 