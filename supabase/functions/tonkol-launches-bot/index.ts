import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TONKOL_LAUNCHES_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TelegramUpdate {
  message?: {
    chat: {
      id: number;
      title?: string;
      type: string;
    };
    text?: string;
    new_chat_member?: {
      id: number;
      is_bot: boolean;
      username?: string;
    };
  };
  my_chat_member?: {
    chat: {
      id: number;
      title?: string;
      type: string;
    };
    new_chat_member: {
      status: string;
      user: {
        id: number;
        is_bot: boolean;
        username?: string;
      };
    };
  };
}

interface GeckoPool {
  id: string;
  type: string;
  attributes: {
    name: string;
    address: string;
    pool_created_at: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string | null;
    price_change_percentage: {
      h1: string;
      h24: string;
    };
    transactions: {
      h1: {
        buys: number;
        sells: number;
      };
      h24: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      h1: string;
      h24: string;
    };
  };
  relationships: {
    base_token: {
      data: {
        id: string;
      };
    };
    quote_token: {
      data: {
        id: string;
      };
    };
    dex: {
      data: {
        id: string;
      };
    };
  };
}

async function sendTelegramMessage(chatId: string | number, text: string, parseMode: string = "HTML") {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
        disable_web_page_preview: false,
      }),
    });
    
    const result = await response.json();
    console.log(`Message sent to ${chatId}:`, result.ok ? "success" : result.description);
    return result;
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
    return null;
  }
}

async function fetchNewTonPools(): Promise<GeckoPool[]> {
  try {
    const response = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/ton/new_pools?page=1",
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("GeckoTerminal API error:", response.status, response.statusText);
      return [];
    }
    
    const data = await response.json();
    console.log(`Fetched ${data.data?.length || 0} pools from GeckoTerminal`);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching from GeckoTerminal:", error);
    return [];
  }
}

function formatPoolMessage(pool: GeckoPool): string {
  const attrs = pool.attributes;
  const poolName = attrs.name || "Unknown";
  const address = attrs.address;
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const priceUsd = parseFloat(attrs.base_token_price_usd || "0");
  const fdv = parseFloat(attrs.fdv_usd || "0");
  const volume24h = parseFloat(attrs.volume_usd?.h24 || "0");
  const priceChange24h = parseFloat(attrs.price_change_percentage?.h24 || "0");
  const buys24h = attrs.transactions?.h24?.buys || 0;
  const sells24h = attrs.transactions?.h24?.sells || 0;
  
  const priceChangeEmoji = priceChange24h >= 0 ? "🟢" : "🔴";
  const priceChangeFormatted = priceChange24h >= 0 ? `+${priceChange24h.toFixed(2)}%` : `${priceChange24h.toFixed(2)}%`;
  
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const geckoLink = `https://www.geckoterminal.com/ton/pools/${address}`;
  const dexScreenerLink = `https://dexscreener.com/ton/${address}`;
  
  return `🚀 <b>New TON Launch Detected!</b>

💎 <b>${poolName}</b>

📊 <b>Pool Stats:</b>
├ 💵 Price: ${priceUsd > 0 ? `$${priceUsd.toFixed(8)}` : "N/A"}
├ ${priceChangeEmoji} 24h: ${priceChangeFormatted}
├ 📈 FDV: ${fdv > 0 ? formatNumber(fdv) : "N/A"}
├ 💰 Volume 24h: ${volume24h > 0 ? formatNumber(volume24h) : "N/A"}
└ 🔄 Txns: ${buys24h}B / ${sells24h}S

📍 Address: <code>${shortAddress}</code>

🔗 <a href="${geckoLink}">GeckoTerminal</a> | <a href="${dexScreenerLink}">DexScreener</a>

⚡️ @tonkollaunches_bot`;
}

