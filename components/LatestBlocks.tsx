"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Block = {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
};

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() / 1000 - ts) / 60);
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

export default function LatestBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch("https://blockstream.info/api/blocks")
      .then((r) => r.json())
      .then((data) => {
        // 🔥 Normalize response
        const normalized = Array.isArray(data) ? data : data.blocks ?? [];
        setBlocks(normalized);
      });
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Latest Blocks</h3>
        <span className="text-xs text-muted-foreground">Live</span>
      </div>

      <div className="divide-y divide-border">
        {blocks.map((b) => (
          <Link
            href={`/block/${b.height}`}
            key={b.id}
            className="flex items-center justify-between py-3 px-2 rounded hover:bg-secondary/40 transition-all"
          >
            <div className="flex flex-col">
              <span className="font-mono text-primary text-sm">
                #{b.height.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {timeAgo(b.timestamp)}
              </span>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                {b.tx_count.toLocaleString()} txs
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}