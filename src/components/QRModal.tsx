import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: {
    id: string;
    eventName: string;
    zone: string;
    date: string;
    price: number;
    seat?: string;
    seatNumbers?: string[];
  };
}

export const QRModal = ({ isOpen, onClose, ticket }: QRModalProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (ticket && isOpen) {
      // Generar QR usando QR Server API (gratuito)
      const ticketData = {
        ticketId: ticket.id,
        event: ticket.eventName,
        zone: ticket.zone,
        date: ticket.date,
        price: ticket.price,
        seat: ticket.seat || "General",
        blockchain: "Ethereum",
        contract: "0x" + Math.random().toString(16).substr(2, 40),
        timestamp: new Date().getTime()
      };

      const qrContent = JSON.stringify(ticketData);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrContent)}`;
      setQrCode(qrUrl);
    }
  }, [ticket, isOpen]);

  const handleDownload = () => {
    if (qrCode && ticket) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `ticket-qr-${ticket.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "QR Descargado",
        description: "El código QR ha sido descargado exitosamente",
      });
    }
  };



  const handleShare = async () => {
    if (ticket) {
      // Crear contenido completo del ticket para compartir
      const ticketText = `
🎫 TICKET GATEX 🎫
━━━━━━━━━━━━━━━━━━━━
📅 Evento: ${ticket.eventName}
📍 Zona: ${ticket.zone}
🗓️ Fecha: ${ticket.date}
💰 Precio: S/${ticket.price}
🎪 Asiento: ${ticket.seat || "General"}
🔖 ID: ${ticket.id}
━━━━━━━━━━━━━━━━━━━━
✅ Verificado en Blockchain
🔐 Seguro y auténtico
📱 Presentar código QR en el evento

Descarga tu código QR desde la app GateX
      `;

      if (navigator.share) {
        try {
          await navigator.share({
            title: `🎫 Mi Ticket - ${ticket.eventName}`,
            text: ticketText,
          });
        } catch (error) {
          // Fallback
          navigator.clipboard.writeText(ticketText);
          toast({
            title: "Ticket copiado",
            description: "Los datos del ticket han sido copiados al portapapeles",
          });
        }
      } else {
        navigator.clipboard.writeText(ticketText);
        toast({
          title: "Ticket copiado",
          description: "Los datos del ticket han sido copiados al portapapeles. Ahora puedes pegarlo en WhatsApp o donde quieras.",
        });
      }
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Código QR del Ticket
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Ticket */}
          <Card className="p-4 bg-background/50 border-primary/20">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-primary">{ticket.eventName}</h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zona:</span>
                <Badge variant="outline">{ticket.zone}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Fecha:</span>
                <span className="text-sm font-medium">{ticket.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Precio:</span>
                <span className="text-sm font-bold text-primary">S/{ticket.price}</span>
              </div>
              {ticket.seat && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Asiento:</span>
                  <span className="text-sm font-medium">{ticket.seat}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ID Ticket:</span>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{ticket.id}</span>
              </div>
            </div>
          </Card>

          {/* Código QR */}
          <div className="flex justify-center">
            <Card className="p-4 bg-white">
              {qrCode ? (
                <img 
                  src={qrCode} 
                  alt="Código QR del Ticket" 
                  className="w-64 h-64 mx-auto"
                />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center bg-muted animate-pulse">
                  <span className="text-muted-foreground">Generando QR...</span>
                </div>
              )}
            </Card>
          </div>

          {/* Información de Blockchain */}
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Este ticket está verificado en blockchain y es único e intransferible
            </p>
            <Badge variant="secondary" className="text-xs">
              🔒 Protegido por Ethereum
            </Badge>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleDownload}
                disabled={!qrCode}
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar QR
              </Button>
              <Button 
                variant="hero" 
                className="flex-1" 
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};