async function checkAndPostNewPools() {
  console.log("Checking for new TON pools...");
  
  // Get all registered channels
  const { data: channels, error: channelsError } = await supabase
    .from("tonkol_launches_channels")
    .select("chat_id, chat_title");
  
  if (channelsError) {
    console.error("Error fetching channels:", channelsError);
    return { posted: 0, error: channelsError.message };
  }
  
  if (!channels || channels.length === 0) {
    console.log("No channels registered yet");
    return { posted: 0, message: "No channels registered" };
  }
  
  console.log(`Found ${channels.length} registered channels`);
  
  // Fetch new pools from GeckoTerminal
  const pools = await fetchNewTonPools();
  
  if (pools.length === 0) {
    console.log("No pools fetched from GeckoTerminal");
    return { posted: 0, message: "No pools found" };
  }
  
  // Get already posted pools
  const { data: postedPools } = await supabase
    .from("posted_ton_pools")
    .select("pool_address");
  
  const postedAddresses = new Set(postedPools?.map(p => p.pool_address) || []);
  
  // Filter new pools
  const newPools = pools.filter(pool => !postedAddresses.has(pool.attributes.address));
  
  console.log(`Found ${newPools.length} new pools to post`);
  
  let postedCount = 0;
  
  for (const pool of newPools.slice(0, 5)) { // Limit to 5 new posts per check
    const message = formatPoolMessage(pool);
    
    // Post to all channels
    for (const channel of channels) {
      await sendTelegramMessage(channel.chat_id, message);
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
    }
    
    // Mark as posted
    const { error: insertError } = await supabase
      .from("posted_ton_pools")
      .insert({
        pool_address: pool.attributes.address,
        token_name: pool.attributes.name,
      });
    
    if (insertError) {
      console.error("Error marking pool as posted:", insertError);
    } else {
      postedCount++;
    }
  }
  
  return { posted: postedCount, channels: channels.length };
}

async function handleTelegramUpdate(update: TelegramUpdate) {
  console.log("Received Telegram update:", JSON.stringify(update));
  
  // Handle bot being added to a channel/group
  if (update.my_chat_member) {
    const chatMember = update.my_chat_member;
    const chat = chatMember.chat;
    const newStatus = chatMember.new_chat_member.status;
    
    console.log(`Bot status changed to ${newStatus} in chat ${chat.id} (${chat.title || chat.type})`);
    
    if (newStatus === "administrator" || newStatus === "member") {
      // Bot was added to the channel/group
      const { error } = await supabase
        .from("tonkol_launches_channels")
        .upsert({
          chat_id: chat.id.toString(),
          chat_title: chat.title || `${chat.type}_${chat.id}`,
        }, { onConflict: "chat_id" });
      
      if (error) {
        console.error("Error registering channel:", error);
      } else {
        console.log(`Registered channel: ${chat.title || chat.id}`);
        
        // Send welcome message
        await sendTelegramMessage(
          chat.id,
          `🚀 <b>TON Launches Bot Activated!</b>\n\nI will now automatically post new token launches on TON blockchain to this channel.\n\n🔔 Stay tuned for real-time alerts!\n\n⚡️ @tonkollaunches_bot`
        );
      }
    } else if (newStatus === "left" || newStatus === "kicked") {
      // Bot was removed from the channel/group
      const { error } = await supabase
        .from("tonkol_launches_channels")
        .delete()
        .eq("chat_id", chat.id.toString());
      
      if (error) {
        console.error("Error removing channel:", error);
      } else {
        console.log(`Removed channel: ${chat.title || chat.id}`);
      }
    }
  }
  
  // Handle /start command in private chats
  if (update.message?.text === "/start") {
    const chatId = update.message.chat.id;
    await sendTelegramMessage(
      chatId,
      `🚀 <b>Welcome to TON Launches Bot!</b>\n\n` +
      `I track and post new token launches on the TON blockchain.\n\n` +
      `<b>How to use:</b>\n` +
      `1️⃣ Add me to your channel/group as an admin\n` +
      `2️⃣ I'll automatically post new launches!\n\n` +
      `📊 Data sourced from GeckoTerminal\n\n` +
      `⚡️ @tonkollaunches_bot`
    );
  }
  
  return { ok: true };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    
    // Webhook endpoint for Telegram updates
    if (req.method === "POST" && !url.searchParams.has("action")) {
      const update: TelegramUpdate = await req.json();
      const result = await handleTelegramUpdate(update);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Manual trigger to check for new pools (for cron job)
    if (url.searchParams.get("action") === "check") {
      const result = await checkAndPostNewPools();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Set webhook endpoint
    if (url.searchParams.get("action") === "setwebhook") {
      const webhookUrl = `${SUPABASE_URL}/functions/v1/tonkol-launches-bot`;
      const setWebhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      
      const response = await fetch(setWebhookUrl);
      const result = await response.json();
      
      console.log("Set webhook result:", result);
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get bot info
    if (url.searchParams.get("action") === "getme") {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
      const result = await response.json();
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "TON Launches Bot API",
      actions: ["check", "setwebhook", "getme"]
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
