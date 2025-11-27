import { useState } from "react";
import { Header } from "@/components/Header";
import { TradesTable } from "@/components/TradesTable";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TokenLeaderboard } from "@/components/TokenLeaderboard";
import { PriceTracker } from "@/components/PriceTracker";
import { TelegramCTA } from "@/components/TelegramCTA";
import { Footer } from "@/components/Footer";
import { PullToRefreshWrapper } from "@/components/PullToRefreshWrapper";
import { TradesTableSkeleton } from "@/components/skeletons/TradesTableSkeleton";
import { LeaderboardTableSkeleton } from "@/components/skeletons/LeaderboardTableSkeleton";
import { TokenLeaderboardSkeleton } from "@/components/skeletons/TokenLeaderboardSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Trophy, Flame } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("trades");
  const [tradesKey, setTradesKey] = useState(0);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [tokensKey, setTokensKey] = useState(0);
  const [isRefreshingTrades, setIsRefreshingTrades] = useState(false);
  const [isRefreshingLeaderboard, setIsRefreshingLeaderboard] = useState(false);
  const [isRefreshingTokens, setIsRefreshingTokens] = useState(false);

  const handleRefreshTrades = async () => {
    setIsRefreshingTrades(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTradesKey(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsRefreshingTrades(false);
  };

  const handleRefreshLeaderboard = async () => {
    setIsRefreshingLeaderboard(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLeaderboardKey(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsRefreshingLeaderboard(false);
  };

  const handleRefreshTokens = async () => {
    setIsRefreshingTokens(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setTokensKey(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsRefreshingTokens(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto h-auto sm:h-12 gap-2 sm:gap-0 p-1">
            <TabsTrigger value="trades" className="text-sm sm:text-base font-semibold flex items-center justify-center gap-2 h-11 sm:h-auto">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Trades</span>
              <span className="sm:hidden">Live Trades</span>
            </TabsTrigger>
            <TabsTrigger value="kol-leaderboard" className="text-sm sm:text-base font-semibold flex items-center justify-center gap-2 h-11 sm:h-auto">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">KOL Leaderboard</span>
              <span className="sm:hidden">KOLs</span>
            </TabsTrigger>
            <TabsTrigger value="token-leaderboard" className="text-sm sm:text-base font-semibold flex items-center justify-center gap-2 h-11 sm:h-auto">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Token Leaderboard</span>
              <span className="sm:hidden">Tokens</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Real-Time Trades</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor live trading activity from top KOLs on TON
              </p>
            </div>
            <PullToRefreshWrapper onRefresh={handleRefreshTrades}>
              {isRefreshingTrades ? <TradesTableSkeleton /> : <TradesTable key={tradesKey} />}
            </PullToRefreshWrapper>
          </TabsContent>

          <TabsContent value="kol-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">KOL Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON KOLs ranked by profit & loss performance
              </p>
            </div>
            <PullToRefreshWrapper onRefresh={handleRefreshLeaderboard}>
              {isRefreshingLeaderboard ? <LeaderboardTableSkeleton /> : <LeaderboardTable key={leaderboardKey} />}
            </PullToRefreshWrapper>
          </TabsContent>

          <TabsContent value="token-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Token Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON Tokens ranked by trading volume
              </p>
            </div>
            <PullToRefreshWrapper onRefresh={handleRefreshTokens}>
              {isRefreshingTokens ? <TokenLeaderboardSkeleton /> : <TokenLeaderboard key={tokensKey} />}
            </PullToRefreshWrapper>
          </TabsContent>
        </Tabs>
      </main>
      <PriceTracker />
      <TelegramCTA />
      <Footer />
    </div>
  );
};

export default Index;
