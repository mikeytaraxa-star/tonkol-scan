import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TokenPerformance {
  token_symbol: string;
  token_name: string;
  token_address: string;
  total_volume_usd: number;
  total_trades: number;
  unique_traders: number;
  avg_price_change_7d: number;
  daily_performance: {
    date: string;
    volume_usd: number;
    trades: number;
    price_change: number;
  }[];
}

const API_BASE = "https://apitonkol.pro";

export const TokenLeaderboard = () => {
  const [tokens, setTokens] = useState<TokenPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTokens = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tokens/leaderboard?timeframe=7d&limit=20`, {
        headers: {
          'X-API-Key': 'sk_project1_abc123',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (error) {
      console.error("Failed to fetch token leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  const getPerformanceColor = (change: number) => {
    if (change > 20) return "bg-green-600";
    if (change > 10) return "bg-green-500";
    if (change > 5) return "bg-green-400";
    if (change > 0) return "bg-green-300";
    if (change > -5) return "bg-yellow-300";
    if (change > -10) return "bg-orange-400";
    if (change > -20) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPerformanceLabel = (change: number) => {
    return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Heat Map */}
      <div className="hidden md:block">
        <Card className="p-6">
          <div className="space-y-4">
            {tokens.map((token, idx) => (
              <div key={token.token_address} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-sm font-semibold text-muted-foreground w-8">
                      #{idx + 1}
                    </span>
                    <div className="min-w-[200px]">
                      <a
                        href={`https://tonviewer.com/${token.token_address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline"
                      >
                        ${token.token_symbol}
                      </a>
                      <div className="text-sm text-muted-foreground">
                        {token.token_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {token.total_trades} trades
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {token.unique_traders} traders
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className="font-mono font-semibold">
                      ${token.total_volume_usd.toLocaleString()}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        token.avg_price_change_7d >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {getPerformanceLabel(token.avg_price_change_7d)}
                    </div>
                  </div>
                </div>

                {/* Heat Map Row */}
                <div className="flex gap-1 ml-12">
                  {token.daily_performance.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="flex-1 group relative"
                      title={`${day.date}: ${getPerformanceLabel(day.price_change)}`}
                    >
                      <div
                        className={`h-12 rounded ${getPerformanceColor(
                          day.price_change
                        )} transition-all hover:opacity-80 cursor-pointer`}
                      >
                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-semibold text-white drop-shadow">
                            {getPerformanceLabel(day.price_change)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute -bottom-5 left-0 right-0 text-[10px] text-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t">
            <div className="text-sm font-semibold mb-3">Performance Scale</div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <span className="text-xs text-muted-foreground">&lt; -20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-500"></div>
                <span className="text-xs text-muted-foreground">-20% to -10%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-400"></div>
                <span className="text-xs text-muted-foreground">-10% to -5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-300"></div>
                <span className="text-xs text-muted-foreground">-5% to 0%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-300"></div>
                <span className="text-xs text-muted-foreground">0% to 5%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-400"></div>
                <span className="text-xs text-muted-foreground">5% to 10%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500"></div>
                <span className="text-xs text-muted-foreground">10% to 20%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-600"></div>
                <span className="text-xs text-muted-foreground">&gt; 20%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {tokens.map((token, idx) => (
          <Card key={token.token_address} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <div>
                    <a
                      href={`https://tonviewer.com/${token.token_address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      ${token.token_symbol}
                    </a>
                    <div className="text-sm text-muted-foreground">
                      {token.token_name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-sm">
                    ${token.total_volume_usd.toLocaleString()}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      token.avg_price_change_7d >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {getPerformanceLabel(token.avg_price_change_7d)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {token.total_trades} trades
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {token.unique_traders} traders
                </Badge>
              </div>

              {/* Mobile Heat Map */}
              <div className="grid grid-cols-7 gap-1">
                {token.daily_performance.map((day, dayIdx) => (
                  <div key={dayIdx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-10 rounded ${getPerformanceColor(
                        day.price_change
                      )}`}
                      title={`${day.date}: ${getPerformanceLabel(day.price_change)}`}
                    ></div>
                    <span className="text-[8px] text-muted-foreground">
                      {day.date.split('-')[2]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
