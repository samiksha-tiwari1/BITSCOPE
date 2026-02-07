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
  height: number;
  tx_count: number;
};

type ChartPoint = {
  index: number;
  txs: number;
};

const API = process.env.NEXT_PUBLIC_API_URL as string;

export default function BlockChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/blocks`, {
          cache: "no-store",
        });

        const blocks: Block[] = await res.json();

        if (!Array.isArray(blocks)) return;

        const formatted = blocks
          .slice(0, 30)
          .map((b, i) => ({
            index: i,
            txs: b.tx_count,
          }))
          .reverse();

        setData(formatted);
      } catch (err) {
        console.error("Failed to load blocks chart", err);
      }
    }

    load();
  }, []);

  if (data.length === 0) return null;

  const latest = data[data.length - 1].txs;
  const avg = Math.round(
    data.reduce((a, b) => a + b.txs, 0) / data.length
  );

  return (
    <div className="card-elevated rounded-xl p-8 mb-10 relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">
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