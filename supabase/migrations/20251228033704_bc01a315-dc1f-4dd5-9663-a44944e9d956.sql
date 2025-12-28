-- Love Letters table
CREATE TABLE public.love_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'My Love Letter to You',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.love_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view love letters" ON public.love_letters
FOR SELECT USING (true);

CREATE POLICY "Anyone can manage love letters" ON public.love_letters
FOR ALL USING (true) WITH CHECK (true);

-- Bucket List Items table
CREATE TABLE public.bucket_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bucket_list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bucket list" ON public.bucket_list_items
FOR SELECT USING (true);

CREATE POLICY "Anyone can manage bucket list" ON public.bucket_list_items
FOR ALL USING (true) WITH CHECK (true);

-- Quiz Questions table
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[] NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions
FOR SELECT USING (true);

CREATE POLICY "Anyone can manage quiz questions" ON public.quiz_questions
FOR ALL USING (true) WITH CHECK (true);

-- Star Wishes table
CREATE TABLE public.star_wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wish TEXT NOT NULL,
  x_position FLOAT DEFAULT 0.5,
  y_position FLOAT DEFAULT 0.5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.star_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wishes" ON public.star_wishes
FOR SELECT USING (true);

CREATE POLICY "Anyone can manage wishes" ON public.star_wishes
FOR ALL USING (true) WITH CHECK (true);

-- Add triggers for updated_at
CREATE TRIGGER update_love_letters_updated_at
BEFORE UPDATE ON public.love_letters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bucket_list_items_updated_at
BEFORE UPDATE ON public.bucket_list_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();