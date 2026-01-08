import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useTonConnect } from "@/hooks/useTonConnect";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WalletButton = () => {
  const { 
    isConnected, 
    balance, 
    isLoadingBalance, 
    connect, 
    disconnect, 
    formatAddress 
  } = useTonConnect();

  if (!isConnected) {
    return (
      <Button
        onClick={connect}
        className="bg-primary hover:bg-accent text-primary-foreground font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
      >
        <Wallet className="h-4 w-4 mr-1 sm:mr-2" />
        <span className="hidden sm:inline">Connect</span>
        <span className="sm:hidden">Wallet</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-background hover:bg-accent text-foreground font-semibold text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
        >
          <Wallet className="h-4 w-4 mr-1 sm:mr-2 text-primary" />
          <span className="hidden sm:inline">
            {formatAddress}
          </span>
          <span className="sm:hidden">
            {formatAddress}
          </span>
          {!isLoadingBalance && balance !== null && (
            <span className="ml-2 text-muted-foreground hidden sm:inline">
              {balance.toFixed(2)} TON
            </span>
          )}
          {isLoadingBalance && (
            <Loader2 className="ml-2 h-3 w-3 animate-spin" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-sm">
          <div className="flex flex-col">
            <span className="font-medium">{formatAddress}</span>
            <span className="text-muted-foreground">
              {balance?.toFixed(4) ?? "0"} TON
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnect} className="text-destructive">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
