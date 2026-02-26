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
    <div className="bg-card rounded-lg border border-border shadow-card-sport p-4 hover:shadow-sport transition-shadow">
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={home.logo} alt={home.shortName} className="h-12 w-12 rounded-full object-cover" />
          <span className="text-xs font-medium text-foreground leading-tight">{home.shortName}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 min-w-[80px]">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
                <span>{match.homeScore}</span>
                <span className="text-muted-foreground text-base">×</span>
                <span>{match.awayScore}</span>
              </div>
              {match.decidedBy === "penalties" && (
                <span className="text-xs text-accent font-medium">
                  Pênaltis: {match.homePenalties} × {match.awayPenalties}
                </span>
              )}
              <span className="text-xs text-primary font-medium uppercase">Finalizado</span>
            </>
          ) : (
            <>
              <span className="text-sm font-display text-muted-foreground">VS</span>
              <span className="text-xs text-secondary font-medium uppercase">A definir</span>
            </>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 flex flex-col items-center text-center gap-1">
          <img src={away.logo} alt={away.shortName} className="h-12 w-12 rounded-full object-cover" />
          <span className="text-xs font-medium text-foreground leading-tight">{away.shortName}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
