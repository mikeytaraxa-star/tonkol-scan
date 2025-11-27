import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TokenLeaderboardSkeleton = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* Desktop/Tablet Grid View */}
      <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
        {/* Large box - #1 */}
        <Card className="lg:col-span-2 lg:row-span-2 p-8 bg-gradient-to-br from-primary/30 to-accent/30 border-primary/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </Card>

        {/* Tall box - #2 */}
        <Card className="lg:col-span-1 lg:row-span-2 p-6 bg-gradient-to-br from-primary/25 to-accent/25 border-primary/40">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-14" />
            </div>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-4 w-20" />
            <div className="space-y-2 mt-6">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </Card>

        {/* Standard boxes - #3, #4, #5 */}
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="lg:col-span-1 lg:row-span-1 p-4 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-12" />
              </div>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-16" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mobile Stacked View */}
      <div className="sm:hidden space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-14" />
              </div>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2 mt-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
