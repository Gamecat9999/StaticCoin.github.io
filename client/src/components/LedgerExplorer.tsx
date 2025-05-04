import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Box, CornerLeftUp, User } from 'lucide-react';

export default function LedgerExplorer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <Card className="bg-white rounded-xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Box className="text-primary mr-2" />
            Block Explorer
          </h3>
          <p className="opacity-70 mb-4">View and explore the blocks in the blockchain</p>
          <div className="relative">
            <Input 
              placeholder="Search by block hash or number..." 
              className="w-full pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <CornerLeftUp className="text-primary mr-2" />
            Transaction Explorer
          </h3>
          <p className="opacity-70 mb-4">Search for specific transactions in the ledger</p>
          <div className="relative">
            <Input 
              placeholder="Search by transaction hash..." 
              className="w-full pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white rounded-xl shadow-lg">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <User className="text-primary mr-2" />
            Address Lookup
          </h3>
          <p className="opacity-70 mb-4">Find all transactions associated with an address</p>
          <div className="relative">
            <Input 
              placeholder="Enter wallet address..." 
              className="w-full pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-0 top-0 text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
