import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  ArrowRight, 
  IdCard, 
  Mail, 
  Phone, 
  AlertTriangle,
  Check,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketTransferProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    eventName: string;
    eventDate: string;
    zone: string;
    seat?: string;
    price: number;
  };
  onTransferComplete: (transferData: any) => void;
}

export const TicketTransfer = ({ isOpen, onClose, ticket, onTransferComplete }: TicketTransferProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [transferData, setTransferData] = useState({
    // Datos del destinatario
    recipientName: "",
    recipientLastName: "",
    recipientDni: "",
    recipientEmail: "",
    recipientPhone: "",
    
    // Motivo de transferencia
    reason: "",
    
    // Confirmación
    confirmTransfer: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setTransferData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    return transferData.recipientName.trim() !== "" &&
           transferData.recipientLastName.trim() !== "" &&
           transferData.recipientDni.trim() !== "" &&
           transferData.recipientDni.length === 8 &&
           transferData.recipientEmail.trim() !== "" &&
           transferData.recipientPhone.trim() !== "";
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleTransfer = async () => {
    if (!validateEmail(transferData.recipientEmail)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular proceso de transferencia
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transferInfo = {
        ...transferData,
        ticketId: ticket.id,
        transferDate: new Date().toISOString(),
        originalOwner: JSON.parse(localStorage.getItem('gatex_user_profile') || '{}'),
        transferId: `TRF-${Date.now()}`
      };

      // Guardar la transferencia en localStorage
      const transfers = JSON.parse(localStorage.getItem('gatex_ticket_transfers') || '[]');
      transfers.push(transferInfo);
      localStorage.setItem('gatex_ticket_transfers', JSON.stringify(transfers));

      onTransferComplete(transferInfo);

      toast({
        title: "¡Transferencia completada!",
        description: `El ticket ha sido transferido exitosamente a ${transferData.recipientName} ${transferData.recipientLastName}`,
      });

      // Reset y cerrar
      setTransferData({
        recipientName: "",
        recipientLastName: "",
        recipientDni: "",
        recipientEmail: "",
        recipientPhone: "",
        reason: "",
        confirmTransfer: false,
      });
      setStep(1);
      onClose();

    } catch (error) {
      toast({
        title: "Error en transferencia",
        description: "Hubo un problema al procesar la transferencia. Inténtalo nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Transferir Ticket
          </DialogTitle>
        </DialogHeader>

        {/* Información del ticket */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-base">{ticket.eventName}</h3>
              <p className="text-sm text-muted-foreground">{ticket.eventDate}</p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">{ticket.zone}</Badge>
                {ticket.seat && <Badge variant="outline" className="text-xs">Asiento: {ticket.seat}</Badge>}
                <Badge className="bg-green-100 text-green-800 text-xs">S/ {ticket.price}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Paso 1: Datos del destinatario */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
                1
              </div>
              <h3 className="text-base font-semibold">Datos del destinatario</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="recipientName">Nombres *</Label>
                <Input
                  id="recipientName"
                  value={transferData.recipientName}
                  onChange={(e) => handleInputChange("recipientName", e.target.value)}
                  placeholder="Ej: Juan Carlos"
                />
              </div>
              <div>
                <Label htmlFor="recipientLastName">Apellidos *</Label>
                <Input
                  id="recipientLastName"
                  value={transferData.recipientLastName}
                  onChange={(e) => handleInputChange("recipientLastName", e.target.value)}
                  placeholder="Ej: García López"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="recipientDni" className="text-sm">DNI *</Label>
                <div className="relative">
                  <IdCard className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="recipientDni"
                    value={transferData.recipientDni}
                    onChange={(e) => handleInputChange("recipientDni", e.target.value)}
                    placeholder="12345678"
                    className="pl-7 h-8 text-sm"
                    maxLength={8}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="recipientPhone" className="text-sm">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                  <Input
                    id="recipientPhone"
                    value={transferData.recipientPhone}
                    onChange={(e) => handleInputChange("recipientPhone", e.target.value)}
                    placeholder="987654321"
                    className="pl-7 h-8 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="recipientEmail" className="text-sm">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
                <Input
                  id="recipientEmail"
                  type="email"
                  value={transferData.recipientEmail}
                  onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                  placeholder="juan.garcia@email.com"
                  className="pl-7 h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={() => setStep(2)}
                disabled={!validateStep1()}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Motivo y confirmación */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-sm font-bold">
                2
              </div>
              <h3 className="text-base font-semibold">Confirmación de transferencia</h3>
            </div>

            <div>
              <Label htmlFor="reason" className="text-sm">Motivo de transferencia (opcional)</Label>
              <Textarea
                id="reason"
                value={transferData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                placeholder="Ej: No puedo asistir por motivos de trabajo..."
                rows={2}
                className="text-sm"
              />
            </div>

            {/* Resumen */}
            <Card>
              <CardContent className="pt-3">
                <h4 className="font-medium mb-2 text-sm">Resumen de transferencia</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">A:</span>
                    <span className="font-medium">
                      {transferData.recipientName} {transferData.recipientLastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">DNI:</span>
                    <span className="font-medium">{transferData.recipientDni}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium text-xs">{transferData.recipientEmail}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advertencia */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Acción irreversible
                    </p>
                    <p className="text-xs text-orange-700">
                      Solo puedes transferir una vez • El destinatario recibirá el ticket con su nombre
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Confirmación */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="confirmTransfer"
                checked={transferData.confirmTransfer}
                onChange={(e) => handleInputChange("confirmTransfer", e.target.checked)}
                className="rounded border-gray-300 mt-0.5"
              />
              <Label htmlFor="confirmTransfer" className="text-xs leading-tight">
                Confirmo que deseo transferir este ticket y acepto los términos
              </Label>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Volver
              </Button>
              <Button 
                onClick={handleTransfer}
                disabled={!transferData.confirmTransfer || isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar transferencia
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};