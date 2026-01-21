import { useState, useEffect } from "react";
import { Users } from "lucide-react";

const API_BASE = "https://apitonkol.pro";

export const VisitorCounter = () => {
  const [visitors7d, setVisitors7d] = useState(1770);

  const fetchVisitorStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/stats`, {
        headers: {
          'X-API-Key': 'sk_project1_abc123',
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const data = await response.json();
      if (data.visitors_7d !== undefined) setVisitors7d(data.visitors_7d);
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    }
  };

  useEffect(() => {
    fetchVisitorStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchVisitorStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
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
  );
};
