import { getTeamById, type Match } from "@/data/teams";

interface Props {
  match: Match;
}

const MatchCard = ({ match }: Props) => {
  const home = getTeamById(match.homeTeamId);
  const away = getTeamById(match.awayTeamId);
  if (!home || !away) return null;

  const isFinished = match.status === "finished";

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center text-center gap-2">
          <img src={home.logo} alt={home.shortName} className="h-11 w-11 rounded-full object-cover shadow-card" />
          <span className="text-xs font-semibold text-foreground leading-tight">{home.shortName}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 min-w-[90px]">
          {isFinished ? (
            <>
              <div className="flex items-center gap-3 font-display text-3xl tracking-wider text-foreground">
                <span>{match.homeScore}</span>
                <span className="text-muted-foreground text-lg">×</span>
                <span>{match.awayScore}</span>
              </div>
              {match.decidedBy === "penalties" && (
                <span className="text-[10px] font-semibold text-accent px-2 py-0.5 bg-accent/10 rounded-full">
                  PEN: {match.homePenalties} × {match.awayPenalties}
                </span>
              )}
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Encerrado</span>
            </>
          ) : (
            <>
              <span className="font-display text-xl text-muted-foreground/40 tracking-wider">VS</span>
              <span className="text-[10px] font-semibold text-gold uppercase tracking-wider">A definir</span>
            </>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center text-center gap-2">
          <img src={away.logo} alt={away.shortName} className="h-11 w-11 rounded-full object-cover shadow-card" />
          <span className="text-xs font-semibold text-foreground leading-tight">{away.shortName}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
