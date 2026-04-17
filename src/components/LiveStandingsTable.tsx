import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  categoryId: string | undefined;
}

interface Row {
  teamId: string;
  name: string;
  short: string;
  logo: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  points: number;
}

const placeholder = "/placeholder.svg";

const LiveStandingsTable = ({ categoryId }: Props) => {
  const { data: rows, isLoading } = useQuery<Row[]>({
    queryKey: ["standings", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      // teams in category
      const { data: tcs } = await supabase
        .from("team_categories")
        .select("team_id")
        .eq("category_id", categoryId!);
      const teamIds = (tcs || []).map((t) => t.team_id);
      if (teamIds.length === 0) return [];

      const { data: dbTeams } = await supabase
        .from("teams")
        .select("id, name, short_name, logo_url")
        .in("id", teamIds);

      const { data: matches } = await supabase
        .from("matches")
        .select("home_team_id, away_team_id, home_score, away_score, home_penalties, away_penalties, status, decided_by")
        .eq("category_id", categoryId!)
        .eq("status", "finished");

      const map = new Map<string, Row>();
      (dbTeams || []).forEach((t) =>
        map.set(t.id, {
          teamId: t.id,
          name: t.name,
          short: t.short_name,
          logo: t.logo_url,
          played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, points: 0,
        }),
      );

      (matches || []).forEach((m) => {
        const h = map.get(m.home_team_id);
        const a = map.get(m.away_team_id);
        if (!h || !a) return;
        const hs = m.home_score ?? 0;
        const as = m.away_score ?? 0;
        h.played++; a.played++;
        h.gf += hs; h.ga += as;
        a.gf += as; a.ga += hs;

        if (hs > as) {
          h.wins++; a.losses++; h.points += 3;
        } else if (as > hs) {
          a.wins++; h.losses++; a.points += 3;
        } else {
          // empate no tempo normal
          if (m.decided_by === "penalties") {
            const hp = m.home_penalties ?? 0;
            const ap = m.away_penalties ?? 0;
            if (hp > ap) { h.points += 2; a.points += 1; }
            else { a.points += 2; h.points += 1; }
          } else {
            h.draws++; a.draws++;
            h.points += 1; a.points += 1;
          }
        }
      });

      return Array.from(map.values()).sort((x, y) =>
        y.points - x.points ||
        (y.gf - y.ga) - (x.gf - x.ga) ||
        y.gf - x.gf ||
        x.name.localeCompare(y.name),
      );
    },
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground py-6 text-center">Carregando classificação…</div>;
  }
  if (!rows || rows.length === 0) {
    return <div className="text-sm text-muted-foreground py-6 text-center">Sem times nessa categoria ainda</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-card-sport border border-border -mx-1">
      <table className="w-full text-xs md:text-sm">
        <thead>
          <tr className="bg-field text-field-foreground">
            <th className="px-2 py-2.5 text-left font-display tracking-wider w-8">#</th>
            <th className="px-2 py-2.5 text-left font-display tracking-wider">Seleção</th>
            <th className="px-2 py-2.5 text-center font-display tracking-wider font-bold">PTS</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">J</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">V</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">E</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">D</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider hidden sm:table-cell">GP</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider hidden sm:table-cell">GC</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">SG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s, i) => (
            <motion.tr
              key={s.teamId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`border-t border-border transition-colors ${
                i === 0 ? "bg-primary/5" : i === 1 ? "bg-primary/[0.02]" : ""
              }`}
            >
              <td className="px-2 py-2.5 font-display font-bold text-muted-foreground">{i + 1}</td>
              <td className="px-2 py-2.5">
                <div className="flex items-center gap-1.5">
                  <img src={s.logo || placeholder} alt={s.short} className="h-6 w-6 rounded-full object-cover ring-1 ring-border" />
                  <span className="font-medium text-foreground whitespace-nowrap text-xs">{s.short}</span>
                </div>
              </td>
              <td className="px-2 py-2.5 text-center font-display font-bold text-primary text-base">{s.points}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.played}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.wins}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.draws}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.losses}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.gf}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.ga}</td>
              <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.gf - s.ga}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveStandingsTable;
