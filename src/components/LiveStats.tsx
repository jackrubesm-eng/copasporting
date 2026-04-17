import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Mode = "gols" | "assists" | "defesa";

interface Props {
  categoryId: string | undefined;
  categoryLabel: string;
  mode: Mode;
}

const placeholder = "/placeholder.svg";

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
};

const LiveStats = ({ categoryId, categoryLabel, mode }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["stats", categoryId, mode],
    enabled: !!categoryId,
    queryFn: async () => {
      if (mode === "defesa") {
        const { data: matches } = await supabase
          .from("matches")
          .select("home_team_id, away_team_id, home_score, away_score, status")
          .eq("category_id", categoryId!)
          .eq("status", "finished");
        const { data: tcs } = await supabase
          .from("team_categories")
          .select("team_id")
          .eq("category_id", categoryId!);
        const teamIds = (tcs || []).map((t) => t.team_id);
        const { data: dbTeams } = await supabase
          .from("teams")
          .select("id, name, short_name, logo_url")
          .in("id", teamIds);
        const map = new Map<string, { teamId: string; name: string; short: string; logo: string | null; played: number; ga: number }>();
        (dbTeams || []).forEach((t) => map.set(t.id, { teamId: t.id, name: t.name, short: t.short_name, logo: t.logo_url, played: 0, ga: 0 }));
        (matches || []).forEach((m) => {
          const h = map.get(m.home_team_id); const a = map.get(m.away_team_id);
          if (h) { h.played++; h.ga += m.away_score ?? 0; }
          if (a) { a.played++; a.ga += m.home_score ?? 0; }
        });
        return Array.from(map.values())
          .filter((r) => r.played > 0)
          .sort((x, y) => x.ga - y.ga || y.played - x.played)
          .slice(0, 5);
      }

      const eventType = mode === "gols" ? "goal" : "assist";
      const { data: events } = await supabase
        .from("match_events")
        .select("athlete_id, match_id")
        .eq("event_type", eventType);
      if (!events || events.length === 0) return [];

      // filtrar por matches da categoria
      const matchIds = Array.from(new Set(events.map((e) => e.match_id)));
      const { data: matches } = await supabase
        .from("matches")
        .select("id")
        .eq("category_id", categoryId!)
        .in("id", matchIds);
      const validMatches = new Set((matches || []).map((m) => m.id));
      const filtered = events.filter((e) => validMatches.has(e.match_id));

      const counts = new Map<string, number>();
      filtered.forEach((e) => counts.set(e.athlete_id, (counts.get(e.athlete_id) || 0) + 1));
      const athleteIds = Array.from(counts.keys());
      if (athleteIds.length === 0) return [];

      const { data: athletes } = await supabase
        .from("athletes")
        .select("id, name, team_id, photo_url")
        .in("id", athleteIds);
      const teamIds = Array.from(new Set((athletes || []).map((a) => a.team_id)));
      const { data: dbTeams } = await supabase
        .from("teams")
        .select("id, short_name, logo_url")
        .in("id", teamIds);
      const teamMap = new Map((dbTeams || []).map((t) => [t.id, t]));

      return (athletes || [])
        .map((a) => ({
          athleteId: a.id,
          name: a.name,
          photo: a.photo_url,
          team: teamMap.get(a.team_id),
          count: counts.get(a.id) || 0,
        }))
        .sort((x, y) => y.count - x.count)
        .slice(0, 5);
    },
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-6 text-center">Carregando…</div>;
  }
  if (!data || data.length === 0) {
    return <div className="text-sm text-muted-foreground py-6 text-center">Sem dados ainda</div>;
  }

  if (mode === "defesa") {
    return (
      <>
        {(data as any[]).map((entry, i) => (
          <motion.div key={entry.teamId} variants={fadeUp} custom={i} initial="hidden" animate="visible" className={`flex items-center gap-3 px-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
            <span className={`font-display font-bold text-lg w-7 text-center ${i === 0 ? "text-secondary" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}º</span>
            <img src={entry.logo || placeholder} alt={entry.short} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" loading="lazy" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground">{entry.played} jogos • {categoryLabel}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-bold text-primary">{entry.ga}</span>
              <span className="text-[10px] text-muted-foreground">gols sofridos</span>
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  const label = mode === "gols" ? "gols" : "assist.";
  return (
    <>
      {(data as any[]).map((p, i) => (
        <motion.div key={p.athleteId} variants={fadeUp} custom={i} initial="hidden" animate="visible" className={`flex items-center gap-3 px-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
          <span className={`font-display font-bold text-lg w-7 text-center ${i === 0 ? "text-secondary" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}º</span>
          <img src={p.team?.logo_url || placeholder} alt={p.team?.short_name || ""} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" loading="lazy" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground text-sm truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.team?.short_name} • {categoryLabel}</p>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold text-primary">{p.count}</span>
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default LiveStats;
