import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const API_BASE = "https://apitonkol.pro";
const API_KEY = "sk_project1_abc123";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { first_name?: string };
  };
}

interface Trade {
  kol_name: string;
  token_symbol: string;
  trade_type: string;
  amount_ton: number;
  timestamp: string;
}

interface KOL {
  name: string;
  pnl_7d_ton?: number;
  volume_7d_ton?: number;
  win_rate?: number;
}

interface Token {
  symbol: string;
  volume_ton?: number;
  trade_count?: number;
}

async function sendTelegramMessage(chatId: number, text: string, parseMode = 'HTML') {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    }),
  });
}

async function fetchRecentTrades(): Promise<Trade[]> {
  try {
    const response = await fetch(`${API_BASE}/api/trades/recent?limit=10`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const data = await response.json();
    return data.trades || [];
  } catch (error) {
    console.error('Error fetching trades:', error);
    return [];
  }
}

async function fetchLeaderboard(): Promise<KOL[]> {
  try {
    const response = await fetch(`${API_BASE}/api/kol/leaderboard?limit=10`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const data = await response.json();
    return data.leaderboard || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

async function fetchTrendingTokens(): Promise<Token[]> {
  try {
    const response = await fetch(`${API_BASE}/api/tokens/heatmap?timeframe=24h`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const data = await response.json();
    return data.tokens?.slice(0, 5) || [];
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

function formatTimeSince(timestampStr: string): string {
  const timestamp = new Date(timestampStr).getTime();
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

async function handleTradeCommand(chatId: number) {
  const trades = await fetchRecentTrades();
  
  if (trades.length === 0) {
    await sendTelegramMessage(chatId, '❌ No recent trades found.');
    return;
  }

  let message = '📊 <b>Recent 10 Trades on Tonkol</b>\n\n';
  
  trades.forEach((trade, index) => {
    const emoji = trade.trade_type === 'buy' ? '🟢' : '🔴';
    const type = trade.trade_type.toUpperCase();
    message += `${index + 1}. ${emoji} <b>${trade.kol_name}</b>\n`;
    message += `   ${type} $${trade.token_symbol} • ${trade.amount_ton?.toFixed(2) ?? 'N/A'} TON\n`;
    message += `   ${formatTimeSince(trade.timestamp)}\n\n`;
  });

  message += '🔗 <a href="https://tonkol.pro">View on Tonkol</a>';
  
  await sendTelegramMessage(chatId, message);
}

async function handleLeaderboardCommand(chatId: number) {
  const kols = await fetchLeaderboard();
  
  if (kols.length === 0) {
    await sendTelegramMessage(chatId, '❌ No leaderboard data found.');
    return;
  }

  let message = '🏆 <b>Top 10 KOLs on Tonkol</b>\n\n';
  
  kols.slice(0, 10).forEach((kol, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const pnl = kol.pnl_7d_ton ?? 0;
    const pnlEmoji = pnl >= 0 ? '📈' : '📉';
    const winRate = kol.win_rate ? `${(kol.win_rate * 100).toFixed(0)}%` : 'N/A';
    
    message += `${medal} <b>${kol.name}</b>\n`;
    message += `   ${pnlEmoji} 7d PnL: ${pnl.toFixed(2)} TON\n`;
    message += `   🎯 Win Rate: ${winRate}\n\n`;
  });

  message += '🔗 <a href="https://tonkol.pro">View on Tonkol</a>';
  
  await sendTelegramMessage(chatId, message);
}

async function handleTrendingCommand(chatId: number) {
  const tokens = await fetchTrendingTokens();
  
  if (tokens.length === 0) {
    await sendTelegramMessage(chatId, '❌ No trending tokens found.');
    return;
  }

  let message = '🔥 <b>Trending Tokens (24h)</b>\n\n';
  
  tokens.forEach((token, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
    const volume = token.volume_ton ?? 0;
    const trades = token.trade_count ?? 0;
    
    message += `${medal} <b>$${token.symbol}</b>\n`;
    message += `   💰 Volume: ${volume.toFixed(2)} TON\n`;
    message += `   📊 Trades: ${trades}\n\n`;
  });

  message += '🔗 <a href="https://tonkol.pro">View on Tonkol</a>';
  
  await sendTelegramMessage(chatId, message);
}

async function handleStartCommand(chatId: number, firstName?: string) {
  const greeting = firstName ? `Hello ${firstName}! ` : 'Hello! ';
  const message = `${greeting}👋 Welcome to <b>Tonkol Bot</b>!\n\n` +
    `I help you track what TON KOLs are trading.\n\n` +
    `<b>Available Commands:</b>\n` +
    `/trade - Show recent 10 trades\n` +
    `/lb - Show top 10 KOL leaderboard\n` +
    `/trending - Show trending tokens\n\n` +
    `🔗 Visit <a href="https://tonkol.pro">tonkol.pro</a> for the full experience!`;
  
  await sendTelegramMessage(chatId, message);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const update: TelegramUpdate = await req.json();
    console.log('Received update:', JSON.stringify(update));
    
    const message = update.message;
    if (!message || !message.text) {
      return new Response('OK', { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text.toLowerCase().trim();
    const firstName = message.from?.first_name;

    if (text === '/start' || text === '/help') {
      await handleStartCommand(chatId, firstName);
    } else if (text === '/trade' || text === '/trades') {
      await handleTradeCommand(chatId);
    } else if (text === '/lb' || text === '/leaderboard') {
      await handleLeaderboardCommand(chatId);
    } else if (text === '/trending' || text === '/tokens') {
      await handleTrendingCommand(chatId);
    }

    return new Response('OK', { status: 200, headers: corsHeaders });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing update:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
