import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Plus, Smartphone } from 'lucide-react';
import { 
  isMetaMaskInstalled, 
  isConnectedToMetaMask,
  addBlockCoinToMetaMask,
  isMobileDevice,
  getMetaMaskMobileDeepLink
} from '@/lib/metamask';
import { getWalletData } from '@/lib/storage';

export default function AddToMetaMask() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if MetaMask is installed and connected
    const checkAvailability = () => {
      const metaMaskInstalled = isMetaMaskInstalled();
      const metaMaskConnected = isConnectedToMetaMask();
      setIsAvailable(metaMaskInstalled && metaMaskConnected);
    };
    
    checkAvailability();
    
    // Set up an event listener for MetaMask connection changes
    window.addEventListener('metamask_connection_change', checkAvailability);
    
    return () => {
      window.removeEventListener('metamask_connection_change', checkAvailability);
    };
  }, []);
  
  const handleAddToMetaMask = async () => {
    if (!isAvailable) {
      toast({
        title: 'MetaMask Not Connected',
        description: 'Please connect to MetaMask first',
        variant: 'destructive'
      });
      return;
    }
    
    setIsAdding(true);
    
    try {
      // Get the wallet balance to add to MetaMask
      const wallet = getWalletData();
      const balance = wallet ? wallet.balance : 0;
      
      const result = await addBlockCoinToMetaMask(balance);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'BlockCoin token added to MetaMask'
        });
      } else {
        toast({
          title: 'Failed to Add Token',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to add token: ${(error as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  if (!isAvailable) {
    return null;
  }
  
  return (
    <Button
      className="flex items-center bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md w-full"
      disabled={isAdding}
      onClick={handleAddToMetaMask}
    >
      <Plus className="h-4 w-4 mr-2" />
      {isAdding ? 'Adding...' : 'Add to MetaMask'}
    </Button>
  );
}