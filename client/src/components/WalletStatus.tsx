import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Wallet, LogOut } from 'lucide-react';
import { isWalletActive, disconnectWallet } from '@/lib/walletAuth';
import { getWalletData } from '@/lib/storage';
import { formatAddress } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';

export default function WalletStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Check wallet connection status
  useEffect(() => {
    const checkWalletStatus = () => {
      const walletActive = isWalletActive();
      setIsConnected(walletActive);
      
      if (walletActive) {
        const wallet = getWalletData();
        if (wallet) {
          setWalletAddress(wallet.address);
        }
      } else {
        setWalletAddress(null);
      }
    };
    
    checkWalletStatus();
    
    // Set up event listener for storage changes (in case of wallet connection in another tab)
    const handleStorageChange = () => {
      checkWalletStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle connect wallet
  const handleConnectWallet = () => {
    setLocation('/auth');
  };

  // Handle disconnect wallet
  const handleDisconnectWallet = () => {
    disconnectWallet();
    setIsConnected(false);
    setWalletAddress(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected successfully.',
    });
    
    // Redirect to auth page
    setLocation('/auth');
  };

  return (
    <div>
      {isConnected && walletAddress ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden md:inline">{formatAddress(walletAddress)}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLocation('/wallet')}>
              View Wallet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDisconnectWallet} className="text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          variant="default" 
          className="bg-primary hover:bg-primary/90"
          onClick={handleConnectWallet}
        >
          <Wallet className="h-4 w-4 mr-2" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}