import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";

const ads = [
  {
    text: "Crack cookies. Climb the ranks. Earn real rewards in our launch event. Everyone wins.",
    highlight: "Cookie Cracker",
    cta: "Play Now",
    link: "https://t.me/a_fortune_cookie_bot/cookie?startapp=449feg",
  },
  {
    text: "Join Dare - Biggest Challenge Platform on Telegram.",
    highlight: "Dare",
    cta: "Join Now",
    link: "https://t.me/daretelegram",
  },
  {
    text: "Fu game for FU money. Play frens. Bet Crypto. Win.",
    highlight: "RPS FU",
    cta: "Play Now",
    link: "https://t.me/rpsfu_bot/rpsfu?startapp=ref_7491048574",
  },
];

export const AdBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
        setIsSliding(false);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentAd = ads[currentAdIndex];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => setIsDismissed(true), 300);
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-y border-primary/30 py-2 px-2 sm:py-3 sm:px-4 relative overflow-hidden transition-all duration-500 ease-out ${
        isExiting ? "max-h-0 py-0 opacity-0 border-y-0" : isEntering ? "max-h-0 py-0 opacity-0" : "max-h-20 opacity-100"
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-1.5 sm:gap-3 pr-6 sm:pr-8 overflow-hidden">
        <Megaphone className="h-4 w-4 text-primary shrink-0 hidden sm:block" />
        
        {/* Desktop view - sliding ads */}
        <div className="hidden sm:block overflow-hidden flex-1">
          <p 
            className={`text-sm text-center text-foreground/90 leading-tight transition-transform duration-500 ease-in-out ${
              isSliding ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <span className="font-semibold text-primary">{currentAd.highlight}</span>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{currentAd.text}</span>
          </p>
        </div>
        
        {/* Mobile view - marquee animation */}
        <div className="sm:hidden overflow-hidden flex-1 min-w-0">
          <p className="text-[11px] text-foreground/90 whitespace-nowrap animate-marquee inline-block">
            <span className="font-semibold text-primary">{currentAd.highlight}</span>
            <span className="mx-1.5 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{currentAd.text}</span>
            <span className="mx-4"></span>
            <span className="font-semibold text-primary">{currentAd.highlight}</span>
            <span className="mx-1.5 text-muted-foreground">•</span>
            <span className="text-muted-foreground">{currentAd.text}</span>
          </p>
        </div>
        
        <a
          href={currentAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] sm:text-xs font-medium bg-primary text-primary-foreground px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full hover:bg-primary/80 transition-colors shrink-0"
        >
          {currentAd.cta}
        </a>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-0.5 sm:p-1 rounded-full hover:bg-primary/20 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss ad banner"
      >
        <X className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
};
