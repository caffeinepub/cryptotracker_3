import { createRoute } from "@tanstack/react-router";
import { BarChart2, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../hooks/use-auth";
import {
  useCurrentPrices,
  useHoldings,
  useTopCoins,
} from "../hooks/use-portfolio";
import {
  buildPortfolio,
  formatPercent,
  formatUSD,
} from "../lib/backend-client";
import { cn } from "../lib/utils";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/market",
  component: MarketPage,
});

function MarketPage() {
  const { isAuthenticated } = useAuth();
  const { data: topCoins = [], isLoading } = useTopCoins();
  const { data: holdings = [] } = useHoldings();
  const coinIds = useMemo(() => holdings.map((h) => h.coinId), [holdings]);
  const { data: prices = {} } = useCurrentPrices(coinIds);

  const portfolio = useMemo(
    () => buildPortfolio(holdings, topCoins, prices),
    [holdings, topCoins, prices],
  );
  const holdingIds = new Set(portfolio.holdings.map((h) => h.coinId));

  return (
    <div className="flex flex-col min-h-screen">
      <header
        data-ocid="market-header"
        className="sticky top-0 z-40 glass-header"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="px-4 py-4 flex items-center gap-2">
          <BarChart2 size={16} className="text-primary" />
          <span className="font-mono text-sm tracking-widest uppercase text-foreground font-medium">
            Market
          </span>
          {!isLoading && (
            <span className="ml-auto font-mono text-[10px] text-muted-foreground tracking-widest">
              TOP {topCoins.length}
            </span>
          )}
        </div>
      </header>

      <div className="px-4 py-2">
        {isLoading ? (
          <div className="space-y-2 py-2">
            {[...Array(10)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
              <Skeleton key={i} className="h-14 w-full rounded" />
            ))}
          </div>
        ) : topCoins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <p className="text-muted-foreground font-mono text-sm">
              No market data available
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 px-1 py-2 mb-1">
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest w-5 text-right">
                #
              </span>
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
                ASSET
              </span>
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest text-right">
                PRICE
              </span>
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest text-right w-14">
                24H
              </span>
            </div>
            <div className="space-y-1" data-ocid="market-list">
              {topCoins.map((coin, i) => {
                const isOwned = isAuthenticated && holdingIds.has(coin.id);
                const isPos = coin.price_change_percentage_24h >= 0;
                return (
                  <motion.div
                    key={coin.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.4) }}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3 px-2 py-2.5 rounded border border-transparent hover:bg-card hover:border-border transition-smooth"
                    data-ocid={`market-row-${coin.id}`}
                  >
                    <span className="font-mono text-[10px] text-muted-foreground w-5 text-right">
                      {coin.market_cap_rank}
                    </span>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={coin.image}
                          alt={coin.symbol}
                          className="w-7 h-7 rounded-full"
                          loading="lazy"
                        />
                        {isOwned && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border border-background" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-medium text-foreground uppercase truncate">
                          {coin.symbol}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground truncate">
                          {coin.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-foreground">
                        {formatUSD(coin.current_price)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex items-center justify-end gap-0.5 w-14",
                        isPos ? "text-primary" : "text-accent",
                      )}
                    >
                      {isPos ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      <span className="font-mono text-[10px] font-medium">
                        {formatPercent(coin.price_change_percentage_24h)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
