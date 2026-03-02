import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const AdminTeams = () => {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const qc = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("display_order");
      return data || [];
    },
  });

  const { data: teams } = useQuery({
    queryKey: ["admin-teams"],
    queryFn: async () => {
      const { data: teamsData } = await supabase.from("teams").select("*").order("name");
      const { data: tcData } = await supabase.from("team_categories").select("*, categories(name)");
      return (teamsData || []).map(t => ({
        ...t,
        categories: (tcData || []).filter(tc => tc.team_id === t.id).map((tc: any) => tc.categories?.name).filter(Boolean),
      }));
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { data: team, error } = await supabase.from("teams").insert({ name, short_name: shortName, logo_url: logoUrl || null }).select().single();
      if (error) throw error;
      if (selectedCats.length > 0) {
        await supabase.from("team_categories").insert(selectedCats.map(cid => ({ team_id: team.id, category_id: cid })));
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-teams"] });
      setName(""); setShortName(""); setLogoUrl(""); setSelectedCats([]);
      toast.success("Time adicionado");
    },
    onError: () => toast.error("Erro ao adicionar time"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("teams").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-teams"] }); toast.success("Removido"); },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Times</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Novo Time</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Nome</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div><Label>Nome Curto</Label><Input value={shortName} onChange={e => setShortName(e.target.value)} required /></div>
              <div><Label>URL do Logo</Label><Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." /></div>
            </div>
            <div>
              <Label className="mb-2 block">Categorias</Label>
              <div className="flex flex-wrap gap-3">
                {categories?.map(cat => (
                  <label key={cat.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selectedCats.includes(cat.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCats(prev => checked ? [...prev, cat.id] : prev.filter(id => id !== cat.id));
                      }}
                    />
                    {cat.name}
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={addMutation.isPending}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Abreviação</TableHead>
              <TableHead>Categorias</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams?.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.logo_url && <img src={team.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />}</TableCell>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.short_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{team.categories.join(", ")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(team.id)}>
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

export default AdminTeams;
