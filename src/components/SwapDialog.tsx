import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Loader2, Wallet, ArrowDown, CheckCircle, XCircle } from "lucide-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import { toast } from "sonner";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
}

interface SwapQuote {
  minReceive: string;
  minReceiveRaw: number;
  priceImpact: string;
}

const PRESET_AMOUNTS = [25, 50, 100] as const;
const HOUSE_FEE_WALLET = "UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-";
const TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

type SwapStatus = "idle" | "loading" | "success" | "error";

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [swapStatus, setSwapStatus] = useState<SwapStatus>("idle");
  
  const { 
    isConnected, 
    balance, 
    isLoadingBalance, 
    connect,
    address,
    tonConnectUI,
  } = useTonConnect();

  const activeAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  // Convert raw address format for STON.fi
  const formatTokenAddress = (addr: string) => {
    if (addr.startsWith("EQ") || addr.startsWith("UQ")) {
      return addr;
    }
    return addr;
  };

  // Fetch quote when amount changes
  const fetchQuote = useCallback(async (amount: number) => {
    if (!amount || amount <= 0 || !tokenAddress) return;

    setIsLoadingQuote(true);
    try {
      const response = await fetch("https://api.ston.fi/v1/swap/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_address: TON_ADDRESS,
          ask_address: formatTokenAddress(tokenAddress),
          units: String(Math.floor(amount * 1e9)),
          slippage_tolerance: "0.05",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const minReceiveRaw = data.min_ask_units 
          ? Number(data.min_ask_units) / 1e9
          : data.ask_units 
            ? Number(data.ask_units) / 1e9
            : 0;
        
        setQuote({
          minReceive: minReceiveRaw.toLocaleString(undefined, { maximumFractionDigits: 4 }),
          minReceiveRaw,
          priceImpact: data.price_impact 
            ? `${(Number(data.price_impact) * 100).toFixed(2)}%`
            : "< 0.01%",
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
  }, [tokenAddress]);

  // Debounced quote fetch
  useEffect(() => {
    if (!activeAmount || activeAmount <= 0) {
      setQuote(null);
      return;
    }

    const timeout = setTimeout(() => {
      fetchQuote(activeAmount);
    }, 500);

    return () => clearTimeout(timeout);
  }, [activeAmount, fetchQuote]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setCustomAmount("");
      setSelectedAmount(null);
      setQuote(null);
      setSwapStatus("idle");
    }
  }, [open]);

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    // Validate input
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === "" || (!isNaN(numValue) && numValue <= 10000)) {
        setCustomAmount(value);
        setSelectedAmount(null);
      }
    }
  };

  const executeSwap = async () => {
    if (!activeAmount || !isConnected || !address || !tonConnectUI) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (balance !== null && activeAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    setSwapStatus("loading");

    try {
      // For direct swaps, we'll use STON.fi API to get the swap route
      // Then execute via TonConnect
      const response = await fetch("https://api.ston.fi/v1/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_address: TON_ADDRESS,
          ask_address: formatTokenAddress(tokenAddress),
          units: String(Math.floor(activeAmount * 1e9)),
          slippage_tolerance: "0.05",
          referral_address: HOUSE_FEE_WALLET,
          referral_fee_percent: "0.01",
        }),
      });

      if (!response.ok) {
        // Fallback to opening STON.fi directly
        const stonfiUrl = new URL("https://app.ston.fi/swap");
        stonfiUrl.searchParams.set("chartVisible", "false");
        stonfiUrl.searchParams.set("ft", "TON");
        stonfiUrl.searchParams.set("tt", formatTokenAddress(tokenAddress));
        stonfiUrl.searchParams.set("fa", activeAmount.toString());
        stonfiUrl.searchParams.set("referral_address", HOUSE_FEE_WALLET);
        
        window.open(stonfiUrl.toString(), "_blank", "noopener,noreferrer");
        setSwapStatus("success");
        toast.success("Redirected to STON.fi to complete swap");
        setTimeout(() => onOpenChange(false), 1000);
        return;
      }

      const swapData = await response.json();
      
      // Execute transaction via TonConnect
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [{
          address: swapData.router_address || "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt",
          amount: String(Math.floor(activeAmount * 1e9)),
          payload: swapData.payload || "",
        }],
      });

      setSwapStatus("success");
      toast.success(`Successfully swapped ${activeAmount} TON for ${tokenSymbol}!`);
      setTimeout(() => onOpenChange(false), 2000);
    } catch (error: any) {
      console.error("Swap failed:", error);
      
      // Check if user rejected
      if (error?.message?.includes("rejected") || error?.message?.includes("cancelled")) {
        toast.error("Transaction cancelled");
        setSwapStatus("idle");
      } else {
        // Fallback to STON.fi web interface
        const stonfiUrl = new URL("https://app.ston.fi/swap");
        stonfiUrl.searchParams.set("chartVisible", "false");
        stonfiUrl.searchParams.set("ft", "TON");
        stonfiUrl.searchParams.set("tt", formatTokenAddress(tokenAddress));
        stonfiUrl.searchParams.set("fa", activeAmount.toString());
        stonfiUrl.searchParams.set("referral_address", HOUSE_FEE_WALLET);
        
        window.open(stonfiUrl.toString(), "_blank", "noopener,noreferrer");
        setSwapStatus("idle");
        toast.info("Opened STON.fi to complete your swap");
      }
    }
  };

  const insufficientBalance = isConnected && balance !== null && activeAmount && activeAmount > balance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-xl">Swap TON → ${tokenSymbol}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* From Section */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">You pay</span>
              {isConnected && (
                <span className="text-xs text-muted-foreground">
                  Balance: {isLoadingBalance ? "..." : `${balance?.toFixed(2) ?? "0"} TON`}
                </span>
              )}
            </div>
            
            {/* Custom Amount Input */}
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

            {/* Preset Buttons */}
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

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* To Section */}
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
              <span className="text-lg font-semibold text-muted-foreground">
                ${tokenSymbol}
              </span>
            </div>
            {quote && (
              <p className="text-xs text-muted-foreground">
                Price impact: {quote.priceImpact}
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            {!isConnected ? (
              <Button onClick={connect} className="w-full h-12 text-base font-semibold">
                <Wallet className="h-5 w-5 mr-2" />
                Connect Wallet to Swap
              </Button>
            ) : (
              <Button
                onClick={executeSwap}
                disabled={!activeAmount || activeAmount <= 0 || insufficientBalance || swapStatus === "loading"}
                className="w-full h-12 text-base font-semibold"
              >
                {swapStatus === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : swapStatus === "success" ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Success!
                  </>
                ) : swapStatus === "error" ? (
                  <>
                    <XCircle className="h-5 w-5 mr-2" />
                    Try Again
                  </>
                ) : insufficientBalance ? (
                  "Insufficient Balance"
                ) : !activeAmount ? (
                  "Enter Amount"
                ) : (
                  `Swap ${activeAmount} TON`
                )}
              </Button>
            )}
          </div>

          {/* Fee disclosure */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Powered by STON.fi • 1% platform fee
            </p>
            <a
              href={`https://app.ston.fi/swap?ft=TON&tt=${formatTokenAddress(tokenAddress)}&referral_address=${HOUSE_FEE_WALLET}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Open in STON.fi
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
