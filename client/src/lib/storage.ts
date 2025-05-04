import { BlockchainData, Block, Transaction, Wallet, MiningStats, MarketData } from "@/types/blockchain";
import { getActiveWalletId, isWalletActive } from './walletAuth';

// Get the active wallet ID prefix for storage keys
const getWalletPrefix = (): string => {
  const activeWalletId = getActiveWalletId();
  if (!activeWalletId) {
    console.warn('No active wallet ID found. Using default storage.');
    return '';
  }
  return `${activeWalletId}_`;
};

// Key definitions for localStorage
const STORAGE_KEYS = {
  BLOCKCHAIN: (prefix: string) => prefix ? `blockchain_${prefix}` : "blockcoin_blockchain",
  WALLET: (prefix: string) => prefix ? `wallet_${prefix}` : "blockcoin_wallet",
  MINING_STATS: (prefix: string) => prefix ? `miningStats_${prefix}` : "blockcoin_mining_stats",
  MARKET_DATA: (prefix: string) => prefix ? `marketData_${prefix}` : "blockcoin_market_data",
};

// Save blockchain data to localStorage
export const saveBlockchainData = (data: BlockchainData): void => {
  const prefix = getWalletPrefix();
  localStorage.setItem(STORAGE_KEYS.BLOCKCHAIN(prefix), JSON.stringify(data));
};

// Get blockchain data from localStorage
export const getBlockchainData = (): BlockchainData | null => {
  const prefix = getWalletPrefix();
  const data = localStorage.getItem(STORAGE_KEYS.BLOCKCHAIN(prefix));
  return data ? JSON.parse(data) : null;
};

// Save wallet data to localStorage
export const saveWalletData = (wallet: Wallet): void => {
  const prefix = getWalletPrefix();
  localStorage.setItem(STORAGE_KEYS.WALLET(prefix), JSON.stringify(wallet));
};

// Get wallet data from localStorage
export const getWalletData = (): Wallet | null => {
  const prefix = getWalletPrefix();
  const data = localStorage.getItem(STORAGE_KEYS.WALLET(prefix));
  return data ? JSON.parse(data) : null;
};

// Save mining stats to localStorage
export const saveMiningStats = (stats: MiningStats): void => {
  const prefix = getWalletPrefix();
  localStorage.setItem(STORAGE_KEYS.MINING_STATS(prefix), JSON.stringify(stats));
};

// Get mining stats from localStorage
export const getMiningStats = (): MiningStats | null => {
  const prefix = getWalletPrefix();
  const data = localStorage.getItem(STORAGE_KEYS.MINING_STATS(prefix));
  return data ? JSON.parse(data) : null;
};

// Save market data to localStorage
export const saveMarketData = (data: MarketData): void => {
  const prefix = getWalletPrefix();
  localStorage.setItem(STORAGE_KEYS.MARKET_DATA(prefix), JSON.stringify(data));
};

// Get market data from localStorage
export const getMarketData = (): MarketData | null => {
  const prefix = getWalletPrefix();
  const data = localStorage.getItem(STORAGE_KEYS.MARKET_DATA(prefix));
  return data ? JSON.parse(data) : null;
};

// Clear all data for the current wallet
export const clearWalletData = (): void => {
  const prefix = getWalletPrefix();
  if (!prefix) return;
  
  localStorage.removeItem(STORAGE_KEYS.BLOCKCHAIN(prefix));
  localStorage.removeItem(STORAGE_KEYS.WALLET(prefix));
  localStorage.removeItem(STORAGE_KEYS.MINING_STATS(prefix));
  localStorage.removeItem(STORAGE_KEYS.MARKET_DATA(prefix));
};

// Clear all blockchain data (for reset)
export const clearAllData = (): void => {
  clearWalletData();
  
  // Also clear any legacy data
  localStorage.removeItem("blockcoin_blockchain");
  localStorage.removeItem("blockcoin_wallet");
  localStorage.removeItem("blockcoin_mining_stats");
  localStorage.removeItem("blockcoin_market_data");
};
