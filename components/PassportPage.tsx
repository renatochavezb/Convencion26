import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';
import { SELLOS_INFO, parseSelloParam } from '@/constants/sellos';
import { claimSelloQr, toggleSelloManual, isSelloQrLocked } from '@/lib/sellos';

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
  sellos: number[];
  sellosQr?: number[];
  photoUrl: string;
  bannerUrl: string;
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
  { val: '1–10', label: '1–10 personas' },
  { val: '11–50', label: '11–50 personas' },
  { val: '51–200', label: '51–200 personas' },
  { val: '200+', label: '200+ personas' }
];

const BUSQUEDAS = [
  { val: 'Clientes', label: 'Clientes' },
  { val: 'Socios', label: 'Socios' },
  { val: 'Mentores', label: 'Mentores' },
  { val: 'Inversión', label: 'Inversión' },
  { val: 'Talento', label: 'Talento' },
  { val: 'Aprendizaje', label: 'Aprendizaje' },
  { val: 'Alianzas', label: 'Alianzas' },
  { val: 'Proveedores', label: 'Proveedores' }
];

const OFRECIMIENTOS = [
  { val: 'Experiencia', label: 'Experiencia' },
  { val: 'Red de contactos', label: 'Red de contactos' },
  { val: 'Capital', label: 'Capital' },
  { val: 'Mercado', label: 'Mercado' },
  { val: 'Conocimiento técnico', label: 'Conocimiento' },
  { val: 'Distribución', label: 'Distribución' },
  { val: 'Mentoría', label: 'Mentoría' }
];

