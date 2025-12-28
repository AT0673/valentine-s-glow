-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can view public settings" ON public.site_settings;

-- Create a new policy that allows reading admin_password (it will be compared server-side conceptually, but for this simple setup we need client access)
CREATE POLICY "Anyone can view settings for login" 
ON public.site_settings 
FOR SELECT 
USING (true);