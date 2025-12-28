-- Drop existing restrictive policies on reasons
DROP POLICY IF EXISTS "Authenticated users can manage reasons" ON public.reasons;

-- Create policy that allows anyone to manage reasons (for simple admin panel)
CREATE POLICY "Anyone can manage reasons" 
ON public.reasons 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Do the same for photos
DROP POLICY IF EXISTS "Authenticated users can manage photos" ON public.photos;

CREATE POLICY "Anyone can manage photos" 
ON public.photos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- And for site_settings
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.site_settings;

CREATE POLICY "Anyone can manage settings" 
ON public.site_settings 
FOR ALL 
USING (true)
WITH CHECK (true);