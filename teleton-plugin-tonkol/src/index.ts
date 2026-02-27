/**
 * Tonkol Plugin for Teleton Agent
 *
 * Provides tools to query Tonkol's KOL tracking platform:
 * - Recent trades across all tracked KOLs
 * - Individual KOL trading activity
 * - KOL performance stats and leaderboard
 */

import type {
  PluginSDK,
  SimpleToolDef,
  PluginManifest,
} from "@teleton-agent/sdk";
import {
  getRecentTrades,
  getKOLTrades,
  getKOLStats,
  getLeaderboard,
} from "./api.js";

export const manifest: PluginManifest = {
  name: "tonkol",
  version: "1.0.0",
  description:
    "Track KOL trades, activity, and performance on the TON blockchain via Tonkol",
};

export const tools = (sdk: PluginSDK): SimpleToolDef[] => [
  // ─── Recent Trades ───────────────────────────────────────────
  {
    name: "tonkol_recent_trades",
    description:
      "Get the most recent trades from all tracked TON KOLs. Returns trade type, token, amount in TON/USD, trader name, and DEX used.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of trades to return (1-50, default 20)",
        },
      },
      required: [],
    },
    async execute(params) {
      const limit = Math.min(Math.max(params.limit ?? 20, 1), 50);
      const trades = await getRecentTrades(limit);

      const lines = trades.map(
        (t) =>
          `${t.trade_type.toUpperCase()} ${t.amount_ton.toFixed(2)} TON ($${t.value_usd.toFixed(2)}) — $${t.token_symbol} by ${t.kol_name} on ${t.dex_name} (${t.timestamp})`
      );

      return {
        success: true,
        data: {
          count: trades.length,
          summary: lines.join("\n"),
          trades,
        },
      };
    },
  },

  // ─── KOL Activity ────────────────────────────────────────────
  {
    name: "tonkol_kol_activity",
    description:
      "Get recent trading activity for a specific KOL by wallet address. Shows their latest trades with token, amount, type, and DEX.",
    parameters: {
      type: "object",
      properties: {
        wallet_address: {
          type: "string",
          description: "TON wallet address of the KOL",
        },
        limit: {
          type: "number",
          description: "Number of trades to return (1-50, default 10)",
        },
      },
      required: ["wallet_address"],
    },
    async execute(params) {
      const limit = Math.min(Math.max(params.limit ?? 10, 1), 50);
      const trades = await getKOLTrades(params.wallet_address, limit);

      if (trades.length === 0) {
        return {
          success: true,
          data: { message: "No recent trades found for this KOL." },
        };
      }

      const kolName = trades[0].kol_name;
      const lines = trades.map(
        (t) =>
          `${t.trade_type.toUpperCase()} ${t.amount_ton.toFixed(2)} TON ($${t.value_usd.toFixed(2)}) — $${t.token_symbol} on ${t.dex_name} (${t.timestamp})`
      );

      return {
        success: true,
        data: {
          kol_name: kolName,
          count: trades.length,
          summary: `Recent trades by ${kolName}:\n${lines.join("\n")}`,
          trades,
        },
      };
    },
  },

  // ─── KOL Performance Stats ───────────────────────────────────
  {
    name: "tonkol_kol_stats",
    description:
      "Get performance statistics for a specific tracked KOL: PnL, volume, win rate, avg trade size, biggest win/loss.",
    parameters: {
      type: "object",
      properties: {
        wallet_address: {
          type: "string",
          description: "TON wallet address of the KOL",
        },
      },
      required: ["wallet_address"],
    },
    async execute(params) {
      const stats = await getKOLStats(params.wallet_address);

      if (!stats) {
        return {
          success: false,
          data: { message: "KOL not found or stats unavailable." },
        };
      }

      const summary = [
        `📊 ${stats.kol_name} Performance`,
        `Total Trades: ${stats.total_trades}`,
        `Volume: ${stats.total_volume_ton?.toFixed(2) ?? "0"} TON ($${stats.total_volume_usd?.toFixed(2) ?? "0"})`,
        `PnL: ${stats.pnl_ton?.toFixed(2) ?? "0"} TON ($${stats.pnl_usd?.toFixed(2) ?? "0"})`,
        `Win Rate: ${((stats.win_rate ?? 0) * 100).toFixed(1)}%`,
        `Avg Trade: ${stats.avg_trade_size_ton?.toFixed(2) ?? "0"} TON`,
        `Biggest Win: ${stats.biggest_win_ton?.toFixed(2) ?? "0"} TON`,
        `Biggest Loss: ${stats.biggest_loss_ton?.toFixed(2) ?? "0"} TON`,
        `Unrealized PnL: ${stats.unrealized_pnl_ton?.toFixed(2) ?? "0"} TON`,
      ].join("\n");

      return {
        success: true,
        data: { summary, stats },
      };
    },
  },

  // ─── KOL Leaderboard ─────────────────────────────────────────
  {
    name: "tonkol_leaderboard",
    description:
      "Get the top-performing KOL traders on TON by PnL. Supports 24h and 7d periods.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          description: 'Time period: "24h" or "7d" (default "7d")',
          enum: ["24h", "7d"],
        },
        limit: {
          type: "number",
          description: "Number of KOLs to return (1-25, default 10)",
        },
      },
      required: [],
    },
    async execute(params) {
      const period = (params.period as "24h" | "7d") ?? "7d";
      const limit = Math.min(Math.max(params.limit ?? 10, 1), 25);
      const leaders = await getLeaderboard(period, limit);

      const lines = leaders.map(
        (k, i) =>
          `${i + 1}. ${k.kol_name} — PnL: ${k.pnl_ton?.toFixed(2) ?? "0"} TON | Win Rate: ${((k.win_rate ?? 0) * 100).toFixed(1)}% | Trades: ${k.total_trades}`
      );

      return {
        success: true,
        data: {
          period,
          count: leaders.length,
          summary: `🏆 Top KOLs (${period}):\n${lines.join("\n")}`,
          leaderboard: leaders,
        },
      };
    },
  },
];
