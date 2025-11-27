import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center mb-4">
        <Badge variant="secondary" className="text-sm font-semibold px-4 py-2">
          KOL Trading Volume (24h)
        </Badge>
      </div>
      
      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="p-4 sm:p-6">
          <div className="space-y-3">
            {tokens.map((token, idx) => (
              <div key={token.token_address} className="flex items-center justify-between py-3 border-b last:border-0">
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
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">
                    {token.volume_ton.toFixed(2)} TON
                  </div>
                  <div className="text-sm text-muted-foreground">
                    24h Volume
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {tokens.map((token, idx) => (
          <Card key={token.token_address} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-sm font-semibold text-muted-foreground">
                  #{idx + 1}
                </span>
                <div className="flex-1">
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
                  {token.volume_ton.toFixed(2)} TON
                </div>
                <div className="text-xs text-muted-foreground">
                  24h Volume
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
