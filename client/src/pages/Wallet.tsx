import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getWalletData, getBlockchainData } from "@/lib/storage";
import { formatAddress } from "@/lib/crypto";
import { Loader2, ExternalLink, Copy } from "lucide-react";
import { 
  isMetaMaskInstalled,
  isConnectedToMetaMask,
  getMetaMaskAccount,
  addBlockCoinToMetaMask
} from "@/lib/metamask";
import AddToMetaMask from "@/components/AddToMetaMask";
import MetaMaskConnect from "@/components/MetaMaskConnect";
import TransactionHistory from "@/components/TransactionHistory";

export default function Wallet() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [metaMaskAccount, setMetaMaskAccount] = useState<string | null>(null);
  const [blockCoinBalance, setBlockCoinBalance] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check if MetaMask is connected
    const checkMetaMask = () => {
      const connected = isConnectedToMetaMask();
      setIsConnected(connected);
      setMetaMaskAccount(getMetaMaskAccount());
      setIsLoading(false);
    };
    
    // Get BlockCoin balance
    const walletData = getWalletData();
    if (walletData) {
      setBlockCoinBalance(walletData.balance);
    }
    
    checkMetaMask();
    
    const handleConnectionChange = () => {
      checkMetaMask();
    };
    
    window.addEventListener('metamask_connection_change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('metamask_connection_change', handleConnectionChange);
    };
  }, []);

  const copyAddressToClipboard = () => {
    if (metaMaskAccount) {
      navigator.clipboard.writeText(metaMaskAccount)
        .then(() => {
          toast({
            title: "Address Copied",
            description: "MetaMask address copied to clipboard"
          });
        })
        .catch(() => {
          toast({
            title: "Copy Failed",
            description: "Failed to copy address to clipboard",
            variant: "destructive"
          });
        });
    }
  };

  const handleAddToMetaMask = async () => {
    try {
      const result = await addBlockCoinToMetaMask(blockCoinBalance);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "BlockCoin token added to MetaMask"
        });
      } else {
        toast({
          title: "Failed to Add Token",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add token: ${(error as Error).message}`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading wallet information...</p>
        </div>
      </section>
    );
  }

  if (!isConnected) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Connect Your MetaMask Wallet</h2>
          <p className="mb-8 max-w-md mx-auto">
            To access your BlockCoin wallet and manage your tokens, please connect to MetaMask.
          </p>
          <div className="flex justify-center">
            <MetaMaskConnect />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Your BlockCoin Wallet</h2>
        
        <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">MetaMask Wallet</h3>
                <p className="opacity-80">Your connected cryptocurrency wallet</p>
              </div>
              <div>
                <p className="text-4xl font-bold">{blockCoinBalance.toFixed(2)} BC</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-3">Connected Account</h4>
                <div className="flex space-x-2 items-center bg-gray-100 p-3 rounded">
                  <span className="font-mono text-sm truncate flex-1">
                    {metaMaskAccount ? formatAddress(metaMaskAccount, 20) : 'Not connected'}
                  </span>
                  {metaMaskAccount && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={copyAddressToClipboard}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (typeof window.ethereum !== 'undefined') {
                        window.ethereum.openExtension();
                      }
                    }}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Open MetaMask
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">BlockCoin Token</h4>
                <p className="text-gray-600 mb-4">
                  Add your BlockCoin tokens to MetaMask to view them in your wallet.
                </p>
                <AddToMetaMask />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-4xl mx-auto mt-8">
          <TransactionHistory />
        </div>
      </div>
    </section>
  );
}