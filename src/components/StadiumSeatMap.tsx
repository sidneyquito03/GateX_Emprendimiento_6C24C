import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock, Star } from "lucide-react";

interface StadiumSeatMapProps {
  eventName: string;
  onSeatSelect: (zone: string, price: number) => void;
}

export const StadiumSeatMap = ({ eventName, onSeatSelect }: StadiumSeatMapProps) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  const zones = [
    { 
      id: "campo", 
      name: "CAMPO", 
      price: 150.00, 
      color: "#4CAF50", 
      available: true,
      capacity: "Capacidad: 500",
      description: "Zona de pie cerca del campo"
    },
    { 
      id: "occidente-baja", 
      name: "OCCIDENTE BAJA", 
      price: 100.00, 
      color: "#dc143c", 
      available: true,
      capacity: "Capacidad: 1,200", 
      description: "Lateral oeste, nivel bajo"
    },
    { 
      id: "occidente-alta", 
      name: "OCCIDENTE ALTA", 
      price: 80.00, 
      color: "#8b0000", 
      available: true,
      capacity: "Capacidad: 800",
      description: "Lateral oeste, nivel alto"
    },
    { 
      id: "oriente-baja", 
      name: "ORIENTE BAJA", 
      price: 60.00, 
      color: "#daa520", 
      available: true,
      capacity: "Capacidad: 1,200",
      description: "Lateral este, nivel bajo"
    },
    { 
      id: "oriente-alta", 
      name: "ORIENTE ALTA", 
      price: 50.00, 
      color: "#f4a460", 
      available: false, // Agotado como en la imagen
      capacity: "AGOTADO",
      description: "Lateral este, nivel alto"
    },
    { 
      id: "norte", 
      name: "NORTE", 
      price: 40.00, 
      color: "#b22222", 
      available: true,
      capacity: "Capacidad: 3,000",
      description: "Tribuna norte popular"
    },
    { 
      id: "sur", 
      name: "SUR", 
      price: 40.00, 
      color: "#ff6347", 
      available: true,
      capacity: "Capacidad: 3,000", 
      description: "Tribuna sur popular"
    },

  ];

  const handleZoneClick = (zone: any) => {
    if (!zone.available) return;
    setSelectedZone(zone.id);
    onSeatSelect(zone.name, zone.price);
  };

  const getZoneById = (id: string) => zones.find(z => z.id === id);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{eventName}</h2>
        <p className="text-muted-foreground">Selecciona tu zona preferida • Solo eventos deportivos • Mapa referencial</p>
        <Badge className="mt-2 bg-green-600 text-white">⚽ EVENTO DEPORTIVO</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Mapa del estadio */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-gradient-to-br from-slate-900 via-red-900 to-red-800 text-white shadow-2xl border-2 border-red-700">
            <div className="relative aspect-video">
              <svg viewBox="0 0 600 400" className="w-full h-full drop-shadow-xl">
                {/* Gradientes y sombras */}
                <defs>
                  <radialGradient id="fieldGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#228B22" />
                    <stop offset="50%" stopColor="#1e7b1e" />
                    <stop offset="100%" stopColor="#0f5f0f" />
                  </radialGradient>
                  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                  <linearGradient id="stadiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1a1a" />
                    <stop offset="100%" stopColor="#333333" />
                  </linearGradient>
                </defs>
                
                {/* Fondo del estadio */}
                <rect x="50" y="20" width="500" height="360" fill="url(#stadiumGradient)" rx="20" />
                
                {/* Campo de fútbol mejorado */}
                <rect x="180" y="120" width="240" height="160" fill="url(#fieldGradient)" stroke="#fff" strokeWidth="3" rx="12" filter="url(#shadow)" />
                
                {/* Líneas del campo más detalladas */}
                <line x1="300" y1="120" x2="300" y2="280" stroke="#fff" strokeWidth="2" />
                <circle cx="300" cy="200" r="35" fill="none" stroke="#fff" strokeWidth="2" />
                <circle cx="300" cy="200" r="3" fill="#fff" />
                
                {/* Áreas de gol */}
                <rect x="180" y="170" width="20" height="60" fill="none" stroke="#fff" strokeWidth="2" />
                <rect x="400" y="170" width="20" height="60" fill="none" stroke="#fff" strokeWidth="2" />
                <rect x="180" y="185" width="10" height="30" fill="none" stroke="#fff" strokeWidth="1" />
                <rect x="410" y="185" width="10" height="30" fill="none" stroke="#fff" strokeWidth="1" />
                
                {/* Esquinas */}
                <circle cx="180" cy="120" r="5" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="420" cy="120" r="5" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="180" cy="280" r="5" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="420" cy="280" r="5" fill="none" stroke="#fff" strokeWidth="1" />
                
                <text x="300" y="205" textAnchor="middle" className="fill-white text-sm font-bold drop-shadow-lg">CAMPO DE JUEGO</text>
                
                {/* Zonas clickeables */}
                
                {/* Oriente Alta */}
                <path 
                  d="M 110 60 Q 300 40 490 60 L 490 100 Q 300 80 110 100 Z" 
                  fill={getZoneById('oriente-alta')?.color} 
                  stroke="#fff" 
                  strokeWidth="2" 
                  className={`cursor-pointer transition-all duration-200 ${
                    !getZoneById('oriente-alta')?.available ? 'opacity-50' : 
                    hoveredZone === 'oriente-alta' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('oriente-alta'))}
                  onMouseEnter={() => setHoveredZone('oriente-alta')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="300" y="85" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
                  ORIENTE ALTA
                </text>
                {!getZoneById('oriente-alta')?.available && (
                  <text x="300" y="75" textAnchor="middle" className="fill-red-300 text-xs font-bold pointer-events-none">
                    AGOTADO
                  </text>
                )}
                
                {/* Oriente Baja */}
                <path 
                  d="M 130 100 Q 300 90 470 100 L 470 120 Q 300 115 130 120 Z" 
                  fill={getZoneById('oriente-baja')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'oriente-baja' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('oriente-baja'))}
                  onMouseEnter={() => setHoveredZone('oriente-baja')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="300" y="112" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
                  ORIENTE BAJA
                </text>

                {/* Norte */}
                <path 
                  d="M 60 100 L 60 300 Q 80 320 110 300 L 110 100 Q 80 80 60 100 Z" 
                  fill={getZoneById('norte')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'norte' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('norte'))}
                  onMouseEnter={() => setHoveredZone('norte')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="85" y="200" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none" transform="rotate(-90 85 200)">
                  NORTE
                </text>

                {/* Sur */}
                <path 
                  d="M 490 100 L 490 300 Q 510 320 540 300 L 540 100 Q 520 80 490 100 Z" 
                  fill={getZoneById('sur')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'sur' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('sur'))}
                  onMouseEnter={() => setHoveredZone('sur')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="515" y="200" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none" transform="rotate(90 515 200)">
                  SUR
                </text>

                {/* Occidente Baja */}
                <path 
                  d="M 130 280 Q 300 285 470 280 L 470 300 Q 300 310 130 300 Z" 
                  fill={getZoneById('occidente-baja')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'occidente-baja' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('occidente-baja'))}
                  onMouseEnter={() => setHoveredZone('occidente-baja')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="300" y="295" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
                  OCCIDENTE BAJA
                </text>

                {/* Occidente Alta */}
                <path 
                  d="M 110 300 Q 300 320 490 300 L 490 340 Q 300 360 110 340 Z" 
                  fill={getZoneById('occidente-alta')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'occidente-alta' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('occidente-alta'))}
                  onMouseEnter={() => setHoveredZone('occidente-alta')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="300" y="325" textAnchor="middle" className="fill-white text-xs font-bold pointer-events-none">
                  OCCIDENTE ALTA
                </text>

                {/* Campo - Zona superior */}
                <path 
                  d="M 80 30 Q 300 10 520 30 L 520 60 Q 300 40 80 60 Z" 
                  fill={getZoneById('campo')?.color}
                  stroke="#fff" 
                  strokeWidth="2"
                  className={`cursor-pointer transition-all duration-200 ${
                    hoveredZone === 'campo' ? 'opacity-90 filter brightness-110' : 'opacity-80'
                  }`}
                  onClick={() => handleZoneClick(getZoneById('campo'))}
                  onMouseEnter={() => setHoveredZone('campo')}
                  onMouseLeave={() => setHoveredZone(null)}
                />
                <text x="300" y="50" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none">
                  CAMPO
                </text>
              </svg>
              
              <div className="absolute bottom-4 left-4 text-white text-xs">
                <p className="font-semibold">*MAPA REFERENCIAL</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Panel de información */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                SECTORES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedZone === zone.id 
                      ? 'border-primary bg-primary/10' 
                      : zone.available 
                        ? 'border-border hover:border-primary/50 hover:bg-accent/50' 
                        : 'border-red-300 bg-red-50 opacity-60 cursor-not-allowed'
                  }`}
                  onClick={() => handleZoneClick(zone)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: zone.color }}
                      />
                      <div>
                        <span className="font-semibold text-sm">{zone.name}</span>

                      </div>
                    </div>
                    {zone.available ? (
                      <span className="text-lg font-bold">S/{zone.price.toFixed(2)}</span>
                    ) : (
                      <Badge variant="destructive" className="text-xs">AGOTADO</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{zone.capacity}</p>
                  <p className="text-xs text-muted-foreground">{zone.description}</p>
                  {selectedZone === zone.id && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-primary font-medium">✓ Zona seleccionada</p>
                    </div>
                  )}
                </div>
              ))}
              

            </CardContent>
          </Card>

          {selectedZone && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Resumen de Selección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Zona:</span>
                    <span className="font-semibold">{getZoneById(selectedZone)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Precio:</span>
                    <span className="font-semibold">S/{getZoneById(selectedZone)?.price}.00</span>
                  </div>
                  <div className="pt-2 border-t">
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        const zone = getZoneById(selectedZone);
                        if (zone) onSeatSelect(zone.name, zone.price);
                      }}
                    >
                      Continuar con {getZoneById(selectedZone)?.name}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StadiumSeatMap;