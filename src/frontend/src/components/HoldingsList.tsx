import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  useCurrentPrices,
  useHoldings,
  useTopCoins,
} from "../hooks/use-portfolio";
import { buildPortfolio } from "../lib/backend-client";
import type { HoldingWithMarket } from "../types";
import { CoinDetailSheet } from "./CoinDetailSheet";
import { EmptyHoldings } from "./EmptyHoldings";
import { HoldingRow } from "./HoldingRow";
import { Skeleton } from "./ui/skeleton";

interface HoldingsListProps {
  onAddHolding: () => void;
}

export function HoldingsList({ onAddHolding }: HoldingsListProps) {
  const { data: holdings = [], isLoading } = useHoldings();
  const { data: topCoins = [] } = useTopCoins();
  const coinIds = useMemo(() => holdings.map((h) => h.coinId), [holdings]);
  const { data: prices = {} } = useCurrentPrices(coinIds);

  const [selectedHolding, setSelectedHolding] =
    useState<HoldingWithMarket | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const portfolio = useMemo(
    () => buildPortfolio(holdings, topCoins, prices),
    [holdings, topCoins, prices],
  );

  const handleOpenDetail = (holding: HoldingWithMarket) => {
    setSelectedHolding(holding);
    setSheetOpen(true);
  };

  const handleCloseDetail = () => {
    setSheetOpen(false);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-2" data-ocid="holdings-loading">
        {(["sk1", "sk2", "sk3", "sk4"] as const).map((id, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.07 }}
          >
            <Skeleton className="h-[88px] w-full rounded-lg" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (portfolio.holdings.length === 0) {
    return <EmptyHoldings onAddHolding={onAddHolding} />;
  }

  return (
    <>
      <div className="px-4 py-3" data-ocid="holdings-list">
        {/* List header */}
        <div className="grid grid-cols-[36px_72px_1fr_80px_80px_44px] gap-2 items-center px-3 mb-2">
          <div />
          <span className="font-mono text-[8px] text-muted-foreground/70 uppercase tracking-widest">
            Asset
          </span>
          <span className="font-mono text-[8px] text-muted-foreground/70 uppercase tracking-widest text-center">
            7D
          </span>
          <span className="font-mono text-[8px] text-muted-foreground/70 uppercase tracking-widest text-right">
            Price
          </span>
          <span className="font-mono text-[8px] text-muted-foreground/70 uppercase tracking-widest text-right">
            Value
          </span>
          <div />
        </div>

        {/* Stagger list */}
        <motion.div
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 },
            },
            hidden: {},
          }}
        >
          <AnimatePresence>
            {portfolio.holdings.map((holding) => (
              <motion.div
                key={holding.coinId}
                variants={{
                  hidden: { opacity: 0, y: 14, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 280, damping: 26 },
                  },
                }}
                exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                layout
              >
                <HoldingRow
                  holding={holding}
                  totalPortfolioValue={portfolio.totalValue}
                  onClick={() => handleOpenDetail(holding)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between"
        >
          <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
            {portfolio.holdings.length} Position
            {portfolio.holdings.length !== 1 ? "s" : ""}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest">
            Last updated live
          </span>
        </motion.div>
      </div>

      {/* Coin detail bottom sheet */}
      <CoinDetailSheet
        holding={selectedHolding}
        open={sheetOpen}
        onClose={handleCloseDetail}
      />
    </>
  );
}
