
-- Categories table
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Teams table
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text NOT NULL,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage teams" ON public.teams FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Team categories (many-to-many)
CREATE TABLE public.team_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(team_id, category_id)
);
ALTER TABLE public.team_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view team_categories" ON public.team_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage team_categories" ON public.team_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Athletes table
CREATE TABLE public.athletes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birth_date date,
  document_number text,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  shirt_number integer,
  position text,
  photo_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view athletes" ON public.athletes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage athletes" ON public.athletes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Matches table
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  home_team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  home_score integer,
  away_score integer,
  home_penalties integer,
  away_penalties integer,
  status text NOT NULL DEFAULT 'scheduled',
  decided_by text,
  round integer NOT NULL DEFAULT 1,
  match_date date,
  match_time time,
  location text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view matches" ON public.matches FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage matches" ON public.matches FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Match events (goals, assists, cards)
CREATE TABLE public.match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  minute integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view match_events" ON public.match_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated users can manage match_events" ON public.match_events FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Add RLS policies for sponsors management by authenticated users
CREATE POLICY "Authenticated users can insert sponsors" ON public.sponsors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sponsors" ON public.sponsors FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete sponsors" ON public.sponsors FOR DELETE TO authenticated USING (true);
