import { getStandings, getTeamById, type Category } from "@/data/teams";

interface Props {
  category: Category;
}

const StandingsTable = ({ category }: Props) => {
  const standings = getStandings(category);

  return (
    <div className="overflow-x-auto rounded-xl shadow-card border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">J</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">V</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">E</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">D</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">GP</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">GC</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">SG</th>
            <th className="px-3 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const team = getTeamById(s.teamId);
            if (!team) return null;
            return (
              <tr
                key={s.teamId}
                className={`border-t border-border/50 transition-colors hover:bg-primary/[0.03] ${
                  i === 0 ? "bg-primary/[0.04]" : ""
                }`}
              >
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    i === 0 ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                  }`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <img src={team.logo} alt={team.shortName} className="h-7 w-7 rounded-full object-cover" />
                    <span className="font-semibold text-foreground whitespace-nowrap text-sm">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.played}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.wins}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.draws}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.losses}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsFor}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsAgainst}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsFor - s.goalsAgainst}</td>
                <td className="px-3 py-3 text-center">
                  <span className="font-display text-xl text-primary">{s.points}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
