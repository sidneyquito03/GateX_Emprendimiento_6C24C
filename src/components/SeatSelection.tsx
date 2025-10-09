import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, CheckCircle, X } from "lucide-react";

interface SeatSelectionProps {
  zoneName: string;
  zonePrice: number;
  onBack: () => void;
  onConfirmSelection: (seats: string[], totalPrice: number) => void;
}

export const SeatSelection = ({ zoneName, zonePrice, onBack, onConfirmSelection }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatQuantity, setSeatQuantity] = useState<number>(1);

  const [occupiedSeats] = useState(() => {
    const occupied = new Set<string>();
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 20;
    
    for (let row of rows) {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        if (Math.random() < 0.3) {
          occupied.add(row + seatNum);
        }
      }
    }
    
    return occupied;
  });

  const handleSeatClick = (seatId: string) => {
    const isOccupied = occupiedSeats.has(seatId);
    if (isOccupied) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else if (selectedSeats.length < seatQuantity) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const totalPrice = selectedSeats.length * zonePrice;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{zoneName}</h2>
            <p className="text-sm text-muted-foreground">Selecciona tus asientos específicos</p>
          </div>
        </div>
        <Badge className="text-base sm:text-lg px-3 py-2">
          S/ {zonePrice} por asiento
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Card className="p-4">
            <div className="mb-6">
              <div className="bg-green-600 text-white text-center py-4 rounded-lg mb-6">
                <h3 className="font-bold text-lg">CAMPO DE JUEGO</h3>
                <p className="text-sm opacity-90">Zona: {zoneName}</p>
              </div>
              
              <div className="flex justify-center gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Ocupado</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                    <div key={row} className="flex items-center justify-center gap-1">
                      <div className="w-8 text-center font-bold text-sm">{row}</div>
                      <div className="flex gap-1">
                        {Array.from({ length: 20 }, (_, i) => {
                          const seatId = row + (i + 1);
                          const isOccupied = occupiedSeats.has(seatId);
                          const isSelected = selectedSeats.includes(seatId);
                          
                          return (
                            <div
                              key={seatId}
                              className={
                                "w-8 h-8 rounded-md flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all " + 
                                (isOccupied 
                                  ? "bg-red-500 cursor-not-allowed"
                                  : isSelected 
                                    ? "bg-green-500 border-2 border-green-300 scale-105"
                                    : "bg-blue-500 hover:bg-blue-600")
                              }
                              onClick={() => handleSeatClick(seatId)}
                              title={"Asiento " + seatId}
                            >
                              {i + 1}
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-8 text-center font-bold text-sm">{row}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cantidad de Asientos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (seatQuantity > 1) {
                      setSeatQuantity(seatQuantity - 1);
                      if (selectedSeats.length > seatQuantity - 1) {
                        setSelectedSeats(selectedSeats.slice(0, seatQuantity - 1));
                      }
                    }
                  }}
                  disabled={seatQuantity <= 1}
                >
                  -
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold">{seatQuantity}</span>
                  <p className="text-xs text-muted-foreground">asiento(s)</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSeatQuantity(Math.min(seatQuantity + 1, 8))}
                  disabled={seatQuantity >= 8}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Máximo 8 asientos por compra
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Asientos Seleccionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSeats.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Selecciona {seatQuantity} asiento(s) en el mapa
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSeats.map(seatId => (
                    <div key={seatId} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 p-3 rounded-lg">
                      <span className="font-medium text-green-800 dark:text-green-200">Asiento {seatId}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleSeatClick(seatId)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>S/ {totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Comisión:</span>
                  <span>S/ {(totalPrice * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>S/ {(totalPrice * 1.05).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Asientos Juntos</p>
                  <p className="text-blue-700">
                    Para mejor experiencia, selecciona asientos consecutivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 bg-background border-t pt-4">
        <Button 
          className={
            "w-full text-white font-bold " + 
            (selectedSeats.length > 0 && selectedSeats.length === seatQuantity
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-gray-400 cursor-not-allowed")
          }
          size="lg"
          disabled={selectedSeats.length === 0 || selectedSeats.length !== seatQuantity}
          onClick={() => {
            if (selectedSeats.length === seatQuantity) {
              onConfirmSelection(selectedSeats, totalPrice * 1.05);
            }
          }}
        >
          {selectedSeats.length === 0 
            ? "🎫 Selecciona tus asientos primero"
            : selectedSeats.length !== seatQuantity
            ? "⚠️ Selecciona " + (seatQuantity - selectedSeats.length) + " asiento(s) más"
            : "✅ COMPRAR " + selectedSeats.length + " ASIENTO(S) - S/ " + (totalPrice * 1.05).toFixed(2)
          }
        </Button>
      </div>
    </div>
  );
};