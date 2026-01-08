import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";

interface SwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  tokenAddress: string;
}

const PRESET_AMOUNTS = [25, 50, 100] as const;
const HOUSE_FEE_WALLET = "UQCYrkH5kI1ZJXACzI8f5XHLffqTQeA4PcL_MYwH20QmEzX-";
const REFERRAL_FEE = 100; // 1% = 100 basis points

export const SwapDialog = ({ open, onOpenChange, tokenSymbol, tokenAddress }: SwapDialogProps) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert raw address format to user-friendly format for STON.fi
  const formatTokenAddress = (address: string) => {
    // If already in EQ/UQ format, return as is
    if (address.startsWith("EQ") || address.startsWith("UQ")) {
      return address;
    }
    // Convert 0:xxx format to EQxxx format (simplified)
    if (address.startsWith("0:")) {
      return address; // STON.fi accepts raw format
    }
    return address;
  };

  const handleBuy = (amount: number) => {
    setSelectedAmount(amount);
    setIsLoading(true);

    // Build STON.fi swap URL with referral
    // STON.fi swap URL format: https://app.ston.fi/swap?chartVisible=false&ft=TON&tt={tokenAddress}&ta={amount}&referral_address={referralAddress}
    const stonfiUrl = new URL("https://app.ston.fi/swap");
    stonfiUrl.searchParams.set("chartVisible", "false");
    stonfiUrl.searchParams.set("ft", "TON"); // From Token
    stonfiUrl.searchParams.set("tt", formatTokenAddress(tokenAddress)); // To Token
    stonfiUrl.searchParams.set("fa", amount.toString()); // From Amount in TON
    stonfiUrl.searchParams.set("referral_address", HOUSE_FEE_WALLET);

    // Small delay for animation effect
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
          {/* Preset amount buttons */}
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
                    relative h-14 text-lg font-bold transition-all duration-300
                    ${selectedAmount === amount 
                      ? "scale-105 shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background" 
                      : "hover:scale-102 hover:border-primary"
                    }
                  `}
                  onClick={() => handleBuy(amount)}
                  disabled={isLoading}
                >
                  {isLoading && selectedAmount === amount ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-1">
                      {amount}
                      <span className="text-xs font-normal opacity-80">TON</span>
                    </span>
                  )}
                </Button>
              ))}
            </div>
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
