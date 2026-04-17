import { motion } from "framer-motion";

export interface LiveMatch {
  id: string;
  status: string;
  round: number;
  match_date: string | null;
  home_score: number | null;
  away_score: number | null;
  home_penalties: number | null;
  away_penalties: number | null;
  decided_by: string | null;
  home_team: { name: string; short_name: string; logo_url: string | null } | null;
  away_team: { name: string; short_name: string; logo_url: string | null } | null;
}

interface Props {
  match: LiveMatch;
}

const placeholder = "/placeholder.svg";

const LiveMatchCard = ({ match }: Props) => {
  const home = match.home_team;
  const away = match.away_team;
  if (!home || !away) return null;

  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`bg-card rounded-xl border shadow-card-sport p-3 transition-all ${
        isLive ? "border-accent ring-2 ring-accent/20" : "border-border"
      }`}
    >
      {isLive && (
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-display uppercase tracking-widest text-accent font-bold">AO VIVO</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={home.logo_url || placeholder} alt={home.short_name} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-border" />
          <span className="text-[11px] font-medium text-foreground leading-tight">{home.short_name}</span>
        </div>

        <div className="flex flex-col items-center gap-0.5 min-w-[70px]">
          {isFinished || isLive ? (
            <>
              <div className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
                <span>{match.home_score ?? 0}</span>
                <span className="text-muted-foreground text-sm">×</span>
                <span>{match.away_score ?? 0}</span>
              </div>
              {match.decided_by === "penalties" && (
                <span className="text-[10px] text-accent font-medium">
                  Pen: {match.home_penalties ?? 0}×{match.away_penalties ?? 0}
                </span>
              )}
              <span className={`text-[10px] font-display font-medium uppercase ${isLive ? "text-accent" : "text-primary"}`}>
                {isLive ? "Ao Vivo" : "Finalizado"}
              </span>
            </>
          ) : (
            <>
              <span className="text-sm font-display text-muted-foreground font-bold">VS</span>
              <span className="text-[10px] text-secondary font-medium uppercase">A definir</span>
            </>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={away.logo_url || placeholder} alt={away.short_name} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-border" />
          <span className="text-[11px] font-medium text-foreground leading-tight">{away.short_name}</span>
        </div>
      </div>

      {match.match_date && (
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Rodada {match.round} • {new Date(match.match_date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </p>
      )}
    </motion.div>
  );
};

export default LiveMatchCard;
