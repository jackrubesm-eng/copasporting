import { getTeamById, type Match } from "@/data/teams";
import { motion } from "framer-motion";

interface Props {
  match: Match;
}

const MatchCard = ({ match }: Props) => {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  if (!home || !away) return null;

  const isFinished = match.status === "finished";
  const isLive = match.status === "live" as string;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`bg-card rounded-xl border shadow-card-sport p-3 transition-all ${
        isLive ? "border-accent ring-2 ring-accent/20" : "border-border"
      }`}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-display uppercase tracking-widest text-accent font-bold">AO VIVO</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={home.logo} alt={home.shortName} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-border" />
          <span className="text-[11px] font-medium text-foreground leading-tight">{home.shortName}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-0.5 min-w-[70px]">
          {isFinished || isLive ? (
            <>
              <div className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
                <span>{match.homeScore}</span>
                <span className="text-muted-foreground text-sm">×</span>
                <span>{match.awayScore}</span>
              </div>
              {match.decidedBy === "penalties" && (
                <span className="text-[10px] text-accent font-medium">
                  Pen: {match.homePenalties}×{match.awayPenalties}
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

        {/* Away */}
        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={away.logo} alt={away.shortName} className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover ring-2 ring-border" />
          <span className="text-[11px] font-medium text-foreground leading-tight">{away.shortName}</span>
        </div>
      </div>

      {/* Round & Date */}
      {match.date && (
        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
          Rodada {match.round} • {new Date(match.date + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
        </p>
      )}
    </motion.div>
  );
};

export default MatchCard;
