import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "../lib/utils";

interface SparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  className?: string;
  showTooltip?: boolean;
}

export function Sparkline({
  data,
  width = "100%",
  height = 32,
  className,
  showTooltip = false,
}: SparklineProps) {
  const chartData = useMemo(
    () => data.map((value, i) => ({ i, value })),
    [data],
  );

  if (data.length < 2) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground font-mono text-[9px]",
          className,
        )}
        style={{ width, height }}
      >
        —
      </div>
    );
  }

  const first = data[0];
  const last = data[data.length - 1];
  const isGain = last >= first;
  // Electric Emerald for gain, Crimson Pulse for loss
  const lineColor = isGain ? "oklch(0.65 0.16 150)" : "oklch(0.62 0.2 22)";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1 || 1;

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <YAxis domain={[min - padding, max + padding]} hide />
          {showTooltip && (
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const val = payload[0]?.value as number;
                return (
                  <div className="bg-popover border border-border rounded px-2 py-1">
                    <span className="font-mono text-[10px] text-foreground">
                      $
                      {val?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                  </div>
                );
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={1.5}
            dot={false}
            activeDot={
              showTooltip ? { r: 3, fill: lineColor, strokeWidth: 0 } : false
            }
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
