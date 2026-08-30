const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'assets');
const PUBLIC_ASSETS = path.join(ROOT, 'public', 'assets');

function asset(...parts) {
  const candidates = [
    path.join(ROOT, ...parts),
    path.join(ASSETS, ...parts),
    path.join(PUBLIC_ASSETS, ...parts),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const IMG = {
  logoComev: asset('comev-logo-trans.png') || asset('comev-oficial.png'),
  logoBlanco: asset('logo-blanco.png'),
  logoNaranja: asset('logo-naranja.png'),
  logoEvm: asset('evm-logo.png'),
  cumbre: asset('cumbre-ventas-logo.jpg'),
  nestor: asset('nestor_guerra.png'),
  alex: asset('alex_nunez.png'),
  oscar: asset('oscar_gardea.jpg'),
  retro: asset('retro-70s-bg.png'),
  inauguracion: asset('inauguracion_bg.png'),
  conferencia: asset('conferencia_bg.png'),
  foto: asset('foto_bg.png'),
  gala: asset('gala_bg.png'),
  paseo: asset('paseo_bg.png'),
  junta: asset('junta_bg.png'),
  damas: asset('damas_bg.png'),
  comida: asset('comida_bg.png'),
};

const pptx = new PptxGenJS();
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 });
pptx.layout = 'WIDE';
pptx.author = 'COMEV 2026';
pptx.title = 'COMEV 2026 — Programa y Sellos del Pasaporte';

const C = {
  deep: '000814',
  navy: '041221',
  card: '0B1A2E',
  orange: 'FE9800',
  cream: 'FFC080',
  white: 'FFFFFF',
  muted: 'A8B3C7',
  cyan: '06B6D4',
};

function addDarkBase(slide) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.deep },
  });
}

function addBgImage(slide, imgPath, opacity = 28) {
  if (!imgPath) return;
  slide.addImage({
    path: imgPath,
    x: 0, y: 0, w: 13.333, h: 7.5,
    transparency: Math.max(0, Math.min(100, 100 - opacity)),
  });
  // dark overlay for readability
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 7.5,
    fill: { color: C.deep, transparency: 45 },
  });
}

function addAccentBar(slide, color = C.orange) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.16, h: 7.5,
    fill: { color },
  });
}

function addFooter(slide, label, color = C.muted) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 7.15, w: 13.333, h: 0.35,
    fill: { color: '000000', transparency: 40 },
  });
  slide.addText(label, {
    x: 0.5, y: 7.18, w: 8, h: 0.28,
    fontSize: 10, color, fontFace: 'Arial',
  });
  slide.addText('COMEV 2026 · Chihuahua', {
    x: 8.5, y: 7.18, w: 4.3, h: 0.28,
    fontSize: 10, color, fontFace: 'Arial', align: 'right',
  });
}

function addLogoCorner(slide, opts = {}) {
  const { x = 11.2, y = 0.25, w = 1.7, h = 0.7 } = opts;
  if (IMG.logoComev) {
    slide.addImage({ path: IMG.logoComev, x, y, w, h, transparency: 0 });
  }
}

function addBadge(slide, text, x, y, w, color) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h: 0.38,
    fill: { color },
    rectRadius: 0.06,
  });
  slide.addText(text, {
    x, y, w, h: 0.38,
    fontSize: 11, color: C.deep, fontFace: 'Arial', bold: true,
    align: 'center', valign: 'middle',
  });
}

function addMetaCard(slide, label, value, x, y, w = 3.5) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h: 1.15,
    fill: { color: C.card, transparency: 20 },
    rectRadius: 0.08,
    shadow: { type: 'outer', color: '000000', blur: 8, opacity: 0.35, offset: 2 },
  });
  slide.addText(label, {
    x: x + 0.22, y: y + 0.18, w: w - 0.4, h: 0.28,
    fontSize: 11, color: C.orange, fontFace: 'Arial', bold: true,
  });
  slide.addText(value, {
    x: x + 0.22, y: y + 0.48, w: w - 0.4, h: 0.52,
    fontSize: 13, color: C.white, fontFace: 'Arial',
  });
}

