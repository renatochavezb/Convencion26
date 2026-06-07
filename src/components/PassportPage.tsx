import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Check, Sparkles, Briefcase, MapPin, Award, CheckCircle, Edit3 } from 'lucide-react';

interface PassportData {
  folio: string;
  nombre: string;
  cargo: string;
  empresa: string;
  delegacion: string;
  whatsapp: string;
  linkedin: string;
  email: string;
  modalidad: string;
  descripcion: string;
  industria: string;
  tamano: string;
  busco: string[];
  ofrezco: string[];
  reto: string;
  objetivo: string;
  sellos: number[]; // Array of indices (1 to 7) of earned stamps
  photoUrl: string;
}

const INDUSTRIAS = [
  'Manufactura',
  'Comercio / Retail',
  'Tecnología / SaaS',
  'Servicios profesionales',
  'Bienes raíces',
  'Alimentos y bebidas',
  'Salud',
  'Educación',
  'Logística / Transporte',
  'Financiero / Inversión',
  'Otro'
];

const TAMANOS = [
  { val: '1-10', label: '1–10 personas' },
  { val: '11-50', label: '11–50 personas' },
  { val: '51-200', label: '51–200 personas' },
  { val: '200+', label: '200+ personas' }
];

const BUSQUEDAS = [
  { val: 'clientes', label: 'Clientes' },
  { val: 'socios', label: 'Socios' },
  { val: 'mentores', label: 'Mentores' },
  { val: 'inversion', label: 'Inversión' },
  { val: 'talento', label: 'Talento' },
  { val: 'aprendizaje', label: 'Aprendizaje' },
  { val: 'alianzas', label: 'Alianzas comerciales' },
  { val: 'proveedores', label: 'Proveedores' }
];

const OFRECIMIENTOS = [
  { val: 'experiencia', label: 'Experiencia sectorial' },
  { val: 'red', label: 'Red de contactos' },
  { val: 'capital', label: 'Capital / inversión' },
  { val: 'mercado', label: 'Acceso a mercado' },
  { val: 'conocimiento', label: 'Conocimiento técnico' },
  { val: 'distribución', label: 'Distribución' },
  { val: 'mentoría', label: 'Mentoría' }
];

const SELLOS_INFO = [
  { id: 1, name: 'Flash Back', desc: 'Jue — Rompe hielo', color: '#d946ef', bgClass: 'bg-[#1e0a2e]', borderClass: 'border-[#d946ef]', textClass: 'text-[#d946ef]' },
  { id: 2, name: 'Hora Cero', desc: 'Vie — Inauguración', color: '#f59e0b', bgClass: 'bg-[#1c0a00]', borderClass: 'border-[#f59e0b]', textClass: 'text-[#f59e0b]' },
  { id: 3, name: 'Liderazgo / Innovación', desc: 'Vie — Cumbre IA', color: '#06b6d4', bgClass: 'bg-[#020e1a]', borderClass: 'border-[#06b6d4]', textClass: 'text-[#06b6d4]' },
  { id: 4, name: 'Somos COMEV', desc: 'Vie — Foto grupal', color: '#f8fafc', bgClass: 'bg-[#0f172a]', borderClass: 'border-[#f8fafc]', textClass: 'text-[#f8fafc]' },
  { id: 5, name: 'Ejecutivo Distng.', desc: 'Vie — Gala', color: '#facc15', bgClass: 'bg-[#00082e]', borderClass: 'border-[#1d4ed8]', textClass: 'text-[#facc15]' },
  { id: 6, name: 'Paisajes y Tradición', desc: 'Sáb — Excursión', color: '#10b981', bgClass: 'bg-[#00150a]', borderClass: 'border-[#10b981]', textClass: 'text-[#10b981]' },
  { id: 7, name: 'Toma de Protesta', desc: 'Sáb — Cena cierre', color: '#f43f5e', bgClass: 'bg-[#1a0008]', borderClass: 'border-[#f43f5e]', textClass: 'text-[#f43f5e]' }
];

