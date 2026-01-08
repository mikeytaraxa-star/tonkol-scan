import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Address } from "npm:@ton/core";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Native TON address in raw format
const TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

const buildAskAddressCandidates = (tokenAddress: string): string[] => {
  const candidates = new Set<string>();
  if (tokenAddress) candidates.add(tokenAddress);

  try {
    const parsed = Address.parse(tokenAddress);
    candidates.add(parsed.toRawString());
    candidates.add(parsed.toString({ urlSafe: true, bounceable: true, testOnly: false }));
    candidates.add(parsed.toString({ urlSafe: true, bounceable: false, testOnly: false }));
  } catch {
    // ignore parse errors; we'll just try the original string
  }

  return Array.from(candidates);
};

const simulateSwap = async (askAddress: string, offerUnits: string, slippageTolerance: string) => {
  const stonfiUrl = `https://api.ston.fi/v1/swap/simulate`;
  console.log('Calling STON.fi:', stonfiUrl, 'ask:', askAddress);

  const res = await fetch(stonfiUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      offer_address: TON_ADDRESS,
      ask_address: askAddress,
      units: offerUnits,
      slippage_tolerance: slippageTolerance,
    }),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false as const, status: res.status, body: text };
  }

  try {
    const json = JSON.parse(text);
    return { ok: true as const, data: json };
  } catch {
    return { ok: false as const, status: res.status, body: text };
  }
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

    console.log(`Fetching quote for ${amount} TON -> ${tokenAddress}`);

    // Convert amount to nanounits
    const offerUnits = String(Math.floor(amount * 1e9));
    const slippageTolerance = ((slippage || 1) / 100).toFixed(4);

    const candidates = buildAskAddressCandidates(tokenAddress);
    console.log('Ask address candidates:', candidates);

    let lastFailure: { status?: number; body?: string; askAddress?: string } | null = null;

    for (const askAddress of candidates) {
      const result = await simulateSwap(askAddress, offerUnits, slippageTolerance);
      if (!result.ok) {
        console.log('STON.fi simulate failed for', askAddress, 'status:', result.status);
        lastFailure = { status: result.status, body: result.body, askAddress };
        continue;
      }

      const data = result.data;
      console.log('STON.fi response for', askAddress, ':', JSON.stringify(data));

      const askUnits = data.ask_units || "0";
      const minAskUnits = data.min_ask_units || askUnits;

      // Some pairs don't return swap_rate; derive a basic unit ratio as a fallback
      let swapRate: string | null = data.swap_rate || null;
      if (!swapRate) {
        const offerN = Number(offerUnits);
        const askN = Number(askUnits);
        if (Number.isFinite(offerN) && Number.isFinite(askN) && offerN > 0) {
          swapRate = String(askN / offerN);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          askUnits,
          minAskUnits,
          priceImpact: data.price_impact || "0",
          swapRate,
          feeAddress: data.fee_address || null,
          feeUnits: data.fee_units || "0",
          feePercent: data.fee_percent || "0",
          routerAddress: data.router_address || null,
          poolAddress: data.pool_address || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('All STON.fi candidates failed. Last failure:', lastFailure);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Could not fetch quote from DEX',
        message: 'Token may not have liquidity on STON.fi or address format is incorrect',
        debug: lastFailure,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in stonfi-quote function:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