function addPhotoFrame(slide, imgPath, x, y, w, h, accent = C.orange) {
  if (!imgPath) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h,
      fill: { color: C.card },
      rectRadius: 0.06,
    });
    return;
  }
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12,
    fill: { color: accent },
  });
  slide.addImage({
    path: imgPath,
    x, y, w, h,
    sizing: { type: 'cover', w, h },
  });
}

const SELLOS = [
  {
    id: 1,
    name: 'Flash Back',
    desc: 'Rompe Hielo 80s',
    day: 'Jueves 3 de septiembre',
    time: '19:00 - 23:00',
    location: 'Hacienda San José',
    detail: 'Cóctel rompehielos de bienvenida con temática de los años 80 para todos los congresistas y acompañantes.',
    color: 'D946EF',
    bg: IMG.retro,
  },
  {
    id: 2,
    name: 'Hora Cero',
    desc: 'Inauguración Oficial',
    day: 'Viernes 4 de septiembre',
    time: '08:30 - 09:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Apertura formal de la Convención Nacional COMEV 2026 con la presencia de autoridades e invitados de honor.',
    color: 'F59E0B',
    bg: IMG.inauguracion,
  },
  {
    id: 3,
    name: 'Liderazgo · Innovación',
    desc: 'Conferencias Magistrales · Cumbre de Ventas',
    day: 'Viernes 4 de septiembre',
    time: '09:30 - 13:40',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Alejandro Núñez — IA aplicada a ventas: construye un negocio completo en vivo.\nNéstor Guerra — Agentes IA: el futuro de las ventas inteligentes.',
    color: '06B6D4',
    bg: IMG.conferencia,
    photos: [
      { img: IMG.alex, label: 'Alejandro Núñez' },
      { img: IMG.nestor, label: 'Néstor Guerra' },
    ],
  },
  {
    id: 4,
    name: 'Somos COMEV',
    desc: 'Foto del Recuerdo',
    day: 'Viernes 4 de septiembre',
    time: '14:00 - 14:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Sesión fotográfica grupal oficial de todos los delegados, organizadores e invitados de la Convención.',
    color: 'F8FAFC',
    bg: IMG.foto,
  },
  {
    id: 5,
    name: 'Ejecutivo Distinguido',
    desc: 'Cena de Gala · Oscar Gardea Acosta',
    day: 'Viernes 4 de septiembre',
    time: '20:30 - 23:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Cena de gala y ceremonia oficial de premiación al Ejecutivo Distinguido Nacional de este año.',
    color: 'FACC15',
    bg: IMG.gala,
    photos: [{ img: IMG.oscar, label: 'Oscar Gardea Acosta' }],
  },
  {
    id: 6,
    name: 'Paisajes y Tradición',
    desc: 'Experiencia Regional',
    day: 'Sábado 5 de septiembre',
    time: '09:30 - 16:30',
    location: 'Paseo · Viñedo Piña Mora',
    detail: 'Excursión de integración fuera de la ciudad para explorar paisajes naturales y propuestas locales de Chihuahua.',
    color: '10B981',
    bg: IMG.paseo,
  },
  {
    id: 7,
    name: 'Toma de Protesta',
    desc: 'Nuevo Consejo 2026–2027',
    day: 'Sábado 5 de septiembre',
    time: '20:00 - 21:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Ceremonia protocolar de toma de protesta del nuevo comité directivo nacional y entrega de estafeta. Continúa con cena y baile de cierre (21:30 - 01:30).',
    color: 'F43F5E',
    bg: IMG.gala,
  },
];

const PARALLEL = [
  {
    title: 'Junta de Presidentes',
    time: '16:00 - 18:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Reunión de trabajo y planificación estratégica con los presidentes de las distintas delegaciones.',
    accent: 'FE9800',
    bg: IMG.junta,
  },
  {
    title: 'Evento de damas',
    time: '16:00 - 18:30',
    location: 'Centro de Exposiciones y Convenciones',
    detail: 'Reunión y actividades de integración especialmente preparadas para las damas acompañantes.',
    accent: 'EC4899',
    bg: IMG.damas,
  },
  {
    title: 'Cata de cerveza',
    time: '16:00 - 18:30',
    location: 'La Terraza: el Legado',
    detail: 'Experiencia de cata guiada con cervezas artesanales y etiquetas del norte de México. Convivencia, maridaje y networking.',
    accent: 'FBBF24',
    bg: IMG.comida,
  },
];

