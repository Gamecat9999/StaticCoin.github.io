import { getBlockchainData, getMiningStats, getWalletData } from './storage';
import { generateWalletAddress } from './crypto';
import { BlockchainData, MiningStats, Wallet } from '@/types/blockchain';

// Simple password hashing (not secure for production, but ok for demo)
export function hashPassword(password: string): string {
  // This is a very simple hash and not secure
  // For a real app, you'd use a proper cryptographic library 
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16); // Convert to hex string
}

// Generate a UUID for user IDs
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Interface for user data
export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

// Interface for the users object stored in localStorage
interface Users {
  [username: string]: User;
}

// Interface for the current user stored in sessionStorage
export interface CurrentUser {
  id: string;
  username: string;
  loggedInAt: string;
}

// Get all users from localStorage
export function getUsers(): Users {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

// A function to register new users
export function registerUser(username: string, password: string): { 
  success: boolean; 
  message: string;
  userId?: string;
} {
  // Check if user already exists
  const users = getUsers();
  
  if (users[username]) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Hash the password
  const passwordHash = hashPassword(password);
  
  // Generate a unique user ID
  const userId = generateUUID();
  
  // Create user record
  users[username] = {
    id: userId,
    username,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('users', JSON.stringify(users));
  
  // Create initial blockchain data for this user
  initializeUserData(userId);
  
  return { 
    success: true, 
    message: 'Registration successful',
    userId
  };
}

// A function to authenticate users
export function loginUser(username: string, password: string): { 
  success: boolean; 
  message: string;
  user?: CurrentUser;
} {
  const users = getUsers();
  
  // Check if user exists
  if (!users[username]) {
    return { success: false, message: 'Invalid username or password' };
  }
  
  // Verify password
  const passwordHash = hashPassword(password);
  if (users[username].passwordHash !== passwordHash) {
    return { success: false, message: 'Invalid username or password' };
  }
  
  // Set current user in session
  const currentUser: CurrentUser = {
    id: users[username].id,
    username,
    loggedInAt: new Date().toISOString()
  };
  
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  return {
    success: true,
    message: 'Login successful',
    user: currentUser
  };
}

// Initialize user data for new registrations
export function initializeUserData(userId: string): void {
  // Check if we already have global blockchain data to use as a template
  const existingBlockchain = getBlockchainData();
  const existingMiningStats = getMiningStats();
  const existingWallet = getWalletData();
  
  // Create wallet for new user
  const wallet: Wallet = existingWallet || {
    address: generateWalletAddress(),
    balance: 100, // starting balance
    transactions: []
  };
  
  // Create blockchain data for new user
  const blockchainData: BlockchainData = existingBlockchain || {
    blocks: [
      // Genesis block will be created by the initBlockchain function
    ],
    pendingTransactions: [],
    difficulty: 2,
    miningReward: 50,
    initialCoins: 100
  };
  
  // Create mining stats for new user
  const miningStats: MiningStats = existingMiningStats || {
    hashRate: 0,
    blocksMined: 0,
    isActive: false,
    hashPower: 5,
    currentConsoleOutput: []
  };
  
  // Store all data for the user
  localStorage.setItem(`wallet_${userId}`, JSON.stringify(wallet));
  localStorage.setItem(`blockchain_${userId}`, JSON.stringify(blockchainData));
  localStorage.setItem(`miningStats_${userId}`, JSON.stringify(miningStats));
  localStorage.setItem(`marketData_${userId}`, localStorage.getItem('blockcoin_market_data') || '{}');
}

// Get the current logged-in user
export function getCurrentUser(): CurrentUser | null {
  const userJSON = sessionStorage.getItem('currentUser');
  return userJSON ? JSON.parse(userJSON) : null;
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Log out user
export function logoutUser(): { success: boolean; message: string } {
  sessionStorage.removeItem('currentUser');
  return { success: true, message: 'Logged out successfully' };
}