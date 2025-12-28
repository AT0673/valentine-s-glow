-- Create special_dates table for anniversary countdown
CREATE TABLE public.special_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'heart',
  is_recurring BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create memories table for timeline
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  category TEXT DEFAULT 'milestone',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.special_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- RLS policies for special_dates (matching existing pattern)
CREATE POLICY "Anyone can view special dates"
ON public.special_dates
FOR SELECT
USING (true);

CREATE POLICY "Anyone can manage special dates"
ON public.special_dates
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS policies for memories (matching existing pattern)
CREATE POLICY "Anyone can view memories"
ON public.memories
FOR SELECT
USING (true);

CREATE POLICY "Anyone can manage memories"
ON public.memories
FOR ALL
USING (true)
WITH CHECK (true);

-- Add update triggers for updated_at
CREATE TRIGGER update_special_dates_updated_at
BEFORE UPDATE ON public.special_dates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
BEFORE UPDATE ON public.memories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();