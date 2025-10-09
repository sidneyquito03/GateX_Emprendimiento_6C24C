import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TicketCard } from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Dashboard = () => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  
  const tickets = [
    {
      id: "1",
      eventName: "Final Copa América 2025",
      eventDate: "15 Julio 2025, 20:00",
      zone: "Tribuna VIP",
      status: "custody" as const,
      price: 250,
    },
    {
      id: "2",
      eventName: "Clásico Universitario vs Alianza",
      eventDate: "22 Junio 2025, 18:00",
      zone: "Platea Alta",
      status: "released" as const,
      price: 120,
    },
  ];

  const stats = [
    {
      icon: Wallet,
      label: "Fondos en Custodia",
      value: "$250",
      color: "text-accent",
    },
    {
      icon: CheckCircle2,
      label: "Tickets Activos",
      value: "2",
      color: "text-success",
    },
    {
      icon: TrendingUp,
      label: "Tickets Revendidos",
      value: "0",
      color: "text-primary",
    },
  ];

  const handleResell = () => {
    window.location.href = "/resale";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mi Dashboard</h1>
            <p className="text-muted-foreground">Gestiona tus tickets y reventas</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Custody Progress */}
          <Card className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h3 className="font-semibold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-accent" />
              Proceso de Custodia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Fondos en Custodia</span>
                <span className="text-primary font-medium">En progreso</span>
              </div>
              <Progress value={33} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>✓ Pago realizado</span>
                <span className="text-primary">● Evento pendiente</span>
                <span>○ Fondos liberados</span>
              </div>
            </div>
          </Card>

          {/* Tickets Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mis Tickets</h2>
              <Link to="/events">
                <Button variant="outline">
                  Explorar Más Eventos
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {tickets.map((ticket, index) => (
                <div
                  key={ticket.id}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <TicketCard
                    {...ticket}
                    onViewQR={() => setShowQR(true)}
                    onResell={handleResell}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código QR de Entrada</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-64 h-64 bg-foreground rounded-lg flex items-center justify-center mb-4">
              <div className="w-56 h-56 bg-background rounded" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Presenta este código QR en la entrada del evento
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
