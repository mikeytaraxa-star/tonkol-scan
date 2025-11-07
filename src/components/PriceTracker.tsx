import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export const PriceTracker = () => {
  // Simulating live price updates
  const [price, setPrice] = useState(5.47);
  const [priceChange, setPriceChange] = useState(2.34);
  const [isPositive, setIsPositive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small price fluctuations
      const change = (Math.random() - 0.5) * 0.1;
      setPrice((prev) => {
        const newPrice = Math.max(0, prev + change);
        return parseFloat(newPrice.toFixed(4));
      });
      
      // Update 24h change randomly
      const newChange = (Math.random() - 0.3) * 5;
      setPriceChange(parseFloat(Math.abs(newChange).toFixed(2)));
      setIsPositive(newChange >= 0);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
                      ${price.toFixed(4)}
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
                        {isPositive ? "+" : "-"}
                        {priceChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">24h Volume</div>
                  <div className="font-semibold text-foreground">$245.8M</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Market Cap</div>
                  <div className="font-semibold text-foreground">$13.8B</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-muted-foreground mb-1">24h High</div>
                  <div className="font-semibold text-foreground">$5.52</div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-muted-foreground mb-1">24h Low</div>
                  <div className="font-semibold text-foreground">$5.41</div>
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
