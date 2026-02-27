import { useEffect } from "react";
import { Header } from "@/components/Header";
import { TradesTable } from "@/components/TradesTable";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TokenLeaderboard } from "@/components/TokenLeaderboard";
import { TelegramCTA } from "@/components/TelegramCTA";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Trophy, Flame } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const tabMap: Record<string, string> = {
  trades: "trades",
  kol: "kol-leaderboard",
  token: "token-leaderboard",
};

const reverseTabMap: Record<string, string> = {
  trades: "trades",
  "kol-leaderboard": "kol",
  "token-leaderboard": "token",
};

const seoMeta: Record<string, { title: string; description: string }> = {
  trades: {
    title: "Real-Time KOL Trades on TON | Tonkol",
    description: "Monitor live trading activity from top KOLs on TON. Track buys, sells, amounts, and tokens in real-time.",
  },
  "kol-leaderboard": {
    title: "KOL Leaderboard — Top TON Traders | Tonkol",
    description: "Discover the top-performing KOL traders on TON ranked by PnL, win rate, and trading volume.",
  },
  "token-leaderboard": {
    title: "Token Leaderboard — Trending TON Tokens | Tonkol",
    description: "See which TON tokens are trending among tracked KOLs, ranked by trading volume.",
  },
};

const Index = () => {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const activeTab = tabMap[tab ?? ""] ?? "trades";

  useEffect(() => {
    const meta = seoMeta[activeTab] ?? seoMeta.trades;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", meta.description);
  }, [activeTab]);

  const handleTabChange = (value: string): void => {
    const path = reverseTabMap[value] ?? "trades";
    navigate(path === "trades" ? "/" : `/${path}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <AdBanner />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 pb-24 sm:pb-0">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
          {/* Desktop tabs - iOS style segmented control */}
          <TabsList className="hidden sm:grid w-full grid-cols-3 max-w-3xl mx-auto h-11 p-1 rounded-full bg-muted/60">
            <TabsTrigger value="trades" className="text-sm font-semibold flex items-center justify-center gap-2 rounded-full data-[state=active]:shadow-sm transition-all">
              <Activity className="h-4 w-4" />
              <span>Trades</span>
            </TabsTrigger>
            <TabsTrigger value="kol-leaderboard" className="text-sm font-semibold flex items-center justify-center gap-2 rounded-full data-[state=active]:shadow-sm transition-all">
              <Trophy className="h-4 w-4" />
              <span>KOL Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="token-leaderboard" className="text-sm font-semibold flex items-center justify-center gap-2 rounded-full data-[state=active]:shadow-sm transition-all">
              <Flame className="h-4 w-4" />
              <span>Token Leaderboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight">Real-Time Trades</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor live trading activity from top KOLs on TON
              </p>
            </div>
            <TradesTable />
          </TabsContent>

          <TabsContent value="kol-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight">KOL Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON KOLs ranked by profit & loss performance
              </p>
            </div>
            <LeaderboardTable />
          </TabsContent>

          <TabsContent value="token-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2 tracking-tight">Token Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON Tokens ranked by trading volume
              </p>
            </div>
            <TokenLeaderboard />
          </TabsContent>
        </Tabs>
      </main>
      
      <TelegramCTA />
      <Footer />

      {/* Mobile bottom navigation - iOS style */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 glass border-t border-border/30 z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-3 h-16 pb-1">
          <button
            onClick={() => handleTabChange("trades")}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
              activeTab === "trades" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Activity className={`h-5 w-5 transition-transform duration-200 ${activeTab === "trades" ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium">Trades</span>
          </button>
          <button
            onClick={() => handleTabChange("kol-leaderboard")}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
              activeTab === "kol-leaderboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Trophy className={`h-5 w-5 transition-transform duration-200 ${activeTab === "kol-leaderboard" ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium">KOLs</span>
          </button>
          <button
            onClick={() => handleTabChange("token-leaderboard")}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
              activeTab === "token-leaderboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Flame className={`h-5 w-5 transition-transform duration-200 ${activeTab === "token-leaderboard" ? "scale-110" : ""}`} />
            <span className="text-[10px] font-medium">Tokens</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
