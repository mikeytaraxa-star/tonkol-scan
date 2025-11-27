import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LeaderboardTableSkeleton = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block animate-fade-in">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trades</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-3 animate-fade-in">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
