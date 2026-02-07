"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";

type Block = {
  tx_count?: number;
};

type ChartPoint = {
  index: number;
  txs: number;
};

export default function BlockChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://blockstream.info/api/blocks",
          { cache: "no-store" }
        );

        const raw = await res.json();

        if (!Array.isArray(raw)) return;

        const formatted: ChartPoint[] = raw
          .slice(0, 30)
          .map((b: Block, i: number) => ({
            index: i,
            txs: b?.tx_count ?? 0,
          }))
          .reverse();

        setData(formatted);
      } catch (e) {
        console.error("Failed to load block chart", e);
      }
    };

    load();
    const interval = setInterval(load, 20000);
    return () => clearInterval(interval);
  }, []);

  if (data.length === 0) return null;

  const latest = data[data.length - 1].txs;
  const avg = Math.round(
    data.reduce((a, b) => a + b.txs, 0) / data.length
  );

  return (
    <div className="card-elevated animate-slideUp rounded-xl p-8 mb-10 relative overflow-hidden">
      <div className="glow-bg -top-20 left-1/2 -translate-x-1/2 absolute" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="cinematic-title text-2xl mb-2">
          Transaction Throughput
        </h3>

        <div className="text-right text-sm text-muted-foreground">
          <div>
            Latest{" "}
            <span className="text-primary font-semibold">
              {latest.toLocaleString()}
            </span>{" "}
            txs
          </div>
          <div>
            Average{" "}
            <span className="text-primary font-semibold">
              {avg.toLocaleString()}
            </span>{" "}
            txs
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />

          <XAxis dataKey="index" hide />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0b0f14",
              border: "1px solid #1e293b",
              borderRadius: "10px",
            }}
          />

          <defs>
            <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="txs"
            stroke="none"
            fill="url(#colorTx)"
          />

          <Line
            type="monotone"
            dataKey="txs"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}