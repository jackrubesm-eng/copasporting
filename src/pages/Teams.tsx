import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { teams } from "@/data/teams";

const Teams = () => (
  <div className="container py-12">
    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Participantes</p>
    <h1 className="font-display text-5xl text-foreground tracking-tight mb-10">EQUIPES</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {teams.map((team, i) => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 * i }}
        >
          <Link
            to={`/times/${team.id}`}
            className="bg-card border border-border rounded-xl p-8 flex flex-col items-center gap-4 hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group"
          >
            <img src={team.logo} alt={team.name} className="h-24 w-24 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-card" />
            <div className="text-center">
              <span className="font-display text-xl text-foreground">{team.shortName}</span>
              <p className="text-xs text-muted-foreground mt-1">{team.categories.length} categorias</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Teams;
