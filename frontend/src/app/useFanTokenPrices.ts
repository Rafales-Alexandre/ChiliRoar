"use client"
import { useEffect, useState } from 'react';

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

export type FanTokenPrices = Record<string, number | undefined>;

export function useFanTokenPrices(tickers: string[]) {
  const [prices, setPrices] = useState<FanTokenPrices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = tickers
      .map(ticker => coingeckoMap[ticker])
      .filter(Boolean)
      .join(',');
    if (!ids) return;
    setLoading(true);
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
      .then(res => res.json())
      .then(data => {
        const result: FanTokenPrices = {};
        for (const [ticker, id] of Object.entries(coingeckoMap)) {
          if (tickers.includes(ticker) && data[id] && data[id].usd) {
            result[ticker] = data[id].usd;
          }
        }
        setPrices(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tickers.join(',')]);

  return { prices, loading };
} 