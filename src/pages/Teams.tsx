import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { teams, categories } from "@/data/teams";

const Teams = () => (
  <div className="container py-8 md:py-10 px-3">
    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider mb-6">Seleções</h1>
    {categories.map((cat, catIdx) => (
      <motion.div
        key={cat}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: catIdx * 0.12 }}
        className="mb-8 last:mb-0"
      >
        <h2 className="font-display text-lg font-bold text-primary uppercase tracking-wider mb-3">{cat}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {teams.map((team) => (
            <Link
              key={`${team.id}-${cat}`}
              to={`/times/${team.id}?categoria=${encodeURIComponent(cat)}`}
              className="bg-card border border-border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-sport hover:border-primary/40 active:scale-[0.97] transition-all group"
            >
              <img src={team.logo} alt={`${team.name} - ${cat}`} className="h-16 w-16 rounded-full object-cover group-hover:scale-105 transition-transform ring-2 ring-border" loading="lazy" />
              <span className="font-display text-sm font-bold text-foreground text-center">{team.shortName}</span>
              <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{cat}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
);

export default Teams;
