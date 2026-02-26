import { Link } from "react-router-dom";
import { teams } from "@/data/teams";

const Teams = () => (
  <div className="container py-10">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Equipes</h1>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {teams.map((team) => (
        <Link
          key={team.id}
          to={`/times/${team.id}`}
          className="bg-card border border-border rounded-lg p-6 flex flex-col items-center gap-3 hover:shadow-sport hover:border-primary/40 transition-all group"
        >
          <img src={team.logo} alt={team.name} className="h-20 w-20 rounded-full object-cover group-hover:scale-105 transition-transform" />
          <span className="font-display text-lg font-bold text-foreground text-center">{team.shortName}</span>
          <span className="text-xs text-muted-foreground">{team.categories.length} categorias</span>
        </Link>
      ))}
    </div>
  </div>
);

export default Teams;
