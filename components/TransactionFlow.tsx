"use client";

import { ArrowRight, ArrowDown } from "lucide-react";

/* ---------- Types ---------- */

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

/* ---------- Component ---------- */

export default function TransactionFlow({
  vin,
  vout,
  fee,
}: {
  vin: TxIn[];
  vout: TxOut[];
  fee: number;
}) {
  const btc = (n: number) => (n / 100000000).toFixed(6);

  const totalIn = vin.reduce(
    (sum, v) => sum + (v.prevout?.value || 0),
    0
  );

  const totalOut = vout.reduce((sum, v) => sum + v.value, 0);

  return (
    <div className="card-elevated rounded-xl p-6 space-y-6 animate-fadeIn">
      <h3 className="cinematic-title text-lg">Transaction Flow</h3>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-start">
        {/* ---------- Inputs ---------- */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Inputs
          </p>

          {vin.map((input, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="min-w-0 max-w-[70%] break-all text-xs font-mono text-primary">
                {input.prevout?.scriptpubkey_address || "Coinbase"}
              </div>

              <div className="whitespace-nowrap text-xs font-mono text-green-400 font-semibold text-right">
                {btc(input.prevout?.value || 0)} BTC
              </div>
            </div>
          ))}

          <div className="p-3 rounded-lg bg-muted/50 border border-dashed text-center">
            <span className="text-xs font-mono text-muted-foreground">
              Total In: {btc(totalIn)} BTC
            </span>
          </div>
        </div>

        {/* ---------- Arrow + Fee ---------- */}
        <div className="flex items-center justify-center">
          <div className="hidden md:flex flex-col items-center gap-2">
            <ArrowRight className="h-7 w-7 text-primary" />
            <span className="text-[11px] font-mono text-muted-foreground">
              fee: {btc(fee)} BTC
            </span>
          </div>

          <div className="md:hidden flex flex-col items-center gap-2">
            <ArrowDown className="h-7 w-7 text-primary" />
            <span className="text-[11px] font-mono text-muted-foreground">
              fee: {btc(fee)} BTC
            </span>
          </div>
        </div>

        {/* ---------- Outputs ---------- */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Outputs
          </p>

          {vout.map((output, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <div className="min-w-0 max-w-[70%] break-all text-xs font-mono text-primary">
                {output.scriptpubkey_address || "Unknown"}
              </div>

              <div className="whitespace-nowrap text-xs font-mono text-red-400 font-semibold text-right">
                {btc(output.value)} BTC
              </div>
            </div>
          ))}

          <div className="p-3 rounded-lg bg-muted/50 border border-dashed text-center">
            <span className="text-xs font-mono text-muted-foreground">
              Total Out: {btc(totalOut)} BTC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}