import { Link } from "wouter";
import { Box } from "lucide-react";
import { FaTwitter, FaGithub, FaDiscord, FaTelegram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4 flex items-center">
              <Box className="mr-2" />
              <span>BlockCoin</span>
            </div>
            <p className="opacity-70">
              An educational cryptocurrency platform to learn about blockchain technology and mining.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <div className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Overview</div>
                </Link>
              </li>
              <li>
                <Link href="/mining">
                  <div className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Mining</div>
                </Link>
              </li>
              <li>
                <Link href="/wallet">
                  <div className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Wallet</div>
                </Link>
              </li>
              <li>
                <Link href="/ledger">
                  <div className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Ledger</div>
                </Link>
              </li>
              <li>
                <Link href="/education">
                  <div className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Learn</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><div onClick={() => window.open('#', '_blank')} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Documentation</div></li>
              <li><div onClick={() => window.open('#', '_blank')} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">API</div></li>
              <li><div onClick={() => window.open('https://github.com', '_blank')} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">GitHub Repository</div></li>
              <li><div onClick={() => window.open('#', '_blank')} className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer">Community Forum</div></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4 mb-4">
              <div onClick={() => window.open('#', '_blank')} className="bg-white bg-opacity-20 hover:bg-opacity-30 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <FaTwitter />
              </div>
              <div onClick={() => window.open('#', '_blank')} className="bg-white bg-opacity-20 hover:bg-opacity-30 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <FaGithub />
              </div>
              <div onClick={() => window.open('#', '_blank')} className="bg-white bg-opacity-20 hover:bg-opacity-30 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <FaDiscord />
              </div>
              <div onClick={() => window.open('#', '_blank')} className="bg-white bg-opacity-20 hover:bg-opacity-30 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                <FaTelegram />
              </div>
            </div>
            <p className="opacity-70 text-sm">
              Stay updated with the latest news and announcements.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center opacity-70">
          <p>© {new Date().getFullYear()} BlockCoin. An educational project. Not for actual cryptocurrency transactions.</p>
          <p className="text-sm mt-2">This is a simulation for learning purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
