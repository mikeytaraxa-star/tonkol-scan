import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export const TelegramCTA = () => {
  return (
    <div className="w-full bg-card border-t border-border py-4 sm:py-6 mt-4 sm:mt-8">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <p className="text-foreground text-xs sm:text-sm md:text-base font-medium text-center sm:text-left">
          Track Tonkol on Telegram with real-time alerts
        </p>
        <Button asChild className="w-full sm:w-auto text-sm">
          <a 
            href="https://t.me/tonkoltrades" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Telegram Alerts
          </a>
        </Button>
      </div>
    </div>
  );
};
