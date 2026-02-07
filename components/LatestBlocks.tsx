"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getBlocks } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await getBlocks();
        setBlocks(data);
      } catch (e) {
        console.error("Failed to load blocks", e);
        setError("Failed to load blocks. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();

    // Auto-refresh every 60 seconds
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h3 className="cinematic-title text-2xl mb-2">Latest Blocks</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulseGlow" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {loading && blocks.length === 0 ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="skeleton h-16 rounded-lg"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 px-4 bg-destructive/10 border border-destructive/30 rounded-lg animate-scaleIn">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      ) : blocks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground animate-fadeIn">
          No blocks found
        </div>
      ) : (
        <div className="divide-y divide-border">
          {blocks.map((b, index) => (
            <Link
              href={`/block/${b.height}`}
              key={b.id}
              className="stagger-item flex items-center justify-between py-3 px-2 rounded hover:bg-secondary/40 transition-all hover-lift group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-primary text-sm font-semibold group-hover:text-primary/80 transition-colors">
                  #{b.height.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {timeAgo(b.timestamp)}
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold group-hover:scale-105 transition-transform">
                  {b.tx_count.toLocaleString()}
                  <span className="text-xs text-muted-foreground ml-1">
                    txs
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}