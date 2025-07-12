"use client";
import React, { useState } from 'react';
import { useWallet } from '../app/contexts/WalletContext';
import { useAuth } from '../app/contexts/AuthContext';
import { useToast } from '../app/contexts/ToastContext';
import { LoginProvider } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginProviders: LoginProvider[] = [
  {
    id: 'twitter',
    name: 'Twitter',
            icon: <img src="/twitter.png" alt="Twitter" className="w-5 h-5" />,
    color: 'from-blue-400 to-blue-500',
    gradient: 'hover:from-blue-500 hover:to-blue-600'
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: '⚽',
    color: 'from-green-500 to-blue-500',
    gradient: 'hover:from-green-600 hover:to-blue-600'
  }
];

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  
  const { 
    isConnected, 
    account, 
    chainId,
    connectWallet, 
    disconnectWallet,
    resetDisconnectState,
    isLoading: walletLoading, 
    error: walletError 
  } = useWallet();

  const {
    user,
    isLoading: authLoading,
    error: authError,
    signInWithTwitter,
    signInWithWallet,
    signOut
  } = useAuth();
  
  const { showSuccess, showError, showInfo } = useToast();

  if (!isOpen) return null;

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
      showSuccess('Wallet connecté avec succès !');
    } catch (error) {
      showError('Erreur lors de la connexion du wallet');
    }
  };

  const handleSocialLogin = async (provider: 'twitter') => {
    try {
      switch (provider) {
        case 'twitter':
          await signInWithTwitter();
          break;
      }
      showSuccess(`Connexion avec ${provider} réussie !`);
    } catch (error) {
      showError(`Erreur lors de la connexion avec ${provider}`);
    }
  };

  const handleWalletLogin = async () => {
    try {
      if (isConnected && account) {
        await signInWithWallet(account);
        showSuccess('Connexion avec wallet réussie !');
      } else {
        await connectWallet();
      }
    } catch (error) {
      showError('Erreur lors de la connexion avec le wallet');
    }
  };



  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      signOut();
      showInfo('Déconnexion réussie - Le wallet restera connecté dans votre application wallet mais déconnecté de ChiliRoar');
      onClose();
    } catch (error) {
      showError('Erreur lors de la déconnexion');
    }
  };

  const handleReconnect = () => {
    resetDisconnectState();
    showInfo('Connexion automatique réactivée');
  };

  // If user is authenticated, show user information
  if (user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
              <h2 className="text-2xl font-bold text-white">ChiliRoar</h2>
            </div>
            <p className="text-green-400 font-medium">
              ✅ Connecté avec {user.provider === 'twitter' ? 'Twitter' : 
                               user.provider === 'wallet' ? 'Wallet' : 'Compte'}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Nom:</span>
              <span className="text-white text-sm font-medium">
                {user.name || 'Utilisateur'}
              </span>
            </div>
            {user.email && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Email:</span>
                <span className="text-white text-sm">
                  {user.email}
                </span>
              </div>
            )}
            {user.wallet_address && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Wallet:</span>
                <span className="text-white text-sm font-mono">
                  {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                </span>
              </div>
            )}
            {isConnected && chainId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Réseau:</span>
                <span className="text-blue-400 text-sm">
                  {chainId === '0x1' ? 'Ethereum Mainnet' : 
                   chainId === '0x89' ? 'Polygon' : 
                   chainId === '0xa' ? 'Optimism' : 
                   chainId === '0xa4b1' ? 'Arbitrum' : 
                   chainId ? `Chain ID: ${chainId}` : 'Inconnu'}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDisconnect}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Disconnect
            </button>
            
            <button
              onClick={handleReconnect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Réactiver Connexion Auto
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-700 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/LOGO.png" alt="ChiliRoar" className="w-12 h-12 mr-3" />
            <h2 className="text-2xl font-bold text-white">ChiliRoar</h2>
          </div>
          <p className="text-gray-400">Connect to access the Arena</p>
        </div>

        {/* Error message */}
        {(authError || walletError) && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{authError || walletError}</p>
          </div>
        )}

        {/* Login Options */}
        <div className="space-y-4">
          {/* Twitter Login */}
          <button
            onClick={() => handleSocialLogin('twitter')}
            disabled={authLoading}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3"
          >
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                              <img src="/twitter.png" alt="Twitter" className="w-5 h-5" />
            )}
            {authLoading ? 'Connexion...' : 'Se connecter avec Twitter'}
          </button>

          {/* Wallet Login */}
          <button
            onClick={handleWalletLogin}
            disabled={walletLoading || authLoading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3"
          >
            {(walletLoading || authLoading) ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-xl">⚽</span>
            )}
            {(walletLoading || authLoading) ? 'Connexion...' : 'Se connecter avec Wallet'}
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Pas de wallet?{' '}
              <a href="https://www.socios.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors duration-200">
                Télécharger Socios
              </a>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Recommandé pour les fan tokens et l'écosystème sportif
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            En vous connectant, vous acceptez nos{' '}
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
              Conditions d'utilisation
            </a>{' '}
            et notre{' '}
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors duration-200">
              Politique de confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 