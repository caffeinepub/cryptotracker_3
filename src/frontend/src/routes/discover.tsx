import { createRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AddHoldingDrawer } from "../components/AddHoldingDrawer";
import { DiscoverSearch } from "../components/DiscoverSearch";
import { MarketList } from "../components/MarketList";
import { useFearGreedIndex, useTopCoins } from "../hooks/use-portfolio";
import { getFearGreedColor, getFearGreedLabel } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { CoinMarket } from "../types";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  component: DiscoverPage,
});

function DiscoverPage() {
  const {
    data: topCoins = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTopCoins();
  const { data: fearGreed } = useFearGreedIndex();

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preselectedCoin, setPreselectedCoin] = useState<CoinMarket | null>(
    null,
  );

  const filtered = topCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAddToPortfolio(coin: CoinMarket) {
    setPreselectedCoin(coin);
    setDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setDrawerOpen(false);
    setPreselectedCoin(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header */}
      <header
        data-ocid="discover-header"
        className="sticky top-0 z-40 glass-header"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="px-4 pt-4 pb-3 space-y-3">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <Compass size={15} className="text-primary" />
            <span className="font-mono text-sm tracking-widest uppercase text-foreground font-semibold">
              Discover
            </span>
            {isFetching && !isLoading && (
              <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase animate-pulse ml-auto">
                Updating…
              </span>
            )}
          </div>

          {/* Search + refresh */}
          <DiscoverSearch
            value={search}
            onChange={setSearch}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
            resultCount={filtered.length}
            totalCount={topCoins.length}
          />
        </div>

        {/* Fear & Greed banner */}
        {fearGreed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mx-4 mb-3 px-3 py-2 rounded border border-border bg-card/60 flex items-center gap-4"
            data-ocid="fear-greed-widget"
          >
            <div>
              <p className="font-mono text-[9px] text-muted-foreground tracking-[0.18em] uppercase mb-0.5">
                Fear &amp; Greed
              </p>
              <p
                className={cn(
                  "font-mono text-xl font-bold leading-none tabular-nums",
                  getFearGreedColor(Number(fearGreed.value)),
                )}
              >
                {fearGreed.value}
              </p>
            </div>

            <div className="flex-1">
              <FearGreedBar value={Number(fearGreed.value)} />
            </div>

            <p
              className={cn(
                "font-mono text-xs font-semibold tracking-widest uppercase",
                getFearGreedColor(Number(fearGreed.value)),
              )}
            >
              {getFearGreedLabel(fearGreed.value_classification)}
            </p>
          </motion.div>
        )}
      </header>

      {/* Market list */}
      <div className="flex-1">
        <MarketList
          coins={filtered}
          isLoading={isLoading}
          isError={isError}
          onAddToPortfolio={handleAddToPortfolio}
        />
      </div>

      {/* Add Holding Drawer — preselect coin when opened from Discover */}
      <AddHoldingDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        preselectedCoin={preselectedCoin}
      />
    </div>
  );
}

function FearGreedBar({ value }: { value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color =
    value <= 25
      ? "bg-accent"
      : value <= 45
        ? "bg-orange-400"
        : value <= 55
          ? "bg-foreground/30"
          : "bg-primary";

  return (
    <div className="space-y-1">
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between">
        <span className="font-mono text-[8px] text-muted-foreground">Fear</span>
        <span className="font-mono text-[8px] text-muted-foreground">
          Greed
        </span>
      </div>
    </div>
  );
}
