import { BarChart2, Plus, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

interface EmptyHoldingsProps {
  onAddHolding: () => void;
}

const features = [
  {
    icon: TrendingUp,
    label: "Live CoinGecko prices",
    desc: "Refreshed every 60 seconds",
  },
  {
    icon: BarChart2,
    label: "7-day sparklines",
    desc: "Visual price trajectory per asset",
  },
  {
    icon: Zap,
    label: "P&L tracking",
    desc: "Cost basis & unrealized gains",
  },
];

export function EmptyHoldings({ onAddHolding }: EmptyHoldingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
      className="flex flex-col items-center justify-center px-6 py-16 gap-8 text-center"
      data-ocid="empty-holdings"
    >
      {/* Animated icon stack */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center shadow-glass"
        >
          <TrendingUp className="text-primary" size={36} />
        </motion.div>
        {/* Floating dots */}
        {[
          { delay: 0, x: "calc(100% + 4px)", y: "-8px" },
          { delay: 0.4, x: "-16px", y: "calc(100% - 4px)" },
          { delay: 0.8, x: "calc(100% - 4px)", y: "calc(100% + 4px)" },
        ].map((dot, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: decorative dots
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot.delay,
              ease: "easeInOut",
            }}
            className="absolute w-2.5 h-2.5 rounded-full bg-primary/40 border border-primary/60"
            style={{ left: dot.x, top: dot.y }}
          />
        ))}
      </div>

      {/* Copy */}
      <div className="space-y-2 max-w-xs">
        <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
          No holdings yet
        </h2>
        <p className="font-mono text-sm text-muted-foreground leading-relaxed">
          Add your first coin to start tracking your portfolio with live prices
          and P&amp;L analytics.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {features.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.25 + i * 0.1,
              type: "spring",
              stiffness: 200,
            }}
            className="flex items-center gap-3 px-3 py-2.5 bg-secondary/30 border border-border/60 rounded-lg text-left"
          >
            <feat.icon size={14} className="text-primary flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-wider">
                {feat.label}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="w-full max-w-xs"
      >
        <Button
          onClick={onAddHolding}
          data-ocid="empty-add-holding-btn"
          className="w-full h-12 font-mono text-xs tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth gap-2"
        >
          <Plus size={14} />
          Add First Coin
        </Button>
        <p className="mt-2 font-mono text-[9px] text-muted-foreground/60 text-center">
          Choose from top 100 coins by market cap
        </p>
      </motion.div>
    </motion.div>
  );
}
