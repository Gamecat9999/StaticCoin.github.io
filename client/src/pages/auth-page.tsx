import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, Check, Info } from "lucide-react";
import { 
  createNewWallet, 
  loadWalletWithPassphrase, 
  isWalletActive 
} from "@/lib/walletAuth";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [passphrase, setPassphrase] = useState("");
  const [newPassphrase, setNewPassphrase] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isPassphraseSaved, setIsPassphraseSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isWalletActive()) {
      setLocation("/");
    }
  }, [setLocation]);

  // Handle access wallet with existing passphrase
  const handleAccessWallet = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passphrase.trim()) {
      setErrorMessage("Please enter your wallet passphrase");
      return;
    }
    
    const result = loadWalletWithPassphrase(passphrase);
    
    if (result.success) {
      toast({
        title: "Wallet Access Successful",
        description: "Your wallet has been loaded successfully",
      });
      setLocation("/");
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle create new wallet
  const handleCreateWallet = () => {
    const result = createNewWallet();
    
    if (result.success && result.passphrase) {
      setNewPassphrase(result.passphrase);
      toast({
        title: "Wallet Created",
        description: "Your new wallet has been created. Save your passphrase!",
      });
    } else {
      setErrorMessage(result.message);
    }
  };

  // Handle copy passphrase to clipboard
  const handleCopyPassphrase = () => {
    navigator.clipboard.writeText(newPassphrase);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Handle confirm passphrase saved
  const handleConfirmSaved = () => {
    setIsPassphraseSaved(true);
  };

  // Handle continue to app
  const handleContinue = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Wallet access/creation */}
        <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Wallet Access</h2>
            
            <Tabs defaultValue="access" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="access">Access Wallet</TabsTrigger>
                <TabsTrigger value="create">Create Wallet</TabsTrigger>
              </TabsList>
              
              <TabsContent value="access">
                <form onSubmit={handleAccessWallet}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="passphrase">Wallet Passphrase</Label>
                      <Input
                        id="passphrase"
                        type="text"
                        placeholder="Enter your 10-word passphrase"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter the 10-word passphrase you received when creating your wallet.
                      </p>
                    </div>
                    
                    {errorMessage && (
                      <Alert variant="destructive">
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Access Wallet
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="create">
                {!newPassphrase ? (
                  <div className="space-y-4">
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        Creating a new wallet will generate a unique 10-word passphrase. This passphrase cannot be 
                        recovered if lost and is the only way to access your wallet.
                      </AlertDescription>
                    </Alert>
                    
                    <Button
                      onClick={handleCreateWallet}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Create New Wallet
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertDescription>
                        <p className="font-bold text-primary mb-2">Your Wallet Passphrase:</p>
                        <div className="bg-gray-100 p-4 rounded-md mb-2 font-mono text-sm break-all relative">
                          {newPassphrase}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleCopyPassphrase}
                          >
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">
                          <strong>IMPORTANT:</strong> Write down or save this passphrase in a secure location. 
                          It cannot be recovered if lost!
                        </p>
                      </AlertDescription>
                    </Alert>
                    
                    {!isPassphraseSaved ? (
                      <Button
                        onClick={handleConfirmSaved}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        I've Saved My Passphrase
                      </Button>
                    ) : (
                      <Button
                        onClick={handleContinue}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Continue to My Wallet
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Right column: Information */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold mb-6 text-primary">
            BlockCoin Simulator
          </h1>
          
          <h2 className="text-2xl font-semibold mb-4">
            Learn & Experience Blockchain Technology
          </h2>
          
          <p className="mb-6 text-gray-600">
            Welcome to BlockCoin, an educational cryptocurrency simulator that 
            helps you understand blockchain technology through hands-on experience.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Secure Wallet System</h3>
              <p className="text-gray-600">
                Each wallet is secured by a unique 10-word passphrase, similar to real 
                cryptocurrency wallets. Keep your passphrase safe!
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Mining Simulation</h3>
              <p className="text-gray-600">
                Experience mining BlockCoin using your computer's processing power, 
                and see how new blocks are added to the blockchain.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-medium text-lg mb-2">Blockchain Explorer</h3>
              <p className="text-gray-600">
                View the ledger of all transactions, understand how blocks are connected, 
                and see the transparency of blockchain in action.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}