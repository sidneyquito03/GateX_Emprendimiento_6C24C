import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X } from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'revendedor';
  timestamp: Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  revendedorName: string;
  revendedorId: string;
}

export const ChatModal = ({ isOpen, onClose, revendedorName, revendedorId }: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mensajes predefinidos del revendedor para la simulación
  const revendedorResponses = [
    "Hola, ¿en qué puedo ayudarte con la entrada?",
    "Claro, el ticket está disponible. Es para Alianza Lima vs Universitario.",
    "El asiento está en Oriente Alta, Fila 15, Asiento 23.",
    "La entrada se entrega de manera digital a través de la plataforma.",
    "Puedo ofrecerte un 2% de descuento si compras hoy.",
    "Sí, tengo más entradas disponibles para ese evento.",
    "La entrada incluye acceso al estacionamiento del estadio.",
    "Gracias por tu interés, estoy para ayudarte con cualquier duda."
  ];

  useEffect(() => {
    // Si el chat está abierto, añadir un mensaje inicial del revendedor
    if (isOpen && messages.length === 0) {
      // Pequeña demora para simular que está escribiendo
      const timer = setTimeout(() => {
        setMessages([
          {
            id: "init-1",
            text: `Hola, soy ${revendedorName}. ¿En qué puedo ayudarte?`,
            sender: 'revendedor',
            timestamp: new Date()
          }
        ]);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, revendedorName]);

  // Autoscroll al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Añadir mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    
    // Simular respuesta del revendedor después de un pequeño delay
    setTimeout(() => {
      // Seleccionar una respuesta aleatoria del revendedor
      const randomResponse = revendedorResponses[Math.floor(Math.random() * revendedorResponses.length)];
      
      const revendedorMessage: ChatMessage = {
        id: `rev-${Date.now()}`,
        text: randomResponse,
        sender: 'revendedor',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, revendedorMessage]);
    }, 1000 + Math.random() * 1000); // Delay aleatorio entre 1-2 segundos
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${revendedorId}`} />
              <AvatarFallback>{revendedorName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <DialogTitle>{revendedorName}</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <p>{message.text}</p>
                <p className={`text-xs ${
                  message.sender === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                } text-right`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input para enviar mensaje */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Input 
            placeholder="Escribe un mensaje..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};