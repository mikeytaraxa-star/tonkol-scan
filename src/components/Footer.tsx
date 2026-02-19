import { Mail, Handshake, FileText, Twitter, Megaphone } from "lucide-react";
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
          
          <a
            href="mailto:tonkolinfo@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
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
                  href="https://t.me/mikeyketomi"
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
                  href="https://t.me/mikeyketomi"
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
                    TonKol is a comprehensive trading platform for the TON ecosystem. Track real-time trades, 
                    view leaderboards, and stay updated with the latest market movements.
                  </p>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Real-time KOL trade tracking with clickable profiles</li>
                    <li>KOL Leaderboard with 24h/7d performance stats, win rates, and PnL charts</li>
                    <li>Token Leaderboard heat map showing top 5 tokens by KOL trading volume</li>
                    <li>Live TON price tracker</li>
                    <li>Direct trading links to JetTrade, DTrade, Stonks, and x1000</li>
                    <li>Mobile-optimized responsive design</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground">Trades Tab</h4>
                      <p>View real-time KOL trades. Click on trader names to see detailed profiles with win rates, biggest wins/losses, and recent trade history.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">KOL Leaderboard Tab</h4>
                      <p>Rankings of tracked KOLs by trading volume. Click any trader to view their full performance analytics including 7-day PnL charts.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Token Leaderboard Tab</h4>
                      <p>Interactive heat map showing the top 5 most traded tokens by KOL volume. Toggle between 24h and 7d timeframes.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Trade on Ton</h4>
                      <p>Quick access to multiple trading platforms including JetTrade, DTrade, Stonks, and x1000.</p>
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
                      href="https://t.me/mikeyketomi"
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
