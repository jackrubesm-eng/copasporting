import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

const AdminSponsors = () => {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [editSponsor, setEditSponsor] = useState<any>(null);
  const [eName, setEName] = useState("");
  const [eLogo, setELogo] = useState("");
  const [eWeb, setEWeb] = useState("");
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

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editSponsor) return;
      const { error } = await supabase.from("sponsors").update({
        name: eName, logo_url: eLogo || null, website_url: eWeb || null,
      }).eq("id", editSponsor.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-sponsors"] });
      setEditSponsor(null);
      toast.success("Atualizado");
    },
    onError: () => toast.error("Erro ao atualizar"),
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

  const openEdit = (s: any) => {
    setEditSponsor(s);
    setEName(s.name);
    setELogo(s.logo_url || "");
    setEWeb(s.website_url || "");
  };

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
        <div className="divide-y divide-border">
          {sponsors?.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              {s.logo_url && <img src={s.logo_url} alt="" className="h-8 w-8 rounded-full object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{s.name}</p>
                {s.website_url && <p className="text-xs text-muted-foreground truncate">{s.website_url}</p>}
              </div>
              <Switch checked={s.active} onCheckedChange={(checked) => toggleMutation.mutate({ id: s.id, active: checked })} />
              <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(s.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!editSponsor} onOpenChange={(open) => !open && setEditSponsor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Patrocinador</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); updateMutation.mutate(); }} className="space-y-4">
            <div><Label>Nome</Label><Input value={eName} onChange={e => setEName(e.target.value)} required /></div>
            <div><Label>URL do Logo</Label><Input value={eLogo} onChange={e => setELogo(e.target.value)} /></div>
            <div><Label>Website</Label><Input value={eWeb} onChange={e => setEWeb(e.target.value)} /></div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setEditSponsor(null)}>Cancelar</Button>
              <Button type="submit" disabled={updateMutation.isPending}>Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSponsors;
