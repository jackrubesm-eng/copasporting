import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LiveStandingsTable from "@/components/LiveStandingsTable";
import LiveMatchCard from "@/components/LiveMatchCard";
import LiveStats from "@/components/LiveStats";

const CategoryDetail = () => {
  const { name } = useParams<{ name: string }>();
  const categoryName = decodeURIComponent(name || "");

  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ["category-detail", categoryName],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name").eq("name", categoryName).maybeSingle();
      return data;
    },
  });

  const { data: matches } = useQuery({
    queryKey: ["category-matches", category?.id],
    enabled: !!category?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("matches")
        .select("id, status, round, match_date, home_score, away_score, home_penalties, away_penalties, decided_by, home_team_id, away_team_id")
        .eq("category_id", category!.id)
        .order("match_date", { ascending: false, nullsFirst: false });
      if (!data) return [];
      const teamIds = Array.from(new Set(data.flatMap((m) => [m.home_team_id, m.away_team_id])));
      const { data: dbTeams } = await supabase
        .from("teams")
        .select("id, name, short_name, logo_url")
        .in("id", teamIds);
      const teamMap = new Map((dbTeams || []).map((t) => [t.id, t]));
      return data.map((m) => ({
        ...m,
        home_team: teamMap.get(m.home_team_id) || null,
        away_team: teamMap.get(m.away_team_id) || null,
      }));
    },
  });

  if (catLoading) {
    return <div className="container py-20 text-center text-muted-foreground">Carregando…</div>;
  }

  if (!category) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Categoria não encontrada.</p>
        <Link to="/categorias" className="text-primary underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  const finished = (matches || []).filter((m) => m.status === "finished");
  const scheduled = (matches || []).filter((m) => m.status === "scheduled");

  return (
    <div className="container py-8 px-3">
      <Link to="/categorias" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">{category.name}</h1>

      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Classificação</h2>
        <LiveStandingsTable categoryId={category.id} />
      </section>

      <section className="mb-10 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Jogos Realizados</h2>
          <div className="space-y-3">
            {finished.length > 0 ? finished.map((m) => <LiveMatchCard key={m.id} match={m as any} />) : (
              <p className="text-muted-foreground text-sm">Nenhum jogo realizado.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Próximos Jogos</h2>
          <div className="space-y-3">
            {scheduled.length > 0 ? scheduled.map((m) => <LiveMatchCard key={m.id} match={m as any} />) : (
              <p className="text-muted-foreground text-sm">Nenhum jogo agendado.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Artilharia</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card-sport">
          <LiveStats categoryId={category.id} categoryLabel={category.name} mode="gols" />
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
