import flagBrasil from "@/assets/flag-brasil.png";
import flagArgentina from "@/assets/flag-argentina.png";
import flagEspanha from "@/assets/flag-espanha.png";
import flagFranca from "@/assets/flag-franca.png";
import flagJapao from "@/assets/flag-japao.png";
import flagMarrocos from "@/assets/flag-marrocos.png";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  categories: string[];
}

export const categories = ["Pré-mirim", "Mirim", "Infantil"] as const;
export type Category = typeof categories[number];

export const teams: Team[] = [
  { id: "brasil", name: "Brasil", shortName: "Brasil", logo: flagBrasil, categories: ["Pré-mirim", "Mirim", "Infantil"] },
  { id: "argentina", name: "Argentina", shortName: "Argentina", logo: flagArgentina, categories: ["Pré-mirim", "Mirim", "Infantil"] },
  { id: "espanha", name: "Espanha", shortName: "Espanha", logo: flagEspanha, categories: ["Pré-mirim", "Mirim", "Infantil"] },
  { id: "franca", name: "França", shortName: "França", logo: flagFranca, categories: ["Pré-mirim", "Mirim", "Infantil"] },
  { id: "japao", name: "Japão", shortName: "Japão", logo: flagJapao, categories: ["Pré-mirim", "Mirim", "Infantil"] },
  { id: "marrocos", name: "Marrocos", shortName: "Marrocos", logo: flagMarrocos, categories: ["Pré-mirim", "Mirim", "Infantil"] },
];

export interface Standing {
  teamId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  penaltyWins: number;
  penaltyLosses: number;
  points: number;
}

export interface Match {
  id: string;
  category: Category;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  homePenalties: number | null;
  awayPenalties: number | null;
  status: "scheduled" | "finished";
  decidedBy: "normal" | "penalties" | null;
  round: number;
  date: string | null;
}

export interface TopScorer {
  name: string;
  teamId: string;
  goals: number;
}

export interface TopAssist {
  name: string;
  teamId: string;
  assists: number;
}

export interface LeastConceded {
  teamId: string;
  goalsAgainst: number;
  matchesPlayed: number;
}

export function getStandings(category: Category): Standing[] {
  const mockStandings: Standing[] = teams.map((team, i) => ({
    teamId: team.id,
    played: 3,
    wins: Math.max(0, 3 - i),
    draws: i < 3 ? 0 : 1,
    losses: Math.min(i, 3),
    goalsFor: Math.max(1, 12 - i * 2),
    goalsAgainst: Math.max(1, 2 + i),
    penaltyWins: i === 3 ? 1 : 0,
    penaltyLosses: i === 4 ? 1 : 0,
    points: Math.max(0, 9 - i * 2) + (i === 3 ? 2 : 0) + (i === 4 ? 1 : 0),
  }));
  return mockStandings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    const sdA = a.goalsFor - a.goalsAgainst;
    const sdB = b.goalsFor - b.goalsAgainst;
    if (sdB !== sdA) return sdB - sdA;
    return b.goalsFor - a.goalsFor;
  });
}

export function getMatches(category: Category): Match[] {
  return [
    { id: "1", category, homeTeamId: "brasil", awayTeamId: "argentina", homeScore: 3, awayScore: 1, homePenalties: null, awayPenalties: null, status: "finished", decidedBy: "normal", round: 1, date: "2026-06-10" },
    { id: "2", category, homeTeamId: "espanha", awayTeamId: "franca", homeScore: 2, awayScore: 2, homePenalties: 3, awayPenalties: 1, status: "finished", decidedBy: "penalties", round: 1, date: "2026-06-10" },
    { id: "3", category, homeTeamId: "japao", awayTeamId: "marrocos", homeScore: 1, awayScore: 0, homePenalties: null, awayPenalties: null, status: "finished", decidedBy: "normal", round: 1, date: "2026-06-11" },
    { id: "4", category, homeTeamId: "argentina", awayTeamId: "espanha", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
    { id: "5", category, homeTeamId: "franca", awayTeamId: "japao", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
    { id: "6", category, homeTeamId: "marrocos", awayTeamId: "brasil", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
  ];
}

export function getTopScorers(category: Category): TopScorer[] {
  return [
    { name: "Lucas Silva", teamId: "brasil", goals: 5 },
    { name: "Thiago Messi", teamId: "argentina", goals: 4 },
    { name: "Pedro Iniesta", teamId: "espanha", goals: 3 },
    { name: "Gabriel Mbappé", teamId: "franca", goals: 3 },
    { name: "Kenji Tanaka", teamId: "japao", goals: 2 },
    { name: "Youssef Hakimi", teamId: "marrocos", goals: 2 },
  ];
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}

export function getTopAssists(category: Category): TopAssist[] {
  return [
    { name: "Lucas Silva", teamId: "brasil", assists: 4 },
    { name: "Gabriel Mbappé", teamId: "franca", assists: 3 },
    { name: "Pedro Iniesta", teamId: "espanha", assists: 3 },
    { name: "Thiago Messi", teamId: "argentina", assists: 2 },
    { name: "Kenji Tanaka", teamId: "japao", assists: 2 },
    { name: "Youssef Hakimi", teamId: "marrocos", assists: 1 },
  ];
}

export function getLeastConceded(category: Category): LeastConceded[] {
  const standings = getStandings(category);
  return standings
    .map(s => ({ teamId: s.teamId, goalsAgainst: s.goalsAgainst, matchesPlayed: s.played }))
    .sort((a, b) => a.goalsAgainst - b.goalsAgainst);
}
