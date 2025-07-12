"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SociosAccount {
  address: string;
  chainId: string;
  fanTokens?: FanToken[];
}

interface FanToken {
  symbol: string;
  name: string;
  balance: string;
  teamId: string;
  contractAddress: string;
}

interface SociosWalletContextType {
  isConnected: boolean;
  account: SociosAccount | null;
  chainId: string | null;
  connectSocios: () => Promise<void>;
  disconnectSocios: () => void;
  getFanTokens: () => Promise<FanToken[]>;
  isLoading: boolean;
  error: string | null;
}

const SociosWalletContext = createContext<SociosWalletContextType | undefined>(undefined);

export function useSociosWallet() {
  const context = useContext(SociosWalletContext);
  if (context === undefined) {
    throw new Error('useSociosWallet must be used within a SociosWalletProvider');
  }
  return context;
}

interface SociosWalletProviderProps {
  children: ReactNode;
}

export function SociosWalletProvider({ children }: SociosWalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<SociosAccount | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Détection de l'app Socios
  const isSociosApp = () => {
    if (typeof window === 'undefined') return false;
    
    // Détection via user agent
    const userAgent = navigator.userAgent.toLowerCase();
    const isSociosUA = userAgent.includes('socios') || userAgent.includes('chiliz');
    
    // Détection via window object (si l'app injecte des variables)
    const hasSociosProvider = !!(window as any).socios || !!(window as any).chiliz;
    
    return isSociosUA || hasSociosProvider;
  };

  // Connexion via WalletConnect pour Socios
  const connectSocios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Si on est dans l'app Socios, utiliser le provider injecté
      if (isSociosApp()) {
        await connectViaInjectedProvider();
      } else {
        // Sinon, utiliser WalletConnect avec deep linking
        await connectViaWalletConnect();
      }
    } catch (err: any) {
      console.error('Erreur connexion Socios:', err);
      setError(err.message || 'Erreur lors de la connexion Socios');
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion via provider injecté (quand on est dans l'app Socios)
  const connectViaInjectedProvider = async () => {
    const provider = (window as any).socios || (window as any).chiliz || (window as any).ethereum;
    
    if (!provider) {
      throw new Error('Provider Socios non détecté');
    }

    const accounts = await provider.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length > 0) {
      const address = accounts[0];
      const chainId = await provider.request({ method: 'eth_chainId' });
      
      setAccount({
        address,
        chainId,
      });
      setChainId(chainId);
      setIsConnected(true);

      // Récupérer les fan tokens
      const fanTokens = await fetchFanTokens(address);
      setAccount(prev => prev ? { ...prev, fanTokens } : null);
    }
  };

  // Connexion via WalletConnect
  const connectViaWalletConnect = async () => {
    // Configuration WalletConnect pour Socios
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo_project_id';
    
    // Import dynamique de WalletConnect
    const { WalletConnectConnector } = await import('@walletconnect/ethereum-provider');
    
    const provider = await WalletConnectConnector.init({
      projectId,
      chains: [88888, 88882], // Chiliz mainnet et testnet
      showQrModal: true,
      metadata: {
        name: 'ChiliRoar',
        description: 'Plateforme de fan tokens ChiliRoar',
        url: window.location.origin,
        icons: [`${window.location.origin}/LOGO.png`],
      },
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999',
        },
      },
    });

    // Essayer de se connecter avec deep link vers Socios
    const sociosDeepLink = `socios://wc?uri=${encodeURIComponent(provider.uri)}`;
    
    // Ouvrir l'app Socios si disponible
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = sociosDeepLink;
    }

    const accounts = await provider.enable();
    
    if (accounts.length > 0) {
      const address = accounts[0];
      const chainId = await provider.request({ method: 'eth_chainId' });
      
      setAccount({
        address,
        chainId,
      });
      setChainId(chainId);
      setIsConnected(true);

      // Récupérer les fan tokens
      const fanTokens = await fetchFanTokens(address);
      setAccount(prev => prev ? { ...prev, fanTokens } : null);
    }
  };

  // Récupération des fan tokens
  const fetchFanTokens = async (address: string): Promise<FanToken[]> => {
    try {
      // API Chiliz/Socios pour récupérer les fan tokens
      const response = await fetch(`https://api.chiliz.com/v1/accounts/${address}/tokens`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des fan tokens');
      }
      
      const data = await response.json();
      
      return data.tokens?.map((token: any) => ({
        symbol: token.symbol,
        name: token.name,
        balance: token.balance,
        teamId: token.team_id,
        contractAddress: token.contract_address,
      })) || [];
    } catch (error) {
      console.error('Erreur récupération fan tokens:', error);
      return [];
    }
  };

  const getFanTokens = async (): Promise<FanToken[]> => {
    if (!account) return [];
    return account.fanTokens || [];
  };

  const disconnectSocios = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
    setError(null);
  };

  // Vérifier la connexion au chargement
  useEffect(() => {
    const checkConnection = async () => {
      if (isSociosApp()) {
        const provider = (window as any).socios || (window as any).chiliz || (window as any).ethereum;
        
        if (provider) {
          try {
            const accounts = await provider.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              const address = accounts[0];
              const chainId = await provider.request({ method: 'eth_chainId' });
              
              setAccount({
                address,
                chainId,
              });
              setChainId(chainId);
              setIsConnected(true);

              // Récupérer les fan tokens
              const fanTokens = await fetchFanTokens(address);
              setAccount(prev => prev ? { ...prev, fanTokens } : null);
            }
          } catch (error) {
            console.error('Erreur vérification connexion Socios:', error);
          }
        }
      }
    };

    checkConnection();
  }, []);

  const value: SociosWalletContextType = {
    isConnected,
    account,
    chainId,
    connectSocios,
    disconnectSocios,
    getFanTokens,
    isLoading,
    error,
  };

  return (
    <SociosWalletContext.Provider value={value}>
      {children}
    </SociosWalletContext.Provider>
  );
} 