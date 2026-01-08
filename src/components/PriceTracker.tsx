import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TONData {
  price: number;
  priceChange24h: number;
}

export const PriceTracker = () => {
  const [tonData, setTonData] = useState<TONData>({
    price: 0,
    priceChange24h: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTONPrice = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd&include_24hr_change=true"
      );
      const data = await response.json();
      
      if (data["the-open-network"]) {
        setTonData({
          price: data["the-open-network"].usd,
          priceChange24h: data["the-open-network"].usd_24h_change || 0,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching TON price:", error);
    }
  };

  useEffect(() => {
    fetchTONPrice();
    const interval = setInterval(fetchTONPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const isPositive = tonData.priceChange24h >= 0;

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
