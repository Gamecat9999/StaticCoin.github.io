import LedgerExplorer from "@/components/LedgerExplorer";
import BlocksList from "@/components/BlocksList";

export default function Ledger() {
  return (
    <section id="ledger" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">BlockCoin Ledger</h2>
        
        <LedgerExplorer />
        <BlocksList />
      </div>
    </section>
  );
}
