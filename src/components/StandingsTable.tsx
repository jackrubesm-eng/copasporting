import { getStandings, getTeamById, type Category } from "@/data/teams";
import { motion } from "framer-motion";

interface Props {
  category: Category;
}

const StandingsTable = ({ category }: Props) => {
  const standings = getStandings(category);

  return (
    <div className="overflow-x-auto rounded-xl shadow-card-sport border border-border -mx-1">
      <table className="w-full text-xs md:text-sm">
        <thead>
          <tr className="bg-field text-field-foreground">
            <th className="px-2 py-2.5 text-left font-display tracking-wider w-8">#</th>
            <th className="px-2 py-2.5 text-left font-display tracking-wider">Seleção</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">J</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">V</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">E</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">D</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider hidden sm:table-cell">GP</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider hidden sm:table-cell">GC</th>
            <th className="px-1.5 py-2.5 text-center font-display tracking-wider">SG</th>
            <th className="px-2 py-2.5 text-center font-display tracking-wider font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const team = getTeamById(s.teamId);
            if (!team) return null;
            return (
              <motion.tr
                key={s.teamId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`border-t border-border transition-colors ${
                  i === 0 ? "bg-primary/5" : i === 1 ? "bg-primary/[0.02]" : ""
                }`}
              >
                <td className="px-2 py-2.5 font-display font-bold text-muted-foreground">{i + 1}</td>
                <td className="px-2 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <img src={team.logo} alt={team.shortName} className="h-6 w-6 rounded-full object-cover ring-1 ring-border" />
                    <span className="font-medium text-foreground whitespace-nowrap text-xs">{team.shortName}</span>
                  </div>
                </td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.played}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.wins}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.draws}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.losses}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.goalsFor}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground hidden sm:table-cell">{s.goalsAgainst}</td>
                <td className="px-1.5 py-2.5 text-center text-muted-foreground">{s.goalsFor - s.goalsAgainst}</td>
                <td className="px-2 py-2.5 text-center font-display font-bold text-primary text-base">{s.points}</td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StandingsTable;
