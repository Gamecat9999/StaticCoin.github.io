import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLine, Globe, Coins } from "lucide-react";
import { getMarketData } from "@/lib/storage";
import { MarketData } from "@/types/blockchain";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export default function Overview() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  
  useEffect(() => {
    const data = getMarketData();
    if (data) {
      setMarketData(data);
    }
  }, []);

  // Format large numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  // Format currency with $ and 2 decimal places
  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num);
  };

  // Format market cap in billions
  const formatMarketCap = (num: number): string => {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  };

  // Format supply in millions
  const formatSupply = (num: number): string => {
    return `${(num / 1_000_000).toFixed(1)}M`;
  };

  // Get chart data (last 30 days)
  const getChartData = () => {
    if (!marketData) return [];
    return marketData.priceHistory.slice(-30).map(item => ({
      date: item.date,
      price: item.price
    }));
  };

  if (!marketData) {
    return <div className="text-center py-8">Loading market data...</div>;
  }

  return (
    <section id="overview" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">BlockCoin Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-light hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Current Price</h3>
                <ChartLine className="text-primary text-2xl" />
              </div>
              <p className="text-3xl font-bold text-dark">{formatCurrency(marketData.currentPrice)}</p>
              <p className={`flex items-center mt-2 ${marketData.priceChange >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                <span className="mr-1">
                  {marketData.priceChange >= 0 ? '↑' : '↓'}
                </span> 
                {Math.abs(marketData.priceChange)}% today
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-light hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Market Cap</h3>
                <Globe className="text-primary text-2xl" />
              </div>
              <p className="text-3xl font-bold text-dark">{formatMarketCap(marketData.marketCap)}</p>
              <p className="text-dark opacity-70 mt-2">Rank #{marketData.marketCapRank}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-light hover:scale-105 transition-transform duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Total Supply</h3>
                <Coins className="text-primary text-2xl" />
              </div>
              <p className="text-3xl font-bold text-dark">{formatSupply(marketData.totalSupply)}</p>
              <p className="text-dark opacity-70 mt-2">
                {formatSupply(marketData.circulatingSupply)} in circulation
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-12 bg-light">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Price History</h3>
            <div className="w-full h-64 bg-white rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}
                    interval={4}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Price']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
