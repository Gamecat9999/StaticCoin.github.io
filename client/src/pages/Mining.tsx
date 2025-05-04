import MiningSimulation from "@/components/MiningSimulation";
import BlockchainVisualization from "@/components/BlockchainVisualization";

export default function Mining() {
  return (
    <section id="mining" className="py-16 bg-gradient-to-b from-white to-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Mining Simulation</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MiningSimulation />
          <BlockchainVisualization />
        </div>
      </div>
    </section>
  );
}
