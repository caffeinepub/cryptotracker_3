import { RefreshCw, Search, X } from "lucide-react";
import { cn } from "../lib/utils";

interface DiscoverSearchProps {
  value: string;
  onChange: (v: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  resultCount: number;
  totalCount: number;
}

export function DiscoverSearch({
  value,
  onChange,
  onRefresh,
  isRefreshing,
  resultCount,
  totalCount,
}: DiscoverSearchProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search coins…"
            data-ocid="discover-search"
            className="w-full bg-secondary/50 border border-border rounded-md pl-8 pr-8 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-smooth"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh market data"
          data-ocid="discover-refresh-btn"
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-md border border-border bg-secondary/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth flex-shrink-0",
            isRefreshing && "cursor-not-allowed opacity-60",
          )}
        >
          <RefreshCw
            size={14}
            className={cn("transition-smooth", isRefreshing && "animate-spin")}
          />
        </button>
      </div>

      {/* Result count meta */}
      <div className="flex items-center justify-between px-0.5">
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          {value
            ? `${resultCount} of ${totalCount} coins`
            : `Top ${totalCount} by Market Cap`}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          CoinGecko
        </span>
      </div>
    </div>
  );
}
