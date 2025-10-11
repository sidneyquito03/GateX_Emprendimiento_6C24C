import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface TermsModalProps {
  trigger: React.ReactNode;
}

export const TermsModal = ({ trigger }: TermsModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Términos y Condiciones</DialogTitle>
          <p className="text-sm text-muted-foreground">Última actualización: 10 de octubre de 2025</p>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">1. Aceptación de los Términos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Al acceder y utilizar GateX, usted acepta cumplir con estos términos y condiciones. 
                Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">2. Descripción del Servicio</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GateX es una plataforma digital que facilita la compra, venta y reventa de entradas 
                para eventos deportivos, musicales y de entretenimiento. Ofrecemos:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Venta de entradas oficiales para eventos</li>
                <li>Mercado de reventa seguro entre usuarios</li>
                <li>Verificación de autenticidad de entradas</li>
                <li>Custodia de pagos para transacciones seguras</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">3. Registro de Usuario</h3>
              <p className="text-muted-foreground leading-relaxed">
                Para utilizar nuestros servicios, debe crear una cuenta proporcionando información 
                veraz y actualizada. Es responsable de mantener la confidencialidad de sus credenciales 
                y de todas las actividades que ocurran en su cuenta.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">4. Compra de Entradas</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">4.1 Precios y Disponibilidad</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Todos los precios están expresados en soles peruanos (S/) e incluyen los impuestos 
                  aplicables. Los precios pueden variar sin previo aviso hasta el momento de la compra.
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">4.2 Límites de Compra</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li><strong>Usuarios Fan:</strong> Máximo 5 entradas por evento</li>
                  <li><strong>Revendedores Verificados:</strong> Máximo 8 entradas por evento</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">4.3 Política de Cancelación</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Las compras son definitivas. Solo se aceptan cancelaciones en casos excepcionales 
                  como cancelación del evento por parte del organizador.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">5. Mercado de Reventa</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">5.1 Comisiones</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Comisión del vendedor: 5% del precio de venta</li>
                  <li>Comisión del organizador: 3% del precio de venta</li>
                  <li>Comisión de la plataforma: 2% del precio de venta</li>
                  <li>Gastos de servicio para el comprador: S/10.00</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">5.2 Límite de Precio</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Para garantizar un mercado justo, los precios de reventa no pueden exceder el 5% 
                  del precio original del evento.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">5.3 Verificación</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Todas las entradas puestas en reventa pasan por un proceso de verificación antes 
                  de ser listadas en la plataforma.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">6. Obligaciones del Usuario</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>No utilizar la plataforma para actividades ilegales</li>
                <li>No intentar manipular precios o crear cuentas falsas</li>
                <li>Respetar los derechos de propiedad intelectual</li>
                <li>Cumplir con todas las leyes aplicables</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">7. Responsabilidades de GateX</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GateX se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Mantener la plataforma operativa y segura</li>
                <li>Verificar la autenticidad de las entradas</li>
                <li>Proteger los pagos mediante custodia</li>
                <li>Proporcionar soporte al cliente</li>
                <li>Mantener la privacidad de los datos de usuario</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">8. Limitación de Responsabilidad</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                GateX actúa como intermediario entre compradores y vendedores. No nos hacemos 
                responsables por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Cancelación o cambios de eventos por parte del organizador</li>
                <li>Pérdida o daño de entradas físicas</li>
                <li>Experiencias durante el evento</li>
                <li>Disputas entre usuarios fuera de la plataforma</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">9. Contacto</h3>
              <p className="text-muted-foreground leading-relaxed">
                Para consultas sobre estos términos, puede contactarnos en:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg mt-3">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><strong>Email:</strong> legal@gatex.com</li>
                  <li><strong>Teléfono:</strong> +51 1 234-5678</li>
                  <li><strong>Dirección:</strong> Av. Javier Prado Este 123, San Isidro, Lima, Perú</li>
                </ul>
              </div>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};