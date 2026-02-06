"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;

    // ⭐ THE FIX — sanitize like real explorers
    const cleaned = query.replace(/[^a-zA-Z0-9]/g, "");
    const q = cleaned.trim();

    setLoading(true);

    try {
      // 1️ Block height (numbers only)
      if (/^\d+$/.test(q)) {
        router.push(`/block/${q}`);
        return;
      }

      // 2️ Bitcoin address (legacy + bc1)
      if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(q)) {
        router.push(`/address/${q}`);
        return;
      }

      // 3️ 64 hex = tx OR block hash
      if (/^[a-fA-F0-9]{64}$/.test(q)) {
        // Try tx first
        const txRes = await fetch(`https://blockstream.info/api/tx/${q}`);
        if (txRes.ok) {
          router.push(`/tx/${q}`);
          return;
        }

        // Otherwise it's block hash → convert to height
        const blockRes = await fetch(`https://blockstream.info/api/block/${q}`);
        if (blockRes.ok) {
          const block = await blockRes.json();
          router.push(`/block/${block.height}`);
          return;
        }
      }

      alert("Unrecognized Bitcoin data");
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-12 md:py-20 px-4">
      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Bitcoin <span className="text-gradient">Intelligence</span>
        </h1>

        <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
          <Search className="ml-4 h-5 w-5 text-muted-foreground" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search address, tx hash, block height, or block hash..."
            className="flex-1 bg-transparent px-4 py-3 font-mono text-sm focus:outline-none"
          />

          <button
            onClick={handleSearch}
            className="m-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center gap-2"
          >
            {loading ? "..." : "Search"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}