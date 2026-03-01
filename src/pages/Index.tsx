import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import logoCopa from "@/assets/logo-copa.png";
import mascote from "@/assets/mascote.png";
import { teams, categories, getMatches, getTopScorers } from "@/data/teams";
import MatchCard from "@/components/MatchCard";

const Index = () => {
  const recentMatches = getMatches("Sub 11").filter(m => m.status === "finished").slice(0, 3);
  const nextMatches = getMatches("Sub 11").filter(m => m.status === "scheduled").slice(0, 3);
  const topScorers = getTopScorers("Sub 11").slice(0, 5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-primary blur-3xl" />
        </div>

        <div className="container relative py-12 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 text-center md:text-left"
            >
              <img src={logoCopa} alt="Copa Pampa Fut 7 2026" className="h-32 w-32 mx-auto md:mx-0 rounded-2xl object-cover shadow-sport mb-6" />
              <h1 className="text-4xl md:text-6xl font-display font-bold text-field-foreground tracking-tight leading-tight">
                COPA PAMPA
                <span className="block text-gradient-gold">FUT 7 — 2026</span>
              </h1>
              <p className="mt-4 text-field-foreground/70 text-lg max-w-md">
                Torneio de Futebol 7 da região metropolitana do Rio Grande do Sul.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/categorias"
                  className="px-6 py-3 bg-primary text-primary-foreground font-display uppercase tracking-wider text-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sport"
                >
                  Ver Categorias
                </Link>
                <Link
                  to="/times"
                  className="px-6 py-3 bg-secondary text-secondary-foreground font-display uppercase tracking-wider text-sm rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Equipes
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-shrink-0"
            >
              <img src={mascote} alt="Mascote Quero-Quero" className="h-64 md:h-80 object-contain drop-shadow-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Trophy, label: "Categorias", value: "5" },
            { icon: Users, label: "Equipes", value: "6" },
            { icon: Calendar, label: "Rodadas", value: "5" },
            { icon: Target, label: "Jogos", value: "75" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-lg border border-border shadow-card-sport p-4 text-center">
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6 uppercase tracking-wider">Categorias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/categorias/${encodeURIComponent(cat)}`}
              className="bg-card border border-border rounded-lg p-5 text-center hover:shadow-sport hover:border-primary/40 transition-all group"
            >
              <span className="font-display text-xl font-bold text-primary group-hover:text-gradient-gold transition-colors">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Matches + Top Scorers */}
      <section className="bg-muted py-12">
        <div className="container grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 uppercase tracking-wider">Últimos Resultados</h2>
            <div className="space-y-3">
              {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-4 uppercase tracking-wider">Próximos Jogos</h2>
            <div className="space-y-3">
              {nextMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Top Scorers */}
      <section className="container py-12">
        <h2 className="font-display text-xl font-bold text-foreground mb-4 uppercase tracking-wider">Artilheiros</h2>
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
                <span className="text-xs text-muted-foreground">gols</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Teams */}
      <section className="bg-field py-12">
        <div className="container">
          <h2 className="font-display text-xl font-bold text-field-foreground mb-6 uppercase tracking-wider">Equipes Participantes</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/times/${team.id}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="bg-card rounded-full p-2 shadow-card-sport group-hover:shadow-sport transition-shadow">
                  <img src={team.logo} alt={team.shortName} className="h-16 w-16 rounded-full object-cover" />
                </div>
                <span className="text-xs font-medium text-field-foreground/80 text-center leading-tight">{team.shortName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
