import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTopCoins } from "../hooks/use-portfolio";
import { formatUSD } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { CoinMarket } from "../types";

interface CoinSearchSelectProps {
  value: CoinMarket | null;
  onChange: (coin: CoinMarket) => void;
  className?: string;
}

export function CoinSearchSelect({
  value,
  onChange,
  className,
}: CoinSearchSelectProps) {
  const { data: topCoins = [], isLoading } = useTopCoins();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = topCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (coin: CoinMarket) => {
    onChange(coin);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 bg-secondary/50 border border-border rounded px-3 py-3 hover:border-border/80 transition-smooth focus:outline-none focus:border-ring min-h-[44px]"
        data-ocid="coin-search-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <>
            <img
              src={value.image}
              alt={value.symbol}
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0 text-left">
              <span className="font-mono text-sm font-semibold uppercase text-foreground">
                {value.symbol}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground ml-2">
                {value.name}
              </span>
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {formatUSD(value.current_price)}
            </span>
          </>
        ) : (
          <>
            <Search size={14} className="text-muted-foreground flex-shrink-0" />
            <span className="font-mono text-sm text-muted-foreground flex-1 text-left">
              {isLoading ? "Loading coins…" : "Search coin…"}
            </span>
          </>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null as unknown as CoinMarket);
              setOpen(true);
            }}
            className="ml-1 p-0.5 rounded hover:bg-border transition-smooth"
            aria-label="Clear selection"
          >
            <X size={12} className="text-muted-foreground" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-xl overflow-hidden"
          >
            {/* Search bar inside dropdown */}
            <div className="px-3 py-2 border-b border-border/50 flex items-center gap-2">
              <Search
                size={12}
                className="text-muted-foreground flex-shrink-0"
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or symbol…"
                className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                data-ocid="coin-search-input"
                aria-label="Search coins"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Coin list */}
            <ul className="max-h-56 overflow-y-auto overscroll-contain py-1">
              {filtered.slice(0, 50).map((coin, i) => (
                <motion.li
                  key={coin.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.01 }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(coin)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/50 transition-smooth text-left min-h-[40px]",
                      value?.id === coin.id && "bg-primary/10",
                    )}
                    data-ocid={`coin-option-${coin.id}`}
                  >
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs font-semibold uppercase text-foreground">
                        {coin.symbol}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground ml-2 truncate">
                        {coin.name}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-foreground ml-auto flex-shrink-0">
                      {formatUSD(coin.current_price)}
                    </span>
                  </button>
                </motion.li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-4 text-center font-mono text-xs text-muted-foreground">
                  No coins found
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
