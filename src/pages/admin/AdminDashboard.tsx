import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Shield, Users, Calendar, Handshake } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [cats, teams, athletes, matches, sponsors] = await Promise.all([
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("teams").select("id", { count: "exact", head: true }),
        supabase.from("athletes").select("id", { count: "exact", head: true }),
        supabase.from("matches").select("id", { count: "exact", head: true }),
        supabase.from("sponsors").select("id", { count: "exact", head: true }),
      ]);
      return {
        categories: cats.count || 0,
        teams: teams.count || 0,
        athletes: athletes.count || 0,
        matches: matches.count || 0,
        sponsors: sponsors.count || 0,
      };
    },
  });

  const cards = [
    { label: "Categorias", value: stats?.categories, icon: Trophy },
    { label: "Times", value: stats?.teams, icon: Shield },
    { label: "Atletas", value: stats?.athletes, icon: Users },
    { label: "Partidas", value: stats?.matches, icon: Calendar },
    { label: "Patrocinadores", value: stats?.sponsors, icon: Handshake },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <c.icon className="h-4 w-4" /> {c.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display font-bold">{c.value ?? "—"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
