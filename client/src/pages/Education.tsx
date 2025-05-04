import EducationCards from "@/components/EducationCards";
import FAQ from "@/components/FAQ";

export default function Education() {
  return (
    <section id="education" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Learn About Cryptocurrency</h2>
        
        <EducationCards />
        <FAQ />
        
        <div className="mt-12 space-y-12">
          <div id="blockchain" className="scroll-mt-20">
            <h3 className="text-2xl font-bold mb-4">Blockchain Technology</h3>
            <div className="bg-light p-6 rounded-lg">
              <p className="mb-4">
                Blockchain is a decentralized, distributed ledger technology that records transactions across many computers. 
                This ensures that the record cannot be altered retroactively without the alteration of all subsequent blocks.
              </p>
              <p className="mb-4">
                Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data. By design, 
                a blockchain is resistant to modification of the data. Once recorded, the data in any given block cannot be 
                altered retroactively without altering all subsequent blocks.
              </p>
              <p>
                This makes blockchains secure by design and exemplifies a distributed computing system with high Byzantine 
                fault tolerance. The blockchain is managed by a peer-to-peer network collectively adhering to a protocol for 
                validating new blocks.
              </p>
            </div>
          </div>
          
          <div id="mining" className="scroll-mt-20">
            <h3 className="text-2xl font-bold mb-4">The Mining Process</h3>
            <div className="bg-light p-6 rounded-lg">
              <p className="mb-4">
                Mining is the process of adding transaction records to the cryptocurrency's public ledger (blockchain). 
                The ledger of past transactions is called the blockchain as it is a chain of blocks.
              </p>
              <p className="mb-4">
                Miners use special software to solve mathematical problems that both confirm legitimate transactions 
                (prevent double-spending) and create new cryptocurrency tokens through a reward mechanism.
              </p>
              <p>
                Mining requires powerful computers and a lot of energy, and the difficulty of mining adjusts over time 
                to ensure a steady creation rate of new blocks regardless of how much computing power is on the network.
              </p>
            </div>
          </div>
          
          <div id="wallets" className="scroll-mt-20">
            <h3 className="text-2xl font-bold mb-4">Understanding Cryptocurrency Wallets</h3>
            <div className="bg-light p-6 rounded-lg">
              <p className="mb-4">
                A cryptocurrency wallet is a digital wallet that stores the public and private keys needed to make 
                cryptocurrency transactions. The wallet also keeps track of your cryptocurrency balance which is 
                derived from the blockchain.
              </p>
              <p className="mb-4">
                There are several types of wallets:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Hot Wallets</strong>: Connected to the internet (mobile apps, desktop software)</li>
                <li><strong>Cold Wallets</strong>: Offline storage (hardware devices, paper wallets)</li>
                <li><strong>Custodial Wallets</strong>: Third-party services manage your keys</li>
                <li><strong>Non-custodial Wallets</strong>: You control your private keys</li>
              </ul>
              <p>
                The private key is like your password - it proves your ownership of your cryptocurrency and allows you to make transactions. 
                Never share your private key with anyone, as whoever has it can access and transfer your funds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
