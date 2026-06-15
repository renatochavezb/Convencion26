export interface Speaker {
  id: string;
  name: string;
  role: string;
  quote?: string;
  bullets: string[];
  imageUrl: string;
  featured: boolean;
  bio?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  speakerId?: string;
  speakerName?: string;
  time: string;
  day: number; // 3, 4, 5 de Septiembre
  location: string;
  locationUrl?: string;
  track: 'negocios' | 'ia' | 'casos_reales' | 'herramientas';
  description: string;
}

export interface RegistrationDetails {
  ticketId: string;
  name: string;
  email: string;
  company: string;
  position: string; // cargo/puesto
  badgeRole: 'Convencionista' | 'Invitado Especial' | 'Prensa';
  ticketType: 'individual' | 'pareja';
  partnerName?: string;
  partnerEmail?: string;
  registeredAt: string;
  status?: 'pendiente' | 'confirmado';
  comprobante?: string;
}
