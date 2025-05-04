export interface Block {
  id: number;
  timestamp: number;
  previousHash: string;
  hash: string;
  data: Transaction[];
  nonce: number;
  miner: string;
  difficulty: number;
  size: number; // in KB
}

export interface Transaction {
  id: string;
  timestamp: number;
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}

export enum TransactionType {
  MINING_REWARD = "MINING_REWARD",
  TRANSFER = "TRANSFER",
  RECEIVE = "RECEIVE",
  SEND = "SEND"
}

export enum TransactionStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  FAILED = "FAILED"
}

export interface BlockchainData {
  blocks: Block[];
  pendingTransactions: Transaction[];
  difficulty: number;
  miningReward: number;
  initialCoins: number;
}

export interface Wallet {
  address: string;
  balance: number;
  transactions: Transaction[];
}

export interface MiningStats {
  hashRate: number;
  blocksMined: number;
  isActive: boolean;
  hashPower: number;
  currentConsoleOutput: string[];
}

export interface MarketData {
  currentPrice: number;
  priceChange: number;
  marketCap: number;
  marketCapRank: number;
  totalSupply: number;
  circulatingSupply: number;
  priceHistory: {
    date: string;
    price: number;
  }[];
}
