import PageSection from "@/components/PageSection";
import BlockChart from "@/components/BlockChart";
import BlocksList from "@/components/BlocksList";

export default function BlocksPage() {
  return (
    <PageSection>
      <BlockChart />

      <div className="card-elevated rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Latest Blocks</h2>
        <BlocksList />
      </div>
    </PageSection>
  );
}