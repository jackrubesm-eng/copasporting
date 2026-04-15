import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
}

const SponsorsCarousel = ({ sponsors }: { sponsors: Sponsor[] }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (sponsors.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sponsors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sponsors.length]);

  if (!sponsors.length) return null;

  return (
    <section className="py-8 md:py-12 bg-card border-t border-border">
      <div className="container px-3">
        <h2 className="font-display text-lg font-bold text-foreground mb-1 uppercase tracking-wider text-center">
          Patrocinadores
        </h2>
        <p className="text-xs text-muted-foreground text-center mb-6">
          Parceiros que fazem a Copa do Mundo Sporting acontecer
        </p>

        {/* Carrossel central */}
        <div className="relative h-36 flex items-center justify-center overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.a
              key={sponsors[current]?.id}
              href={sponsors[current]?.website_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute flex flex-col items-center justify-center gap-2"
            >
              {sponsors[current]?.logo_url ? (
                <img
                  src={sponsors[current].logo_url!}
                  alt={sponsors[current].name}
                  className="h-24 w-24 rounded-full object-cover border-2 border-border shadow-md"
                />
              ) : (
                <div className="bg-muted rounded-xl px-6 py-4">
                  <span className="font-display text-lg font-bold text-muted-foreground">
                    {sponsors[current]?.name}
                  </span>
                </div>
              )}
              <span className="text-xs text-muted-foreground font-medium">
                {sponsors[current]?.name}
              </span>
            </motion.a>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2">
          {sponsors.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsCarousel;
