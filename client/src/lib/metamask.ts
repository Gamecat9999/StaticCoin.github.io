import { ethers } from 'ethers';

interface MetaMaskState {
  connected: boolean;
  account: string | null;
  chainId: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

// Store the MetaMask state
const state: MetaMaskState = {
  connected: false,
  account: null,
  chainId: null,
  provider: null,
  signer: null
};

// Check if user is on a mobile device
export const isMobileDevice = (): boolean => {
  const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

// Deep link to MetaMask mobile app
export const getMetaMaskMobileDeepLink = (): string => {
  // Create a deep link URL with the current site URL for callback
  const currentUrl = encodeURIComponent(window.location.href);
  return `https://metamask.app.link/dapp/${window.location.host}`;
};

// Connect to MetaMask
export const connectMetaMask = async (): Promise<{
  success: boolean;
  message: string;
  account?: string;
}> => {
  if (!isMetaMaskInstalled()) {
    return {
      success: false,
      message: 'MetaMask is not installed. Please install MetaMask to continue.'
    };
  }

  try {
    // Connect to MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      return {
        success: false,
        message: 'No accounts found. Please unlock your MetaMask and try again.'
      };
    }

    const signer = await provider.getSigner();
    const chainId = await provider.send('eth_chainId', []);
    
    // Update state
    state.connected = true;
    state.account = accounts[0];
    state.chainId = chainId;
    state.provider = provider;
    state.signer = signer;

    // Store in sessionStorage
    sessionStorage.setItem('metamask_connected', 'true');
    sessionStorage.setItem('metamask_account', accounts[0]);
    
    return {
      success: true,
      message: 'Successfully connected to MetaMask',
      account: accounts[0]
    };
  } catch (error) {
    console.error('MetaMask connection error:', error);
    return {
      success: false,
      message: `Failed to connect to MetaMask: ${(error as Error).message}`
    };
  }
};

// Disconnect from MetaMask
export const disconnectMetaMask = (): void => {
  state.connected = false;
  state.account = null;
  state.chainId = null;
  state.provider = null;
  state.signer = null;
  
  // Remove from sessionStorage
  sessionStorage.removeItem('metamask_connected');
  sessionStorage.removeItem('metamask_account');
};

// Check if user is connected to MetaMask
export const isConnectedToMetaMask = (): boolean => {
  // First check our local state
  if (state.connected && state.account) {
    return true;
  }
  
  // Then check sessionStorage (in case page was refreshed)
  const connected = sessionStorage.getItem('metamask_connected') === 'true';
  const account = sessionStorage.getItem('metamask_account');
  
  if (connected && account) {
    // Rehydrate state from sessionStorage
    state.connected = true;
    state.account = account;
    return true;
  }
  
  return false;
};

// Get the current MetaMask account
export const getMetaMaskAccount = (): string | null => {
  if (state.connected && state.account) {
    return state.account;
  }
  
  const account = sessionStorage.getItem('metamask_account');
  return account;
};

// Add the BlockCoin token to MetaMask
export const addBlockCoinToMetaMask = async (
  balance: number = 0
): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!isMetaMaskInstalled()) {
    return {
      success: false,
      message: 'MetaMask is not installed.'
    };
  }
  
  if (!isConnectedToMetaMask()) {
    return {
      success: false,
      message: 'Please connect to MetaMask first.'
    };
  }
  
  try {
    // Define token parameters
    const tokenSymbol = 'BC';
    const tokenDecimals = 18;
    const tokenImage = `${window.location.origin}/blockchain-icon.png`; // Placeholder image path
    
    // Use the watchAsset method to add the token to MetaMask
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0xBC0123456789012345678901234567890123BC00', // Simulated contract address
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      return {
        success: true,
        message: 'BlockCoin token was successfully added to MetaMask!'
      };
    } else {
      return {
        success: false,
        message: 'Failed to add BlockCoin token to MetaMask.'
      };
    }
  } catch (error) {
    console.error('Error adding token to MetaMask:', error);
    return {
      success: false,
      message: `Error adding token to MetaMask: ${(error as Error).message}`
    };
  }
};

// Handle MetaMask events
export const setupMetaMaskListeners = (): void => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their account
        disconnectMetaMask();
      } else {
        // User switched accounts
        state.account = accounts[0];
        sessionStorage.setItem('metamask_account', accounts[0]);
      }
    });
    
    window.ethereum.on('chainChanged', (chainId: string) => {
      // Handle chain change (network switch)
      state.chainId = chainId;
      
      // Usually you'd want to refresh the page here
      window.location.reload();
    });
    
    window.ethereum.on('disconnect', () => {
      // MetaMask disconnected
      disconnectMetaMask();
    });
  }
};

// Declare ethereum on the window object for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}