const PENDING_SELLO_KEY = 'comev_pending_sello';

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
    sellosQr: [],
    photoUrl: '',
    bannerUrl: ''
  });

  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [activePage, setActivePage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedSello, setExpandedSello] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const qrClaimProcessed = useRef(false);

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
      sellos: initialData.sellos || [],
      sellosQr: initialData.sellosQr || []
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

  // Monitor scroll snap index
  useEffect(() => {
    const container = document.getElementById('pages-container');
    if (!container) return;
    const handleScroll = () => {
      const pageHeight = container.clientHeight;
      if (pageHeight <= 0) return;
      const scrollTop = container.scrollTop;
      const index = Math.round(scrollTop / pageHeight);
      setActivePage(index);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (expandedSello === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedSello(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [expandedSello]);

  const openSelloView = (id: number) => setExpandedSello(id);

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

  const goPage = (i: number) => {
    const container = document.getElementById('pages-container');
    if (container) {
      const pageHeight = container.clientHeight;
      container.scrollTo({ top: i * pageHeight, behavior: 'smooth' });
      setActivePage(i);
    }
  };

  const persistPassport = useCallback((updatedData: PassportData) => {
    localStorage.setItem('comev_perfil', JSON.stringify(updatedData));
    if (updatedData.email?.trim()) {
      fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      }).catch(err => console.error('Offline passport save failed', err));
    }
  }, []);

  const handleToggleSello = (id: number) => {
    setData(prev => {
      const result = toggleSelloManual(prev, id);
      if (result.action === 'locked') {
        setToastMessage('Este sello fue verificado por QR y no se puede quitar');
        setTimeout(() => setToastMessage(null), 3000);
        return prev;
      }
      const updatedData = { ...prev, sellos: result.sellos, sellosQr: result.sellosQr };
      persistPassport(updatedData);
      setToastMessage(
        result.action === 'added' ? `✓ Sello ${id} agregado manualmente` : `Sello ${id} quitado`
      );
      setTimeout(() => setToastMessage(null), 3000);
      return updatedData;
    });
  };

  useEffect(() => {
    if (qrClaimProcessed.current) return;

    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseSelloParam(params.get('sello'));
    if (fromUrl) {
      sessionStorage.setItem(PENDING_SELLO_KEY, String(fromUrl));
      const cleanUrl = `${window.location.pathname}${window.location.hash || '#pasaporte'}`;
      window.history.replaceState({}, '', cleanUrl);
    }

    const pending = parseSelloParam(sessionStorage.getItem(PENDING_SELLO_KEY));
    if (!pending) return;

    qrClaimProcessed.current = true;
    sessionStorage.removeItem(PENDING_SELLO_KEY);

    let base: PassportData = {
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
      sellosQr: [],
      photoUrl: '',
      bannerUrl: '',
    };

    const savedProfile = localStorage.getItem('comev_perfil');
    if (savedProfile) {
      try {
        base = { ...base, ...JSON.parse(savedProfile) };
      } catch (e) {
        console.error('Error parsing profile for QR claim', e);
      }
    }

    const result = claimSelloQr(base, pending);
    const updated = { ...base, sellos: result.sellos, sellosQr: result.sellosQr };
    setData(updated);
    persistPassport(updated);
    setToastMessage(
      result.isNew
        ? `✓ Sello ${pending} registrado por QR`
        : `✓ Sello ${pending} ya estaba en tu pasaporte`
    );
    setTimeout(() => setToastMessage(null), 3500);
    setExpandedSello(pending);
    setTimeout(() => goPage(1), 300);
  }, [persistPassport]);

  const startLongPress = (id: number) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      handleToggleSello(id);
    }, 650);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleSelloCardClick = (id: number) => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }
    openSelloView(id);
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
            
            setData(prev => {
              const updatedData = { ...prev, photoUrl: compressedBase64 };
              localStorage.setItem('comev_perfil', JSON.stringify(updatedData));
              // Background save
              fetch('/api/passport', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
              }).catch(err => console.error('Offline photo save failed', err));
              return updatedData;
            });
          }
        };
        img.src = ev.target!.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    localStorage.setItem('comev_perfil', JSON.stringify(data));
    
    if (!data.email || !data.email.trim()) {
      showToast('⚠️ Guardado localmente (Se requiere email para guardar en base de datos)');
      setIsEditing(false);
      return;
    }
    
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('✓ Pasaporte guardado en base de datos');
      } else {
        let errMsg = '';
        try {
          const errData = await res.json();
          errMsg = errData.error || res.statusText;
        } catch {
          errMsg = `Estado ${res.status}`;
        }
        if (res.status === 404 || errMsg.includes('Not Found') || errMsg.includes('FUNCTION_INVOCATION_FAILED')) {
          showToast('⚠️ Guardado localmente. El servidor API no está disponible — ejecuta npm run dev:all en local o revisa Vercel.');
        } else {
          showToast(`⚠️ Guardado localmente (Error del servidor: ${errMsg})`);
        }
      }
    } catch (err: any) {
      console.error('Error saving passport to database:', err);
      showToast('⚠️ Guardado localmente. No hay conexión con el servidor — en local usa npm run dev:all.');
    }
    setIsEditing(false);
  };

  const openModal = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const formatName = (name: string) => {
    if (!name) return <>TU<br/>NOMBRE</>;
    const parts = name.trim().split(' ');
    const first = parts[0] || '';
    const rest = parts.slice(1).join(' ') || '';
    return rest ? <>{first}<br/>{rest}</> : <>{first}</>;
  };

  const earnedCount = data.sellos.length;
  const progressPercent = Math.round((earnedCount / 7) * 100);

  return (
    <div className="passport-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .passport-container {
          --navy: #000f20;
          --navy2: #040d1a;
          --orange: #fe9800;
          --orange2: #ffc080;
          --border: #172b41;
          --border2: #0b2136;
          --border3: #0b1f35;
          --text: #e2e8f0;
          --dim: #64748b;
          --muted: #334155;
          --dark: #1e3a5f;
          
          background: #08121e;
          font-family: 'JetBrains Mono', monospace;
          max-width: 390px;
          margin: 0 auto;
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          box-shadow: 0 0 50px rgba(0,0,0,0.8);
          -webkit-font-smoothing: antialiased;
        }
        
        .passport-container * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .passport-container .desktop-header {
          display: none;
        }

        .passport-container .pages {
          height: 100vh;
          height: 100dvh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        .passport-container .page {
          scroll-snap-align: start;
          min-height: 100vh;
          min-height: 100dvh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .passport-container .page::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            -45deg, transparent, transparent 22px,
            rgba(254,152,0,.022) 22px, rgba(254,152,0,.022) 23px
          );
          pointer-events: none; z-index: 0;
        }

        .passport-container .page::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #fe9800, #ffc080, #fe9800);
          z-index: 10;
        }

        .passport-container .bottom-line {
          height: 3px;
          background: linear-gradient(90deg, #fe9800, #ffc080, #fe9800);
          flex-shrink: 0;
        }

        .passport-container .inner {
          position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;
        }

        .passport-container .topbar {
          background: var(--navy2);
          padding: .45rem 1.1rem;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 0.5px solid var(--border);
          flex-shrink: 0;
        }

        .passport-container .tl {
          font-size: 8px; color: var(--dim); letter-spacing: .14em; text-transform: uppercase;
        }

        .passport-container .tr {
          font-size: 8px; color: var(--orange); font-weight: 700; letter-spacing: .1em;
        }

        .passport-container .brand {
          padding: .85rem 1.1rem .75rem;
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 0.5px solid var(--border);
          flex-shrink: 0; background: var(--navy);
        }

        .passport-container .brand-sup {
          font-size: 8px; color: var(--dim); letter-spacing: .16em; text-transform: uppercase; margin-bottom: .22rem;
        }

        .passport-container .brand-line1 {
          font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700; font-style: italic; color: #94a3b8; line-height: 1; margin-bottom: .16rem;
        }

        .passport-container .brand-line2 {
          font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 900; font-style: italic; color: var(--orange); line-height: 1; letter-spacing: -.5px; white-space: nowrap;
        }

        .passport-container .brand-line2.cyan {
          color: #06b6d4;
        }

        .passport-container .seal {
          width: 46px; height: 46px; border-radius: 50%; border: 1.5px solid var(--orange); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .passport-container .seal-s {
          font-size: 6px; font-weight: 700; letter-spacing: .08em; color: var(--orange); text-transform: uppercase;
        }

        .passport-container .seal-n {
          font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900; color: var(--orange); line-height: 1;
        }

        .passport-container .hero {
          display: flex; flex: 1; min-height: 190px; background: var(--navy);
        }

        .passport-container .photo-col {
          width: 120px; flex-shrink: 0;
          background: var(--border2);
          display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 6px;
          border-right: 0.5px solid var(--border);
          cursor: pointer; position: relative; overflow: hidden;
        }

        .passport-container .photo-col img {
          width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0;
        }

        .passport-container .photo-placeholder {
          text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px;
        }

        .passport-container .photo-icon {
          font-size: 26px; color: var(--dark);
        }

        .passport-container .photo-lbl {
          font-size: 8px; color: var(--dark); text-transform: uppercase; letter-spacing: .1em; text-align: center; line-height: 1.5;
        }

        .passport-container .name-col {
          flex: 1; padding: .85rem .9rem; display: flex; flex-direction: column; justify-content: space-between; min-width: 0;
        }

        .passport-container .pname {
          font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 900; font-style: italic; color: #fff; line-height: 1.05; letter-spacing: -.5px; margin-bottom: .2rem;
        }

        .passport-container .pcargo {
          font-size: 10px; font-weight: 700; color: var(--orange); letter-spacing: .07em; text-transform: uppercase; margin-bottom: .08rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .passport-container .pempresa {
          font-size: 12px; color: #94a3b8; margin-bottom: .65rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .passport-container .meta {
          display: flex; flex-direction: column; gap: .3rem;
        }

        .passport-container .meta-row {
          display: flex; gap: .5rem; align-items: baseline;
        }

        .passport-container .ml {
          font-size: 8px; color: var(--dim); letter-spacing: .1em; text-transform: uppercase; min-width: 52px;
        }

        .passport-container .mv {
          font-size: 10px; color: var(--text); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .passport-container .badges {
          display: flex; gap: 5px; flex-wrap: wrap; margin-top: .5rem;
        }

        .passport-container .badge {
          font-size: 8px; padding: 2px 8px; border-radius: 3px; font-weight: 600; letter-spacing: .05em;
        }

        .passport-container .b-ind {
          background: rgba(16,185,129,.12); color: #10b981; border: 0.5px solid rgba(16,185,129,.25);
        }

        .passport-container .b-del {
          background: rgba(254,152,0,.12); color: var(--orange); border: 0.5px solid rgba(254,152,0,.25);
        }

        .passport-container .viva {
          background: var(--orange);
          padding: .38rem 1.1rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }

        .passport-container .viva-t {
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 900; font-style: italic; color: #000f20; letter-spacing: .5px;
        }

        .passport-container .viva-s {
          color: #000f20; font-size: 10px; letter-spacing: 3px;
        }

        .passport-container .reto {
          padding: .75rem 1.1rem;
          border-bottom: 0.5px solid var(--border);
          background: var(--navy2);
          flex-shrink: 0;
        }

        .passport-container .reto-lbl {
          font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); margin-bottom: .4rem; display: flex; align-items: center; gap: 6px;
        }

        .passport-container .reto-lbl::before {
          content: ''; width: 3px; height: 10px; background: var(--orange); flex-shrink: 0;
        }

        .passport-container .reto-txt {
          font-size: 12px; color: #94a3b8; line-height: 1.65; font-style: italic;
        }

        .passport-container .reto-txt strong {
          color: var(--text); font-style: normal;
        }

        .passport-container .busco {
          padding: .65rem 1.1rem;
          border-bottom: 0.5px solid var(--border);
          display: flex; gap: .75rem;
          flex-shrink: 0; background: var(--navy);
        }

        .passport-container .busco-col {
          flex: 1; min-width: 0;
        }

        .passport-container .busco-lbl {
          font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); margin-bottom: .35rem;
        }

        .passport-container .chips {
          display: flex; flex-wrap: wrap; gap: 4px;
        }

        .passport-container .co {
          font-size: 9px; padding: 2px 8px; border-radius: 20px; background: rgba(254,152,0,.12); color: var(--orange); border: 0.5px solid rgba(254,152,0,.28); font-weight: 600;
        }

        .passport-container .cc {
          font-size: 9px; padding: 2px 8px; border-radius: 20px; background: rgba(6,182,212,.1); color: #06b6d4; border: 0.5px solid rgba(6,182,212,.25); font-weight: 600;
        }

        .passport-container .sellos-strip {
          padding: .65rem 1.1rem; border-bottom: 0.5px solid var(--border); flex-shrink: 0; background: var(--navy);
        }

        .passport-container .s-lbl {
          font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); margin-bottom: .45rem; display: flex; justify-content: space-between; align-items: center;
        }

        .passport-container .s-lbl span {
          color: var(--orange); font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 700;
        }

        .passport-container .s-row {
          display: flex; gap: 6px; align-items: center; justify-content: space-between;
        }

        .passport-container .sd {
          width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px dashed; flex-shrink: 0; transition: .3s;
        }

        .passport-container .sd.earned {
          border: none;
          background: transparent;
        }

        .passport-container .sd1 { border-color: #d946ef; }
        .passport-container .sd2 { border-color: #f59e0b; }
        .passport-container .sd3 { border-color: #06b6d4; }
        .passport-container .sd4 { border-color: #f8fafc; }
        .passport-container .sd5 { border-color: #1d4ed8; }
        .passport-container .sd6 { border-color: #10b981; }
        .passport-container .sd7 { border-color: #f43f5e; }

        .passport-container .sd.earned img {
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45));
        }

        .passport-container .sdn {
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 900;
        }

        .passport-container .sd1 .sdn { color: #d946ef; }
        .passport-container .sd2 .sdn { color: #f59e0b; }
        .passport-container .sd3 .sdn { color: #06b6d4; }
        .passport-container .sd4 .sdn { color: #f8fafc; }
        .passport-container .sd5 .sdn { color: #facc15; }
        .passport-container .sd6 .sdn { color: #10b981; }
        .passport-container .sd7 .sdn { color: #f43f5e; }

        .passport-container .pm {
          height: 4px; background: var(--border3); border-radius: 2px; margin-top: .45rem; overflow: hidden; display: flex; gap: 1px;
        }

        .passport-container .pm-s {
          flex: 1; border-radius: 1px; background: var(--border2); transition: .5s;
        }

        .passport-container .pm1 { background: #d946ef; }
        .passport-container .pm2 { background: #f59e0b; }
        .passport-container .pm3 { background: #06b6d4; }
        .passport-container .pm4 { background: #f8fafc; }
        .passport-container .pm5 { background: #1d4ed8; }
        .passport-container .pm6 { background: #10b981; }
        .passport-container .pm7 { background: #f43f5e; }

        .passport-container .folio {
          padding: .55rem 1.1rem;
          display: flex; justify-content: space-between; align-items: center;
          flex-shrink: 0; background: var(--navy);
        }

        .passport-container .folio-ll {
          font-size: 7px; letter-spacing: .14em; text-transform: uppercase; color: var(--dim); margin-bottom: .12rem;
        }

        .passport-container .folio-n {
          font-size: 12px; font-weight: 700; color: var(--orange); letter-spacing: .06em;
        }

        .passport-container .folio-r {
          font-size: 8px; color: var(--dim); text-align: right; line-height: 1.6;
        }

        .passport-container .folio-r strong {
          color: #475569; display: block; font-size: 9px;
        }

        .passport-container .slist-hint {
          font-size: 8px;
          color: var(--muted);
          text-align: center;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0 0.75rem 0.35rem;
          line-height: 1.4;
        }

        .passport-container .slist {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.65rem 0.4rem;
          padding: 0.5rem 0.55rem 0.75rem;
          flex: 1;
          background: var(--navy);
          overflow-y: auto;
          align-content: start;
        }

        .passport-container .s-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.1rem 0.05rem 0.35rem;
          cursor: pointer;
          transition: transform 0.2s ease;
          background: transparent;
          border: none;
        }

        .passport-container .s-card:active {
          transform: scale(0.96);
        }

        .passport-container .s-card:last-child:nth-child(odd) {
          grid-column: 1 / -1;
          max-width: 46%;
          margin: 0 auto;
        }

        .passport-container .s-stamp {
          width: min(48vw, 168px);
          height: min(48vw, 168px);
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.3rem;
        }

        .passport-container .s-stamp-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        .passport-container .s-card.earned .s-stamp-img {
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.55));
        }

        .passport-container .s1.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(217, 70, 239, 0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s2.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s3.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s4.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(248, 250, 252, 0.35)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s5.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(250, 204, 21, 0.5)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s6.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }
        .passport-container .s7.earned .s-stamp-img { filter: drop-shadow(0 0 16px rgba(244, 63, 94, 0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.5)); }

        .passport-container .s-stamp-ghost {
          width: 82%;
          height: 82%;
          border-radius: 50%;
          border: 2px dashed;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.38;
        }

        .passport-container .s1 .s-stamp-ghost { border-color: #d946ef; }
        .passport-container .s2 .s-stamp-ghost { border-color: #f59e0b; }
        .passport-container .s3 .s-stamp-ghost { border-color: #06b6d4; }
        .passport-container .s4 .s-stamp-ghost { border-color: #f8fafc; }
        .passport-container .s5 .s-stamp-ghost { border-color: #1d4ed8; }
        .passport-container .s6 .s-stamp-ghost { border-color: #10b981; }
        .passport-container .s7 .s-stamp-ghost { border-color: #f43f5e; }

        .passport-container .s-stamp-num {
          font-family: 'Montserrat', sans-serif;
          font-size: 36px;
          font-weight: 900;
        }

        .passport-container .s1 .s-stamp-num { color: #d946ef; }
        .passport-container .s2 .s-stamp-num { color: #f59e0b; }
        .passport-container .s3 .s-stamp-num { color: #06b6d4; }
        .passport-container .s4 .s-stamp-num { color: #f8fafc; }
        .passport-container .s5 .s-stamp-num { color: #facc15; }
        .passport-container .s6 .s-stamp-num { color: #10b981; }
        .passport-container .s7 .s-stamp-num { color: #f43f5e; }

        .passport-container .s-card-info {
          width: 100%;
          padding: 0 0.15rem;
        }

        .passport-container .sname {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 900;
          font-style: italic;
          color: #fff;
          margin-bottom: 0.08rem;
          line-height: 1.15;
        }

        .passport-container .s-card.pending .sname {
          color: #64748b;
        }

        .passport-container .sev {
          font-size: 7px;
          color: var(--dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.3;
        }

        .passport-container .sdate {
          font-size: 7px;
          color: var(--muted);
          margin-top: 0.1rem;
          line-height: 1.3;
        }

        .passport-container .s-card .badge-p {
          margin-top: 0.12rem;
          font-size: 6.5px;
          padding: 1px 5px;
        }

        .sello-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(0, 8, 20, 0.96);
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: stretch;
          padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
          animation: fadeIn 0.2s ease;
          font-family: 'JetBrains Mono', monospace;
          box-sizing: border-box;
        }

        .sello-lightbox-close {
          position: absolute;
          top: max(1rem, env(safe-area-inset-top, 1rem));
          right: max(1rem, env(safe-area-inset-right, 1rem));
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          z-index: 2;
        }

        .sello-lightbox-close:hover {
          background: rgba(254, 152, 0, 0.2);
          border-color: #fe9800;
        }

        .sello-lightbox-body {
          flex: 1;
          width: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 1rem 0.5rem;
          box-sizing: border-box;
        }

        .sello-lightbox-stamp {
          flex: 1;
          width: 100%;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sello-lightbox-img {
          width: min(92vw, calc(100dvh - 11rem), 92vmin);
          height: min(92vw, calc(100dvh - 11rem), 92vmin);
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        .sello-lightbox-ghost {
          width: min(72vw, calc(100dvh - 14rem), 72vmin);
          height: min(72vw, calc(100dvh - 14rem), 72vmin);
          border-radius: 50%;
          border: 3px dashed;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.45;
        }

        .sello-lightbox-num {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(72px, 22vmin, 160px);
          font-weight: 900;
        }

        .sello-lightbox-info {
          flex-shrink: 0;
          text-align: center;
          width: 100%;
          max-width: min(92vw, 520px);
          padding: 0.75rem 1rem 1.25rem;
          box-sizing: border-box;
        }

        .sello-lightbox-name {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(17px, 4.5vw, 28px);
          font-weight: 900;
          font-style: italic;
          color: #fff;
          margin-bottom: 0.35rem;
          line-height: 1.15;
        }

        .sello-lightbox-desc {
          font-size: clamp(10px, 2.5vw, 13px);
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          line-height: 1.5;
        }

        .sello-lightbox-date {
          font-size: clamp(10px, 2.5vw, 13px);
          color: #334155;
          margin-top: 0.35rem;
          line-height: 1.5;
        }

        .sello-lightbox-badge {
          display: inline-block;
          margin-top: 0.65rem;
          font-size: clamp(9px, 2.2vw, 11px);
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: 700;
          letter-spacing: 0.06em;
        }

        .sello-lightbox-hint {
          flex-shrink: 0;
          padding-bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
          font-size: 9px;
          color: #64748b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sello-lightbox-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.75rem;
        }

        .sello-lightbox-action-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.06);
          color: #94a3b8;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .sello-lightbox-action-btn:hover {
          border-color: #fe9800;
          color: #fe9800;
        }

        .sello-lightbox-action-btn.danger:hover {
          border-color: #f43f5e;
          color: #f43f5e;
        }

        .sello-lightbox-qr-note {
          font-size: 9px;
          color: #64748b;
          margin-top: 0.5rem;
          line-height: 1.5;
          letter-spacing: 0.04em;
        }

        @media (min-width: 768px) {
          .sello-lightbox-img {
            width: min(78vmin, calc(100dvh - 10rem), 900px);
            height: min(78vmin, calc(100dvh - 10rem), 900px);
          }

          .sello-lightbox-ghost {
            width: min(60vmin, calc(100dvh - 12rem), 680px);
            height: min(60vmin, calc(100dvh - 12rem), 680px);
          }

          .sello-lightbox-body {
            padding: 4rem 2rem 1rem;
          }
        }

        @media (min-width: 1200px) {
          .sello-lightbox-img {
            width: min(72vmin, calc(100dvh - 9rem), 1100px);
            height: min(72vmin, calc(100dvh - 9rem), 1100px);
          }
        }

        @media (orientation: landscape) and (max-height: 500px) {
          .sello-lightbox-body {
            flex-direction: row;
            gap: 1.5rem;
            padding: 2.5rem 2rem 0.5rem;
            align-items: center;
          }

          .sello-lightbox-stamp {
            flex: 1.2;
          }

          .sello-lightbox-info {
            flex: 0.8;
            text-align: left;
            padding: 0;
            max-width: 40vw;
          }

          .sello-lightbox-img {
            width: min(85dvh, 85vw, 600px);
            height: min(85dvh, 85vw, 600px);
          }
        }

        .passport-container .badge-p {
          font-size: 7px; padding: 2px 6px; border-radius: 3px; background: var(--border3); color: var(--muted); border: 0.5px solid var(--border); font-weight: 700; display: inline-block; margin-top: .18rem; letter-spacing: .05em;
        }

        .passport-container .badge-earned {
          background: #10b981; color: #fff; border-color: #10b981;
        }

        .passport-container .badge-qr {
          background: #1d4ed8; color: #fff; border-color: #1d4ed8;
        }

        .passport-container .prog {
          padding: .6rem 1.1rem .85rem; border-top: 0.5px solid var(--border); background: var(--navy); flex-shrink: 0;
        }

        .passport-container .prog-lbl {
          font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); margin-bottom: .4rem;
        }

        .passport-container .prog-bar {
          height: 5px; background: var(--border3); border-radius: 3px; overflow: hidden; display: flex; gap: 2px; margin-bottom: .3rem;
        }

        .passport-container .prog-txt {
          display: flex; justify-content: space-between; font-size: 9px; color: var(--dim);
        }

        .passport-container .prog-txt strong {
          color: var(--orange);
        }

        .passport-container .qrc {
          margin: .7rem 1.1rem;
          background: var(--border3); border: 0.5px solid #06b6d4; border-radius: 10px;
          padding: .75rem; display: flex; align-items: center; gap: .8rem;
          flex-shrink: 0;
        }

        .passport-container .qrb {
          width: 62px; height: 62px; flex-shrink: 0; background: #e2e8f0; border-radius: 5px; display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; padding: 5px;
        }

        .passport-container .qb {
          background: #000; border-radius: 1px;
        }

        .passport-container .qw {
          background: transparent;
        }

        .passport-container .qrl {
          font-size: 8px; letter-spacing: .1; text-transform: uppercase; color: #06b6d4; margin-bottom: .18rem;
        }

        .passport-container .qrn {
          font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 900; color: #fff; margin-bottom: .08rem;
        }

        .passport-container .qrf {
          font-size: 9px; color: var(--dim);
        }

        .passport-container .qrs {
          font-size: 8px; color: #06b6d4; margin-top: .28rem; letter-spacing: .05em;
        }

        .passport-container .sec-div {
          padding: .6rem 1.1rem; font-size: 9px; color: var(--orange); letter-spacing: .14em; text-transform: uppercase;
          border-bottom: 0.5px solid var(--border); display: flex; align-items: center; gap: 7px;
          background: var(--navy2); flex-shrink: 0;
        }

        .passport-container .sec-div::before {
          content: ''; width: 3px; height: 12px; background: var(--orange); flex-shrink: 0;
        }

        .passport-container .nsec {
          padding: .6rem 1.1rem .5rem; display: flex; flex-direction: column; gap: .4rem; flex: 1; background: var(--navy); overflow-y: auto;
        }

        .passport-container .nf {
          background: var(--border3); border-radius: 7px; padding: .55rem .7rem; border: 0.5px solid var(--border);
        }

        .passport-container .nfl {
          font-size: 8px; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); margin-bottom: .25rem;
        }

        .passport-container .nfv {
          font-size: 11px; color: #94a3b8; line-height: 1.55;
        }

        .passport-container .nfe {
          font-size: 11px; color: var(--muted); font-style: italic;
        }

        .passport-container .cr {
          display: flex; flex-wrap: wrap; gap: 4px; margin-top: .2rem;
        }

        .passport-container .btn-edit {
          display: block; margin: .5rem 1.1rem 1.1rem;
          background: transparent; border: 1px solid var(--orange); color: var(--orange);
          border-radius: 8px; padding: .65rem;
          font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 700;
          text-align: center; cursor: pointer; letter-spacing: .04em;
          transition: .15s; flex-shrink: 0;
        }

        .passport-container .btn-edit:hover {
          background: var(--orange); color: #000f20;
        }

        .passport-container .dots {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 6px; z-index: 100;
        }

        .passport-container .dot {
          width: 5px; height: 5px; border-radius: 50%; background: var(--border); cursor: pointer; transition: .2s;
        }

        .passport-container .dot.active {
          background: var(--orange); height: 14px; border-radius: 3px;
        }

        .passport-container .p-modal-backdrop {
          position: absolute;
          inset: 0;
          z-index: 250;
        }

        .passport-container .p-modal {
          position: absolute; inset: 0;
          background: rgba(0,9,20,.97); z-index: 200;
          overflow-y: auto; padding: 1.25rem 1.25rem 3rem;
          max-width: 390px; margin: 0 auto;
        }

        .passport-container .p-modal-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 0.5px solid var(--border); padding-bottom: .75rem;
        }

        .passport-container .p-modal-title {
          font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 900; font-style: italic; color: #fff;
        }

        .passport-container .p-modal-title span {
          color: var(--orange);
        }

        .passport-container .p-modal-close {
          background: none; border: none; color: var(--dim); font-size: 20px; cursor: pointer; line-height: 1; outline: none;
        }

        .passport-container .f-group {
          margin-bottom: .75rem;
        }

        .passport-container .f-label {
          font-size: 8px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); display: block; margin-bottom: .3rem;
        }

        .passport-container .f-input {
          width: 100%; background: #040d1a; border: 0.5px solid var(--border);
          border-radius: 6px; padding: .55rem .75rem;
          color: var(--text); font-family: 'JetBrains Mono', monospace; font-size: 12px;
          outline: none; transition: .2s;
        }

        .passport-container .f-input:focus {
          border-color: var(--orange);
        }

        .passport-container .f-input::placeholder {
          color: var(--muted);
        }

        .passport-container select.f-input option {
          background: #040d1a;
        }

        .passport-container textarea.f-input {
          resize: vertical; min-height: 72px; line-height: 1.6;
        }

        .passport-container .two {
          display: grid; grid-template-columns: 1fr 1fr; gap: .65rem;
        }

        .passport-container .m-chip {
          font-size: 10px; padding: 4px 10px; border-radius: 20px; cursor: pointer;
          border: 0.5px solid var(--border); color: var(--dim); transition: .15s;
        }

        .passport-container .m-chip:hover {
          border-color: var(--orange); color: var(--orange);
        }

        .passport-container .m-chip.active {
          background: var(--orange); border-color: var(--orange); color: #000f20; font-weight: 700;
        }

        .passport-container .chips-wrap {
          display: flex; flex-wrap: wrap; gap: 6px; margin-top: .3rem;
        }

        .passport-container .p-modal-sec {
          font-size: 9px; color: var(--orange); letter-spacing: .14em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; margin: .75rem 0 .5rem; padding-bottom: .4rem; border-bottom: 0.5px solid var(--border);
        }

        .passport-container .p-modal-sec::before {
          content: ''; width: 3px; height: 11px; background: var(--orange);
        }

        .passport-container .btn-save {
          width: 100%; background: var(--orange); color: #000f20; border: none; border-radius: 8px;
          padding: .85rem; font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 900;
          letter-spacing: .05em; cursor: pointer; margin-top: 1.5rem; transition: .15s;
        }

        .passport-container .btn-save:hover {
          background: var(--orange2);
        }

        .passport-container .topbar button {
          display: flex;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          color: var(--dim);
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          letter-spacing: .14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.15s;
        }
        .passport-container .topbar button:hover {
          color: #fff;
        }

        /* Toast Popup */
        .toast-popup {
          position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
          z-index: 300; background: #10b981; border: 1.5px solid #10b981; text-align: center;
          color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: bold;
          padding: 8px 16px; border-radius: 6px; width: calc(100% - 40px); max-width: 350px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3); pointer-events: none;
        }

        /* ─── RESPONSIVE PC STYLES ─── */
        @media (min-width: 1024px) {
          .passport-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1.5rem 5rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #08121e;
            box-shadow: none;
          }

          .passport-container .desktop-header {
            display: block;
            text-align: center;
            margin-bottom: 2.5rem;
          }

          .passport-container .dh-sup {
            color: var(--orange);
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: .2em;
          }

          .passport-container .dh-title {
            font-family: 'Montserrat', sans-serif;
            font-size: 32px;
            font-weight: 900;
            font-style: italic;
            color: #fff;
            margin-top: 0.25rem;
            text-transform: uppercase;
            letter-spacing: -1px;
          }

          .passport-container .dh-desc {
            color: var(--dim);
            font-size: 12px;
            margin-top: 0.5rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }

          .passport-container .pages {
            height: auto;
            overflow-y: visible;
            scroll-snap-type: none;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
            width: 100%;
            max-width: 1150px;
          }

          .passport-container .page {
            scroll-snap-align: none;
            min-height: 700px;
            height: 700px;
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }

          .passport-container .dots {
            display: none;
          }

          .passport-container .p-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            z-index: 250;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .passport-container .p-modal {
            position: relative;
            inset: auto;
            width: 480px;
            height: 90vh;
            max-height: 720px;
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.9);
            margin: 0;
          }
        }
      `}} />

      {/* DESKTOP HEADER */}
      <div className="desktop-header">
        <span className="dh-sup">COMEV 2026 • Convención Nacional</span>
        <h2 className="dh-title">MI PASAPORTE <span className="text-secondary-orange">DIGITAL</span></h2>
        <p className="dh-desc">Accede a tus datos de networking, código QR de ingreso y sellos de asistencia.</p>
      </div>

      {/* PAGE DOTS INDICATOR */}
      {!isEditing && (
        <div className="dots">
          <div className={`dot ${activePage === 0 ? 'active' : ''}`} onClick={() => goPage(0)}></div>
          <div className={`dot ${activePage === 1 ? 'active' : ''}`} onClick={() => goPage(1)}></div>
          <div className={`dot ${activePage === 2 ? 'active' : ''}`} onClick={() => goPage(2)}></div>
        </div>
      )}

      {/* SCROLLABLE VERTICAL SNAPPING PAGES */}
      <div className="pages" id="pages-container">
        
        {/* ─── PÁGINA 1 — EL PASAPORTE ─── */}
        <div className="page" id="page-0" style={{ background: 'var(--navy)' }}>
          <div className="inner">
            <div className="topbar">
              <button onClick={() => { window.location.hash = ''; }}>
                <ArrowLeft className="w-3 h-3" /> VOLVER
              </button>
              <span className="tr">EVM</span>
            </div>
            
            <div className="brand">
              <div>
                <div className="brand-sup">Convención Nacional · Sep 3–5 · Chihuahua</div>
                <div className="brand-line1">Pasaporte</div>
                <div className="brand-line2">¡VIVA CHIHUAHUA!</div>
              </div>
              <div className="seal">
                <div className="seal-s">COMEV</div>
                <div className="seal-n">26</div>
                <div className="seal-s">MX</div>
              </div>
            </div>

            <div className="hero">
              <div className="photo-col" onClick={() => fileInputRef.current?.click()}>
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt="foto del participante" style={{ display: 'block' }} />
                ) : (
                  <div className="photo-placeholder">
                    <span className="photo-icon">📷</span>
                    <span className="photo-lbl">Tap para<br/>agregar<br/>foto</span>
                  </div>
                )}
              </div>
              
              <div className="name-col">
                <div>
                  <div className="pname">{formatName(data.nombre)}</div>
                  <div className="pcargo">{data.cargo || 'Cargo'}</div>
                  <div className="pempresa">{data.empresa || 'Empresa'}</div>
                  <div className="meta">
                    <div className="meta-row">
                      <span className="ml">Delegación</span>
                      <span className="mv">{data.delegacion || '—'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="ml">Industria</span>
                      <span className="mv">{data.industria || '—'}</span>
                    </div>
                    <div className="meta-row">
                      <span className="ml">Empresa</span>
                      <span className="mv">{data.tamano ? `${data.tamano} personas` : '—'}</span>
                    </div>
                  </div>
                </div>
                <div className="badges">
                  <span className="badge b-ind">{data.modalidad || '—'}</span>
                  <span className="badge b-del">{data.delegacion ? data.delegacion.toUpperCase() : 'EVM'}</span>
                </div>
              </div>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />

            <div className="viva">
              <span className="viva-t">¡VIVA CHIHUAHUA!</span>
              <span className="viva-s">★ ★ ★</span>
            </div>

            <div className="reto">
              <div className="reto-lbl">Mi reto de negocio</div>
              <div className="reto-txt">
                {data.reto ? (
                  <>"{data.reto}"</>
                ) : (
                  <em style={{ color: '#1e3a5f' }}>Completa tu perfil para mostrar tu reto de negocio...</em>
                )}
              </div>
            </div>

            <div className="busco">
              <div className="busco-col">
                <div className="busco-lbl">Busco en COMEV</div>
                <div className="chips">
                  {data.busco.length > 0 ? (
                    data.busco.map(v => (
                      <span key={v} className="co">{v}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '10px', color: '#1e3a5f' }}>—</span>
                  )}
                </div>
              </div>
              <div className="busco-col">
                <div className="busco-lbl">Puedo ofrecer</div>
                <div className="chips">
                  {data.ofrezco.length > 0 ? (
                    data.ofrezco.map(v => (
                      <span key={v} className="cc">{v}</span>
                    ))
                  ) : (
                    <span style={{ fontSize: '10px', color: '#1e3a5f' }}>—</span>
                  )}
                </div>
              </div>
            </div>

            <div className="sellos-strip">
              <div className="s-lbl">
                Sellos del congreso <span>{earnedCount} / 7</span>
              </div>
              <div className="s-row">
                {SELLOS_INFO.map(s => {
                  const earned = data.sellos.includes(s.id);
                  return (
                    <div 
                      key={s.id} 
                      className={`sd sd${s.id} ${earned ? 'earned' : ''}`}
                      onClick={() => openSelloView(s.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {earned ? (
                        <img src={`/assets/sello_${s.id}.svg`} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <div className="sdn">{s.id}</div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pm">
                {SELLOS_INFO.map(s => {
                  const earned = data.sellos.includes(s.id);
                  return (
                    <div 
                      key={s.id} 
                      className={`pm-s ${earned ? `pm${s.id}` : ''}`} 
                      style={{ background: earned ? s.color : '' }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="folio">
              <div>
                <div className="folio-ll">Número de folio</div>
                <div className="folio-n">{data.folio || 'CMV-000000'}</div>
              </div>
              <div className="folio-r">
                <strong>Sep 3–5 · 2026</strong>
                Hotel María Bonita<br/>Chihuahua, México
              </div>
            </div>
            
            <div className="bottom-line"></div>
          </div>
        </div>

        {/* ─── PÁGINA 2 — TUS SELLOS ─── */}
        <div className="page" id="page-1" style={{ background: 'var(--navy)' }}>
          <div className="inner">
            <div className="topbar">
              <button onClick={() => { window.location.hash = ''; }}>
                <ArrowLeft className="w-3 h-3" /> VOLVER
              </button>
              <span className="tr" style={{ color: 'var(--orange)' }}>{earnedCount} / 7</span>
            </div>
            
            <div className="brand" style={{ padding: '.7rem 1.1rem' }}>
              <div>
                <div className="brand-sup">Tus momentos · COMEV 2026</div>
                <div className="brand-line1">Pasaporte</div>
                <div className="brand-line2">TUS SELLOS</div>
              </div>
            </div>

            <p className="slist-hint">Toca un sello para verlo · Mantén presionado para agregar o quitar manualmente</p>

            <div className="slist">
              {SELLOS_INFO.map(s => {
                const earned = data.sellos.includes(s.id);
                const qrLocked = isSelloQrLocked(data, s.id);
                return (
                  <div
                    key={s.id}
                    className={`s-card s${s.id} ${earned ? 'earned' : 'pending'} ${qrLocked ? 'qr-locked' : ''}`}
                    onClick={() => handleSelloCardClick(s.id)}
                    onTouchStart={() => startLongPress(s.id)}
                    onTouchEnd={cancelLongPress}
                    onTouchMove={cancelLongPress}
                    onMouseDown={() => startLongPress(s.id)}
                    onMouseUp={cancelLongPress}
                    onMouseLeave={cancelLongPress}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <div className="s-stamp">
                      {earned ? (
                        <img
                          src={`/assets/sello_${s.id}.svg`}
                          alt={s.name}
                          className="s-stamp-img"
                        />
                      ) : (
                        <div className="s-stamp-ghost">
                          <span className="s-stamp-num">{s.id}</span>
                        </div>
                      )}
                    </div>
                    <div className="s-card-info">
                      <div className="sname">{s.name}</div>
                      <div className="sev">{s.desc}</div>
                      <div className="sdate">{s.date}</div>
                      <span className={`badge-p ${earned ? (qrLocked ? 'badge-qr' : 'badge-earned') : ''}`}>
                        {earned ? (qrLocked ? '✓ QR' : '✓ OBTENIDO') : 'PENDIENTE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="prog">
              <div className="prog-lbl">Progreso del Pasaporte</div>
              <div className="prog-bar">
                {SELLOS_INFO.map(s => {
                  const earned = data.sellos.includes(s.id);
                  return (
                    <div 
                      key={s.id}
                      className={`pm-s ${earned ? `pm${s.id}` : ''}`}
                      style={{ background: earned ? s.color : '' }}
                    />
                  );
                })}
              </div>
              <div className="prog-txt">
                <span>{earnedCount} / 7 sellos completados</span>
                <strong>{progressPercent}%</strong>
              </div>
            </div>
            
            <div className="bottom-line"></div>
          </div>
        </div>

        {/* ─── PÁGINA 3 — COMEV CONNECT ─── */}
        <div className="page" id="page-2" style={{ background: 'var(--navy)' }}>
          <div className="inner">
            <div className="topbar">
              <button onClick={() => { window.location.hash = ''; }}>
                <ArrowLeft className="w-3 h-3" /> VOLVER
              </button>
              <span className="tr" style={{ color: '#06b6d4' }}>Networking Pass</span>
            </div>

            <div className="brand" style={{ padding: '.7rem 1.1rem' }}>
              <div>
                <div className="brand-sup">Tu pase de networking digital</div>
                <div className="brand-line1">Pasaporte</div>
                <div className="brand-line2 cyan">COMEV CONNECT</div>
              </div>
            </div>

            <div className="qrc">
              <div className="qrb">
                <div className="qb"></div><div className="qb"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qb"></div><div className="qb"></div>
                <div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div>
                <div className="qb"></div><div className="qb"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qb"></div><div className="qb"></div>
                <div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div>
                <div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qb"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div>
                <div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div>
                <div className="qb"></div><div className="qb"></div><div className="qb"></div><div className="qw"></div><div className="qb"></div><div className="qb"></div><div className="qb"></div>
              </div>
              <div>
                <div className="qrl">Networking Pass</div>
                <div className="qrn">{data.nombre || 'Tu nombre'}</div>
                <div className="qrf">{data.folio || 'CMV-000000'}</div>
                <div className="qrs">↗ Escanea para conectar</div>
              </div>
            </div>

            <div className="sec-div">Mi perfil de networking</div>
            
            <div className="nsec">
              <div className="nf">
                <div className="nfl">Mi empresa hace...</div>
                <div className="nfv">
                  {data.descripcion ? data.descripcion : <span className="nfe">Completa tu perfil...</span>}
                </div>
              </div>
              <div className="nf">
                <div className="nfl">Busco en COMEV</div>
                <div className="cr">
                  {data.busco.length > 0 ? (
                    data.busco.map(v => (
                      <span key={v} className="co">{v}</span>
                    ))
                  ) : (
                    <span className="nfe">—</span>
                  )}
                </div>
              </div>
              <div className="nf">
                <div className="nfl">Puedo ofrecer</div>
                <div className="cr">
                  {data.ofrezco.length > 0 ? (
                    data.ofrezco.map(v => (
                      <span key={v} className="cc">{v}</span>
                    ))
                  ) : (
                    <span className="nfe">—</span>
                  )}
                </div>
              </div>
              <div className="nf">
                <div className="nfl">Mi reto de negocio</div>
                <div className="nfv" style={{ fontStyle: data.reto ? 'normal' : 'italic', color: data.reto ? '#e2e8f0' : '#64748b' }}>
                  {data.reto ? `"${data.reto}"` : 'Sin definir...'}
                </div>
              </div>
              <div className="nf">
                <div className="nfl">Al terminar COMEV quiero haber logrado...</div>
                <div className="nfv">
                  {data.objetivo ? data.objetivo : <span className="nfe">Sin definir...</span>}
                </div>
              </div>
            </div>

            <button className="btn-edit" onClick={openModal}>✏ Editar mi perfil</button>
            <div className="bottom-line"></div>
          </div>
        </div>

      </div>

      {/* ─── MODAL — EDITAR PERFIL ─── */}
      {isEditing && (
        <div className="p-modal-backdrop">
          <div className="p-modal open">
            <div className="p-modal-header">
              <div className="p-modal-title">Editar <span>Perfil</span></div>
              <button className="p-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="p-modal-sec">Datos personales</div>
            
            <div className="f-group">
              <label className="f-label">Nombre completo</label>
              <input 
                type="text" 
                className="f-input" 
                id="nombre" 
                value={data.nombre} 
                onChange={handleChange} 
                placeholder="Tu nombre completo"
              />
            </div>
            
            <div className="two">
              <div className="f-group">
                <label className="f-label">Cargo</label>
                <input 
                  type="text" 
                  className="f-input" 
                  id="cargo" 
                  value={data.cargo} 
                  onChange={handleChange} 
                  placeholder="Director..."
                />
              </div>
              <div className="f-group">
                <label className="f-label">Modalidad</label>
                <select 
                  className="f-input" 
                  id="modalidad" 
                  value={data.modalidad} 
                  onChange={handleChange}
                >
                  <option value="">—</option>
                  <option value="individual">Individual</option>
                  <option value="pareja">Pareja</option>
                </select>
              </div>
            </div>
            
            <div className="f-group">
              <label className="f-label">Empresa</label>
              <input 
                type="text" 
                className="f-input" 
                id="empresa" 
                value={data.empresa} 
                onChange={handleChange} 
                placeholder="Nombre de tu empresa"
              />
            </div>
            
            <div className="two">
              <div className="f-group">
                <label className="f-label">Delegación EVM</label>
                <input 
                  type="text" 
                  className="f-input" 
                  id="delegacion" 
                  value={data.delegacion} 
                  onChange={handleChange} 
                  placeholder="Chihuahua..."
                />
              </div>
              <div className="f-group">
                <label className="f-label">WhatsApp</label>
                <input 
                  type="tel" 
                  className="f-input" 
                  id="whatsapp" 
                  value={data.whatsapp} 
                  onChange={handleChange} 
                  placeholder="+52 614..."
                />
              </div>
            </div>
            
            <div className="two">
              <div className="f-group">
                <label className="f-label">Email</label>
                <input 
                  type="email" 
                  className="f-input" 
                  id="email" 
                  value={data.email} 
                  onChange={handleChange} 
                  placeholder="correo@empresa.com"
                />
              </div>
              <div className="f-group">
                <label className="f-label">LinkedIn</label>
                <input 
                  type="text" 
                  className="f-input" 
                  id="linkedin" 
                  value={data.linkedin} 
                  onChange={handleChange} 
                  placeholder="linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="p-modal-sec">Perfil de negocio</div>
            
            <div className="f-group">
              <label className="f-label">¿A qué se dedica tu empresa?</label>
              <textarea 
                className="f-input" 
                id="descripcion" 
                value={data.descripcion} 
                onChange={handleChange} 
                placeholder="Describe brevemente..."
              />
            </div>
            
            <div className="two">
              <div className="f-group">
                <label className="f-label">Industria</label>
                <select 
                  className="f-input" 
                  id="industria" 
                  value={data.industria} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {INDUSTRIAS.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="f-group">
                <label className="f-label">Tamaño</label>
                <select 
                  className="f-input" 
                  id="tamano" 
                  value={data.tamano} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar</option>
                  {TAMANOS.map(t => (
                    <option key={t.val} value={t.val}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-modal-sec">COMEV Connect — Networking</div>
            
            <div className="f-group">
              <label className="f-label">¿Qué buscas en COMEV?</label>
              <div className="chips-wrap" id="m-busco">
                {BUSQUEDAS.map(b => {
                  const active = data.busco.includes(b.val);
                  return (
                    <div 
                      key={b.val} 
                      className={`m-chip ${active ? 'active' : ''}`}
                      onClick={() => handleToggleChip('busco', b.val)}
                    >
                      {b.label}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="f-group">
              <label className="f-label">¿Qué puedes ofrecer?</label>
              <div className="chips-wrap" id="m-ofrezco">
                {OFRECIMIENTOS.map(o => {
                  const active = data.ofrezco.includes(o.val);
                  return (
                    <div 
                      key={o.val} 
                      className={`m-chip ${active ? 'active' : ''}`}
                      onClick={() => handleToggleChip('ofrezco', o.val)}
                    >
                      {o.label}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="f-group">
              <label className="f-label">Tu mayor reto de negocio hoy</label>
              <textarea 
                className="f-input" 
                id="reto" 
                value={data.reto} 
                onChange={handleChange} 
                style={{ minHeight: '80px' }} 
                placeholder="Sé específico — este campo conecta con las personas correctas..."
              />
            </div>
            
            <div className="f-group">
              <label className="f-label">Al terminar COMEV quiero haber logrado...</label>
              <textarea 
                className="f-input" 
                id="objetivo" 
                value={data.objetivo} 
                onChange={handleChange} 
                style={{ minHeight: '64px' }} 
                placeholder="Tu resultado esperado..."
              />
            </div>

            <button className="btn-save" onClick={handleSave}>★ Guardar Pasaporte ★</button>
          </div>
        </div>
      )}

      {/* TOAST ALERT POPUP */}
      {toastMessage && (
        <div className="toast-popup">
          {toastMessage}
        </div>
      )}

      {/* SELLO LIGHTBOX — portal a body = pantalla completa real (móvil + PC) */}
      {expandedSello !== null && typeof document !== 'undefined' && createPortal((() => {
        const s = SELLOS_INFO.find(x => x.id === expandedSello)!;
        const earned = data.sellos.includes(s.id);
        const qrLocked = isSelloQrLocked(data, s.id);
        return (
          <div
            className="sello-lightbox"
            onClick={() => setExpandedSello(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Sello: ${s.name}`}
          >
            <button
              type="button"
              className="sello-lightbox-close"
              onClick={(e) => { e.stopPropagation(); setExpandedSello(null); }}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="sello-lightbox-body" onClick={(e) => e.stopPropagation()}>
              <div className={`sello-lightbox-stamp s${s.id} ${earned ? 'earned' : 'pending'}`}>
                {earned ? (
                  <img
                    src={`/assets/sello_${s.id}.svg`}
                    alt={s.name}
                    className={`sello-lightbox-img s${s.id}`}
                    style={{ filter: `drop-shadow(0 0 28px ${s.color}88) drop-shadow(0 8px 24px rgba(0,0,0,0.6))` }}
                  />
                ) : (
                  <div className="sello-lightbox-ghost" style={{ borderColor: s.color }}>
                    <span className="sello-lightbox-num" style={{ color: s.color }}>{s.id}</span>
                  </div>
                )}
              </div>

              <div className="sello-lightbox-info">
                <div className="sello-lightbox-name">{s.name}</div>
                <div className="sello-lightbox-desc">{s.desc}</div>
                <div className="sello-lightbox-date">{s.date}</div>
                <span
                  className="sello-lightbox-badge"
                  style={{
                    background: earned ? (qrLocked ? '#1d4ed8' : '#10b981') : 'rgba(255,255,255,0.08)',
                    color: earned ? '#fff' : '#64748b',
                    border: earned ? 'none' : '1px solid #172b41',
                  }}
                >
                  {earned ? (qrLocked ? '✓ VERIFICADO POR QR' : '✓ OBTENIDO') : 'PENDIENTE'}
                </span>

                <div className="sello-lightbox-actions">
                  {!earned && (
                    <button
                      type="button"
                      className="sello-lightbox-action-btn"
                      onClick={() => handleToggleSello(s.id)}
                    >
                      + Agregar manualmente
                    </button>
                  )}
                  {earned && !qrLocked && (
                    <button
                      type="button"
                      className="sello-lightbox-action-btn danger"
                      onClick={() => { handleToggleSello(s.id); setExpandedSello(null); }}
                    >
                      Quitar sello
                    </button>
                  )}
                </div>

                {earned && qrLocked && (
                  <p className="sello-lightbox-qr-note">Este sello fue registrado al escanear el QR del evento y no puede eliminarse.</p>
                )}
                {!earned && (
                  <p className="sello-lightbox-qr-note">Escanea el código QR en la estación del evento para obtener este sello de forma permanente.</p>
                )}
              </div>
            </div>

            <p className="sello-lightbox-hint">Toca fuera para cerrar</p>
          </div>
        );
      })(), document.body)}

    </div>
  );
}
