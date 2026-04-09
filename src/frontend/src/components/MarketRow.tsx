import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { formatPercent, formatUSD } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { CoinMarket } from "../types";

interface MarketRowProps {
  coin: CoinMarket;
  onAddToPortfolio: (coin: CoinMarket) => void;
  style?: React.CSSProperties;
}

export function MarketRow({ coin, onAddToPortfolio, style }: MarketRowProps) {
  const isPos = coin.price_change_percentage_24h >= 0;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/20 transition-smooth group"
      style={style}
      data-ocid={`market-row-${coin.id}`}
    >
      {/* Rank */}
      <span className="font-mono text-[10px] text-muted-foreground w-6 text-right flex-shrink-0 tabular-nums">
        {coin.market_cap_rank}
      </span>

      {/* Icon */}
      <img
        src={coin.image}
        alt={coin.symbol}
        className="w-8 h-8 rounded-full flex-shrink-0"
        loading="lazy"
      />

      {/* Name + Symbol */}
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs font-semibold uppercase text-foreground truncate leading-tight">
          {coin.symbol}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
          {coin.name}
        </p>
      </div>

      {/* Market cap — hide on small screens */}
      <div className="hidden sm:block w-24 text-right flex-shrink-0">
        <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-0.5">
          Mkt Cap
        </p>
        <p className="font-mono text-xs text-foreground tabular-nums">
          {formatUSD(coin.market_cap, true)}
        </p>
      </div>

      {/* Price + 24h change */}
      <div className="text-right flex-shrink-0 w-28">
        <p className="font-mono text-xs font-semibold text-foreground tabular-nums leading-tight">
          {formatUSD(coin.current_price)}
        </p>
        <div
          className={cn(
            "flex items-center justify-end gap-0.5 mt-0.5",
            isPos ? "text-primary" : "text-accent",
          )}
        >
          {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          <span className="font-mono text-[10px] font-medium tabular-nums">
            {formatPercent(coin.price_change_percentage_24h)}
          </span>
        </div>
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={() => onAddToPortfolio(coin)}
        aria-label={`Add ${coin.name} to portfolio`}
        data-ocid={`add-coin-${coin.id}`}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md border border-border/60 bg-secondary/40 text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-smooth opacity-60 group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
