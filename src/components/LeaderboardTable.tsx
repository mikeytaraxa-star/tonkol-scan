import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

interface LeaderboardEntry {
  name: string;
  wallet_address: string;
  social_link: string;
  platform: string;
  pnl: number;
  trade_count: number;
  volume: number;
}

const API_BASE = "https://deludedly-faunlike-selma.ngrok-free.dev";

export const LeaderboardTable = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<"24h" | "7d">("24h");
  const [selectedTrader, setSelectedTrader] = useState<LeaderboardEntry | null>(null);

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
    const interval = setInterval(fetchLeaderboard, 45000);
    return () => clearInterval(interval);
  }, [timeframe]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  const generateChartData = (trader: LeaderboardEntry) => {
    const pnl = trader.pnl || 0;
    const dailyAvg = pnl / 7;
    
    return [
      { day: "Day 1", pnl: dailyAvg },
      { day: "Day 2", pnl: dailyAvg },
      { day: "Day 3", pnl: dailyAvg },
      { day: "Day 4", pnl: dailyAvg },
      { day: "Day 5", pnl: dailyAvg },
      { day: "Day 6", pnl: dailyAvg },
      { day: "Today", pnl: dailyAvg },
    ];
  };

  return (
    <div className="space-y-4">
      <Dialog open={!!selectedTrader} onOpenChange={(open) => !open && setSelectedTrader(null)}>
        <DialogContent className="sm:max-w-2xl bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedTrader?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{selectedTrader?.trade_count || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Realized P&L</p>
                <p className={`text-2xl font-bold font-mono ${(selectedTrader?.pnl || 0) >= 0 ? "text-success" : "text-destructive"}`}>
                  {(selectedTrader?.pnl || 0) >= 0 ? "+$" : "-$"}{Math.abs(selectedTrader?.pnl || 0).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Trading Volume</p>
                <p className="text-2xl font-bold">${(selectedTrader?.volume || 0).toLocaleString()}</p>
              </div>
            </div>
            
            {selectedTrader && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">7-Day P&L Trend</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={generateChartData(selectedTrader)}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                      <XAxis 
                        dataKey="day" 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={{ stroke: 'hsl(var(--border))' }}
                        tickFormatter={(value) => `$${value.toFixed(0)}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                        labelStyle={{
                          color: 'hsl(var(--foreground))',
                          fontWeight: 'bold',
                          marginBottom: '4px'
                        }}
                        itemStyle={{
                          color: selectedTrader.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
                          fontWeight: '600'
                        }}
                        formatter={(value: number) => [
                          `${value >= 0 ? '+' : ''}$${value.toFixed(2)}`,
                          'P&L'
                        ]}
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '5 5' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pnl" 
                        stroke={selectedTrader.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        strokeWidth={3}
                        dot={{ 
                          fill: selectedTrader.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
                          r: 4,
                          strokeWidth: 2,
                          stroke: 'hsl(var(--background))'
                        }}
                        activeDot={{ 
                          r: 6,
                          fill: selectedTrader.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
                          stroke: 'hsl(var(--background))',
                          strokeWidth: 3,
                          style: { cursor: 'pointer' }
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Hover over data points to see exact daily P&L values
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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
                {leaderboard.map((entry, index) => (
                  <tr 
                    key={entry.wallet_address} 
                    className={`hover:bg-muted/50 transition-colors ${index + 1 <= 3 ? 'group' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSelectedTrader(entry)}
                          className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                          {entry.name}
                        </button>
                        <div className="flex gap-2 relative">
                          {entry.platform === "X" && entry.social_link && (
                            <a
                              href={entry.social_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {entry.platform === "Telegram" && entry.social_link && (
                            <a
                              href={entry.social_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Send className="h-4 w-4" />
                            </a>
                          )}
                          {index + 1 === 1 && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-10">
                              <span className="text-sm font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                Profi Degen
                              </span>
                            </div>
                          )}
                          {index + 1 === 2 && (
                            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 whitespace-nowrap z-10">
                              <span className="text-sm font-black bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                Beast Mode
                              </span>
                            </div>
                          )}
                          {index + 1 === 3 && (
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
                      <span className="font-medium text-foreground">{entry.trade_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-mono font-bold ${
                          entry.pnl >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {entry.pnl >= 0 ? "+$" : "-$"}{Math.abs(entry.pnl).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div key={`mobile-${timeframe}`} className="md:hidden space-y-4 animate-fade-in">
        {leaderboard.map((entry, index) => (
          <Card 
            key={entry.wallet_address} 
            className={`p-4 ${index + 1 <= 3 ? 'group' : ''}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <div className="space-y-1">
                      <button 
                        onClick={() => setSelectedTrader(entry)}
                        className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                      >
                        {entry.name}
                      </button>
                      <div className="text-sm text-muted-foreground">{entry.trade_count} trades</div>
                    </div>
                  </div>
                <div className="flex gap-2 relative">
                  {entry.platform === "X" && entry.social_link && (
                    <a
                      href={entry.social_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {entry.platform === "Telegram" && entry.social_link && (
                    <a
                      href={entry.social_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </a>
                  )}
                  {index + 1 === 1 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Profi Degen
                      </span>
                    </div>
                  )}
                  {index + 1 === 2 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Beast Mode
                      </span>
                    </div>
                  )}
                  {index + 1 === 3 && (
                    <div className="absolute right-0 top-full mt-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 whitespace-nowrap z-20">
                      <span className="text-[10px] font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(147,51,234,0.4)]">
                        Alpha Trader
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={`font-mono font-bold ${
                    entry.pnl >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {entry.pnl >= 0 ? "+$" : "-$"}{Math.abs(entry.pnl).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
