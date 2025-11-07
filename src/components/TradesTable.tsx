import { useState, useEffect } from "react";
import { Twitter, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Trade {
  id: string;
  kolName: string;
  xLink?: string;
  telegramLink?: string;
  type: "buy" | "sell";
  tonAmount: number;
  usdValue: number;
  tokenName: string;
  timestamp: Date;
}

const mockTrades: Trade[] = [
  {
    id: "1",
    kolName: "CryptoWhale",
    xLink: "https://x.com/cryptowhale",
    telegramLink: "https://t.me/cryptowhale",
    type: "buy",
    tonAmount: 50.5,
    usdValue: 8580,
    tokenName: "BONK",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "2",
    kolName: "SolanaMaxi",
    xLink: "https://x.com/solanamaxi",
    type: "sell",
    tonAmount: 25.3,
    usdValue: 4301,
    tokenName: "WIF",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "3",
    kolName: "DeFiTrader",
    telegramLink: "https://t.me/defitrader",
    type: "buy",
    tonAmount: 100,
    usdValue: 17000,
    tokenName: "JTO",
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: "4",
    kolName: "MemeKing",
    xLink: "https://x.com/memeking",
    telegramLink: "https://t.me/memeking",
    type: "buy",
    tonAmount: 15.8,
    usdValue: 2686,
    tokenName: "POPCAT",
    timestamp: new Date(Date.now() - 900000),
  },
];

const formatTimeSince = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const TradesTable = () => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
                {mockTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{trade.kolName}</span>
                        <div className="flex gap-2">
                          {trade.xLink && (
                            <a
                              href={trade.xLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {trade.telegramLink && (
                            <a
                              href={trade.telegramLink}
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
                        variant={trade.type === "buy" ? "default" : "destructive"}
                        className="uppercase font-semibold"
                      >
                        {trade.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-mono font-semibold text-foreground">
                          {trade.tonAmount.toFixed(2)} TON
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${trade.usdValue.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">${trade.tokenName}</span>
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
        {mockTrades.map((trade) => (
          <Card key={trade.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{trade.kolName}</span>
                  <div className="flex gap-2">
                    {trade.xLink && (
                      <a
                        href={trade.xLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {trade.telegramLink && (
                      <a
                        href={trade.telegramLink}
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
                  variant={trade.type === "buy" ? "default" : "destructive"}
                  className="uppercase font-semibold"
                >
                  {trade.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-foreground">
                    {trade.tonAmount.toFixed(2)} TON
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${trade.usdValue.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">${trade.tokenName}</div>
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
