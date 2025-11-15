import { Users } from "lucide-react";

export const VisitorCounter = () => {
  // Using actual analytics data from tonkol.pro (last 7 days)
  const visitorCount = 3322;

  return (
    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20">
      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
      <div className="flex flex-col">
        <span className="text-[10px] sm:text-xs font-semibold text-foreground">
          {visitorCount.toLocaleString()}
        </span>
        <span className="text-[8px] sm:text-[10px] text-muted-foreground leading-none hidden sm:block">
          7d visitors
        </span>
      </div>
    </div>
  );
};
