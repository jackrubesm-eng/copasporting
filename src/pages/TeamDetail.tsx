import { useParams, useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const placeholder = "/placeholder.svg";

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const selectedCategoryName = searchParams.get("categoria");

  const { data, isLoading } = useQuery({
    queryKey: ["team-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const [{ data: team }, { data: tcs }, { data: cats }] = await Promise.all([
        supabase.from("teams").select("id, name, short_name, logo_url").eq("id", id!).maybeSingle(),
        supabase.from("team_categories").select("category_id").eq("team_id", id!),
        supabase.from("categories").select("id, name").order("display_order"),
      ]);
      const teamCatIds = new Set((tcs || []).map((tc) => tc.category_id));
      const teamCategories = (cats || []).filter((c) => teamCatIds.has(c.id));
      return { team, teamCategories };
    },
  });

  const team = data?.team;
  const teamCategories = data?.teamCategories || [];
  const selectedCategory = selectedCategoryName
    ? teamCategories.find((c) => c.name === selectedCategoryName)
    : null;
  const categoriesToShow = selectedCategory ? [selectedCategory] : teamCategories;

  const { data: athletesByCategory } = useQuery({
    queryKey: ["team-athletes", id, categoriesToShow.map((c) => c.id).join(",")],
    enabled: !!id && categoriesToShow.length > 0,
    queryFn: async () => {
      const catIds = categoriesToShow.map((c) => c.id);
      const { data: athletes } = await supabase
        .from("athletes")
        .select("id, name, shirt_number, position, photo_url, birth_date, category_id")
        .eq("team_id", id!)
        .in("category_id", catIds)
        .eq("active", true)
        .order("shirt_number", { ascending: true, nullsFirst: false });

      const athleteIds = (athletes || []).map((a) => a.id);
      const { data: events } = athleteIds.length
        ? await supabase
            .from("match_events")
            .select("athlete_id, event_type, match_id")
            .in("athlete_id", athleteIds)
        : { data: [] };

      // matches por categoria do time para contar Jogos
      const { data: matches } = await supabase
        .from("matches")
        .select("id, category_id, home_team_id, away_team_id, status")
        .in("category_id", catIds)
        .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
        .eq("status", "finished");

      const matchesPlayedByCat = new Map<string, number>();
      (matches || []).forEach((m) => {
        matchesPlayedByCat.set(m.category_id, (matchesPlayedByCat.get(m.category_id) || 0) + 1);
      });

      const stats = new Map<string, { goals: number; assists: number; yellow: number; red: number }>();
      (events || []).forEach((e) => {
        const s = stats.get(e.athlete_id) || { goals: 0, assists: 0, yellow: 0, red: 0 };
        if (e.event_type === "goal") s.goals++;
        else if (e.event_type === "assist") s.assists++;
        else if (e.event_type === "yellow_card") s.yellow++;
        else if (e.event_type === "red_card") s.red++;
        stats.set(e.athlete_id, s);
      });

      const grouped = new Map<string, any[]>();
      (athletes || []).forEach((a) => {
        const s = stats.get(a.id) || { goals: 0, assists: 0, yellow: 0, red: 0 };
        const list = grouped.get(a.category_id) || [];
        list.push({
          ...a,
          ...s,
          matches: matchesPlayedByCat.get(a.category_id) || 0,
        });
        grouped.set(a.category_id, list);
      });
      return grouped;
    },
  });

  if (isLoading) {
    return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  }

  if (!team) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Seleção não encontrada.</p>
        <Link to="/times" className="text-primary underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-8 px-3">
      <Link to="/times" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <img src={team.logo_url || placeholder} alt={team.name} className="h-20 w-20 rounded-full object-cover shadow-sport ring-2 ring-border" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{team.name}</h1>
          {selectedCategory ? (
            <span className="inline-block mt-1 text-sm bg-primary/10 text-primary font-medium px-3 py-0.5 rounded-full">{selectedCategory.name}</span>
          ) : teamCategories.length > 0 ? (
            <p className="text-sm text-muted-foreground mt-1">
              Presente em: {teamCategories.map((c) => c.name).join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      {!selectedCategory && teamCategories.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {teamCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/times/${team.id}?categoria=${encodeURIComponent(cat.name)}`}
              className="text-sm bg-muted hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {categoriesToShow.map((cat) => {
        const athletes = athletesByCategory?.get(cat.id) || [];
        return (
          <section key={cat.id} className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-3">
              {team.short_name} — <span className="text-primary">{cat.name}</span>
            </h2>
            {athletes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum atleta cadastrado nesta categoria.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border shadow-card-sport">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-field text-field-foreground">
                      <th className="px-3 py-2 text-left font-display tracking-wider">#</th>
                      <th className="px-3 py-2 text-left font-display tracking-wider">Atleta</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">Nasc.</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">J</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">G</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">A</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">🟨</th>
                      <th className="px-3 py-2 text-center font-display tracking-wider">🟥</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athletes.map((a) => (
                      <tr key={a.id} className="border-t border-border hover:bg-muted/50">
                        <td className="px-3 py-2 font-display font-bold text-muted-foreground">{a.shirt_number ?? "-"}</td>
                        <td className="px-3 py-2 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            {a.photo_url && (
                              <img src={a.photo_url} alt={a.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-border" loading="lazy" />
                            )}
                            <span>{a.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center text-muted-foreground">
                          {a.birth_date ? new Date(a.birth_date).getFullYear() : "-"}
                        </td>
                        <td className="px-3 py-2 text-center text-muted-foreground">{a.matches}</td>
                        <td className="px-3 py-2 text-center font-bold text-primary">{a.goals}</td>
                        <td className="px-3 py-2 text-center text-muted-foreground">{a.assists}</td>
                        <td className="px-3 py-2 text-center text-muted-foreground">{a.yellow}</td>
                        <td className="px-3 py-2 text-center text-muted-foreground">{a.red}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default TeamDetail;
