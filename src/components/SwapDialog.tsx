import { useState, useEffect, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wallet, ArrowDown, Settings2, Info, CheckCircle2 } from "lucide-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// NOTE: @ston-fi/sdk and @ton/ton are dynamically imported inside executeSwap
// to avoid crashing initial render in environments without required polyfills.
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
  decimals: number;
  symbol: string;
  router?: {
    address: string | null;
    majorVersion: number | null;
    minorVersion: number | null;
    routerType: string | null;
    ptonAddress?: string | null;
  };
}

const PRESET_AMOUNTS = [25, 50, 100] as const;
const SLIPPAGE_OPTIONS = [0.5, 1, 3, 5] as const;

// STON.fi contracts
// v2.1 pTON contract address (required by SDK constructor; v1 has a default inside the SDK)
const PTON_V2_1_ADDRESS = "EQBnGWMCf3-FZZq1W4IWcWiGAc3PHuZ0_H-7sad2oY00o83S";
// Platform fee wallet (1%)
const PLATFORM_FEE_WALLET = "UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-";
const PLATFORM_FEE_PERCENT = 0.01;

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [slippage, setSlippage] = useState<number>(1);
  const [customSlippage, setCustomSlippage] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  const { isConnected, balance, isLoadingBalance, connect, address, tonConnectUI } = useTonConnect();

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

        console.log("Quote response:", data);

        if (data?.success && data.askUnits) {
          const decimals = data.decimals ?? 9;
          const askUnitsNum = Number(data.askUnits);
          const minAskUnitsNum = Number(data.minAskUnits || data.askUnits);
          
          const minReceiveFormatted = (minAskUnitsNum / Math.pow(10, decimals)).toLocaleString(undefined, {
            maximumFractionDigits: Math.min(decimals, 6),
          });

          setQuote({
            minReceive: minReceiveFormatted,
            minReceiveRaw: String(minAskUnitsNum),
            priceImpact: data.priceImpact
              ? `${(Number(data.priceImpact) * 100).toFixed(2)}%`
              : "< 0.01%",
            swapRate: data.swapRate,
            decimals,
            symbol: data.symbol || tokenSymbol,
            router: data.router
              ? {
                  address: data.router.address ?? null,
                  majorVersion: Number.isFinite(Number(data.router.majorVersion))
                    ? Number(data.router.majorVersion)
                    : null,
                  minorVersion: Number.isFinite(Number(data.router.minorVersion))
                    ? Number(data.router.minorVersion)
                    : null,
                  routerType: data.router.routerType ?? null,
                  ptonAddress: data.router.ptonAddress ?? null,
                }
              : undefined,
          });
        } else {
          console.log("Quote failed:", data?.error || data?.message);
          setQuote(null);
        }
      } catch (error) {
        console.error("Failed to fetch quote:", error);
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    },
    [tokenAddress, tokenSymbol]
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
      setIsSwapping(false);
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

  const executeSwap = useCallback(async () => {
    if (!activeAmount || !quote || !address || !tonConnectUI) return;

    setIsSwapping(true);
    try {
      // Dynamically import heavy TON/SDK deps to avoid breaking initial render
      const [{ DEX, pTON, dexFactory }, { TonClient, toNano, Address }] = await Promise.all([
        import("@ston-fi/sdk"),
        import("@ton/ton"),
      ]);

      // Calculate amounts
      const totalAmountTon = activeAmount;
      const platformFee = totalAmountTon * PLATFORM_FEE_PERCENT;
      const swapAmount = totalAmountTon - platformFee;

      // Convert to nanoTON
      const swapNano = toNano(swapAmount.toFixed(9));
      const feeNano = toNano(platformFee.toFixed(9));

      // Get minimum output with slippage
      const minAskAmount = quote.minReceiveRaw;

      console.log("Executing swap:", {
        totalAmount: totalAmountTon,
        platformFee,
        swapAmount,
        minAskAmount,
        tokenAddress,
        router: quote.router,
      });

      // Initialize TonClient
      const client = new TonClient({
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
      });

      // Parse addresses needed for tx params
      const userAddress = Address.parse(address);
      const jettonAddress = Address.parse(tokenAddress);

      // Auto-detect router version/type from the quote simulation result
      // (SDK doesn't expose a simple router.getRouterVersion in this build; we use API-provided routerInfo instead.)
      const routerAddr = quote.router?.address ? Address.parse(quote.router.address) : null;
      const majorVersion = quote.router?.majorVersion ?? null;
      const minorVersion = quote.router?.minorVersion ?? null;
      const routerType = quote.router?.routerType ?? undefined;

      let router: any;
      let proxyTon: any;

      if (routerAddr && typeof majorVersion === "number" && Number.isFinite(majorVersion) && typeof minorVersion === "number" && Number.isFinite(minorVersion)) {
        const contracts: any = dexFactory({
          majorVersion,
          minorVersion,
          routerType,
        });

        router = client.open(new contracts.Router(routerAddr));

        if (majorVersion === 1) {
          proxyTon = new pTON.v1();
        } else {
          const ptonAddr = quote.router?.ptonAddress ?? PTON_V2_1_ADDRESS;
          proxyTon = new pTON.v2_1(Address.parse(ptonAddr));
        }
      } else {
        // Fallback to legacy v1 defaults
        router = client.open(new DEX.v1.Router());
        proxyTon = new pTON.v1();
      }
      // Get swap transaction params
      const txParams = await router.getSwapTonToJettonTxParams({
        userWalletAddress: userAddress,
        proxyTon: proxyTon,
        offerAmount: swapNano,
        askJettonAddress: jettonAddress,
        minAskAmount: minAskAmount,
      });

      console.log("Swap tx params:", txParams);

      // Build messages array
      const messages = [
        // Platform fee transaction
        {
          address: PLATFORM_FEE_WALLET,
          amount: feeNano.toString(),
        },
        // Swap transaction
        {
          address: txParams.to.toString(),
          amount: txParams.value.toString(),
          payload: txParams.body?.toBoc().toString("base64"),
        },
      ];

      // Send transaction via TonConnect
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages,
      });

      console.log("Transaction sent:", result);
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span>Swap submitted successfully!</span>
        </div>
      );

      // Close dialog after successful swap
      setTimeout(() => onOpenChange(false), 2000);

    } catch (error: unknown) {
      console.error("Swap failed:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      
      if (message.includes("Interrupted") || message.includes("cancelled")) {
        toast.error("Swap cancelled by user");
      } else {
        toast.error(`Swap failed: ${message}`);
      }
    } finally {
      setIsSwapping(false);
    }
  }, [activeAmount, quote, address, tonConnectUI, tokenAddress, onOpenChange]);

  const rateLine = useMemo(() => {
    if (!quote || !activeAmount || activeAmount <= 0) return null;

    const decimals = quote.decimals ?? 9;
    const derivedRate = (Number(quote.minReceiveRaw) / Math.pow(10, decimals)) / activeAmount;
    const rate = quote.swapRate ? Number(quote.swapRate) : derivedRate;

    if (!Number.isFinite(rate) || rate <= 0) return null;

    return `1 TON ≈ ${rate.toLocaleString(undefined, { maximumFractionDigits: Math.min(decimals, 6) })} ${quote.symbol || tokenSymbol}`;
  }, [quote, activeAmount, tokenSymbol]);

  const canSwap = isConnected && activeAmount && activeAmount > 0 && quote && !isLoadingQuote && !isSwapping;
  const insufficientBalance = isConnected && balance !== null && activeAmount && activeAmount > balance;

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
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Info className="h-3.5 w-3.5" />
                    Price impact: {quote.priceImpact}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Platform fee: 1% ({(activeAmount! * PLATFORM_FEE_PERCENT).toFixed(2)} TON)
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            {!isConnected ? (
              <Button onClick={connect} className="w-full h-12 text-base font-semibold">
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet
              </Button>
            ) : insufficientBalance ? (
              <Button disabled className="w-full h-12 text-base font-semibold">
                Insufficient Balance
              </Button>
            ) : (
              <Button 
                onClick={executeSwap} 
                disabled={!canSwap}
                className="w-full h-12 text-base font-semibold"
              >
                {isSwapping ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : isLoadingQuote ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Getting Quote...
                  </>
                ) : !quote ? (
                  "Enter Amount"
                ) : (
                  `Swap ${activeAmount} TON`
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
