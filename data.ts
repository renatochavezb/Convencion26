import { Speaker, ScheduleEvent } from './types';
import nestorPhoto from './nestor_guerra.png';
import keynoteGuestPhoto from './keynote_guest_placeholder.png';

export const SPEAKERS: Speaker[] = [
  {
    id: 'nestor',
    name: 'NÉSTOR GUERRA',
    role: 'Conferencista Internacional IA & negocios',
    quote: '"La inteligencia artificial no es el futuro. Es una decisión del presente."',
    bullets: [
      'Harvard Business Review Contributor',
      'Orador Destacado en TEDx',
      'Keynote principal en Expomanagement',
      'Mentor de Starups en South Summit',
      'Consultor estratégico para Repsol, Telefónica y Novartis'
    ],
    imageUrl: nestorPhoto.src,
    featured: true,
    bio: 'Néstor Guerra es socio fundador e investigador asociado de consultorías digitales. Es considerado uno de los expertos más influyentes del ecosistema de habla hispana en la aplicación práctica de Inteligencia Artificial para la toma de decisiones empresariales, rediseño de modelos de negocio y optimización de productividad corporativa.'
  },
  {
    id: 'invitado-keynote',
    name: 'CONFERENCISTA INVITADO',
    role: 'UNA VISIÓN ESTRATÉGICA PARA IMPULSAR EL CRECIMIENTO EMPRESARIAL',
    quote: '"El crecimiento empresarial exige nuevas formas de pensar, conectar y actuar."',
    bullets: [
      'Perspectiva empresarial aplicada al entorno actual',
      'Ideas prácticas para fortalecer liderazgo, ventas e innovación',
      'Participación especial dentro del programa académico',
      'Contenido enfocado en retos reales de las empresas'
    ],
    imageUrl: keynoteGuestPhoto.src,
    featured: true,
    bio: 'Próximamente anunciaremos al conferencista invitado que se sumará al programa académico con una participación especial diseñada para aportar valor, ampliar la visión estratégica de los asistentes y conectar nuevas ideas con los retos reales de las empresas.'
  },
  {
    id: 'marisol',
    name: 'ING. MARISOL QUIROZ',
    role: 'Directora de Innovación - EVM Chihuahua',
    bullets: [
      'Experta en Ecosistemas Tecnológicos',
      'Asesora de Innovación Gubernamental',
      'Directora de Alianzas Binacionales'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
    featured: false,
    bio: 'Marisol Quiroz lidera los programas de aceleración tecnológica y vinculación empresarial de EVM Chihuahua. Facilita la adopción de infraestructuras inteligentes en las industrias manufactureras y de servicios en la región norte de México.'
  },
  {
    id: 'alejandro',
    name: 'DR. ALEJANDRO RAMOS',
    role: 'Especialista en IA Aplicada y Modelos Generativos',
    bullets: [
      'Doctorado en Ciencias Computacionales',
      'Desarrollador de Arquitecturas LLM',
      'Consultor en Ciberseguridad IA'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
    featured: false,
    bio: 'Alejandro tiene más de 12 años diseñando modelos matemáticos y de red neuronal para automatizaciones industriales. Actualmente encabeza iniciativas de despliegue de modelos de IA locales y seguros enfocados en privacidad bancaria.'
  },
  {
    id: 'clara',
    name: 'DRA. CLARA BENAVIDES',
    role: 'VP de Estrategia Digital y Casos de Éxito',
    bullets: [
      'Líder de Transformación Ágil',
      'Ex-directora de Tecnología en Femsa',
      'Investigadora de Adopción de Software'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800',
    featured: false,
    bio: 'Clara es mentora corporativa y se especializa en medir el retorno de inversión (ROI) de proyectos tecnológicos complejos. Ha coordinado el despliegue de soluciones ERP e IA distribuida en más de cinco países de América Latina.'
  }
];

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Jueves 03 de Septiembre (Día 3)
  {
    id: 'd3-1',
    title: 'Rompe Hielo al estilo 80s',
    time: '07:00 PM - 10:00 PM',
    day: 3,
    location: 'Hacienda San José',
    locationUrl: 'https://maps.google.com/?q=Hacienda+San+Jose+Chihuahua',
    track: 'negocios',
    description: 'Cóctel rompehielos de bienvenida con temática de los años 80 para todos los congresistas y acompañantes.'
  },

  // Viernes 04 de Septiembre (Día 4)
  {
    id: 'd4-1',
    title: 'Ceremonia de Inauguración',
    time: '09:00 AM - 10:00 AM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Apertura formal de la Convención Nacional COMEV 2026 con la presencia de autoridades e invitados de honor.'
  },
  {
    id: 'd4-new-speaker',
    title: 'Conferencia Magistral: Liderazgo y Competitividad Industrial',
    speakerId: 'invitado-keynote',
    speakerName: 'Conferencista Invitado',
    time: '10:00 AM - 11:00 AM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Magna ponencia magistral enfocada en los retos de la competitividad en el mercado actual, mejores prácticas de liderazgo estratégico y el crecimiento sustentable para el desarrollo empresarial de vanguardia.'
  },
  {
    id: 'd4-2',
    title: 'Cumbre: Néstor Guerra. CONFERENCISTA INTERNACIONAL IA & NEGOCIOS',
    speakerId: 'nestor',
    speakerName: 'NÉSTOR GUERRA',
    time: '11:00 AM - 01:00 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'ia',
    description: 'Conferencia magistral de alto impacto impartida por Néstor Guerra sobre la aplicación de Inteligencia Artificial en el desarrollo y transformación de negocios modernos.'
  },
  {
    id: 'd4-3',
    title: 'Foto del recuerdo',
    time: '01:00 PM - 01:30 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'casos_reales',
    description: 'Sesión fotográfica grupal oficial de todos los delegados, organizadores e invitados de la Convención.'
  },
  {
    id: 'd4-4',
    title: 'Comida',
    time: '01:30 PM - 04:00 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'casos_reales',
    description: 'Comida oficial de convivencia con opciones de la alta cocina regional chihuahuense.'
  },
  {
    id: 'd4-5',
    title: 'Junta de presidentes',
    time: '04:00 PM - 06:30 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Reunión de trabajo y planificación estratégica con los presidentes de las distintas delegaciones.'
  },
  {
    id: 'd4-6',
    title: 'Evento de damas',
    time: '04:00 PM - 06:30 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Reunión y actividades de integración especialmente preparadas para las damas acompañantes.'
  },
  {
    id: 'd4-7',
    title: 'Ejecutivo Distinguido Nacional',
    time: '08:00 PM - 11:30 PM',
    day: 4,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Cena de gala y ceremonia oficial de premiación al Ejecutivo Distinguido Nacional de este año.'
  },

  // Sábado 05 de Septiembre (Día 5)
  {
    id: 'd5-1',
    title: 'Experiencia Regional: Paisajes y Tradición',
    time: '09:00 AM - 01:30 PM',
    day: 5,
    location: 'María Bonita: Hotel Sede',
    locationUrl: 'https://maps.google.com/?q=Hotel+Maria+Bonita+Chihuahua',
    track: 'casos_reales',
    description: 'Una excursión de integración fuera de la ciudad para explorar la riqueza de la región, diseñada para descubrir espectaculares paisajes naturales o disfrutar de las nuevas propuestas locales que ofrece el entorno de Chihuahua.'
  },
  {
    id: 'd5-2',
    title: 'Toma de Protesta Consejo 2026-2027',
    time: '08:00 PM - 10:00 PM',
    day: 5,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Ceremonia protocolar de toma de protesta del nuevo comité directivo nacional y entrega de estafeta.'
  },
  {
    id: 'd5-3',
    title: 'Cena & baile de cierre',
    time: '10:00 PM - 01:30 AM',
    day: 5,
    location: 'Centro de Exposiciones y Convenciones',
    locationUrl: 'https://maps.google.com/?q=Centro+de+Convenciones+y+Exposiciones+de+Chihuahua',
    track: 'negocios',
    description: 'Cena formal de clausura con baile de gala y música en vivo para despedir la convención COMEV 2026.'
  }
];
