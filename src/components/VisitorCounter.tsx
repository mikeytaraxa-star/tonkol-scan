import { Users } from "lucide-react";

export const VisitorCounter = () => {
  // Using actual analytics data from tonkol.pro
  const visitors7d = 3322; // Last 7 days total
  const visitors24h = 219; // Last 24 hours

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-semibold text-foreground">
            {visitors24h.toLocaleString()}
          </span>
          <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none hidden sm:block">
            24h
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs font-semibold text-foreground">
            {visitors7d.toLocaleString()}
          </span>
          <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none hidden sm:block">
            7d
          </span>
        </div>
      </div>
    </div>
  );
};
