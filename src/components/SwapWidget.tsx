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
        console.log('SwapWidget: Starting initialization...');
        console.log('SwapWidget: containerRef:', containerRef.current);
        console.log('SwapWidget: tonconnect:', tonconnect);
        
        if (!containerRef.current) {
          console.log('SwapWidget: No container ref, aborting');
          return;
        }
        
        console.log('SwapWidget: Loading omniston widget loader...');
        const OmnistonWidgetConstructor = await omnistonWidgetLoader.load();
        console.log('SwapWidget: Loader loaded successfully');
        
        if (!isMounted || !containerRef.current) {
          console.log('SwapWidget: Component unmounted or no container, aborting');
          return;
        }

        // Unmount existing widget if any
        if (widgetRef.current) {
          console.log('SwapWidget: Unmounting existing widget');
          widgetRef.current.unmount();
          widgetRef.current = null;
        }

        console.log('SwapWidget: Creating widget instance...');
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

        console.log('SwapWidget: Mounting widget...');
        widgetRef.current.mount(containerRef.current);
        console.log('SwapWidget: Widget mounted successfully');
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('SwapWidget: Failed to load swap widget:', err);
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
