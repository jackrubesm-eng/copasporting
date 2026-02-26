import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getTeamById, categories } from "@/data/teams";
import { ArrowLeft } from "lucide-react";

const mockAthletes = [
  { name: "Lucas Silva", birth: 2015, number: 10, goals: 5, assists: 2, yellowCards: 0, redCards: 0, matches: 3 },
  { name: "Pedro Henrique", birth: 2015, number: 7, goals: 3, assists: 1, yellowCards: 1, redCards: 0, matches: 3 },
  { name: "Gabriel Santos", birth: 2015, number: 9, goals: 2, assists: 3, yellowCards: 0, redCards: 0, matches: 3 },
  { name: "Matheus Oliveira", birth: 2015, number: 1, goals: 0, assists: 0, yellowCards: 0, redCards: 0, matches: 3 },
  { name: "João Victor", birth: 2015, number: 4, goals: 1, assists: 0, yellowCards: 2, redCards: 0, matches: 2 },
];

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const team = getTeamById(id || "");

  if (!team) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Equipe não encontrada.</p>
        <Link to="/times" className="text-primary underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/times" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={16} /> Equipes
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-5 mb-10"
      >
        <img src={team.logo} alt={team.name} className="h-20 w-20 rounded-xl object-cover shadow-card" />
        <div>
          <h1 className="font-display text-4xl text-foreground tracking-tight">{team.shortName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{team.name}</p>
        </div>
      </motion.div>

      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Elenco</p>
          <h2 className="font-display text-2xl text-foreground tracking-tight mb-4">{cat}</h2>
          <div className="overflow-x-auto rounded-xl border border-border shadow-card bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atleta</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nasc.</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">J</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">G</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">A</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">🟨</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">🟥</th>
                </tr>
              </thead>
              <tbody>
                {mockAthletes.map((a, i) => (
                  <tr key={i} className="border-t border-border/50 hover:bg-primary/[0.02] transition-colors">
                    <td className="px-4 py-3 font-display text-lg text-muted-foreground">{a.number}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{a.name}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{a.birth}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{a.matches}</td>
                    <td className="px-4 py-3 text-center font-semibold text-primary">{a.goals}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{a.assists}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{a.yellowCards}</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{a.redCards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

export default TeamDetail;
