"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMempool } from "@/lib/api";

/* ---------------- Types ---------------- */

type Tx = {
  txid: string;
  fee: number;
  vsize: number;
};

/* ---------------- Helpers ---------------- */

function satPerVByte(fee: number, vsize: number) {
  if (!vsize) return 0;
  return Math.round(fee / vsize);
}

function priority(spv: number) {
  if (spv > 80)
    return {
      label: "HIGH",
      color: "bg-red-500/15 text-red-400 border-red-500/30",
    };

  if (spv > 30)
    return {
      label: "MEDIUM",
      color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    };

  return {
    label: "LOW",
    color: "bg-green-500/15 text-green-400 border-green-500/30",
  };
}

/* ---------------- Component ---------------- */

export default function MempoolFeed() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data: Tx[] = await getMempool();
        setTxs(data.slice(0, 8));
      } catch (e) {
        console.error(e);
        setError("Failed to load mempool transactions");
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Mempool</h3>
        <span className="text-xs text-muted-foreground">
          Live unconfirmed
        </span>
      </div>

      {/* Loading */}
      {loading && txs.length === 0 && (
        <div className="text-sm text-muted-foreground">
          Loading mempool...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Rows */}
      {!loading && !error && (
        <div className="space-y-4">
          {txs.map((tx) => {
            const spv = satPerVByte(tx.fee, tx.vsize);
            const p = priority(spv);

            return (
              <Link
                key={tx.txid}
                href={`/tx/${tx.txid}`}
                className="flex items-center justify-between bg-secondary/40 border border-border rounded-lg px-4 py-3 hover:bg-secondary transition-all"
              >
                {/* Left */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-xs px-2 py-1 rounded border font-medium shrink-0 ${p.color}`}
                  >
                    {p.label}
                  </span>

                  <span className="font-mono text-primary truncate text-sm">
                    {tx.txid}
                  </span>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <div className="font-semibold">
                    {spv} sat/vB
                  </div>
                  <div className="text-xs text-muted-foreground">
                    fee: {tx.fee.toLocaleString()} sats
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}