import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CreditCard,
  Download,
  QrCode,
  Star,
  RefreshCw,
  Eye,
  Ticket as TicketIcon,
  Receipt,
  FileText
} from "lucide-react";
import { getTickets, getTransactions } from "@/lib/localStorage";
import { useParams, useNavigate } from "react-router-dom";

interface PurchaseDetails {
  id: string;
  eventName: string;
  eventDate: string;
  zone: string;
  price: number;
  purchaseDate: string;
  status: 'active' | 'used' | 'cancelled' | 'resold';
  qrCode: string;
  transactionId: string;
  paymentMethod: string;
  eventLocation: string;
  eventImage?: string;
  seatDetails: {
    section: string;
    row?: string;
    seat?: string;
  };
}

export const PurchaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseDetails();
  }, [id]);

  const loadPurchaseDetails = () => {
    const tickets = getTickets();
    const transactions = getTransactions();
    
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const transaction = transactions.find(t => t.id === id);
      
      // Mapear status del ticket al status de compra
      const statusMap: Record<string, 'active' | 'used' | 'cancelled' | 'resold'> = {
        'custody': 'active',
        'released': 'active', 
        'resold': 'resold'
      };
      
      setPurchase({
        id: ticket.id,
        eventName: ticket.eventName,
        eventDate: ticket.eventDate,
        zone: ticket.zone,
        price: ticket.price,
        purchaseDate: ticket.purchaseDate,
        status: statusMap[ticket.status] || 'active',
        qrCode: `GATEX-${ticket.id.toUpperCase()}`,
        transactionId: transaction?.id || `TXN-${Date.now()}`,
        paymentMethod: 'Tarjeta de Crédito',
        eventLocation: 'Estadio Nacional, Lima',
        seatDetails: {
          section: ticket.zone,
          row: `${Math.floor(Math.random() * 20) + 1}`,
          seat: `${Math.floor(Math.random() * 30) + 1}`
        }
      });
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
      used: { label: 'Usado', color: 'bg-gray-100 text-gray-800' },
      cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      resold: { label: 'Revendido', color: 'bg-blue-100 text-blue-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleDownloadPDF = () => {
    // Simular descarga de PDF
    const element = document.createElement('a');
    element.href = `data:text/plain;charset=utf-8,TICKET DIGITAL - ${purchase?.eventName}\nZona: ${purchase?.zone}\nFecha: ${purchase?.eventDate}\nCódigo QR: ${purchase?.qrCode}`;
    element.download = `ticket-${purchase?.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleResell = () => {
    navigate('/resale', { state: { ticketId: purchase?.id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center p-8">
              <TicketIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ticket no encontrado</h2>
              <p className="text-muted-foreground mb-4">
                No se pudo encontrar la información de este ticket
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Detalles de Compra</h1>
              <p className="text-muted-foreground">
                Información completa de tu ticket
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ticket Visual */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-accent p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{purchase.eventName}</h2>
                    <p className="text-primary-foreground/80">{purchase.eventLocation}</p>
                  </div>
                  {getStatusBadge(purchase.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-foreground/70">Fecha</p>
                    <p className="font-semibold">{new Date(purchase.eventDate).toLocaleDateString('es-PE', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Hora</p>
                    <p className="font-semibold">20:00</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Zona</p>
                    <p className="font-semibold">{purchase.zone}</p>
                  </div>
                  <div>
                    <p className="text-primary-foreground/70">Precio</p>
                    <p className="font-semibold">S/ {purchase.price}</p>
                  </div>
                </div>
              </div>
              
              {/* QR Code Section */}
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-100 mx-auto mb-4 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                    {purchase.qrCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Presenta este código QR en el evento
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detalles y Acciones */}
            <div className="space-y-6">
              {/* Información del Asiento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                    Información del Asiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sección</p>
                      <p className="font-semibold">{purchase.seatDetails.section}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fila</p>
                      <p className="font-semibold">Fila {purchase.seatDetails.row}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Asiento</p>
                      <p className="font-semibold">Asiento {purchase.seatDetails.seat}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      {getStatusBadge(purchase.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Compra */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="h-5 w-5 mr-2 text-primary" />
                    Detalles de la Transacción
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID de Transacción:</span>
                      <span className="font-mono text-sm">{purchase.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fecha de Compra:</span>
                      <span className="text-sm">{new Date(purchase.purchaseDate).toLocaleDateString('es-PE')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Método de Pago:</span>
                      <span className="text-sm">{purchase.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total Pagado:</span>
                      <span className="font-semibold text-lg">S/ {purchase.price}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones */}
              <div className="space-y-3">
                <Button className="w-full" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Ticket PDF
                </Button>
                
                {purchase.status === 'active' && (
                  <Button variant="outline" className="w-full" onClick={handleResell}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Revender Ticket
                  </Button>
                )}
                
                <Button variant="outline" className="w-full">
                  <Star className="h-4 w-4 mr-2" />
                  Calificar Evento
                </Button>
              </div>
            </div>
          </div>

          {/* Información Adicional */}
          <Tabs defaultValue="event-info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="event-info">Información del Evento</TabsTrigger>
              <TabsTrigger value="policies">Políticas</TabsTrigger>
              <TabsTrigger value="support">Soporte</TabsTrigger>
            </TabsList>

            <TabsContent value="event-info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Evento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Ubicación</h4>
                      <p className="text-sm text-muted-foreground">
                        📍 {purchase.eventLocation}<br/>
                        Lima, Perú
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Horarios</h4>
                      <p className="text-sm text-muted-foreground">
                        🕐 Apertura de puertas: 18:00<br/>
                        ⚽ Inicio del partido: 20:00
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Descripción</h4>
                    <p className="text-sm text-muted-foreground">
                      Partido correspondiente a las Eliminatorias Sudamericanas para el Mundial 2026. 
                      Un encuentro histórico entre dos grandes equipos del fútbol sudamericano.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="policies" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Políticas y Términos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">⚠️ Políticas de Cancelación</h4>
                    <p className="text-sm text-muted-foreground">
                      • No se permiten cancelaciones 48 horas antes del evento<br/>
                      • Reembolsos sujetos a políticas del organizador<br/>
                      • Cambios de fecha por decisión del organizador no afectan la validez del ticket
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">🎫 Reventa</h4>
                    <p className="text-sm text-muted-foreground">
                      • Puedes revender tu ticket a través de nuestra plataforma<br/>
                      • Comisión del 5% sobre el precio de reventa<br/>
                      • El ticket original se invalida automáticamente
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Centro de Ayuda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">📞 Contacto</h4>
                      <p className="text-sm text-muted-foreground">
                        WhatsApp: +51 999 888 777<br/>
                        Email: soporte@gatex.pe<br/>
                        Horario: 9:00 - 22:00
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">❓ Preguntas Frecuentes</h4>
                      <p className="text-sm text-muted-foreground">
                        • ¿Qué pasa si pierdo mi QR?<br/>
                        • ¿Puedo transferir mi ticket?<br/>
                        • ¿Cómo funciona la reventa?
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Preguntas Frecuentes Completas
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};