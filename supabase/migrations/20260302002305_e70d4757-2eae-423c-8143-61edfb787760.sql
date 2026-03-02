
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sponsors" ON public.sponsors
  FOR SELECT USING (active = true);

INSERT INTO public.sponsors (name, logo_url, website_url, display_order)
VALUES ('Arm Tech', '/assets/logo-armtech.png', 'https://armtech.net.br', 1);
