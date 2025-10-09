import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import gatexLogo from "@/assets/gatex-logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={gatexLogo} alt="GateX" className="h-10 w-10" />
              <span className="text-xl font-bold text-gradient">GateX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tickets seguros y transparentes con tecnología blockchain
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/simbiosis" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  ¿Qué es GateX?
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ¿Necesitas ayuda? Contáctanos
              </p>
              <a 
                href="https://wa.me/51923190931?text=Hola%2C%20necesito%20ayuda%20con%20GateX.%20Me%20gustar%C3%ADa%20obtener%20informaci%C3%B3n%20sobre%20la%20compra%20de%20tickets%2C%20eventos%20disponibles%20o%20resolver%20alguna%20consulta.%20%C2%A1Gracias%21"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Soporte
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2025 GateX Ticket. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
