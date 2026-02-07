"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlocks } from "@/lib/api";

/* ---------------------------------------
   Shape of block returned by your backend
---------------------------------------- */
type Block = {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
};

/* ---------------------------------------
   Helper to convert unix time → human time
---------------------------------------- */
function timeAgo(ts: number) {
  const now = Date.now() / 1000;
  const mins = Math.floor((now - ts) / 60);

  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  const days = Math.floor(hrs / 24);
  return `${days} d ago`;
}

/* ---------------------------------------
   Blocks List Component
---------------------------------------- */
export default function BlocksList() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------------------------------
     Load blocks from backend on mount
  ---------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await getBlocks();

        // Safety check — never trust API shape
        if (Array.isArray(data)) {
          setBlocks(data);
        } else {
          setBlocks([]);
        }
      } catch (err) {
        console.error("Blocks load error:", err);
        setError("Failed to load blocks");
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ---------------------------------------
     Loading State
  ---------------------------------------- */
  if (loading) {
    return (
      <div className="card-elevated rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Latest Blocks</h2>
        <div className="text-muted-foreground text-sm">Loading blocks...</div>
      </div>
    );
  }

  /* ---------------------------------------
     Error State
  ---------------------------------------- */
  if (error) {
    return (
      <div className="card-elevated rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Latest Blocks</h2>
        <div className="text-red-500 text-sm">{error}</div>
      </div>
    );
  }

  /* ---------------------------------------
     Render Blocks
  ---------------------------------------- */
  return (
    <div className="card-elevated animate-fadeIn rounded-xl p-6 relative overflow-hidden">
      {/* Soft glow background */}
      <div className="glow-bg -top-24 left-1/2 -translate-x-1/2 absolute" />

      <h2 className="text-xl font-semibold mb-6 text-gradient">
        Latest Blocks
      </h2>

      <div className="divide-y divide-border">
        {blocks.slice(0, 15).map((b, i) => (
          <Link
            key={b.id}
            href={`/block/${b.height}`}
            className="stagger-item hover-lift hover-glow flex items-center justify-between py-4 px-3 rounded-lg transition-all"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex flex-col">
              <span className="font-mono text-primary text-sm">
                #{b.height.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                {timeAgo(b.timestamp)}
              </span>
            </div>

            <div className="text-sm text-muted-foreground">
              {b.tx_count.toLocaleString()} txs
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}