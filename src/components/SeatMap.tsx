import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from "lucide-react";

interface SeatMapProps {
  eventName: string;
  onSeatSelect: (zone: string, price: number) => void;
}

export const SeatMap = ({ eventName, onSeatSelect }: SeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const zones = [
    { id: "general", name: "GENERAL", price: 50, color: "#FFA500", available: true },
    { id: "occidente-baja", name: "OCCIDENTE BAJA", price: 40, color: "#DC143C", available: true },
    { id: "occidente-alta", name: "OCCIDENTE ALTA", price: 30, color: "#DC143C", available: true },
    { id: "oriente-baja", name: "ORIENTE BAJA", price: 25, color: "#DEB887", available: false },
    { id: "oriente-alta", name: "ORIENTE ALTA", price: 25, color: "#DEB887", available: true },
    { id: "norte", name: "NORTE", price: 15, color: "#FF6B6B", available: true },
    { id: "sur", name: "SUR", price: 15, color: "#FF6B6B", available: true },
  ];

  const handleZoneClick = (zone: any) => {
    if (!zone.available) return;
    setSelectedZone(zone.id);
    onSeatSelect(zone.name, zone.price);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{eventName}</h2>
        <p className="text-muted-foreground">Selecciona tu zona preferida</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Mapa del estadio */}
        <div className="relative">
          <div className="aspect-square max-w-md mx-auto relative">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Campo/Escenario */}
              <rect x="150" y="150" width="100" height="60" fill="#90EE90" stroke="#333" strokeWidth="2" rx="5" />
              <text x="200" y="185" textAnchor="middle" className="fill-current text-xs font-semibold">CAMPO</text>
              
              {/* Zonas del estadio */}
              
              {/* Oriente Alta */}
              <path d="M 120 80 Q 200 60 280 80 L 280 120 Q 200 100 120 120 Z" 
                    fill="#DEB887" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'oriente-alta' ? 'opacity-100' : 'opacity-80'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'oriente-alta'))} />
              <text x="200" y="95" textAnchor="middle" className="fill-current text-xs font-semibold pointer-events-none">ORIENTE ALTA</text>
              
              {/* Oriente Baja */}
              <path d="M 140 120 Q 200 110 260 120 L 260 150 L 140 150 Z" 
                    fill="#8B7355" stroke="#333" strokeWidth="2" 
                    className={`cursor-not-allowed opacity-50`} />
              <text x="200" y="140" textAnchor="middle" className="fill-current text-xs font-semibold pointer-events-none">ORIENTE BAJA</text>
              <text x="200" y="155" textAnchor="middle" className="fill-current text-xs text-red-500 font-bold pointer-events-none">AGOTADO</text>
              
              {/* Occidente Baja */}
              <path d="M 140 250 L 260 250 L 260 280 Q 200 290 140 280 Z" 
                    fill="#DC143C" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'occidente-baja' ? 'opacity-100' : 'opacity-80'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'occidente-baja'))} />
              <text x="200" y="270" textAnchor="middle" className="fill-white text-xs font-semibold pointer-events-none">OCCIDENTE BAJA</text>
              
              {/* Occidente Alta */}
              <path d="M 120 280 Q 200 300 280 280 L 280 320 Q 200 340 120 320 Z" 
                    fill="#DC143C" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'occidente-alta' ? 'opacity-100' : 'opacity-80'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'occidente-alta'))} />
              <text x="200" y="305" textAnchor="middle" className="fill-white text-xs font-semibold pointer-events-none">OCCIDENTE ALTA</text>
              
              {/* Norte */}
              <path d="M 80 120 Q 60 200 80 280 L 120 280 L 120 120 Z" 
                    fill="#FF6B6B" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'norte' ? 'opacity-100' : 'opacity-80'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'norte'))} />
              <text x="100" y="200" textAnchor="middle" className="fill-white text-xs font-semibold pointer-events-none" transform="rotate(-90 100 200)">NORTE</text>
              
              {/* Sur */}
              <path d="M 280 120 L 320 120 Q 340 200 320 280 L 280 280 Z" 
                    fill="#FF6B6B" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'sur' ? 'opacity-100' : 'opacity-80'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'sur'))} />
              <text x="300" y="200" textAnchor="middle" className="fill-white text-xs font-semibold pointer-events-none" transform="rotate(90 300 200)">SUR</text>
              
              {/* General (todo alrededor) */}
              <path d="M 80 80 Q 200 40 320 80 L 340 120 Q 360 200 340 280 L 320 320 Q 200 360 80 320 L 60 280 Q 40 200 60 120 Z M 120 120 L 280 120 L 280 280 L 120 280 Z" 
                    fill="#FFA500" fillRule="evenodd" stroke="#333" strokeWidth="2" 
                    className={`cursor-pointer transition-opacity ${selectedZone === 'general' ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}
                    onClick={() => handleZoneClick(zones.find(z => z.id === 'general'))} />
              <text x="350" y="50" textAnchor="middle" className="fill-white text-xs font-semibold pointer-events-none">GENERAL</text>
            </svg>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">*MAPA REFERENCIAL</p>
        </div>

        {/* Lista de sectores */}
        <div>
          <h3 className="text-xl font-semibold mb-4">SECTORES</h3>
          <div className="space-y-3">
            {zones.map((zone) => (
              <Card 
                key={zone.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${
                  selectedZone === zone.id 
                    ? 'border-primary shadow-lg scale-105' 
                    : zone.available 
                      ? 'border-border hover:border-primary/50 hover:shadow-md' 
                      : 'border-muted bg-muted/50 cursor-not-allowed'
                }`}
                onClick={() => zone.available && handleZoneClick(zone)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded border-2 border-white"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div>
                        <h4 className="font-medium">{zone.name}</h4>
                        {!zone.available && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            AGOTADO
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">S/ {zone.price.toFixed(2)}</p>
                      {zone.available && (
                        <p className="text-xs text-muted-foreground">Disponible</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedZone && (
            <Card className="mt-6 border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Zona Seleccionada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">{zones.find(z => z.id === selectedZone)?.name}</p>
                    <p className="text-2xl font-bold text-primary">
                      S/ {zones.find(z => z.id === selectedZone)?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Capacidad limitada</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>Venta hasta agotar stock</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <MapPin className="h-4 w-4 mr-2" />
                  Continuar con esta zona
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};