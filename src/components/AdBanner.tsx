import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { AdContactDialog } from "./AdContactDialog";

const ad = {
  text: "Advertise your project to thousands of TON users. Premium placement available.",
  highlight: "Rent this Spot",
  cta: "Contact Us",
};

export const AdBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    <>
      <div 
        className={`w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-y border-primary/30 py-2 px-2 sm:py-3 sm:px-4 relative overflow-hidden transition-all duration-500 ease-out ${
          isExiting ? "max-h-0 py-0 opacity-0 border-y-0" : isEntering ? "max-h-0 py-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="container mx-auto flex items-center justify-center gap-1.5 sm:gap-3 pr-6 sm:pr-8 overflow-hidden">
          <Megaphone className="h-4 w-4 text-primary shrink-0 hidden sm:block" />
          
          {/* Desktop view */}
          <div className="hidden sm:block overflow-hidden flex-1">
            <p className="text-sm text-center text-foreground/90 leading-tight">
              <span className="font-semibold text-primary">{ad.highlight}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">{ad.text}</span>
            </p>
          </div>
          
          {/* Mobile view */}
          <div className="sm:hidden overflow-hidden flex-1 min-w-0">
            <p className="text-[11px] text-foreground/90 text-center">
              <span className="font-semibold text-primary">{ad.highlight}</span>
              <span className="mx-1.5 text-muted-foreground">•</span>
              <span className="text-muted-foreground">{ad.text}</span>
            </p>
          </div>
          
          <button
            onClick={() => setIsDialogOpen(true)}
            className="text-[10px] sm:text-xs font-medium bg-primary text-primary-foreground px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-primary/80 transition-colors shrink-0"
          >
            {ad.cta}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Dismiss ad banner"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>
      <AdContactDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
};