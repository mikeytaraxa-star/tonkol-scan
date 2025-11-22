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
                <DialogTitle className="text-2xl">Tonkol – Official Project Documentation</DialogTitle>
                <DialogDescription className="text-base">
                  Real-time KOL & Trader Tracker on TON
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-muted-foreground mb-4">Date: November 21, 2025</p>
                  <p className="text-muted-foreground">Website: <a href="https://tonkol.pro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tonkol.pro</a></p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">1. Project Overview</h3>
                  <p className="italic mb-3">Reviving the TON trenches – one transparent trade at a time.</p>
                  
                  <h4 className="font-semibold mb-2">Mission</h4>
                  <p className="mb-4">Bring back the golden era of TON on-chain culture by spotlighting real alpha-generating KOLs and traders, exposing trending projects early, and creating radical transparency around wallet actions.</p>
                  
                  <h4 className="font-semibold mb-2">Core Problem We Solve</h4>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Most TON traders don't know who is actually printing.</li>
                    <li>Real performers get drowned out by paid shills and rug promoters.</li>
                    <li>Hidden gems stay hidden until they're already 50x.</li>
                    <li>No single source of truth for "who is cooking right now on TON".</li>
                  </ul>
                  <p className="font-semibold">Tonkol is that source.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">2. Current Features (Live Today)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>24/7 real-time tracking of 30+ active TON KOLs & traders (more added daily)</li>
                    <li>Instant Telegram alerts the moment a tracked wallet buys or sells</li>
                    <li>Daily & Weekly Leaderboards – best and worst performers</li>
                    <li>Full on-chain transparency (tx link, token, amount, realized PnL)</li>
                    <li>Early exposure for fresh and trending tokens picked by real winners</li>
                    <li>Open application form for new KOLs to get listed</li>
                    <li>Expansion on Instagram and TikTok – daily clips, reels, and stories of top KOL moves</li>
                    <li>Custom PnL posts & graphics for every tracked KOL – ready-to-share on their own social channels (X, IG, TikTok)</li>
                  </ul>
                  
                  <h4 className="font-semibold mt-4 mb-2">Pre-launch traction (before any official announcement)</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>5,000+ unique visitors</li>
                    <li>Thousands of alert channel members in &lt;2 weeks</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">3. Why Tonkol Matters for TON</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Reduces rugs by making paid shilling obvious</li>
                    <li>Accelerates discovery of real alpha projects</li>
                    <li>Rewards genuine performers instead of the loudest voices</li>
                    <li>Creates a public "hall of fame" for TON-native traders</li>
                    <li>The default dashboard for every serious TON degen</li>
                  </ul>
                  <p className="mt-3 italic">Lookonchain + Nansen Smart Money + DexScreener Leaderboard – built exclusively for TON, by the trenches, for the trenches.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">4. Partnerships & Integrations</h3>
                  <h4 className="font-semibold mb-2">Live</h4>
                  <p className="mb-4">JetTrade – Real-time KOL trades pushed directly into JetTrade's platform and alert system</p>
                  
                  <h4 className="font-semibold mb-2">Coming Soon</h4>
                  <ul className="list-disc list-inside space-y-1 mb-3">
                    <li>Major TON DEX & launchpad integrations</li>
                    <li>Leading Telegram Mini Apps and trading bots</li>
                    <li>On-chain analytics partners</li>
                  </ul>
                  <p>More announcements dropping weekly.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">5. Founders</h3>
                  <p className="mb-2"><span className="font-semibold">Mikey</span> – Product, growth, and community lead. Long-time TON degen since the earliest cycles.</p>
                  <p className="mb-3"><span className="font-semibold">Henry</span> – On-chain analytics and backend wizard. Lives in TON Explorer 24/7 and built multiple top-100 TON tools.</p>
                  <p className="italic">Both founders' personal wallets are publicly tracked on Tonkol from day one – full transparency, no exceptions.</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">6. Community & Links</h3>
                  <ul className="space-y-1">
                    <li>Website & KOL applications: <a href="https://tonkol.pro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tonkol.pro</a></li>
                    <li>Telegram Community: <a href="https://t.me/tonkolpro" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://t.me/tonkolpro</a></li>
                    <li>Real-time alerts: <a href="https://t.me/tonkoltrades" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://t.me/tonkoltrades</a></li>
                    <li>X/Twitter: <a href="https://x.com/toncoinkol" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://x.com/toncoinkol</a></li>
                    <li>Instagram: <a href="https://www.instagram.com/toncoinkol/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.instagram.com/toncoinkol/</a></li>
                    <li>TikTok: <a href="https://www.tiktok.com/@toncoinkol" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.tiktok.com/@toncoinkol</a></li>
                    <li>Founders: <a href="https://x.com/mikeyketomi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://x.com/mikeyketomi</a> | <a href="https://x.com/RenryOG" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://x.com/RenryOG</a></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3">7. Disclaimer</h3>
                  <p className="mb-2">Tonkol is an analytics and transparency tool only.</p>
                  <p className="mb-2">Past performance is not indicative of future results.</p>
                  <p className="mb-4">Always DYOR – we just show you what actually happened on-chain.</p>
                  <p className="font-semibold italic">Tonkol – Because in the trenches, only the real ones survive.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex justify-center mt-4">
          <a 
            href="https://ton.app/social/tonkol?id=5142" 
            title="Powered by TON.app – explore now"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img 
              src="https://ton.app/a2/badge/topapp?appId=5142" 
              alt="Position of Tonkol in Social on Ton App" 
              onError={(e) => (e.currentTarget.style.opacity = '0')}
              loading="lazy"
              className="h-auto max-w-full"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};
