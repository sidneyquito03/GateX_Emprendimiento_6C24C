import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";

interface TicketCardProps {
  id: string;
  eventName: string;
  eventDate: string;
  zone: string;
  status: "custody" | "released" | "resold" | "resale";
  price: number;
  onViewQR?: () => void;
  onResell?: () => void;
  onViewDetails?: () => void;
}

export const TicketCard = ({ 
  id,
  eventName, 
  eventDate, 
  zone, 
  status, 
  price,
  onViewQR,
  onResell,
  onViewDetails 
}: TicketCardProps) => {
  const statusConfig = {
    custody: {
      icon: Clock,
      label: "En Custodia",
      color: "bg-accent/20 text-accent-foreground",
    },
    released: {
      icon: CheckCircle,
      label: "Liberado",
      color: "bg-success/20 text-success",
    },
    resale: {
      icon: AlertCircle,
      label: "En Reventa",
      color: "bg-primary/20 text-primary",
    },
    resold: {
      icon: CheckCircle,
      label: "Revendido",
      color: "bg-blue-400/20 text-blue-600",
    },
  };

  const StatusIcon = statusConfig[status].icon;

  return (
    <Card className="glass-card glow-on-hover p-6 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{eventName}</h3>
          <p className="text-sm text-muted-foreground">{eventDate}</p>
          <p className="text-sm text-primary font-medium">{zone}</p>
        </div>
        <Badge className={statusConfig[status].color}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {statusConfig[status].label}
        </Badge>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div>
          <p className="text-sm text-muted-foreground">Precio</p>
          <p className="text-xl font-bold text-primary">S/{price.toFixed(2)}</p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </Button>
          )}
          {onViewQR && (status === "released" || status === "resale") && (
            <Button variant="outline" size="sm" onClick={onViewQR}>
              <QrCode className="mr-2 h-4 w-4" />
              Ver QR
            </Button>
          )}
          {onResell && status === "custody" && (
            <Button variant="default" size="sm" onClick={onResell}>
              Revender
            </Button>
          )}
          {status === "resale" && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-primary/10 hover:bg-primary/20 border-primary/30"
              onClick={onViewDetails}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Ver Reventa
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
