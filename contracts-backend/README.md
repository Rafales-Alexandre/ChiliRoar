# 🦁 ChiliRoar - Smart Contracts

**Smart contracts ERC20 pour ChiliRoar - Token de récompense pour les fans de sport**

## 📋 Description

Ce projet contient tous les smart contracts, tests, scripts de déploiement et configurations pour ChiliRoar. Les contrats sont déployés sur **Chiliz Chain** et utilisent **Hardhat** avec **Ignition**.

## 🏗️ Architecture

```
chiliroar-contracts/
├── contracts/
│   ├── RoarPoints.sol          # Contrat principal ERC20
│   ├── RoarRewards.sol         # Système de récompenses
│   └── interfaces/
│       └── IRoarPoints.sol     # Interface pour extensibilité
├── test/
│   ├── RoarPoints.test.ts      # Tests de base
│   └── RoarPoints.advanced.test.ts # Tests avancés
├── scripts/
│   ├── deploy.ts               # Script de déploiement
│   └── interact.ts             # Script d'interaction
├── ignition/
│   └── modules/
│       └── RoarPointsModule.ts # Module de déploiement
├── hardhat.config.ts           # Configuration Hardhat
├── package.json                # Dépendances et scripts
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
git clone https://github.com/chiliroar/chiliroar-contracts.git
cd chiliroar-contracts

# Installer les dépendances
npm install

# Compiler les contrats
npm run compile

# Lancer les tests
npm test
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Clé privée du wallet de déploiement
PRIVATE_KEY=your_private_key_here

# RPC URLs Chiliz Chain
CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
CHILIZ_MAINNET_RPC=https://rpc.chiliz.com

# API Keys (optionnel)
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

## 🧪 Tests

```bash
# Tests complets
npm test

# Tests avec rapport de gas
npm run gas

# Tests avec couverture
npm run test:coverage
```

## 🚀 Déploiement

### Testnet (Recommandé)
```bash
npm run deploy:testnet
```

### Mainnet
```bash
npm run deploy:mainnet
```

### Local
```bash
npm run node
npm run deploy:local
```

## 🔍 Vérification

```bash
# Testnet
npm run verify:testnet <contract-address>

# Mainnet
npm run verify:mainnet <contract-address>
```

## 📊 Interaction

```bash
# Modifier l'adresse du contrat dans scripts/interact.ts
# Puis lancer :
npm run interact
```

## 🔧 Scripts Disponibles

- `npm run compile` - Compiler les contrats
- `npm run test` - Lancer tous les tests
- `npm run test:coverage` - Tests avec couverture
- `npm run deploy:testnet` - Déployer sur testnet
- `npm run deploy:mainnet` - Déployer sur mainnet
- `npm run deploy:local` - Déployer en local
- `npm run interact` - Interagir avec le contrat
- `npm run verify:testnet` - Vérifier sur testnet
- `npm run verify:mainnet` - Vérifier sur mainnet
- `npm run node` - Lancer un nœud local
- `npm run clean` - Nettoyer les artefacts
- `npm run size` - Voir la taille des contrats
- `npm run gas` - Rapport de gas détaillé
- `npm run build` - Compiler et tester

## 📈 Métriques

### Gas Costs (estimations)
- **Déploiement** : ~2,500,000 gas
- **Mint simple** : ~50,000 gas
- **Mint batch (10 users)** : ~200,000 gas
- **Transfer** : ~35,000 gas
- **Ajout minter** : ~30,000 gas

## 🔒 Sécurité

### Fonctionnalités de Sécurité
- ✅ **ReentrancyGuard** : Protection contre les attaques de réentrance
- ✅ **Pausable** : Possibilité de mettre en pause en cas d'urgence
- ✅ **Ownable** : Gestion centralisée des permissions
- ✅ **Validation stricte** : Vérification de tous les paramètres
- ✅ **Limites de mint** : Protection contre les abus
- ✅ **Cooldown** : Prévention du spam de mint

### Recommandations
1. **Audit de sécurité** avant production
2. **Tests de pénétration** pour valider les protections
3. **Timelock** pour les changements critiques
4. **Multi-sig** pour la gouvernance

## 🔗 Intégration avec d'autres projets

Les contrats sont conçus pour être facilement intégrés avec d'autres projets :

```typescript
// Exemple d'intégration
import { ethers } from 'ethers'
import RoarPointsABI from './artifacts/contracts/RoarPoints.sol/RoarPoints.json'

const contract = new ethers.Contract(
  'CONTRACT_ADDRESS',
  RoarPointsABI.abi,
  signer
)

// Mint des points
await contract.mint(userAddress, ethers.parseEther('100'), 'Tweet engagement')
```

## 📞 Support

- 📧 Email: support@chiliroar.com
- 💬 Discord: [ChiliRoar Community](https://discord.gg/chiliroar)
- 🐛 Issues: [GitHub Issues](https://github.com/chiliroar/chiliroar-contracts/issues)

---

**⚡ Smart contracts sécurisés et optimisés pour ChiliRoar ! 🦁⚽** 