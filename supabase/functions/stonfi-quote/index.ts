import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Native TON address in raw format
const TON_ADDRESS = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";

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

    // Use STON.fi REST API v1 with GET query params
    const params = new URLSearchParams({
      offer_address: TON_ADDRESS,
      ask_address: tokenAddress,
      units: offerUnits,
      slippage_tolerance: slippageTolerance,
    });

    const stonfiUrl = `https://api.ston.fi/v1/swap/simulate?${params.toString()}`;
    console.log('Calling STON.fi:', stonfiUrl);

    const stonfiResponse = await fetch(stonfiUrl, {
      method: "GET",
      headers: { 
        "Accept": "application/json",
      },
    });

    if (stonfiResponse.ok) {
      const data = await stonfiResponse.json();
      console.log('STON.fi response:', JSON.stringify(data));
      
      const askUnits = data.ask_units || "0";
      const minAskUnits = data.min_ask_units || askUnits;
      
      return new Response(
        JSON.stringify({
          success: true,
          askUnits,
          minAskUnits,
          priceImpact: data.price_impact || "0",
          swapRate: data.swap_rate || null,
          feeAddress: data.fee_address || null,
          feeUnits: data.fee_units || "0",
          feePercent: data.fee_percent || "0",
          routerAddress: data.router_address || null,
          poolAddress: data.pool_address || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const status = stonfiResponse.status;
    const errorText = await stonfiResponse.text();
    console.log('STON.fi failed, status:', status);
    console.log('STON.fi error:', errorText);

    // Try reverse lookup - maybe token address format is different
    // Try with 0: prefix removed or added
    let altAddress = tokenAddress;
    if (tokenAddress.startsWith("0:")) {
      altAddress = tokenAddress.substring(2);
    } else if (!tokenAddress.startsWith("EQ") && !tokenAddress.startsWith("UQ")) {
      altAddress = "0:" + tokenAddress;
    }

    if (altAddress !== tokenAddress) {
      const altParams = new URLSearchParams({
        offer_address: TON_ADDRESS,
        ask_address: altAddress,
        units: offerUnits,
        slippage_tolerance: slippageTolerance,
      });

      const altUrl = `https://api.ston.fi/v1/swap/simulate?${altParams.toString()}`;
      console.log('Trying alternate address format:', altUrl);

      const altResponse = await fetch(altUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (altResponse.ok) {
        const data = await altResponse.json();
        console.log('STON.fi alt response:', JSON.stringify(data));
        
        return new Response(
          JSON.stringify({
            success: true,
            askUnits: data.ask_units || "0",
            minAskUnits: data.min_ask_units || data.ask_units || "0",
            priceImpact: data.price_impact || "0",
            swapRate: data.swap_rate || null,
            routerAddress: data.router_address || null,
            poolAddress: data.pool_address || null,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Could not fetch quote from DEX',
        message: 'Token may not have liquidity on STON.fi or address format is incorrect',
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
