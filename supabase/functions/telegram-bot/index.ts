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

async function handleStartCommand(chatId: number, firstName?: string) {
  const greeting = firstName ? `Hello ${firstName}! ` : 'Hello! ';
  const message = `${greeting}👋 Welcome to <b>Tonkol Bot</b>!\n\n` +
    `I help you track what TON KOLs are trading.\n\n` +
    `<b>Available Commands:</b>\n` +
    `/trade - Show recent 10 trades\n\n` +
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
