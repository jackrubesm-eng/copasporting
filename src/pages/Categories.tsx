import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/teams";
import { Trophy } from "lucide-react";

const Categories = () => (
  <div className="container py-12">
    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Divisões</p>
    <h1 className="font-display text-5xl text-foreground tracking-tight mb-10">CATEGORIAS</h1>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 * i }}
        >
          <Link
            to={`/categorias/${encodeURIComponent(cat)}`}
            className="block bg-card border border-border rounded-xl p-8 text-center hover:shadow-card-hover hover:border-primary/30 transition-all duration-300 group"
          >
            <Trophy className="h-7 w-7 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
            <span className="font-display text-4xl text-foreground">{cat}</span>
            <p className="text-sm text-muted-foreground mt-2">6 equipes • Todos contra todos</p>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Categories;
