import { TrendingDown, TrendingUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAddHolding,
  useHoldings,
  useUpdateHolding,
} from "../hooks/use-portfolio";
import { formatUSD } from "../lib/backend-client";
import { cn } from "../lib/utils";
import type { CoinMarket } from "../types";
import { CoinSearchSelect } from "./CoinSearchSelect";

interface AddHoldingDrawerProps {
  open: boolean;
  onClose: () => void;
  preselectedCoin?: CoinMarket | null;
}

type Side = "buy" | "sell";

export function AddHoldingDrawer({
  open,
  onClose,
  preselectedCoin,
}: AddHoldingDrawerProps) {
  const addHolding = useAddHolding();
  const updateHolding = useUpdateHolding();
  const { data: holdings = [] } = useHoldings();

  const [side, setSide] = useState<Side>("buy");
  const [selectedCoin, setSelectedCoin] = useState<CoinMarket | null>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Sync preselectedCoin state on open + coin change
  useEffect(() => {
    if (open && preselectedCoin) {
      setSelectedCoin(preselectedCoin);
      setPrice(String(preselectedCoin.current_price));
    }
  }, [open, preselectedCoin]);

  // When coin changes, update default price
  const handleCoinChange = (coin: CoinMarket) => {
    setSelectedCoin(coin);
    setPrice(coin ? String(coin.current_price) : "");
  };

  const currentHolding = holdings.find((h) => h.coinId === selectedCoin?.id);
  const currentQty = currentHolding?.quantity ?? 0;
  const parsedQty = Number(quantity) || 0;
  const parsedPrice = Number(price) || 0;
  const tradeTotal = parsedQty * parsedPrice;

  // Sell preview: new quantity after sale
  const newQtyAfterSell = Math.max(0, currentQty - parsedQty);

  const isValid =
    !!selectedCoin &&
    parsedQty > 0 &&
    parsedPrice > 0 &&
    (side === "buy" || parsedQty <= currentQty);

  const isPending = addHolding.isPending || updateHolding.isPending;

  const handleSubmit = () => {
    if (!selectedCoin || !isValid) return;

    if (side === "buy") {
      addHolding.mutate(
        {
          coinId: selectedCoin.id,
          quantity: parsedQty,
          priceAtTrade: parsedPrice,
        },
        {
          onSuccess: () => {
            toast.success("Position updated", {
              description: `Bought ${parsedQty} ${selectedCoin.symbol.toUpperCase()} @ ${formatUSD(parsedPrice)} · Total: ${formatUSD(tradeTotal)}`,
            });
            handleClose();
          },
          onError: () =>
            toast.error("Transaction failed", {
              description: "Please try again.",
            }),
        },
      );
    } else {
      // Sell: reduce quantity, keep existing costBasis
      const existingCostBasis = currentHolding?.costBasis ?? parsedPrice;
      updateHolding.mutate(
        {
          coinId: selectedCoin.id,
          quantity: newQtyAfterSell,
          costBasis: existingCostBasis,
        },
        {
          onSuccess: () => {
            toast.success("Position updated", {
              description: `Sold ${parsedQty} ${selectedCoin.symbol.toUpperCase()} @ ${formatUSD(parsedPrice)} · Proceeds: ${formatUSD(tradeTotal)}`,
            });
            handleClose();
          },
          onError: () =>
            toast.error("Transaction failed", {
              description: "Please try again.",
            }),
        },
      );
    }
  };

  const handleClose = () => {
    setSide("buy");
    setSelectedCoin(null);
    setQuantity("");
    setPrice("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col max-w-2xl mx-auto max-h-[90vh] rounded-t-2xl bg-card border-t border-white/10 backdrop-blur-md shadow-2xl"
            data-ocid="add-holding-drawer"
            aria-label={`${side === "buy" ? "Buy" : "Sell"} position`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 flex-shrink-0">
              <span className="font-mono text-sm font-semibold tracking-widest uppercase text-foreground">
                New Transaction
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close drawer"
                data-ocid="close-drawer-btn"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 space-y-5">
              {/* Buy / Sell Toggle */}
              <div
                className="flex rounded-lg border border-border overflow-hidden"
                data-ocid="buy-sell-toggle"
              >
                <button
                  type="button"
                  onClick={() => setSide("buy")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-xs tracking-widest uppercase transition-smooth",
                    side === "buy"
                      ? "bg-primary text-primary-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                  )}
                  data-ocid="buy-toggle-btn"
                >
                  <TrendingUp size={13} />
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSide("sell")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-xs tracking-widest uppercase transition-smooth",
                    side === "sell"
                      ? "bg-accent text-accent-foreground"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                  )}
                  data-ocid="sell-toggle-btn"
                >
                  <TrendingDown size={13} />
                  Sell
                </button>
              </div>

              {/* Coin Selector */}
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                  Coin
                </p>
                <CoinSearchSelect
                  value={selectedCoin}
                  onChange={handleCoinChange}
                />
              </div>

              {/* Current holding badge (sell mode) */}
              <AnimatePresence>
                {side === "sell" && selectedCoin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 rounded-lg bg-accent/10 border border-accent/25 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                        Current holding
                      </span>
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {currentQty.toLocaleString(undefined, {
                          maximumFractionDigits: 8,
                        })}{" "}
                        <span className="text-muted-foreground text-[10px] uppercase">
                          {selectedCoin.symbol}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label
                  htmlFor="quantity-input"
                  className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase block"
                >
                  Quantity
                </label>
                <input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-smooth"
                  data-ocid="quantity-input"
                />
                {side === "sell" &&
                  parsedQty > currentQty &&
                  currentQty > 0 && (
                    <p className="font-mono text-[10px] text-accent mt-1">
                      Exceeds current holding of{" "}
                      {currentQty.toLocaleString(undefined, {
                        maximumFractionDigits: 8,
                      })}
                    </p>
                  )}
              </div>

              {/* Price at trade */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="price-input"
                    className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase"
                  >
                    Price at Trade (USD)
                  </label>
                  {selectedCoin &&
                    parsedPrice !== selectedCoin.current_price && (
                      <button
                        type="button"
                        onClick={() =>
                          setPrice(String(selectedCoin.current_price))
                        }
                        className="font-mono text-[10px] text-primary hover:underline transition-smooth"
                        data-ocid="reset-price-btn"
                      >
                        Use current · {formatUSD(selectedCoin.current_price)}
                      </button>
                    )}
                </div>
                <input
                  id="price-input"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="any"
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring transition-smooth"
                  data-ocid="price-input"
                />
              </div>

              {/* Trade Summary */}
              <AnimatePresence>
                {parsedQty > 0 && parsedPrice > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className={cn(
                      "p-4 rounded-lg border space-y-2",
                      side === "buy"
                        ? "bg-primary/5 border-primary/20"
                        : "bg-accent/5 border-accent/20",
                    )}
                  >
                    <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
                      Trade Summary
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        {side === "buy" ? "Total cost" : "Proceeds"}
                      </span>
                      <span
                        className={cn(
                          "font-mono text-sm font-bold",
                          side === "buy" ? "text-primary" : "text-accent",
                        )}
                      >
                        {formatUSD(tradeTotal)}
                      </span>
                    </div>
                    {side === "sell" && selectedCoin && (
                      <div className="flex items-center justify-between border-t border-border/40 pt-2">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Remaining
                        </span>
                        <span className="font-mono text-xs text-foreground">
                          {newQtyAfterSell.toLocaleString(undefined, {
                            maximumFractionDigits: 8,
                          })}{" "}
                          <span className="text-muted-foreground uppercase">
                            {selectedCoin.symbol}
                          </span>
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isPending}
                className={cn(
                  "w-full flex items-center justify-center gap-2 h-12 rounded-lg font-mono text-sm tracking-widest uppercase transition-smooth",
                  isValid && !isPending
                    ? side === "buy"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                    : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60",
                )}
                data-ocid="submit-holding-btn"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                ) : (
                  <>
                    {side === "buy" ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    {side === "buy" ? "Confirm Buy" : "Confirm Sell"}
                  </>
                )}
              </button>

              {/* Keyboard hint */}
              <p className="text-center font-mono text-[10px] text-muted-foreground/50 pb-2">
                Press{" "}
                <kbd className="px-1 py-0.5 bg-secondary/50 border border-border rounded text-[9px]">
                  Esc
                </kbd>{" "}
                to dismiss
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
