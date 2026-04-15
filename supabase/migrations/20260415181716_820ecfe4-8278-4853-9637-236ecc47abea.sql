DROP POLICY IF EXISTS "Anyone can view active sponsors" ON public.sponsors;
CREATE POLICY "Anyone can view active sponsors" ON public.sponsors FOR SELECT TO anon, authenticated USING (active = true);