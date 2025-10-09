import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Simbiosis from "./pages/Simbiosis";
import Organizer from "./pages/Organizer";
import Resale from "./pages/Resale";
import ResellerDashboard from "./pages/ResellerDashboard";
import Settings from "./pages/Settings";
import RoleSelection from "./pages/RoleSelection";
import CreateEvent from "./pages/CreateEvent";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/simbiosis" element={<Simbiosis />} />
          <Route path="/organizer" element={<Organizer />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/resale" element={<Resale />} />
          <Route path="/reseller" element={<ResellerDashboard />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
