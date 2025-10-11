import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Info, TrendingUp, Users, Building2, Percent, ShoppingCart, Clock, MapPin, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  getResaleOffers, 
  createResaleOffer, 
  getTickets, 
  saveTicket,
  saveTransaction
} from "@/lib/localStorage";
import { SeatSelection } from "@/components/SeatSelection";

const Resale = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [priceIncrease, setPriceIncrease] = useState([2.5]);
  const [mode, setMode] = useState<'buy' | 'sell'>('sell');
  const [resaleTicket, setResaleTicket] = useState<any>(null);
  const [showSeatSelection, setShowSeatSelection] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [userRole, setUserRole] = useState<string>('fan');
  const [availableTickets, setAvailableTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  
  // Verificar si es un organizador y cargar datos iniciales
  useEffect(() => {
    // En una aplicación real, esto vendría de un contexto de autenticación
    // Aquí simulamos la detección de un organizador con localStorage
    const storedUserRole = localStorage.getItem('userRole') || 'fan';
    setUserRole(storedUserRole);
    setIsOrganizer(storedUserRole === 'organizer');
    
    // Cargar tickets disponibles para reventa (en custodia)
    const tickets = getTickets().filter(t => t.status === "custody");
    setAvailableTickets(tickets);
    
    // Verificar si hay un ticket preseleccionado
    const preselectedTicketId = localStorage.getItem('selectedTicketForResale');
    
    if (preselectedTicketId) {
      // Buscar el ticket preseleccionado
      const preselectedTicket = tickets.find(t => t.id === preselectedTicketId);
      if (preselectedTicket) {
        setSelectedTicket(preselectedTicket);
      } else if (tickets.length > 0) {
        setSelectedTicket(tickets[0]);
      }
      
      // Limpiar el ticket preseleccionado para futuras visitas
      localStorage.removeItem('selectedTicketForResale');
    } else if (tickets.length > 0) {
      setSelectedTicket(tickets[0]);
    }
  }, []);

  // Detectar si estamos en modo compra o venta
  useEffect(() => {
    if (id) {
      setMode('buy');
      // Buscar la oferta de reventa correspondiente
      const offers = getResaleOffers();
      const ticket = offers.find(offer => offer.id === id);
      if (ticket) {
        setResaleTicket(ticket);
      } else {
        // Si no se encuentra, redirigir a la lista de eventos
        navigate('/events');
        toast({
          title: "Ticket no encontrado",
          description: "El ticket que buscas no existe o ya no está disponible",
          variant: "destructive"
        });
      }
    } else {
      setMode('sell');
    }
  }, [id, navigate, toast]);

  const defaultTicket = {
    eventName: "Final Copa América 2025",
    zone: "OCCIDENTE BAJA",
    originalPrice: 250,
    eventDate: "15 Julio 2025, 20:00",
  };

  // Ticket que se usa en cualquiera de los dos modos
  const ticketToUse = resaleTicket || defaultTicket;

  const calculatePrices = () => {
    // Determinar el precio original según el modo y los tickets disponibles
    let originalPrice;
    if (mode === 'buy') {
      originalPrice = resaleTicket?.originalPrice || defaultTicket.originalPrice;
    } else {
      originalPrice = selectedTicket ? selectedTicket.price : defaultTicket.originalPrice;
    }
    
    const resalePrice = mode === 'buy' 
      ? resaleTicket?.resalePrice 
      : originalPrice * (1 + priceIncrease[0] / 100);
      
    const sellerCommission = resalePrice * 0.05;
    const organizerCommission = resalePrice * 0.03;
    const platformCommission = resalePrice * 0.02;
    const sellerReceives = resalePrice - sellerCommission;

    return {
      originalPrice: originalPrice.toFixed(2),
      resalePrice: parseFloat(resalePrice.toString()).toFixed(2),
      sellerCommission: sellerCommission.toFixed(2),
      organizerCommission: organizerCommission.toFixed(2),
      platformCommission: platformCommission.toFixed(2),
      sellerReceives: sellerReceives.toFixed(2),
      priceIncrease: mode === 'buy' 
        ? resaleTicket?.priceIncrease.toFixed(1) 
        : priceIncrease[0].toFixed(1),
    };
  };

  const prices = calculatePrices();

  const handlePublish = () => {
    if (!selectedTicket || availableTickets.length === 0) {
      toast({
        title: "Error",
        description: "No tienes tickets disponibles para revender",
        variant: "destructive"
      });
      return;
    }

    try {
      const ticketToResell = selectedTicket;
      const originalPrice = ticketToResell.price;
      const newPrice = originalPrice * (1 + priceIncrease[0] / 100);
      
      // Crear la oferta de reventa
      const offerId = createResaleOffer(ticketToResell.id, newPrice);
      
      toast({
        title: "¡Ticket publicado!",
        description: "Tu ticket está ahora disponible en el mercado de reventa",
      });
      
      // Redirigir al dashboard del revendedor
      if (localStorage.getItem('userRole') === 'reseller') {
        setTimeout(() => navigate("/reseller"), 1500);
      } else {
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Error al publicar ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo publicar tu ticket. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };
  
  const handleBuyTicket = () => {
    toast({
      title: "¡Compra iniciada!",
      description: "Procesando tu solicitud de compra...",
    });

    try {
      if (resaleTicket && resaleTicket.id) {
        // Simular compra con la función de localStorage
        const ticketId = `resale-${resaleTicket.id}`;
        // Crear un nuevo ticket para el usuario basado en el ticket en reventa
        const newTicket: any = {
          id: ticketId,
          eventName: resaleTicket.eventName,
          eventDate: new Date().toISOString(), // Normalmente vendría del ticket original
          zone: resaleTicket.zone,
          status: "custody",
          price: parseFloat(prices.resalePrice),
          purchaseDate: new Date().toISOString(),
          seatNumbers: resaleTicket.seatNumbers || []
        };

        // Guardar el nuevo ticket
        saveTicket(newTicket);
        
        // Guardar transacción
        const transaction: any = {
          id: `tx_${Date.now()}`,
          type: "purchase" as "purchase" | "resale" | "refund",
          amount: parseFloat(prices.resalePrice) + 10, // Precio + comisión
          eventName: resaleTicket.eventName,
          status: "completed" as "pending" | "completed" | "failed",
          date: new Date().toISOString()
        };
        
        saveTransaction(transaction);
        
        // Simular que la oferta de reventa se marca como vendida
        // En un caso real, esto se haría con sellResaleTicket
        
        setTimeout(() => {
          toast({
            title: "¡Compra exitosa!",
            description: "Tu entrada ha sido agregada a tu cuenta",
          });
          navigate(`/purchase/${ticketId}`);
        }, 1500);
      } else {
        // Versión demo si no hay un ticket específico
        setTimeout(() => navigate(`/purchase/resale-demo`), 1500);
      }
    } catch (error) {
      console.error("Error al comprar ticket:", error);
      toast({
        title: "Error en la compra",
        description: "Ha ocurrido un problema con tu compra. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleShowSeatMap = () => {
    if (isOrganizer) {
      toast({
        title: "Acceso restringido",
        description: "Como organizador, no puedes ver la selección de asientos",
        variant: "destructive"
      });
      return;
    }
    
    if (mode === 'buy') {
      toast({
        title: "Asiento ya asignado",
        description: "El asiento de esta entrada ya está definido por el revendedor",
        variant: "destructive"
      });
      return;
    }
    
    setShowSeatSelection(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8 animate-fade-in-up">
            {mode === 'buy' ? (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Comprar Entrada</h1>
                <p className="text-muted-foreground">Detalles del ticket en reventa</p>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Vender Entrada</h1>
                <p className="text-muted-foreground">Configura los parámetros para revender tu entrada de manera segura</p>
              </>
            )}
          </div>
          
          {mode === 'buy' ? (
            // Modo compra
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Información del Ticket
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Evento</p>
                      <p className="font-semibold">{ticketToUse.eventName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Zona</p>
                      <p className="font-semibold">{ticketToUse.zone}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Fecha</p>
                      <p className="font-semibold">{ticketToUse.eventDate || "15 Julio 2025, 20:00"}</p>
                    </div>
                    <div className="p-4 bg-muted/10 rounded-lg border border-muted/20 mt-2">
                      <div className="flex justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Precio Original</p>
                        <p className="line-through">S/{prices.originalPrice}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Precio Reventa</p>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">S/{prices.resalePrice}</p>
                          <Badge variant="outline" className="text-xs">+{prices.priceIncrease}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Vendedor
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resaleTicket?.resellerId || "reseller"}`} />
                      <AvatarFallback>RV</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Revendedor Verificado</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="text-amber-500">★★★★☆</span>
                        <span className="ml-1">4.8 • 324 ventas</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/resellerProfile/${resaleTicket?.resellerId || 'reseller'}`)}
                  >
                    Ver perfil del vendedor
                  </Button>
                </Card>

                <Card className="glass-card p-4 border-accent/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    Información del Asiento
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zona:</span>
                      <span className="font-medium">{resaleTicket?.zone || ticketToUse.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sector:</span>
                      <span className="font-medium">{resaleTicket?.sector || "A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fila:</span>
                      <span className="font-medium">{resaleTicket?.row || "12"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asiento:</span>
                      <span className="font-medium">{resaleTicket?.seat || "15"}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground text-center">
                      <Info className="h-3 w-3 inline mr-1" />
                      Asiento específico ya asignado por el revendedor
                    </p>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-accent" />
                    Resumen de Compra
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Precio de Reventa</span>
                      <span className="font-semibold">S/{prices.resalePrice}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                      <span>Gastos de Servicio</span>
                      <span className="font-semibold">S/10.00</span>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Total a Pagar</p>
                      <p className="text-2xl font-bold text-primary">S/{(parseFloat(prices.resalePrice) + 10).toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    Garantías
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
                  </div>
                </Card>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full animate-fade-in-up" 
                  style={{ animationDelay: "0.4s" }}
                  onClick={handleBuyTicket}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Comprar Ahora
                </Button>
              </div>
            </div>
          ) : (
            // Modo venta (el original)
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Información del Ticket
                  </h3>
                  
                  {availableTickets.length > 0 ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ticket-select">Selecciona un ticket para revender:</Label>
                        <select 
                          id="ticket-select" 
                          className="w-full p-2 border rounded-md bg-background"
                          onChange={(e) => {
                            const ticket = availableTickets.find(t => t.id === e.target.value);
                            if (ticket) setSelectedTicket(ticket);
                          }}
                          value={selectedTicket?.id}
                        >
                          {availableTickets.map((ticket) => (
                            <option key={ticket.id} value={ticket.id}>
                              {ticket.eventName} - {ticket.zone}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-3 mt-4">
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Evento</p>
                          <p className="font-semibold">{selectedTicket?.eventName || ticketToUse.eventName}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Zona</p>
                          <p className="font-semibold">{selectedTicket?.zone || ticketToUse.zone}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Fecha</p>
                          <p className="font-semibold">{selectedTicket?.eventDate || ticketToUse.eventDate}</p>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mt-2">
                          <p className="text-sm text-muted-foreground">Precio Original</p>
                          <p className="text-2xl font-bold text-primary">S/{selectedTicket?.price.toFixed(2) || prices.originalPrice}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-3">No tienes tickets disponibles para revender</p>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/events')}
                      >
                        Explorar Eventos
                      </Button>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Precio de Reventa</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="flex items-center justify-between">
                        <span>Incremento de Precio</span>
                        <span className="font-bold text-primary">{priceIncrease[0].toFixed(1)}%</span>
                      </Label>
                      <Slider 
                        defaultValue={[2.5]}
                        max={5}
                        step={0.1}
                        value={priceIncrease}
                        onValueChange={setPriceIncrease}
                        className="my-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>2.5%</span>
                        <span>5%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm">Precio Final</span>
                      <span className="text-xl font-bold text-primary">S/{prices.resalePrice}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Comisiones
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Organizador (3%)</span>
                      </div>
                      <span className="font-semibold">-S/{prices.organizerCommission}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Plataforma (2%)</span>
                      </div>
                      <span className="font-semibold">-S/{prices.platformCommission}</span>
                    </div>

                    <div className="p-4 bg-success/10 rounded-lg border border-success/20 mt-4">
                      <p className="text-sm text-muted-foreground mb-1">Recibirás</p>
                      <p className="text-2xl font-bold text-success">S/{prices.sellerReceives}</p>
                    </div>
                  </div>
                </Card>

                <Card className="glass-card p-6 border-accent/20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Estado del Proceso
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-muted-foreground">Ticket verificado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-muted-foreground">Configurando reventa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted" />
                      <span className="text-muted-foreground">Transferencia atómica pendiente</span>
                    </div>
                  </div>
                </Card>

                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full animate-fade-in-up" 
                  style={{ animationDelay: "0.4s" }}
                  onClick={handlePublish}
                  disabled={availableTickets.length === 0}
                >
                  {availableTickets.length > 0 
                    ? "Publicar Reventa" 
                    : "No hay tickets disponibles"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal para selección de asientos - Solo en modo venta */}
      {showSeatSelection && mode === 'sell' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Ubicación del Asiento</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowSeatSelection(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            <SeatSelection 
              eventName={ticketToUse.eventName} 
              initialZone={ticketToUse.zone} 
              userRole={userRole as 'fan' | 'reseller' | 'organizer'}
              onlyView={true} 
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Resale;