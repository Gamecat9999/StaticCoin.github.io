import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getBlockchainData } from '@/lib/storage';
import { Block } from '@/types/blockchain';
import { formatHash } from '@/lib/crypto';

export default function BlockchainVisualization() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentlyMining, setCurrentlyMining] = useState(false);
  const [miningBlock, setMiningBlock] = useState<Partial<Block> | null>(null);

  // Load blockchain data
  useEffect(() => {
    const blockchain = getBlockchainData();
    if (blockchain) {
      // Get the last 4 blocks
      setBlocks(blockchain.blocks.slice(-4));

      // Check if mining is active from localStorage
      const miningStats = JSON.parse(localStorage.getItem('blockcoin_mining_stats') || '{}');
      setCurrentlyMining(miningStats?.isActive || false);

      if (miningStats?.isActive) {
        // Create a "mining in progress" block
        const lastBlock = blockchain.blocks[blockchain.blocks.length - 1];
        setMiningBlock({
          id: lastBlock.id + 1,
          previousHash: lastBlock.hash,
          data: blockchain.pendingTransactions
        });
      } else {
        setMiningBlock(null);
      }
    }

    // Poll for updates
    const interval = setInterval(() => {
      const blockchain = getBlockchainData();
      if (blockchain) {
        setBlocks(blockchain.blocks.slice(-4));
        
        const miningStats = JSON.parse(localStorage.getItem('blockcoin_mining_stats') || '{}');
        setCurrentlyMining(miningStats?.isActive || false);

        if (miningStats?.isActive) {
          const lastBlock = blockchain.blocks[blockchain.blocks.length - 1];
          setMiningBlock({
            id: lastBlock.id + 1,
            previousHash: lastBlock.hash,
            data: blockchain.pendingTransactions
          });
        } else {
          setMiningBlock(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white rounded-xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Blockchain Visualization</h3>
        
        <div className="bg-light rounded-lg p-4 h-96 overflow-auto">
          <div className="flex flex-col items-center">
            <div className="block-chain w-full">
              {blocks.map((block, index) => (
                <div key={block.id} className="flex flex-col items-center mb-6">
                  <div className="node bg-primary text-white p-4 rounded-lg shadow-lg w-64">
                    <div className="font-bold mb-1">
                      {block.id === 0 ? 'Genesis Block' : `Block #${block.id}`}
                    </div>
                    <div className="text-xs opacity-80 mb-1">Hash: {formatHash(block.hash)}</div>
                    <div className="text-xs">Transactions: {block.data.length}</div>
                  </div>
                  <div className="h-8 w-px bg-primary"></div>
                </div>
              ))}
              
              {currentlyMining && miningBlock && (
                <div className="flex flex-col items-center">
                  <div className="node mining-animation text-white p-4 rounded-lg shadow-lg w-64">
                    <div className="font-bold mb-1">Mining in progress...</div>
                    <div className="text-xs opacity-80 mb-1">
                      Prev: {miningBlock.previousHash ? formatHash(miningBlock.previousHash) : ''}
                    </div>
                    <div className="text-xs">
                      Transactions: {miningBlock.data ? miningBlock.data.length : 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">How Mining Works</h4>
          <p className="text-sm opacity-70">
            Mining is the process of adding transaction records to the blockchain. Miners use computer power to solve 
            complex mathematical problems. The first to solve it gets to add a new block and receives a reward.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
