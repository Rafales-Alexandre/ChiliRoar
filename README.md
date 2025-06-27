# 🦁 ChiliRoar - Projets Indépendants

**ChiliRoar - Token ERC20 pour récompenser les fans de sport**

## 📋 Description

ChiliRoar est un écosystème de tokens ERC20 dédié aux fans de sport, déployé sur **Chiliz Chain**. Ce repository contient maintenant **deux projets complètement indépendants** :

- **Smart Contracts** : Backend blockchain avec Hardhat
- **Frontend** : Interface utilisateur avec Next.js

## 🏗️ Architecture

```
ChiliRoar/
├── contracts-backend/          # Projet Smart Contracts (Indépendant)
│   ├── contracts/              # Smart contracts Solidity
│   ├── test/                   # Tests des contrats
│   ├── scripts/                # Scripts de déploiement
│   ├── package.json            # Dépendances backend
│   └── README.md               # Documentation backend
├── frontend/                   # Projet Frontend (Indépendant)
│   ├── src/                    # Code source Next.js
│   ├── public/                 # Assets statiques
│   ├── package.json            # Dépendances frontend
│   └── README.md               # Documentation frontend
└── README.md                   # Ce fichier
```

## 🚀 Installation et Utilisation

### Option 1 : Utiliser les projets séparément

#### Smart Contracts (Backend)
```bash
cd contracts-backend
npm install
npm run compile
npm test
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Option 2 : Utiliser les deux projets ensemble

```bash
# Installer les dépendances des deux projets
cd contracts-backend && npm install
cd ../frontend && npm install

# Démarrer le backend (dans un terminal)
cd contracts-backend
npm run node

# Démarrer le frontend (dans un autre terminal)
cd frontend
npm run dev
```

## 📚 Documentation

- **[Smart Contracts](./contracts-backend/README.md)** - Documentation complète des contrats
- **[Frontend](./frontend/README.md)** - Documentation de l'interface utilisateur

## 🔗 Intégration

Les deux projets sont conçus pour fonctionner ensemble mais restent complètement indépendants :

### Communication
- **Frontend → Smart Contracts** : Via Web3 (Wagmi + Ethers.js)
- **Smart Contracts** : Déployés sur Chiliz Chain
- **Frontend** : Interface utilisateur moderne

### Dépendances
- **Aucune dépendance directe** entre les projets
- **Interface standardisée** via les ABIs des contrats
- **Configuration flexible** via variables d'environnement

## 🎯 Avantages de la Séparation

### ✅ Indépendance
- **Développement isolé** : Chaque équipe peut travailler indépendamment
- **Déploiement séparé** : Mise à jour des contrats sans affecter le frontend
- **Technologies spécialisées** : Solidity pour les contrats, React pour l'UI

### ✅ Maintenabilité
- **Code plus propre** : Séparation claire des responsabilités
- **Tests spécialisés** : Tests unitaires pour chaque couche
- **Documentation dédiée** : README spécifiques pour chaque projet

### ✅ Évolutivité
- **Réutilisation** : Les contrats peuvent être utilisés par d'autres frontends
- **Scalabilité** : Ajout facile de nouveaux frontends ou contrats
- **Flexibilité** : Possibilité d'utiliser différentes technologies

## 🔧 Configuration

### Variables d'environnement communes
```env
# Chiliz Chain RPC URLs
CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
CHILIZ_MAINNET_RPC=https://rpc.chiliz.com

# Contract Addresses (à configurer après déploiement)
ROAR_POINTS_CONTRACT_ADDRESS=0x...
ROAR_REWARDS_CONTRACT_ADDRESS=0x...
```

## 🧪 Tests

### Smart Contracts
```bash
cd contracts-backend
npm test
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

## 🚀 Déploiement

### Smart Contracts
```bash
cd contracts-backend
npm run deploy:testnet  # Testnet
npm run deploy:mainnet  # Mainnet
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📞 Support

- 📧 Email: support@chiliroar.com
- 💬 Discord: [ChiliRoar Community](https://discord.gg/chiliroar)
- 🐛 Issues: 
  - [Smart Contracts](https://github.com/chiliroar/chiliroar-contracts/issues)
  - [Frontend](https://github.com/chiliroar/chiliroar-frontend/issues)

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**⚡ ChiliRoar - Révolutionner les récompenses sportives avec la blockchain ! 🦁⚽**
