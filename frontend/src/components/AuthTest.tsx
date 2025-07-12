"use client";
import React from 'react';
import { useAuth } from '../app/contexts/AuthContext';
import { useWallet } from '../app/contexts/WalletContext';

export default function AuthTest() {
  const { user, isLoading, error, signInWithWallet, signOut } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWallet();

  const handleWalletLogin = async () => {
    if (!isConnected) {
      await connectWallet();
    }
    
    if (account) {
      await signInWithWallet(account);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-600">Chargement de l'authentification...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔐 Test d'Authentification
      </h2>
      
      {/* État de l'utilisateur */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          État de l'utilisateur :
        </h3>
        {user ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800 font-medium">✅ Connecté</p>
            <p className="text-sm text-green-600 mt-1">
              Nom : {user.name || 'Non défini'}
            </p>
            <p className="text-sm text-green-600">
              Email : {user.email || 'Non défini'}
            </p>
            <p className="text-sm text-green-600">
              Wallet : {user.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : 'Non connecté'}
            </p>
            <p className="text-sm text-green-600">
              Provider : {user.provider || 'Non défini'}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-800 font-medium">❌ Non connecté</p>
          </div>
        )}
      </div>

      {/* État du wallet */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          État du wallet :
        </h3>
        {isConnected ? (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">✅ Wallet connecté</p>
            <p className="text-sm text-blue-600 mt-1">
              Adresse : {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Non disponible'}
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-medium">⚠️ Wallet non connecté</p>
          </div>
        )}
      </div>

      {/* Erreurs */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold mb-2 text-red-700">
            Erreur :
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-700">
          Actions :
        </h3>
        
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔗 Connecter MetaMask
          </button>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleWalletLogin}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🚀 Se connecter avec Wallet
            </button>
            
            <button
              onClick={disconnectWallet}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              🔌 Déconnecter Wallet
            </button>
          </div>
        )}

        {user && (
          <button
            onClick={signOut}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            🚪 Se déconnecter
          </button>
        )}
      </div>

      {/* Informations */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          ℹ️ Informations :
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• L'authentification wallet fonctionne sans configuration OAuth</li>
          <li>• Les providers OAuth (Google, GitHub, Twitter) sont temporairement désactivés</li>
          <li>• Consultez OAUTH_SETUP.md pour configurer les providers OAuth</li>
          <li>• L'authentification wallet est suffisante pour le développement</li>
        </ul>
      </div>
    </div>
  );
} 