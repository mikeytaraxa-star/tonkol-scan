import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const API_BASE = "https://deludedly-faunlike-selma.ngrok-free.dev";

export const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  const fetchVisitors = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/stats`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      setVisitorCount(data.visitors_7d || 0);
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
  };

  useEffect(() => {
    fetchVisitors();
    // Update every 60 seconds
    const interval = setInterval(fetchVisitors, 60000);
    return () => clearInterval(interval);
  }, []);

  if (visitorCount === null) return null;

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
