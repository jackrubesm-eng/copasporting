import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Target, ChevronRight, Flame, Zap, Shield, Handshake } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import type { Category } from "@/data/teams";
import logoCopa from "@/assets/logo-copa-sporting.jpeg";
import { teams, categories, getMatches, getTopScorers, getTopAssists, getLeastConceded, getStandings, getTeamById } from "@/data/teams";
import { supabase } from "@/integrations/supabase/client";
import MatchCard from "@/components/MatchCard";
import StandingsTable from "@/components/StandingsTable";
import SponsorsCarousel from "@/components/SponsorsCarousel";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const Index = () => {
  const qc = useQueryClient();
  const [matchCat, setMatchCat] = useState<Category>("Pré-mirim");
  const [scorerCat, setScorerCat] = useState<Category>("Pré-mirim");
  const [standingsCat, setStandingsCat] = useState<Category>("Pré-mirim");
  const [statTab, setStatTab] = useState<"gols" | "assists" | "defesa">("gols");

  const recentMatches = getMatches(matchCat).filter(m => m.status === "finished").slice(0, 3);
  const nextMatches = getMatches(matchCat).filter(m => m.status === "scheduled").slice(0, 3);
  const topScorers = getTopScorers(scorerCat).slice(0, 5);

  const { data: sponsors } = useQuery({
    queryKey: ["sponsors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("sponsors")
        .select("*")
        .eq("active", true)
        .order("display_order");
      return data || [];
    },
  });

  // Realtime: auto-refresh when matches or events change
  useEffect(() => {
    const channel = supabase
      .channel("home-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, () => {
        qc.invalidateQueries({ queryKey: ["matches"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "match_events" }, () => {
        qc.invalidateQueries({ queryKey: ["match_events"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero — compact mobile */}
      <section className="bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 left-4 w-32 h-32 rounded-full bg-primary blur-3xl animate-pulse" />
          <div className="absolute bottom-6 right-4 w-48 h-48 rounded-full bg-secondary blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative py-8 md:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center gap-4"
          >
            <motion.img
              variants={fadeUp}
              custom={0}
              src={logoCopa}
              alt="Copa do Mundo Sporting"
              className="h-28 w-28 md:h-40 md:w-40 mx-auto rounded-2xl object-cover shadow-sport"
            />
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-6xl font-display font-bold text-field-foreground tracking-tight leading-tight"
            >
              COPA DO MUNDO
              <span className="block text-gradient-gold">SPORTING</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-field-foreground/70 text-sm md:text-lg max-w-lg mx-auto">
              Torneio interno anual. 6 seleções disputando em 3 categorias.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex gap-3">
              <Link
                to="/categorias"
                className="px-5 py-2.5 bg-primary text-primary-foreground font-display uppercase tracking-wider text-xs rounded-lg hover:bg-primary/90 active:scale-95 transition-all shadow-sport"
              >
                Ver Categorias
              </Link>
              <Link
                to="/times"
                className="px-5 py-2.5 bg-secondary text-secondary-foreground font-display uppercase tracking-wider text-xs rounded-lg hover:bg-secondary/90 active:scale-95 transition-all"
              >
                Seleções
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats — grid 2x2 mobile */}
      <section className="container -mt-5 relative z-10 px-3">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={stagger}
          className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3"
        >
          {[
            { icon: Trophy, label: "Categorias", value: "3", color: "text-primary" },
            { icon: Users, label: "Seleções", value: "6", color: "text-secondary" },
            { icon: Calendar, label: "Rodadas", value: "5 + Final", color: "text-accent" },
            { icon: Target, label: "Jogos/Rodada", value: "9", color: "text-primary" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              className="bg-card rounded-xl border border-border shadow-card-sport p-3 text-center"
            >
              <stat.icon className={`h-4 w-4 ${stat.color} mx-auto mb-1`} />
              <p className="font-display text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories — horizontal scroll mobile */}
      <section className="container py-8 md:py-12 px-3">
        <h2 className="font-display text-lg md:text-2xl font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" /> Categorias
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className=""
            >
              <Link
                to={`/categorias/${encodeURIComponent(cat)}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:shadow-sport hover:border-primary/40 active:scale-[0.98] transition-all group"
              >
                <span className="font-display text-lg font-bold text-primary">{cat}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Matches — stacked on mobile */}
      <section className="bg-muted py-8 md:py-12">
        <div className="container px-3">
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setMatchCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 ${
                  matchCat === cat
                    ? "bg-primary text-primary-foreground shadow-sport"
                    : "bg-card text-muted-foreground border border-border hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" /> Últimos Resultados
              </h2>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-2" key={`recent-${matchCat}`}>
                {recentMatches.length > 0 ? recentMatches.map((m, i) => (
                  <motion.div key={m.id} variants={fadeUp} custom={i}>
                    <MatchCard match={m} />
                  </motion.div>
                )) : <p className="text-sm text-muted-foreground py-4 text-center">Nenhum resultado ainda</p>}
              </motion.div>
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4 text-secondary" /> Próximos Jogos
              </h2>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-2" key={`next-${matchCat}`}>
                {nextMatches.length > 0 ? nextMatches.map((m, i) => (
                  <motion.div key={m.id} variants={fadeUp} custom={i}>
                    <MatchCard match={m} />
                  </motion.div>
                )) : <p className="text-sm text-muted-foreground py-4 text-center">Nenhum jogo agendado</p>}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Classificação */}
      <section className="container py-8 md:py-12 px-3">
        <h2 className="font-display text-lg font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" /> Classificação
        </h2>
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setStandingsCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 ${
                standingsCat === cat
                  ? "bg-primary text-primary-foreground shadow-sport"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <StandingsTable category={standingsCat} key={standingsCat} />
      </section>

      {/* Estatísticas */}
      <section className="container py-8 md:py-12 px-3">
        <h2 className="font-display text-lg font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
          <Flame className="h-4 w-4 text-accent" /> Estatísticas
        </h2>
        {/* Stat type tabs */}
        <div className="flex gap-2 mb-3">
          {([
            { key: "gols" as const, label: "Artilheiros", icon: Flame },
            { key: "assists" as const, label: "Assistências", icon: Handshake },
            { key: "defesa" as const, label: "Menos Vazada", icon: Shield },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setStatTab(key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 ${
                statTab === key
                  ? "bg-accent text-accent-foreground shadow-sport"
                  : "bg-card text-muted-foreground border border-border hover:border-accent/40"
              }`}
            >
              <Icon className="h-3 w-3" /> {label}
            </button>
          ))}
        </div>
        {/* Category tabs */}
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setScorerCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 ${
                scorerCat === cat
                  ? "bg-primary text-primary-foreground shadow-sport"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="bg-card border border-border rounded-xl overflow-hidden shadow-card-sport"
          key={`${statTab}-${scorerCat}`}
        >
          {statTab === "gols" && getTopScorers(scorerCat).slice(0, 5).map((scorer, i) => {
            const team = teams.find(t => t.id === scorer.teamId);
            return (
              <motion.div key={i} variants={fadeUp} custom={i} className={`flex items-center gap-3 px-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={`font-display font-bold text-lg w-7 text-center ${i === 0 ? "text-secondary" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}º</span>
                {team && <img src={team.logo} alt={team.shortName} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" loading="lazy" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{scorer.name}</p>
                  <p className="text-xs text-muted-foreground">{team?.shortName} • {scorerCat}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-primary">{scorer.goals}</span>
                  <span className="text-[10px] text-muted-foreground">gols</span>
                </div>
              </motion.div>
            );
          })}
          {statTab === "assists" && getTopAssists(scorerCat).slice(0, 5).map((player, i) => {
            const team = teams.find(t => t.id === player.teamId);
            return (
              <motion.div key={i} variants={fadeUp} custom={i} className={`flex items-center gap-3 px-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={`font-display font-bold text-lg w-7 text-center ${i === 0 ? "text-secondary" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}º</span>
                {team && <img src={team.logo} alt={team.shortName} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" loading="lazy" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{team?.shortName} • {scorerCat}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-primary">{player.assists}</span>
                  <span className="text-[10px] text-muted-foreground">assist.</span>
                </div>
              </motion.div>
            );
          })}
          {statTab === "defesa" && getLeastConceded(scorerCat).slice(0, 5).map((entry, i) => {
            const team = getTeamById(entry.teamId);
            return (
              <motion.div key={i} variants={fadeUp} custom={i} className={`flex items-center gap-3 px-3 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                <span className={`font-display font-bold text-lg w-7 text-center ${i === 0 ? "text-secondary" : i < 3 ? "text-primary" : "text-muted-foreground"}`}>{i + 1}º</span>
                {team && <img src={team.logo} alt={team.shortName} className="h-8 w-8 rounded-full object-cover ring-2 ring-border" loading="lazy" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{team?.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.matchesPlayed} jogos • {scorerCat}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-bold text-primary">{entry.goalsAgainst}</span>
                  <span className="text-[10px] text-muted-foreground">gols sofridos</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Seleções Participantes */}
      <section className="bg-field py-8 md:py-12">
        <div className="container px-3">
          <h2 className="font-display text-lg font-bold text-field-foreground mb-4 uppercase tracking-wider">Seleções Participantes</h2>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
            {teams.map((team, i) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/times/${team.id}`}
                  className="flex flex-col items-center gap-1.5 snap-center min-w-[64px] group"
                >
                  <div className="bg-card rounded-full p-1.5 shadow-card-sport group-hover:shadow-sport group-active:scale-95 transition-all">
                    <img src={team.logo} alt={team.shortName} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                  </div>
                  <span className="text-[10px] font-medium text-field-foreground/80 text-center leading-tight">{team.shortName}</span>
                  <span className="text-[8px] text-field-foreground/50">{categories.join(" • ")}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patrocinadores — carrossel */}
      <SponsorsCarousel sponsors={sponsors || []} />
    </div>
  );
};

export default Index;
