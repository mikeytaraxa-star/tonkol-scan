import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Address } from "npm:@ton/core";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STONFI_API = "https://api.ston.fi";
const TON_ASSET_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

const normalizeAddress = (address: string): string[] => {
  const candidates: string[] = [address];
  try {
    const parsed = Address.parse(address);
    candidates.push(parsed.toRawString());
    candidates.push(parsed.toString({ urlSafe: true, bounceable: true, testOnly: false }));
    candidates.push(parsed.toString({ urlSafe: true, bounceable: false, testOnly: false }));
  } catch {
    // ignore
  }
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
          console.log("Found asset:", data.asset.symbol, "decimals:", data.asset.decimals);
          return data.asset;
        }
      }
    } catch {
      console.log("Asset fetch error for", addr);
    }
  }

  return null;
};

const simulateSwap = async (askAddress: string, offerUnits: string, slippageTolerance: number) => {
  // slippageTolerance comes from UI as percent (e.g. 1 = 1%)
  const slippageDecimal = Math.max(0, slippageTolerance) / 100;

  const res = await fetch(`${STONFI_API}/v1/swap/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      offer_address: TON_ASSET_ADDRESS,
      ask_address: askAddress,
      units: offerUnits,
      slippage_tolerance: String(slippageDecimal),
      dex_v2: true,
    }),
  });

  const data = await res.json().catch(() => null);
  return { ok: res.ok, data };
};

const pickRouterInfo = (sim: any) => {
  // API shapes differ slightly depending on route; try common locations.
  const routerAddress =
    sim?.router_address ??
    sim?.routerAddress ??
    sim?.swaps?.[0]?.router_address ??
    sim?.swaps?.[0]?.routerAddress ??
    null;

  const info = sim?.router_info ?? sim?.routerInfo ?? sim?.swaps?.[0]?.router_info ?? sim?.swaps?.[0]?.routerInfo ?? null;

  const majorVersion = info?.major_version ?? info?.majorVersion ?? null;
  const minorVersion = info?.minor_version ?? info?.minorVersion ?? null;
  const routerType = info?.router_type ?? info?.routerType ?? null;

  return {
    address: routerAddress,
    majorVersion: typeof majorVersion === "number" ? majorVersion : Number(majorVersion ?? NaN),
    minorVersion: typeof minorVersion === "number" ? minorVersion : Number(minorVersion ?? NaN),
    routerType: typeof routerType === "string" ? routerType : null,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tokenAddress, amount, slippage } = await req.json();

    if (!tokenAddress || !amount) {
      return new Response(JSON.stringify({ error: "Missing tokenAddress or amount" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Quote(simulate): ${amount} TON -> ${tokenAddress}`);

    const tokenAsset = await fetchAssetInfo(tokenAddress);
    const decimals = tokenAsset?.decimals ?? 9;
    const symbol = tokenAsset?.symbol ?? "TOKEN";

    // TON amount -> nanoTON
    const offerUnits = String(BigInt(Math.floor(Number(amount) * 1e9)));

    // Try simulation with multiple address encodings (url-safe / raw)
    const candidates = normalizeAddress(tokenAddress);
    let simData: any = null;

    for (const cand of candidates) {
      const { ok, data } = await simulateSwap(cand, offerUnits, Number(slippage ?? 1));
      if (ok && data) {
        simData = data;
        break;
      }
    }

    if (!simData) {
      return new Response(
        JSON.stringify({ success: false, error: "Simulation failed", decimals, symbol }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const askUnits = simData?.ask_units ?? simData?.askUnits;
    const minAskUnits = simData?.min_ask_units ?? simData?.minAskUnits ?? askUnits;
    const swapRate = simData?.swap_rate ?? simData?.swapRate ?? null;
    const priceImpact = simData?.price_impact ?? simData?.priceImpact ?? "0.001";

    const router = pickRouterInfo(simData);

    console.log("Sim response(router):", router);

    return new Response(
      JSON.stringify({
        success: true,
        askUnits: String(askUnits),
        minAskUnits: String(minAskUnits),
        priceImpact: String(priceImpact),
        swapRate: swapRate ? String(swapRate) : null,
        decimals,
        symbol,
        router,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
