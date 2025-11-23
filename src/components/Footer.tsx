import { Instagram, Mail, Handshake, FileText, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://www.tiktok.com/@toncoinkol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          
          <a
            href="https://www.instagram.com/toncoinkol/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          
          <a
            href="https://x.com/toncoinkol"
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
                    <li>Real-time trade tracking and monitoring</li>
                    <li>Live leaderboard rankings</li>
                    <li>Price tracking and market analysis</li>
                    <li>Community engagement through Telegram</li>
                    <li>Comprehensive trading statistics</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div>
                      <h4 className="font-medium text-foreground">Trades Tab</h4>
                      <p>View all recent trades in real-time. Monitor wallet addresses, transaction amounts, and timestamps.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Leaderboard Tab</h4>
                      <p>Check top traders ranked by total volume. See who's leading the market.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Price Tracker</h4>
                      <p>Stay updated with current market prices and trends.</p>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-lg font-semibold mb-2">Join Our Community</h3>
                  <p className="text-muted-foreground mb-3">
                    Connect with us on Telegram to stay updated with the latest news, features, and community discussions.
                  </p>
                  <Button asChild className="w-full">
                    <a
                      href="https://t.me/toncoinkol"
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
            href="https://ton.app/social/tonkol?id=5142" 
            title="Powered by TON.app – explore now"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all duration-300 hover:scale-110 hover:opacity-80"
          >
            <img 
              src="https://ton.app/a2/badge/topapp?appId=5142" 
              alt="Position of Tonkol in Social on Ton App" 
              onError={(e) => (e.currentTarget.style.opacity = '0')}
              loading="lazy"
              className="h-5 w-auto"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
