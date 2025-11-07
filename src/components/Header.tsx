import logo from "@/assets/logo.png";
import { Twitter, Send } from "lucide-react";

export const Header = () => {
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
