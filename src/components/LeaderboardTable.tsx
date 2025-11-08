import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
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

const API_BASE = "http://89.58.30.186:8080";

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard?timeframe=24h&limit=20`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 45000); // Refresh every 45s
    return () => clearInterval(interval);
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trades</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((entry) => (
                  <tr key={entry.wallet_address} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">{entry.rank}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{entry.kol_name}</span>
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
                      <span className="font-medium text-foreground">{entry.trade_count_24h}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-mono font-bold ${
                          entry.total_pnl_24h >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {entry.total_pnl_24h >= 0 ? "+$" : "-$"}{Math.abs(entry.total_pnl_24h).toLocaleString()}
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
      <div className="md:hidden space-y-4">
        {leaderboard.map((entry) => (
          <Card key={entry.wallet_address} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{entry.rank}</span>
                  <div>
                    <div className="font-medium text-foreground">{entry.kol_name}</div>
                    <div className="text-sm text-muted-foreground">{entry.trade_count_24h} trades</div>
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
                    entry.total_pnl_24h >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {entry.total_pnl_24h >= 0 ? "+$" : "-$"}{Math.abs(entry.total_pnl_24h).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
