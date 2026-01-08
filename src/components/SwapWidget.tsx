import { useEffect, useRef, useState } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import omnistonWidgetLoader, { type OmnistonWidget } from '@ston-fi/omniston-widget-loader';
import { Loader2 } from 'lucide-react';

export function SwapWidget() {
  const [tonconnect] = useTonConnectUI();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetRef = useRef<OmnistonWidget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initWidget = async () => {
      try {
        if (!containerRef.current) return;
        
        const OmnistonWidgetConstructor = await omnistonWidgetLoader.load();
        
        if (!isMounted || !containerRef.current) return;

        // Unmount existing widget if any
        if (widgetRef.current) {
          widgetRef.current.unmount();
          widgetRef.current = null;
        }

        widgetRef.current = new OmnistonWidgetConstructor({
          tonconnect: {
            type: 'integrated',
            instance: tonconnect as any,
          },
          widget: {
            defaultBidAsset: 'TON',
            defaultAskAsset: 'STON',
            referrerAddress: 'UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-',
            referrerFeeBps: 100, // 1% fee (100 basis points)
          },
        });

        widgetRef.current.mount(containerRef.current);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Failed to load swap widget:', err);
        setError('Failed to load swap widget');
        setIsLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initWidget, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (widgetRef.current) {
        widgetRef.current.unmount();
        widgetRef.current = null;
      }
    };
  }, [tonconnect]);

  return (
    <div className="flex flex-col items-center w-full">
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="text-destructive text-center py-8">
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full max-w-[500px] mx-auto swap-widget-container ${isLoading ? 'hidden' : ''}`}
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
