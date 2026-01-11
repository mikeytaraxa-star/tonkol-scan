-- Create table to track posted pools to avoid duplicates
CREATE TABLE public.posted_ton_pools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_address TEXT NOT NULL UNIQUE,
  token_name TEXT,
  token_symbol TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to store channel IDs where the bot should post
CREATE TABLE public.tonkol_launches_channels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id TEXT NOT NULL UNIQUE,
  chat_title TEXT,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read/write for edge function access
ALTER TABLE public.posted_ton_pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tonkol_launches_channels ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access (edge functions use service role)
CREATE POLICY "Allow service role full access on posted_ton_pools" 
ON public.posted_ton_pools 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow service role full access on tonkol_launches_channels" 
ON public.tonkol_launches_channels 
FOR ALL 
USING (true) 
WITH CHECK (true);