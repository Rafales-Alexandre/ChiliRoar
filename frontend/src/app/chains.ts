// Configuration des chaînes Chiliz pour ChiliRoar
// Compatible avec Wagmi et WalletConnect

import { Chain } from 'wagmi'

// Icônes des chaînes
const chilizIcon = 'https://chiliz.com/favicon.ico'

// Configuration Chiliz Testnet
export const chilizTestnet: Chain = {
  id: 88882,
  name: 'Chiliz Testnet',
  network: 'chiliz_testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Chiliz',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.chiliz.com'],
    },
    public: {
      http: ['https://testnet-rpc.chiliz.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliscan Testnet',
      url: 'https://testnet.chiliscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  testnet: true,
  iconUrl: chilizIcon,
}

// Configuration Chiliz Mainnet
export const chilizMainnet: Chain = {
  id: 88888,
  name: 'Chiliz Mainnet',
  network: 'chiliz_mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Chiliz',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.chiliz.com'],
    },
    public: {
      http: ['https://rpc.chiliz.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliscan',
      url: 'https://chiliscan.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1,
    },
  },
  testnet: false,
  iconUrl: chilizIcon,
}

// Configuration pour WalletConnect
export const walletConnectChains = [
  {
    id: 88882,
    name: 'Chiliz Testnet',
    network: 'chiliz_testnet',
    rpcUrls: {
      default: 'https://testnet-rpc.chiliz.com',
    },
    blockExplorers: {
      default: {
        name: 'Chiliscan Testnet',
        url: 'https://testnet.chiliscan.com',
      },
    },
    nativeCurrency: {
      name: 'Chiliz',
      symbol: 'CHZ',
      decimals: 18,
    },
  },
  {
    id: 88888,
    name: 'Chiliz Mainnet',
    network: 'chiliz_mainnet',
    rpcUrls: {
      default: 'https://rpc.chiliz.com',
    },
    blockExplorers: {
      default: {
        name: 'Chiliscan',
        url: 'https://chiliscan.com',
      },
    },
    nativeCurrency: {
      name: 'Chiliz',
      symbol: 'CHZ',
      decimals: 18,
    },
  },
]

// Configuration pour MetaMask et autres wallets
export const chainConfig = {
  testnet: {
    chainId: '0x15B42', // 88882 en hex
    chainName: 'Chiliz Testnet',
    nativeCurrency: {
      name: 'Chiliz',
      symbol: 'CHZ',
      decimals: 18,
    },
    rpcUrls: ['https://testnet-rpc.chiliz.com'],
    blockExplorerUrls: ['https://testnet.chiliscan.com'],
  },
  mainnet: {
    chainId: '0x15B48', // 88888 en hex
    chainName: 'Chiliz Mainnet',
    nativeCurrency: {
      name: 'Chiliz',
      symbol: 'CHZ',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.chiliz.com'],
    blockExplorerUrls: ['https://chiliscan.com'],
  },
}

// Fonction pour ajouter Chiliz Testnet à MetaMask
export const addChilizTestnetToMetaMask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfig.testnet],
      })
      return true
    } catch (error) {
      console.error('Erreur lors de l\'ajout de Chiliz Testnet:', error)
      return false
    }
  }
  return false
}

// Fonction pour ajouter Chiliz Mainnet à MetaMask
export const addChilizMainnetToMetaMask = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainConfig.mainnet],
      })
      return true
    } catch (error) {
      console.error('Erreur lors de l\'ajout de Chiliz Mainnet:', error)
      return false
    }
  }
  return false
}

// Fonction pour basculer vers Chiliz Testnet
export const switchToChilizTestnet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.testnet.chainId }],
      })
      return true
    } catch (error: any) {
      if (error.code === 4902) {
        // La chaîne n'est pas ajoutée, l'ajouter
        return await addChilizTestnetToMetaMask()
      }
      console.error('Erreur lors du basculement vers Chiliz Testnet:', error)
      return false
    }
  }
  return false
}

// Fonction pour basculer vers Chiliz Mainnet
export const switchToChilizMainnet = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainConfig.mainnet.chainId }],
      })
      return true
    } catch (error: any) {
      if (error.code === 4902) {
        // La chaîne n'est pas ajoutée, l'ajouter
        return await addChilizMainnetToMetaMask()
      }
      console.error('Erreur lors du basculement vers Chiliz Mainnet:', error)
      return false
    }
  }
  return false
}

// Fonction pour obtenir la configuration de chaîne par ID
export const getChainConfig = (chainId: number) => {
  switch (chainId) {
    case 88882:
      return chilizTestnet
    case 88888:
      return chilizMainnet
    default:
      return null
  }
}

// Fonction pour vérifier si une chaîne est supportée
export const isSupportedChain = (chainId: number) => {
  return chainId === 88882 || chainId === 88888
}

// Fonction pour obtenir l'URL du block explorer
export const getBlockExplorerUrl = (chainId: number, address?: string, txHash?: string) => {
  const baseUrl = chainId === 88882 
    ? 'https://testnet.chiliscan.com' 
    : 'https://chiliscan.com'
  
  if (txHash) {
    return `${baseUrl}/tx/${txHash}`
  }
  
  if (address) {
    return `${baseUrl}/address/${address}`
  }
  
  return baseUrl
}

export default {
  chilizTestnet,
  chilizMainnet,
  walletConnectChains,
  chainConfig,
  addChilizTestnetToMetaMask,
  addChilizMainnetToMetaMask,
  switchToChilizTestnet,
  switchToChilizMainnet,
  getChainConfig,
  isSupportedChain,
  getBlockExplorerUrl,
} 