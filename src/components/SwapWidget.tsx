import { useEffect, useRef } from 'react';
import { useTonConnectUI, TonConnectButton } from '@tonconnect/ui-react';
import omnistonWidgetLoader, { type OmnistonWidget } from '@ston-fi/omniston-widget-loader';
import { ArrowLeftRight } from 'lucide-react';

export function SwapWidget() {
  const [tonconnect] = useTonConnectUI();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<OmnistonWidget | null>(null);

  useEffect(() => {
    let isMounted = true;

    omnistonWidgetLoader.load().then((OmnistonWidgetConstructor) => {
      if (!isMounted || !containerRef.current || !tonconnect) return;

      widgetRef.current = new OmnistonWidgetConstructor({
        tonconnect: {
          type: 'integrated',
          instance: tonconnect as any,
        },
        widget: {
          defaultBidAsset: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c', // TON
          defaultAskAsset: 'EQA2kCVNwVsil2EM2mB0SkXytxCqQjS4mttjDpnXmwG9T6bO', // STON
        },
      });

      widgetRef.current.mount(containerRef.current);
    });

    return () => {
      isMounted = false;
      widgetRef.current?.unmount();
      widgetRef.current = null;
    };
  }, [tonconnect]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-center gap-2 mb-2">
        <ArrowLeftRight className="h-5 w-5 text-primary" />
        <span className="text-sm text-muted-foreground">Powered by STON.fi</span>
      </div>
      <div className="flex justify-center mb-4">
        <TonConnectButton />
      </div>
      <div
        ref={containerRef}
        className="w-full max-w-[500px] mx-auto"
      />
    </div>
  );
}
