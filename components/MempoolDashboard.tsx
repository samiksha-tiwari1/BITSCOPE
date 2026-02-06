"use client";

import MempoolFeed from "./MempoolFeed";
import MempoolFeeChart from "./MempoolFeeChart";

export default function MempoolDashboard() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Mempool Intelligence
        </h1>

        <p className="text-muted-foreground">
          Live view of unconfirmed Bitcoin transactions and fee pressure
        </p>

        <MempoolFeeChart />
        <MempoolFeed />
      </div>
    </main>
  );
}