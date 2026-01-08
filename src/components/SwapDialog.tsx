import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wallet, ArrowDown, Settings2, Info } from "lucide-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { supabase } from "@/integrations/supabase/client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
}

interface SwapQuote {
  minReceive: string;
  minReceiveRaw: string;
  priceImpact: string;
  swapRate: string | null;
}

const PRESET_AMOUNTS = [25, 50, 100] as const;
const SLIPPAGE_OPTIONS = [0.5, 1, 3, 5] as const;

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [slippage, setSlippage] = useState<number>(1);
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const { isConnected, balance, isLoadingBalance, connect } = useTonConnect();

  const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const activeSlippage = customSlippage ? parseFloat(customSlippage) : slippage;

  const fetchQuote = useCallback(
    async (amount: number, slippageTolerance: number) => {
      if (!amount || amount <= 0 || !tokenAddress) return;

      setIsLoadingQuote(true);
      try {
        const { data, error } = await supabase.functions.invoke("stonfi-quote", {
          body: {
            tokenAddress,
            amount,
            slippage: slippageTolerance,
          },
        });

        if (error) {
          console.error("Quote error:", error);
          setQuote(null);
          return;
        }

        if (data?.success && data.minAskUnits) {
          const minReceiveRaw = String(data.minAskUnits);
          const minReceiveFormatted = (Number(minReceiveRaw) / 1e9).toLocaleString(undefined, {
            maximumFractionDigits: 4,
          });

          setQuote({
            minReceive: minReceiveFormatted,
            minReceiveRaw,
            priceImpact: data.priceImpact
              ? `${(Number(data.priceImpact) * 100).toFixed(2)}%`
              : "< 0.01%",
            swapRate: data.swapRate,
          });
        } else {
          setQuote(null);
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    },
    [tokenAddress]
  );

  useEffect(() => {
    if (!activeAmount || activeAmount <= 0) {
      setQuote(null);
      return;
    }

    const timeout = setTimeout(() => {
      fetchQuote(activeAmount, activeSlippage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeAmount, activeSlippage, fetchQuote]);

  useEffect(() => {
    if (!open) {
      setCustomAmount("");
      setSelectedAmount(null);
      setQuote(null);
      setShowSettings(false);
    }
  }, [open]);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleSlippageClick = (value: number) => {
    setSlippage(value);
    setCustomSlippage("");
  };

  const handleCustomSlippageChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue <= 50 && numValue >= 0)) {
        setCustomSlippage(value);
      }
    }
  };

  const handleCustomAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue <= 10000)) {
        setCustomAmount(value);
        setSelectedAmount(null);
      }
    }
  };

  const rateLine = useMemo(() => {
    if (!quote || !activeAmount || activeAmount <= 0) return null;

    const derivedRate = (Number(quote.minReceiveRaw) / 1e9) / activeAmount;
    const rate = quote.swapRate ? Number(quote.swapRate) : derivedRate;

    if (!Number.isFinite(rate) || rate <= 0) return null;

    return `1 TON ≈ ${rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${tokenSymbol}`;
  }, [quote, activeAmount, tokenSymbol]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-xl">Swap TON → ${tokenSymbol}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Collapsible open={showSettings} onOpenChange={setShowSettings}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Slippage Tolerance
                </span>
                <span className="text-sm font-medium text-foreground">{activeSlippage}%</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  {SLIPPAGE_OPTIONS.map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value && !customSlippage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSlippageClick(value)}
                      className="flex-1 text-xs"
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Custom"
                    value={customSlippage}
                    onChange={(e) => handleCustomSlippageChange(e.target.value)}
                    className="pr-8 text-sm h-9"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                </div>
                {activeSlippage > 5 && (
                  <p className="text-xs text-amber-500">High slippage may result in unfavorable rates</p>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {isConnected && (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-foreground">Wallet Balance</span>
              <span className="text-sm font-bold text-primary">
                {isLoadingBalance ? "Loading..." : `${balance?.toFixed(2) ?? "0"} TON`}
              </span>
            </div>
          )}

          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You pay</span>
            </div>

            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={customAmount || (selectedAmount?.toString() ?? "")}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="text-2xl font-bold h-14 pr-16 bg-transparent border-none focus-visible:ring-0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                TON
              </span>
            </div>

            <div className="flex gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetClick(amount)}
                  className="flex-1 text-xs font-medium"
                >
                  {amount} TON
                </Button>
              ))}
              {isConnected && balance && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCustomAmountChange((balance * 0.95).toFixed(2))}
                  className="text-xs font-medium"
                >
                  Max
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <span className="text-sm text-muted-foreground">You receive (estimated)</span>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoadingQuote ? (
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : quote ? (
                  quote.minReceive
                ) : activeAmount ? (
                  "—"
                ) : (
                  "0.00"
                )}
              </div>
              <span className="text-lg font-semibold text-muted-foreground">${tokenSymbol}</span>
            </div>

            {rateLine && <p className="text-xs text-muted-foreground">{rateLine}</p>}

            {quote && (
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" />
                  Price impact: {quote.priceImpact}
                </span>
              </p>
            )}
          </div>

          <div className="pt-2">
            {!isConnected ? (
              <Button onClick={connect} className="w-full h-12 text-base font-semibold">
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            ) : (
              <Button disabled className="w-full h-12 text-base font-semibold">
                Swaps disabled
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
