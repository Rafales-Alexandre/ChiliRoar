import { useAuth } from '../app/contexts/AuthContext';
import { useWallet } from '../app/contexts/WalletContext';

export function useAuthState() {
  const auth = useAuth();
  const wallet = useWallet();

  return {
    // État d'authentification
    isAuthenticated: !!auth.user,
    user: auth.user,
    isLoading: auth.isLoading || wallet.isLoading,
    error: auth.error || wallet.error,

    // Méthodes d'authentification
    signInWithTwitter: auth.signInWithTwitter,
    signInWithWallet: auth.signInWithWallet,
    signOut: auth.signOut,

    // État du wallet
    isWalletConnected: wallet.isConnected,
    walletAddress: wallet.account,
    connectWallet: wallet.connectWallet,
    disconnectWallet: wallet.disconnectWallet,

    // Méthodes combinées
    signInWithConnectedWallet: async () => {
      if (wallet.isConnected && wallet.account) {
        await auth.signInWithWallet(wallet.account);
      } else {
        await wallet.connectWallet();
      }
    },

    // Utilitaires
    displayName: auth.user?.name || auth.user?.email || 'Utilisateur',
    shortWalletAddress: wallet.account 
      ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-4)}`
      : null,
  };
} 