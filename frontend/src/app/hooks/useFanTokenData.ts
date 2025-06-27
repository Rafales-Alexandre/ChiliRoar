"use client"
import { useFanTokenData } from '../contexts/FanTokenDataContext';
import { HistoryPeriod } from '../types';

// Hook pour les données de marché
export function useFanTokenMarketData(tickers: string[]) {
  const { marketData, loading, error } = useFanTokenData();
  
  // Filtrer les données pour les tickers demandés
  const filteredData = Object.keys(marketData)
    .filter(ticker => tickers.includes(ticker))
    .reduce((acc, ticker) => {
      acc[ticker] = marketData[ticker];
      return acc;
    }, {} as typeof marketData);

  return { data: filteredData, loading, error };
}

// Hook pour l'historique
export function useFanTokenHistory(tickers: string[], period: HistoryPeriod) {
  const { historyData, loading, error, getHistoryData } = useFanTokenData();
  
  // Obtenir les données pour la période demandée
  const currentHistoryData = getHistoryData(period);
  
  // Filtrer les données pour les tickers demandés
  const filteredData = Object.keys(currentHistoryData)
    .filter(ticker => tickers.includes(ticker))
    .reduce((acc, ticker) => {
      acc[ticker] = currentHistoryData[ticker];
      return acc;
    }, {} as typeof currentHistoryData);

  return { data: filteredData, loading, error };
}

// Hook pour les prix (alias pour les données de marché)
export function useFanTokenPrices(tickers: string[]) {
  return useFanTokenMarketData(tickers);
} 