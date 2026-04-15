import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/CategoryDetail";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Regulamento from "./pages/Regulamento";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminAthletes from "./pages/admin/AdminAthletes";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminMatchReport from "./pages/admin/AdminMatchReport";
import AdminSponsors from "./pages/admin/AdminSponsors";
import AdminSumulas from "./pages/admin/AdminSumulas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="times" element={<AdminTeams />} />
            <Route path="atletas" element={<AdminAthletes />} />
            <Route path="partidas" element={<AdminMatches />} />
            <Route path="sumulas" element={<AdminSumulas />} />
            <Route path="sumula/:matchId" element={<AdminMatchReport />} />
            <Route path="patrocinadores" element={<AdminSponsors />} />
          </Route>

          {/* Public routes */}
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1"><Index /></main>
              <Footer />
            </div>
          } />
          <Route path="/categorias" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><Categories /></main><Footer /></div>} />
          <Route path="/categorias/:name" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><CategoryDetail /></main><Footer /></div>} />
          <Route path="/times" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><Teams /></main><Footer /></div>} />
          <Route path="/times/:id" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><TeamDetail /></main><Footer /></div>} />
          <Route path="/regulamento" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><Regulamento /></main><Footer /></div>} />
          <Route path="/contato" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><Contato /></main><Footer /></div>} />
          <Route path="*" element={<div className="min-h-screen flex flex-col"><Header /><main className="flex-1"><NotFound /></main><Footer /></div>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
