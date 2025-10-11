import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyModalProps {
  trigger: React.ReactNode;
}

export const PrivacyModal = ({ trigger }: PrivacyModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Política de Privacidad</DialogTitle>
          <p className="text-sm text-muted-foreground">Última actualización: 10 de octubre de 2025</p>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            
            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">1. Introducción</h3>
              <p className="text-muted-foreground leading-relaxed">
                En GateX, respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
                Esta política explica cómo recopilamos, utilizamos y protegemos su información cuando 
                utiliza nuestros servicios.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">2. Información que Recopilamos</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">2.1 Información Personal</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Nombre completo</li>
                  <li>Correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Documento de identidad (DNI)</li>
                  <li>Dirección de facturación</li>
                  <li>Información de pago (procesada de forma segura)</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">2.2 Información de Uso</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Historial de compras y ventas</li>
                  <li>Preferencias de eventos</li>
                  <li>Actividad en la plataforma</li>
                  <li>Datos de navegación y dispositivo</li>
                  <li>Dirección IP y ubicación aproximada</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">2.3 Información de Terceros</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Cuando inicia sesión con proveedores externos (Google, Facebook), recibimos 
                  información básica de perfil según sus configuraciones de privacidad.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">3. Cómo Utilizamos su Información</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">3.1 Prestación de Servicios</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Procesar compras y ventas de entradas</li>
                  <li>Verificar la identidad de usuarios</li>
                  <li>Facilitar transacciones en el mercado de reventa</li>
                  <li>Proporcionar soporte al cliente</li>
                  <li>Enviar confirmaciones y actualizaciones de pedidos</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">3.2 Mejora de Servicios</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Analizar tendencias de uso para mejorar la plataforma</li>
                  <li>Personalizar recomendaciones de eventos</li>
                  <li>Desarrollar nuevas funcionalidades</li>
                  <li>Prevenir fraudes y garantizar seguridad</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">4. Compartir Información</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">4.1 Con Terceros Autorizados</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li><strong>Procesadores de pago:</strong> Para procesar transacciones de forma segura</li>
                  <li><strong>Organizadores de eventos:</strong> Solo información necesaria para la entrada</li>
                  <li><strong>Proveedores de servicios:</strong> Para funcionalidades específicas (email, SMS)</li>
                  <li><strong>Servicios de análisis:</strong> Datos agregados y anonimizados</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">4.2 Nunca Compartimos</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Información personal con fines comerciales no autorizados</li>
                  <li>Datos de pago completos</li>
                  <li>Información privada entre usuarios sin consentimiento</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">5. Seguridad de Datos</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">5.1 Medidas Técnicas</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Encriptación SSL/TLS para todas las transmisiones</li>
                  <li>Almacenamiento seguro en servidores protegidos</li>
                  <li>Acceso restringido a datos personales</li>
                  <li>Monitoreo continuo de seguridad</li>
                  <li>Copias de seguridad regulares</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">5.2 Medidas Organizativas</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Capacitación del personal en privacidad</li>
                  <li>Políticas internas de acceso a datos</li>
                  <li>Auditorías de seguridad regulares</li>
                  <li>Planes de respuesta a incidentes</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">6. Sus Derechos</h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                De acuerdo con las leyes de protección de datos, usted tiene derecho a:
              </p>
              
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">6.1 Acceso y Portabilidad</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Solicitar una copia de sus datos personales</li>
                  <li>Obtener sus datos en formato estructurado</li>
                  <li>Transferir sus datos a otro servicio</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">6.2 Rectificación y Eliminación</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Corregir información inexacta o incompleta</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Restringir el procesamiento en ciertos casos</li>
                </ul>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-primary mb-3">7. Contacto</h3>
              <p className="text-muted-foreground leading-relaxed">
                Para ejercer sus derechos o hacer consultas sobre privacidad, contáctenos:
              </p>
              <div className="bg-primary/5 p-4 rounded-lg mt-3">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li><strong>Email de Privacidad:</strong> privacy@gatex.com</li>
                  <li><strong>Teléfono:</strong> +51 1 234-5678</li>
                  <li><strong>Dirección:</strong> Av. Javier Prado Este 123, San Isidro, Lima, Perú</li>
                  <li><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</li>
                </ul>
              </div>
            </section>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};