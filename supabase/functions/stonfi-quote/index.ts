import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Try STON.fi API
    const stonfiResponse = await fetch("https://api.ston.fi/v1/swap/simulate", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        offer_address: TON_ADDRESS,
        ask_address: tokenAddress,
        units: String(Math.floor(amount * 1e9)),
        slippage_tolerance: ((slippage || 1) / 100).toFixed(4),
      }),
    });

    if (stonfiResponse.ok) {
      const data = await stonfiResponse.json();
      console.log('STON.fi response:', JSON.stringify(data));
      
      const askUnits = data.ask_units || data.min_ask_units || "0";
      const minAskUnits = data.min_ask_units || askUnits;
      
      return new Response(
        JSON.stringify({
          success: true,
          askUnits,
          minAskUnits,
          priceImpact: data.price_impact || "0",
          route: data.route || null,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If STON.fi fails, try to get price from DeDust or return estimate
    console.log('STON.fi failed, status:', stonfiResponse.status);
    const errorText = await stonfiResponse.text();
    console.log('STON.fi error:', errorText);

    // Return a fallback response indicating no quote available
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Could not fetch quote from DEX',
        message: 'Token may not have liquidity on STON.fi',
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
