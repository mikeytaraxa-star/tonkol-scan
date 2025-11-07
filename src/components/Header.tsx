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
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Tonkol" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tonkol</h1>
              <p className="text-sm text-muted-foreground">Know what KOLs are trading</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-primary hover:bg-accent text-primary-foreground font-semibold"
            >
              <a
                href="https://t.me/stonks_sniper_bot?start=tonkolreferral"
                target="_blank"
                rel="noopener noreferrer"
              >
                Trade on Ton
              </a>
            </Button>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-background hover:bg-accent text-foreground font-semibold"
                >
                  Get Listed
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
              className="p-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Follow us on X"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://t.me/tonkolpro"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-primary/10 text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
              aria-label="Join us on Telegram"
            >
              <Send className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
