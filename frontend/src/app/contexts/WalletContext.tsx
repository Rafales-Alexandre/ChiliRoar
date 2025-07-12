"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  connectSocios: () => Promise<void>;
  disconnectWallet: () => void;
  resetDisconnectState: () => void;
  isLoading: boolean;
  error: string | null;
  walletType: 'metamask' | 'socios' | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isManuallyDisconnected, setIsManuallyDisconnected] = useState(false);
  const [walletType, setWalletType] = useState<'metamask' | 'socios' | null>(null);

  // Check if wallet is installed (MetaMask or other)
  const checkIfWalletInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Check if user is already connected
  useEffect(() => {
    const checkConnection = async () => {
      // Ne pas vérifier si l'utilisateur s'est déconnecté manuellement
      if (isManuallyDisconnected) {
        return;
      }
      
      if (checkIfWalletInstalled() && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(chainId);
          }
        } catch (err) {
          console.error('Error checking connection:', err);
        }
      }
    };

    checkConnection();
  }, [isManuallyDisconnected]);

  // Listen for account changes
  useEffect(() => {
    if (checkIfWalletInstalled() && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setIsConnected(false);
          setAccount(null);
          setChainId(null);
        } else {
          // User changed account
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
        // Reload page to avoid cache issues
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!checkIfWalletInstalled() || !window.ethereum) {
        throw new Error('Aucun wallet détecté. Veuillez installer Socios ou un autre wallet compatible pour continuer.');
      }

      // Request connection
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setWalletType('metamask');

        // Get chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);

        console.log('Connection successful:', accounts[0]);
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      
      if (err.code === 4001) {
        setError('Connexion annulée par l\'utilisateur');
      } else if (err.code === -32002) {
        setError('Veuillez déverrouiller votre wallet et réessayer');
      } else {
        setError(err.message || 'Erreur lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const connectSocios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Détecter si on est dans l'app Socios
      const userAgent = navigator.userAgent.toLowerCase();
      const isSociosApp = userAgent.includes('socios') || userAgent.includes('chiliz');
      
      if (isSociosApp) {
        // Utiliser le provider injecté par Socios
        const provider = (window as any).socios || (window as any).chiliz || (window as any).ethereum;
        
        if (!provider) {
          throw new Error('Provider Socios non détecté');
        }

        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setWalletType('socios');

          const chainId = await provider.request({ method: 'eth_chainId' });
          setChainId(chainId);

          console.log('Connexion Socios réussie:', accounts[0]);
        }
      } else {
        // Ouvrir l'app Socios via deep link
        const sociosDeepLink = `socios://wallet-connect?dapp=${encodeURIComponent(window.location.origin)}`;
        
        // Essayer d'ouvrir l'app
        window.location.href = sociosDeepLink;
        
        // Fallback: rediriger vers le store si l'app n'est pas installée
        setTimeout(() => {
          const isAndroid = /android/i.test(navigator.userAgent);
          const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
          
          if (isAndroid) {
            window.open('https://play.google.com/store/apps/details?id=com.socios', '_blank');
          } else if (isIOS) {
            window.open('https://apps.apple.com/app/socios/id1456609840', '_blank');
          }
        }, 2000);
        
        throw new Error('Veuillez installer l\'app Socios pour continuer');
      }
    } catch (err: any) {
      console.error('Erreur connexion Socios:', err);
      setError(err.message || 'Erreur lors de la connexion Socios');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // Marquer comme déconnecté manuellement
      setIsManuallyDisconnected(true);
      
      // Nettoyer l'état local
      setIsConnected(false);
      setAccount(null);
      setChainId(null);
      setWalletType(null);
      setError(null);
      
      // Note: La plupart des wallets ne supportent pas la déconnexion programmatique
      // L'utilisateur doit se déconnecter manuellement depuis son wallet
      console.log('Wallet déconnecté localement. Pour une déconnexion complète, utilisez votre wallet.');
      
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      // En cas d'erreur, forcer quand même la déconnexion locale
      setIsConnected(false);
      setAccount(null);
      setChainId(null);
      setWalletType(null);
    }
  };

  const resetDisconnectState = () => {
    setIsManuallyDisconnected(false);
  };

  const value: WalletContextType = {
    isConnected,
    account,
    chainId,
    connectWallet,
    connectSocios,
    disconnectWallet,
    resetDisconnectState,
    isLoading,
    error,
    walletType,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 