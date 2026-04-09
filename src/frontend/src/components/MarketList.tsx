import { motion } from "motion/react";
import type { CoinMarket } from "../types";
import { MarketRow } from "./MarketRow";
import { Skeleton } from "./ui/skeleton";

interface MarketListProps {
  coins: CoinMarket[];
  isLoading: boolean;
  isError: boolean;
  onAddToPortfolio: (coin: CoinMarket) => void;
}

const SKELETON_COUNT = 12;

export function MarketList({
  coins,
  isLoading,
  isError,
  onAddToPortfolio,
}: MarketListProps) {
  if (isLoading) {
    return (
      <div data-ocid="market-list-skeleton">
        {/* Column headers skeleton */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border/50">
          <Skeleton className="h-3 w-5 rounded" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-3 w-20 rounded flex-1" />
          <Skeleton className="h-3 w-16 rounded hidden sm:block" />
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-7 w-7 rounded-md" />
        </div>
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton indices
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b border-border/30"
          >
            <Skeleton className="h-3 w-5 rounded" />
            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-10 rounded" />
              <Skeleton className="h-2 w-20 rounded" />
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 w-24">
              <Skeleton className="h-2 w-12 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
            <div className="flex flex-col items-end gap-1 w-28">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-2 w-12 rounded" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="market-list-error"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
          <span className="text-accent text-xl">!</span>
        </div>
        <div className="text-center">
          <p className="font-mono text-sm text-foreground font-medium mb-1">
            Data unavailable
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Could not load market data from CoinGecko
          </p>
        </div>
      </div>
    );
  }

  if (coins.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 gap-3"
        data-ocid="market-list-empty"
      >
        <p className="font-mono text-sm text-muted-foreground">
          No coins match your search
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="market-list">
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border/80 bg-secondary/20">
        <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase w-6 text-right flex-shrink-0">
          #
        </span>
        <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase w-8 flex-shrink-0">
          &nbsp;
        </span>
        <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase flex-1">
          Asset
        </span>
        <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase w-24 text-right hidden sm:block flex-shrink-0">
          Mkt Cap
        </span>
        <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase w-28 text-right flex-shrink-0">
          Price / 24h
        </span>
        <span className="w-8 flex-shrink-0" />
      </div>

      {coins.map((coin, i) => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: Math.min(i * 0.025, 0.6),
            duration: 0.2,
            ease: "easeOut",
          }}
        >
          <MarketRow coin={coin} onAddToPortfolio={onAddToPortfolio} />
        </motion.div>
      ))}
    </div>
  );
}
