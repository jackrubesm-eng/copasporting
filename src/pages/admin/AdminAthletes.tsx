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
import { Plus, Trash2 } from "lucide-react";

const AdminAthletes = () => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [teamId, setTeamId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [position, setPosition] = useState("");
  const qc = useQueryClient();

  const { data: teams } = useQuery({
    queryKey: ["admin-teams-list"],
    queryFn: async () => { const { data } = await supabase.from("teams").select("id, name, short_name").order("name"); return data || []; },
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => { const { data } = await supabase.from("categories").select("*").order("display_order"); return data || []; },
  });

  const { data: athletes } = useQuery({
    queryKey: ["admin-athletes"],
    queryFn: async () => {
      const { data } = await supabase.from("athletes").select("*, teams(short_name), categories(name)").order("name");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("athletes").insert({
        name, birth_date: birthDate || null, document_number: docNumber || null,
        team_id: teamId, category_id: categoryId,
        shirt_number: shirtNumber ? parseInt(shirtNumber) : null,
        position: position || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-athletes"] });
      setName(""); setBirthDate(""); setDocNumber(""); setShirtNumber(""); setPosition("");
      toast.success("Atleta adicionado");
    },
    onError: () => toast.error("Erro ao adicionar atleta"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("athletes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-athletes"] }); toast.success("Removido"); },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Atletas</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Novo Atleta</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Nome Completo</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div><Label>Data de Nascimento</Label><Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} /></div>
              <div><Label>Documento (CPF/RG)</Label><Input value={docNumber} onChange={e => setDocNumber(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Time</Label>
                <Select value={teamId} onValueChange={setTeamId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Nº Camisa</Label><Input type="number" value={shirtNumber} onChange={e => setShirtNumber(e.target.value)} /></div>
              <div><Label>Posição</Label><Input value={position} onChange={e => setPosition(e.target.value)} placeholder="Goleiro, Fixo..." /></div>
            </div>
            <Button type="submit" disabled={addMutation.isPending || !teamId || !categoryId}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Nº</TableHead>
              <TableHead>Posição</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athletes?.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.name}</TableCell>
                <TableCell>{a.teams?.short_name}</TableCell>
                <TableCell>{a.categories?.name}</TableCell>
                <TableCell>{a.shirt_number}</TableCell>
                <TableCell>{a.position}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(a.id)}>
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

export default AdminAthletes;
