import { useState } from "react";
import { Header } from "@/components/Header";
import { TradesTable } from "@/components/TradesTable";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { TokenLeaderboard } from "@/components/TokenLeaderboard";
import { SwapWidget } from "@/components/SwapWidget";
import { PriceTracker } from "@/components/PriceTracker";
import { TelegramCTA } from "@/components/TelegramCTA";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Trophy, Flame, ArrowLeftRight } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("trades");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <AdBanner />
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 pb-20 sm:pb-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop tabs - hidden on mobile */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 max-w-3xl mx-auto h-12 p-1">
            <TabsTrigger value="trades" className="text-base font-semibold flex items-center justify-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Trades</span>
            </TabsTrigger>
            <TabsTrigger value="kol-leaderboard" className="text-base font-semibold flex items-center justify-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>KOL Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="token-leaderboard" className="text-base font-semibold flex items-center justify-center gap-2">
              <Flame className="h-4 w-4" />
              <span>Token Leaderboard</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="text-base font-semibold flex items-center justify-center gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Swap</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Real-Time Trades</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor live trading activity from top KOLs on TON
              </p>
            </div>
            <TradesTable />
          </TabsContent>

          <TabsContent value="kol-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">KOL Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON KOLs ranked by profit & loss performance
              </p>
            </div>
            <LeaderboardTable />
          </TabsContent>

          <TabsContent value="token-leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Token Leaderboard</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Top TON Tokens ranked by trading volume
              </p>
            </div>
            <TokenLeaderboard />
          </TabsContent>

          <TabsContent value="swap" className="space-y-4 animate-fade-in">
            <div className="text-center mb-4 sm:mb-6 px-2">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">Swap Tokens</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Swap TON and jettons instantly via STON.fi
              </p>
            </div>
            <SwapWidget />
          </TabsContent>
        </Tabs>
      </main>
      <PriceTracker />
      <TelegramCTA />
      <Footer />

      {/* Mobile bottom navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="grid grid-cols-4 h-16">
          <button
            onClick={() => setActiveTab("trades")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "trades" 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="h-5 w-5" />
            <span className="text-xs font-medium">Trades</span>
          </button>
          <button
            onClick={() => setActiveTab("kol-leaderboard")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "kol-leaderboard" 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs font-medium">KOLs</span>
          </button>
          <button
            onClick={() => setActiveTab("token-leaderboard")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "token-leaderboard" 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Flame className="h-5 w-5" />
            <span className="text-xs font-medium">Tokens</span>
          </button>
          <button
            onClick={() => setActiveTab("swap")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "swap" 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span className="text-xs font-medium">Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
