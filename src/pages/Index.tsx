import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Target, ChevronRight } from "lucide-react";
import logoCopa from "@/assets/logo-copa.jpeg";
import mascote from "@/assets/mascote-nobg.png";
import { teams, categories, getMatches, getTopScorers } from "@/data/teams";
import MatchCard from "@/components/MatchCard";

const Index = () => {
  const recentMatches = getMatches("Sub 11").filter(m => m.status === "finished").slice(0, 3);
  const nextMatches = getMatches("Sub 11").filter(m => m.status === "scheduled").slice(0, 3);
  const topScorers = getTopScorers("Sub 11").slice(0, 5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient bg-hero-mesh relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        <div className="container relative py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary-foreground/80 tracking-wider uppercase">Temporada 2026</span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display text-field-foreground tracking-tight leading-[0.9]">
                COPA<br />PAMPA
              </h1>
              <p className="font-display text-2xl md:text-3xl text-gradient-gold tracking-wider mt-2">
                FUTEBOL 7
              </p>
              <p className="mt-5 text-field-foreground/50 text-base max-w-md font-light leading-relaxed">
                O maior torneio de Futebol 7 da região metropolitana do Rio Grande do Sul. 5 categorias, 6 equipes, pura paixão.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/categorias"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-glow-green"
                >
                  Ver Categorias <ChevronRight size={16} />
                </Link>
                <Link
                  to="/times"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-field-foreground/20 text-field-foreground font-semibold text-sm rounded-xl hover:bg-field-foreground/5 transition-all"
                >
                  Equipes
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="flex-shrink-0 relative"
            >
              <div className="absolute -inset-8 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <img src={mascote} alt="Mascote Quero-Quero" className="h-72 md:h-96 object-contain drop-shadow-2xl relative animate-float" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Trophy, label: "Categorias", value: "5" },
            { icon: Users, label: "Equipes", value: "6" },
            { icon: Calendar, label: "Rodadas", value: "5" },
            { icon: Target, label: "Jogos", value: "75" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="bg-card rounded-xl border border-border shadow-card p-5 text-center"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" strokeWidth={1.5} />
              <p className="font-display text-3xl text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Divisões</p>
            <h2 className="font-display text-4xl text-foreground tracking-tight">CATEGORIAS</h2>
          </div>
          <Link to="/categorias" className="text-sm text-muted-foreground hover:text-primary transition-colors hidden md:inline-flex items-center gap-1">
            Ver todas <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
            >
              <Link
                to={`/categorias/${encodeURIComponent(cat)}`}
                className="block bg-card border border-border rounded-xl p-6 text-center hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group"
              >
                <span className="font-display text-3xl text-foreground group-hover:text-gradient-green transition-colors">{cat}</span>
                <p className="text-xs text-muted-foreground mt-1">6 times</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Matches */}
      <section className="bg-muted/50 py-16">
        <div className="container grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Resultados</p>
            <h2 className="font-display text-3xl text-foreground tracking-tight mb-5">ÚLTIMOS JOGOS</h2>
            <div className="space-y-3">
              {recentMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">Agenda</p>
            <h2 className="font-display text-3xl text-foreground tracking-tight mb-5">PRÓXIMOS JOGOS</h2>
            <div className="space-y-3">
              {nextMatches.map(m => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Top Scorers */}
      <section className="container py-16">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Goleadores</p>
        <h2 className="font-display text-3xl text-foreground tracking-tight mb-5">ARTILHEIROS</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
          {topScorers.map((scorer, i) => {
            const team = teams.find(t => t.id === scorer.teamId);
            return (
              <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border/50" : ""} hover:bg-primary/[0.02] transition-colors`}>
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-display text-lg ${
                  i === 0 ? "bg-gold text-gold-foreground" : i === 1 ? "bg-muted text-muted-foreground" : "text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                {team && <img src={team.logo} alt={team.shortName} className="h-8 w-8 rounded-full object-cover" />}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{scorer.name}</p>
                  <p className="text-xs text-muted-foreground">{team?.shortName}</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl text-primary">{scorer.goals}</span>
                  <span className="text-xs text-muted-foreground ml-1">gols</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Teams */}
      <section className="bg-field py-16">
        <div className="container">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1 text-center">Participantes</p>
          <h2 className="font-display text-3xl text-field-foreground tracking-tight mb-8 text-center">EQUIPES</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/times/${team.id}`}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="bg-card/10 backdrop-blur rounded-2xl p-3 group-hover:bg-card/20 transition-all duration-300 group-hover:shadow-glow-green">
                  <img src={team.logo} alt={team.shortName} className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover" />
                </div>
                <span className="text-xs font-medium text-field-foreground/70 text-center leading-tight group-hover:text-field-foreground transition-colors">{team.shortName}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
