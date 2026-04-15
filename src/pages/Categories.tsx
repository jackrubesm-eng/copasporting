import { Link } from "react-router-dom";
import { categories } from "@/data/teams";
import { Trophy } from "lucide-react";

const Categories = () => (
  <div className="container py-10">
    <h1 className="font-display text-3xl font-bold text-foreground uppercase tracking-wider mb-8">Categorias</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat}
          to={`/categorias/${encodeURIComponent(cat)}`}
          className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-sport hover:border-primary/40 transition-all group"
        >
          <Trophy className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-display text-2xl font-bold text-foreground">{cat}</span>
          <p className="text-sm text-muted-foreground mt-2">6 seleções • Todos contra todos</p>
        </Link>
      ))}
    </div>
  </div>
);

export default Categories;
