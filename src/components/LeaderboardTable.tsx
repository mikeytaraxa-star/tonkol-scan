import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { KOLProfileDialog } from "@/components/KOLProfileDialog";
import { useState, useEffect } from "react";

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
  onSelect,
}: {
  entry: LeaderboardEntry;
  pnl: number;
  maxPnl: number;
  side: "profit" | "loss";
  onSelect: (wallet: string, name: string) => void;
}) => {
  const heightPercent = maxPnl === 0 ? 5 : Math.max(5, (Math.abs(pnl) / maxPnl) * 100);
  const isProfit = side === "profit";

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0 max-w-[80px]">
      {/* Candle */}
      <div className="w-full flex flex-col items-center justify-end h-[180px] sm:h-[240px]">
        <div
          className={`w-3/4 rounded-t-sm transition-all duration-500 ${
            isProfit
              ? "bg-gradient-to-t from-[hsl(var(--success))] to-[hsl(var(--success)/0.6)]"
              : "bg-gradient-to-t from-[hsl(var(--destructive))] to-[hsl(var(--destructive)/0.6)]"
          }`}
          style={{ height: `${heightPercent}%` }}
        />
        {/* Wick line */}
        <div
          className={`w-0.5 h-2 ${
            isProfit ? "bg-[hsl(var(--success)/0.5)]" : "bg-[hsl(var(--destructive)/0.5)]"
          }`}
        />
      </div>

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
  );
};

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");
  const [selectedKOL, setSelectedKOL] = useState<{ wallet: string; name: string } | null>(null);

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
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 45000);
    return () => clearInterval(interval);
  }, [timeframe]);

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
        {/* Split view: Profitable vs Negative */}
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
                    onSelect={handleSelect}
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
                    onSelect={handleSelect}
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
