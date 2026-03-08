import { useState, useEffect } from "react";
import { Twitter, Send, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KOLProfileDialog } from "./KOLProfileDialog";

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

const API_BASE = "https://apitonkol.pro";

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
  const [selectedKOL, setSelectedKOL] = useState<{ wallet: string; name: string } | null>(null);

  const filterTrade = (trade: Trade): boolean => {
    return trade.amount_ton > 1;
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    const seenTxHashes = new Set<string>();

    const fetchInitialTrades = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/trades/recent?limit=50`, {
          headers: {
            'X-API-Key': 'sk_project1_abc123',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        const fetchedTrades = data.trades || [];
        
        const filteredTrades = fetchedTrades.filter((trade: Trade) => {
          if (seenTxHashes.has(trade.tx_hash)) return false;
          seenTxHashes.add(trade.tx_hash);
          return filterTrade(trade);
        });
        
        setTrades(filteredTrades);
      } catch (error) {
        console.error("Failed to fetch initial trades:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const connectWebSocket = () => {
      ws = new WebSocket("wss://apitonkol.pro/ws/trades/full?api_key=sk_project1_abc123");

      ws.onmessage = (event) => {
        try {
          const newTrade: Trade = JSON.parse(event.data);
          
          if (seenTxHashes.has(newTrade.tx_hash) || !filterTrade(newTrade)) {
            return;
          }
          
          seenTxHashes.add(newTrade.tx_hash);
          setTrades(prev => [newTrade, ...prev].slice(0, 50));
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket closed, reconnecting in 3 seconds...");
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws?.close();
      };
    };

    fetchInitialTrades();
    connectWebSocket();

    const timeInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      ws?.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {trades.map((trade) => (
          <Card
            key={trade.tx_hash}
            className="p-4 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
          >
            {/* Header: trader + badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setSelectedKOL({ wallet: trade.wallet_address, name: trade.kol_name })}
                  className="font-semibold text-sm text-foreground hover:text-primary cursor-pointer transition-colors truncate"
                >
                  {trade.kol_name}
                </button>
                {trade.kol_platform === "X" && trade.kol_social && (
                  <a href={trade.kol_social} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                )}
                {trade.kol_platform === "Telegram" && trade.kol_social && (
                  <a href={trade.kol_social} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors shrink-0">
                    <Send className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <Badge
                variant={trade.trade_type === "buy" ? "default" : "destructive"}
                className="uppercase text-[10px] font-bold shrink-0"
              >
                {trade.trade_type}
              </Badge>
            </div>

            {/* Token + Amount */}
            <div className="space-y-1.5">
              <a
                href={`https://tonviewer.com/${trade.token_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-primary hover:underline block truncate"
              >
                ${trade.token_symbol}
              </a>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {trade.amount_ton.toFixed(2)} TON
                </span>
                <span className="text-xs text-muted-foreground">
                  ${trade.value_usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Footer: time + buy button */}
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {formatTimeSince(trade.timestamp)}
              </span>
              <Button
                asChild
                size="sm"
                className="h-7 px-3 text-xs font-bold gap-1"
              >
                <a
                  href="https://t.me/groypfi_bot?start=ref_7491048574"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Buy
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <KOLProfileDialog
        open={selectedKOL !== null}
        onOpenChange={(open) => !open && setSelectedKOL(null)}
        walletAddress={selectedKOL?.wallet || ""}
        kolName={selectedKOL?.name || ""}
      />
    </div>
  );
};
