import Link from "next/link";

type AddressStats = {
  chain_stats: {
    funded_txo_sum: number;
    spent_txo_sum: number;
    tx_count: number;
  };
};

type Tx = {
  txid: string;
  fee: number;
  size: number;
};

const btc = (n: number) => (n / 100000000).toFixed(6);

//  FIX for Blockstream legacy bug
async function getAddress(addr: string): Promise<AddressStats> {
  const res = await fetch(
    `https://blockstream.info/api/address/${addr}`,
    { cache: "no-store" }
  );

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    // Blockstream lies with 400 for some valid addresses
    return {
      chain_stats: {
        funded_txo_sum: 0,
        spent_txo_sum: 0,
        tx_count: 0,
      },
    };
  }
}

// Always works for every address
async function getTxs(addr: string): Promise<Tx[]> {
  const res = await fetch(
    `https://blockstream.info/api/address/${addr}/txs/chain`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  return res.json();
}

export default async function AddressPage({
  params,
}: {
  params: { addr: string };
}) {
  const { addr } = params;

  const stats = await getAddress(addr);
  const txs = await getTxs(addr);

  const balance =
    stats.chain_stats.funded_txo_sum -
    stats.chain_stats.spent_txo_sum;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-4xl font-semibold tracking-tight">
          Address
        </h1>

        <div className="card-elevated rounded-xl p-6 font-mono text-primary break-all">
          {addr}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Stat label="Balance" value={`${btc(balance)} BTC`} />
          <Stat
            label="Transactions"
            value={stats.chain_stats.tx_count.toLocaleString()}
          />
          <Stat
            label="Total Received"
            value={`${btc(stats.chain_stats.funded_txo_sum)} BTC`}
          />
        </div>

        {/* Transactions */}
        <div className="card-elevated rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-lg">Transactions</h3>

          {txs.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No transactions found.
            </p>
          )}

          {txs.map((tx) => (
            <Link
              key={tx.txid}
              href={`/tx/${tx.txid}`}
              className="block p-3 rounded-lg border border-border hover:bg-muted transition"
            >
              <div className="font-mono text-xs break-all text-primary">
                {tx.txid}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Fee: {btc(tx.fee)} BTC · Size: {tx.size} bytes
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated rounded-xl p-6 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}