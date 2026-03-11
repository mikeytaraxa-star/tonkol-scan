-- Fix RLS policies on posted_ton_pools
DROP POLICY IF EXISTS "Allow service role full access on posted_ton_pools" ON public.posted_ton_pools;
CREATE POLICY "Allow service role full access on posted_ton_pools"
  ON public.posted_ton_pools
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Fix RLS policies on tonkol_launches_channels
DROP POLICY IF EXISTS "Allow service role full access on tonkol_launches_channels" ON public.tonkol_launches_channels;
CREATE POLICY "Allow service role full access on tonkol_launches_channels"
  ON public.tonkol_launches_channels
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);