// Configuration des FanTokens pour ChiliRoar
// Liste complète des FanTokens disponibles sur Chiliz

export interface FanToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  category: 'football' | 'esports' | 'f1' | 'other';
  country?: string;
  league?: string;
}

export const fanTokens: FanToken[] = [
  // Football Clubs
  {
    id: 'blockasset',
    name: 'Blockasset',
    ticker: 'BLOCK',
    price: 0.0807,
    category: 'other'
  },
  {
    id: 'argentina',
    name: 'Argentina Football Association',
    ticker: 'ARG',
    price: 0.751,
    category: 'football',
    country: 'Argentina'
  },
  {
    id: 'psg',
    name: 'Paris Saint‑Germain',
    ticker: 'PSG',
    price: 1.41,
    category: 'football',
    country: 'France',
    league: 'Ligue 1'
  },
  {
    id: 'barcelona',
    name: 'FC Barcelona',
    ticker: 'BAR',
    price: 1.03,
    category: 'football',
    country: 'Spain',
    league: 'La Liga'
  },
  {
    id: 'galatasaray',
    name: 'Galatasaray',
    ticker: 'GAL',
    price: 1.25,
    category: 'football',
    country: 'Turkey',
    league: 'Süper Lig'
  },
  {
    id: 'juventus',
    name: 'Juventus',
    ticker: 'JUV',
    price: 0.902,
    category: 'football',
    country: 'Italy',
    league: 'Serie A'
  },
  {
    id: 'manchester-city',
    name: 'Manchester City',
    ticker: 'CITY',
    price: 0.875,
    category: 'football',
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'atletico-madrid',
    name: 'Atlético Madrid',
    ticker: 'ATM',
    price: 0.995,
    category: 'football',
    country: 'Spain',
    league: 'La Liga'
  },
  {
    id: 'ac-milan',
    name: 'AC Milan',
    ticker: 'ACM',
    price: 0.739,
    category: 'football',
    country: 'Italy',
    league: 'Serie A'
  },
  {
    id: 'og',
    name: 'OG (team e‑sports)',
    ticker: 'OG',
    price: 3.88,
    category: 'esports'
  },
  {
    id: 'as-roma',
    name: 'AS Roma',
    ticker: 'ASR',
    price: 2.44,
    category: 'football',
    country: 'Italy',
    league: 'Serie A'
  },
  {
    id: 'inter-milan',
    name: 'Inter Milan',
    ticker: 'INTER',
    price: 0.514,
    category: 'football',
    country: 'Italy',
    league: 'Serie A'
  },
  {
    id: 'tottenham',
    name: 'Tottenham Hotspur',
    ticker: 'SPURS',
    price: 0.450,
    category: 'football',
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'portugal',
    name: 'Portugal National Team',
    ticker: 'POR',
    price: 0.895,
    category: 'football',
    country: 'Portugal'
  },
  {
    id: 'trabzonspor',
    name: 'Trabzonspor',
    ticker: 'TRA',
    price: 0.436,
    category: 'football',
    country: 'Turkey',
    league: 'Süper Lig'
  },
  {
    id: 'arsenal',
    name: 'Arsenal',
    ticker: 'AFC',
    price: 0.333,
    category: 'football',
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'napoli',
    name: 'Napoli',
    ticker: 'NAP',
    price: 0.614,
    category: 'football',
    country: 'Italy',
    league: 'Serie A'
  },
  {
    id: 'flamengo',
    name: 'Flamengo',
    ticker: 'MENGO',
    price: 0.106,
    category: 'football',
    country: 'Brazil',
    league: 'Brasileirão'
  },
  {
    id: 'italy',
    name: 'Italian National Football Team',
    ticker: 'ITA',
    price: 0.292,
    category: 'football',
    country: 'Italy'
  },
  {
    id: 'everton',
    name: 'Everton',
    ticker: 'EFC',
    price: 0.148,
    category: 'football',
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin Cognizant F1 Team',
    ticker: 'AM',
    price: 0.174,
    category: 'f1'
  },
  {
    id: 'alfa-romeo',
    name: 'Alfa Romeo Racing ORLEN',
    ticker: 'SAUBER',
    price: 0.172,
    category: 'f1'
  },
  {
    id: 'as-monaco',
    name: 'AS Monaco',
    ticker: 'ASM',
    price: 0.200,
    category: 'football',
    country: 'France',
    league: 'Ligue 1'
  },
  {
    id: 'aston-villa',
    name: 'Aston Villa',
    ticker: 'AVL',
    price: 0.122,
    category: 'football',
    country: 'England',
    league: 'Premier League'
  },
  {
    id: 'corinthians',
    name: 'S.C. Corinthians',
    ticker: 'SCCP',
    price: 0.0329,
    category: 'football',
    country: 'Brazil',
    league: 'Brasileirão'
  },
  {
    id: 'leeds-united',
    name: 'Leeds United',
    ticker: 'LUFC',
    price: 0.0321,
    category: 'football',
    country: 'England',
    league: 'Championship'
  },
  {
    id: 'istanbul-basaksehir',
    name: 'Istanbul Başakşehir',
    ticker: 'IBFK',
    price: 0.0562,
    category: 'football',
    country: 'Turkey',
    league: 'Süper Lig'
  },
  {
    id: 'alanyaspor',
    name: 'Alanyaspor',
    ticker: 'ALA',
    price: 0.0345,
    category: 'football',
    country: 'Turkey',
    league: 'Süper Lig'
  },
  {
    id: 'atletico-mineiro',
    name: 'Clube Atlético Mineiro',
    ticker: 'GALO',
    price: 0.0312,
    category: 'football',
    country: 'Brazil',
    league: 'Brasileirão'
  },
  {
    id: 'goztepe',
    name: 'Göztepe S.K.',
    ticker: 'GOZ',
    price: 0.171,
    category: 'football',
    country: 'Turkey',
    league: 'TFF 1. Lig'
  },
  {
    id: 'mibr',
    name: 'MIBR',
    ticker: 'MIBR',
    price: 0, // N/A
    category: 'esports'
  },
  {
    id: 'sao-paulo',
    name: 'São Paulo FC',
    ticker: 'SPFC',
    price: 0.0257,
    category: 'football',
    country: 'Brazil',
    league: 'Brasileirão'
  },
  {
    id: 'kayen',
    name: 'KAYEN Protocol',
    ticker: 'KAYEN',
    price: 0.005,
    category: 'other'
  }
];

// Fonctions utilitaires pour les FanTokens
export const getFanTokenByTicker = (ticker: string): FanToken | undefined => {
  return fanTokens.find(token => token.ticker === ticker.toUpperCase());
};

export const getFanTokenById = (id: string): FanToken | undefined => {
  return fanTokens.find(token => token.id === id);
};

export const getFanTokensByCategory = (category: FanToken['category']): FanToken[] => {
  return fanTokens.filter(token => token.category === category);
};

export const getFanTokensByCountry = (country: string): FanToken[] => {
  return fanTokens.filter(token => token.country === country);
};

export const getFanTokensByLeague = (league: string): FanToken[] => {
  return fanTokens.filter(token => token.league === league);
};

export const getTopFanTokens = (limit: number = 10): FanToken[] => {
  return fanTokens
    .filter(token => token.price > 0) // Exclure les tokens avec prix N/A
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);
};

export const getTotalMarketCap = (): number => {
  return fanTokens
    .filter(token => token.price > 0)
    .reduce((total, token) => total + token.price, 0);
};

export default fanTokens; 