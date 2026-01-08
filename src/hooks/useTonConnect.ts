import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useState, useEffect, useCallback } from "react";

const TON_API_BASE = "https://tonapi.io/v2";

export const useTonConnect = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  const isConnected = !!wallet;
  const address = wallet?.account?.address;

  // Fetch balance when wallet is connected
  useEffect(() => {
    if (!address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      setIsLoadingBalance(true);
      try {
        const response = await fetch(`${TON_API_BASE}/accounts/${address}`);
        if (response.ok) {
          const data = await response.json();
          // Balance is in nanoTON, convert to TON
          setBalance(Number(data.balance) / 1e9);
        }
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchBalance();
  }, [address]);

  const connect = useCallback(async () => {
    try {
      await tonConnectUI.openModal();
    } catch (error) {
      console.error("Failed to open connect modal:", error);
    }
  }, [tonConnectUI]);

  const disconnect = useCallback(async () => {
    try {
      await tonConnectUI.disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, [tonConnectUI]);

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return {
    wallet,
    isConnected,
    address,
    balance,
    isLoadingBalance,
    connect,
    disconnect,
    formatAddress: address ? formatAddress(address) : "",
    tonConnectUI,
  };
};
