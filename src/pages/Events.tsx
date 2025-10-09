import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Events = () => {
  const navigate = useNavigate();
  
  const events = [
    {
      id: "1",
      title: "Final Copa América 2025",
      date: "15 Julio 2025, 20:00",
      location: "Estadio Nacional, Lima, Perú",
      image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
      availableTickets: 1500,
      minPrice: 150,
    },
    {
      id: "2",
      title: "Clásico Universitario vs Alianza",
      date: "22 Junio 2025, 18:00",
      location: "Estadio Monumental, Lima, Perú",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
      availableTickets: 800,
      minPrice: 80,
    },
    {
      id: "3",
      title: "Eliminatorias Mundial 2026",
      date: "10 Agosto 2025, 21:00",
      location: "Estadio Nacional, Lima, Perú",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop",
      availableTickets: 2000,
      minPrice: 120,
    },
    {
      id: "4",
      title: "Sporting Cristal vs Melgar",
      date: "5 Septiembre 2025, 19:00",
      location: "Estadio Alberto Gallardo, Lima, Perú",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop",
      availableTickets: 600,
      minPrice: 60,
    },
    {
      id: "5",
      title: "Clásico del Pacífico: Perú vs Chile",
      date: "20 Octubre 2025, 17:00",
      location: "Estadio Nacional, Lima, Perú",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      availableTickets: 500,
      minPrice: 200,
    },
    {
      id: "6",
      title: "Final Libertadores 2025",
      date: "25 Noviembre 2025, 20:00",
      location: "Estadio Centenario, Montevideo, Uruguay",
      image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=800&h=600&fit=crop",
      availableTickets: 3000,
      minPrice: 300,
    },
  ];

  const resaleTickets = [
    {
      id: "r1",
      eventName: "Final Copa América 2025",
      zone: "Tribuna VIP",
      originalPrice: 250,
      resalePrice: 262.5,
      sellerRating: 4.8,
      increment: "+5%",
    },
    {
      id: "r2",
      eventName: "Clásico Universitario vs Alianza",
      zone: "Platea Alta",
      originalPrice: 120,
      resalePrice: 126,
      sellerRating: 4.9,
      increment: "+5%",
    },
    {
      id: "r3",
      eventName: "Eliminatorias Mundial 2026",
      zone: "Tribuna Lateral",
      originalPrice: 125,
      resalePrice: 131.25,
      sellerRating: 5.0,
      increment: "+5%",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Eventos Disponibles</h1>
            <p className="text-muted-foreground">Descubre los próximos eventos deportivos</p>
          </div>

          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar eventos..."
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="events">Eventos Oficiales</TabsTrigger>
              <TabsTrigger value="resale">
                <RefreshCw className="mr-2 h-4 w-4" />
                Mercado de Reventa
              </TabsTrigger>
            </TabsList>

            <TabsContent value="events">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    <EventCard {...event} />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resale">
              <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in-up">
                <p className="text-sm text-foreground/80">
                  <strong>Reventa Justa:</strong> Todos los tickets están limitados a un máximo de +5% sobre el precio original.
                  Tu pago estará en custodia hasta que el Smart Contract confirme la transferencia del ticket.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resaleTickets.map((ticket, index) => (
                  <Card
                    key={ticket.id}
                    className="glass-card glow-on-hover p-6 space-y-4 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{ticket.eventName}</h3>
                        <p className="text-sm text-primary font-medium">{ticket.zone}</p>
                      </div>
                      <Badge className="bg-accent/20 text-accent">Reventa</Badge>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border/50">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Precio Original:</span>
                        <span className="line-through">${ticket.originalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Precio Reventa:</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">${ticket.resalePrice}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{ticket.increment}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <span>Revendedor verificado</span>
                        <span className="text-success">★ {ticket.sellerRating}</span>
                      </div>
                    </div>

                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => navigate(`/event/${ticket.id}`)}
                    >
                      Comprar en Reventa
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Pago protegido por Smart Contract
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
