import { useParams, useSearchParams, Link } from "react-router-dom";
import { getTeamById, categories, type Category } from "@/data/teams";
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
  const [searchParams] = useSearchParams();
  const team = getTeamById(id || "");
  const selectedCategory = searchParams.get("categoria") as Category | null;

  if (!team) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Seleção não encontrada.</p>
        <Link to="/times" className="text-primary underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  const categoriesToShow = selectedCategory && categories.includes(selectedCategory)
    ? [selectedCategory]
    : [...categories];

  return (
    <div className="container py-8">
      <Link to="/times" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft size={16} /> Voltar
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <img src={team.logo} alt={team.name} className="h-20 w-20 rounded-full object-cover shadow-sport" />
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">{team.name}</h1>
          {selectedCategory && (
            <span className="inline-block mt-1 text-sm bg-primary/10 text-primary font-medium px-3 py-0.5 rounded-full">{selectedCategory}</span>
          )}
          {!selectedCategory && (
            <p className="text-sm text-muted-foreground mt-1">
              Presente em: {categories.join(", ")}
            </p>
          )}
        </div>
      </div>

      {!selectedCategory && (
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/times/${team.id}?categoria=${encodeURIComponent(cat)}`}
              className="text-sm bg-muted hover:bg-primary/10 hover:text-primary px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              {cat}
            </Link>
          ))}
        </div>
      )}

      {categoriesToShow.map((cat) => (
        <section key={cat} className="mb-8">
          <h2 className="font-display text-xl font-bold text-foreground uppercase tracking-wider mb-3">
            {team.shortName} — <span className="text-primary">{cat}</span>
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border shadow-card-sport">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-field text-field-foreground">
                  <th className="px-3 py-2 text-left font-display tracking-wider">#</th>
                  <th className="px-3 py-2 text-left font-display tracking-wider">Atleta</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">Nasc.</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">J</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">G</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">A</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">🟨</th>
                  <th className="px-3 py-2 text-center font-display tracking-wider">🟥</th>
                </tr>
              </thead>
              <tbody>
                {mockAthletes.map((a, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/50">
                    <td className="px-3 py-2 font-display font-bold text-muted-foreground">{a.number}</td>
                    <td className="px-3 py-2 font-medium text-foreground">{a.name}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{a.birth}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{a.matches}</td>
                    <td className="px-3 py-2 text-center font-bold text-primary">{a.goals}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{a.assists}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{a.yellowCards}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{a.redCards}</td>
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
