import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Box } from "lucide-react";
import MetaMaskConnect from "./MetaMaskConnect";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Overview", path: "/overview" },
    { name: "Mining", path: "/mining" },
    { name: "Wallet", path: "/wallet" },
    { name: "Ledger", path: "/ledger" },
    { name: "Learn", path: "/education" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 header-gradient">
      <nav className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <div className="text-2xl font-bold text-primary flex items-center cursor-pointer">
              <Box className="mr-2" />
              <span>BlockCoin</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* MetaMask - hidden on mobile */}
          <div className="hidden md:block">
            <MetaMaskConnect />
          </div>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden block"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        
        <div className={`w-full md:w-auto md:flex ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 mt-4 md:mt-0">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <div 
                    className={`hover:text-primary transition-colors cursor-pointer ${
                      location === item.path ? 'text-primary font-medium' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
            
            {/* Mobile MetaMask - only visible on mobile */}
            <li className="md:hidden block mt-4">
              <MetaMaskConnect />
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}