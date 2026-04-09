import { LogOut, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useRef } from "react";
import {
  useCurrentPrices,
  useFearGreedIndex,
  useHoldings,
  useTopCoins,
} from "../hooks/use-portfolio";
import {
  buildPortfolio,
  formatPercent,
  formatUSD,
} from "../lib/backend-client";
import { cn } from "../lib/utils";

interface DashboardHeaderProps {
  onLogout: () => void;
  onAdd: () => void;
}

export function DashboardHeader({ onLogout, onAdd }: DashboardHeaderProps) {
  const { data: holdings = [], isLoading: holdingsLoading } = useHoldings();
  const { data: topCoins = [] } = useTopCoins();
  const coinIds = useMemo(() => holdings.map((h) => h.coinId), [holdings]);
  const { data: prices = {} } = useCurrentPrices(coinIds);
  const { data: fearGreed } = useFearGreedIndex();
  const prevValueRef = useRef<number | null>(null);

  const portfolio = useMemo(
    () => buildPortfolio(holdings, topCoins, prices),
    [holdings, topCoins, prices],
  );

  const isPositive = portfolio.totalPnl >= 0;
  const prevValue = prevValueRef.current;
  const flashClass =
    prevValue !== null && prevValue !== portfolio.totalValue
      ? portfolio.totalValue > prevValue
        ? "price-flash-gain"
        : "price-flash-loss"
      : "";
  prevValueRef.current = portfolio.totalValue;

  const fearGreedValue = fearGreed ? Number(fearGreed.value) : null;
  const fearGreedColor =
    fearGreedValue !== null
      ? fearGreedValue <= 25
        ? "text-accent"
        : fearGreedValue <= 45
          ? "text-orange-400"
          : fearGreedValue <= 55
            ? "text-foreground"
            : "text-primary"
      : "text-muted-foreground";

  return (
    <header
      data-ocid="portfolio-header"
      className="sticky top-0 z-40 glass-header"
      style={{
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="px-4 pt-safe-top pt-4 pb-3 space-y-2 max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
            Portfolio Value
          </span>
          <div className="flex items-center gap-3">
            {fearGreed && fearGreedValue !== null && (
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
                  Sentiment
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] font-medium tracking-widest uppercase animate-pulse-soft",
                    fearGreedColor,
                  )}
                >
                  {fearGreed.value_classification.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {fearGreed.value}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={onLogout}
              data-ocid="logout-btn"
              className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Balance */}
        {holdingsLoading ? (
          <div className="space-y-2 py-1">
            <div className="h-9 w-52 bg-muted/30 rounded animate-pulse" />
            <div className="h-4 w-36 bg-muted/20 rounded animate-pulse" />
          </div>
        ) : (
          <motion.div
            key={Math.round(portfolio.totalValue)}
            initial={{ opacity: 0.8, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, type: "spring", stiffness: 400 }}
            className={cn("space-y-1 rounded", flashClass)}
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[2.6rem] leading-none font-mono font-bold tracking-tight text-foreground tabular-nums">
                {formatUSD(portfolio.totalValue)}
              </span>
            </div>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-mono font-medium animate-pulse-soft",
                isPositive
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-accent/30 bg-accent/10 text-accent",
              )}
              data-ocid="pnl-badge"
            >
              {isPositive ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              <span>
                {formatUSD(Math.abs(portfolio.totalPnl))}&nbsp;(
                {formatPercent(portfolio.totalPnlPercent)})
              </span>
              <span className="text-[9px] opacity-60 tracking-widest uppercase ml-0.5">
                all time
              </span>
            </div>
          </motion.div>
        )}

        {/* Add position CTA */}
        <button
          type="button"
          onClick={onAdd}
          data-ocid="add-holding-btn"
          className="flex items-center gap-1.5 text-primary font-mono text-xs tracking-wider uppercase hover:text-primary/80 transition-smooth min-h-[44px] py-2"
          aria-label="Add holding"
        >
          <Plus size={12} />
          Add Position
        </button>
      </div>
    </header>
  );
}
