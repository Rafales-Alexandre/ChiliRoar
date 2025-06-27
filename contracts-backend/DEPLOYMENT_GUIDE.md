# 🌶️ Guide de Déploiement - Chiliz Spicy Testnet

## Prérequis

### 1. Wallet avec des CHZ de test
- Créez un wallet (MetaMask recommandé)
- Obtenez des CHZ de test depuis le [faucet Chiliz Spicy](https://testnet.chiliz.com/faucet)
- Minimum recommandé : 0.5 CHZ

### 2. Configuration des variables d'environnement
Créez un fichier `.env` basé sur `env.example` :

```bash
# Clé privée du wallet de déploiement (sans le 0x)
PRIVATE_KEY=your_private_key_here

# RPC URLs (optionnel)
CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com

# Clé API pour la vérification (optionnel)
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## Déploiement

### 1. Compilation
```bash
npx hardhat compile
```

### 2. Tests
```bash
npx hardhat test
```

### 3. Déploiement sur Spicy Testnet
```bash
npx hardhat run scripts/deploy-spicy.ts --network chiliz_testnet
```

### 4. Vérification du contrat (optionnel)
```bash
# Définir l'adresse du contrat déployé
export CONTRACT_ADDRESS=0x...
npx hardhat run scripts/verify-spicy.ts --network chiliz_testnet
```

## Configuration Frontend

Après le déploiement, mettez à jour votre frontend avec :

```typescript
// Configuration réseau
const CHILIZ_SPICY_CONFIG = {
  chainId: 88882,
  chainName: "Chiliz Spicy Testnet",
  nativeCurrency: {
    name: "CHZ",
    symbol: "CHZ",
    decimals: 18,
  },
  rpcUrls: ["https://testnet-rpc.chiliz.com"],
  blockExplorerUrls: ["https://testnet.chiliscan.com"],
};

// Adresse du contrat déployé
const ROAR_POINTS_ADDRESS = "0x..."; // Remplacer par l'adresse réelle
```

## Vérifications Post-Déploiement

1. **Contrat déployé** : Vérifiez sur [ChiliScan Testnet](https://testnet.chiliscan.com)
2. **Fonctionnalités** :
   - Mint initial réussi
   - Pause/Unpause fonctionnel
   - Owner et permissions corrects
3. **Tests** : Exécutez les tests sur le contrat déployé

## Commandes Utiles

```bash
# Vérifier le solde du wallet
npx hardhat run scripts/check-balance.ts --network chiliz_testnet

# Interagir avec le contrat
npx hardhat run scripts/interact.ts --network chiliz_testnet

# Voir les logs de déploiement
npx hardhat run scripts/deploy-spicy.ts --network chiliz_testnet --verbose
```

## Support

- [Documentation Chiliz](https://docs.chiliz.com/)
- [ChiliScan Testnet](https://testnet.chiliscan.com)
- [Faucet Spicy](https://testnet.chiliz.com/faucet) 