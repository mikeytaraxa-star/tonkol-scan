import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface TONData {
  price: number;
  priceChange24h: number;
  sparklineData: number[];
}

export const PriceTracker = () => {
  const [tonData, setTonData] = useState<TONData>({
    price: 0,
    priceChange24h: 0,
    sparklineData: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTONPrice = async () => {
    try {
      // Fetch price with sparkline data
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/the-open-network?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true"
      );
      const data = await response.json();
      
      if (data.market_data) {
        const sparkline = data.market_data.sparkline_7d?.price || [];
        // Get last 24 data points for a cleaner sparkline
        const last24Points = sparkline.slice(-24);
        
        setTonData({
          price: data.market_data.current_price?.usd || 0,
          priceChange24h: data.market_data.price_change_percentage_24h || 0,
          sparklineData: last24Points,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching TON price:", error);
    }
  };

  useEffect(() => {
    fetchTONPrice();
    // Update every 30 seconds
    const interval = setInterval(fetchTONPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = tonData.priceChange24h >= 0;

  // Transform sparkline data for recharts
  const chartData = tonData.sparklineData.map((price, index) => ({
    value: price,
  }));

  if (isLoading) {
    return (
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Card className="bg-primary/5 border-primary/20">
            <div className="px-3 sm:px-6 py-3 sm:py-4">
              <div className="text-center text-sm text-muted-foreground">Loading TON price...</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-card">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <Card className="bg-primary/5 border-primary/20">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Price and Change */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Toncoin (TON)</div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl font-bold text-foreground font-mono">
                      ${tonData.price.toFixed(2)}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                        isPositive
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      <span className="font-semibold text-xs sm:text-sm">
                        {isPositive ? "+" : ""}
                        {tonData.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sparkline Chart */}
              <div className="hidden sm:block w-32 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Buy TON Button */}
              <Button
                asChild
                className="bg-primary hover:bg-accent text-primary-foreground font-semibold text-xs sm:text-sm px-3 sm:px-4 h-9 sm:h-10"
              >
                <a
                  href="https://groypfi.io"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CreditCard className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline">Buy TON</span>
                  <span className="sm:hidden">Buy</span>
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
