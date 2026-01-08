import { useEffect, useRef } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import omnistonWidgetLoader, { type OmnistonWidget } from '@ston-fi/omniston-widget-loader';

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
          referrerAddress: 'UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-',
          referrerFeeBps: 100, // 1% fee (100 basis points)
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
    <div className="flex flex-col items-center w-full">
      <div
        ref={containerRef}
        className="w-full max-w-[500px] mx-auto swap-widget-container"
        style={{
          '--ston-widget-bg': 'hsl(210 45% 12%)',
          '--ston-widget-bg-secondary': 'hsl(210 40% 20%)',
          '--ston-widget-text': 'hsl(195 50% 95%)',
          '--ston-widget-text-secondary': 'hsl(201 20% 65%)',
          '--ston-widget-accent': 'hsl(201 100% 46%)',
          '--ston-widget-border': 'hsl(210 40% 20%)',
          '--ston-widget-radius': '0.5rem',
        } as React.CSSProperties}
      />
    </div>
  );
}
