import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TONKOL_LAUNCHES_BOT_TOKEN")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_TOKEN = Deno.env.get("LAUNCHES_BOT_ADMIN_TOKEN")!;

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

interface GeckoPoolIncluded {
  id: string;
  type: string;
  attributes: {
    name: string;
    symbol: string;
    address: string;
    image_url?: string;
  };
}

// TON Launchpads DEX IDs (from GeckoTerminal)
const TON_LAUNCHPAD_DEXES = [
  "gaspump",
  "blum",
  "tonpump",
  "ton-pump",
  "wagmi",
  "ton-meme",
  "tonmeme"
];

// FDV filtering thresholds
const MIN_FDV_USD = 100;
const MAX_FDV_USD = 10000;

async function sendTelegramMessage(
  chatId: string | number, 
  text: string, 
  parseMode: string = "HTML",
  replyMarkup?: object
) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text: text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    };
    
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    console.log(`Message sent to ${chatId}:`, result.ok ? "success" : result.description);
    return result;
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
    return null;
  }
}

async function sendTelegramPhoto(
  chatId: string | number,
  photoUrl: string,
  caption: string,
  parseMode: string = "HTML",
  replyMarkup?: object
) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
  
  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      photo: photoUrl,
      caption: caption,
      parse_mode: parseMode,
    };
    
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    console.log(`Photo sent to ${chatId}:`, result.ok ? "success" : result.description);
    return result;
  } catch (error) {
    console.error(`Error sending photo to ${chatId}:`, error);
    return null;
  }
}

interface FetchPoolsResult {
  pools: GeckoPool[];
  included: GeckoPoolIncluded[];
}

async function fetchNewTonPools(): Promise<FetchPoolsResult> {
  try {
    const response = await fetch(
      "https://api.geckoterminal.com/api/v2/networks/ton/new_pools?page=1&include=base_token",
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("GeckoTerminal API error:", response.status, response.statusText);
      return { pools: [], included: [] };
    }
    
    const data = await response.json();
    const pools: GeckoPool[] = data.data || [];
    const included: GeckoPoolIncluded[] = data.included || [];
    
    // Filter to only launchpad DEXes, exclude USDT, and apply FDV filter
    const filteredPools = pools.filter(pool => {
      const dexId = pool.relationships?.dex?.data?.id || "";
      const dexName = dexId.split("_").pop()?.toLowerCase() || "";
      const poolName = pool.attributes.name?.toUpperCase() || "";
      const fdv = parseFloat(pool.attributes.fdv_usd || "0");
      
      // Check if from a launchpad
      const isLaunchpad = TON_LAUNCHPAD_DEXES.some(lpDex => dexName.includes(lpDex));
      
      // Exclude USDT pairs
      const hasUsdt = poolName.includes("USDT") || poolName.includes("USD₮");
      
      // FDV filter: must be between MIN and MAX
      const fdvInRange = fdv >= MIN_FDV_USD && fdv <= MAX_FDV_USD;
      
      return isLaunchpad && !hasUsdt && fdvInRange;
    });
    
    console.log(`Fetched ${pools.length} pools, filtered to ${filteredPools.length} launchpad pools (FDV $${MIN_FDV_USD}-$${MAX_FDV_USD}, excluding USDT)`);
    return { pools: filteredPools, included };
  } catch (error) {
    console.error("Error fetching from GeckoTerminal:", error);
    return { pools: [], included: [] };
  }
}

interface FormatPoolResult {
  message: string;
  replyMarkup: object;
  imageUrl?: string;
}

function formatPoolMessage(pool: GeckoPool, included: GeckoPoolIncluded[]): FormatPoolResult {
  const attrs = pool.attributes;
  const poolName = attrs.name || "Unknown";
  const address = attrs.address;
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  // Get base token info including image
  const baseTokenId = pool.relationships?.base_token?.data?.id;
  const baseToken = included.find(t => t.id === baseTokenId);
  const tokenSymbol = baseToken?.attributes?.symbol || poolName.split("/")[0] || "TOKEN";
  const tokenAddress = baseToken?.attributes?.address || "";
  const imageUrl = baseToken?.attributes?.image_url || "";
  
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
  
  // DTrade link with referral - using token address for trading
  const dtradeLink = tokenAddress 
    ? `https://t.me/AntaresTONBot?start=V3LkKBH35O-${tokenAddress}`
    : `https://t.me/dtrade?start=tonkol`;
  
  const message = `🚀 <b>New TON Launch Detected!</b>

💎 <b>${poolName}</b>

📊 <b>Pool Stats:</b>
├ 💵 Price: ${priceUsd > 0 ? `$${priceUsd.toFixed(8)}` : "N/A"}
├ ${priceChangeEmoji} 24h: ${priceChangeFormatted}
├ 📈 FDV: ${fdv > 0 ? formatNumber(fdv) : "N/A"}
├ 💰 Volume 24h: ${volume24h > 0 ? formatNumber(volume24h) : "N/A"}
└ 🔄 Txns: ${buys24h}B / ${sells24h}S

📍 Address: <code>${shortAddress}</code>

🔗 <a href="${geckoLink}">GeckoTerminal</a>`;

  // Create inline keyboard with DTrade button
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "🔥 Trade on DTrade", url: dtradeLink }
      ]
    ]
  };

  return { message, replyMarkup, imageUrl: imageUrl || undefined };
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
  const { pools, included } = await fetchNewTonPools();
  
  if (pools.length === 0) {
    console.log("No launchpad pools fetched from GeckoTerminal");
    return { posted: 0, message: "No launchpad pools found" };
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
    const { message, replyMarkup, imageUrl } = formatPoolMessage(pool, included);
    
    // Post to all channels
    for (const channel of channels) {
      if (imageUrl) {
        // Send with photo if available
        await sendTelegramPhoto(channel.chat_id, imageUrl, message, "HTML", replyMarkup);
      } else {
        // Fallback to text message
        await sendTelegramMessage(channel.chat_id, message, "HTML", replyMarkup);
      }
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
          `🚀 <b>TON Launches Bot Activated!</b>\n\nI will now automatically post new token launches from TON launchpads to this channel.\n\n🔔 Stay tuned for real-time alerts!`
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
      `I track and post new token launches from TON launchpads.\n\n` +
      `<b>How to use:</b>\n` +
      `1️⃣ Add me to your channel/group as an admin\n` +
      `2️⃣ I'll automatically post new launches!\n\n` +
      `📊 Tracking: GasPump, Blum, TonPump & more`
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
    const action = url.searchParams.get("action");
    
    // Admin actions require token authentication
    if (action === "check" || action === "setwebhook" || action === "getme") {
      const authHeader = req.headers.get("Authorization");
      const token = authHeader?.replace("Bearer ", "");
      if (token !== ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    
    // Webhook endpoint for Telegram updates
    if (req.method === "POST" && !url.searchParams.has("action")) {
      const update: TelegramUpdate = await req.json();
      const result = await handleTelegramUpdate(update);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Manual trigger to check for new pools (for cron job)
    if (action === "check") {
      const result = await checkAndPostNewPools();
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Set webhook endpoint
    if (action === "setwebhook") {
      const webhookUrl = `${SUPABASE_URL}/functions/v1/tonkol-launches-bot`;
      const setWebhookUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      
      const response = await fetch(setWebhookUrl);
      const result = await response.json();
      
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get bot info
    if (action === "getme") {
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
