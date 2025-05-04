import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getWalletData, getBlockchainData, saveWalletData } from '@/lib/storage';
import { addTransaction } from '@/lib/blockchainUtils';
import { TransactionType, TransactionStatus, Wallet } from '@/types/blockchain';
import { formatAddress } from '@/lib/crypto';
import { ClipboardCopy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddToMetaMask from './AddToMetaMask';

export default function WalletCard() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const walletData = getWalletData();
    if (walletData) {
      setWallet(walletData);
    }
  }, []);

  const handleSend = () => {
    if (!wallet) return;
    
    setErrorMessage('');
    
    // Validate input
    if (!recipient.trim()) {
      setErrorMessage('Please enter a recipient address');
      return;
    }
    
    if (!recipient.startsWith('0x')) {
      setErrorMessage('Recipient address must start with 0x');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setErrorMessage('Please enter a valid amount');
      return;
    }
    
    if (amountValue > wallet.balance) {
      setErrorMessage('Insufficient balance');
      return;
    }
    
    // Create transaction
    const result = addTransaction(
      wallet.address,
      recipient,
      amountValue,
      TransactionType.SEND
    );
    
    if (result) {
      // Update wallet state with latest data
      const updatedWallet = getWalletData();
      if (updatedWallet) {
        setWallet(updatedWallet);
      }
      
      // Clear form
      setRecipient('');
      setAmount('');
      
      // Show success message
      toast({
        title: "Transaction sent",
        description: `${amountValue} BC sent to ${formatAddress(recipient)}`,
      });
    } else {
      setErrorMessage('Transaction failed. Please try again.');
    }
  };

  const copyToClipboard = () => {
    if (!wallet) return;
    
    navigator.clipboard.writeText(wallet.address)
      .then(() => {
        toast({
          title: "Address copied",
          description: "Wallet address copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Copy failed",
          description: "Could not copy address to clipboard",
          variant: "destructive"
        });
      });
  };

  if (!wallet) {
    return <div className="text-center py-8">Loading wallet data...</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto bg-light rounded-xl shadow-lg overflow-hidden">
      <div className="bg-primary text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Wallet Balance</h3>
            <p className="opacity-80">Your virtual cryptocurrency holdings</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{wallet.balance.toFixed(2)} BC</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-medium mb-3">Send BlockCoin</h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input 
                  id="recipient" 
                  placeholder="0x..." 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount (BC)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              {errorMessage && (
                <p className="text-destructive text-sm">{errorMessage}</p>
              )}
              <Button 
                className="w-full bg-primary hover:bg-opacity-90 text-white" 
                onClick={handleSend}
              >
                Send Transaction
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Your Wallet Address</h4>
            <div className="bg-white border border-gray-200 rounded p-3 mb-4">
              <p className="font-mono text-sm break-all">{wallet.address}</p>
            </div>
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                {/* QR Code representation (simple visual only) */}
                <div className="w-24 h-24 grid grid-cols-6 grid-rows-6 gap-1">
                  <div className="col-span-2 row-span-2 bg-dark"></div>
                  <div className="col-span-2 row-span-2 bg-dark ml-auto mr-auto"></div>
                  <div className="col-span-2 row-span-2 bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="col-span-2 row-span-2 bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="col-span-2 bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="col-span-2 row-span-2 bg-dark"></div>
                  <div className="col-span-2 bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="bg-dark"></div>
                  <div className="col-span-2 row-span-2 bg-dark"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                onClick={copyToClipboard}
              >
                <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Address
              </Button>
              
              {/* MetaMask Integration */}
              <AddToMetaMask />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
