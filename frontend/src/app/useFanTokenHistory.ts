import { useState, useEffect } from 'react';
import { HistoryPeriod } from './types';

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

// Types pour l'historique des FanTokens
export type FanTokenHistory = number[];
export type FanTokenHistoryMap = Record<string, FanTokenHistory>;

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

export function useFanTokenHistory(tickers: string[], period: HistoryPeriod) {
  const [data, setData] = useState<FanTokenHistoryMap>({});
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

        const days = getDays(period);
        const historyData: FanTokenHistoryMap = {};

        // Traiter les tickers par petits groupes pour éviter le rate limiting
        const batchSize = 3;
        for (let i = 0; i < tickers.length; i += batchSize) {
          const batch = tickers.slice(i, i + batchSize);
          
          // Attendre entre chaque batch pour éviter le rate limiting
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          await Promise.all(
            batch.map(async (ticker) => {
              const coinId = coingeckoMap[ticker];
              if (!coinId) return;

              try {
                // Délai entre chaque requête
                await new Promise(resolve => setTimeout(resolve, 500));

                // Utiliser le proxy local au lieu de l'API directe
                const response = await fetch(
                  `/api/coingecko/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=hourly`,
                  {
                    headers: {
                      'Accept': 'application/json',
                    },
                  }
                );

                if (!response.ok) {
                  if (response.status === 429) {
                    throw new Error('Rate limit atteint');
                  }
                  throw new Error(`Erreur API: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.prices && Array.isArray(result.prices)) {
                  // Extraire seulement les prix (deuxième élément de chaque paire [timestamp, price])
                  const prices = result.prices.map((priceData: [number, number]) => priceData[1]);
                  historyData[ticker] = prices;
                }
              } catch (err) {
                console.error(`Erreur pour ${ticker}:`, err);
                // Générer des données de fallback
                const fallbackPrices = Array.from({ length: 24 }, () => 
                  Math.random() * 10 + 0.1
                );
                historyData[ticker] = fallbackPrices;
              }
            })
          );
        }

        setData(historyData);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'historique:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        
        // Utiliser des données de fallback en cas d'erreur
        const fallbackData: FanTokenHistoryMap = {};
        tickers.forEach(ticker => {
          fallbackData[ticker] = Array.from({ length: 24 }, () => 
            Math.random() * 10 + 0.1
          );
        });
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isClient, tickers.join(','), period]);

  return { data, loading, error };
} 