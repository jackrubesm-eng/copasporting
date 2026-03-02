import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";

const eventTypes = [
  { value: "goal", label: "⚽ Gol" },
  { value: "assist", label: "🅰️ Assistência" },
  { value: "yellow_card", label: "🟨 Cartão Amarelo" },
  { value: "red_card", label: "🟥 Cartão Vermelho" },
];

const AdminMatchReport = () => {
  const { matchId } = useParams();
  const qc = useQueryClient();

  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [homePen, setHomePen] = useState("");
  const [awayPen, setAwayPen] = useState("");

  const [eventType, setEventType] = useState("");
  const [eventAthleteId, setEventAthleteId] = useState("");
  const [eventTeamId, setEventTeamId] = useState("");
  const [eventMinute, setEventMinute] = useState("");

  const { data: match } = useQuery({
    queryKey: ["admin-match", matchId],
    queryFn: async () => {
      const { data } = await supabase.from("matches")
        .select("*, categories(name), home:teams!matches_home_team_id_fkey(id, short_name), away:teams!matches_away_team_id_fkey(id, short_name)")
        .eq("id", matchId!).single();
      if (data) {
        setHomeScore(data.home_score?.toString() || "");
        setAwayScore(data.away_score?.toString() || "");
        setHomePen(data.home_penalties?.toString() || "");
        setAwayPen(data.away_penalties?.toString() || "");
      }
      return data;
    },
  });

  const { data: athletes } = useQuery({
    queryKey: ["admin-match-athletes", match?.home_team_id, match?.away_team_id, match?.category_id],
    enabled: !!match,
    queryFn: async () => {
      const { data } = await supabase.from("athletes")
        .select("id, name, shirt_number, team_id, teams(short_name)")
        .in("team_id", [match!.home_team_id, match!.away_team_id])
        .eq("category_id", match!.category_id)
        .order("name");
      return data || [];
    },
  });

  const { data: events } = useQuery({
    queryKey: ["admin-match-events", matchId],
    queryFn: async () => {
      const { data } = await supabase.from("match_events")
        .select("*, athletes(name, shirt_number), teams(short_name)")
        .eq("match_id", matchId!)
        .order("minute");
      return data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const hs = homeScore ? parseInt(homeScore) : null;
      const as_ = awayScore ? parseInt(awayScore) : null;
      const hp = homePen ? parseInt(homePen) : null;
      const ap = awayPen ? parseInt(awayPen) : null;
      const status = hs !== null && as_ !== null ? "finished" : "scheduled";
      const decidedBy = hp !== null && ap !== null ? "penalties" : (status === "finished" ? "normal" : null);
      const { error } = await supabase.from("matches").update({
        home_score: hs, away_score: as_, home_penalties: hp, away_penalties: ap, status, decided_by: decidedBy,
      }).eq("id", matchId!);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-match", matchId] }); toast.success("Súmula salva"); },
    onError: () => toast.error("Erro ao salvar"),
  });

  const addEventMutation = useMutation({
    mutationFn: async () => {
      const athlete = athletes?.find(a => a.id === eventAthleteId);
      const { error } = await supabase.from("match_events").insert({
        match_id: matchId!, athlete_id: eventAthleteId, team_id: athlete?.team_id || eventTeamId,
        event_type: eventType, minute: eventMinute ? parseInt(eventMinute) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-match-events", matchId] });
      setEventType(""); setEventAthleteId(""); setEventMinute("");
      toast.success("Evento registrado");
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("match_events").delete().eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-match-events", matchId] }),
  });

  if (!match) return <div>Carregando...</div>;

  const homeAthletes = athletes?.filter(a => a.team_id === match.home_team_id) || [];
  const awayAthletes = athletes?.filter(a => a.team_id === match.away_team_id) || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Súmula</h1>
      <p className="text-muted-foreground mb-6">{match.categories?.name} — {(match as any).home?.short_name} vs {(match as any).away?.short_name}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Placar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>{(match as any).home?.short_name}</Label><Input type="number" min={0} value={homeScore} onChange={e => setHomeScore(e.target.value)} /></div>
              <div><Label>{(match as any).away?.short_name}</Label><Input type="number" min={0} value={awayScore} onChange={e => setAwayScore(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Pênaltis (M)</Label><Input type="number" min={0} value={homePen} onChange={e => setHomePen(e.target.value)} /></div>
              <div><Label>Pênaltis (V)</Label><Input type="number" min={0} value={awayPen} onChange={e => setAwayPen(e.target.value)} /></div>
            </div>
            <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
              <Save className="h-4 w-4 mr-1" /> Salvar Placar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Registrar Evento</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{eventTypes.map(e => <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Minuto</Label><Input type="number" min={0} value={eventMinute} onChange={e => setEventMinute(e.target.value)} /></div>
            </div>
            <div>
              <Label>Atleta</Label>
              <Select value={eventAthleteId} onValueChange={setEventAthleteId}>
                <SelectTrigger><SelectValue placeholder="Selecione o atleta" /></SelectTrigger>
                <SelectContent>
                  {homeAthletes.length > 0 && (
                    <>
                      <SelectItem value="__home_header" disabled>{(match as any).home?.short_name}</SelectItem>
                      {homeAthletes.map(a => <SelectItem key={a.id} value={a.id}>#{a.shirt_number} {a.name}</SelectItem>)}
                    </>
                  )}
                  {awayAthletes.length > 0 && (
                    <>
                      <SelectItem value="__away_header" disabled>{(match as any).away?.short_name}</SelectItem>
                      {awayAthletes.map(a => <SelectItem key={a.id} value={a.id}>#{a.shirt_number} {a.name}</SelectItem>)}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => addEventMutation.mutate()} disabled={!eventType || !eventAthleteId}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Eventos da Partida</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Min</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Atleta</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-16">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events?.map((ev: any) => (
                <TableRow key={ev.id}>
                  <TableCell>{ev.minute ? `${ev.minute}'` : "—"}</TableCell>
                  <TableCell>{eventTypes.find(e => e.value === ev.event_type)?.label || ev.event_type}</TableCell>
                  <TableCell>#{ev.athletes?.shirt_number} {ev.athletes?.name}</TableCell>
                  <TableCell>{ev.teams?.short_name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteEventMutation.mutate(ev.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!events || events.length === 0) && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum evento registrado</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchReport;
