import { useEffect, useState } from "react";
import { Redirect, Route } from "wouter";
import { Loader2 } from "lucide-react";
import { isMetaMaskInstalled, isConnectedToMetaMask } from "./metamask";

export function MetaMaskProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check MetaMask connection
    const checkConnection = () => {
      const metaMaskInstalled = isMetaMaskInstalled();
      const metaMaskConnected = isConnectedToMetaMask();
      
      setIsConnected(metaMaskInstalled && metaMaskConnected);
      setIsLoading(false);
    };
    
    checkConnection();
    
    // Set up event listener for connection changes
    const handleConnectionChange = () => {
      checkConnection();
    };
    
    window.addEventListener('metamask_connection_change', handleConnectionChange);
    
    return () => {
      window.removeEventListener('metamask_connection_change', handleConnectionChange);
    };
  }, []);

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg">Checking MetaMask connection...</p>
        </div>
      ) : isConnected ? (
        <Component />
      ) : (
        <Redirect to="/" />
      )}
    </Route>
  );
}