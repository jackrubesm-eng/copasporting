import { useParams, Link } from "react-router-dom";
import { categories, getMatches, getTopScorers, teams, type Category } from "@/data/teams";
import StandingsTable from "@/components/StandingsTable";
import MatchCard from "@/components/MatchCard";
import { ArrowLeft } from "lucide-react";

const CategoryDetail = () => {
  const { name } = useParams<{ name: string }>();
  const category = decodeURIComponent(name || "") as Category;

  if (!categories.includes(category)) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Categoria não encontrada.</p>
        <Link to="/categorias" className="text-primary underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  const matches = getMatches(category);
  const finished = matches.filter(m => m.status === "finished");
  const scheduled = matches.filter(m => m.status === "scheduled");
  const topScorers = getTopScorers(category);

  return (
    <div className="container py-8">
      <Link to="/categorias" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Voltar
      </Link>
      <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">{category}</h1>

      {/* Standings */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Classificação</h2>
        <StandingsTable category={category} />
      </section>

      {/* Matches */}
      <section className="mb-10 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Jogos Realizados</h2>
          <div className="space-y-3">
            {finished.length > 0 ? finished.map(m => <MatchCard key={m.id} match={m} />) : (
              <p className="text-muted-foreground text-sm">Nenhum jogo realizado.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Próximos Jogos</h2>
          <div className="space-y-3">
            {scheduled.length > 0 ? scheduled.map(m => <MatchCard key={m.id} match={m} />) : (
              <p className="text-muted-foreground text-sm">Todos os jogos foram realizados.</p>
            )}
          </div>
        </div>
      </section>

      {/* Top Scorers */}
      <section className="mb-10">
        <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Artilharia</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-card-sport">
          {topScorers.map((scorer, i) => {
            const team = teams.find(t => t.id === scorer.teamId);
            return (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className="font-display font-bold text-lg text-muted-foreground w-8">{i + 1}º</span>
                {team && <img src={team.logo} alt={team.shortName} className="h-7 w-7 rounded-full object-cover" />}
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{scorer.name}</p>
                  <p className="text-xs text-muted-foreground">{team?.shortName}</p>
                </div>
                <span className="font-display text-xl font-bold text-primary">{scorer.goals}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scouts */}
      <section>
        <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-4">Scouts</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Melhor Ataque", team: "GB Restinga", value: "12 gols" },
            { label: "Melhor Defesa", team: "AABB", value: "2 gols sofridos" },
            { label: "Mais Disciplinado", team: "Sporting 42", value: "0 cartões" },
            { label: "Melhor Mandante", team: "GB Restinga", value: "100% aprov." },
            { label: "Melhor Visitante", team: "Santos POA", value: "67% aprov." },
            { label: "Mais Cartões", team: "Super Dez", value: "4 cartões" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-4 shadow-card-sport">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-display font-bold text-foreground">{s.team}</p>
              <p className="text-sm text-primary font-medium">{s.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
