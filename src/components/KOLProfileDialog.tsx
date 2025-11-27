import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Twitter, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Trade {
  token_symbol: string;
  token_name?: string;
  trade_type: "buy" | "sell";
  amount: number;
  value_usd: number;
  timestamp: string;
}

interface Holding {
  token_symbol: string;
  token_name: string;
  amount: number;
  invested_usd: number;
}

interface KOLStats {
  wallet_address: string;
  name: string;
  social_link: string | null;
  platform: string | null;
  stats_24h: {
    trade_count: number;
    realized_pnl: number;
    volume: number;
  };
  stats_7d: {
    trade_count: number;
    realized_pnl: number;
    volume: number;
    win_rate: number;
    biggest_win: number;
    biggest_loss: number;
    avg_trade_size: number;
  };
  pnl_chart: Array<{ date: string; pnl: number; volume: number }>;
  current_holdings: Holding[];
  recent_trades: Trade[];
}

interface KOLProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
  kolName: string;
}

export function KOLProfileDialog({
  open,
  onOpenChange,
  walletAddress,
  kolName,
}: KOLProfileDialogProps) {
  const [stats, setStats] = useState<KOLStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && walletAddress) {
      fetchKOLStats();
    }
  }, [open, walletAddress]);

  const fetchKOLStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://apitonkol.pro/api/kol/${walletAddress}`,
        {
          headers: {
            "X-API-Key": "sk_project1_abc123",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching KOL stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSince = (timestamp: string) => {
    const now = new Date();
    const tradeTime = new Date(timestamp);
    const diffMs = now.getTime() - tradeTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-3 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-xl sm:text-2xl">{kolName}</span>
            {stats?.social_link && (
              <a
                href={stats.social_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {stats.platform === "X" ? (
                  <Twitter className="h-5 w-5" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </a>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : stats ? (
          <div className="space-y-4 sm:space-y-6">
            {/* 24h Stats */}
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3">24h Performance</h3>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Trades</div>
                  <div className="text-lg sm:text-xl font-bold">{stats.stats_24h.trade_count}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">PnL</div>
                  <div className={`text-lg sm:text-xl font-bold ${stats.stats_24h.realized_pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stats.stats_24h.realized_pnl >= 0 ? "+" : ""}${stats.stats_24h.realized_pnl.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Volume</div>
                  <div className="text-lg sm:text-xl font-bold">${stats.stats_24h.volume.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* 7d Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-muted-foreground">7d Win Rate</div>
                <div className="text-xl sm:text-2xl font-bold text-primary">
                  {stats.stats_7d.win_rate.toFixed(1)}%
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  {stats.stats_7d.trade_count} trades
                </div>
              </div>

              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-muted-foreground">7d PnL</div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    stats.stats_7d.realized_pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stats.stats_7d.realized_pnl >= 0 ? "+" : ""}${stats.stats_7d.realized_pnl.toFixed(2)}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  Biggest Win
                </div>
                <div className="text-xl sm:text-2xl font-bold text-green-500">
                  +${stats.stats_7d.biggest_win.toFixed(2)}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  Biggest Loss
                </div>
                <div className="text-xl sm:text-2xl font-bold text-red-500">
                  -${Math.abs(stats.stats_7d.biggest_loss).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Average Trade Size */}
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-muted-foreground">Avg Trade Size (7d)</div>
              <div className="text-xl sm:text-2xl font-bold">${stats.stats_7d.avg_trade_size.toFixed(2)}</div>
            </div>

            {/* PnL Chart */}
            {stats.pnl_chart && Array.isArray(stats.pnl_chart) && stats.pnl_chart.length > 0 && (
              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">7-Day PnL History</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={stats.pnl_chart}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: "10px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pnl"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Current Holdings */}
            {stats.current_holdings && stats.current_holdings.length > 0 && (
              <div className="bg-card border rounded-lg p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Current Holdings</h3>
                <div className="space-y-2 sm:space-y-3">
                  {stats.current_holdings.map((holding, idx) => (
                    <div
                      key={`${holding.token_symbol}-${idx}`}
                      className="flex items-center justify-between p-2 sm:p-3 bg-background rounded-lg border"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm">{holding.token_symbol}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {holding.token_name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {holding.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${holding.invested_usd.toFixed(2)} invested
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Trades */}
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Trades</h3>
              <div className="space-y-2 sm:space-y-3">
                {(stats.recent_trades ?? []).slice(0, 10).map((trade, idx) => (
                  <div
                    key={`${trade.token_symbol}-${trade.timestamp}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-background rounded-lg border gap-2 sm:gap-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Badge
                        variant={trade.trade_type === "buy" ? "default" : "secondary"}
                        className={
                          trade.trade_type === "buy"
                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/30 text-xs"
                            : "bg-red-500/20 text-red-500 hover:bg-red-500/30 text-xs"
                        }
                      >
                        {trade.trade_type.toUpperCase()}
                      </Badge>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm truncate">{trade.token_symbol}</div>
                        {trade.token_name && (
                          <div className="text-xs text-muted-foreground truncate">
                            {trade.token_name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {trade.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${trade.value_usd.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeSince(trade.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
