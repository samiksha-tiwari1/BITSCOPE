import BlocksList from "@/components/BlocksList";
import BlockChart from "@/components/BlockChart";

export default function BlocksPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <BlockChart />
        <BlocksList />
      </div>
    </main>
  );
}