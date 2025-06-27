# 🔄 Script de Configuration pour l'Indépendance des Projets ChiliRoar (PowerShell)
# Ce script facilite la configuration des deux projets indépendants sur Windows

param(
    [switch]$SkipTests
)

# Fonction pour afficher les messages avec couleurs
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Vérifier les prérequis
function Test-Prerequisites {
    Write-Status "Vérification des prérequis..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-Success "Node.js trouvé: $nodeVersion"
    }
    catch {
        Write-Error "Node.js n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    }
    
    # Vérifier npm
    try {
        $npmVersion = npm --version
        Write-Success "npm trouvé: $npmVersion"
    }
    catch {
        Write-Error "npm n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    }
    
    # Vérifier la version de Node.js
    $nodeMajorVersion = (node --version).Split('.')[0].TrimStart('v')
    if ([int]$nodeMajorVersion -lt 18) {
        Write-Error "Node.js version 18 ou supérieure est requise. Version actuelle: $(node --version)"
        exit 1
    }
    
    Write-Success "Prérequis vérifiés ✓"
}

# Installer les dépendances du backend
function Install-Backend {
    Write-Status "Installation des dépendances du backend..."
    
    if (-not (Test-Path "contracts-backend")) {
        Write-Error "Le dossier contracts-backend n'existe pas."
        exit 1
    }
    
    Set-Location "contracts-backend"
    
    if (Test-Path "package.json") {
        npm install
        Write-Success "Dépendances backend installées ✓"
    }
    else {
        Write-Error "package.json manquant dans contracts-backend"
        exit 1
    }
    
    Set-Location ".."
}

# Installer les dépendances du frontend
function Install-Frontend {
    Write-Status "Installation des dépendances du frontend..."
    
    if (-not (Test-Path "frontend")) {
        Write-Error "Le dossier frontend n'existe pas."
        exit 1
    }
    
    Set-Location "frontend"
    
    if (Test-Path "package.json") {
        npm install
        Write-Success "Dépendances frontend installées ✓"
    }
    else {
        Write-Error "package.json manquant dans frontend"
        exit 1
    }
    
    Set-Location ".."
}

# Créer les fichiers d'environnement
function Setup-Environment {
    Write-Status "Configuration des fichiers d'environnement..."
    
    # Backend .env
    if (-not (Test-Path "contracts-backend/.env")) {
        $backendEnv = @"
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
"@
        $backendEnv | Out-File -FilePath "contracts-backend/.env" -Encoding UTF8
        Write-Success "Fichier .env créé pour le backend ✓"
    }
    else {
        Write-Warning "Fichier .env existe déjà dans contracts-backend"
    }
    
    # Frontend .env.local
    if (-not (Test-Path "frontend/.env.local")) {
        $frontendEnv = @"
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
"@
        $frontendEnv | Out-File -FilePath "frontend/.env.local" -Encoding UTF8
        Write-Success "Fichier .env.local créé pour le frontend ✓"
    }
    else {
        Write-Warning "Fichier .env.local existe déjà dans frontend"
    }
}

# Tester les installations
function Test-Installations {
    if ($SkipTests) {
        Write-Warning "Tests ignorés (paramètre -SkipTests)"
        return
    }
    
    Write-Status "Test des installations..."
    
    # Test backend
    Set-Location "contracts-backend"
    try {
        npm run compile 2>$null
        Write-Success "Backend: Compilation réussie ✓"
    }
    catch {
        Write-Warning "Backend: Problème de compilation (vérifiez les dépendances)"
    }
    Set-Location ".."
    
    # Test frontend
    Set-Location "frontend"
    try {
        npm run type-check 2>$null
        Write-Success "Frontend: Vérification TypeScript réussie ✓"
    }
    catch {
        Write-Warning "Frontend: Problème TypeScript (vérifiez les dépendances)"
    }
    Set-Location ".."
}

# Afficher les instructions d'utilisation
function Show-UsageInstructions {
    Write-Host ""
    Write-Host "🎉 Configuration terminée !" -ForegroundColor Green
    Write-Host "==========================" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes :"
    Write-Host ""
    Write-Host "1. Configurez vos variables d'environnement :"
    Write-Host "   - contracts-backend/.env"
    Write-Host "   - frontend/.env.local"
    Write-Host ""
    Write-Host "2. Pour utiliser le backend :"
    Write-Host "   cd contracts-backend"
    Write-Host "   npm run compile"
    Write-Host "   npm test"
    Write-Host "   npm run node"
    Write-Host ""
    Write-Host "3. Pour utiliser le frontend :"
    Write-Host "   cd frontend"
    Write-Host "   npm run dev"
    Write-Host ""
    Write-Host "4. Pour utiliser les deux ensemble :"
    Write-Host "   # Terminal 1: Backend"
    Write-Host "   cd contracts-backend && npm run node"
    Write-Host ""
    Write-Host "   # Terminal 2: Frontend"
    Write-Host "   cd frontend && npm run dev"
    Write-Host ""
    Write-Host "📚 Documentation :"
    Write-Host "   - Backend: contracts-backend/README.md"
    Write-Host "   - Frontend: frontend/README.md"
    Write-Host "   - Migration: MIGRATION_INDEPENDANCE.md"
    Write-Host ""
    Write-Host "🔗 Les projets sont maintenant complètement indépendants !" -ForegroundColor Green
}

# Fonction principale
function Main {
    Write-Host "🦁 ChiliRoar - Configuration de l'Indépendance" -ForegroundColor Cyan
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-Prerequisites
    Install-Backend
    Install-Frontend
    Setup-Environment
    Test-Installations
    Show-UsageInstructions
}

# Exécuter le script principal
Main 