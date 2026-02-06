"use client";

import { useState } from "react";

/* ---------- Types ---------- */

type TxStatus = {
  confirmed: boolean;
};

type Transaction = {
  txid: string;
  fee: number;
  status: TxStatus;
};

type ChainStats = {
  tx_count: number;
  funded_txo_sum: number;
  spent_txo_sum: number;
};

type Overview = {
  chain_stats: ChainStats;
};

type AddressData = {
  overview: Overview;
  txs: Transaction[];
};

/* ---------- Component ---------- */

export default function AddressForm() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- Helpers ---------- */

  const satoshiToBTC = (sats: number) =>
    (sats / 100000000).toFixed(6);

  const calculateRiskScore = (stats: ChainStats) => {
    let score = 0;
    if (stats.tx_count > 1000) score += 30;
    if (stats.funded_txo_sum > 100000000000) score += 30;
    if (stats.tx_count < 5) score += 20;
    if (stats.tx_count > 200 && stats.funded_txo_sum < 5000000000)
      score += 20;
    return Math.min(score, 100);
  };

  const shortAddr = (a: string) =>
    a.slice(0, 10) + "..." + a.slice(-6);

  const riskColor = (score: number) => {
    if (score < 30) return "bg-green-600";
    if (score < 70) return "bg-yellow-600";
    return "bg-red-600";
  };

  /* ---------- Fetch ---------- */

  const fetchAddress = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setData(null);

      const overview: Overview = await fetch(
        `https://blockstream.info/api/address/${address}`
      ).then((res) => res.json());

      const txs: Transaction[] = await fetch(
        `https://blockstream.info/api/address/${address}/txs`
      ).then((res) => res.json());

      setData({ overview, txs });
    } catch {
      alert("Invalid Bitcoin address or network issue");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-96 h-72 bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Bitcoin Address Intelligence
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Analyze any Bitcoin wallet to understand its balance behavior,
            transaction footprint, and on-chain activity in real time.
          </p>
        </div>

        {/* Search */}
        <div className="card-elevated rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchAddress()}
              placeholder="Enter BTC address..."
              className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none"
            />

            <button
              onClick={fetchAddress}
              className="px-8 rounded-lg font-semibold bg-primary text-black hover:scale-105 transition-all"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>

          {!data && (
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              <div className="rounded-xl border border-border p-5 bg-secondary/30">
                <p className="text-sm font-semibold mb-3">What this shows</p>
                <ul className="text-xs text-muted-foreground space-y-2 leading-6">
                  <li>• Total balance movement</li>
                  <li>• Transaction frequency pattern</li>
                  <li>• Wallet activity footprint</li>
                  <li>• Behavioral risk indicators</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border p-5 bg-secondary/30">
                <p className="text-sm font-semibold mb-3">Try a real address</p>
                <button
                  onClick={() =>
                    setAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
                  }
                  className="font-mono text-xs text-primary/70 hover:text-primary text-left"
                >
                  Satoshi’s Genesis Wallet
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {data && (
          <div className="space-y-8">
            <div className="card-elevated rounded-xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-muted-foreground text-sm">Address</p>
                  <p className="font-mono text-lg">
                    {shortAddr(address)}
                  </p>
                </div>

                <div
                  className={`px-5 py-2 rounded text-white font-semibold ${riskColor(
                    calculateRiskScore(data.overview.chain_stats)
                  )}`}
                >
                  Risk {calculateRiskScore(data.overview.chain_stats)} / 100
                </div>
              </div>

              <div className="grid grid-cols-3 text-center gap-6">
                <Stat
                  label="Transactions"
                  value={data.overview.chain_stats.tx_count.toString()}
                />
                <Stat
                  label="Received"
                  value={`${satoshiToBTC(
                    data.overview.chain_stats.funded_txo_sum
                  )} BTC`}
                />
                <Stat
                  label="Spent"
                  value={`${satoshiToBTC(
                    data.overview.chain_stats.spent_txo_sum
                  )} BTC`}
                />
              </div>
            </div>

            <div className="card-elevated rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">
                Recent Transactions
              </h2>

              <div className="rounded-lg border border-border overflow-hidden">
                {data.txs.slice(0, 10).map((tx) => (
                  <div
                    key={tx.txid}
                    className="grid grid-cols-3 p-4 border-b border-border text-sm"
                  >
                    <div className="font-mono truncate">
                      {tx.txid}
                    </div>
                    <div>Fee: {tx.fee}</div>
                    <div
                      className={
                        tx.status.confirmed
                          ? "text-green-400"
                          : "text-yellow-400"
                      }
                    >
                      {tx.status.confirmed
                        ? "Confirmed"
                        : "Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small Stat Component ---------- */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated rounded-xl p-6 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}