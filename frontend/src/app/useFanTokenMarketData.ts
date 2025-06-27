"use client"
import { useEffect, useState } from 'react';

// Types pour les FanTokens
export type FanTokenMarketData = {
  price?: number;
  change24h?: number;
};

export type FanTokenMarketDataMap = Record<string, FanTokenMarketData>;

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

export function useFanTokenMarketData(tickers: string[]) {
  const [data, setData] = useState<FanTokenMarketDataMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Vérification côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Ne pas exécuter si on n'est pas côté client ou si pas de tickers
    if (!isClient || tickers.length === 0) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convertir les tickers en IDs CoinGecko
        const coinIds = tickers
          .map(ticker => coingeckoMap[ticker])
          .filter(Boolean)
          .join(',');

        if (!coinIds) {
          setLoading(false);
          return;
        }

        // Ajouter un délai pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Utiliser le proxy local au lieu de l'API directe
        const response = await fetch(
          `/api/coingecko/coins/markets?vs_currency=usd&ids=${coinIds}`,
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit atteint. Veuillez réessayer plus tard.');
          }
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

        setData(marketData);
      } catch (err) {
        console.error('Erreur lors de la récupération des données de marché:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Utiliser des données de fallback en cas d'erreur
        const fallbackData: FanTokenMarketDataMap = {};
        tickers.forEach(ticker => {
          fallbackData[ticker] = {
            price: Math.random() * 10 + 0.1, // Prix aléatoire entre 0.1 et 10
            change24h: (Math.random() - 0.5) * 20, // Variation aléatoire entre -10% et +10%
          };
        });
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient, tickers.join(',')]); // Dépendance basée sur isClient et les tickers

  return { data, loading, error };
} 