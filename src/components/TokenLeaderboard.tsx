import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface TokenHeatmap {
  token_symbol: string;
  token_name: string;
  token_address: string;
  volume_ton: number;
}

const API_BASE = "https://apitonkol.pro";

export const TokenLeaderboard = () => {
  const [tokens, setTokens] = useState<TokenHeatmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tokens/heatmap?timeframe=24h`, {
        headers: {
          'X-API-Key': 'sk_project1_abc123',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTokens(data.tokens || []);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch token heatmap:", error);
      setError(error instanceof Error ? error.message : "Failed to load token data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Card className="p-6">
          <p className="text-destructive font-semibold mb-2">Unable to load token data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground mt-4">
            The /api/tokens/heatmap endpoint may not be available yet on the backend.
          </p>
        </Card>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center py-8">
        <Card className="p-6">
          <p className="text-muted-foreground">No token data available</p>
        </Card>
      </div>
    );
  }

  // Calculate color intensity based on volume
  const getHeatColor = (volume: number, maxVolume: number) => {
    const intensity = (volume / maxVolume) * 100;
    if (intensity >= 80) return "from-red-500/20 to-orange-500/20 border-red-500/30";
    if (intensity >= 60) return "from-orange-500/20 to-yellow-500/20 border-orange-500/30";
    if (intensity >= 40) return "from-yellow-500/20 to-green-500/20 border-yellow-500/30";
    if (intensity >= 20) return "from-green-500/20 to-blue-500/20 border-green-500/30";
    return "from-blue-500/20 to-purple-500/20 border-blue-500/30";
  };

  // Show only top 5 tokens
  const topTokens = tokens.slice(0, 5);
  const maxVolume = topTokens.length > 0 ? topTokens[0].volume_ton : 1;

  return (
    <div className="space-y-6">
      {/* Heat Map Grid - Desktop & Tablet */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topTokens.map((token, idx) => (
          <a
            key={token.token_address}
            href={`https://tonviewer.com/${token.token_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <Card 
              className={`p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 bg-gradient-to-br ${getHeatColor(token.volume_ton, maxVolume)}`}
            >
              <div className="absolute top-3 right-3 text-4xl font-bold text-foreground/5">
                #{idx + 1}
              </div>
              
              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      ${token.token_symbol}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {token.token_name}
                    </div>
                  </div>
                  <TrendingUp className="w-5 h-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-mono text-foreground">
                      {token.volume_ton.toFixed(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">TON</span>
                  </div>
                  
                  {/* Volume bar */}
                  <div className="w-full bg-background/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(token.volume_ton / maxVolume) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    24h KOL Trading Volume
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="sm:hidden space-y-3">
        {topTokens.map((token, idx) => (
          <a
            key={token.token_address}
            href={`https://tonviewer.com/${token.token_address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Card 
              className={`p-4 relative overflow-hidden transition-all duration-300 active:scale-95 border-2 bg-gradient-to-r ${getHeatColor(token.volume_ton, maxVolume)}`}
            >
              <div className="absolute top-2 right-2 text-3xl font-bold text-foreground/5">
                #{idx + 1}
              </div>
              
              <div className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="text-xl font-bold text-foreground">
                      ${token.token_symbol}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1 pr-2">
                      {token.token_name}
                    </div>
                  </div>
                  <TrendingUp className="w-4 h-4 text-primary opacity-60 flex-shrink-0 mt-1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold font-mono text-foreground">
                      {token.volume_ton.toFixed(0)}
                    </span>
                    <span className="text-xs text-muted-foreground">TON</span>
                  </div>
                  
                  {/* Volume bar */}
                  <div className="w-full bg-background/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${(token.volume_ton / maxVolume) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    24h KOL Trading Volume
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};
