import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Trophy, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories-page"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("display_order");
      return data || [];
    },
  });

  return (
    <div className="container py-8 md:py-10 px-3">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground uppercase tracking-wider mb-6">Categorias</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      ) : !categories || categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma categoria cadastrada.</p>
      ) : (
        <div className="space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/categorias/${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-5 hover:shadow-sport hover:border-primary/40 active:scale-[0.98] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="font-display text-xl font-bold text-foreground">{cat.name}</span>
                    <p className="text-xs text-muted-foreground">Todos contra todos</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
