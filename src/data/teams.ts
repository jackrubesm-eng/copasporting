import logoGBRestinga from "@/assets/escudo-gb-restinga.jpeg";
import logoSantosPoa from "@/assets/escudo-santos-poa.jpeg";
import logoSuperDez from "@/assets/escudo-super-dez.jpeg";
import logoBateBola from "@/assets/escudo-bate-bola.jpeg";
import logoAABB from "@/assets/escudo-aabb.jpeg";
import logoSporting42 from "@/assets/escudo-sporting42.jpeg";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  categories: string[];
}

export const categories = ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] as const;
export type Category = typeof categories[number];

export const teams: Team[] = [
  { id: "gb-restinga", name: "Escola de Futebol GB Restinga", shortName: "GB Restinga", logo: logoGBRestinga, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
  { id: "santos-poa", name: "Santos POA-RS", shortName: "Santos POA", logo: logoSantosPoa, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
  { id: "super-dez", name: "Escola de Futebol Super Dez", shortName: "Super Dez", logo: logoSuperDez, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
  { id: "bate-bola", name: "Bate Bola Escolinha Futebol Society", shortName: "Bate Bola", logo: logoBateBola, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
  { id: "aabb", name: "AABB Porto Alegre", shortName: "AABB", logo: logoAABB, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
  { id: "sporting42", name: "Sporting 42 Valores & Futebol", shortName: "Sporting 42", logo: logoSporting42, categories: ["Sub 7", "Sub 9", "Sub 11", "Sub 13", "Sub 15"] },
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

// Mock data for demo
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
    { id: "1", category, homeTeamId: "gb-restinga", awayTeamId: "santos-poa", homeScore: 3, awayScore: 1, homePenalties: null, awayPenalties: null, status: "finished", decidedBy: "normal", round: 1, date: "2026-03-15" },
    { id: "2", category, homeTeamId: "super-dez", awayTeamId: "bate-bola", homeScore: 2, awayScore: 2, homePenalties: 3, awayPenalties: 1, status: "finished", decidedBy: "penalties", round: 1, date: "2026-03-15" },
    { id: "3", category, homeTeamId: "aabb", awayTeamId: "sporting42", homeScore: 1, awayScore: 0, homePenalties: null, awayPenalties: null, status: "finished", decidedBy: "normal", round: 1, date: "2026-03-16" },
    { id: "4", category, homeTeamId: "santos-poa", awayTeamId: "super-dez", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
    { id: "5", category, homeTeamId: "bate-bola", awayTeamId: "aabb", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
    { id: "6", category, homeTeamId: "sporting42", awayTeamId: "gb-restinga", homeScore: null, awayScore: null, homePenalties: null, awayPenalties: null, status: "scheduled", decidedBy: null, round: 2, date: null },
  ];
}

export function getTopScorers(category: Category): TopScorer[] {
  return [
    { name: "Lucas Silva", teamId: "gb-restinga", goals: 5 },
    { name: "Pedro Henrique", teamId: "santos-poa", goals: 4 },
    { name: "Gabriel Santos", teamId: "super-dez", goals: 3 },
    { name: "Matheus Oliveira", teamId: "aabb", goals: 3 },
    { name: "João Victor", teamId: "bate-bola", goals: 2 },
    { name: "Arthur Costa", teamId: "sporting42", goals: 2 },
  ];
}

export function getTeamById(id: string): Team | undefined {
  return teams.find(t => t.id === id);
}
