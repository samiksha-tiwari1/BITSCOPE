"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Block = {
  id: string;
  height: number;
  tx_count: number;
  timestamp: number;
};

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() / 1000 - ts) / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ago`;
}

export default function BlocksList() {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    fetch("https://blockstream.info/api/blocks")
      .then((r) => r.json())
      .then(setBlocks);
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">Latest Blocks</h2>

      <div className="divide-y divide-border">
        {blocks.slice(0, 15).map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center py-4"
          >
            <div>
              {/* Clickable block height */}
              <Link
                href={`/block/${b.height}`}
                className="font-mono text-primary hover:underline"
              >
                #{b.height}
              </Link>

              <div className="text-xs text-muted-foreground">
                {timeAgo(b.timestamp)}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {b.tx_count.toLocaleString()} txs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}