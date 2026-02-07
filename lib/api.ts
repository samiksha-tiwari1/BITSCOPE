const API = process.env.NEXT_PUBLIC_API_URL as string;

// Generic safe fetch with retry and proper typing
async function safeFetch<T>(path: string, retries = 2): Promise<T[]> {
  try {
    const res = await fetch(`${API}${path}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`API ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return safeFetch<T>(path, retries - 1);
    }
    return [];
  }
}

// Types
export type Block = {
  id: string;
  height: number;
  timestamp: number;
  tx_count: number;
};

export type MempoolTx = {
  txid: string;
  fee: number;
  vsize: number;
};

export function getBlocks() {
  return safeFetch<Block>("/blocks");
}

export function getMempool() {
  return safeFetch<MempoolTx>("/mempool");
}

export async function getTx(id: string) {
  const res = await fetch(`${API}/tx/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Transaction not found");
  }

  return res.json();
}