// ===================== PORTADA =====================
{
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addBgImage(slide, IMG.conferencia, 35);
  addAccentBar(slide);

  if (IMG.logoComev) {
    slide.addImage({ path: IMG.logoComev, x: 0.7, y: 0.9, w: 2.4, h: 1.0 });
  }
  if (IMG.logoEvm) {
    slide.addImage({ path: IMG.logoEvm, x: 10.4, y: 0.95, w: 2.2, h: 0.85 });
  }

  slide.addText('CONVENCIÓN NACIONAL', {
    x: 0.7, y: 2.4, w: 12, h: 0.4,
    fontSize: 16, color: C.orange, fontFace: 'Arial', bold: true, charSpacing: 5,
  });
  slide.addText('COMEV 2026', {
    x: 0.7, y: 2.85, w: 12, h: 0.95,
    fontSize: 56, color: C.white, fontFace: 'Arial', bold: true,
  });
  slide.addText('¡VIVA CHIHUAHUA!', {
    x: 0.7, y: 3.8, w: 12, h: 0.5,
    fontSize: 26, color: C.cream, fontFace: 'Arial', bold: true,
  });

  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.7, y: 4.5, w: 2.2, h: 0.08,
    fill: { color: C.orange },
  });

  slide.addText('Programa oficial · Sellos del pasaporte digital · Eventos en paralelo', {
    x: 0.7, y: 4.8, w: 11, h: 0.4,
    fontSize: 15, color: C.muted, fontFace: 'Arial',
  });
  slide.addText('3, 4 y 5 de septiembre de 2026  ·  Chihuahua, México', {
    x: 0.7, y: 5.25, w: 11, h: 0.35,
    fontSize: 14, color: C.white, fontFace: 'Arial',
  });
  slide.addText('convencion26.vercel.app', {
    x: 0.7, y: 6.5, w: 8, h: 0.3,
    fontSize: 13, color: C.orange, fontFace: 'Arial',
  });
}

// ===================== ÍNDICE =====================
{
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addAccentBar(slide, C.cyan);
  addLogoCorner(slide);

  slide.addText('PASAPORTE DIGITAL', {
    x: 0.6, y: 0.35, w: 10, h: 0.3,
    fontSize: 12, color: C.orange, fontFace: 'Arial', bold: true, charSpacing: 3,
  });
  slide.addText('Los 7 sellos del programa', {
    x: 0.6, y: 0.7, w: 10, h: 0.55,
    fontSize: 30, color: C.white, fontFace: 'Arial', bold: true,
  });

  SELLOS.forEach((s, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.55 + col * 6.3;
    const y = 1.5 + row * 1.25;
    // last one centered-ish if odd - keep grid
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 6.0, h: 1.1,
      fill: { color: C.card },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x, y, w: 0.14, h: 1.1,
      fill: { color: s.color },
    });
    slide.addText(String(s.id).padStart(2, '0'), {
      x: x + 0.3, y: y + 0.25, w: 0.8, h: 0.6,
      fontSize: 24, color: s.color, fontFace: 'Arial', bold: true,
    });
    slide.addText(s.name, {
      x: x + 1.15, y: y + 0.22, w: 4.5, h: 0.35,
      fontSize: 16, color: C.white, fontFace: 'Arial', bold: true,
    });
    slide.addText(s.desc, {
      x: x + 1.15, y: y + 0.58, w: 4.5, h: 0.3,
      fontSize: 12, color: C.muted, fontFace: 'Arial',
    });
  });
  addFooter(slide, 'Índice · Sellos del pasaporte');
}

