import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MetaMaskConnect from "@/components/MetaMaskConnect";
import { Link } from "wouter";
import { isMetaMaskInstalled, isConnectedToMetaMask } from "@/lib/metamask";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const checkConnection = () => {
      const metaMaskInstalled = isMetaMaskInstalled();
      const metaMaskConnected = isConnectedToMetaMask();
      setIsConnected(metaMaskInstalled && metaMaskConnected);
    };
    
    checkConnection();
    
    const handleConnectionChange = () => {
      checkConnection();
    };
    
    window.addEventListener('metamask_connection_change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('metamask_connection_change', handleConnectionChange);
    };
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            BlockCoin Simulator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the world of blockchain technology through an interactive simulation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Connect to MetaMask</h2>
              <p className="text-gray-600 mb-6">
                Connect your MetaMask wallet to interact with our blockchain simulation. This is required to use all features of the application.
              </p>
              <div className="flex justify-center">
                <MetaMaskConnect />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Mine your own BlockCoin tokens</li>
                <li>Add mined tokens to your MetaMask wallet</li>
                <li>Explore the blockchain ledger</li>
                <li>Learn about blockchain technology</li>
              </ul>
              
              {isConnected ? (
                <div className="mt-6 flex justify-center">
                  <Link href="/overview">
                    <Button className="bg-secondary hover:bg-opacity-90">Get Started</Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-6 flex justify-center">
                  <Button disabled className="opacity-50">
                    Connect MetaMask First
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <Card className="shadow-lg p-6">
            <CardContent>
              <h2 className="text-xl font-bold mb-4">What is BlockCoin?</h2>
              <p className="text-gray-600">
                BlockCoin is an educational simulation of a cryptocurrency blockchain. It allows you to learn about blockchain 
                technology by participating in a simulated mining process, managing a wallet, and exploring transactions. 
                Unlike real cryptocurrencies, BlockCoin only exists within this application but can be added to your 
                MetaMask wallet for demonstration purposes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}