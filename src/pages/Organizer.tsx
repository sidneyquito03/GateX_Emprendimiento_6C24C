import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Users, Lock, Plus, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Organizer = () => {
  const stats = [
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: "$45,680",
      change: "+12.5%",
      color: "text-primary",
    },
    {
      icon: Users,
      label: "Tickets Vendidos",
      value: "1,234",
      change: "+8.2%",
      color: "text-success",
    },
    {
      icon: Lock,
      label: "Fondos en Custodia",
      value: "$12,400",
      change: "Protegidos",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      label: "Comisiones Reventa",
      value: "$2,350",
      change: "+15.3%",
      color: "text-primary",
    },
  ];

  const events = [
    {
      name: "Final Copa América 2025",
      sold: 850,
      capacity: 1500,
      revenue: "$187,500",
      status: "Activo",
    },
    {
      name: "Clásico Universitario vs Alianza",
      sold: 600,
      capacity: 800,
      revenue: "$72,000",
      status: "Activo",
    },
    {
      name: "Eliminatorias Mundial 2026",
      sold: 1200,
      capacity: 2000,
      revenue: "$144,000",
      status: "Próximamente",
    },
  ];

  const resales = [
    {
      event: "Final Copa América 2025",
      zone: "Tribuna VIP",
      originalPrice: 250,
      resalePrice: 262,
      commission: 15.75,
    },
    {
      event: "Clásico Universitario vs Alianza",
      zone: "Platea Alta",
      originalPrice: 120,
      resalePrice: 126,
      commission: 7.56,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Organizador</h1>
              <p className="text-muted-foreground">Gestiona tus eventos y monitorea ventas</p>
            </div>
            <Button variant="hero" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Crear Evento
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card p-6 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs text-success font-medium">{stat.change}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </Card>
            ))}
          </div>

          {/* Events Overview */}
          <Card className="glass-card p-6 mb-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <BarChart3 className="mr-3 h-6 w-6 text-primary" />
                Mis Eventos
              </h2>
              <Button variant="outline" size="sm">Ver Todos</Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Evento</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Vendidos / Capacidad</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Ingresos</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-secondary/50 transition-colors">
                      <td className="py-4 px-4 font-medium">{event.name}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span>{event.sold} / {event.capacity}</span>
                          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-primary font-semibold">{event.revenue}</td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.status === "Activo" 
                            ? "bg-success/20 text-success" 
                            : "bg-accent/20 text-accent"
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Resales Management */}
          <Card className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-2xl font-bold mb-6">Reventas Activas</h2>
            
            <div className="space-y-4">
              {resales.map((resale, index) => (
                <div key={index} className="p-4 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">{resale.event}</h3>
                      <p className="text-sm text-muted-foreground">{resale.zone}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground line-through">${resale.originalPrice}</span>
                        <span className="text-lg font-bold text-primary">${resale.resalePrice}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tu comisión: <span className="text-success font-medium">${resale.commission}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-foreground/80">
                💡 <strong>Control de Reventa:</strong> Recibes el 3% de cada reventa realizada. 
                El sistema limita automáticamente el precio de reventa al +5% del precio original.
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Organizer;
