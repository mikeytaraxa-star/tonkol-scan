import { Twitter, Send } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KOL {
  id: string;
  rank: number;
  name: string;
  xLink?: string;
  telegramLink?: string;
  totalTrades: number;
  profitLoss: number;
  profitLossPercentage: number;
  winRate: number;
}

const mockLeaderboard: KOL[] = [
  {
    id: "1",
    rank: 1,
    name: "CryptoWhale",
    xLink: "https://x.com/cryptowhale",
    telegramLink: "https://t.me/cryptowhale",
    totalTrades: 342,
    profitLoss: 125000,
    profitLossPercentage: 45.2,
    winRate: 72.5,
  },
  {
    id: "2",
    rank: 2,
    name: "DeFiTrader",
    telegramLink: "https://t.me/defitrader",
    totalTrades: 289,
    profitLoss: 98500,
    profitLossPercentage: 38.7,
    winRate: 68.3,
  },
  {
    id: "3",
    rank: 3,
    name: "SolanaMaxi",
    xLink: "https://x.com/solanamaxi",
    totalTrades: 412,
    profitLoss: 87200,
    profitLossPercentage: 32.4,
    winRate: 65.8,
  },
  {
    id: "4",
    rank: 4,
    name: "MemeKing",
    xLink: "https://x.com/memeking",
    telegramLink: "https://t.me/memeking",
    totalTrades: 567,
    profitLoss: 54300,
    profitLossPercentage: 28.1,
    winRate: 61.2,
  },
  {
    id: "5",
    rank: 5,
    name: "NFTCollector",
    xLink: "https://x.com/nftcollector",
    totalTrades: 198,
    profitLoss: -15400,
    profitLossPercentage: -12.3,
    winRate: 42.7,
  },
];

const getRankBadge = (rank: number) => {
  return rank;
};

export const LeaderboardTable = () => {
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
                {mockLeaderboard.map((kol) => (
                  <tr key={kol.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-2xl font-bold">{getRankBadge(kol.rank)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">{kol.name}</span>
                        <div className="flex gap-2">
                          {kol.xLink && (
                            <a
                              href={kol.xLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Twitter className="h-4 w-4" />
                            </a>
                          )}
                          {kol.telegramLink && (
                            <a
                              href={kol.telegramLink}
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
                      <span className="font-medium text-foreground">{kol.totalTrades}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`font-mono font-bold ${
                          kol.profitLoss >= 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {kol.profitLoss >= 0 ? "+$" : "-$"}{Math.abs(kol.profitLoss).toLocaleString()}
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
        {mockLeaderboard.map((kol) => (
          <Card key={kol.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{getRankBadge(kol.rank)}</span>
                  <div>
                    <div className="font-medium text-foreground">{kol.name}</div>
                    <div className="text-sm text-muted-foreground">{kol.totalTrades} trades</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {kol.xLink && (
                    <a
                      href={kol.xLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                    </a>
                  )}
                  {kol.telegramLink && (
                    <a
                      href={kol.telegramLink}
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
                    kol.profitLoss >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {kol.profitLoss >= 0 ? "+$" : "-$"}{Math.abs(kol.profitLoss).toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