// ===================== SELLOS =====================
SELLOS.forEach((sello) => {
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addBgImage(slide, sello.bg, 30);
  addAccentBar(slide, sello.color);
  addLogoCorner(slide);

  const textColorOnBadge = ['F8FAFC', 'FACC15', 'FBBF24'].includes(sello.color) ? C.deep : C.deep;
  addBadge(slide, `SELLO ${String(sello.id).padStart(2, '0')}`, 0.55, 0.35, 1.7, sello.color);

  const hasPhotos = Array.isArray(sello.photos) && sello.photos.length > 0;
  const textW = hasPhotos ? 7.8 : 11.8;

  slide.addText(sello.name, {
    x: 0.55, y: 0.95, w: textW, h: 0.65,
    fontSize: 34, color: C.white, fontFace: 'Arial', bold: true,
  });
  slide.addText(sello.desc, {
    x: 0.55, y: 1.6, w: textW, h: 0.4,
    fontSize: 16, color: C.cream, fontFace: 'Arial',
  });

  addMetaCard(slide, 'DÍA', sello.day, 0.55, 2.25, hasPhotos ? 2.5 : 3.7);
  addMetaCard(slide, 'HORARIO', sello.time, hasPhotos ? 3.2 : 4.45, 2.25, hasPhotos ? 2.5 : 3.7);
  addMetaCard(slide, 'LUGAR', sello.location, hasPhotos ? 5.85 : 8.35, 2.25, hasPhotos ? 2.5 : 4.3);

  slide.addText(sello.detail, {
    x: 0.55, y: 3.7, w: textW, h: 2.4,
    fontSize: 15, color: C.muted, fontFace: 'Arial', valign: 'top',
  });

  if (hasPhotos) {
    const photoW = sello.photos.length === 1 ? 3.4 : 2.7;
    const photoH = sello.photos.length === 1 ? 4.2 : 3.5;
    const startY = sello.photos.length === 1 ? 1.1 : 1.3;
    sello.photos.forEach((p, i) => {
      const x = 9.2 + (sello.photos.length === 1 ? 0.2 : i * 0);
      const y = startY + i * (photoH * 0.55 + 0.15);
      // side-by-side for 2 photos
    });

    if (sello.photos.length === 2) {
      sello.photos.forEach((p, i) => {
        const x = 9.15;
        const y = 1.15 + i * 2.85;
        const w = 3.55;
        const h = 2.55;
        addPhotoFrame(slide, p.img, x, y, w, h, sello.color);
        slide.addShape(pptx.shapes.RECTANGLE, {
          x, y: y + h - 0.45, w, h: 0.45,
          fill: { color: '000000', transparency: 35 },
        });
        slide.addText(p.label, {
          x, y: y + h - 0.45, w, h: 0.45,
          fontSize: 12, color: C.white, fontFace: 'Arial', bold: true,
          align: 'center', valign: 'middle',
        });
      });
    } else {
      const p = sello.photos[0];
      addPhotoFrame(slide, p.img, 9.3, 1.2, 3.4, 4.4, sello.color);
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: 9.3, y: 5.15, w: 3.4, h: 0.45,
        fill: { color: '000000', transparency: 30 },
      });
      slide.addText(p.label, {
        x: 9.3, y: 5.15, w: 3.4, h: 0.45,
        fontSize: 13, color: C.white, fontFace: 'Arial', bold: true,
        align: 'center', valign: 'middle',
      });
    }
  }

  if (sello.id === 3 && IMG.cumbre) {
    slide.addImage({
      path: IMG.cumbre,
      x: 0.55, y: 5.85, w: 2.4, h: 0.95,
    });
  }

  addFooter(slide, `Sello ${sello.id} de 7 · Pasaporte digital`, sello.color === 'F8FAFC' ? C.muted : sello.color);
});

