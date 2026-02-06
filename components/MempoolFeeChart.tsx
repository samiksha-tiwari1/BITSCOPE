"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ---------- Types ---------- */

type MempoolTx = {
  fee: number;
  vsize: number;
};

type Bucket = {
  range: string;
  count: number;
};

/* ---------- Helpers ---------- */

function satPerVByte(fee: number, vsize: number) {
  return Math.round(fee / vsize);
}

/* ---------- Component ---------- */

export default function MempoolFeeChart() {
  const [data, setData] = useState<Bucket[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        "https://blockstream.info/api/mempool/recent"
      );
      const raw: unknown = await res.json();

      // Normalize response shape safely
      const txs: MempoolTx[] = Array.isArray(raw)
        ? raw
        : Array.isArray((raw as { txs?: unknown }).txs)
        ? ((raw as { txs: MempoolTx[] }).txs)
        : [];

      const buckets: Record<string, number> = {
        "0-5": 0,
        "6-20": 0,
        "21-50": 0,
        "51-100": 0,
        "100+": 0,
      };

      for (const tx of txs) {
        const spv = satPerVByte(tx.fee, tx.vsize);

        if (spv <= 5) buckets["0-5"]++;
        else if (spv <= 20) buckets["6-20"]++;
        else if (spv <= 50) buckets["21-50"]++;
        else if (spv <= 100) buckets["51-100"]++;
        else buckets["100+"]++;
      }

      setData(
        Object.entries(buckets).map(([range, count]) => ({
          range,
          count,
        }))
      );
    }

    load();
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">
        Fee Distribution (sat/vB)
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid stroke="#1f2937" vertical={false} />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#22d3ee" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}