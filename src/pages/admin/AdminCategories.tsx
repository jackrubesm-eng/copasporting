import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

const AdminCategories = () => {
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const qc = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("display_order");
      return data || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("categories").insert({ name, display_order: (categories?.length || 0) });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setName(""); toast.success("Categoria adicionada"); },
    onError: () => toast.error("Erro ao adicionar categoria"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase.from("categories").update({ name }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); setEditId(null); toast.success("Atualizada"); },
    onError: () => toast.error("Erro ao atualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Removida"); },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Categorias</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-lg">Nova Categoria</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); addMutation.mutate(); }} className="flex gap-3">
            <Input placeholder="Ex: Sub 7" value={name} onChange={e => setName(e.target.value)} required />
            <Button type="submit" disabled={addMutation.isPending}><Plus className="h-4 w-4 mr-1" /> Adicionar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <div className="divide-y divide-border">
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
              {editId === cat.id ? (
                <>
                  <Input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1" autoFocus />
                  <Button size="icon" variant="ghost" onClick={() => updateMutation.mutate({ id: cat.id, name: editName })} disabled={updateMutation.isPending}>
                    <Check className="h-4 w-4 text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditId(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <Button size="icon" variant="ghost" onClick={() => { setEditId(cat.id); setEditName(cat.name); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(cat.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminCategories;
