import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useCurrentPrices,
  useHoldings,
  useTopCoins,
} from "../hooks/use-portfolio";
import { buildPortfolio, formatUSD } from "../lib/backend-client";

interface ChartPoint {
  day: string;
  value: number;
}

/** Seeded pseudo-random number generator (mulberry32) for stable chart */
function seededRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simulate 30-day portfolio history with seeded variance (stable across re-renders) */
function simulateHistory(currentValue: number, days = 30): ChartPoint[] {
  if (currentValue === 0) return [];
  const points: ChartPoint[] = [];
  const now = Date.now();
  const msPerDay = 86_400_000;
  const rng = seededRng(Math.round(currentValue));
  const startRatio = 0.72 + rng() * 0.18;
  let value = currentValue * startRatio;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * msPerDay);
    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const drift = (currentValue - value) / (i + 1);
    const noise = value * (rng() * 0.04 - 0.015);
    value = Math.max(0, value + drift + noise);
    points.push({ day: label, value: Math.round(value * 100) / 100 });
  }
  if (points.length > 0) points[points.length - 1].value = currentValue;
  return points;
}

// Custom tooltip
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded px-3 py-2 shadow-lg">
      <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-1">
        {label}
      </p>
      <p className="font-mono text-sm font-bold text-foreground">
        {formatUSD(payload[0].value)}
      </p>
    </div>
  );
}

export function PortfolioChart() {
  const { data: holdings = [], isLoading } = useHoldings();
  const { data: topCoins = [] } = useTopCoins();
  const coinIds = useMemo(() => holdings.map((h) => h.coinId), [holdings]);
  const { data: prices = {} } = useCurrentPrices(coinIds);

  const portfolio = useMemo(
    () => buildPortfolio(holdings, topCoins, prices),
    [holdings, topCoins, prices],
  );

  // Bucket the portfolio value to tens so we don't re-simulate on micro-changes
  const bucketedValue = useMemo(
    () => Math.round(portfolio.totalValue / 10) * 10,
    [portfolio.totalValue],
  );

  // Seed-stable history based on bucketed portfolio value
  const chartData = useMemo(
    () => simulateHistory(bucketedValue),
    [bucketedValue],
  );

  const isPositive = portfolio.totalPnl >= 0;
  const strokeColor = isPositive
    ? "oklch(0.65 0.16 150)"
    : "oklch(0.62 0.2 22)";
  const gradientId = isPositive ? "gainGradient" : "lossGradient";
  const gradientStop = isPositive
    ? { start: "oklch(0.65 0.16 150 / 0.25)", end: "oklch(0.65 0.16 150 / 0)" }
    : { start: "oklch(0.62 0.2 22 / 0.25)", end: "oklch(0.62 0.2 22 / 0)" };

  if (isLoading) {
    return (
      <div className="mx-4 rounded-lg bg-card/50 border border-border h-[160px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-5 h-5 rounded-full border border-primary/40 border-t-primary animate-spin" />
          <span className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase">
            Loading chart
          </span>
        </div>
      </div>
    );
  }

  if (portfolio.totalValue === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      className="mx-4 rounded-lg bg-card/40 border border-border/60 overflow-hidden"
      data-ocid="portfolio-chart"
    >
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
          30-Day Performance
        </span>
        <span
          className={`font-mono text-[10px] font-medium ${isPositive ? "text-primary" : "text-accent"}`}
        >
          {isPositive ? "▲" : "▼"}&nbsp;Simulated
        </span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart
          data={chartData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientStop.start} />
              <stop offset="100%" stopColor={gradientStop.end} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.16 0.01 285 / 0.5)"
            vertical={false}
          />
          <XAxis
            dataKey="day"
            tick={{
              fill: "oklch(0.55 0 0)",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
            }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{
              fill: "oklch(0.55 0 0)",
              fontSize: 9,
              fontFamily: "var(--font-mono)",
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v.toFixed(0)}`
            }
            width={44}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: strokeColor, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
