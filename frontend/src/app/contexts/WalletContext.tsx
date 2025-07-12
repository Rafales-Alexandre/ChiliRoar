"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  resetDisconnectState: () => void;
  isLoading: boolean;
  error: string | null;
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

  const disconnectWallet = async () => {
    try {
      // Marquer comme déconnecté manuellement
      setIsManuallyDisconnected(true);
      
      // Nettoyer l'état local
      setIsConnected(false);
      setAccount(null);
      setChainId(null);
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
    disconnectWallet,
    resetDisconnectState,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 