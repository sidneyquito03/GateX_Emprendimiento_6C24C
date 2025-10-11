import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Package, Plus, Info, BarChart3, Users, Settings, Zap, Target, Globe, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  updateResaleOffer,
  recordSale,
  getSalesHistory
} from "@/lib/localStorage";

const ResellerDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showEditPrice, setShowEditPrice] = useState(false);
  const [showInterested, setShowInterested] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>("");
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [priceIncrease, setPriceIncrease] = useState([2.5]);
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [availableTickets, setAvailableTickets] = useState<any[]>([]);
  
  // Verificar que el usuario esté autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userRole = localStorage.getItem("userRole");
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (userRole !== 'reseller') {
      navigate("/role-selection");
      return;
    }
  }, []);
  const [activeOffers, setActiveOffers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("offers");
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  useEffect(() => {
    loadData();
    
    // Inicializar datos de ejemplo si no existen
    initializeExampleData();
  }, []);
  
  // Función para inicializar datos de ejemplo en localStorage
  const initializeExampleData = () => {
    try {
      // Verificar si ya existen ofertas de reventa
      const existingOffers = getResaleOffers();
      
      if (existingOffers.length === 0) {
        // Crear ofertas de ejemplo y guardarlas en localStorage
        const exampleOffers = [
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
        
        localStorage.setItem("resale_offers", JSON.stringify(exampleOffers));
        console.log("✅ Datos de ejemplo inicializados correctamente");
      }
    } catch (error) {
      console.error("Error al inicializar datos de ejemplo:", error);
    }
  };

  const loadData = () => {
    console.log("⚙️ Cargando datos del dashboard...");
    
    try {
      // Cargar todos los tickets
      const allTickets = getTickets();
      console.log("🎫 Todos los tickets:", allTickets);
      
      // Separar los tickets en custodia para revender
      const ticketsInCustody = allTickets.filter(t => t.status === "custody");
      setAvailableTickets(ticketsInCustody);
      console.log(`📦 Tickets disponibles para revender: ${ticketsInCustody.length}`);
      
      // Cargar ofertas activas
      const offers = getResaleOffers().filter(o => o.status === "active");
      console.log(`🏷️ Ofertas activas: ${offers.length}`);
      
      // Enriquecer las ofertas con información adicional
      const ticketsInResale = allTickets.filter(t => t.status === "resale");
      console.log(`🔄 Tickets en reventa: ${ticketsInResale.length}`);
      
      setActiveOffers(offers);
      
      // Cargar historial de ventas
      const history = getSalesHistory();
      
      // Si no hay historial, crear datos de ejemplo
      if (history.length === 0) {
        const exampleSales = [
          {
            id: "1",
            eventName: "Eliminatorias Mundial 2026",
            zone: "OCCIDENTE BAJA",
            soldPrice: 131.25,
            commission: 6.56,
            date: "18 Abril 2025",
            status: "completed",
            buyer: {
              name: "Carlos Mendoza",
              email: "carlos.mendoza@gmail.com",
              phone: "+51 987 654 321",
              dni: "12345678",
              rating: 4.8
            },
            saleId: "SALE_001",
            originalPrice: 125.00,
            paymentMethod: "Tarjeta Visa",
            transferCompleted: true
          },
          {
            id: "2",
            eventName: "Copa Libertadores Final",
            zone: "NORTE",
            soldPrice: 84.00,
            commission: 4.20,
            date: "12 Abril 2025",
            status: "completed",
            buyer: {
              name: "Ana García López",
              email: "ana.garcia@outlook.com",
              phone: "+51 912 345 678",
              dni: "87654321",
              rating: 4.9
            },
            saleId: "SALE_002",
            originalPrice: 80.00,
            paymentMethod: "Yape",
            transferCompleted: true
          },
          {
            id: "3",
            eventName: "Alianza Lima vs Universitario",
            zone: "SUR",
            soldPrice: 42.00,
            commission: 2.10,
            date: "28 Marzo 2025",
            status: "completed",
            buyer: {
              name: "Luis Torres Vargas",
              email: "luis.torres@hotmail.com",
              phone: "+51 965 432 109",
              dni: "11223344",
              rating: 4.7
            },
            saleId: "SALE_003",
            originalPrice: 40.00,
            paymentMethod: "Plin",
            transferCompleted: true
          }
        ];
        
        localStorage.setItem("reseller_sales_history", JSON.stringify(exampleSales));
        setSalesHistory(exampleSales);
      } else {
        setSalesHistory(history);
      }
      
      // Cargar estadísticas
      const stats = getUserStats();
      setUserStats(stats);
      console.log("📊 Estadísticas cargadas:", stats);
      
      console.log("✅ Datos cargados correctamente");
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar correctamente los datos",
        variant: "destructive"
      });
    }
  };

  // Función para vender directamente
  const handleSellOffer = (offerId: string) => {
    console.log("🛒 Iniciando proceso de venta para oferta:", offerId);
    
    // Verificar que tengamos un ID válido
    if (!offerId) {
      console.error("❌ ID de oferta no válido");
      toast({
        title: "Error en la venta",
        description: "ID de oferta no válido",
        variant: "destructive",
      });
      return;
    }
    
    // Encontrar la oferta en el estado actual
    const offerToSell = activeOffers.find(o => o.id === offerId);
    console.log("🎫 Datos de la oferta a vender:", offerToSell);
    
    // Para efectos de demo, continuamos aunque la oferta no se encuentre
    if (!offerToSell) {
      console.warn("⚠️ Oferta no encontrada en el estado local, intentando procesar de todas formas");
      toast({
        title: "Procesando venta...",
        description: "Verificando datos del ticket",
      });
    } else {
      // Mostrar un estado de carga
      toast({
        title: "Procesando venta...",
        description: "Por favor espera mientras procesamos la venta",
      });
    }
    
    // Intentar procesar la venta
    try {
      console.log("⚙️ Ejecutando función sellResaleTicket con ID:", offerId);
      const success = sellResaleTicket(offerId);
      console.log("✅ Resultado de la venta:", success);

      if (success) {
        // Seleccionar un comprador real aleatorio para venta directa
        const randomBuyer = realBuyers[Math.floor(Math.random() * realBuyers.length)];
        
        const buyerInfo = {
          name: randomBuyer.name,
          email: randomBuyer.email,
          phone: randomBuyer.phone,
          dni: randomBuyer.dni,
          rating: randomBuyer.rating,
          preferredPayment: randomBuyer.preferredPayment
        };
        
        // Registrar la venta con información del comprador
        if (offerToSell) {
          recordSale({
            id: `sale_${Date.now()}`,
            eventName: offerToSell.eventName,
            zone: offerToSell.zone || "Zona General",
            soldPrice: offerToSell.resalePrice,
            commission: offerToSell.resalePrice * 0.05,
            originalPrice: offerToSell.originalPrice,
            paymentMethod: buyerInfo.preferredPayment,
            buyer: buyerInfo
          });
        }
        
        // Actualizar la interfaz de usuario quitando la oferta vendida
        setActiveOffers(prev => prev.filter(o => o.id !== offerId));
        
        // Precio a mostrar (con fallback si no tenemos los datos)
        const priceToShow = offerToSell ? offerToSell.resalePrice.toFixed(2) : "-.--";
        
        // Notificar éxito
        toast({
          title: "¡Venta exitosa!",
          description: `Has vendido el ticket a ${buyerInfo.name} por S/${priceToShow}. El saldo ha sido agregado a tu cuenta.`,
        });
        
        // Recargar datos
        console.log("🔄 Recargando datos después de la venta exitosa");
        loadData();
      } else {
        console.error("❌ La venta no se completó correctamente");
        toast({
          title: "Error al vender",
          description: "No se pudo completar la venta. Por favor, verifica la conexión e intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error al procesar la venta:", error);
      toast({
        title: "Error al vender",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
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
    // Al abrir el modal de interesados, reseteamos cualquier estado previo
    setSelectedBuyer(null);
    setResponseMessage("");
    setShowRespondModal(false);
  };

  // Base de datos de compradores reales con información completa
  const realBuyers = [
    {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@gmail.com",
      phone: "+51 987 654 321",
      dni: "12345678",
      rating: 4.8,
      preferredPayment: "Yape"
    },
    {
      name: "Ana García López",
      email: "ana.garcia@outlook.com", 
      phone: "+51 912 345 678",
      dni: "87654321",
      rating: 4.9,
      preferredPayment: "Plin"
    },
    {
      name: "Luis Torres Vargas",
      email: "luis.torres@hotmail.com",
      phone: "+51 965 432 109", 
      dni: "11223344",
      rating: 4.7,
      preferredPayment: "Tarjeta Visa"
    },
    {
      name: "María González",
      email: "maria.gonzalez@gmail.com",
      phone: "+51 934 567 890",
      dni: "22334455",
      rating: 4.6,
      preferredPayment: "Tarjeta Mastercard"
    },
    {
      name: "Pedro Castillo",
      email: "pedro.castillo@gmail.com",
      phone: "+51 911 814 374",
      dni: "60783376", 
      rating: 4.8,
      preferredPayment: "Yape"
    }
  ];

  // Función para vender directamente a un interesado
  const handleSellToInterested = (buyerName: string, offerId: string) => {
    console.log("🛒 Iniciando venta a interesado:", { buyerName, offerId });
    
    // Verificar datos
    if (!offerId || !buyerName) {
      console.error("❌ Información incompleta para venta:", { buyerName, offerId });
      toast({
        title: "Error en la venta",
        description: "Información incompleta para procesar la venta",
        variant: "destructive"
      });
      return;
    }
    
    // Buscar la oferta
    const offer = activeOffers.find(o => o.id === offerId);
    console.log("🎫 Oferta encontrada:", offer);
    
    // Para efectos de demo, continuamos aunque la oferta no se encuentre
    if (!offer) {
      console.warn("⚠️ Oferta no encontrada en el estado local, intentando procesar de todas formas");
      toast({
        title: "Procesando venta...",
        description: `Vendiendo ticket a ${buyerName} (verificando datos)`,
      });
    } else {
      // Mostrar estado de carga
      toast({
        title: "Procesando venta...",
        description: `Vendiendo ticket a ${buyerName}`,
      });
    }

    try {
      // Usar la función de localStorage para procesar la venta
      console.log("⚙️ Ejecutando función sellResaleTicket con ID:", offerId);
      const success = sellResaleTicket(offerId);
      console.log("✅ Resultado de la venta:", success);
      
      if (success) {
        // Buscar información real del comprador
        const realBuyer = realBuyers.find(buyer => buyer.name === buyerName);
        
        const buyerInfo = realBuyer || {
          name: buyerName,
          email: `${buyerName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
          phone: `+51 9${Math.floor(10000000 + Math.random() * 90000000)}`,
          dni: `${Math.floor(10000000 + Math.random() * 90000000)}`,
          rating: Math.round((4.5 + Math.random() * 0.5) * 10) / 10,
          preferredPayment: ["Yape", "Plin", "Tarjeta Visa", "Tarjeta Mastercard"][Math.floor(Math.random() * 4)]
        };
        
        // Registrar la venta con información del comprador
        if (offer) {
          recordSale({
            id: `sale_${Date.now()}`,
            eventName: offer.eventName,
            zone: offer.zone || "Zona General",
            soldPrice: offer.resalePrice,
            commission: offer.resalePrice * 0.05,
            originalPrice: offer.originalPrice,
            paymentMethod: buyerInfo.preferredPayment,
            buyer: buyerInfo
          });
        }
        
        // Remover la oferta de las activas en la UI
        const updatedOffers = activeOffers.filter(o => o.id !== offerId);
        setActiveOffers(updatedOffers);
        
        // Cerrar modales
        setShowInterested(false);
        
        // Precio a mostrar (con fallback si no tenemos los datos)
        const priceToShow = offer ? offer.resalePrice.toFixed(2) : "-.--";
        
        // Mostrar confirmación de venta
        toast({
          title: "¡Venta exitosa!",
          description: `Has vendido tu ticket a ${buyerName} por S/${priceToShow}. El saldo ha sido agregado a tu cuenta.`,
        });

        // Actualizar estadísticas
        console.log("🔄 Recargando datos después de la venta exitosa");
        loadData();
      } else {
        console.error("❌ La venta no se completó correctamente");
        toast({
          title: "Error en la venta",
          description: "No se pudo completar la venta. El sistema no pudo procesar la transacción.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("❌ Error al vender a interesado:", error);
      toast({
        title: "Error en la venta",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive"
      });
    }
  };

  // Función para responder a un interesado
  const handleRespondToBuyer = (buyer: any) => {
    setSelectedBuyer(buyer);
    setResponseMessage("");
    setShowRespondModal(true);
    // Mantenemos abierto el modal de interesados para poder ver ambas opciones
  };

  // Función para enviar la respuesta
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
      title: "Mensaje enviado",
      description: `Tu respuesta ha sido enviada a ${selectedBuyer?.name}.`,
    });

    setResponseMessage("");
    setShowRespondModal(false);
    // No cerramos el modal principal de interesados para mantener la navegación
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
      value: `S/${userStats.fundsInCustody.toFixed(2)}`,
      color: "text-accent",
    },
  ] : [];



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
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                        
                        <div className="flex flex-wrap gap-3 mt-4">
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
                            className="flex-1"
                            onClick={() => handleEditPrice(offer)}
                          >
                            Editar Precio
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevenir propagación del evento
                              console.log("🖱️ Botón 'Vender' clickeado para la oferta:", offer.id);
                              handleSellOffer(offer.id);
                            }}
                          >
                            Vender
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex-1"
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
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">Historial de Ventas</h2>
                    <p className="text-muted-foreground">Detalles completos de tus transacciones completadas</p>
                  </div>
                  
                  {salesHistory.map((sale, index) => (
                    <Card
                      key={sale.id}
                      className="glass-card p-6 animate-fade-in-up border-l-4 border-l-success"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Información del Evento */}
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1 text-primary">{sale.eventName}</h3>
                              <p className="text-sm font-medium text-muted-foreground">{sale.zone}</p>
                              <p className="text-xs text-muted-foreground mt-1">📅 {sale.date}</p>
                              <p className="text-xs text-muted-foreground">🆔 {sale.saleId}</p>
                            </div>
                            <Badge className="bg-success/20 text-success border-success">✅ Completada</Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                            <div>
                              <p className="text-xs text-muted-foreground">Precio Original</p>
                              <p className="text-sm font-semibold">S/{sale.originalPrice?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Precio de Venta</p>
                              <p className="text-lg font-bold text-primary">S/{sale.soldPrice.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Tu Comisión</p>
                              <p className="text-lg font-bold text-success">S/{sale.commission.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Método de Pago</p>
                              <p className="text-sm font-semibold">{sale.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        {/* Información del Comprador */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h4 className="font-semibold mb-3 flex items-center text-sm">
                            👤 Información del Comprador
                            <div className="ml-auto flex items-center gap-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-xs font-medium">{sale.buyer?.rating}</span>
                            </div>
                          </h4>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[60px]">Nombre:</span>
                              <span className="font-medium">{sale.buyer?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[60px]">Email:</span>
                              <span className="font-mono text-xs">{sale.buyer?.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[60px]">Teléfono:</span>
                              <span className="font-mono text-xs">{sale.buyer?.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground min-w-[60px]">DNI:</span>
                              <span className="font-mono text-xs">{sale.buyer?.dni}</span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-success font-medium">✅ Transferencia Completada</span>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-7"
                                onClick={() => {
                                  setSelectedSale(sale);
                                  setShowSaleDetails(true);
                                }}
                              >
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
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

              {/* Estadísticas de Compradores */}
              <Card className="glass-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Mis Compradores
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total vendido:</span>
                    <span className="font-bold">{salesHistory.length} tickets</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating promedio:</span>
                    <span className="font-bold flex items-center gap-1">
                      {(salesHistory.reduce((acc, sale) => acc + (sale.buyer?.rating || 0), 0) / salesHistory.length).toFixed(1)}
                      <span className="text-yellow-500">⭐</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Último comprador:</span>
                    <span className="font-bold text-xs">{salesHistory[0]?.buyer?.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3" 
                    onClick={() => {
                      setActiveTab("history");
                    }}
                  >
                    Ver Todos los Compradores
                  </Button>
                </div>
              </Card>

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

          {/* Mostramos el modal de respuesta junto con los interesados cuando está activo */}
          {showRespondModal && selectedBuyer && (
            <div className="mb-6 p-4 bg-muted/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedBuyer.name}`}
                    alt={selectedBuyer.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{selectedBuyer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedBuyer.time}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setShowRespondModal(false)}
                >
                  &times;
                </Button>
              </div>
              <div className="mb-3">
                <p className="text-sm italic bg-muted/20 p-2 rounded-md">"{selectedBuyer.message}"</p>
              </div>
              <div className="space-y-2">
                <Textarea 
                  placeholder="Escribe tu respuesta aquí..."
                  className="min-h-[80px] text-sm"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowRespondModal(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="hero"
                    size="sm"
                    onClick={handleSendResponse}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {[
              { name: "Carlos Mendoza", rating: 4.8, message: "¿Está disponible para el partido de mañana?", time: "Hace 2 horas" },
              { name: "Ana García López", rating: 4.9, message: "Interesada en comprar. ¿Precio negociable?", time: "Hace 5 horas" },
              { name: "Luis Torres Vargas", rating: 4.7, message: "¿Puedo ver el ticket antes de comprar?", time: "Hace 1 día" }
            ].map((person, index) => (
              <Card key={index} className={`p-4 border-l-4 ${selectedBuyer?.name === person.name ? 'border-l-success bg-success/5' : 'border-l-primary'}`}>
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
                  <div className="flex gap-2 min-w-[180px]">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRespondToBuyer(person)}
                    >
                      Responder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="hero"
                      className="flex-1"
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

      {/* Modal de Detalles de Venta */}
      <Dialog open={showSaleDetails} onOpenChange={setShowSaleDetails}>
        <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center text-white">
              Detalles de la Venta
            </DialogTitle>
          </DialogHeader>
          
          {selectedSale && (
            <div className="space-y-4">
              {/* Información del Comprador */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Información del Comprador</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Nombre:</span> {selectedSale.buyerName}</p>
                  <p><span className="font-semibold">Email:</span> {selectedSale.buyerEmail}</p>
                  <p><span className="font-semibold">Teléfono:</span> {selectedSale.buyerPhone}</p>
                  <p><span className="font-semibold">DNI:</span> {selectedSale.buyerDNI}</p>
                </div>
              </div>

              {/* Detalles de la Transacción */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Detalles de la Transacción</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Evento:</span> {selectedSale.eventTitle}</p>
                  <p><span className="font-semibold">Zona:</span> {selectedSale.zone}</p>
                  <p><span className="font-semibold">Fecha de Venta:</span> {new Date(selectedSale.saleDate).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Precio de Venta:</span> ${selectedSale.salePrice.toLocaleString()}</p>
                  <p><span className="font-semibold">Método de Pago:</span> {selectedSale.paymentMethod}</p>
                </div>
              </div>

              {/* Estado de la Transferencia */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">Estado de Transferencia</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedSale.transferStatus === 'completed' 
                      ? 'bg-green-500/20 text-green-300'
                      : selectedSale.transferStatus === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {selectedSale.transferStatus === 'completed' && 'Transferido'}
                    {selectedSale.transferStatus === 'pending' && 'Pendiente'}
                    {selectedSale.transferStatus === 'failed' && 'Falló'}
                  </span>
                </div>
              </div>

              {/* Botón de Cerrar */}
              <div className="pt-4">
                <Button 
                  onClick={() => setShowSaleDetails(false)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResellerDashboard;