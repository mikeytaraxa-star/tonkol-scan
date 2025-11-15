import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

const API_BASE = "https://deludedly-faunlike-selma.ngrok-free.dev";

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/leaderboard?timeframe=${timeframe}&limit=30`, {
        headers: {
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

  const currentPnl = (entry: LeaderboardEntry) => 
    timeframe === "24h" ? entry.total_pnl_24h : entry.total_pnl_7d;
  
  const currentTradeCount = (entry: LeaderboardEntry) => 
    timeframe === "24h" ? entry.trade_count_24h : entry.trade_count_7d;

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value as "24h" | "7d")}>
          <ToggleGroupItem value="24h" aria-label="24 hours">
            24H
          </ToggleGroupItem>
          <ToggleGroupItem value="7d" aria-label="7 days">
            7D
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div key={timeframe} className="hidden md:block animate-fade-in">
        <Card className="overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
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
                {leaderboard.map((entry) => {
                  const getBgClass = () => {
                    if (entry.rank === 1) return 'bg-yellow-500/5 hover:bg-yellow-500/10';
                    if (entry.rank === 2) return 'bg-gray-400/5 hover:bg-gray-400/10';
                    if (entry.rank === 3) return 'bg-amber-600/5 hover:bg-amber-600/10';
                    return 'hover:bg-muted/50';
                  };
                  
                  return (
                  <tr 
                    key={entry.wallet_address} 
                    className={`transition-colors ${entry.rank <= 3 ? 'group' : ''} ${getBgClass()}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">{entry.rank}</span>
                    </td>
                    <td className="px-6 py-4 relative overflow-visible">
                      <div className="flex items-center gap-3 relative overflow-visible">
                        <span className="font-medium text-foreground">{entry.kol_name}</span>
                        {entry.rank === 1 && (
                          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                            <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                              Profi Degen
                            </span>
                          </div>
                        )}
                        {entry.rank === 2 && (
                          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                            <span className="text-2xl font-black bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(209,213,219,0.6)]">
                              Beast Mode
                            </span>
                          </div>
                        )}
                        {entry.rank === 3 && (
                          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                            <span className="text-2xl font-black bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(217,119,6,0.6)]">
                              Somebody stop him
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2">
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
                )})}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile view */}
      <div key={`mobile-${timeframe}`} className="md:hidden space-y-4 animate-fade-in">
        {leaderboard.map((entry) => {
          const getBgClass = () => {
            if (entry.rank === 1) return 'bg-yellow-500/5 hover:bg-yellow-500/10';
            if (entry.rank === 2) return 'bg-gray-400/5 hover:bg-gray-400/10';
            if (entry.rank === 3) return 'bg-amber-600/5 hover:bg-amber-600/10';
            return '';
          };
          
          return (
          <Card 
            key={entry.wallet_address} 
            className={`p-4 relative overflow-visible ${entry.rank <= 3 ? 'group' : ''} ${getBgClass()}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{entry.rank}</span>
                    <div className="relative overflow-visible">
                      <div className="font-medium text-foreground">{entry.kol_name}</div>
                      {entry.rank === 1 && (
                        <div className="absolute left-0 top-full mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                          <span className="text-lg font-black bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                            Profi Degen
                          </span>
                        </div>
                      )}
                      {entry.rank === 2 && (
                        <div className="absolute left-0 top-full mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                          <span className="text-lg font-black bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(209,213,219,0.6)]">
                            Beast Mode
                          </span>
                        </div>
                      )}
                      {entry.rank === 3 && (
                        <div className="absolute left-0 top-full mt-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-50">
                          <span className="text-lg font-black bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_20px_rgba(217,119,6,0.6)]">
                            Somebody stop him
                          </span>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">{currentTradeCount(entry)} trades</div>
                    </div>
                  </div>
                <div className="flex gap-2">
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
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={`font-mono font-bold ${
                    currentPnl(entry) >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {currentPnl(entry) >= 0 ? "+$" : "-$"}{Math.abs(currentPnl(entry)).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        )})}
      </div>
    </div>
  );
};
