"use client";

import TransactionFlow from "./TransactionFlow";
import { useState, useEffect, useCallback } from "react";

/* ---------- Types ---------- */

type TxStatus = {
  confirmed: boolean;
};

type TxIn = {
  prevout?: {
    scriptpubkey_address?: string;
    value: number;
  };
};

type TxOut = {
  scriptpubkey_address?: string;
  value: number;
};

type Tx = {
  txid: string;
  size: number;
  fee: number;
  status: TxStatus;
  vin: TxIn[];
  vout: TxOut[];
};

type MempoolItem = {
  txid: string;
  fee: number;
  vsize: number;
};

/* ---------- Helpers ---------- */

const btc = (n: number) => (n / 100000000).toFixed(6);

/* ---------- Component ---------- */

export default function TransactionDashboard() {
  const [hash, setHash] = useState("");
  const [tx, setTx] = useState<Tx | null>(null);
  const [examples, setExamples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------- Load Transaction ---------- */

  const load = useCallback(
    async (id?: string) => {
      const h = id || hash;
      if (!h) return;

      setLoading(true);
      setError("");
      setTx(null);

      try {
        const res = await fetch(`https://blockstream.info/api/tx/${h}`);
        if (!res.ok) throw new Error();

        const data: unknown = await res.json();

        // Runtime validation
        if (
          typeof data === "object" &&
          data !== null &&
          "txid" in data &&
          "vin" in data &&
          "vout" in data
        ) {
          setTx(data as Tx);
          setHash(h);
        } else {
          throw new Error();
        }
      } catch {
        setError("Invalid or unknown transaction hash");
      }

      setLoading(false);
    },
    [hash]
  );

  /* ---------- Load Live Mempool Examples ---------- */

  useEffect(() => {
    fetch("https://blockstream.info/api/mempool/recent")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) {
          const items: MempoolItem[] = data;
          setExamples(items.slice(0, 3).map((t) => t.txid));
        } else {
          setExamples([]);
        }
      });
  }, []);

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-72 bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            Transaction Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Decode any Bitcoin transaction in real time
          </p>
        </div>

        {/* Search */}
        <div className="card-elevated rounded-2xl p-6 flex flex-col md:flex-row gap-4">
          <input
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Enter transaction hash..."
            className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm"
          />

          <button
            onClick={() => load()}
            disabled={loading}
            className={`px-8 rounded-lg font-semibold transition-all ${
              loading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-black hover:scale-105"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-sm font-medium">{error}</div>
        )}

        {/* Idle examples */}
        {!tx && !loading && !error && examples.length > 0 && (
          <div className="card-elevated rounded-xl p-10 text-center space-y-6">
            <p className="text-muted-foreground">
              Try real Bitcoin transactions from live mempool:
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {examples.map((sample) => (
                <button
                  key={sample}
                  onClick={() => load(sample)}
                  className="font-mono text-xs px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
                >
                  {sample.slice(0, 26)}...
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {tx && (
          <>
            {/* Header */}
            <div className="card-elevated rounded-xl p-6 flex justify-between flex-col md:flex-row gap-4">
              <span className="font-mono text-primary break-all">
                {tx.txid}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  tx.status.confirmed
                    ? "border-green-500/30 text-green-400 bg-green-500/10"
                    : "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                }`}
              >
                {tx.status.confirmed ? "Confirmed" : "Pending"}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Size", value: `${tx.size} bytes` },
                { label: "Fee", value: `${btc(tx.fee)} BTC` },
                {
                  label: "Fee Rate",
                  value: `${(tx.fee / tx.size).toFixed(2)} sat/vB`,
                },
                { label: "Inputs", value: tx.vin.length.toString() },
              ].map((s, i) => (
                <div key={i} className="card-elevated rounded-xl p-6 text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    {s.label}
                  </p>
                  <p className="font-semibold text-lg">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Flow */}
            <TransactionFlow vin={tx.vin} vout={tx.vout} fee={tx.fee} />
          </>
        )}
      </div>
    </div>
  );
}