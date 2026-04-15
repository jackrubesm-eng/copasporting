import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const AdminSumulas = () => {
  const { data: matches } = useQuery({
    queryKey: ["admin-sumulas-matches"],
    queryFn: async () => {
      const { data } = await supabase.from("matches")
        .select("*, categories(name), home:teams!matches_home_team_id_fkey(short_name), away:teams!matches_away_team_id_fkey(short_name)")
        .order("match_date", { ascending: false, nullsFirst: false });
      return data || [];
    },
  });

  const { data: eventCounts } = useQuery({
    queryKey: ["admin-sumulas-event-counts"],
    queryFn: async () => {
      const { data } = await supabase.from("match_events").select("match_id");
      const counts: Record<string, number> = {};
      data?.forEach(e => { counts[e.match_id] = (counts[e.match_id] || 0) + 1; });
      return counts;
    },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-4">Súmulas</h1>
      <p className="text-muted-foreground text-sm mb-6">Selecione uma partida para preencher a súmula</p>

      <div className="space-y-3">
        {matches?.map((m: any) => {
          const hasScore = m.home_score !== null && m.away_score !== null;
          const evCount = eventCounts?.[m.id] || 0;
          return (
            <Link key={m.id} to={`/admin/sumula/${m.id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] shrink-0">{m.categories?.name}</Badge>
                        <span className="text-[10px] text-muted-foreground">Rodada {m.round}</span>
                      </div>
                      <p className="font-display font-bold text-sm truncate">
                        {m.home?.short_name} {hasScore ? `${m.home_score} x ${m.away_score}` : "vs"} {m.away?.short_name}
                      </p>
                      {m.match_date && (
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(m.match_date + "T12:00:00").toLocaleDateString("pt-BR")}
                          {m.match_time && ` às ${m.match_time.slice(0, 5)}`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      {evCount > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{evCount} eventos</Badge>
                      )}
                      {hasScore && (
                        <Badge className="text-[10px] bg-primary/20 text-primary border-0">Preenchida</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {(!matches || matches.length === 0) && (
          <p className="text-center text-muted-foreground py-8">Nenhuma partida cadastrada</p>
        )}
      </div>
    </div>
  );
};

export default AdminSumulas;
