import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  isMetaMaskInstalled, 
  connectMetaMask, 
  isConnectedToMetaMask, 
  getMetaMaskAccount,
  disconnectMetaMask,
  setupMetaMaskListeners,
  isMobileDevice,
  getMetaMaskMobileDeepLink
} from '@/lib/metamask';
import { formatAddress } from '@/lib/crypto';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, ExternalLink, Smartphone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MetaMaskConnect() {
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is on a mobile device
    setIsMobile(isMobileDevice());
    
    // Check if MetaMask is installed
    setIsMetaMaskAvailable(isMetaMaskInstalled());
    
    // Check if already connected
    setIsConnected(isConnectedToMetaMask());
    setAccount(getMetaMaskAccount());
    
    // Setup event listeners
    setupMetaMaskListeners();
    
    // Listen for connection changes
    const handleConnectionChange = () => {
      setIsConnected(isConnectedToMetaMask());
      setAccount(getMetaMaskAccount());
    };
    
    window.addEventListener('metamask_connection_change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('metamask_connection_change', handleConnectionChange);
    };
  }, []);

  const handleConnect = async () => {
    if (!isMetaMaskAvailable) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const result = await connectMetaMask();
      
      if (result.success) {
        setIsConnected(true);
        setAccount(result.account || null);
        
        toast({
          title: 'Connected to MetaMask',
          description: 'Your MetaMask wallet is now connected'
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectMetaMask();
    setIsConnected(false);
    setAccount(null);
    
    toast({
      title: 'Disconnected from MetaMask',
      description: 'Your MetaMask wallet has been disconnected'
    });
  };

  const openMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.openExtension();
    }
  };

  // Function to open MetaMask download or mobile app
  const openMetaMaskDownload = () => {
    if (isMobile) {
      // Open the MetaMask mobile app download page
      window.open('https://metamask.io/download-mobile/', '_blank');
    } else {
      // Open the MetaMask extension download page
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  // Function to open MetaMask mobile deep link
  const openMetaMaskMobile = () => {
    // Get the deep link and redirect
    const deepLink = getMetaMaskMobileDeepLink();
    window.location.href = deepLink;
  };

  if (!isMetaMaskAvailable) {
    if (isMobile) {
      return (
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md"
            onClick={openMetaMaskDownload}
          >
            <Smartphone className="mr-2 h-4 w-4" /> Install MetaMask Mobile
          </Button>
          <Button 
            variant="outline" 
            className="bg-white text-[#F6851B] hover:bg-gray-100 border-[#F6851B] shadow-md"
            onClick={openMetaMaskMobile}
          >
            <Wallet className="mr-2 h-4 w-4" /> Open in MetaMask App
          </Button>
        </div>
      );
    }
    
    return (
      <Button 
        variant="outline" 
        className="bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md"
        onClick={openMetaMaskDownload}
      >
        <Wallet className="mr-2 h-4 w-4" /> Install MetaMask
      </Button>
    );
  }

  if (isConnected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md">
            <Wallet className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">{formatAddress(account)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(account);
            toast({
              title: 'Address Copied',
              description: 'MetaMask address copied to clipboard'
            });
          }}>
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openMetaMask}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open MetaMask
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // For mobile devices with MetaMask available, we can enhance the UX by adding a mobile-specific button
  if (isMobile) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
        <Button 
          variant="outline" 
          className="bg-white text-[#F6851B] hover:bg-gray-100 border-[#F6851B] shadow-md"
          onClick={openMetaMaskMobile}
        >
          <Smartphone className="mr-2 h-4 w-4" /> Open in MetaMask App
        </Button>
      </div>
    );
  }

  // Default return for desktop browser with MetaMask available
  return (
    <Button
      variant="outline"
      className="bg-[#F6851B] text-white hover:bg-[#E2761B] border-none shadow-md"
      onClick={handleConnect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
}