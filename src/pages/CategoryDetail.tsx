import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="container py-10">
      <Link to="/categorias" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} /> Categorias
      </Link>

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Classificação</p>
        <h1 className="font-display text-5xl text-foreground tracking-tight mb-10">{category}</h1>
      </motion.div>

      {/* Standings */}
      <section className="mb-12">
        <StandingsTable category={category} />
      </section>

      {/* Matches */}
      <section className="mb-12 grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Resultados</p>
          <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">JOGOS REALIZADOS</h2>
          <div className="space-y-3">
            {finished.length > 0 ? finished.map(m => <MatchCard key={m.id} match={m} />) : (
              <p className="text-muted-foreground text-sm">Nenhum jogo realizado.</p>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">Agenda</p>
          <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">PRÓXIMOS JOGOS</h2>
          <div className="space-y-3">
            {scheduled.length > 0 ? scheduled.map(m => <MatchCard key={m.id} match={m} />) : (
              <p className="text-muted-foreground text-sm">Todos os jogos foram realizados.</p>
            )}
          </div>
        </div>
      </section>

      {/* Top Scorers */}
      <section className="mb-12">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Goleadores</p>
        <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">ARTILHARIA</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
          {topScorers.map((scorer, i) => {
            const team = teams.find(t => t.id === scorer.teamId);
            return (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border/50" : ""}`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-display text-base ${
                  i === 0 ? "bg-gold text-gold-foreground" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                {team && <img src={team.logo} alt={team.shortName} className="h-7 w-7 rounded-full object-cover" />}
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{scorer.name}</p>
                  <p className="text-xs text-muted-foreground">{team?.shortName}</p>
                </div>
                <span className="font-display text-2xl text-primary">{scorer.goals}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scouts */}
      <section>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Estatísticas</p>
        <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">SCOUTS</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Melhor Ataque", team: "GB Restinga", value: "12 gols" },
            { label: "Melhor Defesa", team: "AABB", value: "2 gols sofridos" },
            { label: "Mais Disciplinado", team: "Sporting 42", value: "0 cartões" },
            { label: "Melhor Mandante", team: "GB Restinga", value: "100% aprov." },
            { label: "Melhor Visitante", team: "Santos POA", value: "67% aprov." },
            { label: "Mais Cartões", team: "Super Dez", value: "4 cartões" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-5 shadow-card">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2 font-medium">{s.label}</p>
              <p className="font-semibold text-foreground">{s.team}</p>
              <p className="text-sm text-primary font-medium mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryDetail;
