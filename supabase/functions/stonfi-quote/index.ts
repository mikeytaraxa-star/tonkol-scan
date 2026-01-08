import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Address } from "npm:@ton/core";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STONFI_API = "https://api.ston.fi";

const normalizeAddress = (address: string): string[] => {
  const candidates: string[] = [address];
  try {
    const parsed = Address.parse(address);
    candidates.push(parsed.toRawString());
    candidates.push(parsed.toString({ urlSafe: true, bounceable: true, testOnly: false }));
    candidates.push(parsed.toString({ urlSafe: true, bounceable: false, testOnly: false }));
  } catch { /* ignore */ }
  return [...new Set(candidates)];
};

const fetchAssetInfo = async (tokenAddress: string) => {
  const candidates = normalizeAddress(tokenAddress);
  
  for (const addr of candidates) {
    try {
      const res = await fetch(`${STONFI_API}/v1/assets/${encodeURIComponent(addr)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.asset) {
          console.log('Found asset:', data.asset.symbol, 'decimals:', data.asset.decimals);
          return data.asset;
        }
      }
    } catch (e) {
      console.log('Asset fetch error for', addr);
    }
  }
  return null;
};

const fetchTonAsset = async () => {
  try {
    const res = await fetch(`${STONFI_API}/v1/assets/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c`);
    if (res.ok) {
      const data = await res.json();
      return data?.asset;
    }
  } catch { /* ignore */ }
  return null;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenAddress, amount, slippage } = await req.json();

    if (!tokenAddress || !amount) {
      return new Response(
        JSON.stringify({ error: 'Missing tokenAddress or amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Quote: ${amount} TON -> ${tokenAddress}`);

    const [tokenAsset, tonAsset] = await Promise.all([
      fetchAssetInfo(tokenAddress),
      fetchTonAsset()
    ]);

    const decimals = tokenAsset?.decimals ?? 9;
    const symbol = tokenAsset?.symbol ?? 'TOKEN';
    const tokenPrice = parseFloat(tokenAsset?.dex_usd_price || '0');
    const tonPrice = parseFloat(tonAsset?.dex_usd_price || '3.5');

    console.log('Prices:', { symbol, decimals, tokenPrice, tonPrice });

    if (tokenPrice > 0 && tonPrice > 0) {
      const swapRate = tonPrice / tokenPrice;
      const outputTokens = amount * swapRate;
      const outputUnits = BigInt(Math.floor(outputTokens * Math.pow(10, decimals)));
      const slippageBps = Math.floor((slippage || 1) * 100);
      const minOutputUnits = outputUnits - (outputUnits * BigInt(slippageBps) / 10000n);

      return new Response(
        JSON.stringify({
          success: true,
          askUnits: outputUnits.toString(),
          minAskUnits: minOutputUnits.toString(),
          priceImpact: "0.001",
          swapRate: swapRate.toString(),
          decimals,
          symbol
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Token not found on STON.fi', decimals, symbol }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
