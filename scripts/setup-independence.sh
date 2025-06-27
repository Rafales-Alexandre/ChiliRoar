#!/bin/bash

# 🔄 Script de Configuration pour l'Indépendance des Projets ChiliRoar
# Ce script facilite la configuration des deux projets indépendants

set -e

echo "🦁 Configuration de ChiliRoar - Projets Indépendants"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier les prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 ou supérieure est requise. Version actuelle: $(node -v)"
        exit 1
    fi
    
    print_success "Prérequis vérifiés ✓"
}

# Installer les dépendances du backend
install_backend() {
    print_status "Installation des dépendances du backend..."
    
    if [ ! -d "contracts-backend" ]; then
        print_error "Le dossier contracts-backend n'existe pas."
        exit 1
    fi
    
    cd contracts-backend
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dépendances backend installées ✓"
    else
        print_error "package.json manquant dans contracts-backend"
        exit 1
    fi
    
    cd ..
}

# Installer les dépendances du frontend
install_frontend() {
    print_status "Installation des dépendances du frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "Le dossier frontend n'existe pas."
        exit 1
    fi
    
    cd frontend
    
    if [ -f "package.json" ]; then
        npm install
        print_success "Dépendances frontend installées ✓"
    else
        print_error "package.json manquant dans frontend"
        exit 1
    fi
    
    cd ..
}

# Créer les fichiers d'environnement
setup_environment() {
    print_status "Configuration des fichiers d'environnement..."
    
    # Backend .env
    if [ ! -f "contracts-backend/.env" ]; then
        cat > contracts-backend/.env << EOF
# Configuration ChiliRoar Backend
# Remplissez ces valeurs avec vos propres clés

# Clé privée du wallet de déploiement
PRIVATE_KEY=your_private_key_here

# RPC URLs Chiliz Chain
CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
CHILIZ_MAINNET_RPC=https://rpc.chiliz.com

# API Keys (optionnel)
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
EOF
        print_success "Fichier .env créé pour le backend ✓"
    else
        print_warning "Fichier .env existe déjà dans contracts-backend"
    fi
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
# Configuration ChiliRoar Frontend
# Remplissez ces valeurs avec vos propres clés

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# RPC URLs Chiliz Chain
NEXT_PUBLIC_CHILIZ_TESTNET_RPC=https://testnet-rpc.chiliz.com
NEXT_PUBLIC_CHILIZ_MAINNET_RPC=https://rpc.chiliz.com

# Adresses des contrats (à configurer après déploiement)
NEXT_PUBLIC_ROAR_POINTS_ADDRESS=0x...
NEXT_PUBLIC_ROAR_REWARDS_ADDRESS=0x...

# API Keys
NEXT_PUBLIC_TWITTER_API_KEY=your_twitter_api_key
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
EOF
        print_success "Fichier .env.local créé pour le frontend ✓"
    else
        print_warning "Fichier .env.local existe déjà dans frontend"
    fi
}

# Tester les installations
test_installations() {
    print_status "Test des installations..."
    
    # Test backend
    cd contracts-backend
    if npm run compile &> /dev/null; then
        print_success "Backend: Compilation réussie ✓"
    else
        print_warning "Backend: Problème de compilation (vérifiez les dépendances)"
    fi
    cd ..
    
    # Test frontend
    cd frontend
    if npm run type-check &> /dev/null; then
        print_success "Frontend: Vérification TypeScript réussie ✓"
    else
        print_warning "Frontend: Problème TypeScript (vérifiez les dépendances)"
    fi
    cd ..
}

# Afficher les instructions d'utilisation
show_usage_instructions() {
    echo ""
    echo "🎉 Configuration terminée !"
    echo "=========================="
    echo ""
    echo "📋 Prochaines étapes :"
    echo ""
    echo "1. Configurez vos variables d'environnement :"
    echo "   - contracts-backend/.env"
    echo "   - frontend/.env.local"
    echo ""
    echo "2. Pour utiliser le backend :"
    echo "   cd contracts-backend"
    echo "   npm run compile"
    echo "   npm test"
    echo "   npm run node"
    echo ""
    echo "3. Pour utiliser le frontend :"
    echo "   cd frontend"
    echo "   npm run dev"
    echo ""
    echo "4. Pour utiliser les deux ensemble :"
    echo "   # Terminal 1: Backend"
    echo "   cd contracts-backend && npm run node"
    echo ""
    echo "   # Terminal 2: Frontend"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "📚 Documentation :"
    echo "   - Backend: contracts-backend/README.md"
    echo "   - Frontend: frontend/README.md"
    echo "   - Migration: MIGRATION_INDEPENDANCE.md"
    echo ""
    echo "🔗 Les projets sont maintenant complètement indépendants !"
}

# Fonction principale
main() {
    echo "🦁 ChiliRoar - Configuration de l'Indépendance"
    echo "=============================================="
    echo ""
    
    check_prerequisites
    install_backend
    install_frontend
    setup_environment
    test_installations
    show_usage_instructions
}

# Exécuter le script principal
main "$@" 