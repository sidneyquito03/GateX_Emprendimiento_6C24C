import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ChatModal } from "@/components/ChatModal";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Calendar,
  CheckCircle,
  Award,
  MessageSquare
} from "lucide-react";
import { getResaleOffers } from "@/lib/localStorage";

const ResellerProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [resellerData, setResellerData] = useState<any>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  
  const getResellerName = (id: string | undefined) => {
    if (id === "1") return "TicketsPro Lima";
    if (id === "2") return "EventMaster";
    if (id === "3") return "QuickTickets";
    return `Revendedor ${id || ""}`;
  };
  
  const getResellerSpecializations = (id: string | undefined) => {
    if (id === "1") return ["Deportes", "Conciertos", "Teatro"];
    if (id === "2") return ["Conciertos", "Festivales"];
    if (id === "3") return ["Deportes"];
    return ["Eventos Variados"];
  };

  useEffect(() => {
    console.log("Cargando perfil para ID:", id);
    
    // Verificar si venimos con acción de contacto
    const params = new URLSearchParams(location.search);
    const action = params.get('action');
    if (action === 'contact') {
      // Mostraremos el chat automáticamente
      setShowChat(true);
    }
    
    // En una app real, cargaríamos datos del revendedor desde la API
    // Para esta demo, usamos datos de ejemplo
    setResellerData({
      id: id || "reseller",
      name: getResellerName(id),
      isVerified: true,
      rating: id === "1" ? 4.8 : (id === "2" ? 4.6 : 4.3),
      totalSales: id === "1" ? 2500 : (id === "2" ? 1800 : 950),
      responseTime: id === "1" ? "< 5 min" : (id === "2" ? "< 10 min" : "< 15 min"),
      successRate: id === "1" ? "98.5%" : (id === "2" ? "96.2%" : "94.1%"),
      location: "Lima, Perú",
      email: `contact@${getResellerName(id).toLowerCase().replace(/\s+/g, '')}.pe`,
      phone: "+51 987654321",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id || "reseller"}`,
      joinedDate: "Enero 2023",
      specializations: getResellerSpecializations(id),
      reviews: [
        {
          id: "1",
          user: "Carlos M.",
          rating: 5,
          comment: "Excelente servicio, entrega rápida",
          date: "Septiembre 2025"
        },
        {
          id: "2",
          user: "María L.",
          rating: 4,
          comment: "Muy confiable, recomendado",
          date: "Agosto 2025"
        }
      ],
      availableTickets: getResaleOffers()
        .filter(offer => offer.status === "active")
        .slice(0, 3) // Mostrar máximo 3 tickets para el demo
    });
    
    console.log("Perfil cargado correctamente para ID:", id);
  }, [id, location.search]);

  if (!resellerData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <p className="text-center">Cargando información del revendedor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary">
                  <AvatarImage src={resellerData.avatar} alt={resellerData.name} />
                  <AvatarFallback>{resellerData.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{resellerData.name}</h1>
                    {resellerData.isVerified && (
                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span className="font-medium">{resellerData.rating}</span>
                    <span className="text-sm text-muted-foreground">({resellerData.totalSales} ventas)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {resellerData.location}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {resellerData.joinedDate}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Intentar volver atrás o ir a la comparación si no hay historia
                      try {
                        navigate(-1);
                      } catch (error) {
                        navigate("/reseller-comparison");
                      }
                    }}
                  >
                    Volver
                  </Button>
                  <Button 
                    className="bg-cyan-600 hover:bg-cyan-700"
                    onClick={() => {
                      toast({
                        title: "Contactar Revendedor",
                        description: "Iniciando chat con " + resellerData.name
                      });
                      setShowChat(true);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-lg font-bold">{resellerData.responseTime}</p>
                <p className="text-xs text-muted-foreground">Responde en</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-lg font-bold">{resellerData.successRate}</p>
                <p className="text-xs text-muted-foreground">Ratio de éxito</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-lg font-bold">{resellerData.rating}/5</p>
                <p className="text-xs text-muted-foreground">Valoración</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="tickets" className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="tickets">Tickets Disponibles</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas ({resellerData.reviews.length})</TabsTrigger>
              <TabsTrigger value="info">Información</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tickets" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Tickets en Reventa</h3>
              {resellerData.availableTickets.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Este revendedor no tiene tickets disponibles actualmente
                </p>
              ) : (
                <div className="space-y-4">
                  {resellerData.availableTickets.map((ticket: any) => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold">{ticket.eventName}</h4>
                            <p className="text-sm text-primary">{ticket.zone}</p>
                            <p className="text-xs text-muted-foreground">
                              Sector {ticket.sector} • Fila {ticket.row} • Asiento {ticket.seat}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground line-through">S/ {ticket.originalPrice}</p>
                              <Badge variant="outline" className="text-xs">+{ticket.priceIncrease}%</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Precio reventa</p>
                              <p className="text-xl font-bold text-primary">S/ {ticket.resalePrice}</p>
                            </div>
                            <Button onClick={() => {
                              navigate(`/ticket/${ticket.id}`);
                            }}>
                              Ver Ticket
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Reseñas de Compradores</h3>
              {resellerData.reviews.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  Este revendedor aún no tiene reseñas
                </p>
              ) : (
                <div className="space-y-4">
                  {resellerData.reviews.map((review: any) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user}`} />
                              <AvatarFallback>{review.user.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.user}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="info" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Información de Contacto</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{resellerData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{resellerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{resellerData.location}</span>
                  </div>
                </CardContent>
              </Card>
              
              <h3 className="text-lg font-semibold mt-4 mb-2">Especialización</h3>
              <div className="flex flex-wrap gap-2">
                {resellerData.specializations.map((spec: string) => (
                  <Badge key={spec} variant="outline">{spec}</Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => navigate("/events")}
            >
              Ver todos los eventos
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />

      {/* Chat Modal */}
      <ChatModal 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        revendedorName={resellerData.name}
        revendedorId={resellerData.id}
      />
    </div>
  );
};

export default ResellerProfile;