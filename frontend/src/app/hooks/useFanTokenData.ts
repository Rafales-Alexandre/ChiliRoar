"use client"
import { useFanTokenData } from '../contexts/FanTokenDataContext';
import { HistoryPeriod } from '../types';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    // Si erreur 429 ou 403, on ne retry pas automatiquement
    if (res.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (res.status === 403) {
      throw new Error('API access temporarily blocked. Please try again later.');
    }
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
});

// Mapping entre le ticker et l'id CoinGecko (repris du contexte)
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

// Helper pour obtenir le nombre de jours en fonction de la période
const getDays = (period: HistoryPeriod) => {
  switch (period) {
    case '1h':
      return 1;
    case '24h':
      return 1;
    case '7d':
      return 7;
    case '30d':
      return 30;
    case '90d':
      return 90;
    case '180d':
      return 180;
    case '1y':
      return 365;
    default:
      return 7; // Valeur par défaut
  }
};

// Configuration SWR optimisée pour éviter les erreurs 429
const swrConfig = {
  refreshInterval: 300000, // 5 minutes au lieu de 1 minute
  revalidateOnFocus: false, // Pas de refetch quand on revient sur l'onglet
  revalidateOnReconnect: false, // Pas de refetch automatique
  shouldRetryOnError: false, // Pas de retry automatique sur erreur
  dedupingInterval: 300000, // 5 minutes de cache
  errorRetryCount: 0, // Pas de retry
};

// Configuration SWR pour l'historique (cache plus long)
const historySwrConfig = {
  refreshInterval: 600000, // 10 minutes pour l'historique
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
  dedupingInterval: 600000, // 10 minutes de cache
  errorRetryCount: 0,
};

// Données statiques de fallback pour les courbes
const generateMockHistory = (period: HistoryPeriod): number[] => {
  const days = getDays(period);
  const points = Math.min(days * 24, 168); // Max 168 points (7 jours * 24h)
  
  // Génère une courbe réaliste avec variation
  const basePrice = 0.5 + Math.random() * 2; // Prix entre 0.5 et 2.5
  const history: number[] = [];
  
  for (let i = 0; i < points; i++) {
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    const price = basePrice * (1 + variation);
    history.push(Math.max(0.1, price)); // Prix minimum 0.1
  }
  
  return history;
};

// Hook unifié pour toutes les données de marché
export function useFanTokenMarketData(tickers: string[]) {
  // Génère la clé SWR en fonction des tickers demandés
  const coinIds = tickers.map(t => coingeckoMap[t]).filter(Boolean).join(',');
  const { data, error, isLoading } = useSWR(
    coinIds ? `/api/coingecko/coins/markets?vs_currency=usd&ids=${coinIds}` : null,
    fetcher,
    swrConfig
  );

  // Transforme la réponse en map ticker => data
  let filteredData = {};
  if (data && Array.isArray(data)) {
    filteredData = tickers.reduce((acc, ticker) => {
      const coinId = coingeckoMap[ticker];
      const coin = data.find((c: any) => c.id === coinId);
      acc[ticker] = coin
        ? {
            price: coin.current_price || 0,
            change24h: coin.price_change_percentage_24h || 0,
            marketCap: coin.market_cap || 0,
            volume24h: coin.total_volume || 0,
          }
        : {};
      return acc;
    }, {} as Record<string, any>);
  }

  return { data: filteredData, loading: isLoading, error };
}

// Hook optimisé pour l'historique - récupère les vraies données pour les 3 premiers tokens
export function useFanTokenHistory(token: string | undefined, period: HistoryPeriod) {
  const days = getDays(period);
  const coinId = token ? coingeckoMap[token] : undefined;
  
  // Vérifier si on a déjà une erreur 403/429 dans le cache local
  const errorKey = `chart_error_${coinId}_${period}`;
  const hasRecentError = typeof window !== 'undefined' && localStorage.getItem(errorKey);
  
  // Si on a une erreur récente (moins de 30 minutes), utiliser le fallback
  if (hasRecentError) {
    const errorTime = parseInt(hasRecentError);
    const timeSinceError = Date.now() - errorTime;
    if (timeSinceError < 30 * 60 * 1000) { // 30 minutes
      const history = generateMockHistory(period);
      return { 
        data: history, 
        loading: false, 
        error: null,
        isUsingFallback: true 
      };
    } else {
      // Nettoyer l'erreur expirée
      localStorage.removeItem(errorKey);
    }
  }

  const swrKey = coinId ? `/api/coingecko/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly` : null;

  const { data, error, isLoading } = useSWR(
    swrKey,
    fetcher,
    {
      refreshInterval: 0, // pas de refresh auto
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 15 * 60 * 1000, // 15 minutes de cache
      errorRetryCount: 0,
      onError: (err) => {
        // Si erreur 403/429, marquer dans le cache local pour éviter de réessayer
        if (err.message.includes('Rate limit') || err.message.includes('API access blocked')) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(errorKey, Date.now().toString());
          }
        }
      }
    }
  );

  let history: number[] = [];
  let isUsingFallback = false;

  if (data?.prices) {
    // Données réelles de l'API
    history = data.prices.map((p: [number, number]) => p[1]);
  } else if (error && (error.message.includes('Rate limit') || error.message.includes('API access blocked'))) {
    // Fallback : données statiques si API bloquée
    history = generateMockHistory(period);
    isUsingFallback = true;
  }

  return { 
    data: history, 
    loading: isLoading, 
    error: isUsingFallback ? null : error, // Pas d'erreur si on utilise le fallback
    isUsingFallback 
  };
}

// Hook pour les prix (alias pour les données de marché)
export function useFanTokenPrices(tickers: string[]) {
  return useFanTokenMarketData(tickers);
} 