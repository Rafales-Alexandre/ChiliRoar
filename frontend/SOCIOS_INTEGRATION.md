# Intégration Wallet Socios - ChiliRoar

## 📱 Vue d'ensemble

L'intégration Socios permet aux utilisateurs de se connecter à ChiliRoar avec leur wallet Socios et d'accéder à leurs fan tokens directement depuis l'application.

## 🚀 Fonctionnalités

### ✅ **Connexion Wallet Socios**
- Détection automatique de l'app Socios
- Connexion via provider injecté (dans l'app)
- Connexion via WalletConnect (navigateur)
- Deep linking vers l'app Socios

### ✅ **Gestion des Fan Tokens**
- Affichage des fan tokens possédés
- Informations détaillées (balance, équipe, contrat)
- Interface utilisateur dédiée
- Synchronisation automatique

### ✅ **Expérience Utilisateur**
- Détection automatique de l'environnement
- Notifications intelligentes
- Interface cohérente avec le design ChiliRoar

## 🛠️ Architecture Technique

### **Contextes React**
```typescript
// SociosWalletContext.tsx
- Gestion de la connexion Socios
- Récupération des fan tokens
- État de connexion et erreurs

// WalletContext.tsx (étendu)
- Support multi-wallet (MetaMask + Socios)
- Détection du type de wallet
- Gestion unifiée des connexions
```

### **Composants**
```typescript
// SociosDetector.tsx
- Détection automatique de l'app Socios
- Proposition de connexion intelligente
- Gestion des préférences utilisateur

// FanTokensDisplay.tsx
- Affichage des fan tokens
- Interface utilisateur dédiée
- Gestion des états de chargement

// LoginModal.tsx (étendu)
- Bouton de connexion Socios
- Gestion des erreurs spécifiques
- Support multi-wallet
```

## 📋 Utilisation

### **1. Connexion dans l'app Socios**
```javascript
// Détection automatique
const isSociosApp = userAgent.includes('socios') || userAgent.includes('chiliz');

// Connexion via provider injecté
const provider = window.socios || window.chiliz || window.ethereum;
const accounts = await provider.request({ method: 'eth_requestAccounts' });
```

### **2. Connexion via navigateur**
```javascript
// Deep linking vers l'app Socios
const sociosDeepLink = `socios://wallet-connect?dapp=${encodeURIComponent(window.location.origin)}`;
window.location.href = sociosDeepLink;

// Fallback vers les stores
setTimeout(() => {
  const isAndroid = /android/i.test(navigator.userAgent);
  const storeUrl = isAndroid 
    ? 'https://play.google.com/store/apps/details?id=com.socios'
    : 'https://apps.apple.com/app/socios/id1456609840';
  window.open(storeUrl, '_blank');
}, 2000);
```

### **3. Récupération des Fan Tokens**
```javascript
// API Chiliz pour récupérer les fan tokens
const response = await fetch(`https://api.chiliz.com/v1/accounts/${address}/tokens`);
const data = await response.json();

const fanTokens = data.tokens?.map(token => ({
  symbol: token.symbol,
  name: token.name,
  balance: token.balance,
  teamId: token.team_id,
  contractAddress: token.contract_address,
}));
```

## 🔧 Configuration

### **Variables d'environnement**
```bash
# WalletConnect Project ID (optionnel)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Chiliz Chain IDs
CHILIZ_MAINNET_ID=88888
CHILIZ_TESTNET_ID=88882
```

### **Chaînes supportées**
- **Chiliz Mainnet**: Chain ID 88888
- **Chiliz Testnet**: Chain ID 88882

## 🎯 Scénarios d'utilisation

### **Scénario 1: Utilisateur dans l'app Socios**
1. L'utilisateur navigue vers ChiliRoar depuis l'app Socios
2. Détection automatique de l'environnement
3. Notification de connexion automatique
4. Connexion via provider injecté
5. Affichage des fan tokens dans le profil

### **Scénario 2: Utilisateur sur navigateur mobile**
1. L'utilisateur clique sur "Se connecter avec Socios"
2. Tentative d'ouverture de l'app Socios via deep link
3. Si l'app n'est pas installée, redirection vers le store
4. Connexion via WalletConnect après installation

### **Scénario 3: Utilisateur sur desktop**
1. L'utilisateur clique sur "Se connecter avec Socios"
2. Affichage du QR code WalletConnect
3. Scan du QR code avec l'app Socios mobile
4. Connexion établie entre desktop et mobile

## 🐛 Gestion des erreurs

### **Erreurs courantes**
```typescript
// Provider non détecté
'Provider Socios non détecté'

// Connexion refusée
'Connexion annulée par l\'utilisateur'

// App non installée
'Veuillez installer l\'app Socios pour continuer'

// Erreur API
'Erreur lors de la récupération des fan tokens'
```

### **Gestion des fallbacks**
- Redirection vers les stores si l'app n'est pas installée
- Affichage d'erreurs utilisateur-friendly
- Retry automatique pour les erreurs temporaires
- Logs détaillés pour le debugging

## 📱 Deep Links Socios

### **Schémas supportés**
```
// Connexion wallet
socios://wallet-connect?dapp=https://example.com

// WalletConnect
socios://wc?uri=wc:...

// Ouverture directe
socios://
```

### **Détection de l'app**
```javascript
// User Agent
userAgent.includes('socios') || userAgent.includes('chiliz')

// Window objects
window.socios || window.chiliz

// Provider detection
window.ethereum?.isSocios
```

## 🔐 Sécurité

### **Vérifications**
- Validation des adresses de wallet
- Vérification des signatures
- Contrôle des chaînes supportées
- Validation des contrats de fan tokens

### **Bonnes pratiques**
- Ne jamais stocker les clés privées
- Utiliser HTTPS uniquement
- Valider toutes les entrées utilisateur
- Gérer les timeouts de connexion

## 📊 Monitoring

### **Métriques à surveiller**
- Taux de connexion Socios
- Erreurs de connexion
- Temps de chargement des fan tokens
- Utilisation des deep links

### **Logs importants**
```javascript
console.log('Connexion Socios réussie:', account);
console.log('Fan tokens récupérés:', fanTokens.length);
console.error('Erreur connexion Socios:', error);
```

## 🚀 Déploiement

### **Checklist avant déploiement**
- [ ] Variables d'environnement configurées
- [ ] Deep links testés sur mobile
- [ ] WalletConnect Project ID valide
- [ ] API Chiliz accessible
- [ ] Gestion d'erreurs testée
- [ ] Interface utilisateur validée

### **Tests recommandés**
- Test dans l'app Socios
- Test sur navigateur mobile
- Test sur desktop avec QR code
- Test avec app non installée
- Test de récupération des fan tokens

## 📞 Support

### **Problèmes courants**
1. **Connexion échoue**: Vérifier que l'app Socios est à jour
2. **Fan tokens non affichés**: Vérifier la connexion réseau
3. **Deep link ne fonctionne pas**: Vérifier l'installation de l'app
4. **Erreur WalletConnect**: Vérifier le Project ID

### **Ressources utiles**
- [Documentation Socios](https://socios.com/developers)
- [Chiliz Chain Explorer](https://scan.chiliz.com)
- [WalletConnect Documentation](https://docs.walletconnect.com)

---

**Développé par l'équipe ChiliRoar** 🌶️🦁 