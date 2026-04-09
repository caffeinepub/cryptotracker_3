import type { HoldingView } from "../backend";
import type { CoinMarket, HoldingWithMarket, Portfolio } from "../types";

export function formatUSD(value: number, compact = false): string {
  if (compact && Math.abs(value) >= 1_000_000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals = 4): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function buildPortfolio(
  holdings: HoldingView[],
  coins: CoinMarket[],
  prices: Record<string, { usd: number }>,
): Portfolio {
  const coinMap = new Map(coins.map((c) => [c.id, c]));

  const enriched: HoldingWithMarket[] = holdings.map((h) => {
    const priceData = prices[h.coinId];
    const currentPrice =
      priceData?.usd ?? coinMap.get(h.coinId)?.current_price ?? 0;
    const currentValue = h.quantity * currentPrice;
    const pnl = currentValue - h.totalCost;
    const pnlPercent = h.totalCost > 0 ? (pnl / h.totalCost) * 100 : 0;
    return {
      coinId: h.coinId,
      quantity: h.quantity,
      costBasis: h.costBasis,
      totalCost: h.totalCost,
      currentPrice,
      currentValue,
      pnl,
      pnlPercent,
      coin: coinMap.get(h.coinId),
    };
  });

  const totalValue = enriched.reduce((s, h) => s + h.currentValue, 0);
  const totalCost = enriched.reduce((s, h) => s + h.totalCost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalPnl,
    totalPnlPercent,
    holdings: enriched,
  };
}

export function getFearGreedColor(value: number): string {
  if (value <= 25) return "text-accent";
  if (value <= 45) return "text-warning";
  if (value <= 55) return "text-foreground";
  if (value <= 75) return "text-primary";
  return "text-primary";
}

export function getFearGreedLabel(classification: string): string {
  const map: Record<string, string> = {
    "Extreme Fear": "EXTREME FEAR",
    Fear: "FEAR",
    Neutral: "NEUTRAL",
    Greed: "GREED",
    "Extreme Greed": "EXTREME GREED",
  };
  return map[classification] ?? classification.toUpperCase();
}
