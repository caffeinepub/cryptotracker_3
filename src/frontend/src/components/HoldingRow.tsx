import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useRemoveHolding } from "../hooks/use-portfolio";
import { formatNumber, formatPercent, formatUSD } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { HoldingWithMarket } from "../types";
import { Sparkline } from "./Sparkline";

interface HoldingRowProps {
  holding: HoldingWithMarket;
  totalPortfolioValue: number;
  onClick: () => void;
}

export function HoldingRow({
  holding,
  totalPortfolioValue,
  onClick,
}: HoldingRowProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [priceFlash, setPriceFlash] = useState<"gain" | "loss" | null>(null);
  const remove = useRemoveHolding();
  const prevPriceRef = useRef<number>(holding.currentPrice);

  const isPos = holding.pnl >= 0;
  const allocationPct =
    totalPortfolioValue > 0
      ? (holding.currentValue / totalPortfolioValue) * 100
      : 0;

  const sparklineData = holding.coin?.sparkline_in_7d?.price ?? [];

  // Price flash animation on change
  useEffect(() => {
    const prev = prevPriceRef.current;
    if (holding.currentPrice !== prev && prev !== 0) {
      setPriceFlash(holding.currentPrice > prev ? "gain" : "loss");
      const t = setTimeout(() => setPriceFlash(null), 650);
      prevPriceRef.current = holding.currentPrice;
      return () => clearTimeout(t);
    }
    prevPriceRef.current = holding.currentPrice;
  }, [holding.currentPrice]);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    remove.mutate(holding.coinId);
    setShowDelete(false);
  };

  const handleDeleteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete((v) => !v);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete(false);
  };

  return (
    <div
      className={cn(
        "relative bg-card border border-border rounded-lg overflow-hidden transition-smooth cursor-pointer",
        "hover:border-primary/30 hover:bg-card/80 active:scale-[0.99]",
        remove.isPending && "opacity-40 pointer-events-none",
      )}
      onClick={onClick}
      data-ocid={`holding-row-${holding.coinId}`}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: row is visually interactive
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: needs nested buttons
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {priceFlash && (
          <motion.div
            key={priceFlash}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              "absolute inset-0 pointer-events-none rounded-lg",
              priceFlash === "gain" ? "bg-primary/20" : "bg-accent/20",
            )}
          />
        )}
      </AnimatePresence>

      <div className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          {/* Coin icon */}
          <div className="flex-shrink-0">
            {holding.coin?.image ? (
              <img
                src={holding.coin.image}
                alt={holding.coinId}
                className="w-9 h-9 rounded-full"
                loading="lazy"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-secondary border border-border flex items-center justify-center">
                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                  {holding.coinId.slice(0, 3)}
                </span>
              </div>
            )}
          </div>

          {/* Name + quantity */}
          <div className="flex flex-col min-w-0 w-[72px] flex-shrink-0">
            <span className="font-mono text-xs font-bold text-foreground uppercase truncate leading-tight">
              {holding.coin?.symbol ?? holding.coinId}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground truncate leading-tight mt-0.5">
              {formatNumber(holding.quantity, 4)}
            </span>
          </div>

          {/* Sparkline */}
          <div className="flex-1 min-w-0 flex items-center">
            <Sparkline data={sparklineData} height={34} />
          </div>

          {/* Price + change */}
          <div className="flex flex-col items-end flex-shrink-0 w-[80px]">
            <span
              className={cn(
                "font-mono text-xs font-bold tabular-nums",
                priceFlash === "gain"
                  ? "text-primary"
                  : priceFlash === "loss"
                    ? "text-accent"
                    : "text-foreground",
              )}
            >
              {formatUSD(holding.currentPrice)}
            </span>
            <span
              className={cn(
                "font-mono text-[9px] tabular-nums",
                (holding.coin?.price_change_percentage_24h ?? 0) >= 0
                  ? "text-primary"
                  : "text-accent",
              )}
            >
              {formatPercent(holding.coin?.price_change_percentage_24h ?? 0)}
            </span>
          </div>

          {/* Value + P&L */}
          <div className="flex flex-col items-end flex-shrink-0 w-[76px]">
            <span className="font-mono text-xs font-bold text-foreground tabular-nums">
              {formatUSD(holding.currentValue)}
            </span>
            <span
              className={cn(
                "font-mono text-[9px] tabular-nums",
                isPos ? "text-primary" : "text-accent",
              )}
            >
              {isPos ? "+" : ""}
              {formatPercent(holding.pnlPercent)}
            </span>
          </div>

          {/* Delete toggle */}
          <button
            type="button"
            onClick={handleDeleteToggle}
            className="flex-shrink-0 p-2 text-muted-foreground hover:text-accent transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={`Remove ${holding.coinId}`}
            data-ocid={`remove-holding-${holding.coinId}`}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Allocation bar */}
        <div className="mt-2.5 w-full bg-secondary/40 rounded-full h-[2px] overflow-hidden">
          <div
            className="h-full bg-primary/50 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, allocationPct)}%` }}
          />
        </div>

        {/* Confirm delete */}
        <AnimatePresence>
          {showDelete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-2 pt-2.5 border-t border-accent/25 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  Remove{" "}
                  <span className="text-foreground uppercase">
                    {holding.coin?.symbol ?? holding.coinId}
                  </span>{" "}
                  position?
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-smooth px-2.5 py-1.5 min-h-[32px] rounded border border-border/60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={remove.isPending}
                    className="font-mono text-[10px] text-accent hover:text-accent/80 transition-smooth px-2.5 py-1.5 min-h-[32px] border border-accent/40 rounded bg-accent/10"
                    data-ocid={`confirm-remove-${holding.coinId}`}
                  >
                    {remove.isPending ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
