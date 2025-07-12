"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase-client';

export default function TwitterAuthDiagnostic() {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Afficher le diagnostic seulement en développement
    if (process.env.NODE_ENV === 'development') {
      checkDiagnostic();
    }
  }, []);

  const checkDiagnostic = async () => {
    try {
      // Vérifier la configuration Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Vérifier les variables d'environnement
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configuré' : '❌ Manquant',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Manquant',
      };

      // Vérifier l'URL actuelle
      const currentUrl = window.location.href;
      const callbackUrl = `${window.location.origin}/auth/callback`;
      
      setDiagnosticInfo({
        session,
        sessionError,
        envVars,
        currentUrl,
        callbackUrl,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur diagnostic:', error);
      setDiagnosticInfo({ error: error.message });
    }
  };

  const testTwitterAuth = async () => {
    try {
      console.log('🔍 Test de l\'authentification Twitter...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'tweet.read users.read offline.access',
        }
      });

      console.log('📊 Résultat du test:', { data, error });
      
      if (error) {
        alert(`❌ Erreur: ${error.message}`);
      } else {
        alert('✅ Test réussi - Redirection vers Twitter');
      }
    } catch (err: any) {
      console.error('❌ Erreur test:', err);
      alert(`❌ Erreur test: ${err.message}`);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        🔍 Diagnostic Twitter
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-gray-900 border border-gray-700 rounded-lg p-4 w-96 max-h-96 overflow-y-auto shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-bold">Diagnostic Twitter OAuth</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <button
                onClick={testTwitterAuth}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mb-3"
              >
                🧪 Tester l'auth Twitter
              </button>
            </div>

            <div>
              <h4 className="text-green-400 font-semibold">Variables d'environnement:</h4>
              {diagnosticInfo?.envVars && Object.entries(diagnosticInfo.envVars).map(([key, value]) => (
                <div key={key} className="text-gray-300">
                  <span className="font-mono text-xs">{key}:</span> {value}
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-blue-400 font-semibold">URLs:</h4>
              <div className="text-gray-300">
                <div><strong>Actuelle:</strong> {diagnosticInfo?.currentUrl}</div>
                <div><strong>Callback:</strong> {diagnosticInfo?.callbackUrl}</div>
              </div>
            </div>

            <div>
              <h4 className="text-yellow-400 font-semibold">Session:</h4>
              <div className="text-gray-300">
                {diagnosticInfo?.session ? (
                  <div>
                    <div>✅ Session active</div>
                    <div>User ID: {diagnosticInfo.session.user?.id}</div>
                    <div>Provider: {diagnosticInfo.session.user?.app_metadata?.provider}</div>
                  </div>
                ) : (
                  <div>❌ Pas de session</div>
                )}
              </div>
            </div>

            {diagnosticInfo?.sessionError && (
              <div>
                <h4 className="text-red-400 font-semibold">Erreur session:</h4>
                <div className="text-red-300 text-xs">
                  {diagnosticInfo.sessionError.message}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-purple-400 font-semibold">Checklist Twitter:</h4>
              <div className="text-gray-300 text-xs space-y-1">
                <div>□ App Twitter créée sur developer.twitter.com</div>
                <div>□ OAuth 2.0 activé dans l'app Twitter</div>
                <div>□ Callback URL configuré dans Twitter</div>
                <div>□ Provider Twitter activé dans Supabase</div>
                <div>□ Client ID/Secret configurés dans Supabase</div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Mis à jour: {diagnosticInfo?.timestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 