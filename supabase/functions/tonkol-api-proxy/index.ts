import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TONKOL_API_KEY = Deno.env.get("TONKOL_API_KEY")!;
const API_BASE = "https://apitonkol.pro";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");

    if (!path) {
      return new Response(JSON.stringify({ error: "Missing 'path' parameter" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate path starts with /api/
    if (!path.startsWith("/api/")) {
      return new Response(JSON.stringify({ error: "Invalid path" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const targetUrl = `${API_BASE}${path}`;
    const response = await fetch(targetUrl, {
      headers: {
        "X-API-Key": TONKOL_API_KEY,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