export default function PassportPage() {
  const [data, setData] = useState<PassportData>({
    folio: '',
    nombre: '',
    cargo: '',
    empresa: '',
    delegacion: '',
    whatsapp: '',
    linkedin: '',
    email: '',
    modalidad: '',
    descripcion: '',
    industria: '',
    tamano: '',
    busco: [],
    ofrezco: [],
    reto: '',
    objetivo: '',
    sellos: [],
    photoUrl: ''
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Initialize folio and load data
  useEffect(() => {
    // 1. Generate or load folio
    let folio = localStorage.getItem('comev_folio');
    if (!folio) {
      folio = 'CMV-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('comev_folio', folio);
    }

    // 2. Load from localStorage first to display instantly
    let initialEmail = '';
    let initialData: Partial<PassportData> = {};

    const savedProfile = localStorage.getItem('comev_perfil');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        initialData = { ...parsed };
        initialEmail = parsed.email || '';
        if (parsed.nombre) {
          setIsEditing(false);
        }
      } catch (e) {
        console.error('Error parsing cached passport profile', e);
      }
    }

    const savedBadge = localStorage.getItem('comev_badge_2026');
    if (savedBadge) {
      try {
        const parsedBadge = JSON.parse(savedBadge);
        if (!initialData.nombre) initialData.nombre = parsedBadge.name || '';
        if (!initialData.email) initialData.email = parsedBadge.email || '';
        if (!initialData.empresa) initialData.empresa = parsedBadge.company || '';
        if (!initialData.cargo) initialData.cargo = parsedBadge.position || '';
        if (!initialData.modalidad) initialData.modalidad = parsedBadge.ticketType || '';
        if (!initialEmail) initialEmail = parsedBadge.email || '';
      } catch (e) {
        console.error('Error parsing cached badge registration', e);
      }
    }

    // Set local data first
    setData(prev => ({
      ...prev,
      ...initialData,
      folio: folio || initialData.folio || prev.folio,
      sellos: initialData.sellos || []
    }));

    // 3. Fetch from MongoDB database to get the latest info
    if (initialEmail) {
      fetch(`/api/passport/${encodeURIComponent(initialEmail)}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not found');
        })
        .then(dbData => {
          setData(prev => ({
            ...prev,
            ...dbData,
            folio: folio || dbData.folio || prev.folio
          }));
          localStorage.setItem('comev_perfil', JSON.stringify({ ...initialData, ...dbData }));
          if (dbData.nombre) {
            setIsEditing(false);
          }
        })
        .catch(err => console.log('Passport database sync offline/not created yet', err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  const handleToggleChip = (listName: 'busco' | 'ofrezco', val: string) => {
    setData(prev => {
      const currentList = prev[listName];
      const newList = currentList.includes(val)
        ? currentList.filter(item => item !== val)
        : [...currentList, val];
      return { ...prev, [listName]: newList };
    });
  };

  const handleToggleSello = (id: number) => {
    setData(prev => {
      const sellos = prev.sellos;
      const newSellos = sellos.includes(id)
        ? sellos.filter(sid => sid !== id)
        : [...sellos, id];
      return { ...prev, sellos: newSellos };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 400;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            setData(prev => ({ ...prev, photoUrl: compressedBase64 }));
          }
        };
        img.src = ev.target!.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    localStorage.setItem('comev_perfil', JSON.stringify(data));
    
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('✓ Pasaporte guardado en base de datos');
      } else {
        showToast('✓ Pasaporte guardado (Local)');
      }
    } catch (err) {
      console.error('Error saving passport to database:', err);
      showToast('✓ Pasaporte guardado (Local)');
    }
    setIsEditing(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const earnedCount = data.sellos.length;
  const progressPercent = Math.round((earnedCount / 7) * 100);

  return (
    <div className="min-h-screen bg-deep-blue text-on-surface font-sans relative pb-20 selection:bg-secondary-orange selection:text-deep-blue">
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-pattern pointer-events-none opacity-[0.8] z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 md:px-4 pt-12 md:pt-24">
        
        {/* Back Link */}
        <button
          onClick={() => { window.location.hash = ''; }}
          className="inline-flex items-center gap-2 font-mono text-xs text-on-surface-variant hover:text-white uppercase tracking-widest cursor-pointer transition-colors duration-200 mb-6 bg-surface-card/60 backdrop-blur-md px-4 py-2 border border-outline/30 rounded-xs"
        >
          <ArrowLeft className="w-4 h-4 text-secondary-orange" />
          Volver a Inicio
        </button>

        {isEditing ? (
          <>
            {/* Title & Description */}
            <div className="mb-10 text-center md:text-left">
              <span className="text-secondary-orange font-bold text-xs uppercase font-mono tracking-widest">
                COMEV 2026 • Convención Nacional
              </span>
              <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tight text-white mt-1">
                CONFIGURAR <span className="text-secondary-orange">PASAPORTE</span>
              </h2>
              <p className="text-on-surface-variant font-sans text-sm mt-2 max-w-2xl">
                Completa tus datos profesionales de networking y registra tu asistencia a los 7 momentos cumbre del congreso para validar tu pasaporte digital.
              </p>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sticky Live Passport Badge Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex justify-center w-full">
            
            {/* The Badge Card Container (Premium Glassmorphic Redesign) */}
            <div className="relative w-full max-w-[420px] bg-gradient-to-b from-[#001c38]/90 to-[#001021]/95 border-2 border-secondary-orange/60 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(254,152,0,0.15)] flex flex-col justify-between p-6 md:p-8">
              {/* Outer double border glow */}
              <div className="absolute inset-[3px] border border-outline/25 rounded-xl pointer-events-none" />
              {/* Grid Background in card */}
              <div className="absolute inset-0 grid-pattern opacity-[0.25] pointer-events-none rounded-2xl" />
              
              {/* Top Orange Header bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-orange via-amber-500 to-secondary-orange" />
              {/* Bottom Orange Footer bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-orange via-amber-500 to-secondary-orange" />

              {/* CARD CONTENT HEADER */}
              <div className="relative z-10 text-center border-b border-outline/20 pb-4">
                <span className="font-mono text-[10px] md:text-xs font-bold text-secondary-orange tracking-widest uppercase opacity-90 block">
                  PASAPORTE NORTEÑO • COMEV 2026
                </span>
                <h3 className="font-headline font-black text-3xl md:text-4xl tracking-tighter text-white uppercase mt-2 leading-none">
                  PASAPORTE
                </h3>
                <h4 className="font-headline font-black text-sm md:text-base tracking-[6px] text-secondary-orange italic leading-none mt-1 pl-[6px]">
                  NORTEÑO
                </h4>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="w-12 h-px bg-secondary-orange/40" />
                  <Sparkles className="w-2.5 h-2.5 text-accent-orange/80 animate-pulse" />
                  <div className="w-12 h-px bg-secondary-orange/40" />
                </div>
              </div>

              {/* MIDDLE AREA: Photo & Identification */}
              <div className="relative z-10 flex flex-col items-center py-6 grow justify-center">
                
                {/* Photo & Frame with pulsing border glow */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-2xl bg-[#000d1a] border-2 border-secondary-orange/60 overflow-hidden cursor-pointer group hover:border-secondary-orange transition-all duration-300 relative flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(254,152,0,0.2)]"
                >
                  {data.photoUrl ? (
                    <img 
                      src={data.photoUrl} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-8 h-8 text-on-surface-variant group-hover:text-secondary-orange mx-auto mb-1 transition-colors" />
                      <span className="font-mono text-[9px] text-on-surface-variant font-bold tracking-widest block uppercase">
                        FOTO
                      </span>
                    </div>
                  )}
                  {/* Photo Overlay hover effect */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="font-mono text-xs text-white font-bold tracking-wider uppercase">
                      Cambiar
                    </span>
                  </div>
                </div>

                {/* Name & Title (Larger & Premium) */}
                <div className="text-center w-full px-2">
                  <h5 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-tight break-words">
                    {data.nombre || 'NOMBRE COMPLETO'}
                  </h5>
                  <p className="font-mono text-sm md:text-base text-secondary-orange font-bold uppercase tracking-wider mt-1 truncate">
                    {data.cargo || 'CARGO / PUESTO'}
                  </p>
                  <p className="font-mono text-xs md:text-sm text-on-surface-variant uppercase tracking-wider leading-none mt-1.5 truncate">
                    {data.empresa || 'EMPRESA'}
                  </p>
                </div>
              </div>

              {/* CARD DETAILS FOOTER - HIDE FOLIO AND LARGER TEXT */}
              <div className="relative z-10 border-t border-outline/25 pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 text-[10px] md:text-xs font-mono leading-tight">
                  <div>
                    <span className="text-secondary-orange/80 uppercase block tracking-wider font-semibold">DELEGACIÓN</span>
                    <span className="text-white font-bold text-sm md:text-base uppercase block mt-1 truncate">{data.delegacion || '—'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-secondary-orange/80 uppercase block tracking-wider font-semibold">MODALIDAD</span>
                    <span className="text-white font-bold text-sm md:text-base uppercase block mt-1 truncate">{data.modalidad || '—'}</span>
                  </div>
                </div>

                <div className="border-t border-outline/15 my-0.5" />

                {/* Earned Stamp Icons Mini list inside card */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] md:text-xs text-secondary-orange font-bold tracking-widest text-center block uppercase">
                    SELLOS DE ACTIVIDADES
                  </span>
                  
                  {/* Minified stamp row */}
                  <div className="flex justify-between px-1">
                    {SELLOS_INFO.map(s => {
                      const earned = data.sellos.includes(s.id);
                      return (
                        <div 
                          key={s.id} 
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-black font-headline transition-all duration-300 ${
                            earned 
                              ? `${s.bgClass} ${s.borderClass} ${s.textClass} scale-110 shadow-[0_0_10px_rgba(254,152,0,0.35)]` 
                              : 'border-outline/30 bg-[#071727] text-outline'
                          }`}
                          title={`${s.name}: ${earned ? 'Ganado' : 'Pendiente'}`}
                        >
                          {s.id}
                        </div>
                      );
                    })}
                  </div>

                  {/* Minified progress info */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant mt-1 px-1">
                    <span>PROGRESO: {earnedCount} / 7</span>
                    <span className="text-secondary-orange font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#0b2136] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-secondary-orange h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* QR Code section */}
                <div className="border-t border-outline/15 my-0.5" />
                <div className="flex items-center justify-between bg-[#000d1a]/60 border border-outline/20 p-2.5 rounded-xl">
                  <div className="text-left font-mono">
                    <span className="text-[9px] md:text-[10px] text-on-surface-variant uppercase block">COMEV CONNECT</span>
                    <span className="text-xs md:text-sm text-white font-black uppercase block tracking-wider">NETWORKING PASS</span>
                  </div>
                  
                  {/* Vector QR Code */}
                  <div className="w-12 h-12 bg-white p-1 rounded-md flex items-center justify-center shrink-0 shadow-md">
                    <svg viewBox="0 0 25 25" className="w-full h-full text-deep-blue" shapeRendering="crispEdges">
                      <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm8-2h1v3h-1zm3 0h1v1h-1zm1 0h3v1h-3zm4 0h3v7h-3zm1 1v5h1V1zm-4 1h1v1h-1zm-2 1h2v1h-2zm-3 1h2v1H8zm5 0h1v1h-1zm-5 2h1v1H8zm1 1h2v1H9zm1 1h2v1h-2zm1-8h1v1h-1zm0 3h1v1h-1zm2 1h1v1h-1zm1 0h1v2h-1zm-3 2h2v1h-2zm-5 5h1v1H0zm1 1v5h5v-5zm1 1h3v3H2zm6-2h1v3H8zm2 0h2v1h-2zm4 0h1v2h-1zm-3 1h2v1h-2zm7 0h3v1h-3zm-9 2h1v1H8zm2 0h1v2h-1zm6 0h1v1h-1zm2 0h1v3h-1zm-7 1h1v1H9zm3 0h2v1h-2zm-2 2h3v1h-3zm6 0h2v1h-2zm1 1h1v1h-1z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Form & Stamp Toggler */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* FILE INPUT UNDER THE HOOD */}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* CAMERA INPUT UNDER THE HOOD */}
            <input 
              type="file" 
              ref={cameraInputRef}
              onChange={handlePhotoUpload} 
              accept="image/*" 
              capture="user"
              className="hidden" 
            />

            {/* FOTO DE PERFIL */}
            <div className="bg-surface-card border border-outline/30 rounded-xl p-6 shadow-md flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 shrink-0 rounded-lg bg-[#001021] border border-secondary-orange/50 overflow-hidden relative flex items-center justify-center shadow-inner shadow-black/60">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-on-surface-variant" />
                )}
              </div>
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <h5 className="font-headline font-bold text-white text-base">Foto del Pasaporte</h5>
                <p className="text-xs text-on-surface-variant font-sans leading-relaxed">
                  Sube una imagen desde tu galería o utiliza la cámara de tu teléfono para capturar tu foto de perfil.
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-secondary-orange hover:bg-accent-orange text-deep-blue font-mono text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-150 cursor-pointer border-none shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Tomar Foto con Cámara
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#001021] border border-outline/30 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors hover:border-secondary-orange/50 cursor-pointer"
                  >
                    Subir de Galería
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN 1: DATOS PERSONALES */}
            <div className="bg-surface-card border border-outline/30 rounded-xl p-6 shadow-md">
              <h4 className="font-headline font-bold text-lg text-white mb-4 flex items-center gap-2 border-b border-outline/20 pb-2">
                <Briefcase className="w-5 h-5 text-secondary-orange" />
                Datos del Congresista
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nombre" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={data.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cargo" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Cargo / Puesto
                  </label>
                  <input
                    type="text"
                    id="cargo"
                    value={data.cargo}
                    onChange={handleChange}
                    placeholder="Director, Gerente, Consultor..."
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="empresa" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Empresa / Organización
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    value={data.empresa}
                    onChange={handleChange}
                    placeholder="Nombre de tu empresa"
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="delegacion" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Delegación EVM
                  </label>
                  <input
                    type="text"
                    id="delegacion"
                    value={data.delegacion}
                    onChange={handleChange}
                    placeholder="Chihuahua, MTY, CDMX..."
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="whatsapp" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    value={data.whatsapp}
                    onChange={handleChange}
                    placeholder="+52 614 000 0000"
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="linkedin" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    id="linkedin"
                    value={data.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/in/nombre"
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="correo@empresa.com"
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modalidad" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Modalidad de Asistencia
                  </label>
                  <select
                    id="modalidad"
                    value={data.modalidad}
                    onChange={handleChange}
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 cursor-pointer appearance-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="individual">Individual</option>
                    <option value="pareja">Pareja</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: PERFIL DE NEGOCIO */}
            <div className="bg-surface-card border border-outline/30 rounded-xl p-6 shadow-md">
              <h4 className="font-headline font-bold text-lg text-white mb-4 flex items-center gap-2 border-b border-outline/20 pb-2">
                <MapPin className="w-5 h-5 text-secondary-orange" />
                Perfil de Negocio
              </h4>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="descripcion" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    ¿A qué se dedica tu empresa?
                  </label>
                  <textarea
                    id="descripcion"
                    value={data.descripcion}
                    onChange={handleChange}
                    placeholder="Describe brevemente tu empresa, productos o servicios..."
                    rows={3}
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="industria" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      Industria
                    </label>
                    <select
                      id="industria"
                      value={data.industria}
                      onChange={handleChange}
                      className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Seleccionar</option>
                      {INDUSTRIAS.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="tamano" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                      Tamaño de Empresa
                    </label>
                    <select
                      id="tamano"
                      value={data.tamano}
                      onChange={handleChange}
                      className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Seleccionar</option>
                      {TAMANOS.map(t => (
                        <option key={t.val} value={t.val}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: COMEV CONNECT - NETWORKING */}
            <div className="bg-surface-card border border-outline/30 rounded-xl p-6 shadow-md">
              <h4 className="font-headline font-bold text-lg text-white mb-4 flex items-center gap-2 border-b border-outline/20 pb-2">
                <Sparkles className="w-5 h-5 text-secondary-orange" />
                COMEV Connect • Networking
              </h4>

              <div className="flex flex-col gap-5">
                
                {/* ¿Qué buscas? */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    ¿Qué buscas en COMEV? <span className="text-outline font-normal font-sans">(elige todos los que apliquen)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {BUSQUEDAS.map(b => {
                      const active = data.busco.includes(b.val);
                      return (
                        <button
                          type="button"
                          key={b.val}
                          onClick={() => handleToggleChip('busco', b.val)}
                          className={`font-mono text-xs px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                            active 
                              ? 'bg-secondary-orange border-secondary-orange text-deep-blue font-bold shadow-md shadow-secondary-orange/10' 
                              : 'bg-[#001021] border-outline/40 text-on-surface-variant hover:border-secondary-orange/40 hover:text-white'
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ¿Qué ofreces? */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    ¿Qué puedes ofrecer? <span className="text-outline font-normal font-sans">(elige todos los que apliquen)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {OFRECIMIENTOS.map(o => {
                      const active = data.ofrezco.includes(o.val);
                      return (
                        <button
                          type="button"
                          key={o.val}
                          onClick={() => handleToggleChip('ofrezco', o.val)}
                          className={`font-mono text-xs px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                            active 
                              ? 'bg-secondary-orange border-secondary-orange text-deep-blue font-bold shadow-md shadow-secondary-orange/10' 
                              : 'bg-[#001021] border-outline/40 text-on-surface-variant hover:border-secondary-orange/40 hover:text-white'
                          }`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reto de Negocio */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label htmlFor="reto" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    ¿Cuál es tu mayor reto de negocio hoy?
                  </label>
                  <textarea
                    id="reto"
                    value={data.reto}
                    onChange={handleChange}
                    placeholder="Sé específico — este campo es el más valioso para conectarte con las personas correctas..."
                    rows={3}
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 resize-y"
                  />
                </div>

                {/* Objetivo */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="objetivo" className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Al terminar COMEV 2026, quiero haber logrado...
                  </label>
                  <textarea
                    id="objetivo"
                    value={data.objetivo}
                    onChange={handleChange}
                    placeholder="Tu resultado esperado del congreso..."
                    rows={2}
                    className="w-full bg-[#001021] border border-outline/40 hover:border-secondary-orange/50 focus:border-secondary-orange focus:bg-[#0d1e30] rounded-lg px-4 py-2.5 font-mono text-sm text-white outline-none transition-all duration-200 resize-y"
                  />
                </div>

              </div>
            </div>

            {/* SECCIÓN 4: SIMULADOR DE SELLOS DEL CONGRESO */}
            <div className="bg-surface-card border border-outline/30 rounded-xl p-6 shadow-md">
              <h4 className="font-headline font-bold text-lg text-white mb-1 flex items-center gap-2 border-b border-outline/20 pb-2">
                <Award className="w-5 h-5 text-secondary-orange" />
                Simulador de Sellos del Congreso
              </h4>
              <p className="text-xs text-on-surface-variant font-mono mb-4">
                Tus 7 momentos clave — Haz clic en cada uno para marcarlos como completados y ganar el sello correspondiente:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {SELLOS_INFO.map(s => {
                  const earned = data.sellos.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleToggleSello(s.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-250 cursor-pointer text-left ${
                        earned 
                          ? `${s.bgClass} ${s.borderClass} shadow-md shadow-black/20` 
                          : 'bg-[#001021]/80 border-outline/30 hover:border-outline/60 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* Stamp Circle representation */}
                      <div 
                        className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 text-sm font-black font-headline transition-colors ${
                          earned 
                            ? `${s.borderClass} ${s.textClass} border-solid` 
                            : 'border-outline/40 border-dashed text-outline'
                        }`}
                      >
                        {s.id}
                      </div>

                      {/* Info Text */}
                      <div className="overflow-hidden leading-tight">
                        <span className={`text-[11px] font-bold block truncate ${earned ? 'text-white' : 'text-on-surface-variant'}`}>
                          {s.name}
                        </span>
                        <span className="text-[9px] text-on-surface-variant block mt-0.5 truncate font-mono">
                          {s.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary bottom */}
              <div className="mt-6 p-4 bg-[#001021]/60 rounded-xl border border-outline/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto text-center sm:text-left leading-snug">
                  <span className="font-mono text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                    PROGRESO DEL PASAPORTE
                  </span>
                  <span className="font-headline font-black text-xl text-white mt-1 block">
                    {earnedCount} de 7 momentos completados
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-mono text-2xl font-black text-secondary-orange block">
                      {progressPercent}%
                    </span>
                  </div>
                  {earnedCount === 7 && (
                    <div className="bg-[#10b981]/15 text-[#10b981] p-1 rounded-full animate-bounce">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* GUARDAR BUTTON */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-secondary-orange hover:bg-accent-orange text-deep-blue font-headline font-black py-4 px-6 uppercase text-base tracking-widest flex items-center justify-center gap-3 cursor-pointer select-none active:scale-[0.99] transition-all duration-150 btn-glow-orange border-none rounded-xl"
              >
                <Sparkles className="w-5 h-5 text-deep-blue" />
                <span>Guardar mi Pasaporte</span>
                <Sparkles className="w-5 h-5 text-deep-blue" />
              </button>

              <div className="text-center italic font-headline font-black text-sm text-secondary-orange tracking-widest mt-2">
                ¡VIVA CHIHUAHUA!
              </div>
            </div>

          </div>

        </div>
        </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 w-full max-w-[440px] mx-auto px-2 pb-16">
            
            {/* Centered Passport Badge Container (Premium Glassmorphic Redesign) */}
            <div className="relative w-full bg-gradient-to-b from-[#001c38]/90 to-[#001021]/95 border-2 border-secondary-orange/60 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(254,152,0,0.2)] flex flex-col justify-between p-6 md:p-8">
              {/* Outer double border glow */}
              <div className="absolute inset-[3px] border border-outline/25 rounded-xl pointer-events-none" />
              {/* Grid Background in card */}
              <div className="absolute inset-0 grid-pattern opacity-[0.25] pointer-events-none rounded-2xl" />
              
              {/* Top Orange Header bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-orange via-amber-500 to-secondary-orange" />
              {/* Bottom Orange Footer bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-secondary-orange via-amber-500 to-secondary-orange" />

              {/* CARD CONTENT HEADER */}
              <div className="relative z-10 text-center border-b border-outline/20 pb-4">
                <span className="font-mono text-[10px] md:text-xs font-bold text-secondary-orange tracking-widest uppercase opacity-90 block">
                  PASAPORTE NORTEÑO • COMEV 2026
                </span>
                <h3 className="font-headline font-black text-3xl md:text-4xl tracking-tighter text-white uppercase mt-2 leading-none">
                  PASAPORTE
                </h3>
                <h4 className="font-headline font-black text-sm md:text-base tracking-[6px] text-secondary-orange italic leading-none mt-1 pl-[6px]">
                  NORTEÑO
                </h4>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <div className="w-12 h-px bg-secondary-orange/40" />
                  <Sparkles className="w-2.5 h-2.5 text-accent-orange/80 animate-pulse" />
                  <div className="w-12 h-px bg-secondary-orange/40" />
                </div>
              </div>

              {/* MIDDLE AREA: Photo & Identification */}
              <div className="relative z-10 flex flex-col items-center py-6 grow justify-center">
                {/* Photo & Frame with pulsing border glow */}
                <div className="w-32 h-32 rounded-2xl bg-[#000d1a] border-2 border-secondary-orange/60 overflow-hidden relative flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(254,152,0,0.2)]">
                  {data.photoUrl ? (
                    <img src={data.photoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="w-8 h-8 text-on-surface-variant mx-auto mb-1" />
                      <span className="font-mono text-[9px] text-on-surface-variant font-bold tracking-widest block uppercase">
                        SIN FOTO
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & Title (Larger & Premium) */}
                <div className="text-center w-full px-2">
                  <h5 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-tight break-words">
                    {data.nombre || 'NOMBRE COMPLETO'}
                  </h5>
                  <p className="font-mono text-sm md:text-base text-secondary-orange font-bold uppercase tracking-wider mt-1 truncate">
                    {data.cargo || 'CARGO / PUESTO'}
                  </p>
                  <p className="font-mono text-xs md:text-sm text-on-surface-variant uppercase tracking-wider leading-none mt-1.5 truncate">
                    {data.empresa || 'EMPRESA'}
                  </p>
                </div>
              </div>

              {/* CARD DETAILS FOOTER - HIDE FOLIO AND LARGER TEXT */}
              <div className="relative z-10 border-t border-outline/25 pt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 text-[10px] md:text-xs font-mono leading-tight">
                  <div>
                    <span className="text-secondary-orange/80 uppercase block tracking-wider font-semibold">DELEGACIÓN</span>
                    <span className="text-white font-bold text-sm md:text-base uppercase block mt-1 truncate">{data.delegacion || '—'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-secondary-orange/80 uppercase block tracking-wider font-semibold">MODALIDAD</span>
                    <span className="text-white font-bold text-sm md:text-base uppercase block mt-1 truncate">{data.modalidad || '—'}</span>
                  </div>
                </div>

                <div className="border-t border-outline/15 my-0.5" />

                {/* Earned Stamp Icons Mini list inside card */}
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[10px] md:text-xs text-secondary-orange font-bold tracking-widest text-center block uppercase">
                    SELLOS DE ACTIVIDADES
                  </span>
                  
                  <div className="flex justify-between px-1">
                    {SELLOS_INFO.map(s => {
                      const earned = data.sellos.includes(s.id);
                      return (
                        <div 
                          key={s.id} 
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-black font-headline transition-all duration-300 ${
                            earned 
                              ? `${s.bgClass} ${s.borderClass} ${s.textClass} scale-110 shadow-[0_0_10px_rgba(254,152,0,0.35)]` 
                              : 'border-outline/30 bg-[#071727] text-outline'
                          }`}
                          title={`${s.name}: ${earned ? 'Ganado' : 'Pendiente'}`}
                        >
                          {s.id}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant mt-1 px-1">
                    <span>PROGRESO: {earnedCount} / 7</span>
                    <span className="text-secondary-orange font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#0b2136] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-secondary-orange h-full rounded-full transition-all duration-500 ease-out" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="border-t border-outline/15 my-0.5" />
                <div className="flex items-center justify-between bg-[#000d1a]/60 border border-outline/20 p-2.5 rounded-xl">
                  <div className="text-left font-mono">
                    <span className="text-[9px] md:text-[10px] text-on-surface-variant uppercase block">COMEV CONNECT</span>
                    <span className="text-xs md:text-sm text-white font-black uppercase block tracking-wider">NETWORKING PASS</span>
                  </div>
                  
                  <div className="w-12 h-12 bg-white p-1 rounded-md flex items-center justify-center shrink-0 shadow-md">
                    <svg viewBox="0 0 25 25" className="w-full h-full text-deep-blue" shapeRendering="crispEdges">
                      <path d="M0 0h7v7H0zm1 1v5h5V1zm1 1h3v3H2zm8-2h1v3h-1zm3 0h1v1h-1zm1 0h3v1h-3zm4 0h3v7h-3zm1 1v5h1V1zm-4 1h1v1h-1zm-2 1h2v1h-2zm-3 1h2v1H8zm5 0h1v1h-1zm-5 2h1v1H8zm1 1h2v1H9zm1 1h2v1h-2zm1-8h1v1h-1zm0 3h1v1h-1zm2 1h1v1h-1zm1 0h1v2h-1zm-3 2h2v1h-2zm-5 5h1v1H0zm1 1v5h5v-5zm1 1h3v3H2zm6-2h1v3H8zm2 0h2v1h-2zm4 0h1v2h-1zm-3 1h2v1h-2zm7 0h3v1h-3zm-9 2h1v1H8zm2 0h1v2h-1zm6 0h1v1h-1zm2 0h1v3h-1zm-7 1h1v1H9zm3 0h2v1h-2zm-2 2h3v1h-3zm6 0h2v1h-2zm1 1h1v1h-1z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Discrete Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-3 border border-secondary-orange/30 hover:border-secondary-orange bg-[#001021]/85 backdrop-blur-md text-secondary-orange hover:text-white rounded-xl text-xs uppercase tracking-wider font-mono font-bold transition-all shadow-lg active:scale-95 duration-100 cursor-pointer w-full max-w-[440px] justify-center mt-2"
            >
              <Edit3 className="w-4 h-4" />
              Editar Información
            </button>

            {/* Activity Stamps Simulator directly on the View screen */}
            <div className="bg-[#001021]/80 backdrop-blur-md border border-outline/25 rounded-2xl p-6 shadow-xl w-full max-w-[440px]">
              <h4 className="font-headline font-bold text-sm text-white mb-1 flex items-center gap-2 border-b border-outline/10 pb-2 uppercase tracking-wide">
                <Award className="w-4.5 h-4.5 text-secondary-orange" />
                Tus Sellos de Actividades
              </h4>
              <p className="text-[10px] text-on-surface-variant font-mono mb-4 leading-normal">
                Toca un sello para simular la validación de tu asistencia a las actividades oficiales:
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {SELLOS_INFO.map(s => {
                  const earned = data.sellos.includes(s.id);
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => handleToggleSello(s.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
                        earned 
                          ? `${s.bgClass} ${s.borderClass} opacity-100 shadow-[0_0_10px_rgba(254,152,0,0.1)]` 
                          : 'bg-[#000c17]/60 border-outline/10 opacity-50 hover:opacity-100'
                      }`}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black font-headline shrink-0 ${
                          earned ? `${s.borderClass} ${s.textClass}` : 'border-outline/30 text-outline border-dashed'
                        }`}
                      >
                        {s.id}
                      </div>
                      <div className="overflow-hidden leading-tight">
                        <span className="text-[10px] font-bold block truncate text-white">
                          {s.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Small Progress bar */}
              <div className="mt-4 pt-3 border-t border-outline/10 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                <span>Progreso: {earnedCount} de 7</span>
                <span className="text-secondary-orange font-bold">{progressPercent}%</span>
              </div>
            </div>

            {/* Networking / Business Profile summary card */}
            <div className="bg-[#001021]/85 backdrop-blur-md border border-outline/25 rounded-2xl p-6 shadow-xl w-full max-w-[440px] space-y-4">
              <h4 className="font-headline font-bold text-sm text-white border-b border-outline/10 pb-2 uppercase tracking-wide">
                Perfil de Networking
              </h4>
              
              {data.descripcion && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-secondary-orange uppercase block tracking-wider">¿Qué hace mi empresa?</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{data.descripcion}</p>
                </div>
              )}

              {data.reto && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-secondary-orange uppercase block tracking-wider">Mi Mayor Reto de Negocio</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{data.reto}</p>
                </div>
              )}

              {data.objetivo && (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-secondary-orange uppercase block tracking-wider">Objetivo en COMEV</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{data.objetivo}</p>
                </div>
              )}

              {(data.busco.length > 0 || data.ofrezco.length > 0) && (
                <div className="border-t border-outline/10 pt-3 grid grid-cols-2 gap-4">
                  {data.busco.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-secondary-orange uppercase block tracking-wider">Busco</span>
                      <div className="flex flex-wrap gap-1">
                        {data.busco.map(b => (
                          <span key={b} className="text-[8px] bg-secondary-orange/10 border border-secondary-orange/20 text-secondary-orange px-2 py-0.5 rounded-full uppercase font-mono">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.ofrezco.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[8px] font-mono text-secondary-orange uppercase block tracking-wider">Ofrezco</span>
                      <div className="flex flex-wrap gap-1">
                        {data.ofrezco.map(o => (
                          <span key={o} className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-mono">{o}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Toast alert popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#10b981] border border-[#10b981] text-white px-6 py-3 rounded-lg shadow-xl font-mono text-xs font-bold uppercase tracking-wider animate-fadeIn flex items-center gap-2">
          <Check className="w-4 h-4 text-white" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
