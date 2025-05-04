import { generateWalletAddress } from './crypto';
import { BlockchainData, MiningStats, Wallet } from '@/types/blockchain';

// Word list for generating passphrases (BIP39 inspired word list - abbreviated version)
const WORD_LIST = [
  'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
  'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
  'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
  'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
  'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
  'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'arrive', 'arrow', 'art', 'artefact', 'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset',
  'assist', 'assume', 'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
  'audit', 'august', 'aunt', 'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake',
  'aware', 'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon', 'badge',
  'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely', 'bargain'
];

// Generate a random passphrase with the specified number of words
export function generatePassphrase(wordCount: number = 10): string {
  const passphrase: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    passphrase.push(WORD_LIST[randomIndex]);
  }
  
  return passphrase.join(' ');
}

// Generate a deterministic wallet address from the passphrase
export function deriveWalletAddress(passphrase: string): string {
  // Simple hash function (not cryptographically secure)
  let hash = 0;
  for (let i = 0; i < passphrase.length; i++) {
    const char = passphrase.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and ensure it starts with 0x
  return '0x' + Math.abs(hash).toString(16).padStart(40, '0');
}

// Create a wallet from a passphrase
export function createWalletFromPassphrase(passphrase: string): Wallet {
  const address = deriveWalletAddress(passphrase);
  
  return {
    address,
    balance: 100, // starting balance
    transactions: []
  };
}

// Initialize blockchain data for a new wallet
export function initializeBlockchainData(walletAddress: string): BlockchainData {
  return {
    blocks: [
      // Genesis block will be created by the initBlockchain function when accessed
    ],
    pendingTransactions: [],
    difficulty: 2,
    miningReward: 50,
    initialCoins: 100
  };
}

// Initialize mining stats for a new wallet
export function initializeMiningStats(): MiningStats {
  return {
    hashRate: 0,
    blocksMined: 0,
    isActive: false,
    hashPower: 5,
    currentConsoleOutput: []
  };
}

// Store wallet data using the passphrase as a key
export function storeWalletData(passphrase: string, wallet: Wallet): void {
  const walletId = deriveWalletAddress(passphrase);
  localStorage.setItem(`wallet_${walletId}`, JSON.stringify(wallet));
  
  // Store the initial blockchain and mining data
  const blockchainData = initializeBlockchainData(wallet.address);
  const miningStats = initializeMiningStats();
  
  localStorage.setItem(`blockchain_${walletId}`, JSON.stringify(blockchainData));
  localStorage.setItem(`miningStats_${walletId}`, JSON.stringify(miningStats));
  localStorage.setItem(`marketData_${walletId}`, localStorage.getItem('blockcoin_market_data') || '{}');
}

// Load wallet using a passphrase
export function loadWalletWithPassphrase(passphrase: string): {
  success: boolean;
  message: string;
  wallet?: Wallet;
} {
  try {
    const walletId = deriveWalletAddress(passphrase);
    const walletData = localStorage.getItem(`wallet_${walletId}`);
    
    if (!walletData) {
      return {
        success: false,
        message: 'Wallet not found. Please check your passphrase or create a new wallet.'
      };
    }
    
    const wallet = JSON.parse(walletData) as Wallet;
    
    // Store the active wallet ID in session storage
    sessionStorage.setItem('activeWalletId', walletId);
    sessionStorage.setItem('isLoggedIn', 'true');
    
    return {
      success: true,
      message: 'Wallet loaded successfully',
      wallet
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error loading wallet: ' + (error as Error).message
    };
  }
}

// Create a new wallet with a generated passphrase
export function createNewWallet(): {
  success: boolean;
  message: string;
  passphrase?: string;
  wallet?: Wallet;
} {
  try {
    // Generate a new passphrase
    const passphrase = generatePassphrase();
    
    // Create a wallet from the passphrase
    const wallet = createWalletFromPassphrase(passphrase);
    
    // Store the wallet data
    storeWalletData(passphrase, wallet);
    
    // Set as active wallet
    const walletId = deriveWalletAddress(passphrase);
    sessionStorage.setItem('activeWalletId', walletId);
    sessionStorage.setItem('isLoggedIn', 'true');
    
    return {
      success: true,
      message: 'Wallet created successfully',
      passphrase,
      wallet
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error creating wallet: ' + (error as Error).message
    };
  }
}

// Check if user is logged in (has an active wallet)
export function isWalletActive(): boolean {
  return sessionStorage.getItem('isLoggedIn') === 'true';
}

// Get the ID of the active wallet
export function getActiveWalletId(): string | null {
  return sessionStorage.getItem('activeWalletId');
}

// Logout / disconnect wallet
export function disconnectWallet(): void {
  sessionStorage.removeItem('activeWalletId');
  sessionStorage.removeItem('isLoggedIn');
}