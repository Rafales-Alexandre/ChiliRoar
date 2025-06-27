"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HistoryPeriod } from '../types';

// Types pour les données des FanTokens
export type FanTokenMarketData = {
  price?: number;
  change24h?: number;
};

export type FanTokenMarketDataMap = Record<string, FanTokenMarketData>;
export type FanTokenHistory = number[];
export type FanTokenHistoryMap = Record<string, FanTokenHistory>;

// Mapping entre le ticker et l'id CoinGecko
const coingeckoMap: Record<string, string> = {
  PSG: 'paris-saint-germain-fan-token',
  BAR: 'fc-barcelona-fan-token',
  GAL: 'galatasaray-fan-token',
  JUV: 'juventus-fan-token',
  CITY: 'manchester-city-fan-token',
  ATM: 'atletico-madrid-fan-token',
  ACM: 'ac-milan-fan-token',
  ASR: 'as-roma-fan-token',
  INTER: 'inter-milan-fan-token',
  SPURS: 'tottenham-hotspur-fan-token',
  POR: 'portugal-national-team-fan-token',
  TRA: 'trabzonspor-fan-token',
  AFC: 'arsenal-fan-token',
  NAP: 'ssc-napoli-fan-token',
  MENGO: 'flamengo-fan-token',
  ITA: 'italy-national-football-team-fan-token',
  EFC: 'everton-fan-token',
  ASM: 'as-monaco-fan-token',
  AVL: 'aston-villa-fan-token',
  SCCP: 'corinthians-fan-token',
  LUFC: 'leeds-united-fan-token',
  IBFK: 'istanbul-basaksehir-fan-token',
  ALA: 'alanyaspor-fan-token',
  GALO: 'atletico-mineiro-fan-token',
  GOZ: 'goztepe-s-k-fan-token',
  SPFC: 'sao-paulo-fc-fan-token',
  OG: 'og-fan-token',
};

// Cache global
let marketDataCache: FanTokenMarketDataMap = {};
let historyCache: Record<string, FanTokenHistoryMap> = {};
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getDays(period: HistoryPeriod): number {
  switch (period) {
    case '24h': return 1;
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
    case '180d': return 180;
    case '1y': return 365;
    default: return 7;
  }
}

// Fonction pour générer des données de fallback
function generateFallbackMarketData(tickers: string[]): FanTokenMarketDataMap {
  const fallbackData: FanTokenMarketDataMap = {};
  tickers.forEach(ticker => {
    fallbackData[ticker] = {
      price: Math.random() * 10 + 0.1,
      change24h: (Math.random() - 0.5) * 20,
    };
  });
  return fallbackData;
}

function generateFallbackHistoryData(tickers: string[], period: HistoryPeriod): FanTokenHistoryMap {
  const days = getDays(period);
  const points = Math.min(days * 24, 168); // Max 168 points (7 jours * 24h)
  
  const fallbackData: FanTokenHistoryMap = {};
  tickers.forEach(ticker => {
    fallbackData[ticker] = Array.from({ length: points }, () => 
      Math.random() * 10 + 0.1
    );
  });
  return fallbackData;
}

