import { Block, BlockchainData, Transaction, TransactionStatus, TransactionType, Wallet, MiningStats, MarketData } from "@/types/blockchain";
import { calculateHash, generateWalletAddress, calculateDataSizeInKB } from "./crypto";
import { getBlockchainData, getWalletData, getMiningStats, getMarketData, saveBlockchainData, saveWalletData, saveMiningStats, saveMarketData } from "./storage";

// Initialize blockchain with genesis block if doesn't exist
export const initBlockchain = (): void => {
  // Check if blockchain data already exists
  let blockchainData = getBlockchainData();
  
  // If not, create a new blockchain with genesis block
  if (!blockchainData) {
    const genesisBlock = createGenesisBlock();
    
    blockchainData = {
      blocks: [genesisBlock],
      pendingTransactions: [],
      difficulty: 3,
      miningReward: 5,
      initialCoins: 100
    };
    
    saveBlockchainData(blockchainData);
  }
  
  // Initialize mining stats if they don't exist
  if (!getMiningStats()) {
    const miningStats: MiningStats = {
      hashRate: 0,
      blocksMined: 0,
      isActive: false,
      hashPower: 5,
      currentConsoleOutput: ['> Mining simulation ready.']
    };
    
    saveMiningStats(miningStats);
  }
  
  // Initialize market data if it doesn't exist
  if (!getMarketData()) {
    const marketData: MarketData = {
      currentPrice: 27.84,
      priceChange: 3.2,
      marketCap: 1450000000, // $1.45B
      marketCapRank: 42,
      totalSupply: 21000000, // 21M
      circulatingSupply: 17300000, // 17.3M
      priceHistory: generatePriceHistory()
    };
    
    saveMarketData(marketData);
  }
};

// Create the genesis block for the blockchain
const createGenesisBlock = (): Block => {
  const timestamp = new Date('2023-01-01').getTime();
  const data: Transaction[] = [{
    id: generateTransactionId(),
    timestamp,
    fromAddress: null, // Genesis transaction has no sender
    toAddress: 'BlockCoin Network',
    amount: 100,
    type: TransactionType.MINING_REWARD,
    status: TransactionStatus.CONFIRMED
  }];
  
  const block: Block = {
    id: 0,
    timestamp,
    previousHash: '0'.repeat(64),
    hash: '',
    data,
    nonce: 0,
    miner: 'BlockCoin Network',
    difficulty: 0,
    size: calculateDataSizeInKB(data)
  };
  
  // Calculate the hash of the genesis block
  block.hash = calculateBlockHash(block);
  
  return block;
};

// Calculate the hash of a block
export const calculateBlockHash = (block: Block): string => {
  return calculateHash(
    block.id.toString() +
    block.timestamp.toString() +
    block.previousHash +
    JSON.stringify(block.data) +
    block.nonce.toString()
  );
};

// Add a transaction to the pending transactions list
export const addTransaction = (
  fromAddress: string | null,
  toAddress: string,
  amount: number,
  type: TransactionType
): Transaction | null => {
  if (!toAddress) {
    return null;
  }
  
  // Validate the transaction
  if (fromAddress !== null) {
    const wallet = getWalletData();
    if (!wallet || wallet.balance < amount) {
      return null; // Insufficient funds
    }
  }
  
  const blockchain = getBlockchainData();
  if (!blockchain) return null;
  
  const transaction: Transaction = {
    id: generateTransactionId(),
    timestamp: Date.now(),
    fromAddress,
    toAddress,
    amount,
    type,
    status: TransactionStatus.PENDING
  };
  
  // Add the transaction to pending transactions
  blockchain.pendingTransactions.push(transaction);
  saveBlockchainData(blockchain);
  
  // If it's a transfer, update the wallet balance
  if (fromAddress && fromAddress !== toAddress) {
    const wallet = getWalletData();
    if (wallet && wallet.address === fromAddress) {
      wallet.balance -= amount;
      wallet.transactions.push(transaction);
      saveWalletData(wallet);
    }
  }
  
  return transaction;
};

// Process mining reward
export const processMiningReward = (minerAddress: string): void => {
  const blockchain = getBlockchainData();
  if (!blockchain) return;
  
  const wallet = getWalletData();
  if (!wallet || wallet.address !== minerAddress) return;
  
  // Create mining reward transaction
  const rewardTransaction: Transaction = {
    id: generateTransactionId(),
    timestamp: Date.now(),
    fromAddress: null, // Mining rewards come from the system
    toAddress: minerAddress,
    amount: blockchain.miningReward,
    type: TransactionType.MINING_REWARD,
    status: TransactionStatus.CONFIRMED
  };
  
  // Update wallet
  wallet.balance += blockchain.miningReward;
  wallet.transactions.push(rewardTransaction);
  saveWalletData(wallet);
  
  // Update mining stats
  const miningStats = getMiningStats();
  if (miningStats) {
    miningStats.blocksMined += 1;
    saveMiningStats(miningStats);
  }
};

// Add a new block to the blockchain
export const addBlock = (newBlock: Block): boolean => {
  const blockchain = getBlockchainData();
  if (!blockchain) return false;
  
  // Validate the block
  if (
    newBlock.previousHash !== blockchain.blocks[blockchain.blocks.length - 1].hash ||
    !validateBlockHash(newBlock)
  ) {
    return false;
  }
  
  // Add the block to the chain
  blockchain.blocks.push(newBlock);
  
  // Clear pending transactions that were included in this block
  blockchain.pendingTransactions = [];
  
  saveBlockchainData(blockchain);
  return true;
};

// Validate a block's hash
const validateBlockHash = (block: Block): boolean => {
  const calculatedHash = calculateBlockHash(block);
  return block.hash === calculatedHash;
};

// Generate transaction ID
const generateTransactionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate 6 months of price history data
const generatePriceHistory = (): { date: string, price: number }[] => {
  const history = [];
  const basePrice = 25;
  const now = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate a somewhat realistic price with volatility
    const volatility = 0.05; // 5% daily max change
    const dailyChange = (Math.random() * 2 - 1) * volatility;
    const price = basePrice * (1 + i/100 * (Math.random() * 0.5 + 0.5) + dailyChange);
    
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return history;
};
