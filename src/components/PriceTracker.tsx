import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TONData {
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
}

export const PriceTracker = () => {
  const [tonData, setTonData] = useState<TONData>({
    price: 0,
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0,
    high24h: 0,
    low24h: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTONPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
      );
      const data = await response.json();
      
      if (data["the-open-network"]) {
        const tonInfo = data["the-open-network"];
        
        // Fetch additional data for high/low
        const detailResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/the-open-network?localization=false&tickers=false&community_data=false&developer_data=false"
        );
        const detailData = await detailResponse.json();
        
        setTonData({
          price: tonInfo.usd,
          priceChange24h: tonInfo.usd_24h_change || 0,
          volume24h: tonInfo.usd_24h_vol || 0,
          marketCap: tonInfo.usd_market_cap || 0,
          high24h: detailData.market_data?.high_24h?.usd || tonInfo.usd,
          low24h: detailData.market_data?.low_24h?.usd || tonInfo.usd,
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

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const isPositive = tonData.priceChange24h >= 0;

  if (isLoading) {
    return (
      <div className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Card className="bg-primary/5 border-primary/20">
            <div className="px-6 py-4">
              <div className="text-center text-muted-foreground">Loading TON price...</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <Card className="bg-primary/5 border-primary/20">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Toncoin (TON)</div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-foreground font-mono">
                      ${tonData.price.toFixed(4)}
                    </span>
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                        isPositive
                          ? "bg-success/10 text-success"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="font-semibold text-sm">
                        {isPositive ? "+" : ""}
                        {tonData.priceChange24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">24h Volume</div>
                  <div className="font-semibold text-foreground">{formatVolume(tonData.volume24h)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Market Cap</div>
                  <div className="font-semibold text-foreground">{formatVolume(tonData.marketCap)}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-muted-foreground mb-1">24h High</div>
                  <div className="font-semibold text-foreground">${tonData.high24h.toFixed(4)}</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-muted-foreground mb-1">24h Low</div>
                  <div className="font-semibold text-foreground">${tonData.low24h.toFixed(4)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
