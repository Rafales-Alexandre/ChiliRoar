// Configuration WalletConnect pour ChiliRoar
// Exemple d'intégration frontend avec Chiliz Chain

import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { chilizTestnet, chilizMainnet } from './chains'

// Configuration des chaînes Chiliz
export const chains = [chilizTestnet, chilizMainnet]

// Configuration des providers
const { publicClient, webSocketPublicClient } = configureChains(
  chains,
  [publicProvider()]
)

// Configuration WalletConnect
export const walletConnectConfig = {
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your_project_id_here',
  metadata: {
    name: 'ChiliRoar',
    description: 'Token ERC20 pour récompenser les fans de sport',
    url: 'https://chiliroar.com',
    icons: ['https://chiliroar.com/icon.png']
  }
}

// Configuration Wagmi
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      options: {
        projectId: walletConnectConfig.projectId,
        metadata: walletConnectConfig.metadata,
        showQrModal: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Configuration des contrats ChiliRoar
export const contractConfig = {
  // Adresses des contrats (à remplacer après déploiement)
  roarPoints: {
    testnet: '0x...', // Adresse du contrat sur testnet
    mainnet: '0x...', // Adresse du contrat sur mainnet
  },
  roarRewards: {
    testnet: '0x...', // Adresse du contrat de récompenses sur testnet
    mainnet: '0x...', // Adresse du contrat de récompenses sur mainnet
  }
}

// Types de récompenses prédéfinis
export const rewardTypes = {
  DAILY_LOGIN: {
    id: '0x6461696c795f6c6f67696e000000000000000000000000000000000000000000',
    name: 'Connexion quotidienne',
    points: 10,
    cooldown: 86400, // 24 heures
  },
  TWEET_ENGAGEMENT: {
    id: '0x74776565745f656e676167656d656e7400000000000000000000000000000000',
    name: 'Engagement tweet',
    points: 25,
    cooldown: 3600, // 1 heure
  },
  MATCH_PREDICTION: {
    id: '0x6d617463685f70726564696374696f6e00000000000000000000000000000000',
    name: 'Prédiction de match',
    points: 50,
    cooldown: 7200, // 2 heures
  },
  COMMUNITY_CONTRIBUTION: {
    id: '0x636f6d6d756e6974795f636f6e747269627574696f6e00000000000000000000',
    name: 'Contribution communautaire',
    points: 100,
    cooldown: 1800, // 30 minutes
  }
}

// Configuration des réseaux sociaux
export const socialConfig = {
  twitter: {
    apiUrl: 'https://api.twitter.com/2',
    requiredScopes: ['tweet.read', 'users.read', 'offline.access'],
  },
  discord: {
    apiUrl: 'https://discord.com/api/v10',
    requiredScopes: ['identify', 'guilds.join'],
  }
}

// Configuration des notifications
export const notificationConfig = {
  push: {
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
  },
  email: {
    provider: 'sendgrid', // ou 'mailgun', 'aws-ses'
    apiKey: process.env.SENDGRID_API_KEY,
  }
}

// Configuration de l'API backend
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.chiliroar.com',
  endpoints: {
    user: '/user',
    rewards: '/rewards',
    social: '/social',
    analytics: '/analytics',
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// Configuration des analytics
export const analyticsConfig = {
  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  },
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  }
}

// Configuration de l'interface utilisateur
export const uiConfig = {
  theme: {
    primary: '#FF6B35', // Orange ChiliRoar
    secondary: '#2E86AB',
    accent: '#A23B72',
    background: '#F8F9FA',
    text: '#212529',
  },
  features: {
    darkMode: true,
    notifications: true,
    socialLogin: true,
    leaderboard: true,
    achievements: true,
  }
}

// Configuration des tests
export const testConfig = {
  mockData: {
    user: {
      address: '0x1234567890123456789012345678901234567890',
      balance: '1000',
      totalMinted: '5000',
      lastMint: Date.now() - 3600000, // 1 heure ago
    },
    rewards: [
      {
        id: rewardTypes.DAILY_LOGIN.id,
        name: rewardTypes.DAILY_LOGIN.name,
        points: rewardTypes.DAILY_LOGIN.points,
        claimed: false,
        cooldownExpires: Date.now() + 3600000, // 1 heure from now
      }
    ]
  }
}

export default {
  walletConnectConfig,
  wagmiConfig,
  contractConfig,
  rewardTypes,
  socialConfig,
  notificationConfig,
  apiConfig,
  analyticsConfig,
  uiConfig,
  testConfig,
} 