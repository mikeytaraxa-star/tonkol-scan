import { Megaphone } from "lucide-react";

export const AdBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-y border-primary/30 py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Megaphone className="h-4 w-4 text-primary shrink-0" />
        <p className="text-sm text-center text-foreground/90">
          <span className="font-semibold">Ad Space Available</span>
          <span className="mx-2 text-muted-foreground">•</span>
          <span className="text-muted-foreground">
            Promote your project here! Contact us to rent this banner space.
          </span>
        </p>
        <a
          href="https://t.me/mikeyketomi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1 rounded-full hover:bg-primary/90 transition-colors shrink-0"
        >
          Rent Now
        </a>
      </div>
    </div>
  );
};
