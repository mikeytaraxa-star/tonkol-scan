/**
 * Tonkol API client — fetches KOL trades, activity, and performance data.
 */

const API_BASE = "https://apitonkol.pro";
const API_KEY = "sk_project1_abc123";

const headers: Record<string, string> = {
  "X-API-Key": API_KEY,
  "Content-Type": "application/json",
};

export interface Trade {
  kol_name: string;
  kol_social: string;
  kol_platform: string;
  wallet_address: string;
  token_symbol: string;
  token_name: string;
  token_address: string;
  trade_type: "buy" | "sell";
  amount: number;
  amount_ton: number;
  value_usd: number;
  price_usd: number;
  timestamp: string;
  tx_hash: string;
  dex_name: string;
}

export interface KOLStats {
  wallet_address: string;
  kol_name: string;
  total_trades: number;
  total_volume_ton: number;
  total_volume_usd: number;
  pnl_ton: number;
  pnl_usd: number;
  win_rate: number;
  avg_trade_size_ton: number;
  biggest_win_ton: number;
  biggest_loss_ton: number;
  unrealized_pnl_ton: number;
}

export interface KOLSearchResult {
  wallet_address: string;
  kol_name: string;
  kol_social: string;
  kol_platform: string;
}

export interface KOLActivity {
  wallet_address: string;
  kol_name: string;
  recent_trades: Trade[];
  last_active: string;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(`Tonkol API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Fetch recent trades across all tracked KOLs. */
export async function getRecentTrades(limit = 20): Promise<Trade[]> {
  const data = await apiFetch<{ trades: Trade[] }>(
    `/api/trades/recent?limit=${limit}`
  );
  return (data.trades ?? []).filter((t) => t.amount_ton > 1);
}

/** Fetch recent trades for a specific KOL by wallet address. */
export async function getKOLTrades(
  wallet: string,
  limit = 10
): Promise<Trade[]> {
  const data = await apiFetch<{ trades: Trade[] }>(
    `/api/trades/kol/${wallet}?limit=${limit}`
  );
  return data.trades ?? [];
}

/** Fetch performance stats for a specific KOL. */
export async function getKOLStats(wallet: string): Promise<KOLStats | null> {
  try {
    return await apiFetch<KOLStats>(`/api/kol/${wallet}/stats`);
  } catch {
    return null;
  }
}

/** Fetch the KOL leaderboard. */
export async function getLeaderboard(
  period: "24h" | "7d" = "7d",
  limit = 10
): Promise<KOLStats[]> {
  const data = await apiFetch<{ leaderboard: KOLStats[] }>(
    `/api/leaderboard?period=${period}&limit=${limit}`
  );
  return data.leaderboard ?? [];
}

/** Search KOLs by name (case-insensitive partial match). */
export async function searchKOLs(query: string): Promise<KOLSearchResult[]> {
  const data = await apiFetch<{ kols: KOLSearchResult[] }>(
    `/api/kols/search?q=${encodeURIComponent(query)}`
  );
  return data.kols ?? [];
}
