import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const AdminSponsors = () => {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const qc = useQueryClient();

  const { data: sponsors } = useQuery({
    queryKey: ["admin-sponsors"],
    queryFn: async () => {
      const { data } = await supabase.from("sponsors").select("*").order("display_order");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("sponsors").insert({
        name, logo_url: logoUrl || null, website_url: websiteUrl || null,
        display_order: (sponsors?.length || 0),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sponsors"] });
      setName(""); setLogoUrl(""); setWebsiteUrl("");
      toast.success("Patrocinador adicionado");
    },
    onError: () => toast.error("Erro ao adicionar"),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      await supabase.from("sponsors").update({ active }).eq("id", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-sponsors"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("sponsors").delete().eq("id", id);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); toast.success("Removido"); },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Patrocinadores</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Novo Patrocinador</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Nome</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div><Label>URL do Logo</Label><Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." /></div>
              <div><Label>Website</Label><Input value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://..." /></div>
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
              <TableHead>Website</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors?.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.logo_url && <img src={s.logo_url} alt="" className="h-8 max-w-[80px] object-contain" />}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.website_url}</TableCell>
                <TableCell>
                  <Switch checked={s.active} onCheckedChange={(checked) => toggleMutation.mutate({ id: s.id, active: checked })} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(s.id)}>
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

export default AdminSponsors;
