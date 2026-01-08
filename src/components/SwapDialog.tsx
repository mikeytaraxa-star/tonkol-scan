import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTonConnectUI } from "@tonconnect/ui-react";
import omnistonWidgetLoader, { type OmnistonWidget } from "@ston-fi/omniston-widget-loader";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
}

// TON native address constant
const TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
// Platform referral wallet (1% fee)
const REFERRAL_ADDRESS = "UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-";
const REFERRAL_FEE_BPS = 100; // 1% = 100 basis points

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [tonconnect] = useTonConnectUI();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<OmnistonWidget | null>(null);

  useEffect(() => {
    if (!open) {
      // Unmount widget when dialog closes
      widgetRef.current?.unmount();
      widgetRef.current = null;
      return;
    }

    let isMounted = true;

    omnistonWidgetLoader.load().then((OmnistonWidgetConstructor) => {
      if (!isMounted || !containerRef.current || !tonconnect) return;

      widgetRef.current = new OmnistonWidgetConstructor({
        tonconnect: {
          type: "integrated",
          instance: tonconnect as any, // Cast to bypass version mismatch between TonConnect packages
        },
        widget: {
          defaultBidAsset: TON_ADDRESS,
          defaultAskAsset: tokenAddress,
        },
      } as any); // Cast config to bypass strict type checking

      widgetRef.current.mount(containerRef.current);
    });

    return () => {
      isMounted = false;
      widgetRef.current?.unmount();
      widgetRef.current = null;
    };
  }, [open, tonconnect, tokenAddress]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            Swap TON → ${tokenSymbol}
          </DialogTitle>
        </DialogHeader>
        <div 
          ref={containerRef} 
          className="w-full min-h-[400px]"
        />
      </DialogContent>
    </Dialog>
  );
};
