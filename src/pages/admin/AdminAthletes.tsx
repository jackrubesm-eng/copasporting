import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Upload } from "lucide-react";

const uploadPhoto = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `athletes/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from("logos").getPublicUrl(path);
  return data.publicUrl;
};

const AdminAthletes = () => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [teamId, setTeamId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shirtNumber, setShirtNumber] = useState("");
  const [position, setPosition] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editAthlete, setEditAthlete] = useState<any>(null);
  const [eName, setEName] = useState("");
  const [eBirth, setEBirth] = useState("");
  const [eDoc, setEDoc] = useState("");
  const [eTeam, setETeam] = useState("");
  const [eCat, setECat] = useState("");
  const [eShirt, setEShirt] = useState("");
  const [ePos, setEPos] = useState("");
  const [ePhoto, setEPhoto] = useState("");
  const [eUploading, setEUploading] = useState(false);
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

  const handlePhoto = async (file: File | undefined, isEdit = false) => {
    if (!file) return;
    try {
      isEdit ? setEUploading(true) : setUploading(true);
      const url = await uploadPhoto(file);
      isEdit ? setEPhoto(url) : setPhotoUrl(url);
      toast.success("Foto enviada");
    } catch {
      toast.error("Erro no upload");
    } finally {
      isEdit ? setEUploading(false) : setUploading(false);
    }
  };

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("athletes").insert({
        name, birth_date: birthDate || null, document_number: docNumber || null,
        team_id: teamId, category_id: categoryId,
        shirt_number: shirtNumber ? parseInt(shirtNumber) : null,
        position: position || null,
        photo_url: photoUrl || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-athletes"] });
      setName(""); setBirthDate(""); setDocNumber(""); setShirtNumber(""); setPosition(""); setPhotoUrl("");
      toast.success("Atleta adicionado");
    },
    onError: () => toast.error("Erro ao adicionar atleta"),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editAthlete) return;
      const { error } = await supabase.from("athletes").update({
        name: eName, birth_date: eBirth || null, document_number: eDoc || null,
        team_id: eTeam, category_id: eCat,
        shirt_number: eShirt ? parseInt(eShirt) : null,
        position: ePos || null,
        photo_url: ePhoto || null,
      }).eq("id", editAthlete.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-athletes"] });
      setEditAthlete(null);
      toast.success("Atleta atualizado");
    },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("athletes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-athletes"] }); toast.success("Removido"); },
  });

  const openEdit = (a: any) => {
    setEditAthlete(a);
    setEName(a.name);
    setEBirth(a.birth_date || "");
    setEDoc(a.document_number || "");
    setETeam(a.team_id);
    setECat(a.category_id);
    setEShirt(a.shirt_number?.toString() || "");
    setEPos(a.position || "");
    setEPhoto(a.photo_url || "");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Atletas</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Novo Atleta</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={photoUrl} />
                <AvatarFallback>{name.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-new" className="cursor-pointer inline-flex items-center gap-2 text-sm bg-muted hover:bg-muted/80 px-3 py-2 rounded-md">
                  <Upload className="h-4 w-4" /> {uploading ? "Enviando..." : "Foto do atleta"}
                </Label>
                <input id="photo-new" type="file" accept="image/*" className="hidden" onChange={e => handlePhoto(e.target.files?.[0])} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>Nome Completo</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div><Label>Data de Nascimento</Label><Input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} /></div>
              <div><Label>Documento (CPF/RG)</Label><Input value={docNumber} onChange={e => setDocNumber(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <div className="divide-y divide-border">
          {athletes?.map((a: any) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={a.photo_url || undefined} />
                <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{a.name} {a.shirt_number ? `#${a.shirt_number}` : ""}</p>
                <p className="text-xs text-muted-foreground">{a.teams?.short_name} • {a.categories?.name} {a.position ? `• ${a.position}` : ""}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => openEdit(a)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(a.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={!!editAthlete} onOpenChange={(open) => !open && setEditAthlete(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Atleta</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); updateMutation.mutate(); }} className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={ePhoto} />
                <AvatarFallback>{eName.charAt(0).toUpperCase() || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="photo-edit" className="cursor-pointer inline-flex items-center gap-2 text-sm bg-muted hover:bg-muted/80 px-3 py-2 rounded-md">
                  <Upload className="h-4 w-4" /> {eUploading ? "Enviando..." : "Trocar foto"}
                </Label>
                <input id="photo-edit" type="file" accept="image/*" className="hidden" onChange={e => handlePhoto(e.target.files?.[0], true)} />
              </div>
            </div>
            <div><Label>Nome</Label><Input value={eName} onChange={e => setEName(e.target.value)} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nascimento</Label><Input type="date" value={eBirth} onChange={e => setEBirth(e.target.value)} /></div>
              <div><Label>Documento</Label><Input value={eDoc} onChange={e => setEDoc(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Time</Label>
                <Select value={eTeam} onValueChange={setETeam}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{teams?.map(t => <SelectItem key={t.id} value={t.id}>{t.short_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Categoria</Label>
                <Select value={eCat} onValueChange={setECat}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nº Camisa</Label><Input type="number" value={eShirt} onChange={e => setEShirt(e.target.value)} /></div>
              <div><Label>Posição</Label><Input value={ePos} onChange={e => setEPos(e.target.value)} /></div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" type="button" onClick={() => setEditAthlete(null)}>Cancelar</Button>
              <Button type="submit" disabled={updateMutation.isPending}>Salvar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAthletes;
