import HeroSearch from "@/components/HeroSearch";
import LatestBlocks from "@/components/LatestBlocks";
import MempoolFeed from "@/components/MempoolFeed";

export default function Home() {
  return (
    <main className="space-y-12 px-6 pb-16">
      <HeroSearch />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        <LatestBlocks />
        <MempoolFeed />
      </div>
    </main>
  );
}