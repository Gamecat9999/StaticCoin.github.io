import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Mining from "@/pages/Mining";
import Wallet from "@/pages/Wallet";
import Ledger from "@/pages/Ledger";
import Education from "@/pages/Education";
import WelcomePage from "@/pages/WelcomePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import { initBlockchain } from "@/lib/blockchainUtils";
import { MetaMaskProtectedRoute } from "@/lib/metamask-protected-route";
import { Toaster } from "@/components/ui/toaster";

function App() {
  useEffect(() => {
    // Initialize the blockchain data if it doesn't exist yet
    initBlockchain();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={WelcomePage} />
          <Route path="/education" component={Education} />
          
          {/* MetaMask Protected routes */}
          <MetaMaskProtectedRoute path="/overview" component={Home} />
          <MetaMaskProtectedRoute path="/mining" component={Mining} />
          <MetaMaskProtectedRoute path="/wallet" component={Wallet} />
          <MetaMaskProtectedRoute path="/ledger" component={Ledger} />
          
          {/* 404 route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;