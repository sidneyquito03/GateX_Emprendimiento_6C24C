import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQModalProps {
  trigger: React.ReactNode;
}

export const FAQModal = ({ trigger }: FAQModalProps) => {
  const [openItems, setOpenItems] = useState<number[]>([0]); // Primer item abierto por defecto

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "¿Qué es GateX?",
      answer: "GateX es una plataforma digital segura para la compra, venta y reventa de entradas para eventos deportivos, musicales y de entretenimiento. Ofrecemos verificación de autenticidad y custodia de pagos para garantizar transacciones seguras."
    },
    {
      question: "¿Cuántas entradas puedo comprar?",
      answer: "Los límites de compra dependen de tu tipo de cuenta: Usuarios Fan pueden comprar hasta 5 entradas por evento, mientras que Revendedores Verificados pueden comprar hasta 8 entradas por evento."
    },
    {
      question: "¿Cómo funciona la custodia de pagos?",
      answer: "Cuando realizas una compra, tu pago queda en custodia hasta que GateX confirme la transferencia y autenticidad del ticket. Solo entonces el dinero se libera al vendedor, garantizando que recibas un ticket válido."
    },
    {
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencias bancarias, y pagos con billeteras digitales como Yape y Plin."
    },
    {
      question: "¿Cómo funciona el mercado de reventa?",
      answer: "Puedes vender tus entradas a otros usuarios a través de nuestro mercado seguro. El precio de reventa no puede exceder el 5% del precio original para mantener un mercado justo."
    },
    {
      question: "¿Qué comisiones cobra GateX?",
      answer: "Las comisiones son: 5% del vendedor, 3% del organizador, 2% de la plataforma. Además, el comprador paga S/10.00 de gastos de servicio."
    },
    {
      question: "¿Puedo cancelar mi compra?",
      answer: "Las compras son definitivas. Solo aceptamos cancelaciones en casos excepcionales como cancelación del evento por parte del organizador. En tal caso, se procesa el reembolso automáticamente."
    },
    {
      question: "¿Cómo me convierto en Revendedor Verificado?",
      answer: "Para ser Revendedor Verificado debes completar un proceso de verificación que incluye validación de identidad, historial de transacciones positivo y cumplimiento de nuestras políticas."
    },
    {
      question: "¿Es seguro comprar en GateX?",
      answer: "Sí, totalmente seguro. Verificamos la autenticidad de todas las entradas, mantenemos los pagos en custodia y ofrecemos devolución garantizada si el ticket no es válido."
    },
    {
      question: "¿Cómo recibo mis entradas?",
      answer: "Las entradas digitales se envían por email inmediatamente después del pago. Para eventos con entradas físicas, se coordinará la entrega o podrás retirarlas en puntos autorizados."
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Preguntas Frecuentes</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Encuentra respuestas a las preguntas más comunes sobre GateX
          </p>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = openItems.includes(index);
              
              return (
                <div key={index} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-medium pr-4 text-foreground">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 flex-shrink-0 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 pb-4 text-muted-foreground leading-relaxed border-t border-border/30 bg-primary/5">
                      <div className="pt-3">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
            <h4 className="text-lg font-semibold mb-3 text-foreground">¿No encontraste tu respuesta?</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier consulta.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="text-center p-3 bg-background/50 rounded border">
                <div className="font-medium text-foreground">Email</div>
                <div className="text-muted-foreground">soporte@gatex.com</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded border">
                <div className="font-medium text-foreground">Teléfono</div>
                <div className="text-muted-foreground">+51 1 234-5678</div>
              </div>
              <div className="text-center p-3 bg-background/50 rounded border">
                <div className="font-medium text-foreground">WhatsApp</div>
                <div className="text-muted-foreground">+51 987 654 321</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};