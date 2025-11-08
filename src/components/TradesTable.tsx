import { useState, useEffect } from "react";
import { Twitter, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Trade {
  kol_name: string;
  kol_social: string;
  kol_platform: string;
  wallet_address: string;
  token_symbol: string;
  token_name: string;
  token_address: string;
  trade_type: "buy" | "sell";
  amount: number;
  amount_ton: number;
  value_usd: number;
  price_usd: number;
  timestamp: string;
  tx_hash: string;
  dex_name: string;
}

const API_BASE = "https://russia-triangle-breeds-tumor.trycloudflare.com";

const formatTimeSince = (timestampStr: string) => {
  const timestamp = new Date(timestampStr).getTime();
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const TradesTable = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const fetchTrades = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/trades/recent?timeframe=24h&limit=100`);
      const data = await response.json();
      setTrades(data.trades || []);
    } catch (error) {
      console.error("Failed to fetch trades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    const tradeInterval = setInterval(fetchTrades, 45000); // Refresh every 45s
    
    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(tradeInterval);
      clearInterval(timeInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Token</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trades.map((trade) => (
                  <tr key={trade.tx_hash} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{trade.kol_name}</span>
                        <div className="flex gap-2">
                          {trade.kol_platform === "X" && trade.kol_social && (
                            <a
                              href={trade.kol_social}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {trade.kol_platform === "Telegram" && trade.kol_social && (
                            <a
                              href={trade.kol_social}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={trade.trade_type === "buy" ? "default" : "destructive"}
                        className="uppercase font-semibold"
                      >
                        {trade.trade_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-mono font-semibold text-foreground">
                          {trade.amount_ton.toFixed(2)} TON
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${trade.value_usd.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://tonviewer.com/${trade.token_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        ${trade.token_symbol}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {formatTimeSince(trade.timestamp)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {trades.map((trade) => (
          <Card key={trade.tx_hash} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{trade.kol_name}</span>
                  <div className="flex gap-2">
                    {trade.kol_platform === "X" && trade.kol_social && (
                      <a
                        href={trade.kol_social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {trade.kol_platform === "Telegram" && trade.kol_social && (
                      <a
                        href={trade.kol_social}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Send className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <Badge
                  variant={trade.trade_type === "buy" ? "default" : "destructive"}
                  className="uppercase font-semibold"
                >
                  {trade.trade_type}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-foreground">
                    {trade.amount_ton.toFixed(2)} TON
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${trade.value_usd.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <a 
                    href={`https://tonviewer.com/${trade.token_address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    ${trade.token_symbol}
                  </a>
                  <div className="text-sm text-muted-foreground">
                    {formatTimeSince(trade.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
