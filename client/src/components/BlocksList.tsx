import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBlockchainData } from '@/lib/storage';
import { Block } from '@/types/blockchain';
import { formatHash, formatAddress } from '@/lib/crypto';
import { Box } from 'lucide-react';

export default function BlocksList() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [visibleBlocks, setVisibleBlocks] = useState(3); // Number of blocks to show initially

  useEffect(() => {
    const blockchain = getBlockchainData();
    if (blockchain) {
      // Get blocks in reverse order (newest first)
      const sortedBlocks = [...blockchain.blocks].reverse();
      setBlocks(sortedBlocks);
    }
  }, []);

  // Format time to "x mins ago" or full date
  const formatTime = (timestamp: number): { relative: string, full: string } => {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Format full date
    const date = new Date(timestamp);
    const fullDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Format relative time
    if (diff < 60000) {
      return { relative: 'Just now', full: fullDate };
    } else if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return { relative: `${mins} min${mins > 1 ? 's' : ''} ago`, full: fullDate };
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return { relative: `${hours} hour${hours > 1 ? 's' : ''} ago`, full: fullDate };
    } else {
      const days = Math.floor(diff / 86400000);
      return { relative: `${days} day${days > 1 ? 's' : ''} ago`, full: fullDate };
    }
  };

  const handleViewAll = () => {
    setVisibleBlocks(blocks.length);
  };

  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden">
      <CardContent className="p-6 border-b">
        <h3 className="text-xl font-semibold">Latest Blocks</h3>
      </CardContent>
      
      <div className="overflow-x-auto">
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Loading blocks...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blocks.slice(0, visibleBlocks).map((block) => {
                const time = formatTime(block.timestamp);
                return (
                  <tr key={block.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-primary bg-opacity-10 rounded-full p-2 mr-3">
                          <Box className="text-primary h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">#{block.id}</div>
                          <div className="font-mono text-xs text-gray-500 truncate w-32">{formatHash(block.hash)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{time.relative}</div>
                      <div className="text-xs text-gray-500">{time.full}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-mono text-xs truncate w-32">{formatAddress(block.miner)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {block.data.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {block.size.toFixed(1)} KB
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {blocks.length > visibleBlocks && (
        <div className="flex justify-center p-4 border-t">
          <Button 
            className="bg-primary hover:bg-opacity-90 text-white"
            onClick={handleViewAll}
          >
            View All Blocks
          </Button>
        </div>
      )}
    </Card>
  );
}
