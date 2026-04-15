import { useState, useMemo } from "react";
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
import { Save, Plus, Trash2, UserPlus } from "lucide-react";

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
  const [athleteSearch, setAthleteSearch] = useState("");
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Filter athletes based on search and selected team
  const filteredAthletes = useMemo(() => {
    if (!athletes || !athleteSearch.trim()) return [];
    const search = athleteSearch.toLowerCase().trim();
    return athletes.filter(a => {
      const matchesName = a.name.toLowerCase().includes(search);
      const matchesTeam = !eventTeamId || a.team_id === eventTeamId;
      return matchesName && matchesTeam;
    });
  }, [athletes, athleteSearch, eventTeamId]);

  const exactMatch = useMemo(() => {
    if (!athletes || !athleteSearch.trim()) return null;
    return athletes.find(a => a.name.toLowerCase() === athleteSearch.toLowerCase().trim() && (!eventTeamId || a.team_id === eventTeamId));
  }, [athletes, athleteSearch, eventTeamId]);

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

  // Create athlete on the fly and then add the event
  const createAthleteAndAddEvent = async () => {
    if (!match || !eventTeamId || !athleteSearch.trim() || !eventType) return;

    let athleteId = selectedAthleteId;

    // If no athlete selected, create a new one
    if (!athleteId) {
      const { data: newAthlete, error: createError } = await supabase.from("athletes").insert({
        name: athleteSearch.trim(),
        team_id: eventTeamId,
        category_id: match.category_id,
      }).select("id").single();

      if (createError) {
        toast.error("Erro ao cadastrar atleta");
        return;
      }
      athleteId = newAthlete.id;
      toast.success(`Atleta "${athleteSearch.trim()}" cadastrado automaticamente!`);
      refetchAthletes();
    }

    // Now add the event
    const { error } = await supabase.from("match_events").insert({
      match_id: matchId!,
      athlete_id: athleteId,
      team_id: eventTeamId,
      event_type: eventType,
      minute: eventMinute ? parseInt(eventMinute) : null,
    });

    if (error) {
      toast.error("Erro ao registrar evento");
      return;
    }

    qc.invalidateQueries({ queryKey: ["admin-match-events", matchId] });
    setEventType("");
    setAthleteSearch("");
    setSelectedAthleteId(null);
    setEventMinute("");
    setEventTeamId("");
    toast.success("Evento registrado");
  };

  const addEventMutation = useMutation({
    mutationFn: createAthleteAndAddEvent,
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

  const canAddEvent = eventType && eventTeamId && athleteSearch.trim();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Súmula</h1>
      <p className="text-muted-foreground mb-6">{match.categories?.name} — {homeName} vs {awayName}</p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
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
              <div>
                <Label>Time</Label>
                <Select value={eventTeamId} onValueChange={(v) => { setEventTeamId(v); setSelectedAthleteId(null); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={match.home_team_id}>{homeName}</SelectItem>
                    <SelectItem value={match.away_team_id}>{awayName}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="relative">
              <Label>Atleta (digite o nome)</Label>
              <Input
                placeholder="Ex: Fernando Monteiro"
                value={athleteSearch}
                onChange={(e) => {
                  setAthleteSearch(e.target.value);
                  setSelectedAthleteId(null);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              {showSuggestions && athleteSearch.trim() && filteredAthletes.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredAthletes.map(a => (
                    <button
                      key={a.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setAthleteSearch(a.name);
                        setSelectedAthleteId(a.id);
                        if (!eventTeamId) setEventTeamId(a.team_id);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="font-medium">#{a.shirt_number} {a.name}</span>
                      <span className="text-muted-foreground ml-2">({(a as any).teams?.short_name})</span>
                    </button>
                  ))}
                </div>
              )}
              {athleteSearch.trim() && !selectedAthleteId && !exactMatch && eventTeamId && (
                <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                  <UserPlus className="h-3 w-3" />
                  Atleta será cadastrado automaticamente
                </p>
              )}
              {selectedAthleteId && (
                <p className="text-xs text-emerald-500 mt-1">✓ Atleta já cadastrado</p>
              )}
            </div>

            <div>
              <Label>Minuto (opcional)</Label>
              <Input type="number" min={0} value={eventMinute} onChange={e => setEventMinute(e.target.value)} placeholder="Ex: 15" />
            </div>

            <Button onClick={() => addEventMutation.mutate()} disabled={!canAddEvent || addEventMutation.isPending} className="w-full">
              <Plus className="h-4 w-4 mr-1" /> Adicionar Evento
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
