import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Package, Plus, Info, BarChart3, Users, Settings, Zap, Target, Globe, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { TransactionStatus } from "@/components/TransactionStatus";
import { PaymentMethodsModal } from "@/components/PaymentMethodsModal";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  getTickets, 
  getResaleOffers, 
  createResaleOffer, 
  getUserStats, 
  sellResaleTicket, 
  cancelResaleOffer, 
  getUserBalance,
  updateResaleOffer
} from "@/lib/localStorage";

const ResellerDashboard = () => {
  const { toast } = useToast();
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showEditPrice, setShowEditPrice] = useState(false);
  const [showInterested, setShowInterested] = useState(false);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceIncrease, setPriceIncrease] = useState([2.5]);
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [availableTickets, setAvailableTickets] = useState<any[]>([]);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Cargar tickets disponibles para reventa (en custodia)
    const tickets = getTickets().filter(t => t.status === "custody");
    setAvailableTickets(tickets);
    
    // Cargar ofertas activas - agregar datos de ejemplo si no hay
    let offers = getResaleOffers().filter(o => o.status === "active");
    
    // Si no hay ofertas, agregar ejemplos para demostración
    if (offers.length === 0) {
      offers = [
        {
          id: "rev_001",
          ticketId: "ticket_001",
          eventName: "Universitario vs Sporting Cristal",
          zone: "Tribuna Norte - Fila 15",
          originalPrice: 85,
          resalePrice: 89.25,
          priceIncrease: 5.0,
          status: "active" as const,
          listedDate: new Date().toISOString()
        },
        {
          id: "rev_002",
          ticketId: "ticket_002", 
          eventName: "Alianza Lima vs Sport Boys",
          zone: "Occidente Alta - Fila 8",
          originalPrice: 120,
          resalePrice: 126,
          priceIncrease: 5.0,
          status: "active" as const,
          listedDate: new Date().toISOString()
        }
      ];
    }
    
    setActiveOffers(offers);
    
    // Cargar estadísticas
    const stats = getUserStats();
    setUserStats(stats);
  };

  // Función para vender directamente
  const handleSellOffer = (offerId: string) => {
    const success = sellResaleTicket(offerId);

    if (success) {
      toast({
        title: "¡Venta exitosa!",
        description: "El saldo ha sido agregado a tu cuenta.",
        variant: "default", // Cambiado a un valor permitido
      });
      loadData();
    } else {
      toast({
        title: "Error al vender",
        description: "No se pudo completar la venta. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Función para cancelar oferta
  const handleCancelOffer = (offerId: string) => {
    const success = cancelResaleOffer(offerId);

    if (success) {
      toast({
        title: "Oferta cancelada",
        description: "El ticket ha regresado a tu custodia.",
        variant: "destructive",
      });
      loadData();
    } else {
      toast({
        title: "Error al cancelar",
        description: "No se pudo cancelar la oferta. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  // Función para abrir modal de editar precio
  const handleEditPrice = (offer: any) => {
    setEditingOffer(offer);
    setNewPrice(offer.resalePrice);
    setShowEditPrice(true);
  };

  // Función para guardar nuevo precio
  const handleSaveNewPrice = () => {
    if (!editingOffer) return;
    
    const maxPrice = editingOffer.originalPrice * 1.05; // Máximo 5% de incremento
    
    if (newPrice > maxPrice) {
      toast({
        title: "Precio muy alto",
        description: `El precio máximo permitido es S/${maxPrice.toFixed(2)} (+5%)`,
        variant: "destructive"
      });
      return;
    }

    if (newPrice < editingOffer.originalPrice) {
      toast({
        title: "Precio muy bajo",
        description: "No puedes vender por debajo del precio original",
        variant: "destructive"
      });
      return;
    }

    // Actualizar el precio de la oferta
    const updatedOffers = activeOffers.map(offer => 
      offer.id === editingOffer.id 
        ? { ...offer, resalePrice: newPrice, priceIncrease: ((newPrice - offer.originalPrice) / offer.originalPrice * 100) }
        : offer
    );
    
    setActiveOffers(updatedOffers);
    setShowEditPrice(false);
    setEditingOffer(null);
    
    toast({
      title: "Precio actualizado",
      description: `El precio de tu oferta se actualizó a S/${newPrice.toFixed(2)}`,
    });
  };

  // Función para mostrar interesados
  const handleShowInterested = (offerId: string) => {
    setSelectedOfferId(offerId);
    setShowInterested(true);
  };

  // Función para vender directamente a un interesado
  const handleSellToInterested = (buyerName: string, offerId: string) => {
    const offer = activeOffers.find(o => o.id === offerId);
    if (!offer) return;

    // Usar la función de localStorage para procesar la venta
    const success = sellResaleTicket(offerId);
    
    if (success) {
      // Remover la oferta de las activas en la UI
      const updatedOffers = activeOffers.filter(o => o.id !== offerId);
      setActiveOffers(updatedOffers);
      
      // Cerrar modales
      setShowInterested(false);
      
      // Mostrar confirmación de venta
      toast({
        title: "¡Venta exitosa!",
        description: `Has vendido tu ticket a ${buyerName} por S/${offer.resalePrice.toFixed(2)}. El saldo ha sido agregado a tu cuenta.`,
      });

      // Actualizar estadísticas
      loadData();
    } else {
      toast({
        title: "Error en la venta",
        description: "No se pudo completar la venta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  // Función para abrir el diálogo de respuesta
  const handleOpenResponse = (person: any) => {
    setSelectedPerson(person);
    setResponseMessage("");
    setShowResponseDialog(true);
  };

  // Función para enviar respuesta
  const handleSendResponse = () => {
    if (!responseMessage.trim()) {
      toast({
        title: "Mensaje vacío",
        description: "Por favor escribe una respuesta.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Respuesta enviada",
      description: `Tu mensaje ha sido enviado a ${selectedPerson?.name}.`,
    });

    setShowResponseDialog(false);
  };

  const stats = userStats ? [
    {
      icon: Package,
      label: "Ofertas Activas",
      value: userStats.activeOffers.toString(),
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Tickets Vendidos",
      value: userStats.ticketsResold.toString(),
      color: "text-success",
    },
    {
      icon: DollarSign,
      label: "Fondos en Custodia",
      value: `S/${userStats.fundsInCustody}`,
      color: "text-accent",
    },
  ] : [];

  const salesHistory = [
    {
      id: "1",
      eventName: "Eliminatorias Mundial 2026",
      zone: "Tribuna Lateral",
      soldPrice: 131.25,
      commission: 6.56,
      date: "18 Abril 2025",
      status: "completed",
    },
  ];

  const calculatePrices = (basePrice: number, increase: number) => {
    const resalePrice = basePrice * (1 + increase / 100);
    const sellerCommission = resalePrice * 0.05;
    const organizerCommission = resalePrice * 0.03;
    const platformCommission = resalePrice * 0.02;
    const sellerReceives = resalePrice - sellerCommission;

    return {
      resalePrice: resalePrice.toFixed(2),
      sellerCommission: sellerCommission.toFixed(2),
      organizerCommission: organizerCommission.toFixed(2),
      platformCommission: platformCommission.toFixed(2),
      sellerReceives: sellerReceives.toFixed(2),
    };
  };

  const handleCreateOffer = () => {
    if (!selectedTicket) {
      toast({
        title: "Error",
        description: "Por favor selecciona un ticket",
        variant: "destructive",
      });
      return;
    }

    const ticket = availableTickets.find(t => t.id === selectedTicket);
    if (!ticket) return;

    const newPrice = ticket.price * (1 + priceIncrease[0] / 100);
    
    try {
      const offerId = createResaleOffer(selectedTicket, newPrice);
      
      toast({
        title: "¡Oferta creada exitosamente!",
        description: "Tu ticket ha sido puesto en el mercado de reventa. Te llevamos a ver tus ofertas activas.",
      });
      
      setShowCreateOffer(false);
      setSelectedTicket("");
      setPriceIncrease([2.5]);
      loadData(); // Recargar datos
      
      // Redirigir automáticamente a la pestaña "Mis Ofertas" después de crear la oferta
      setTimeout(() => {
        const tabsElement = document.querySelector('[value="offers"]') as HTMLElement;
        if (tabsElement) {
          tabsElement.click();
        }
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la oferta de reventa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Panel de Revendedor</h1>
            <p className="text-muted-foreground">
              Tu ticket se convierte en oportunidad. La reventa justa protege a todos.
            </p>
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

          {/* Advanced Reseller Tools */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Analytics Pro</h3>
                  <p className="text-xs text-blue-700">Análisis de mercado</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-medium text-purple-900">Auto-Pricing</h3>
                  <p className="text-xs text-purple-700">Precios automáticos</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-900">Red Revendedores</h3>
                  <p className="text-xs text-green-700">Network profesional</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="font-medium text-orange-900">Mercado Global</h3>
                  <p className="text-xs text-orange-700">Reventa internacional</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="offers" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="offers">Mis Ofertas</TabsTrigger>
                  <TabsTrigger value="create">Crear Oferta</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                  <TabsTrigger value="settings">Configuración</TabsTrigger>
                </TabsList>

                {/* Mis Ofertas */}
                <TabsContent value="offers" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2">Mis Reventas Activas</h2>
                    <p className="text-muted-foreground">Gestiona tus ofertas de reventa publicadas</p>
                  </div>
                  
                  {activeOffers.length === 0 ? (
                    <Card className="glass-card p-8 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No tienes reventas activas</h3>
                      <p className="text-muted-foreground mb-4">
                        Crea tu primera oferta de reventa en la pestaña "Crear Oferta"
                      </p>
                      <Button variant="hero">
                        Crear Primera Reventa
                      </Button>
                    </Card>
                  ) : (
                    activeOffers.map((offer, index) => (
                      <Card
                        key={offer.id}
                        className="glass-card glow-on-hover p-6 animate-fade-in-up border-l-4 border-l-primary"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{offer.eventName}</h3>
                            <p className="text-sm text-primary font-medium">{offer.zone}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Publicado hace 2 días • {Math.floor(Math.random() * 15 + 5)} personas interesadas
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-success/20 text-success mb-2">Activa</Badge>
                            <p className="text-xs text-muted-foreground">Estado de la oferta</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                          <div>
                            <p className="text-xs text-muted-foreground">Precio Original</p>
                            <p className="text-lg font-bold">S/{offer.originalPrice}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Precio Reventa</p>
                            <p className="text-lg font-bold text-primary">S/{offer.resalePrice}</p>
                            <p className="text-xs text-success">+{((offer.resalePrice - offer.originalPrice) / offer.originalPrice * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Tu Ganancia (5%)</p>
                            <p className="text-lg font-bold text-success">S/{((offer.resalePrice - offer.originalPrice) * 0.05).toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleShowInterested(offer.id)}
                          >
                            Ver Interesados ({Math.floor(Math.random() * 8 + 2)})
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditPrice(offer)}
                          >
                            Editar Precio
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleSellOffer(offer.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Vender
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelOffer(offer.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </TabsContent>

                {/* Crear Oferta */}
                <TabsContent value="create" className="space-y-4">
                  <Card className="glass-card p-6">
                    <h3 className="font-semibold text-lg mb-4">Tickets Disponibles para Reventa</h3>
                    {availableTickets.length > 0 ? (
                      <div className="space-y-4">
                        {availableTickets.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{ticket.eventName}</h4>
                                <p className="text-sm text-muted-foreground">{ticket.zone}</p>
                                <p className="text-xs text-muted-foreground mt-1">{ticket.date}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">Precio</p>
                                <p className="text-xl font-bold text-primary">S/{ticket.price}</p>
                              </div>
                            </div>
                            <Button
                              variant="hero"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => {
                                setSelectedTicket(ticket.id);
                                setShowCreateOffer(true);
                              }}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Publicar Oferta
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">
                          No tienes tickets deportivos disponibles para revender
                        </p>
                        <Link to="/events">
                          <Button variant="outline">⚽ Explorar Eventos Deportivos</Button>
                        </Link>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                {/* Analytics */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Market Trends */}
                    <Card className="p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Tendencias de Mercado
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                          <span className="text-sm font-medium">⚽ Fútbol Nacional</span>
                          <span className="text-sm text-green-600 font-semibold">+25.8%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                          <span className="text-sm font-medium">🏀 Básquet Liga 1</span>
                          <span className="text-sm text-green-600 font-semibold">+12.3%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                          <span className="text-sm font-medium">🏐 Voleibol Femenino</span>
                          <span className="text-sm text-green-600 font-semibold">+18.7%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-accent/10 rounded-lg">
                          <span className="text-sm font-medium">🎾 Torneos ATP</span>
                          <span className="text-sm text-orange-600 font-semibold">+5.1%</span>
                        </div>
                      </div>
                    </Card>

                    {/* Price Optimization */}
                    <Card className="p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-purple-600" />
                        Optimización de Precios
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 border border-dashed border-primary/30 rounded-lg">
                          <p className="text-sm font-medium mb-2">Precio Recomendado</p>
                          <p className="text-2xl font-bold text-primary">+12-18%</p>
                          <p className="text-xs text-muted-foreground">Basado en demanda actual</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-700">Tasa de Venta</p>
                            <p className="text-lg font-bold text-green-800">87%</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">Tiempo Promedio</p>
                            <p className="text-lg font-bold text-blue-800">2.3d</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Competitor Analysis */}
                    <Card className="p-6 md:col-span-2">
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-green-600" />
                        Análisis de Competencia
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">Tu Posición</p>
                          <p className="text-2xl font-bold text-blue-600">#3</p>
                          <p className="text-xs text-blue-700">En tu categoría</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                          <p className="text-sm font-medium text-orange-900">Precio Promedio</p>
                          <p className="text-2xl font-bold text-orange-600">+14%</p>
                          <p className="text-xs text-orange-700">Vs precio original</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <p className="text-sm font-medium text-purple-900">Oportunidad</p>
                          <p className="text-2xl font-bold text-purple-600">Alto</p>
                          <p className="text-xs text-purple-700">Demanda vs oferta</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Historial */}
                <TabsContent value="history" className="space-y-4">
                  {salesHistory.map((sale, index) => (
                    <Card
                      key={sale.id}
                      className="glass-card p-6 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{sale.eventName}</h3>
                          <p className="text-sm text-muted-foreground">{sale.zone}</p>
                          <p className="text-xs text-muted-foreground mt-1">{sale.date}</p>
                        </div>
                        <Badge className="bg-success/20 text-success">Completada</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground">Precio de Venta</p>
                          <p className="text-lg font-bold">S/{sale.soldPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tu Comisión Recibida</p>
                          <p className="text-lg font-bold text-success">S/{sale.commission}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                {/* Nueva pestaña de Configuración */}
                <TabsContent value="settings" className="space-y-4">
                  <div className="grid gap-6">
                    {/* Métodos de Pago */}
                    <Card className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            Métodos de Pago
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Configura cómo quieres recibir los pagos de tus ventas
                          </p>
                        </div>
                        <Button 
                          variant="hero" 
                          onClick={() => setShowPaymentMethods(true)}
                          className="gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Gestionar Métodos
                        </Button>
                      </div>
                      
                      <div className="text-center py-8 text-muted-foreground">
                        <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Configura tus métodos de pago para recibir ganancias de reventas</p>
                        <p className="text-sm mt-1">Yape, transferencias bancarias, crypto y más</p>
                      </div>
                    </Card>

                    {/* Historial de Pagos Realizados */}
                    <Card className="glass-card p-6">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Historial de Pagos Recibidos
                      </h3>
                      <div className="space-y-3">
                        {[
                          { date: "2024-12-15", event: "Universitario vs Cristal", amount: "S/127.50", method: "Yape", status: "Completado" },
                          { date: "2024-12-10", event: "Alianza Lima vs Melgar", amount: "S/89.25", method: "Transferencia", status: "Completado" },
                          { date: "2024-12-05", event: "Sporting Cristal vs Boys", amount: "S/156.75", method: "Yape", status: "Pendiente" }
                        ].map((payment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{payment.event}</p>
                              <p className="text-xs text-muted-foreground">{payment.date} • {payment.method}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-success">{payment.amount}</p>
                              <Badge variant={payment.status === "Completado" ? "default" : "secondary"} className="text-xs">
                                {payment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        Ver historial completo
                      </Button>
                    </Card>

                    {/* Configuración de Perfil */}
                    <Card className="glass-card p-6">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Users className="h-5 w-5 text-primary" />
                        Mi Perfil
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <img 
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                            alt="Perfil" 
                            className="w-16 h-16 rounded-full border-2 border-primary/20"
                          />
                          <div className="flex-1">
                            <p className="font-medium">Carlos Rodriguez Vargas</p>
                            <p className="text-sm text-muted-foreground">carlos.rodriguez@gmail.com</p>
                            <p className="text-xs text-muted-foreground">Revendedor verificado</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/profile">Editar Perfil</Link>
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">Ventas realizadas</p>
                            <p className="font-bold text-lg">23</p>
                          </div>
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">Calificación</p>
                            <p className="font-bold text-lg">4.8 ⭐</p>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Configuración de Notificaciones */}
                    <Card className="glass-card p-6">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-primary" />
                        Notificaciones
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Nuevas ofertas</p>
                            <p className="text-sm text-muted-foreground">Recibe alertas cuando alguien esté interesado</p>
                          </div>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Cambios de precio del mercado</p>
                            <p className="text-sm text-muted-foreground">Notificaciones sobre fluctuaciones de precios</p>
                          </div>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Pagos recibidos</p>
                            <p className="text-sm text-muted-foreground">Confirmación de pagos completados</p>
                          </div>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TransactionStatus status="custody" />

              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Reventa Justa
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    El precio de reventa está limitado a un máximo de <strong>+5%</strong> sobre el precio original.
                  </p>
                  <p>
                    Las comisiones se distribuyen automáticamente:
                  </p>
                  <ul className="space-y-1 ml-4">
                    <li>• 5% para ti (revendedor)</li>
                    <li>• 3% para el organizador</li>
                    <li>• 2% para la plataforma</li>
                  </ul>
                  <p className="text-primary font-medium">
                    Los fondos se liberan automáticamente cuando se completa la transferencia del ticket.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Create Offer Modal */}
      <Dialog open={showCreateOffer} onOpenChange={setShowCreateOffer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Oferta de Reventa</DialogTitle>
            <DialogDescription>
              Configura el precio de tu ticket. El sistema garantiza una reventa justa y transparente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-4 block">Incremento de Precio (Máximo +5%)</Label>
              <Slider
                value={priceIncrease}
                onValueChange={setPriceIncrease}
                max={5}
                step={0.5}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-primary">+{priceIncrease[0]}%</span>
                <span>+5%</span>
              </div>
            </div>

            {availableTickets.length > 0 && (
              <div className="p-4 bg-background/50 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio Original:</span>
                  <span className="font-semibold">S/{availableTickets[0].price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Precio de Reventa:</span>
                  <span className="font-bold text-primary">
                    S/{calculatePrices(availableTickets[0].price, priceIncrease[0]).resalePrice}
                  </span>
                </div>
                {(() => {
                  const ticket = availableTickets.find(t => t.id === selectedTicket);
                  if (!ticket) return null;
                  const prices = calculatePrices(ticket.price, priceIncrease[0]);
                  return (
                    <>
                      <div className="pt-3 border-t border-border/50 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tu comisión (5%):</span>
                          <span className="text-success font-semibold">
                            -S/{prices.sellerCommission}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Organizador (3%):</span>
                          <span>-S/{prices.organizerCommission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Plataforma (2%):</span>
                          <span>-S/{prices.platformCommission}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex justify-between font-bold">
                          <span>Recibirás:</span>
                          <span className="text-success text-lg">
                            S/{prices.sellerReceives}
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80">
                  Tu oferta será publicada. El pago se liberará automáticamente cuando la transferencia del ticket se complete.
                </p>
              </div>
            </div>

            <Button variant="hero" className="w-full" onClick={handleCreateOffer}>
              Publicar Oferta Segura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Métodos de Pago */}
      <PaymentMethodsModal 
        isOpen={showPaymentMethods}
        onClose={() => setShowPaymentMethods(false)}
        userRole="reseller"
      />

      {/* Modal para Editar Precio */}
      <Dialog open={showEditPrice} onOpenChange={setShowEditPrice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Precio de Reventa</DialogTitle>
            <DialogDescription>
              Ajusta el precio de tu oferta. Máximo permitido: +5% sobre el precio original.
            </DialogDescription>
          </DialogHeader>
          {editingOffer && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium">{editingOffer.eventName}</h4>
                <p className="text-sm text-muted-foreground">{editingOffer.zone}</p>
                <p className="text-sm">Precio original: <strong>S/{editingOffer.originalPrice}</strong></p>
                <p className="text-sm">Precio máximo: <strong>S/{(editingOffer.originalPrice * 1.05).toFixed(2)}</strong></p>
              </div>
              
              <div>
                <Label htmlFor="newPrice">Nuevo Precio de Reventa</Label>
                <Input
                  id="newPrice"
                  type="number"
                  step="0.01"
                  min={editingOffer.originalPrice}
                  max={editingOffer.originalPrice * 1.05}
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tu ganancia: S/{((newPrice - editingOffer.originalPrice) * 0.05).toFixed(2)}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowEditPrice(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="hero" onClick={handleSaveNewPrice} className="flex-1">
                  Guardar Precio
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para Ver Interesados */}
      <Dialog open={showInterested} onOpenChange={setShowInterested}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Personas Interesadas</DialogTitle>
            <DialogDescription>
              Usuarios que han mostrado interés en tu oferta de reventa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { name: "Carlos Mendoza", rating: 4.8, message: "¿Está disponible para el partido de mañana?", time: "Hace 2 horas" },
              { name: "Ana García", rating: 4.9, message: "Interesada en comprar. ¿Precio negociable?", time: "Hace 5 horas" },
              { name: "Luis Torres", rating: 4.7, message: "¿Puedo ver el ticket antes de comprar?", time: "Hace 1 día" }
            ].map((person, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                    alt={person.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{person.name}</h4>
                      <Badge variant="secondary">{person.rating} ⭐</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{person.message}</p>
                    <p className="text-xs text-muted-foreground">{person.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenResponse(person)}
                    >
                      Responder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="hero"
                      onClick={() => handleSellToInterested(person.name, selectedOfferId)}
                    >
                      Vender
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Responder a Interesados */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Responder a {selectedPerson?.name}</DialogTitle>
            <DialogDescription>
              Envía un mensaje a la persona interesada en tu ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPerson && (
              <div className="p-4 bg-muted/20 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPerson.name}`}
                    alt={selectedPerson.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{selectedPerson.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPerson.time}</p>
                  </div>
                </div>
                <div className="pl-10">
                  <p className="text-sm italic">"{selectedPerson.message}"</p>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="response">Tu respuesta</Label>
              <Textarea 
                id="response"
                placeholder="Escribe tu respuesta aquí..."
                className="min-h-[120px]"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowResponseDialog(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="hero" 
                className="flex-1"
                onClick={handleSendResponse}
              >
                Enviar Respuesta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResellerDashboard;