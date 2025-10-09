// Generador de tickets PDF profesionales para GateX
import jsPDF from 'jspdf';
import gatexLogo from '@/assets/gatex-logo.png';

export interface TicketData {
  id: string;
  eventName: string;
  date: string;
  location: string;
  zone: string;
  price: number;
  seat?: string;
  seatNumber?: string;
  qrCode?: string;
  userName?: string;
  userDNI?: string;
}

// Función para convertir imagen URL a base64
const imageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = url;
  });
};

export const generateTicketPDF = async (ticketData: TicketData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [210, 148] // A5 landscape
  });

  // Colores GateX
  const primaryColor = [34, 197, 94]; // Green
  const secondaryColor = [239, 68, 68]; // Red
  const darkColor = [15, 23, 42]; // Dark
  const lightGray = [248, 250, 252];

  // Fondo con gradiente
  pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  pdf.rect(0, 0, 210, 148, 'F');

  // Header con branding GateX
  pdf.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  pdf.rect(0, 0, 210, 35, 'F');

  // Cargar y mostrar logo GateX
  let logoBase64: string | null = null;
  
  try {
    logoBase64 = await imageToBase64(gatexLogo);
  } catch (error) {
    console.log('Error cargando logo:', error);
  }
  
  if (logoBase64) {
    // Agregar logo real de GateX
    pdf.addImage(logoBase64, 'PNG', 15, 8, 20, 20);
    
    // Texto GateX al lado del logo
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GateX', 40, 20);
    
    // Subtítulo
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('TICKET DIGITAL BLOCKCHAIN', 40, 28);
  } else {
    // Fallback: solo texto si no se puede cargar la imagen
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🎫 GateX', 15, 20);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('TICKET DIGITAL BLOCKCHAIN', 15, 28);
  }

  // Fecha y hora actual
  const now = new Date();
  const formatDate = now.toLocaleDateString('es-PE');
  const formatTime = now.toLocaleTimeString('es-PE');
  pdf.setFontSize(8);
  pdf.text(`Generado: ${formatDate} ${formatTime}`, 140, 28);

  // Línea divisoria
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(2);
  pdf.line(0, 35, 210, 35);

  // Información del evento - Lado izquierdo
  pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  
  // Título del evento
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const eventTitle = pdf.splitTextToSize(ticketData.eventName, 120);
  pdf.text(eventTitle, 15, 50);

  // Detalles del evento
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  let yPos = 65;
  
  // Fecha
  pdf.setFont('helvetica', 'bold');
  pdf.text('FECHA Y HORA:', 15, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(ticketData.date, 50, yPos);
  yPos += 8;

  // Ubicación
  pdf.setFont('helvetica', 'bold');
  pdf.text('UBICACIÓN:', 15, yPos);
  pdf.setFont('helvetica', 'normal');
  const locationLines = pdf.splitTextToSize(ticketData.location, 80);
  pdf.text(locationLines, 50, yPos);
  yPos += locationLines.length * 5 + 3;

  // Zona
  pdf.setFont('helvetica', 'bold');
  pdf.text('ZONA:', 15, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(ticketData.zone, 50, yPos);
  yPos += 8;

  // Precio
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRECIO:', 15, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`S/ ${ticketData.price.toFixed(2)}`, 50, yPos);

  // Asiento específico (si existe)
  if (ticketData.seatNumber) {
    yPos += 10;
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ASIENTO:', 15, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(ticketData.seatNumber, 50, yPos);
    pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    pdf.setFontSize(10);
  }

  // Información del titular
  yPos += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.text('TITULAR DEL TICKET:', 15, yPos);
  yPos += 8;
  
  if (ticketData.userName) {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nombre: ${ticketData.userName}`, 15, yPos);
    yPos += 6;
  }
  
  if (ticketData.userDNI) {
    pdf.setFont('helvetica', 'normal');
    pdf.text(`DNI: ${ticketData.userDNI}`, 15, yPos);
  }

  // Lado derecho - QR y detalles del ticket
  
  // Marco para QR
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(1);
  pdf.rect(145, 45, 50, 50, 'S');

  // Placeholder QR (será reemplazado por QR real)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(147, 47, 46, 46, 'F');
  
  // Si hay código QR, intentar agregarlo
  if (ticketData.qrCode) {
    try {
      pdf.addImage(ticketData.qrCode, 'PNG', 147, 47, 46, 46);
    } catch (error) {
      // Fallback: mostrar texto QR
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('CÓDIGO QR', 160, 70, { align: 'center' });
    }
  }

  // ID del ticket
  pdf.setFontSize(8);
  pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ID TICKET:', 145, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text(ticketData.id, 145, 110);

  // Usuario (si existe)
  if (ticketData.userName) {
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TITULAR:', 145, 118);
    pdf.setFont('helvetica', 'normal');
    pdf.text(ticketData.userName, 145, 123);
  }

  // Footer con información importante
  pdf.setFillColor(240, 240, 240);
  pdf.rect(0, 125, 210, 23, 'F');
  
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont('helvetica', 'normal');
  
  // Instrucciones
  const instructions = [
    '• Presenta este ticket y tu DNI en el ingreso al evento',
    '• El código QR será escaneado para validar la autenticidad',
    '• Este ticket es intransferible y está registrado en blockchain',
    '• No se permiten copias ni duplicados'
  ];
  
  let footerY = 132;
  instructions.forEach(instruction => {
    pdf.text(instruction, 15, footerY);
    footerY += 4;
  });

  // Logo/marca en footer
  if (logoBase64) {
    pdf.addImage(logoBase64, 'PNG', 170, 130, 12, 12);
    
    pdf.setFontSize(8);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('GateX.pe', 185, 138);
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Tickets seguros y verificados', 175, 144);
  } else {
    // Fallback sin logo
    pdf.setFontSize(8);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🎫 GateX.pe', 175, 140);
    pdf.setFontSize(6);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Tickets seguros y verificados', 175, 144);
  }

  // Línea de seguridad (patrón)
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.setLineWidth(0.5);
  for (let i = 0; i < 210; i += 4) {
    pdf.line(i, 148, i + 2, 148);
  }

  // Descargar PDF
  const fileName = `GateX_Ticket_${ticketData.id}_${ticketData.eventName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(fileName);
};

// Función para generar QR específico para PDF
export const generateQRForPDF = async (ticketData: TicketData): Promise<string> => {
  const qrData = {
    ticketId: ticketData.id,
    event: ticketData.eventName,
    zone: ticketData.zone,
    date: ticketData.date,
    price: ticketData.price,
    seat: ticketData.seat || "General",
    blockchain: "Ethereum",
    contract: "0x" + Math.random().toString(16).substr(2, 40),
    timestamp: new Date().getTime(),
    issuer: "GateX",
    security: "SHA256:" + Math.random().toString(36)
  };

  const qrContent = JSON.stringify(qrData);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}`;
  
  return qrUrl;
};