import { motion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useFearGreedIndex } from "../hooks/use-portfolio";
import { cn } from "../lib/utils";

const SEGMENTS = [
  { label: "Extreme Fear", range: [0, 25], color: "oklch(0.62 0.2 22)" },
  { label: "Fear", range: [25, 45], color: "oklch(0.65 0.15 40)" },
  { label: "Neutral", range: [45, 55], color: "oklch(0.75 0.1 80)" },
  { label: "Greed", range: [55, 75], color: "oklch(0.65 0.14 130)" },
  { label: "Extreme Greed", range: [75, 100], color: "oklch(0.65 0.16 150)" },
];

function getColorForValue(value: number): string {
  for (const seg of SEGMENTS) {
    if (value <= seg.range[1]) return seg.color;
  }
  return SEGMENTS[4].color;
}

function getLabelClass(value: number): string {
  if (value <= 25) return "text-accent";
  if (value <= 45) return "text-orange-400";
  if (value <= 55) return "text-foreground";
  return "text-primary";
}

/** Build half-donut gauge data: filled portion + empty remainder */
function buildGaugeData(value: number) {
  const clamped = Math.max(0, Math.min(100, value));
  return [{ value: clamped }, { value: 100 - clamped }];
}

export function FearGreedWidget() {
  const { data: fearGreed, isLoading } = useFearGreedIndex();

  if (isLoading) {
    return (
      <div
        className="mx-4 rounded-lg bg-card/40 border border-border/60 p-4 flex items-center gap-4"
        data-ocid="fear-greed-loading"
      >
        <div className="w-16 h-16 rounded-full bg-muted/30 animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 bg-muted/30 rounded animate-pulse" />
          <div className="h-5 w-32 bg-muted/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!fearGreed) return null;

  const value = Number(fearGreed.value);
  const activeColor = getColorForValue(value);
  const gaugeData = buildGaugeData(value);
  const classification = fearGreed.value_classification;
  const labelClass = getLabelClass(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 180 }}
      className="mx-4 rounded-lg bg-card/40 border border-border/60 overflow-hidden"
      data-ocid="fear-greed-widget"
    >
      <div className="px-4 pt-3 pb-0 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
          Market Sentiment
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          Fear & Greed Index
        </span>
      </div>

      <div className="flex items-center gap-0 px-4 pb-3 pt-1">
        {/* Gauge */}
        <div className="relative w-[88px] h-[52px] flex-shrink-0">
          <ResponsiveContainer width="100%" height={88}>
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="92%"
                startAngle={180}
                endAngle={0}
                innerRadius={32}
                outerRadius={42}
                paddingAngle={1}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={activeColor} />
                <Cell fill="oklch(0.12 0.01 280 / 0.6)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-0.5">
            <span
              className="font-mono text-lg font-bold tabular-nums leading-none"
              style={{ color: activeColor }}
            >
              {value}
            </span>
          </div>
        </div>

        {/* Text info */}
        <div className="flex-1 pl-3 space-y-2">
          <div>
            <p
              className={cn(
                "font-mono text-base font-bold tracking-tight leading-none",
                labelClass,
              )}
              data-ocid="fear-greed-label"
            >
              {classification}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground mt-0.5 tracking-wide">
              out of 100
            </p>
          </div>

          {/* Segment bar */}
          <div className="flex gap-0.5 h-1 rounded-full overflow-hidden">
            {SEGMENTS.map((seg) => {
              const segWidth = seg.range[1] - seg.range[0];
              const isActive = value >= seg.range[0] && value <= seg.range[1];
              return (
                <div
                  key={seg.label}
                  className={cn(
                    "h-full rounded-sm transition-smooth",
                    isActive && "scale-y-150",
                  )}
                  style={{
                    width: `${segWidth}%`,
                    backgroundColor: seg.color,
                    opacity: isActive ? 1 : 0.35,
                  }}
                />
              );
            })}
          </div>

          {/* Segment labels */}
          <div className="flex justify-between">
            <span className="font-mono text-[8px] text-accent opacity-70">
              Fear
            </span>
            <span className="font-mono text-[8px] text-muted-foreground opacity-50">
              Neutral
            </span>
            <span className="font-mono text-[8px] text-primary opacity-70">
              Greed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
