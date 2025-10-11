import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Verified,
  Star,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getResaleOffers, saveTicket, saveTransaction } from "@/lib/localStorage";

const TicketView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const offers = getResaleOffers();
      const foundTicket = offers.find(offer => offer.id === id);
      
      if (foundTicket) {
        setTicket({
          ...foundTicket,
          eventDate: "15 Julio 2025, 20:00",
          venue: "Estadio Nacional del Perú",
          location: "Lima, Perú"
        });
      } else {
        navigate('/events');
        toast({
          title: "Ticket no encontrado",
          description: "El ticket que buscas no existe o ya no está disponible",
          variant: "destructive"
        });
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleBuyTicket = () => {
    if (!ticket) return;

    try {
      // Crear el ticket comprado
      const newTicket = {
        id: `ticket_${Date.now()}`,
        eventName: ticket.eventName,
        eventDate: ticket.eventDate,
        zone: ticket.zone,
        seat: `${ticket.sector}-${ticket.row}-${ticket.seat}`,
        status: "custody" as const,
        price: ticket.resalePrice,
        purchaseDate: new Date().toISOString(),
        seatNumbers: [ticket.seat]
      };

      saveTicket(newTicket);

      // Crear la transacción
      const transaction = {
        id: `trans_${Date.now()}`,
        type: "purchase" as const,
        amount: ticket.resalePrice + 10, // Precio + comisión
        eventName: ticket.eventName,
        status: "completed" as const,
        date: new Date().toISOString()
      };

      saveTransaction(transaction);

      toast({
        title: "¡Compra exitosa!",
        description: "Tu entrada ha sido agregada a tu cuenta",
      });
      
      setTimeout(() => {
        navigate(`/purchase/${newTicket.id}`);
      }, 1500);
    } catch (error) {
      console.error("Error al comprar ticket:", error);
      toast({
        title: "Error en la compra",
        description: "Ha ocurrido un problema con tu compra. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Cargando...</div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header con botón volver */}
          <div className="mb-6 animate-fade-in-up">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">Ticket en Reventa</h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Información del Ticket */}
            <div className="md:col-span-2 space-y-6">
              {/* Ticket Principal */}
              <Card className="glass-card glow-on-hover p-8 animate-fade-in-up border-primary/20">
                <div className="text-center space-y-4">
                  <Badge className="bg-accent/20 text-accent mb-4">En Reventa</Badge>
                  
                  <h2 className="text-2xl font-bold text-primary">
                    {ticket.eventName}
                  </h2>
                  
                  <div className="space-y-3 text-lg">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>{ticket.eventDate}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{ticket.venue}</span>
                    </div>
                  </div>

                  {/* Información del Asiento */}
                  <div className="bg-primary/10 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold mb-4 text-center">Información del Asiento</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground">Zona</p>
                        <p className="font-bold text-lg">{ticket.zone}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Sector</p>
                        <p className="font-bold text-lg">{ticket.sector}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Fila</p>
                        <p className="font-bold text-lg">{ticket.row}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Asiento</p>
                        <p className="font-bold text-lg">{ticket.seat}</p>
                      </div>
                    </div>
                  </div>

                  {/* Precios */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Precio Original:</span>
                      <span className="line-through text-muted-foreground">S/{ticket.originalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Precio Reventa:</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary">S/{ticket.resalePrice}</span>
                        <Badge variant="outline" className="ml-2">+{ticket.priceIncrease}%</Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Gastos de servicio:</span>
                      <span>S/10.00</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg pt-2 border-t border-border/20">
                      <span>Total a pagar:</span>
                      <span className="text-primary">S/{(ticket.resalePrice + 10).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar - Información del vendedor y acciones */}
            <div className="space-y-6">
              {/* Información del Vendedor */}
              <Card className="glass-card p-6 animate-fade-in-up border-accent/20" style={{ animationDelay: "0.1s" }}>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.id}`} 
                      alt="Vendedor" 
                      className="w-16 h-16 rounded-full border-2 border-primary/20" 
                    />
                    <Verified className="h-5 w-5 text-primary ml-2" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold">{ticket.sellerName || "TicketsPro Lima"}</h3>
                    <Badge className="bg-primary/20 text-primary mt-1">Verificado</Badge>
                  </div>
                  
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{ticket.sellerRating || 4.8}</span>
                    <span className="text-muted-foreground">({ticket.sellerSales || 2500} ventas)</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    Lima, Perú • Miembro desde Enero 2023
                  </div>
                </div>

                {/* Estadísticas del vendedor */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-sm font-medium">5 min</div>
                    <div className="text-xs text-muted-foreground">Responde en</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">98.5%</div>
                    <div className="text-xs text-muted-foreground">Ratio de éxito</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">4.8/5</div>
                    <div className="text-xs text-muted-foreground">Valoración</div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate(`/resellerProfile/reseller`)}
                >
                  Ver Perfil Completo
                </Button>
              </Card>

              {/* Garantías */}
              <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Verified className="h-5 w-5 text-primary" />
                  Garantías GateX
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <span>Compra protegida por GateX</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <span>Devolución garantizada si el ticket no es válido</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <span>Verificación de autenticidad antes de la entrega</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <span>Soporte 24/7 durante el proceso</span>
                  </div>
                </div>
              </Card>

              {/* Botón de Compra */}
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full animate-fade-in-up" 
                style={{ animationDelay: "0.3s" }}
                onClick={handleBuyTicket}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Comprar Ahora
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Pago protegido por GateX
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TicketView;