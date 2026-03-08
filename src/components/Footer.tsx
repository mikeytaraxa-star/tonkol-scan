import { Handshake, FileText, Twitter, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://x.com/groypfi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter/X"
          >
            <Twitter className="h-5 w-5" />
          </a>
          
          
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Partnership"
              >
                <Handshake className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Partnership Opportunities</DialogTitle>
                <DialogDescription>
                  For integrations, cross-promotions and partnerships reach out to co-founder Mikey
                </DialogDescription>
              </DialogHeader>
              <Button asChild className="w-full">
                <a
                  href="https://t.me/yugoslavac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Mikey on Telegram
                </a>
              </Button>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Advertise"
              >
                <Megaphone className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Advertise on Tonkol</DialogTitle>
                <DialogDescription>
                  Place your ad on Tonkol and promote your project to 4,000+ visitors for 30 TON per week.
                </DialogDescription>
              </DialogHeader>
              
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Reach 4K+ weekly visitors
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Prime banner placement
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Custom CTA button
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Full week exposure
                </li>
              </ul>
              
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Ad Preview:</p>
                <div className="w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border border-primary/30 rounded-lg py-3 px-4">
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <Megaphone className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs sm:text-sm text-center text-foreground/90">
                      <span className="font-semibold text-primary">Your Project</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Your promotional message appears here!
                      </span>
                    </p>
                    <span className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      CTA
                    </span>
                  </div>
                </div>
              </div>
              
              <Button asChild className="w-full">
                <a
                  href="https://t.me/yugoslavac"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contact Founder
                </a>
              </Button>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Documentation"
              >
                <FileText className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Documentation</DialogTitle>
                <DialogDescription>
                  Everything you need to know about TonKol
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <section>
                  <h3 className="text-lg font-semibold mb-2">What is TonKol?</h3>
                  <p className="text-muted-foreground">
                    TonKol is a comprehensive KOL trading analytics platform for the TON ecosystem. Track real-time swaps made by Key Opinion Leaders, 
                    view performance leaderboards, and discover trending tokens — all in one place.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Real-time KOL swap tracking displayed as interactive grid cards</li>
                    <li>KOL Leaderboard with split-screen candle chart view — profitable vs negative traders</li>
                    <li>Token Leaderboard showing trending tokens ranked by KOL trading volume</li>
                    <li>Detailed KOL profiles with win rates, PnL breakdowns, and trade history</li>
                    <li>Direct buy buttons linked to GroypFi trading bot</li>
                    <li>Live TON price tracker</li>
                    <li>Mobile-optimized responsive design with bottom navigation</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground">Trades Tab (/trades)</h4>
                      <p>View real-time KOL swaps as grid cards. Each card shows the trader, token, amount, and a Buy button to trade via GroypFi. Click trader names to see detailed profiles.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">KOL Leaderboard (/kol)</h4>
                      <p>Split-screen candle chart ranking KOLs by P&L. Green candles show profitable traders, red candles show losses — taller candles mean bigger gains or losses. Hover for detailed stats.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Token Leaderboard (/token)</h4>
                      <p>Discover trending tokens ranked by KOL trading volume. Toggle between 24h and 7d timeframes.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Trade on TON</h4>
                      <p>Quick access to trading via GroypFi Telegram Bot and groypfi.io.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold mb-2">Integrations</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground">GroypFi Trading</h4>
                      <p>Buy buttons on swap cards and the "Trade on TON" dialog link directly to the GroypFi Telegram Bot for seamless trading.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Groypad Launch Alerts</h4>
                      <p>Real-time TON launch alerts filtering for Gaspump, Blum, and Tonpump DEXes. Join @groypadlaunch on Telegram.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Tonkol MCP Plugin (Teleton)</h4>
                      <p>Developer plugin for the Teleton Agent framework providing tools for fetching trades, KOL stats, leaderboards, and search functionality.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Telegram Bot (@toncoinkol_bot)</h4>
                      <p>Use /trade to get the latest 10 KOL trades directly in Telegram.</p>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Tonkol API</h3>
                  <p className="text-muted-foreground mb-3">
                    Access KOL trading data programmatically through our API. Get real-time trades, leaderboard rankings, KOL profiles, and token analytics.
                  </p>
                  <Button asChild className="w-full">
                    <a
                      href="https://t.me/yugoslavac"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Request API Access
                    </a>
                  </Button>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Join Our Community</h3>
                  <p className="text-muted-foreground mb-3">
                    Connect with us on Telegram to stay updated with the latest news, features, and community discussions.
                  </p>
                  <Button asChild className="w-full">
                    <a
                      href="https://t.me/tonkolpro"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Telegram
                    </a>
                  </Button>
                </section>
              </div>
            </DialogContent>
          </Dialog>
          
          <a 
            href="https://dyor.io/dapps/social/tonkol?utm_source=dapp-badge" 
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
          >
            <img 
              src="https://dyor.io/client/api/dapp/rank/tonkol?theme=light" 
              alt="Tonkol Badge" 
              height={64}
              loading="lazy"
              className="h-16 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