// ===================== SEPARADOR PARALELOS =====================
{
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addBgImage(slide, IMG.junta, 32);
  addAccentBar(slide);
  addLogoCorner(slide);

  slide.addText('VIERNES 4 · 16:00 - 18:30', {
    x: 0.7, y: 2.3, w: 12, h: 0.35,
    fontSize: 14, color: C.orange, fontFace: 'Arial', bold: true, charSpacing: 3,
  });
  slide.addText('Eventos en paralelo', {
    x: 0.7, y: 2.8, w: 12, h: 0.75,
    fontSize: 40, color: C.white, fontFace: 'Arial', bold: true,
  });
  slide.addText('Tres actividades simultáneas — elige la que corresponda a tu perfil.', {
    x: 0.7, y: 3.7, w: 11, h: 0.45,
    fontSize: 16, color: C.muted, fontFace: 'Arial',
  });

  PARALLEL.forEach((ev, i) => {
    const x = 0.7 + i * 4.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.5, w: 3.8, h: 1.5,
      fill: { color: C.card, transparency: 15 },
      rectRadius: 0.08,
    });
    slide.addShape(pptx.shapes.RECTANGLE, {
      x, y: 4.5, w: 3.8, h: 0.1,
      fill: { color: ev.accent },
    });
    slide.addText(ev.title, {
      x: x + 0.2, y: 4.8, w: 3.4, h: 0.7,
      fontSize: 16, color: C.white, fontFace: 'Arial', bold: true,
    });
    slide.addText(ev.time, {
      x: x + 0.2, y: 5.5, w: 3.4, h: 0.3,
      fontSize: 12, color: C.cream, fontFace: 'Arial',
    });
  });
}

// ===================== PARALELOS =====================
PARALLEL.forEach((event, index) => {
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addBgImage(slide, event.bg, 32);
  addAccentBar(slide, event.accent);
  addLogoCorner(slide);
  addBadge(slide, `PARALELO ${index + 1} / 3`, 0.55, 0.35, 2.2, event.accent);

  slide.addText(event.title, {
    x: 0.55, y: 1.1, w: 12, h: 0.7,
    fontSize: 36, color: C.white, fontFace: 'Arial', bold: true,
  });

  addMetaCard(slide, 'HORARIO', event.time, 0.55, 2.2, 3.7);
  addMetaCard(slide, 'LUGAR', event.location, 4.45, 2.2, 4.2);
  addMetaCard(slide, 'DÍA', 'Viernes 4 de septiembre', 8.85, 2.2, 3.7);

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.55, y: 3.7, w: 12.1, h: 2.4,
    fill: { color: C.card, transparency: 25 },
    rectRadius: 0.1,
  });
  slide.addText(event.detail, {
    x: 0.9, y: 4.05, w: 11.4, h: 1.8,
    fontSize: 18, color: C.white, fontFace: 'Arial', valign: 'middle',
  });

  addFooter(slide, `Evento paralelo ${index + 1} de 3`, event.accent);
});

// ===================== CIERRE =====================
{
  const slide = pptx.addSlide();
  addDarkBase(slide);
  addBgImage(slide, IMG.gala, 30);
  addAccentBar(slide);

  if (IMG.logoComev) {
    slide.addImage({ path: IMG.logoComev, x: 5.2, y: 1.3, w: 2.9, h: 1.2 });
  }

  slide.addText('¡NOS VEMOS EN CHIHUAHUA!', {
    x: 0.7, y: 3.0, w: 12, h: 0.7,
    fontSize: 34, color: C.white, fontFace: 'Arial', bold: true, align: 'center',
  });
  slide.addText('Convención Nacional COMEV 2026\n3, 4 y 5 de septiembre', {
    x: 0.7, y: 3.85, w: 12, h: 0.8,
    fontSize: 18, color: C.cream, fontFace: 'Arial', align: 'center',
  });
  slide.addText('convencion26.vercel.app', {
    x: 0.7, y: 5.0, w: 12, h: 0.4,
    fontSize: 16, color: C.orange, fontFace: 'Arial', align: 'center',
  });

  // mini collage speakers
  const mini = [
    { img: IMG.alex, label: 'Alejandro' },
    { img: IMG.nestor, label: 'Néstor' },
    { img: IMG.oscar, label: 'Oscar' },
  ].filter((m) => m.img);

  mini.forEach((m, i) => {
    const x = 4.4 + i * 1.55;
    slide.addImage({
      path: m.img,
      x, y: 5.6, w: 1.35, h: 1.35,
      sizing: { type: 'cover', w: 1.35, h: 1.35 },
    });
  });
}

const outPath = path.join(ROOT, 'COMEV-2026-Programa-Sellos-v2.pptx');
pptx
  .writeFile({ fileName: outPath })
  .then(() => {
    console.log('CREATED:', outPath);
    console.log('ASSETS FOUND:');
    Object.entries(IMG).forEach(([k, v]) => console.log(`  ${k}: ${v ? 'yes' : 'MISSING'}`));
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
