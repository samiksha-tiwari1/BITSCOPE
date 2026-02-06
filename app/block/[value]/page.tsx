type Block = {
  id: string;
  height: number;
  tx_count: number;
  size: number;
  weight: number;
  timestamp: number;
};

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() / 1000 - ts) / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr ago`;
}

// ---------- Fetch helpers ----------

async function fetchBlockByHash(hash: string): Promise<Block> {
  const res = await fetch(`https://blockstream.info/api/block/${hash}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Block not found");
  return res.json();
}

async function fetchBlockByHeight(height: string): Promise<Block> {
  const hashRes = await fetch(
    `https://blockstream.info/api/block-height/${height}`,
    { cache: "no-store" }
  );

  if (!hashRes.ok) throw new Error("Invalid block height");

  const hash = (await hashRes.text()).trim();
  return fetchBlockByHash(hash);
}

// ---------- Page ----------

export default async function BlockPage({
  params,
}: {
  params: Promise<{ value: string }>; // Next 16
}) {
  const { value } = await params;

  // Detect what user gave: height or hash
  const isHash = value.length === 64;

  const block = isHash
    ? await fetchBlockByHash(value)
    : await fetchBlockByHeight(value);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-semibold tracking-tight">
          Block #{block.height}
        </h1>

        {/* Hash card */}
        <div className="card-elevated rounded-xl p-6 font-mono text-primary break-all">
          {block.id}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat label="Transactions" value={block.tx_count.toLocaleString()} />
          <Stat label="Size" value={`${block.size.toLocaleString()} bytes`} />
          <Stat label="Weight" value={block.weight.toLocaleString()} />
          <Stat label="Mined" value={timeAgo(block.timestamp)} />
        </div>

        {/* Explanation */}
        <div className="card-elevated rounded-xl p-8 text-sm leading-7 text-muted-foreground">
          <p>
            This block was mined{" "}
            <span className="text-foreground font-medium">
              {timeAgo(block.timestamp)}
            </span>{" "}
            and added to the Bitcoin blockchain at height{" "}
            <span className="text-primary font-mono">#{block.height}</span>.
          </p>

          <p className="mt-3">
            It contains{" "}
            <span className="text-foreground font-semibold">
              {block.tx_count.toLocaleString()}
            </span>{" "}
            transactions selected by miners based on fee rate priority.
          </p>

          <p className="mt-3">
            The block size is{" "}
            <span className="text-foreground font-semibold">
              {block.size.toLocaleString()} bytes
            </span>{" "}
            with a total weight of{" "}
            <span className="text-foreground font-semibold">
              {block.weight.toLocaleString()}
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------- Small component ----------

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-elevated rounded-xl p-6 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}