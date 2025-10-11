import { useState, useEffect } from "react";
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
import { getAllEvents, getResaleOffers, initializeSampleResaleOffers, initializeAllEvents, forceUpdateAllData } from "@/lib/localStorage";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [resaleOffers, setResaleOffers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Inicializar todos los 15 eventos
    initializeAllEvents();
    
    // Inicializar datos de prueba de ofertas de reventa
    initializeSampleResaleOffers();
    
    loadEvents();
    loadResaleOffers();
  }, []);

  const loadEvents = () => {
    const allEvents = getAllEvents();
    // Transformar eventos para mostrar información adicional
    const eventsWithInfo = allEvents.map(event => {
      // Filtrar solo zonas con entradas disponibles para calcular el precio mínimo
      const availableZones = event.zones.filter(zone => zone.available > 0);
      
      return {
        ...event,
        availableTickets: event.zones.reduce((sum, zone) => sum + zone.available, 0),
        minPrice: availableZones.length > 0 ? 
          Math.min(...availableZones.map(zone => parseFloat(String(zone.price || 0)))) : 
          event.zones.length > 0 ? Math.min(...event.zones.map(zone => parseFloat(String(zone.price || 0)))) : 0
      };
    });
    setEvents(eventsWithInfo);
  };

  const loadResaleOffers = () => {
    const offers = getResaleOffers().filter(offer => offer.status === "active");
    const resaleTickets = offers.map(offer => ({
      id: offer.id,
      eventName: offer.eventName,
      zone: offer.zone,
      originalPrice: offer.originalPrice,
      resalePrice: offer.resalePrice,
      sellerRating: 4.8, // Por defecto
      increment: `+${offer.priceIncrease.toFixed(1)}%`,
      // Usamos un sellerId fijo para esta demo, pero en una app real vendría del usuario que creó la oferta
      sellerId: "reseller",
    }));
    setResaleOffers(resaleTickets);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResaleOffers = resaleOffers.filter(offer =>
    offer.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="mb-6 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredEvents.length} eventos disponibles
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Limpiar completamente el localStorage de GateX
                    localStorage.clear();
                    // Forzar recarga completa
                    window.location.reload();
                  }}
                  className="text-xs bg-red-50 border-red-200 hover:bg-red-100 text-red-700"
                >
                  🔄 FORZAR ACTUALIZACIÓN
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
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
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground/80">
                    <strong>Reventa Justa:</strong> Todos los tickets están limitados a un máximo de +5% sobre el precio original.
                    Tu pago estará en custodia hasta que GateX confirme la transferencia del ticket.
                  </p>

                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResaleOffers.map((ticket, index) => (
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
                        <span className="line-through">S/{ticket.originalPrice}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Precio Reventa:</span>
                        <div className="text-right">
                          <span className="text-xl font-bold text-primary">S/{ticket.resalePrice}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{ticket.increment}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/resellerProfile/${ticket.sellerId || 'reseller'}`);
                          }}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.id}`} 
                            alt="Vendedor" 
                            className="w-4 h-4 rounded-full" 
                          />
                          <span>Revendedor verificado</span>
                        </button>
                        <span className="text-success">★ {ticket.sellerRating}</span>
                      </div>
                    </div>

                    <Button 
                      variant="hero" 
                      className="w-full"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      Ver Ticket
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Pago protegido por GateX
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
