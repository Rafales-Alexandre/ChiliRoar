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
        // Succès
        console.log('✅ Authentification réussie');
        setStatus('success');
        setTimeout(() => {
          router.push(next);
        }, 1000);
        return;
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
            🐦 Connexion Twitter
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
              <p className="text-gray-500 text-sm mt-2">
                Redirection vers le dashboard...
              </p>
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