import logo from "@/assets/logo.png";
import { Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export const Header = () => {
  const [getListedOpen, setGetListedOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <img src={logo} alt="Tonkol" className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">Tonkol</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Know what KOLs are trading</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Dialog open={tradeOpen} onOpenChange={setTradeOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-accent text-primary-foreground font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
                >
                  <span className="hidden sm:inline">Trade on Ton</span>
                  <span className="sm:hidden">Trade</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose Trading Platform</DialogTitle>
                  <DialogDescription className="sr-only">
                    Select your preferred trading platform
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold"
                  >
                    <a
                      href="https://t.me/stonks_sniper_bot?start=tonkolreferral"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Stonks Bot
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold"
                  >
                    <a
                      href="https://x1000.finance/?ref=mikey"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      x1000 Trading Terminal
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={getListedOpen} onOpenChange={setGetListedOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background hover:bg-accent text-foreground font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
                >
                  <span className="hidden sm:inline">Get Listed</span>
                  <span className="sm:hidden">List</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Criteria for Listing</DialogTitle>
                  <DialogDescription className="sr-only">
                    Requirements to get listed on Tonkol
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">10k+ followers</span> on X
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">$500,000 trading volume</span> on TON
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground">
                        A <span className="font-semibold">project/event recognised</span> by Ton Officials
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">5k+ members</span> on Telegram
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      If criteria met, send a direct message:
                    </p>
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold"
                    >
                      <a
                        href="https://t.me/mikeyketomi"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Contact on Telegram
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <a
              href="https://x.com/Toncoinkol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Follow us on X"
            >
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a
              href="https://t.me/tonkolpro"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Join us on Telegram"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
