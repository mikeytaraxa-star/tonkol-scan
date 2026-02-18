import logo from "@/assets/logo.png";
import { Twitter, Send, ExternalLink } from "lucide-react";
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
import { VisitorCounter } from "@/components/VisitorCounter";

export const Header = () => {
  const [tradeOpen, setTradeOpen] = useState(false);

  return (
    <header className="border-b border-border/50 bg-card/80 glass sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <img src={logo} alt="Tonkol" className="h-8 w-8 sm:h-12 sm:w-12 flex-shrink-0 rounded-xl" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate tracking-tight">Tonkol</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Know what KOLs are trading</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <VisitorCounter />
            <Dialog open={tradeOpen} onOpenChange={setTradeOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-accent text-primary-foreground font-semibold text-xs sm:text-sm px-3 sm:px-5 h-8 sm:h-10 rounded-full shadow-sm"
                >
                  <span className="hidden sm:inline">Trade on Ton</span>
                  <span className="sm:hidden">Trade</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold tracking-tight">Choose Trading Platform</DialogTitle>
                  <DialogDescription className="sr-only">
                    Select your preferred trading platform
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-xl h-12"
                  >
                    <a
                      href="https://t.me/groypfi_bot?start=ref_7491048574"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Groypfi Telegram Bot
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full font-semibold rounded-xl h-12"
                  >
                    <a
                      href="https://groypfi.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GroypFi
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <a
              href="https://x.com/Toncoinkol"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Follow us on X"
            >
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a
              href="https://t.me/tonkolpro"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 sm:p-2 rounded-full hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
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
