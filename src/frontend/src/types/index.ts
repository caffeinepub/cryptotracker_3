export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  total_volume: number;
  circulating_supply: number;
  sparkline_in_7d?: { price: number[] };
}

export interface HoldingWithMarket {
  coinId: string;
  quantity: number;
  costBasis: number;
  totalCost: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  coin?: CoinMarket;
}

export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export interface Portfolio {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
  holdings: HoldingWithMarket[];
}

export type TabKey = "portfolio" | "market" | "watchlist";
