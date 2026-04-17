import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const placeholder = "/placeholder.svg";

const Teams = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["teams-page"],
    queryFn: async () => {
      const [{ data: cats }, { data: teams }, { data: tcs }] = await Promise.all([
        supabase.from("categories").select("id, name").order("display_order"),
        supabase.from("teams").select("id, name, short_name, logo_url"),
        supabase.from("team_categories").select("team_id, category_id"),
      ]);
      const teamMap = new Map((teams || []).map((t) => [t.id, t]));
      return (cats || []).map((c) => ({
        category: c,
        teams: (tcs || [])
          .filter((tc) => tc.category_id === c.id)
          .map((tc) => teamMap.get(tc.team_id))
          .filter(Boolean) as { id: string; name: string; short_name: string; logo_url: string | null }[],
      }));
    },
  });

  return (
    <div className="container py-8 md:py-10 px-3">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider mb-6">Seleções</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma seleção cadastrada.</p>
      ) : (
        data.map((group, catIdx) => (
          <motion.div
            key={group.category.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.12 }}
            className="mb-8 last:mb-0"
          >
            <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wider mb-3">{group.category.name}</h2>
            {group.teams.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma seleção nessa categoria.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {group.teams.map((team) => (
                  <Link
                    key={`${team.id}-${group.category.id}`}
                    to={`/times/${team.id}?categoria=${encodeURIComponent(group.category.name)}`}
                    className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-sport hover:border-primary/40 active:scale-[0.97] transition-all group"
                  >
                    <img src={team.logo_url || placeholder} alt={`${team.name} - ${group.category.name}`} className="h-16 w-16 rounded-full object-cover group-hover:scale-105 transition-transform ring-2 ring-border" loading="lazy" />
                    <span className="font-display text-sm font-bold text-foreground text-center">{team.short_name}</span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{group.category.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default Teams;
