import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Twitter, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Trade {
  token_symbol: string;
  token_name: string;
  token_address: string;
  trade_type: "buy" | "sell";
  amount_ton: number;
  value_usd: number;
  timestamp: string;
  tx_hash: string;
  dex_name: string;
}

interface KOLStats {
  kol_name: string;
  kol_social: string | null;
  kol_platform: string | null;
  wallet_address: string;
  total_trades: number;
  profitable_trades: number;
  win_rate: number;
  biggest_win: number;
  biggest_loss: number;
  total_pnl: number;
  recent_trades: Trade[];
  pnl_history: Array<{ date: string; pnl: number }>;
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
        `https://apitonkol.pro/api/kol/${walletAddress}/stats?timeframe=7d`,
        {
          headers: {
            "x-api-key": "sk_project1_abc123",
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{kolName}</span>
            {stats?.kol_social && (
              <a
                href={stats.kol_social}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {stats.kol_platform === "X" ? (
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
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Win Rate</div>
                <div className="text-2xl font-bold text-primary">
                  {stats.win_rate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.profitable_trades}/{stats.total_trades} trades
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total PnL</div>
                <div
                  className={`text-2xl font-bold ${
                    stats.total_pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stats.total_pnl >= 0 ? "+" : ""}${stats.total_pnl.toFixed(2)}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Biggest Win
                </div>
                <div className="text-2xl font-bold text-green-500">
                  +${stats.biggest_win.toFixed(2)}
                </div>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Biggest Loss
                </div>
                <div className="text-2xl font-bold text-red-500">
                  -${Math.abs(stats.biggest_loss).toFixed(2)}
                </div>
              </div>
            </div>

            {/* PnL Chart */}
            {stats.pnl_history && stats.pnl_history.length > 0 && (
              <div className="bg-card border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">7-Day PnL History</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.pnl_history}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      style={{ fontSize: "12px" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pnl"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Trades */}
            <div className="bg-card border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
              <div className="space-y-3">
                {stats.recent_trades.slice(0, 10).map((trade, idx) => (
                  <div
                    key={`${trade.tx_hash}-${idx}`}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Badge
                        variant={trade.trade_type === "buy" ? "default" : "secondary"}
                        className={
                          trade.trade_type === "buy"
                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        }
                      >
                        {trade.trade_type.toUpperCase()}
                      </Badge>
                      <div>
                        <div className="font-semibold">{trade.token_symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {trade.token_name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {trade.amount_ton.toFixed(2)} TON
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${trade.value_usd.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground ml-4">
                      {formatTimeSince(trade.timestamp)}
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
