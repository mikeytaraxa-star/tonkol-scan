import { Instagram, Mail, Handshake, FileText } from "lucide-react";
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
          
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Documentation"
          >
            <FileText className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
