"use client";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useWallet } from "../contexts/WalletContext";
import Link from "next/link";
import FanTokensDisplay from "../../components/FanTokensDisplay";

export default function ProfilePage() {
  const { user, isLoading, error, signInWithTwitter, signInWithWallet, refreshUser } = useAuth();
  const { account, isConnected, connectWallet } = useWallet();
  const [linkingWallet, setLinkingWallet] = useState(false);
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Lier le wallet à un compte existant
  const handleLinkWallet = async () => {
    setLinkingWallet(true);
    setLocalError(null);
    setSuccess(null);
    try {
      if (!isConnected) {
        await connectWallet();
      }
      if (account && user) {
        await signInWithWallet(account);
        await refreshUser();
        setSuccess("Wallet lié avec succès !");
      }
    } catch (e: any) {
      setLocalError(e.message || "Erreur lors de la liaison du wallet");
    } finally {
      setLinkingWallet(false);
    }
  };

  // Lier un provider OAuth à un compte wallet
  const handleLinkProvider = async (provider: "twitter") => {
    setLinkingProvider(provider);
    setLocalError(null);
    setSuccess(null);
    try {
      if (provider === "twitter") await signInWithTwitter();
      await refreshUser();
      setSuccess("Provider lié avec succès !");
    } catch (e: any) {
      setLocalError(e.message || "Erreur lors de la liaison du provider");
    } finally {
      setLinkingProvider(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-white text-lg">Chargement du profil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Vous n'êtes pas connecté</h2>
          <Link href="/" className="text-green-600 hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Mon Profil</h1>
        <div className="mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Nom :</span>
            <span className="text-gray-900">{user.name || "-"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Email :</span>
            <span className="text-gray-900">{user.email || "-"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Provider :</span>
            <span className="text-gray-900">{user.provider || "-"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Wallet :</span>
            <span className="text-gray-900">{user.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : "Non lié"}</span>
          </div>
        </div>

        {/* Lier le wallet si non lié */}
        {!user.wallet_address && (
          <div className="mb-6">
            <button
              onClick={handleLinkWallet}
              disabled={linkingWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 w-full"
            >
              {linkingWallet ? "Connexion au wallet..." : "Lier mon wallet"}
            </button>
          </div>
        )}

        {/* Lier un provider OAuth si connecté par wallet */}
        {user.provider === "wallet" && (
          <div className="mb-6">
            <div className="mb-2 text-gray-700 font-semibold">Lier un compte :</div>
            <div className="flex gap-4">
              <button
                onClick={() => handleLinkProvider("twitter")}
                disabled={linkingProvider === "twitter"}
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold w-full"
              >
                {linkingProvider === "twitter" ? "Connexion..." : "⚽ Se connecter avec Twitter"}
              </button>
            </div>
          </div>
        )}

        {/* Feedback */}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{success}</div>}
        {(error || localError) && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{error || localError}</div>}

        {/* Fan Tokens Display */}
        <FanTokensDisplay />

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-green-600 hover:underline font-semibold">Retour au dashboard</Link>
        </div>
      </div>
    </div>
  );
} 