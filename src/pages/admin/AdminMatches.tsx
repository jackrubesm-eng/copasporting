import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const AdminMatches = () => {
  const [categoryId, setCategoryId] = useState("");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [round, setRound] = useState("1");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [location, setLocation] = useState("");
  const [editMatch, setEditMatch] = useState<any>(null);
  const [eCat, setECat] = useState("");
  const [eHome, setEHome] = useState("");
  const [eAway, setEAway] = useState("");
  const [eRound, setERound] = useState("");
  const [eDate, setEDate] = useState("");
  const [eTime, setETime] = useState("");
  const [eLoc, setELoc] = useState("");
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editMatch) return;
      const { error } = await supabase.from("matches").update({
        category_id: eCat, home_team_id: eHome, away_team_id: eAway,
        round: parseInt(eRound), match_date: eDate || null, match_time: eTime || null, location: eLoc || null,
      }).eq("id", editMatch.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-matches"] });
      setEditMatch(null);
      toast.success("Partida atualizada");
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("matches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-matches"] }); toast.success("Removida"); },
  });

  const openEdit = (m: any) => {
    setEditMatch(m);
    setECat(m.category_id);
    setEHome(m.home_team_id);
    setEAway(m.away_team_id);
    setERound(m.round?.toString() || "1");
    setEDate(m.match_date || "");
    setETime(m.match_time || "");
    setELoc(m.location || "");
  };

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
                <Label>Mandante</Label>
                <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Visitante</Label>
                <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="divide-y divide-border">
          {matches?.map((m: any) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {m.home?.short_name} {m.status === "finished" ? `${m.home_score} x ${m.away_score}` : "vs"} {m.away?.short_name}
                  {m.decided_by === "penalties" && <span className="text-xs text-muted-foreground ml-1">({m.home_penalties}x{m.away_penalties} pen)</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {m.categories?.name} • {m.round}ª rodada {m.match_date ? `• ${m.match_date}` : ""} •{" "}
                  <span className={m.status === "finished" ? "text-primary" : ""}>{m.status === "finished" ? "Finalizada" : "Agendada"}</span>
                </p>
              </div>
              <Button size="icon" variant="ghost" asChild>
                <Link to={`/admin/sumula/${m.id}`}><FileText className="h-4 w-4" /></Link>
              </Button>
              <Button size="icon" variant="ghost" onClick={() => openEdit(m)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(m.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!editMatch} onOpenChange={(open) => !open && setEditMatch(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Partida</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); updateMutation.mutate(); }} className="space-y-4">
            <div>
              <Label>Categoria</Label>
              <Select value={eCat} onValueChange={setECat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mandante</Label>
                <Select value={eHome} onValueChange={setEHome}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Visitante</Label>
                <Select value={eAway} onValueChange={setEAway}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Rodada</Label><Input type="number" value={eRound} onChange={e => setERound(e.target.value)} min={1} /></div>
              <div><Label>Local</Label><Input value={eLoc} onChange={e => setELoc(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Data</Label><Input type="date" value={eDate} onChange={e => setEDate(e.target.value)} /></div>
              <div><Label>Horário</Label><Input type="time" value={eTime} onChange={e => setETime(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setEditMatch(null)}>Cancelar</Button>
              <Button type="submit" disabled={updateMutation.isPending}>Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMatches;
