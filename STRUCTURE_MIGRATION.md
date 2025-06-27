# 🏗️ Migration vers Structure Backend/Frontend Séparée

## 📋 Vue d'ensemble

Le projet ChiliRoar a été restructuré pour séparer clairement le **backend** (smart contracts) du **frontend** (interface utilisateur). Cette architecture permet une meilleure organisation, maintenance et développement parallèle.

## 🔄 Changements Effectués

### Avant
```
chiliroar/
├── contracts/
├── test/
├── scripts/
├── ignition/
├── frontend-example/
├── hardhat.config.ts
├── package.json
└── README.md
```

### Après
```
chiliroar/
├── contracts-backend/          # Smart contracts et backend
│   ├── contracts/
│   ├── test/
│   ├── scripts/
│   ├── ignition/
│   ├── package.json
│   ├── hardhat.config.ts
│   ├── tsconfig.json
│   └── README.md
├── frontend/                   # Interface utilisateur
│   ├── frontend-example/       # Configurations Web3
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── README.md
├── package.json                # Monorepo principal
└── README.md                   # Documentation globale
```

## 📁 Détail des Dossiers

### 🔧 `contracts-backend/`

**Contenu :**
- `contracts/` - Smart contracts Solidity
- `test/` - Tests unitaires et d'intégration
- `scripts/` - Scripts de déploiement et interaction
- `ignition/` - Modules de déploiement Hardhat
- `package.json` - Dépendances backend
- `hardhat.config.ts` - Configuration Hardhat
- `tsconfig.json` - Configuration TypeScript
- `.gitignore` - Fichiers ignorés backend
- `README.md` - Documentation backend

**Scripts disponibles :**
```bash
cd contracts-backend
npm install
npm run compile
npm test
npm run deploy:testnet
npm run gas
```

### 🎨 `frontend/`

**Contenu :**
- `frontend-example/` - Configurations Web3 (WalletConnect, chaînes)
- `package.json` - Dépendances frontend
- `next.config.js` - Configuration Next.js
- `tailwind.config.js` - Configuration Tailwind CSS
- `tsconfig.json` - Configuration TypeScript
- `.gitignore` - Fichiers ignorés frontend
- `README.md` - Documentation frontend

**Scripts disponibles :**
```bash
cd frontend
npm install
npm run dev
npm run build
npm test
```

## 🚀 Scripts Monorepo

Le `package.json` principal contient des scripts pour gérer les deux projets :

```bash
# Installation complète
npm run install:all

# Développement
npm run dev              # Backend + Frontend en parallèle
npm run dev:backend      # Backend seulement
npm run dev:frontend     # Frontend seulement

# Tests
npm test                 # Tests backend + frontend
npm run test:backend     # Tests backend
npm run test:frontend    # Tests frontend

# Build
npm run build            # Build backend + frontend
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Déploiement
npm run deploy:testnet   # Déployer contrats sur testnet
npm run deploy:mainnet   # Déployer contrats sur mainnet

# Utilitaires
npm run clean            # Nettoyer les deux projets
npm run lint             # Linter les deux projets
npm run type-check       # Vérification TypeScript
npm run gas              # Rapport de gas
npm run coverage         # Couverture de tests
```

## ⚙️ Configuration

### Backend (Smart Contracts)

Créez un fichier `.env` dans `contracts-backend/` :

```env
PRIVATE_KEY=your_private_key_here
CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
CHILIZ_MAINNET_RPC=https://rpc.chiliz.com
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

### Frontend (Interface)

Créez un fichier `.env.local` dans `frontend/` :

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_MAINNET_RPC=https://rpc.chiliz.com
```

## 🔗 Intégration Backend-Frontend

### 1. Déployer les Contrats

```bash
cd contracts-backend
npm run deploy:testnet
```

### 2. Récupérer les Adresses

Notez les adresses des contrats déployés :
- `RoarPoints` : `0x...`
- `RoarRewards` : `0x...`

### 3. Configurer le Frontend

Mettez à jour `frontend/config/walletconnect-config.ts` :

```typescript
export const contractConfig = {
  roarPoints: {
    testnet: '0x...', // Adresse du contrat déployé
    mainnet: '0x...',
  },
  roarRewards: {
    testnet: '0x...', // Adresse du contrat déployé
    mainnet: '0x...',
  }
}
```

### 4. Tester l'Intégration

```bash
# Terminal 1 - Backend
cd contracts-backend
npm run node

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📊 Avantages de la Nouvelle Structure

### 🔧 Backend
- ✅ **Isolation** : Dépendances séparées
- ✅ **Tests** : Environnement de test dédié
- ✅ **Déploiement** : Scripts spécialisés
- ✅ **Documentation** : README spécifique

### 🎨 Frontend
- ✅ **Indépendance** : Développement autonome
- ✅ **Performance** : Optimisations dédiées
- ✅ **UX** : Focus sur l'interface
- ✅ **Design System** : Cohérence visuelle

### 🏗️ Monorepo
- ✅ **Gestion centralisée** : Scripts unifiés
- ✅ **Développement parallèle** : Backend + Frontend
- ✅ **CI/CD** : Intégration continue
- ✅ **Documentation** : Vue d'ensemble

## 🛠️ Migration des Fichiers Existants

### Fichiers Déplacés

| Ancien Emplacement | Nouveau Emplacement |
|-------------------|-------------------|
| `contracts/` | `contracts-backend/contracts/` |
| `test/` | `contracts-backend/test/` |
| `scripts/` | `contracts-backend/scripts/` |
| `ignition/` | `contracts-backend/ignition/` |
| `frontend-example/` | `frontend/frontend-example/` |
| `hardhat.config.ts` | `contracts-backend/hardhat.config.ts` |
| `package.json` | `contracts-backend/package.json` |

### Fichiers Créés

| Nouveau Fichier | Description |
|----------------|-------------|
| `package.json` | Monorepo principal |
| `frontend/package.json` | Dépendances frontend |
| `frontend/next.config.js` | Configuration Next.js |
| `frontend/tailwind.config.js` | Configuration Tailwind |
| `frontend/tsconfig.json` | Configuration TypeScript frontend |
| `contracts-backend/tsconfig.json` | Configuration TypeScript backend |
| `contracts-backend/.gitignore` | Gitignore backend |
| `frontend/.gitignore` | Gitignore frontend |

## 🚀 Prochaines Étapes

### Phase 1 - Structure ✅
- [x] Séparation backend/frontend
- [x] Configuration monorepo
- [x] Documentation mise à jour
- [x] Scripts unifiés

### Phase 2 - Développement 🚧
- [ ] Développement frontend complet
- [ ] Intégration APIs sociales
- [ ] Tests d'intégration
- [ ] CI/CD pipeline

### Phase 3 - Production 📋
- [ ] Déploiement testnet
- [ ] Tests utilisateurs
- [ ] Audit de sécurité
- [ ] Lancement mainnet

## 📞 Support

Pour toute question sur la migration :

- 📧 Email: migration@chiliroar.com
- 💬 Discord: [ChiliRoar Migration](https://discord.gg/chiliroar-migration)
- 📚 Documentation: [Wiki Migration](https://github.com/chiliroar/wiki/migration)

---

**⚡ La nouvelle structure est prête pour un développement efficace et scalable ! 🦁⚽** 