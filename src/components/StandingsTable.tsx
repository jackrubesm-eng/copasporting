import { getStandings, getTeamById, type Category } from "@/data/teams";

interface Props {
  category: Category;
}

const StandingsTable = ({ category }: Props) => {
  const standings = getStandings(category);

  return (
    <div className="overflow-x-auto rounded-lg shadow-card-sport border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-field text-field-foreground">
            <th className="px-3 py-3 text-left font-display tracking-wider">#</th>
            <th className="px-3 py-3 text-left font-display tracking-wider">Time</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">J</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">V</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">E</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">D</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">GP</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">GC</th>
            <th className="px-3 py-3 text-center font-display tracking-wider">SG</th>
            <th className="px-3 py-3 text-center font-display tracking-wider font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const team = getTeamById(s.teamId);
            if (!team) return null;
            return (
              <tr
                key={s.teamId}
                className={`border-t border-border transition-colors hover:bg-muted/50 ${
                  i === 0 ? "bg-primary/5" : ""
                }`}
              >
                <td className="px-3 py-3 font-display font-bold text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <img src={team.logo} alt={team.shortName} className="h-7 w-7 rounded-full object-cover" />
                    <span className="font-medium text-foreground whitespace-nowrap">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.played}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.wins}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.draws}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.losses}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsFor}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsAgainst}</td>
                <td className="px-3 py-3 text-center text-muted-foreground">{s.goalsFor - s.goalsAgainst}</td>
                <td className="px-3 py-3 text-center font-display font-bold text-primary text-lg">{s.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
