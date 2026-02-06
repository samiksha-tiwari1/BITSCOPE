"use client";

import { ArrowRight, ArrowDown } from "lucide-react";

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
    <div className="card-elevated rounded-xl p-5 space-y-5 animate-fade-in">
      <h3 className="font-semibold text-sm">Transaction Flow</h3>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        {/* Inputs */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Inputs
          </p>

          {vin.map((input, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <span className="text-xs font-mono truncate">
                {input.prevout?.scriptpubkey_address || "Coinbase"}
              </span>
              <span className="text-xs font-mono text-green-400 font-semibold">
                {btc(input.prevout?.value || 0)} BTC
              </span>
            </div>
          ))}

          <div className="p-3 rounded-lg bg-muted/50 border border-dashed text-center">
            <span className="text-xs font-mono text-muted-foreground">
              Total In: {btc(totalIn)} BTC
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <div className="hidden md:flex flex-col items-center gap-1">
            <ArrowRight className="h-6 w-6 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground">
              fee: {btc(fee)} BTC
            </span>
          </div>

          <div className="md:hidden flex flex-col items-center gap-1">
            <ArrowDown className="h-6 w-6 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground">
              fee: {btc(fee)} BTC
            </span>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            Outputs
          </p>

          {vout.map((output, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
            >
              <span className="text-xs font-mono truncate">
                {output.scriptpubkey_address || "Unknown"}
              </span>
              <span className="text-xs font-mono text-red-400 font-semibold">
                {btc(output.value)} BTC
              </span>
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