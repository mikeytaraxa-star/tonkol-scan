import PullToRefresh from "react-simple-pull-to-refresh";
import { ReactElement } from "react";

interface PullToRefreshWrapperProps {
  onRefresh: () => Promise<void>;
  children: ReactElement;
}

export const PullToRefreshWrapper = ({ onRefresh, children }: PullToRefreshWrapperProps) => {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      pullingContent={
        <div className="flex justify-center py-4">
          <div className="text-sm text-muted-foreground">Pull to refresh...</div>
        </div>
      }
      refreshingContent={
        <div className="flex justify-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-primary border-r-transparent"></div>
        </div>
      }
      pullDownThreshold={80}
      maxPullDownDistance={120}
      resistance={2}
      className="pull-to-refresh-wrapper"
    >
      {children}
    </PullToRefresh>
  );
};
