import { useState } from "react";
import { Header } from "@/components/Header";
import { TradesTable } from "@/components/TradesTable";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Trophy } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("trades");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="trades" className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Trades
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-base font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trades" className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Real-Time Trades</h2>
              <p className="text-muted-foreground">
                Monitor live trading activity from top crypto KOLs
              </p>
            </div>
            <TradesTable />
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">KOL Leaderboard</h2>
              <p className="text-muted-foreground">
                Ranked by profit & loss performance
              </p>
            </div>
            <LeaderboardTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
