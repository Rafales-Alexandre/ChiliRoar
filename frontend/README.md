# 🦁 ChiliRoar - Frontend

**Interface utilisateur moderne pour ChiliRoar - Récompenser les fans de sport avec des tokens**

## 📋 Description

Ce projet contient l'interface utilisateur complète pour ChiliRoar, construite avec **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS** et **Wagmi** pour l'intégration Web3.

## 🏗️ Architecture

```
chiliroar-frontend/
├── src/
│   ├── app/                    # App Router Next.js 14
│   │   ├── layout.tsx          # Layout principal
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── dashboard/          # Dashboard utilisateur
│   │   ├── rewards/            # Page des récompenses
│   │   └── profile/            # Profil utilisateur
│   ├── components/             # Composants réutilisables
│   │   ├── ui/                 # Composants UI de base
│   │   ├── web3/               # Composants Web3
│   │   └── layout/             # Composants de layout
│   ├── hooks/                  # Hooks personnalisés
│   ├── lib/                    # Utilitaires et configurations
│   ├── types/                  # Types TypeScript
│   └── utils/                  # Fonctions utilitaires
├── public/                     # Assets statiques
├── config/                     # Configurations
│   ├── walletconnect-config.ts # Configuration WalletConnect
│   └── chains.ts               # Configuration des chaînes
├── package.json                # Dépendances et scripts
├── next.config.js              # Configuration Next.js
├── tailwind.config.js          # Configuration Tailwind
└── tsconfig.json               # Configuration TypeScript
```

## 🚀 Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn
- Git

### Installation

```bash
# Cloner le repository
git clone https://github.com/chiliroar/chiliroar-frontend.git
cd chiliroar-frontend

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build

# Démarrer en production
npm start
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration (Authentification)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# RPC URLs Chiliz Chain
NEXT_PUBLIC_CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_MAINNET_RPC=https://rpc.chiliz.com

# API Keys
NEXT_PUBLIC_TWITTER_API_KEY=your_twitter_api_key
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

### Configuration de l'Authentification

Pour configurer l'authentification complète avec Google, GitHub, Twitter et Wallet, suivez le guide détaillé dans [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md).

## 🎨 Design System

### Couleurs ChiliRoar
- **Primary (Orange)** : `#FF6B35` - Couleur principale
- **Secondary (Blue)** : `#2E86AB` - Couleur secondaire
- **Accent (Purple)** : `#A23B72` - Couleur d'accent

### Typographie
- **Sans-serif** : Inter (UI)
- **Display** : Poppins (Titres)

### Composants UI
- **Boutons** : Styles cohérents avec états hover/focus
- **Cartes** : Design moderne avec ombres subtiles
- **Formulaires** : Validation en temps réel
- **Modales** : Animations fluides

## 🔐 Authentification

### Providers Supportés
- **Google** - Connexion avec compte Google
- **GitHub** - Connexion avec compte GitHub  
- **Twitter** - Connexion avec compte Twitter
- **Wallet** - Connexion avec MetaMask ou autres wallets

### Fonctionnalités
- Authentification unifiée avec Supabase
- Gestion des sessions sécurisées
- Protection des routes avec RLS
- Synchronisation automatique wallet/utilisateur

## 🔗 Intégration Web3

### WalletConnect
- Support de tous les wallets populaires
- Connexion QR code pour mobile
- Gestion automatique des chaînes Chiliz

### Wagmi
- Hooks React pour Web3
- Gestion d'état des connexions
- Cache intelligent des données

### Chaînes Supportées
- **Chiliz Testnet** (88882)
- **Chiliz Mainnet** (88888)

## 📱 Fonctionnalités

### Pages Principales
- **Accueil** : Présentation du projet
- **Dashboard** : Vue d'ensemble utilisateur
- **Récompenses** : Système de points et badges
- **Profil** : Gestion du compte utilisateur
- **Leaderboard** : Classement des fans

### Fonctionnalités Web3
- **Connexion Wallet** : Support multi-wallets
- **Affichage Solde** : RoarPoints en temps réel
- **Mint de Points** : Interface pour récompenses
- **Historique** : Transactions et activités

### Fonctionnalités Sociales
- **Intégration Twitter** : Vérification des tweets
- **Intégration Discord** : Rôles et badges
- **Notifications** : Alertes en temps réel
- **Partage** : Partage des succès

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests en mode watch
npm run test:watch

# Couverture de tests
npm run test:coverage

# Storybook
npm run storybook
```

## 📊 Performance

### Optimisations
- **Next.js 14** : App Router et optimisations automatiques
- **Image Optimization** : Optimisation automatique des images
- **Code Splitting** : Chargement à la demande
- **Caching** : Cache intelligent des données

### Métriques
- **Lighthouse Score** : >90 sur tous les critères
- **First Contentful Paint** : <1.5s
- **Largest Contentful Paint** : <2.5s
- **Cumulative Layout Shift** : <0.1

## 🔧 Scripts Disponibles

- `npm run dev` - Mode développement
- `npm run build` - Construction production
- `npm run start` - Démarrer production
- `npm run lint` - Vérification du code
- `npm run type-check` - Vérification TypeScript
- `npm test` - Tests unitaires
- `npm run test:watch` - Tests en mode watch
- `npm run test:coverage` - Couverture de tests
- `npm run storybook` - Storybook
- `npm run build-storybook` - Construire Storybook

## 🎯 Roadmap Frontend

### Phase 1 (Actuelle) ✅
- [x] Structure Next.js 14
- [x] Configuration Web3
- [x] Design system
- [x] Pages de base

### Phase 2 (En cours) 🚧
- [ ] Dashboard interactif
- [ ] Intégration APIs sociales
- [ ] Système de notifications
- [ ] Animations avancées

### Phase 3 (Futur) 📋
- [ ] PWA (Progressive Web App)
- [ ] Mode hors ligne
- [ ] Intégration IA
- [ ] Gamification avancée

## 🔒 Sécurité

### Bonnes Pratiques
- **Validation côté client** : Zod pour les formulaires
- **Sanitisation** : Protection XSS
- **HTTPS** : Connexions sécurisées
- **CSP** : Content Security Policy

### Web3 Sécurité
- **Vérification de chaîne** : Validation des réseaux
- **Confirmation de transactions** : UX sécurisée
- **Gestion d'erreurs** : Messages informatifs

## 🔗 Intégration avec les Smart Contracts

Pour intégrer avec les smart contracts ChiliRoar :

```typescript
// Exemple d'intégration avec les contrats
import { useContractRead, useContractWrite } from 'wagmi'
import { roarPointsABI } from './abis/roarPoints'

// Lire le solde
const { data: balance } = useContractRead({
  address: 'CONTRACT_ADDRESS',
  abi: roarPointsABI,
  functionName: 'balanceOf',
  args: [address]
})

// Mint des points
const { write: mint } = useContractWrite({
  address: 'CONTRACT_ADDRESS',
  abi: roarPointsABI,
  functionName: 'mint'
})
```

## 📞 Support

- 📧 Email: frontend@chiliroar.com
- 💬 Discord: [ChiliRoar Frontend](https://discord.gg/chiliroar-frontend)
- 🐛 Issues: [GitHub Issues](https://github.com/chiliroar/chiliroar-frontend/issues)

---

**⚡ Interface moderne et intuitive pour ChiliRoar ! 🦁⚽** 