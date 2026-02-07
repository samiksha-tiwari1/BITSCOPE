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

type Bucket = {
  range: string;
  count: number;
};

function satPerVByte(fee: number, vsize: number) {
  return Math.round(fee / vsize);
}

export default function MempoolFeeChart() {
  const [data, setData] = useState<Bucket[]>([]);

  useEffect(() => {
    async function load() {
      try {
        // Get recent mempool tx ids
        const idsRes = await fetch(
          "https://blockstream.info/api/mempool/txids"
        );
        const ids: string[] = await idsRes.json();

        // Small sample for speed and reliability
        const sampleIds = ids.slice(0, 35);

        // Fetch real tx details (fee + vsize)
        const txs = await Promise.all(
          sampleIds.map(async (id) => {
            const r = await fetch(
              `https://blockstream.info/api/tx/${id}`
            );
            return r.json();
          })
        );

        const buckets: Record<string, number> = {
          "0-5": 0,
          "6-20": 0,
          "21-50": 0,
          "51-100": 0,
          "100+": 0,
        };

        for (const tx of txs) {
          if (!tx?.fee || !tx?.vsize) continue;

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
      } catch (error) {
        console.error("Failed to load mempool chart", error);
      }
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
          <Bar
            dataKey="count"
            fill="#22d3ee"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}