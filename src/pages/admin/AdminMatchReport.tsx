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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Save, Plus, Trash2, UserPlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [eventTeamId, setEventTeamId] = useState("");
  const [eventMinute, setEventMinute] = useState("");
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

  // New athlete dialog
  const [showNewAthlete, setShowNewAthlete] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShirt, setNewShirt] = useState("");

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

  const { data: athletes, refetch: refetchAthletes } = useQuery({
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

  const teamAthletes = athletes?.filter(a => a.team_id === eventTeamId) || [];

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

  const createAthleteMutation = useMutation({
    mutationFn: async () => {
      if (!match || !eventTeamId || !newName.trim()) return;
      const { data, error } = await supabase.from("athletes").insert({
        name: newName.trim(),
        shirt_number: newShirt ? parseInt(newShirt) : null,
        team_id: eventTeamId,
        category_id: match.category_id,
      }).select("id").single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      refetchAthletes();
      if (data) setSelectedAthleteId(data.id);
      setShowNewAthlete(false);
      setNewName("");
      setNewShirt("");
      toast.success("Atleta cadastrado!");
    },
    onError: () => toast.error("Erro ao cadastrar atleta"),
  });

  const addEventMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAthleteId || !eventType) return;
      const { error } = await supabase.from("match_events").insert({
        match_id: matchId!,
        athlete_id: selectedAthleteId,
        team_id: eventTeamId,
        event_type: eventType,
        minute: eventMinute ? parseInt(eventMinute) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-match-events", matchId] });
      setEventType("");
      setSelectedAthleteId(null);
      setEventMinute("");
      toast.success("Evento registrado");
    },
    onError: () => toast.error("Erro ao registrar evento"),
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("match_events").delete().eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-match-events", matchId] }),
  });

  if (!match) return <div className="p-4">Carregando...</div>;

  const homeName = (match as any).home?.short_name || "Casa";
  const awayName = (match as any).away?.short_name || "Fora";
  const canAddEvent = eventType && eventTeamId && selectedAthleteId;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Súmula</h1>
      <p className="text-muted-foreground mb-6">{match.categories?.name} — {homeName} vs {awayName}</p>

      {/* Placar */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Placar</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{homeName}</Label><Input type="number" min={0} value={homeScore} onChange={e => setHomeScore(e.target.value)} /></div>
            <div><Label>{awayName}</Label><Input type="number" min={0} value={awayScore} onChange={e => setAwayScore(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Pênaltis ({homeName})</Label><Input type="number" min={0} value={homePen} onChange={e => setHomePen(e.target.value)} /></div>
            <div><Label>Pênaltis ({awayName})</Label><Input type="number" min={0} value={awayPen} onChange={e => setAwayPen(e.target.value)} /></div>
          </div>
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending} className="w-full">
            <Save className="h-4 w-4 mr-1" /> Salvar Placar
          </Button>
        </CardContent>
      </Card>

      {/* Registrar Evento */}
      <Card className="mb-6">
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
            <div>
              <Label>Minuto</Label>
              <Input type="number" min={0} value={eventMinute} onChange={e => setEventMinute(e.target.value)} placeholder="Ex: 15" />
            </div>
          </div>

          <div>
            <Label>Time</Label>
            <Select value={eventTeamId} onValueChange={(v) => { setEventTeamId(v); setSelectedAthleteId(null); }}>
              <SelectTrigger><SelectValue placeholder="Selecione o time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value={match.home_team_id}>{homeName}</SelectItem>
                <SelectItem value={match.away_team_id}>{awayName}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Atleta — select + botão novo */}
          {eventTeamId && (
            <div>
              <Label>Atleta</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select value={selectedAthleteId || ""} onValueChange={setSelectedAthleteId}>
                    <SelectTrigger><SelectValue placeholder="Selecione o atleta" /></SelectTrigger>
                    <SelectContent>
                      {teamAthletes.map(a => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.shirt_number ? `#${a.shirt_number} ` : ""}{a.name}
                        </SelectItem>
                      ))}
                      {teamAthletes.length === 0 && (
                        <SelectItem value="__empty" disabled>Nenhum atleta cadastrado</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="icon" className="shrink-0" onClick={() => setShowNewAthlete(true)} title="Cadastrar novo atleta">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <Button onClick={() => addEventMutation.mutate()} disabled={!canAddEvent || addEventMutation.isPending} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Adicionar Evento
          </Button>
        </CardContent>
      </Card>

      {/* Eventos */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Eventos da Partida</CardTitle></CardHeader>
        <CardContent>
          {events && events.length > 0 ? (
            <div className="space-y-2">
              {events.map((ev: any) => (
                <div key={ev.id} className="flex items-center justify-between gap-2 p-3 rounded-md border border-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-muted-foreground shrink-0 w-8 text-center">{ev.minute ? `${ev.minute}'` : "—"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {eventTypes.find(e => e.value === ev.event_type)?.label || ev.event_type}{" "}
                        <span className="font-normal text-muted-foreground">— {ev.teams?.short_name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        #{ev.athletes?.shirt_number} {ev.athletes?.name}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => deleteEventMutation.mutate(ev.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">Nenhum evento registrado</p>
          )}
        </CardContent>
      </Card>

      {/* Dialog para cadastrar novo atleta */}
      <Dialog open={showNewAthlete} onOpenChange={setShowNewAthlete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Atleta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nome</Label>
              <Input placeholder="Nome completo" value={newName} onChange={e => setNewName(e.target.value)} />
            </div>
            <div>
              <Label>Nº Camisa (opcional)</Label>
              <Input type="number" min={0} placeholder="Ex: 10" value={newShirt} onChange={e => setNewShirt(e.target.value)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Time: {eventTeamId === match.home_team_id ? homeName : awayName} · Categoria: {match.categories?.name}
            </p>
            <Button onClick={() => createAthleteMutation.mutate()} disabled={!newName.trim() || createAthleteMutation.isPending} className="w-full">
              <UserPlus className="h-4 w-4 mr-1" /> Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMatchReport;
