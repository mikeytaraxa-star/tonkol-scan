import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const API_BASE = "https://deludedly-faunlike-selma.ngrok-free.dev";

export const VisitorCounter = () => {
  const [visitors24h, setVisitors24h] = useState(219);
  const [visitors7d, setVisitors7d] = useState(3322);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchVisitorStats = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE}/api/stats`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      if (data.visitors_24h !== undefined) setVisitors24h(data.visitors_24h);
      if (data.visitors_7d !== undefined) setVisitors7d(data.visitors_7d);
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    } finally {
      setTimeout(() => setIsUpdating(false), 1000);
    }
  };

  useEffect(() => {
    fetchVisitorStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchVisitorStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 relative">
      {isUpdating && (
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-success animate-pulse" />
      )}
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
