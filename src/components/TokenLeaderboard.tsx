import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

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

  // Calculate color intensity based on volume using theme colors
  const getHeatColor = (volume: number, maxVolume: number) => {
    const intensity = (volume / maxVolume) * 100;
    if (intensity >= 80) return "from-primary/30 to-accent/30 border-primary/50"; // Highest volume - primary blue
    if (intensity >= 60) return "from-primary/25 to-accent/25 border-primary/40";
    if (intensity >= 40) return "from-primary/20 to-accent/20 border-primary/30";
    if (intensity >= 20) return "from-primary/15 to-secondary/20 border-primary/20";
    return "from-secondary/20 to-muted/30 border-border"; // Lowest volume - lighter blue
  };

  // Get box size based on ranking
  const getBoxSize = (index: number) => {
    if (index === 0) return "lg:col-span-2 lg:row-span-2"; // Largest - #1
    if (index === 1) return "lg:col-span-1 lg:row-span-2"; // Tall - #2
    return "lg:col-span-1 lg:row-span-1"; // Standard - #3, #4, #5
  };

  // Get padding based on ranking
  const getPadding = (index: number) => {
    if (index === 0) return "p-8"; // Most padding for #1
    if (index === 1) return "p-6"; // Medium padding for #2
    return "p-5"; // Standard padding for others
  };

  // Filter out USDT and show only top 5 tokens
  const filteredTokens = tokens.filter(
    token => token.token_address !== 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs'
  );
  const topTokens = filteredTokens.slice(0, 5);
  const maxVolume = topTokens.length > 0 ? topTokens[0].volume_ton : 1;

  return (
    <div className="space-y-6">
      {/* Heat Map Grid - Desktop & Tablet */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {topTokens.map((token, idx) => (
          <a
            key={token.token_address}
            href={`https://tonviewer.com/${token.token_address}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`group ${getBoxSize(idx)}`}
            style={{ 
              animation: 'scale-in 0.5s ease-out',
              animationDelay: `${idx * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <Card 
              className={`${getPadding(idx)} h-full relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-xl hover:z-10 border-2 bg-gradient-to-br ${getHeatColor(token.volume_ton, maxVolume)}`}
            >
              <div 
                className={`absolute top-3 right-3 font-extrabold text-primary/20 group-hover:text-primary/40 group-hover:scale-110 transition-all duration-300 ${
                  idx === 0 ? 'text-6xl' : idx === 1 ? 'text-5xl' : 'text-4xl'
                }`}
              >
                #{idx + 1}
              </div>
              
              <div className="relative space-y-4 h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className={`font-bold text-foreground group-hover:text-primary transition-colors ${
                      idx === 0 ? 'text-4xl' : idx === 1 ? 'text-3xl' : 'text-2xl'
                    }`}>
                      ${token.token_symbol}
                    </div>
                    <div className={`text-muted-foreground line-clamp-2 ${
                      idx === 0 ? 'text-base' : 'text-sm'
                    }`}>
                      {token.token_name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold font-mono text-foreground transition-all duration-300 ${
                      idx === 0 ? 'text-5xl' : idx === 1 ? 'text-4xl' : 'text-3xl'
                    }`}>
                      {token.volume_ton.toFixed(0)}
                    </span>
                    <span className={`text-muted-foreground ${
                      idx === 0 ? 'text-base' : 'text-sm'
                    }`}>TON</span>
                  </div>
                  
                  {/* Volume bar */}
                  <div className={`w-full bg-background/50 rounded-full overflow-hidden ${
                    idx === 0 ? 'h-3' : 'h-2'
                  }`}>
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(token.volume_ton / maxVolume) * 100}%`,
                        transitionDelay: `${idx * 0.1}s`
                      }}
                    />
                  </div>
                  
                  <div className={`text-muted-foreground ${
                    idx === 0 ? 'text-sm' : 'text-xs'
                  }`}>
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
            style={{ 
              animation: 'fade-in 0.5s ease-out',
              animationDelay: `${idx * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <Card 
              className={`relative overflow-hidden transition-all duration-500 active:scale-95 border-2 bg-gradient-to-r ${getHeatColor(token.volume_ton, maxVolume)} ${
                idx === 0 ? 'p-6' : 'p-4'
              } group`}
            >
              <div className={`absolute top-2 right-2 font-extrabold text-primary/20 group-active:text-primary/40 group-active:scale-110 transition-all duration-300 ${
                idx === 0 ? 'text-4xl' : 'text-3xl'
              }`}>
                #{idx + 1}
              </div>
              
              <div className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className={`font-bold text-foreground ${
                      idx === 0 ? 'text-2xl' : 'text-xl'
                    }`}>
                      ${token.token_symbol}
                    </div>
                    <div className={`text-muted-foreground line-clamp-1 pr-2 ${
                      idx === 0 ? 'text-sm' : 'text-xs'
                    }`}>
                      {token.token_name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-bold font-mono text-foreground ${
                      idx === 0 ? 'text-3xl' : 'text-2xl'
                    }`}>
                      {token.volume_ton.toFixed(0)}
                    </span>
                    <span className="text-xs text-muted-foreground">TON</span>
                  </div>
                  
                  {/* Volume bar */}
                  <div className={`w-full bg-background/50 rounded-full overflow-hidden ${
                    idx === 0 ? 'h-2' : 'h-1.5'
                  }`}>
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${(token.volume_ton / maxVolume) * 100}%`,
                        transitionDelay: `${idx * 0.1}s`
                      }}
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
