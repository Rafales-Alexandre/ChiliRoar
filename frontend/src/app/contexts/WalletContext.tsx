"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
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

  // Vérifier si MetaMask est installé
  const checkIfMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkConnection = async () => {
      if (checkIfMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(chainId);
          }
        } catch (err) {
          console.error('Erreur lors de la vérification de connexion:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Écouter les changements de compte
  useEffect(() => {
    if (checkIfMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // L'utilisateur s'est déconnecté
          setIsConnected(false);
          setAccount(null);
          setChainId(null);
        } else {
          // L'utilisateur a changé de compte
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
        // Recharger la page pour éviter les problèmes de cache
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!checkIfMetaMaskInstalled()) {
        throw new Error('MetaMask n\'est pas installé. Veuillez installer MetaMask pour continuer.');
      }

      // Demander la connexion
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        // Obtenir l'ID de la chaîne
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(chainId);

        console.log('Connexion réussie:', accounts[0]);
      }
    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      
      if (err.code === 4001) {
        setError('Connexion annulée par l\'utilisateur');
      } else if (err.code === -32002) {
        setError('Veuillez débloquer MetaMask et réessayer');
      } else {
        setError(err.message || 'Erreur lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  const value: WalletContextType = {
    isConnected,
    account,
    chainId,
    connectWallet,
    disconnectWallet,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 