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

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");
  const [selectedKOL, setSelectedKOL] = useState<{ wallet: string; name: string } | null>(null);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard?timeframe=${timeframe}&limit=30`, {
        headers: {
          'X-API-Key': 'sk_project1_abc123',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setError(error instanceof Error ? error.message : "Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 45000); // Refresh every 45s
    return () => clearInterval(interval);
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive font-semibold mb-2">Unable to load leaderboard</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">No leaderboard data available</p>
      </Card>
    );
  }

  const currentPnl = (entry: LeaderboardEntry) => 
    timeframe === "24h" ? entry.total_pnl_24h : entry.total_pnl_7d;
  
  const currentTradeCount = (entry: LeaderboardEntry) => 
    timeframe === "24h" ? entry.trade_count_24h : entry.trade_count_7d;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-center mb-3 sm:mb-4">
        <ToggleGroup 
          type="single" 
          value={timeframe} 
          onValueChange={(value) => value && setTimeframe(value as "24h" | "7d")}
          className="bg-muted p-1"
        >
          <ToggleGroupItem value="24h" aria-label="24 hours" className="text-sm">
            24H
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="7 days" className="text-sm">
            7D
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div key={timeframe} className="hidden md:block animate-fade-in">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trades</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((entry) => (
                  <tr 
                    key={entry.wallet_address} 
                    className={`hover:bg-muted/50 transition-colors ${entry.rank <= 3 ? 'group' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">{entry.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedKOL({ wallet: entry.wallet_address, name: entry.kol_name })}
                          className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          {entry.kol_name}
                        </button>
                        <div className="flex gap-2 relative">
                          {entry.kol_platform === "X" && entry.kol_social && (
                            <a
                              href={entry.kol_social}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {entry.kol_platform === "Telegram" && entry.kol_social && (
                            <a
                              href={entry.kol_social}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </a>
                          )}
                          {entry.rank === 1 && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-10">
                              <span className="text-sm font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                Profi Degen
                              </span>
                            </div>
                          )}
                          {entry.rank === 2 && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-10">
                              <span className="text-sm font-black bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                Beast Mode
                              </span>
                            </div>
                          )}
                          {entry.rank === 3 && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-10">
                              <span className="text-sm font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                Alpha Trader
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">{currentTradeCount(entry)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-mono font-bold ${
                          currentPnl(entry) >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {currentPnl(entry) >= 0 ? "+$" : "-$"}{Math.abs(currentPnl(entry)).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile view */}
      <div key={`mobile-${timeframe}`} className="md:hidden space-y-3 sm:space-y-4 animate-fade-in">
        {leaderboard.map((entry) => (
          <Card 
            key={entry.wallet_address} 
            className={`p-3 sm:p-4 ${entry.rank <= 3 ? 'group' : ''}`}
          >
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl font-bold">{entry.rank}</span>
                    <div className="space-y-0.5 sm:space-y-1">
                      <button
                        onClick={() => setSelectedKOL({ wallet: entry.wallet_address, name: entry.kol_name })}
                        className="font-medium text-sm sm:text-base text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {entry.kol_name}
                      </button>
                      <div className="text-xs sm:text-sm text-muted-foreground">{currentTradeCount(entry)} trades</div>
                    </div>
                  </div>
                <div className="flex gap-2 relative">
                  {entry.kol_platform === "X" && entry.kol_social && (
                    <a
                      href={entry.kol_social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {entry.kol_platform === "Telegram" && entry.kol_social && (
                    <a
                      href={entry.kol_social}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </a>
                  )}
                  {entry.rank === 1 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Profi Degen
                      </span>
                    </div>
                  )}
                  {entry.rank === 2 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Beast Mode
                      </span>
                    </div>
                  )}
                  {entry.rank === 3 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Alpha Trader
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div
                  className={`font-mono font-bold text-base sm:text-lg ${
                    currentPnl(entry) >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {currentPnl(entry) >= 0 ? "+$" : "-$"}{Math.abs(currentPnl(entry)).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
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
