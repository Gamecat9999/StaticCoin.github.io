import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { getBlockchainData, getMiningStats, saveMiningStats, getWalletData } from "@/lib/storage";
import { MiningStats, Block, Transaction, TransactionType, TransactionStatus } from "@/types/blockchain";
import { calculateBlockHash } from "@/lib/blockchainUtils";
import { processMiningReward, addBlock } from "@/lib/blockchainUtils";
import { formatHash } from "@/lib/crypto";

export default function MiningSimulation() {
  const [miningStats, setMiningStats] = useState<MiningStats | null>(null);
  const [blockchain, setBlockchain] = useState(getBlockchainData());
  const [hashRate, setHashRate] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const workerRef = useRef<Worker | null>(null);
  const consoleEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load mining stats and blockchain data
    const stats = getMiningStats();
    if (stats) {
      setMiningStats(stats);
    }

    const blockchainData = getBlockchainData();
    if (blockchainData) {
      setBlockchain(blockchainData);
      setBlocks(blockchainData.blocks.slice(-3)); // Get last 3 blocks
    }

    return () => {
      // Cleanup worker on unmount
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // Auto-scroll the console to the bottom when it updates
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [miningStats?.currentConsoleOutput]);

  // Handle mining toggle
  const handleMiningToggle = (checked: boolean) => {
    if (!miningStats || !blockchain) return;

    const updatedStats = { ...miningStats, isActive: checked };
    setMiningStats(updatedStats);
    saveMiningStats(updatedStats);

    if (checked) {
      startMining();
    } else {
      stopMining();
    }
  };

  // Handle hash power change
  const handleHashPowerChange = (value: number[]) => {
    if (!miningStats) return;
    
    const hashPower = value[0];
    const updatedStats = { ...miningStats, hashPower };
    setMiningStats(updatedStats);
    saveMiningStats(updatedStats);
  };

  // Start the mining process
  const startMining = () => {
    if (!blockchain || !miningStats) return;

    // Update console
    updateConsole(['> Mining initialized.', '> Calculating hash...']);

    // Create a new Worker if it doesn't exist
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL('../workers/miningWorker.ts', import.meta.url), { type: 'module' });
      
      // Listen for messages from the worker
      workerRef.current.onmessage = (event) => {
        const { type, hashRate, hash, nonce } = event.data;
        
        if (type === 'progress') {
          setHashRate(hashRate);
          updateConsole([`> Mining at ${hashRate} H/s`, `> Current nonce: ${nonce}`]);
        } else if (type === 'success') {
          handleMiningSuccess(hash, nonce);
        }
      };
    }

    // Prepare block data for mining
    const lastBlock = blockchain.blocks[blockchain.blocks.length - 1];
    const wallet = getWalletData();
    if (!wallet) return;

    const pendingTransactions = [...blockchain.pendingTransactions];
    
    // If there are no pending transactions, create one (mining reward)
    if (pendingTransactions.length === 0) {
      pendingTransactions.push({
        id: Math.random().toString(36).substring(2),
        timestamp: Date.now(),
        fromAddress: null,
        toAddress: wallet.address,
        amount: blockchain.miningReward,
        type: TransactionType.MINING_REWARD,
        status: TransactionStatus.PENDING
      });
    }

    const blockData = {
      id: lastBlock.id + 1,
      timestamp: Date.now(),
      previousHash: lastBlock.hash,
      data: pendingTransactions,
      nonce: 0,
      miner: wallet.address,
      difficulty: blockchain.difficulty
    };

    // Start the worker with the block data
    workerRef.current.postMessage({
      blockData: JSON.stringify(blockData),
      difficulty: blockchain.difficulty,
      hashPower: miningStats.hashPower
    });
  };

  // Stop the mining process
  const stopMining = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    updateConsole(['> Mining stopped.']);
  };

  // Handle successful mining
  const handleMiningSuccess = (hash: string, nonce: number) => {
    if (!blockchain || !miningStats) return;

    const wallet = getWalletData();
    if (!wallet) return;

    // Create the new block
    const lastBlock = blockchain.blocks[blockchain.blocks.length - 1];
    const newBlock: Block = {
      id: lastBlock.id + 1,
      timestamp: Date.now(),
      previousHash: lastBlock.hash,
      hash: hash,
      data: [...blockchain.pendingTransactions],
      nonce: nonce,
      miner: wallet.address,
      difficulty: blockchain.difficulty,
      size: Math.random() * 1 + 1.5 // Random size between 1.5 and 2.5 KB
    };

    // Add the block to the blockchain
    const success = addBlock(newBlock);
    
    if (success) {
      // Process mining reward
      processMiningReward(wallet.address);
      
      // Update the local state
      const updatedBlockchain = getBlockchainData();
      if (updatedBlockchain) {
        setBlockchain(updatedBlockchain);
        setBlocks(updatedBlockchain.blocks.slice(-3)); // Get last 3 blocks
      }
      
      // Update mining stats
      const updatedStats = getMiningStats();
      if (updatedStats) {
        setMiningStats(updatedStats);
      }
      
      // Update console
      updateConsole([
        '> Block successfully mined!',
        `> Block #${newBlock.id} added to the blockchain`,
        `> Hash: ${formatHash(hash)}`,
        `> Reward: ${blockchain.miningReward} BC received`
      ]);
      
      // Restart mining process
      setTimeout(() => {
        if (miningStats.isActive) {
          startMining();
        }
      }, 2000);
    }
  };

  // Update console output
  const updateConsole = (lines: string[]) => {
    if (!miningStats) return;
    
    const updatedStats = {
      ...miningStats,
      currentConsoleOutput: lines
    };
    
    setMiningStats(updatedStats);
    saveMiningStats(updatedStats);
  };

  if (!miningStats || !blockchain) {
    return <div className="text-center py-8">Loading mining simulation...</div>;
  }

  return (
    <Card className="bg-white rounded-xl shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Mining Control Center</h3>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-medium">Mining Status</h4>
            <p className="text-sm opacity-70">Simulates hashing operations</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="mining-toggle" 
              checked={miningStats.isActive}
              onCheckedChange={handleMiningToggle}
            />
            <Label htmlFor="mining-toggle">
              {miningStats.isActive ? 'Active' : 'Inactive'}
            </Label>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Hashing Power</h4>
          <div className="flex items-center">
            <div className="flex-grow mr-3">
              <Slider
                value={[miningStats.hashPower]}
                min={1}
                max={10}
                step={1}
                onValueChange={handleHashPowerChange}
              />
            </div>
            <span className="font-mono">{miningStats.hashPower}</span>
          </div>
          <p className="text-sm opacity-70 mt-1">Higher values use more CPU but mine faster</p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Mining Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-light rounded-lg p-3">
              <p className="text-sm opacity-70">Hash Rate</p>
              <p className="font-mono text-lg">{hashRate} H/s</p>
            </div>
            <div className="bg-light rounded-lg p-3">
              <p className="text-sm opacity-70">Blocks Mined</p>
              <p className="font-mono text-lg">{miningStats.blocksMined}</p>
            </div>
            <div className="bg-light rounded-lg p-3">
              <p className="text-sm opacity-70">Difficulty</p>
              <p className="font-mono text-lg">{blockchain.difficulty}</p>
            </div>
            <div className="bg-light rounded-lg p-3">
              <p className="text-sm opacity-70">Reward</p>
              <p className="font-mono text-lg">{blockchain.miningReward} BC</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Mining Console</h4>
          <div className="bg-dark text-green-400 font-mono text-sm p-3 rounded overflow-auto h-20 w-full">
            {miningStats.currentConsoleOutput.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
