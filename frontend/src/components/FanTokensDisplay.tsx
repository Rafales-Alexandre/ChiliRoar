"use client";
import React, { useEffect, useState } from 'react';
import { useSociosWallet } from '../app/contexts/SociosWalletContext';
import { useWallet } from '../app/contexts/WalletContext';

interface FanToken {
  symbol: string;
  name: string;
  balance: string;
  teamId: string;
  contractAddress: string;
}

export default function FanTokensDisplay() {
  const { account, getFanTokens, isConnected: sociosConnected } = useSociosWallet();
  const { walletType } = useWallet();
  const [fanTokens, setFanTokens] = useState<FanToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFanTokens = async () => {
      if (sociosConnected && walletType === 'socios' && account) {
        setLoading(true);
        setError(null);
        
        try {
          const tokens = await getFanTokens();
          setFanTokens(tokens);
        } catch (err) {
          console.error('Erreur chargement fan tokens:', err);
          setError('Erreur lors du chargement des fan tokens');
        } finally {
          setLoading(false);
        }
      }
    };

    loadFanTokens();
  }, [sociosConnected, walletType, account, getFanTokens]);

  // Ne pas afficher si pas connecté via Socios
  if (!sociosConnected || walletType !== 'socios') {
    return null;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-3 mb-4">
        <img src="/socios.png" alt="Socios" className="w-6 h-6" />
        <h3 className="text-xl font-bold text-white">Mes Fan Tokens</h3>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-400">Chargement des fan tokens...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && fanTokens.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Aucun fan token trouvé</p>
          <p className="text-gray-500 text-xs mt-1">
            Achetez des fan tokens sur Socios pour les voir ici
          </p>
        </div>
      )}

      {!loading && !error && fanTokens.length > 0 && (
        <div className="space-y-3">
          {fanTokens.map((token, index) => (
            <div
              key={`${token.contractAddress}-${index}`}
              className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-red-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {token.symbol.slice(0, 3)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{token.name}</h4>
                    <p className="text-gray-400 text-sm">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    {parseFloat(token.balance).toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2
                    })}
                  </p>
                  <p className="text-gray-400 text-xs">tokens</p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Team ID:</span>
                  <span className="text-gray-300">{token.teamId}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-400">Contract:</span>
                  <span className="text-gray-300 font-mono">
                    {token.contractAddress.slice(0, 6)}...{token.contractAddress.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && fanTokens.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Total fan tokens:</span>
            <span className="text-white font-semibold">{fanTokens.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-gray-400">Wallet Socios:</span>
            <span className="text-gray-300 font-mono">
              {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 