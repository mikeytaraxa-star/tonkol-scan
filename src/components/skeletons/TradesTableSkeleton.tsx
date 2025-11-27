import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TradesTableSkeleton = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block animate-fade-in">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trader</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Token</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount (TON)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20" />
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
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};
