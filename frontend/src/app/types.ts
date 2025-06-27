// Types pour les FanTokens
export type FanTokenMarketData = {
  price?: number;
  change24h?: number;
};

export type FanTokenMarketDataMap = Record<string, FanTokenMarketData>;

export type FanTokenHistory = number[];
export type FanTokenHistoryMap = Record<string, FanTokenHistory>;

export type HistoryPeriod = '24h' | '7d' | '30d' | '90d' | '180d' | '1y'; 