import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Wallet, LogOut } from "lucide-react";
import { useTonConnect } from "@/hooks/useTonConnect";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
}

interface SwapQuote {
  minReceive: string;
  priceImpact: string;
}

const PRESET_AMOUNTS = [25, 50, 100] as const;
const HOUSE_FEE_WALLET = "UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-";
const TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<Record<number, SwapQuote | null>>({});
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  
  const { 
    isConnected, 
    balance, 
    isLoadingBalance, 
    connect, 
    disconnect, 
    formatAddress 
  } = useTonConnect();

  // Convert raw address format to user-friendly format for STON.fi
  const formatTokenAddress = (address: string) => {
    if (address.startsWith("EQ") || address.startsWith("UQ")) {
      return address;
    }
    if (address.startsWith("0:")) {
      return address;
    }
    return address;
  };

  // Fetch quotes for all preset amounts when dialog opens
  useEffect(() => {
    if (!open || !tokenAddress) return;

    const fetchQuotes = async () => {
      setIsLoadingQuotes(true);
      const newQuotes: Record<number, SwapQuote | null> = {};

      for (const amount of PRESET_AMOUNTS) {
        try {
          // STON.fi simulation API
          const response = await fetch("https://api.ston.fi/v1/swap/simulate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              offer_address: TON_ADDRESS,
              ask_address: formatTokenAddress(tokenAddress),
              units: String(amount * 1e9), // Convert TON to nanoTON
              slippage_tolerance: "0.05",
            }),
          });

          if (response.ok) {
            const data = await response.json();
            newQuotes[amount] = {
              minReceive: data.min_ask_units 
                ? (Number(data.min_ask_units) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })
                : data.ask_units 
                  ? (Number(data.ask_units) / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : "N/A",
              priceImpact: data.price_impact 
                ? `${(Number(data.price_impact) * 100).toFixed(2)}%`
                : "< 0.01%",
            };
          } else {
            newQuotes[amount] = null;
          }
        } catch (error) {
          console.error(`Failed to fetch quote for ${amount} TON:`, error);
          newQuotes[amount] = null;
        }
      }

      setQuotes(newQuotes);
      setIsLoadingQuotes(false);
    };

    fetchQuotes();
  }, [open, tokenAddress]);

  const handleBuy = (amount: number) => {
    setSelectedAmount(amount);
    setIsLoading(true);

    // Build STON.fi swap URL with referral
    const stonfiUrl = new URL("https://app.ston.fi/swap");
    stonfiUrl.searchParams.set("chartVisible", "false");
    stonfiUrl.searchParams.set("ft", "TON");
    stonfiUrl.searchParams.set("tt", formatTokenAddress(tokenAddress));
    stonfiUrl.searchParams.set("fa", amount.toString());
    stonfiUrl.searchParams.set("referral_address", HOUSE_FEE_WALLET);

    setTimeout(() => {
      window.open(stonfiUrl.toString(), "_blank", "noopener,noreferrer");
      setIsLoading(false);
      setSelectedAmount(null);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-xl">Buy ${tokenSymbol}</span>
            <span className="text-sm text-muted-foreground font-normal">via STON.fi</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Wallet Connection */}
          <div className="bg-muted/50 rounded-lg p-3">
            {isConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{formatAddress}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {isLoadingBalance ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      `${balance?.toFixed(2) ?? "0"} TON`
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnect}
                    className="h-7 px-2"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={connect}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Preset amount buttons with quotes */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              Select amount to swap
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={`
                    relative h-auto py-3 flex flex-col gap-1 transition-all duration-300
                    ${selectedAmount === amount 
                      ? "scale-105 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "hover:scale-102 hover:border-primary"
                    }
                  `}
                  onClick={() => handleBuy(amount)}
                  disabled={isLoading || (isConnected && balance !== null && balance < amount)}
                >
                  {isLoading && selectedAmount === amount ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-lg font-bold">
                        {amount}
                        <span className="text-xs font-normal opacity-80">TON</span>
                      </span>
                      {isLoadingQuotes ? (
                        <span className="text-[10px] text-muted-foreground">
                          Loading...
                        </span>
                      ) : quotes[amount] ? (
                        <span className="text-[10px] text-muted-foreground truncate max-w-full">
                          ≈ {quotes[amount].minReceive}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          Est. output
                        </span>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
            {isConnected && balance !== null && (
              <p className="text-xs text-center text-muted-foreground">
                Available: {balance.toFixed(2)} TON
              </p>
            )}
          </div>

          {/* Fee disclosure */}
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              Swap powered by STON.fi • 1% platform fee applies
            </p>
          </div>

          {/* Direct link to STON.fi */}
          <div className="text-center">
            <a
              href={`https://app.ston.fi/swap?ft=TON&tt=${formatTokenAddress(tokenAddress)}&referral_address=${HOUSE_FEE_WALLET}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open STON.fi directly
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
