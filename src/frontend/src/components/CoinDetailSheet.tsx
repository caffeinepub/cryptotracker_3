import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useCoinPriceHistory } from "../hooks/use-portfolio";
import { formatNumber, formatPercent, formatUSD } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { HoldingWithMarket } from "../types";
import { Sparkline } from "./Sparkline";

interface CoinDetailSheetProps {
  holding: HoldingWithMarket | null;
  open: boolean;
  onClose: () => void;
}

interface StatRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function StatRow({ label, value, valueClass }: StatRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-xs font-semibold tabular-nums",
          valueClass ?? "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function PriceHistorySparkline({ coinId }: { coinId: string }) {
  const { data: history = [], isLoading } = useCoinPriceHistory(coinId);
  const prices = history.map((point) => point[1] ?? 0);

  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (prices.length < 2) {
    return (
      <div className="h-24 flex items-center justify-center text-muted-foreground font-mono text-[10px]">
        No chart data
      </div>
    );
  }

  return <Sparkline data={prices} height={96} showTooltip />;
}

export function CoinDetailSheet({
  holding,
  open,
  onClose,
}: CoinDetailSheetProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isPos = (holding?.pnl ?? 0) >= 0;
  const is24hPos = (holding?.coin?.price_change_percentage_24h ?? 0) >= 0;
  const coinId = holding?.coinId ?? "";

  // Compute 24h high/low from sparkline (last ~24 data points from 7d)
  const sparkPrices = holding?.coin?.sparkline_in_7d?.price ?? [];
  const last24Prices = sparkPrices.slice(-24);
  const high24h = last24Prices.length ? Math.max(...last24Prices) : 0;
  const low24h = last24Prices.length ? Math.min(...last24Prices) : 0;

  return (
    <AnimatePresence>
      {open && holding && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl max-h-[88vh] flex flex-col max-w-2xl mx-auto"
            data-ocid={`coin-detail-sheet-${holding.coinId}`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted/80" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-3">
                {holding.coin?.image && (
                  <img
                    src={holding.coin.image}
                    alt={holding.coinId}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="font-mono text-base font-bold text-foreground uppercase tracking-wide">
                    {holding.coin?.symbol ?? holding.coinId}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {holding.coin?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-mono text-base font-bold text-foreground tabular-nums">
                    {formatUSD(holding.currentPrice)}
                  </p>
                  <p
                    className={cn(
                      "font-mono text-[10px] tabular-nums",
                      is24hPos ? "text-primary" : "text-accent",
                    )}
                  >
                    {formatPercent(
                      holding.coin?.price_change_percentage_24h ?? 0,
                    )}{" "}
                    24h
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close"
                  data-ocid="close-detail-sheet"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Price chart */}
              <div className="px-4 py-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
                    30-Day Price Chart
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9px] font-medium",
                      is24hPos ? "text-primary" : "text-accent",
                    )}
                  >
                    {is24hPos ? "▲" : "▼"}{" "}
                    {Math.abs(
                      holding.coin?.price_change_percentage_7d_in_currency ?? 0,
                    ).toFixed(2)}
                    % 7D
                  </span>
                </div>
                <PriceHistorySparkline coinId={coinId} />
              </div>

              {/* Stats */}
              <div className="px-4 py-2">
                <p className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-1 pt-2">
                  Market
                </p>
                <StatRow
                  label="Market Cap"
                  value={formatUSD(holding.coin?.market_cap ?? 0, true)}
                />
                <StatRow
                  label="24h Volume"
                  value={formatUSD(holding.coin?.total_volume ?? 0, true)}
                />
                <StatRow
                  label="24h High"
                  value={high24h ? formatUSD(high24h) : "—"}
                  valueClass="text-primary"
                />
                <StatRow
                  label="24h Low"
                  value={low24h ? formatUSD(low24h) : "—"}
                  valueClass="text-accent"
                />
                <StatRow
                  label="Rank"
                  value={
                    holding.coin?.market_cap_rank
                      ? `#${holding.coin.market_cap_rank}`
                      : "—"
                  }
                />
              </div>

              <div className="px-4 py-2 border-t border-border/40">
                <p className="font-mono text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-1 pt-2">
                  Your Position
                </p>
                <StatRow
                  label="Holdings"
                  value={`${formatNumber(holding.quantity, 6)} ${holding.coin?.symbol?.toUpperCase() ?? holding.coinId.toUpperCase()}`}
                />
                <StatRow
                  label="Current Value"
                  value={formatUSD(holding.currentValue)}
                />
                <StatRow
                  label="Cost Basis"
                  value={formatUSD(holding.costBasis)}
                />
                <StatRow
                  label="Total Cost"
                  value={formatUSD(holding.totalCost)}
                />
                <StatRow
                  label="Unrealized P&L"
                  value={`${isPos ? "+" : ""}${formatUSD(holding.pnl)} (${formatPercent(holding.pnlPercent)})`}
                  valueClass={isPos ? "text-primary" : "text-accent"}
                />
              </div>

              {/* Spacer for bottom safe area */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
