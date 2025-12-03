import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AdBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-y border-primary/30 py-3 px-4 relative overflow-hidden transition-all duration-500 ease-out ${
        isExiting ? "max-h-0 py-0 opacity-0 border-y-0" : isEntering ? "max-h-0 py-0 opacity-0" : "max-h-20 opacity-100"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-3 pr-8">
        <Megaphone className="h-4 w-4 text-primary shrink-0 hidden sm:block" />
        <p className="text-xs sm:text-sm text-center text-foreground/90">
          <span className="font-semibold text-primary">$GROYPER</span>
          <span className="mx-1 sm:mx-2 text-muted-foreground">•</span>
          <span className="text-muted-foreground sm:hidden">First Groyper in crypto 🐸</span>
          <span className="text-muted-foreground hidden sm:inline">
            Oldest living memecoin on Ton 💎 The very first Groyper in crypto 🐸 Saving the world from the cult ✊
          </span>
        </p>
        <a
          href="https://t.me/jettradebot?start=groyper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full hover:bg-primary/90 transition-colors shrink-0"
        >
          <span className="sm:hidden">Buy</span>
          <span className="hidden sm:inline">Buy Now</span>
        </a>
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors shrink-0 underline">
              Ad
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
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss ad banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
