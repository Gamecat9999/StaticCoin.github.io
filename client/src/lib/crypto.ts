import CryptoJS from 'crypto-js';

// Generate a SHA-256 hash
export const calculateHash = (data: string): string => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

// Generate a random hash
export const generateRandomHash = (length: number = 64): string => {
  const characters = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate a wallet address (public key format)
export const generateWalletAddress = (): string => {
  return '0x' + generateRandomHash(40);
};

// Verify if a hash meets the difficulty requirement (has leading zeros)
export const hashMeetsDifficulty = (hash: string, difficulty: number): boolean => {
  const requiredPrefix = '0'.repeat(difficulty);
  return hash.startsWith(requiredPrefix);
};

// Format a hash for display (truncate with ellipsis)
export const formatHash = (hash: string, chars: number = 10): string => {
  if (!hash || hash.length <= chars * 2) return hash;
  return `${hash.substring(0, chars)}...${hash.substring(hash.length - chars)}`;
};

// Format a wallet address for display (truncate with ellipsis)
export const formatAddress = (address: string, chars: number = 6): string => {
  if (!address || address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

// Calculate the size of data in KB (rough estimation)
export const calculateDataSizeInKB = (data: any): number => {
  const jsonString = JSON.stringify(data);
  // Assume 1 character is approximately 1 byte
  const bytes = jsonString.length;
  // Convert bytes to KB and round to 1 decimal place
  return Math.round((bytes / 1024) * 10) / 10;
};
