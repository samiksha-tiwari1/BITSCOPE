"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Tx = {
  txid: string;
  fee: number;
  vsize: number;
};

function satPerVByte(fee: number, vsize: number) {
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

export default function MempoolFeed() {
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    fetch("https://blockstream.info/api/mempool/recent")
      .then((r) => r.json())
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [];
        setTxs(normalized.slice(0, 8));
      });
  }, []);

  return (
    <div className="card-elevated rounded-xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold">Mempool</h3>
        <span className="text-xs text-muted-foreground">
          Live unconfirmed
        </span>
      </div>

      <div className="space-y-4">
        {txs.map((tx) => {
          const spv = satPerVByte(tx.fee, tx.vsize);
          const p = priority(spv);

          return (
            <Link
              href={`/tx/${tx.txid}`}
              key={tx.txid}
              className="flex items-center justify-between bg-secondary/40 border border-border rounded-lg px-4 py-3 hover:bg-secondary transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`text-xs px-2 py-1 rounded border font-medium shrink-0 ${p.color}`}
                >
                  {p.label}
                </span>

                <span className="font-mono text-primary truncate">
                  {tx.txid}
                </span>
              </div>

              <div className="text-right shrink-0">
                <div className="font-semibold">{spv} sat/vB</div>
                <div className="text-xs text-muted-foreground">
                  fee: {tx.fee} sats
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}