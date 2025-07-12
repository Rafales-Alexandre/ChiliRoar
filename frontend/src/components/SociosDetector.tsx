"use client";
import React, { useEffect, useState } from 'react';
import { useWallet } from '../app/contexts/WalletContext';
import { useAuth } from '../app/contexts/AuthContext';
import { useToast } from '../app/contexts/ToastContext';

export default function SociosDetector() {
  const [isSociosApp, setIsSociosApp] = useState(false);
  const [showSociosPrompt, setShowSociosPrompt] = useState(false);
  const { connectSocios, isConnected, walletType } = useWallet();
  const { user } = useAuth();
  const { showInfo } = useToast();

  useEffect(() => {
    // Détecter si on est dans l'app Socios
    const detectSociosApp = () => {
      if (typeof window === 'undefined') return false;
      
      const userAgent = navigator.userAgent.toLowerCase();
      const isSociosUA = userAgent.includes('socios') || userAgent.includes('chiliz');
      const hasSociosProvider = !!(window as any).socios || !!(window as any).chiliz;
      
      return isSociosUA || hasSociosProvider;
    };

    const sociosDetected = detectSociosApp();
    setIsSociosApp(sociosDetected);

    // Si Socios est détecté et l'utilisateur n'est pas connecté, proposer la connexion
    if (sociosDetected && !user && !isConnected) {
      setTimeout(() => {
        setShowSociosPrompt(true);
      }, 1000);
    }
  }, [user, isConnected]);

  const handleAutoConnect = async () => {
    try {
      await connectSocios();
      setShowSociosPrompt(false);
      showInfo('Connexion automatique Socios activée !');
    } catch (error) {
      console.error('Erreur connexion automatique Socios:', error);
    }
  };

  const handleDismiss = () => {
    setShowSociosPrompt(false);
    localStorage.setItem('socios_auto_connect_dismissed', 'true');
  };

  // Ne pas afficher si déjà connecté ou si l'utilisateur a déjà refusé
  if (!showSociosPrompt || user || isConnected) {
    return null;
  }

  // Vérifier si l'utilisateur a déjà refusé la connexion automatique
  if (localStorage.getItem('socios_auto_connect_dismissed') === 'true') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg shadow-lg border border-red-400">
        <div className="flex items-start gap-3">
          <img src="/socios.png" alt="Socios" className="w-8 h-8 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">
              App Socios détectée ! 🎉
            </h3>
            <p className="text-xs text-red-100 mb-3">
              Connectez-vous automatiquement avec votre wallet Socios pour accéder à vos fan tokens.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAutoConnect}
                className="bg-white text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-50 transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={handleDismiss}
                className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-red-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 