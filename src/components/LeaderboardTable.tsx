import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KOLProfileDialog } from "@/components/KOLProfileDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";

interface LeaderboardEntry {
  rank: number;
  kol_name: string;
  kol_social: string;
  kol_platform: string;
  wallet_address: string;
  total_pnl_24h: number;
  total_pnl_7d: number;
  trade_count_24h: number;
  trade_count_7d: number;
  last_calculated: string;
}

const API_BASE = "https://apitonkol.pro";

const SocialIcon = ({ platform, social }: { platform: string; social: string }) => {
  if (!social) return null;
  const Icon = platform === "X" ? Twitter : platform === "Telegram" ? Send : null;
  if (!Icon) return null;
  return (
    <a href={social} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
};

const CandleBar = ({
  entry,
  pnl,
  maxPnl,
  side,
  tradeCount,
  onSelect,
  animated,
}: {
  entry: LeaderboardEntry;
  pnl: number;
  maxPnl: number;
  side: "profit" | "loss";
  tradeCount: number;
  onSelect: (wallet: string, name: string) => void;
  animated: boolean;
}) => {
  const heightPercent = maxPnl === 0 ? 5 : Math.max(5, (Math.abs(pnl) / maxPnl) * 100);
  const isProfit = side === "profit";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0 max-w-[80px] cursor-pointer group">
            {/* Candle */}
            <div className="w-full flex flex-col items-center justify-end h-[180px] sm:h-[240px]">
              <div
                className={`w-3/4 rounded-t-sm transition-all duration-700 ease-out group-hover:opacity-90 ${
                  isProfit
                    ? "bg-gradient-to-t from-[hsl(var(--success))] to-[hsl(var(--success)/0.6)]"
                    : "bg-gradient-to-t from-[hsl(var(--destructive))] to-[hsl(var(--destructive)/0.6)]"
                }`}
                style={{ height: animated ? `${heightPercent}%` : "0%" }}
              />
              <div
                className={`w-0.5 transition-all duration-500 ease-out ${
                  isProfit ? "bg-[hsl(var(--success)/0.5)]" : "bg-[hsl(var(--destructive)/0.5)]"
                }`}
                style={{ height: animated ? "8px" : "0px" }}
              />
            </div>

            {/* Trade count badge */}
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-mono">
              {tradeCount} trades
            </Badge>

            {/* PnL value */}
            <span
              className={`text-[10px] sm:text-xs font-mono font-bold ${
                isProfit ? "text-success" : "text-destructive"
              }`}
            >
              {isProfit ? "+" : "-"}${Math.abs(pnl).toLocaleString()}
            </span>

            {/* Name + social */}
            <div className="flex flex-col items-center gap-0.5 min-w-0 w-full">
              <button
                onClick={() => onSelect(entry.wallet_address, entry.kol_name)}
                className="text-[10px] sm:text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer truncate max-w-full text-center"
              >
                {entry.kol_name}
              </button>
              <SocialIcon platform={entry.kol_platform} social={entry.kol_social} />
            </div>

            {/* Rank badge */}
            <span className="text-[10px] text-muted-foreground font-medium">#{entry.rank}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="space-y-1.5 text-xs">
            <p className="font-bold text-sm">{entry.kol_name}</p>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">P&L</span>
              <span className={`font-mono font-bold ${isProfit ? "text-success" : "text-destructive"}`}>
                {isProfit ? "+" : "-"}${Math.abs(pnl).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Trades</span>
              <span className="font-mono font-semibold">{tradeCount}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Rank</span>
              <span className="font-semibold">#{entry.rank}</span>
            </div>
            {entry.total_pnl_24h !== 0 && entry.total_pnl_7d !== 0 && (
              <>
                <hr className="border-border" />
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">24h P&L</span>
                  <span className={`font-mono text-[11px] ${entry.total_pnl_24h >= 0 ? "text-success" : "text-destructive"}`}>
                    {entry.total_pnl_24h >= 0 ? "+" : "-"}${Math.abs(entry.total_pnl_24h).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">7d P&L</span>
                  <span className={`font-mono text-[11px] ${entry.total_pnl_7d >= 0 ? "text-success" : "text-destructive"}`}>
                    {entry.total_pnl_7d >= 0 ? "+" : "-"}${Math.abs(entry.total_pnl_7d).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");
  const [selectedKOL, setSelectedKOL] = useState<{ wallet: string; name: string } | null>(null);
  const [animated, setAnimated] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard?timeframe=${timeframe}`, {
        headers: {
          'X-API-Key': 'sk_project1_abc123',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setAnimated(false);
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 45000);
    return () => clearInterval(interval);
  }, [timeframe]);

  // Trigger grow animation after data loads
  useEffect(() => {
    if (!isLoading && leaderboard.length > 0) {
      const timer = setTimeout(() => setAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, leaderboard]);

  const currentPnl = (entry: LeaderboardEntry) =>
    timeframe === "24h" ? entry.total_pnl_24h : entry.total_pnl_7d;

  const currentTradeCount = (entry: LeaderboardEntry) =>
    timeframe === "24h" ? entry.trade_count_24h : entry.trade_count_7d;

  const handleSelect = (wallet: string, name: string) => setSelectedKOL({ wallet, name });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  const profitable = leaderboard.filter((e) => currentPnl(e) > 0);
  const breakeven = leaderboard.filter((e) => currentPnl(e) === 0);
  const negative = leaderboard.filter((e) => currentPnl(e) < 0);

  const maxProfit = profitable.length > 0 ? Math.max(...profitable.map((e) => currentPnl(e))) : 0;
  const maxLoss = negative.length > 0 ? Math.max(...negative.map((e) => Math.abs(currentPnl(e)))) : 0;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-center mb-3 sm:mb-4">
        <ToggleGroup
          type="single"
          value={timeframe}
          onValueChange={(value) => value && setTimeframe(value as "24h" | "7d")}
          className="bg-muted p-1"
        >
          <ToggleGroupItem value="24h" aria-label="24 hours" className="text-sm">24H</ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="7 days" className="text-sm">7D</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div key={timeframe} className="animate-fade-in space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Profitable side */}
          <Card className="p-4 sm:p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-success mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--success))]" />
              Profitable ({profitable.length})
            </h3>
            {profitable.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No profitable traders</p>
            ) : (
              <div className="flex items-end gap-2 overflow-x-auto pb-2">
                {profitable.map((entry) => (
                  <CandleBar
                    key={entry.wallet_address}
                    entry={entry}
                    pnl={currentPnl(entry)}
                    maxPnl={maxProfit}
                    side="profit"
                    tradeCount={currentTradeCount(entry)}
                    onSelect={handleSelect}
                    animated={animated}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Negative side */}
          <Card className="p-4 sm:p-6 overflow-hidden">
            <h3 className="text-sm font-bold text-destructive mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--destructive))]" />
              Negative ({negative.length})
            </h3>
            {negative.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No negative traders</p>
            ) : (
              <div className="flex items-end gap-2 overflow-x-auto pb-2">
                {negative.map((entry) => (
                  <CandleBar
                    key={entry.wallet_address}
                    entry={entry}
                    pnl={currentPnl(entry)}
                    maxPnl={maxLoss}
                    side="loss"
                    tradeCount={currentTradeCount(entry)}
                    onSelect={handleSelect}
                    animated={animated}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Breakeven section */}
        {breakeven.length > 0 && (
          <Card className="p-4 sm:p-6">
            <h3 className="text-sm font-bold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[hsl(var(--muted-foreground))]" />
              Breakeven ({breakeven.length})
            </h3>
            <div className="flex flex-wrap gap-3">
              {breakeven.map((entry) => (
                <div key={entry.wallet_address} className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
                  <button
                    onClick={() => handleSelect(entry.wallet_address, entry.kol_name)}
                    className="text-xs font-medium text-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    {entry.kol_name}
                  </button>
                  <SocialIcon platform={entry.kol_platform} social={entry.kol_social} />
                  <span className="text-[10px] text-muted-foreground">{currentTradeCount(entry)} trades</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <KOLProfileDialog
        open={!!selectedKOL}
        onOpenChange={(open) => !open && setSelectedKOL(null)}
        walletAddress={selectedKOL?.wallet || ""}
        kolName={selectedKOL?.name || ""}
      />
    </div>
  );
};
