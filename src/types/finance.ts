export interface CurrencyItem {
  id: string;
  code: string;
  name: string;
  country: string;
  flag: string;
  flagSecondary?: string;
  usdRate: number; // 1 unit in USD
  buyRate: number;
  sellRate: number;
  officialRate?: number;
  changePct: number;
  marketNote: string;
  badge?: string;
  badgeType?: 'primary' | 'secondary' | 'error' | 'warning';
  category: ('arab' | 'major' | 'asia' | 'europe-americas' | 'metals')[];
  searchKeywords: string;
}

export interface MacroIndicator {
  id: string;
  title: string;
  symbol: string;
  countryOrOrg: string;
  value: string;
  subValue?: string;
  changeText: string;
  changePct: number;
  isPositive?: boolean;
  statusText?: string;
  progressPct?: number;
  category: 'us' | 'eu' | 'asia' | 'mena' | 'all';
}

export interface MarketTickerItem {
  id: string;
  name: string;
  code: string;
  location: string;
  value: number;
  prefix?: string;
  suffix?: string;
  changePct: number;
  changeAbsolute?: number;
  decimals: number;
  iconName: string;
  badgeText?: string;
  category: 'us' | 'eu' | 'asia' | 'mena' | 'all';
}

export interface EconomicEvent {
  id: string;
  title: string;
  description: string;
  timeGMT: string;
  impact: 'high' | 'medium' | 'low';
  previousValue: string;
  estimatedValue: string;
  isToday?: boolean;
  isNextWeek?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent?: string[];
  imageUrl: string;
  categoryTag: string;
  categoryFilter: 'all' | 'central-banks' | 'gold-metals' | 'oil-energy' | 'forex' | 'imf-reports' | 'breaking';
  sourceName: string;
  timeAgo: string;
  readTime: string;
  isBreaking?: boolean;
  viewsCount?: string;
  isSaved?: boolean;
}

export interface PriceAlert {
  id: string;
  currencyCode: string;
  currencyName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  isActive: boolean;
}

export interface BankRate {
  id: string;
  bankName: string;
  bankCode: string;
  category: 'iraq-banks' | 'iraq-bourses' | 'arab-banks';
  currencyPair: string;
  flag: string;
  buyRate: number;
  sellRate: number;
  officialRate?: number;
  spread: number;
  status: 'open' | 'closed' | 'volatile';
  statusText: string;
  lastUpdated: string;
  isBestBuy?: boolean;
  isBestSell?: boolean;
  feeNote?: string;
  branchLocation: string;
  changePct: number;
}
