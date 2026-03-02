import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const AdminMatches = () => {
  const [categoryId, setCategoryId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [round, setRound] = useState("1");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [location, setLocation] = useState("");
  const qc = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => { const { data } = await supabase.from("categories").select("*").order("display_order"); return data || []; },
  });

  const { data: teams } = useQuery({
    queryKey: ["admin-teams-list"],
    queryFn: async () => { const { data } = await supabase.from("teams").select("id, name, short_name").order("name"); return data || []; },
  });

  const { data: matches } = useQuery({
    queryKey: ["admin-matches"],
    queryFn: async () => {
      const { data } = await supabase.from("matches")
        .select("*, categories(name), home:teams!matches_home_team_id_fkey(short_name), away:teams!matches_away_team_id_fkey(short_name)")
        .order("round").order("match_date");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("matches").insert({
        category_id: categoryId, home_team_id: homeTeamId, away_team_id: awayTeamId,
        round: parseInt(round), match_date: matchDate || null, match_time: matchTime || null, location: location || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-matches"] });
      setHomeTeamId(""); setAwayTeamId(""); setMatchDate(""); setMatchTime(""); setLocation("");
      toast.success("Partida criada");
    },
    onError: () => toast.error("Erro ao criar partida"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("matches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-matches"] }); toast.success("Removida"); },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Partidas</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Nova Partida</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Mandante</Label>
                <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time Visitante</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><Label>Rodada</Label><Input type="number" value={round} onChange={e => setRound(e.target.value)} min={1} /></div>
              <div><Label>Data</Label><Input type="date" value={matchDate} onChange={e => setMatchDate(e.target.value)} /></div>
              <div><Label>Horário</Label><Input type="time" value={matchTime} onChange={e => setMatchTime(e.target.value)} /></div>
              <div><Label>Local</Label><Input value={location} onChange={e => setLocation(e.target.value)} /></div>
            </div>
            <Button type="submit" disabled={addMutation.isPending || !categoryId || !homeTeamId || !awayTeamId}>
              <Plus className="h-4 w-4 mr-1" /> Criar Partida
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoria</TableHead>
              <TableHead>Rodada</TableHead>
              <TableHead>Mandante</TableHead>
              <TableHead>Placar</TableHead>
              <TableHead>Visitante</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches?.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell>{m.categories?.name}</TableCell>
                <TableCell>{m.round}ª</TableCell>
                <TableCell className="font-medium">{m.home?.short_name}</TableCell>
                <TableCell className="text-center font-display font-bold">
                  {m.status === "finished" ? `${m.home_score} x ${m.away_score}` : "—"}
                  {m.decided_by === "penalties" && <span className="text-xs text-muted-foreground block">({m.home_penalties}x{m.away_penalties} pen)</span>}
                </TableCell>
                <TableCell className="font-medium">{m.away?.short_name}</TableCell>
                <TableCell className="text-sm">{m.match_date || "—"}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full ${m.status === "finished" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {m.status === "finished" ? "Finalizada" : "Agendada"}
                  </span>
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/admin/sumula/${m.id}`}><FileText className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminMatches;
