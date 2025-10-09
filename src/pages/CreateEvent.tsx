import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveEvent } from "@/lib/localStorage";

interface Zone {
  name: string;
  price: number;
  available: number;
}

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&h=600&fit=crop",
    description: "",
  });

  const [zones, setZones] = useState<Zone[]>([
    { name: "", price: 0, available: 0 }
  ]);

  const addZone = () => {
    setZones([...zones, { name: "", price: 0, available: 0 }]);
  };

  const removeZone = (index: number) => {
    setZones(zones.filter((_, i) => i !== index));
  };

  const updateZone = (index: number, field: keyof Zone, value: string | number) => {
    const newZones = [...zones];
    newZones[index] = { ...newZones[index], [field]: value };
    setZones(newZones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.location) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const validZones = zones.filter(z => z.name && z.price > 0 && z.available > 0);
    
    if (validZones.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos una zona válida",
        variant: "destructive",
      });
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      ...formData,
      zones: validZones,
    };

    saveEvent(newEvent);

    toast({
      title: "¡Evento creado!",
      description: "Tu evento ha sido publicado exitosamente",
    });

    setTimeout(() => navigate("/organizer"), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Crear Nuevo Evento</h1>
            <p className="text-muted-foreground">Configura tu evento deportivo con zonas y precios personalizados</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="glass-card p-6 mb-6 animate-fade-in-up">
              <h2 className="text-xl font-bold mb-4">Información del Evento</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Nombre del Evento *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Final Copa América 2025"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Fecha y Hora *</Label>
                    <Input
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      placeholder="15 Julio 2025, 20:00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Estadio Monumental, Buenos Aires"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">URL de Imagen</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe tu evento..."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Zonas y Precios</h2>
                <Button type="button" variant="outline" size="sm" onClick={addZone}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Zona
                </Button>
              </div>

              <div className="space-y-4">
                {zones.map((zone, index) => (
                  <div key={index} className="p-4 bg-background/50 rounded-lg border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`zone-name-${index}`}>Nombre de Zona</Label>
                          <Input
                            id={`zone-name-${index}`}
                            value={zone.name}
                            onChange={(e) => updateZone(index, "name", e.target.value)}
                            placeholder="Tribuna VIP"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`zone-price-${index}`}>Precio ($)</Label>
                          <Input
                            id={`zone-price-${index}`}
                            type="number"
                            value={zone.price || ""}
                            onChange={(e) => updateZone(index, "price", parseFloat(e.target.value) || 0)}
                            placeholder="250"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`zone-available-${index}`}>Capacidad</Label>
                          <Input
                            id={`zone-available-${index}`}
                            type="number"
                            value={zone.available || ""}
                            onChange={(e) => updateZone(index, "available", parseInt(e.target.value) || 0)}
                            placeholder="100"
                          />
                        </div>
                      </div>
                      {zones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeZone(index)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/organizer")}>
                Cancelar
              </Button>
              <Button type="submit" variant="hero" className="flex-1">
                Publicar Evento
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEvent;