// Fonction pour récupérer les données de marché
async function fetchMarketData(tickers: string[]): Promise<FanTokenMarketDataMap> {
  try {
    // Convertir les tickers en IDs CoinGecko
    const coinIds = tickers
      .map(ticker => coingeckoMap[ticker])
      .filter(Boolean)
      .join(',');

    if (!coinIds) {
      return generateFallbackMarketData(tickers);
    }

    const response = await fetch(
      `/api/coingecko/coins/markets?vs_currency=usd&ids=${coinIds}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const coins = await response.json();
    
    const marketData: FanTokenMarketDataMap = {};
    
    coins.forEach((coin: any) => {
      const ticker = Object.keys(coingeckoMap).find(
        key => coingeckoMap[key] === coin.id
      );
      
      if (ticker) {
        marketData[ticker] = {
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
        };
      }
    });

    return marketData;
  } catch (error) {
    console.error('Erreur lors de la récupération des données de marché:', error);
    return generateFallbackMarketData(tickers);
  }
}

// Fonction pour récupérer l'historique
async function fetchHistoryData(tickers: string[], period: HistoryPeriod): Promise<FanTokenHistoryMap> {
  try {
    const days = getDays(period);
    const historyData: FanTokenHistoryMap = {};

    // Traiter les tickers par petits groupes pour éviter le rate limiting
    const batchSize = 2;
    for (let i = 0; i < tickers.length; i += batchSize) {
      const batch = tickers.slice(i, i + batchSize);
      
      // Attendre entre chaque batch
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await Promise.all(
        batch.map(async (ticker) => {
          const coinId = coingeckoMap[ticker];
          if (!coinId) return;

          try {
            // Délai entre chaque requête
            await new Promise(resolve => setTimeout(resolve, 500));

            const response = await fetch(
              `/api/coingecko/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`,
              {
                headers: {
                  'Accept': 'application/json',
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Erreur API: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.prices && Array.isArray(result.prices)) {
              const prices = result.prices.map((priceData: [number, number]) => priceData[1]);
              historyData[ticker] = prices;
            }
          } catch (err) {
            console.error(`Erreur pour ${ticker}:`, err);
            // Générer des données de fallback pour ce token
            const points = Math.min(days * 24, 168);
            historyData[ticker] = Array.from({ length: points }, () => 
              Math.random() * 10 + 0.1
            );
          }
        })
      );
    }

    return historyData;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return generateFallbackHistoryData(tickers, period);
  }
}

// Interface du contexte
interface FanTokenDataContextType {
  marketData: FanTokenMarketDataMap;
  historyData: FanTokenHistoryMap;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  getHistoryData: (period: HistoryPeriod) => FanTokenHistoryMap;
}

const FanTokenDataContext = createContext<FanTokenDataContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export function useFanTokenData() {
  const context = useContext(FanTokenDataContext);
  if (context === undefined) {
    throw new Error('useFanTokenData must be used within a FanTokenDataProvider');
  }
  return context;
}

// Provider du contexte
interface FanTokenDataProviderProps {
  children: ReactNode;
  tickers: string[];
}

export function FanTokenDataProvider({ children, tickers }: FanTokenDataProviderProps) {
  const [marketData, setMarketData] = useState<FanTokenMarketDataMap>({});
  const [historyData, setHistoryData] = useState<FanTokenHistoryMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<HistoryPeriod>('24h');

  // Fonction pour rafraîchir les données
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier si le cache est encore valide
      const now = Date.now();
      if (now - lastFetchTime < CACHE_DURATION && Object.keys(marketDataCache).length > 0) {
        setMarketData(marketDataCache);
        setHistoryData(historyCache[currentPeriod] || {});
        setLoading(false);
        return;
      }

      // Récupérer les nouvelles données
      const [newMarketData, newHistoryData] = await Promise.all([
        fetchMarketData(tickers),
        fetchHistoryData(tickers, currentPeriod)
      ]);

      // Mettre à jour le cache
      marketDataCache = newMarketData;
      historyCache[currentPeriod] = newHistoryData;
      lastFetchTime = now;

      setMarketData(newMarketData);
      setHistoryData(newHistoryData);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir l'historique pour une période donnée
  const getHistoryData = (period: HistoryPeriod): FanTokenHistoryMap => {
    if (period !== currentPeriod) {
      // Si on demande une nouvelle période, on la récupère
      setCurrentPeriod(period);
      if (historyCache[period]) {
        setHistoryData(historyCache[period]);
      } else {
        // Récupérer les données pour cette période
        fetchHistoryData(tickers, period).then(data => {
          historyCache[period] = data;
          setHistoryData(data);
        });
      }
    }
    return historyCache[period] || {};
  };

  // Charger les données au montage du composant
  useEffect(() => {
    if (tickers.length > 0) {
      refreshData();
    }
  }, [tickers.join(',')]);

  const value: FanTokenDataContextType = {
    marketData,
    historyData,
    loading,
    error,
    refreshData,
    getHistoryData,
  };

  return (
    <FanTokenDataContext.Provider value={value}>
      {children}
    </FanTokenDataContext.Provider>
  );
} 