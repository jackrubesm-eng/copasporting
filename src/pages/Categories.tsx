import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/teams";
import { Trophy, ChevronRight } from "lucide-react";

const Categories = () => (
  <div className="container py-8 md:py-10 px-3">
    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider mb-6">Categorias</h1>
    <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Link
            to={`/categorias/${encodeURIComponent(cat)}`}
            className="flex items-center justify-between bg-card border border-border rounded-xl p-5 hover:shadow-sport hover:border-primary/40 active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-display text-xl font-bold text-foreground">{cat}</span>
                <p className="text-xs text-muted-foreground">6 seleções • Todos contra todos</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);

export default Categories;
