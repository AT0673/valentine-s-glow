-- Create table for photos
CREATE TABLE public.photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for love reasons
CREATE TABLE public.reasons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for site settings (music, admin password hash)
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for photos (visitors can view)
CREATE POLICY "Anyone can view photos" 
ON public.photos 
FOR SELECT 
USING (true);

-- Public read access for reasons (visitors can view)
CREATE POLICY "Anyone can view reasons" 
ON public.reasons 
FOR SELECT 
USING (true);

-- Public read access for non-sensitive settings (music url)
CREATE POLICY "Anyone can view public settings" 
ON public.site_settings 
FOR SELECT 
USING (key != 'admin_password');

-- Authenticated users can manage all content (admin)
CREATE POLICY "Authenticated users can manage photos" 
ON public.photos 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage reasons" 
ON public.reasons 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can manage settings" 
ON public.site_settings 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_photos_updated_at
BEFORE UPDATE ON public.photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reasons_updated_at
BEFORE UPDATE ON public.reasons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES 
('music_url', ''),
('admin_password', 'love2025');