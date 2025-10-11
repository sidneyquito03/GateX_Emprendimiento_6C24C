import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  availableTickets: number;
  minPrice: number;
}

export const EventCard = ({ 
  id,
  title, 
  date, 
  location, 
  image, 
  availableTickets,
  minPrice 
}: EventCardProps) => {
  // Verificar si es el evento "Eliminatorias Mundial"
  const isWorldCupQualifier = title.includes("Eliminatorias Mundial");
  
  return (
    <Card className={`glass-card overflow-hidden group animate-fade-in-up hover:shadow-xl transition-all duration-300 ${isWorldCupQualifier ? 'border-blue-400 dark:border-blue-600' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold mb-1">{title}</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {availableTickets} tickets disponibles
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-sm text-muted-foreground">Desde</p>
            <p className="text-xl font-bold text-primary">S/{minPrice.toFixed(2)}</p>
          </div>
          <Link to={`/event/${id}`}>
            <Button variant="hero" size="sm">
              Ver Detalles
            </Button>
          </Link>
        </div>
        
        {isWorldCupQualifier && (
          <div className="mt-2 w-full py-1 px-2 bg-blue-100 dark:bg-blue-900/40 rounded text-center">
            <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
              ⚽ Evento Destacado
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
