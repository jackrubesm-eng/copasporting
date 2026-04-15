import { Link } from "react-router-dom";
import { teams, categories } from "@/data/teams";

const Teams = () => (
  <div className="container py-10">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Seleções</h1>
    {categories.map((cat) => (
      <div key={cat} className="mb-10 last:mb-0">
        <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wider mb-4">{cat}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={`${team.id}-${cat}`}
              to={`/times/${team.id}?categoria=${encodeURIComponent(cat)}`}
              className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-3 hover:shadow-sport hover:border-primary/40 transition-all group"
            >
              <img src={team.logo} alt={`${team.name} - ${cat}`} className="h-20 w-20 rounded-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              <span className="font-display text-lg font-bold text-foreground text-center">{team.shortName}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{cat}</span>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default Teams;
