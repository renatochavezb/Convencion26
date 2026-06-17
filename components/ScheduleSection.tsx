import React, { useState } from 'react';
import { SCHEDULE_EVENTS, SPEAKERS } from '../data';
import { ScheduleEvent } from '../types';
import { Clock, MapPin, Grid, Layers, CalendarCheck, BookOpen, UserCheck, Star } from 'lucide-react';
import retro70sBgRaw from '../assets/retro-70s-bg.png';
import inauguracionBgRaw from '../assets/inauguracion_bg.png';
import conferenciaBgRaw from '../assets/conferencia_bg.png';
import fotoBgRaw from '../assets/foto_bg.png';
import comidaBgRaw from '../assets/comida_bg.png';
import juntaBgRaw from '../assets/junta_bg.png';
import damasBgRaw from '../assets/damas_bg.png';
import galaBgRaw from '../assets/gala_bg.png';
import paseoBgRaw from '../assets/paseo_bg.png';
import cumbreVentasLogoRaw from '../assets/cumbre-ventas-logo.jpg';

const retro70sBg = (retro70sBgRaw as any).src;
const inauguracionBg = (inauguracionBgRaw as any).src;
const conferenciaBg = (conferenciaBgRaw as any).src;
const fotoBg = (fotoBgRaw as any).src;
const comidaBg = (comidaBgRaw as any).src;
const juntaBg = (juntaBgRaw as any).src;
const damasBg = (damasBgRaw as any).src;
const galaBg = (galaBgRaw as any).src;
const paseoBg = (paseoBgRaw as any).src;
const cumbreVentasLogo = (cumbreVentasLogoRaw as any).src;


function parseEventTime(timeStr: string, day: number) {
  const parts = timeStr.split(' - ');
  if (parts.length !== 2) return null;

  function to24h(timePart: string) {
    const match = timePart.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return null;
    let hrs = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hrs < 12) hrs += 12;
    if (ampm === 'AM' && hrs === 12) hrs = 0;

    return { hrs, mins };
  }

  const start = to24h(parts[0]);
  const end = to24h(parts[1]);
  if (!start || !end) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  let startDay = day;
  let endDay = day;

  if (end.hrs < start.hrs || (end.hrs === start.hrs && end.mins < start.mins)) {
    endDay = day + 1;
  }

  const startDateStr = `202609${pad(startDay)}T${pad(start.hrs)}${pad(start.mins)}00`;
  const endDateStr = `202609${pad(endDay)}T${pad(end.hrs)}${pad(end.mins)}00`;

  return `${startDateStr}/${endDateStr}`;
}

function getGoogleCalendarUrl(event: ScheduleEvent) {
  const dates = parseEventTime(event.time, event.day);
  if (!dates) return '#';
  
  const baseUrl = 'https://calendar.google.com/calendar/render';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `COMEV 2026: ${event.title}`,
    dates: dates,
    details: event.description + (event.speakerName ? `\nPonente: ${event.speakerName}` : ''),
    location: event.location,
    ctz: 'America/Chihuahua'
  });
  
  return `${baseUrl}?${params.toString()}`;
}

function getEventWatermark(eventId: string, title: string) {
  const titleLower = title.toLowerCase();
  
  // 0. Cumbre de Ventas (Conferencias especiales)
  if (eventId === 'd4-new-speaker' || eventId === 'd4-2') {
    return (
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-10 hover:opacity-20 transition-opacity duration-300">
        <img 
          src={cumbreVentasLogo} 
          alt="Cumbre de Ventas Watermark" 
          className="w-32 h-auto object-contain" 
        />
      </div>
    );
  }

  // 1. Ceremonia de Inauguración
  if (titleLower.includes('inauguraci')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ribbonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe600" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#fe9800" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#fe9800" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <linearGradient id="scissorsGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Glow behind */}
          <circle cx="20" cy="24" r="16" fill="url(#ribbonGlow)" className="animate-pulse" />
          {/* Satin Ribbon */}
          <path d="M0 22c10-2 30-2 40 0v4c-10-2-30-2-40 0v-4z" fill="url(#ribbonGrad)" opacity="0.8" />
          {/* Scissors handles */}
          <circle cx="15" cy="30" r="3" stroke="url(#scissorsGold)" strokeWidth="1.5" />
          <circle cx="25" cy="30" r="3" stroke="url(#scissorsGold)" strokeWidth="1.5" />
          {/* Scissors blades */}
          <path d="M16.5 28L20 22l1 1-2.5 5 M23.5 28L20 22l-1 1 2.5 5" stroke="url(#scissorsGold)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Cut effect sparkles */}
          <path d="M20 20l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" />
          <path d="M10 12l1.5 1.5 1.5-1.5-1.5-1.5z M30 34l1 1 1-1-1-1z" fill="#ffffff" className="animate-pulse" />
        </svg>
      </div>
    );
  }
  
  // 2. Conferencia (Nestor Guerra / AI / Keynote / Ponente por confirmar)
  if (titleLower.includes('nestor') || titleLower.includes('cumbre') || titleLower.includes('conferencia') || titleLower.includes('ponente')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="chipGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc080" />
              <stop offset="50%" stopColor="#fe9800" />
              <stop offset="100%" stopColor="#ffc080" />
            </linearGradient>
          </defs>
          {/* Glow behind */}
          <circle cx="20" cy="24" r="18" fill="url(#aiGlow)" className="animate-pulse" />
          {/* CPU Outline */}
          <rect x="10" y="14" width="20" height="20" rx="3" stroke="url(#chipGold)" strokeWidth="1.5" fill="#041221" />
          <rect x="14" y="18" width="12" height="12" rx="1" stroke="url(#chipGold)" strokeWidth="1" opacity="0.6" />
          {/* CPU Pins */}
          <path d="M15 9v5M20 9v5M25 9v5M15 34v5M20 34v5M25 34v5M9 15h5M9 20h5M9 25h5M34 15h5M34 20h5M34 25h5" stroke="url(#chipGold)" strokeWidth="1" strokeLinecap="round" />
          {/* Neural Node Connections */}
          <circle cx="20" cy="24" r="2.5" fill="#ffffff" className="animate-ping" style={{ animationDuration: '2s' }} />
          <circle cx="20" cy="24" r="2" fill="#ffe600" />
          {/* Sparkles */}
          <path d="M7 10l1 1 1-1-1-1z M32 35l1 1 1-1-1-1z" fill="#ffffff" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  // 3. Foto del recuerdo
  if (titleLower.includes('foto') || titleLower.includes('recuerdo')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="flashGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#ffc080" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="camGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#fe9800" />
            </linearGradient>
          </defs>
          {/* Flash Glow Burst */}
          <circle cx="20" cy="12" r="14" fill="url(#flashGlow)" className="animate-pulse" />
          {/* Camera Body */}
          <path d="M8 20h24a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V22a2 2 0 0 1 2-2z" stroke="url(#camGold)" strokeWidth="1.5" fill="#041221" />
          {/* Penthouse prism */}
          <path d="M15 20l5-4 5 4" stroke="url(#camGold)" strokeWidth="1.5" fill="#041221" />
          {/* Lens */}
          <circle cx="20" cy="29" r="6" stroke="url(#camGold)" strokeWidth="1.5" />
          <circle cx="20" cy="29" r="3" stroke="#ffe600" strokeWidth="1" fill="currentColor" fillOpacity="0.1" />
          {/* Flash bulb */}
          <circle cx="20" cy="12" r="3" fill="#ffffff" />
          {/* Flash ray lines */}
          <path d="M12 12h-3M28 12h3M20 4v-3M14 6l-2-2M26 6l2-2" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
          {/* Sparkles */}
          <path d="M33 15l1 1 1-1-1-1z M5 33l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // 4. Comida / Banquete
  if (titleLower.includes('comida') || titleLower.includes('coctel') || titleLower.includes('brindis')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="foodGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe600" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#fe9800" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="foodGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#fe9800" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="20" cy="24" r="16" fill="url(#foodGlow)" className="animate-pulse" />
          {/* Cloche Dome */}
          <path d="M10 28c0-8 5-10 10-10s10 2 10 10H10z" stroke="url(#foodGold)" strokeWidth="1.5" fill="#041221" />
          {/* Cloche handle */}
          <path d="M18 18c0-2 4-2 4 0" stroke="url(#foodGold)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Plate */}
          <path d="M6 30h28v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1z" stroke="url(#foodGold)" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
          {/* Steam rising */}
          <path d="M16 14c0-2-2-2-2-4M20 13c0-2-2-2-2-4M24 14c0-2-2-2-2-4" stroke="#ffe600" strokeWidth="1" strokeLinecap="round" className="animate-pulse" />
          {/* Sparkles */}
          <path d="M33 22l1 1 1-1-1-1z M5 26l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // 5. Junta de presidentes / Toma de protesta / Consejo / Clausura
  if (titleLower.includes('junta') || titleLower.includes('consejo') || titleLower.includes('protesta') || titleLower.includes('clausura')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="juntaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe600" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#fe9800" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="juntaGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="100%" stopColor="#fe9800" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="20" cy="24" r="18" fill="url(#juntaGlow)" className="animate-pulse" />
          {/* Leadership Shield */}
          <path d="M20 8l10 4v8c0 6-10 10-10 10S10 26 10 20v-8l10-4z" stroke="url(#juntaGold)" strokeWidth="1.5" fill="#041221" />
          {/* Handshake stylized */}
          <path d="M15 22l3-3 2 2 4-4" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 16l3 3 5-5" stroke="#ffe600" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          {/* Sparkles */}
          <path d="M7 14l1 1 1-1-1-1z M32 30l1 1 1-1-1-1z" fill="#ffffff" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  // 6. Evento de damas
  if (titleLower.includes('damas')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="damasGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d946ef" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="damasGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffc080" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="20" cy="24" r="16" fill="url(#damasGlow)" className="animate-pulse" />
          {/* Cocktail Glass */}
          <path d="M10 16h20L20 28z" stroke="url(#damasGold)" strokeWidth="1.5" fill="#041221" />
          <path d="M20 28v10M14 38h12" stroke="url(#damasGold)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Liquid gradient fill inside glass */}
          <path d="M13 20h14L20 28z" fill="url(#damasGold)" opacity="0.6" />
          {/* Lemon wheel */}
          <circle cx="29" cy="16" r="3" stroke="#ffe600" strokeWidth="1" fill="#ffe600" fillOpacity="0.3" />
          {/* Sparkles */}
          <path d="M15 12l1 1 1-1-1-1z M24 10l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // 7. Ejecutivo Distinguido
  if (titleLower.includes('ejecutivo') || titleLower.includes('gala')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="galaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe600" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#fe9800" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="trophyGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe600" />
              <stop offset="50%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="20" cy="24" r="18" fill="url(#galaGlow)" className="animate-pulse" />
          {/* Trophy Cup */}
          <path d="M12 12h16v10c0 4.4-3.6 8-8 8s-8-3.6-8-8V12z" stroke="url(#trophyGold)" strokeWidth="1.5" fill="#041221" />
          {/* Trophy Pedestal */}
          <path d="M20 30v6M14 36h12" stroke="url(#trophyGold)" strokeWidth="1.5" strokeLinecap="round" />
          {/* Handles */}
          <path d="M12 15H9c-1.5 0-2 1-2 2.5s.5 2.5 2 2.5h3 M28 15h3c1.5 0 2 1 2 2.5s-.5 2.5-2 2.5h-3" stroke="url(#trophyGold)" strokeWidth="1.2" strokeLinecap="round" />
          {/* Giant Star inside Cup */}
          <path d="M20 14l1.5 3h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill="#ffffff" className="animate-pulse" />
          {/* Sparkles */}
          <path d="M5 10l1 1 1-1-1-1z M34 10l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // 8. Paseo
  if (titleLower.includes('paseo') || titleLower.includes('recorrido')) {
    return (
      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-65 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-20 h-24" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="tourGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="compassGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="20" cy="24" r="16" fill="url(#tourGlow)" className="animate-pulse" />
          {/* Compass outer ring */}
          <circle cx="20" cy="24" r="10" stroke="url(#compassGold)" strokeWidth="1.5" fill="#041221" />
          {/* Inner ring */}
          <circle cx="20" cy="24" r="7" stroke="url(#compassGold)" strokeWidth="0.8" strokeDasharray="2,2" />
          {/* Compass needle */}
          <path d="M20 18l2 6-2 2-2-2z" fill="#f43f5e" />
          <path d="M20 30l-2-6 2-2 2 2z" fill="#ffffff" />
          {/* Card points */}
          <path d="M20 11v1.5M20 35v-1.5M7 24h1.5M33 24h-1.5" stroke="url(#compassGold)" strokeWidth="1" />
          {/* Sparkles */}
          <path d="M30 14l1 1 1-1-1-1z M8 34l1 1 1-1-1-1z" fill="#ffffff" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  return null;
}

interface EventCardStyle {
  isRetro: boolean;
  containerClass: string;
  patternOverlay: React.ReactNode;
  clockIconColor: string;
  pinIconColor: string;
  timeTextClass: string;
  descTextClass: string;
  locationClass: string;
  titleClass: string;
  calendarButtonClass: string;
}

function getEventCardStyle(eventId: string, title: string): EventCardStyle {
  const titleLower = title.toLowerCase();

  // 1. Rompe Hielo 80s (Retro)
  if (eventId === 'd3-1' || titleLower.includes('80s')) {
    return {
      isRetro: true,
      containerClass: 'bg-gradient-to-r from-[#d946ef]/15 via-[#f43f5e]/15 to-[#eab308]/15 border-2 border-dashed border-[#eab308]/60 shadow-[inset_0_0_20px_rgba(244,63,94,0.15),0_8px_30px_rgba(234,179,8,0.1)] hover:border-[#eab308] hover:shadow-[inset_0_0_30px_rgba(244,63,94,0.25),0_12px_40px_rgba(234,179,8,0.2)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={retro70sBg} 
            alt="Retro 80s fashion background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#eab308]',
      pinIconColor: 'text-[#f43f5e]',
      timeTextClass: 'text-[#eab308] font-black',
      descTextClass: 'text-on-surface',
      locationClass: 'text-[#eab308] hover:text-[#ffe600] font-medium underline underline-offset-2',
      titleClass: 'text-[#ffe600] font-black tracking-tight drop-shadow-[0_2px_4px_rgba(244,63,94,0.6)] uppercase italic',
      calendarButtonClass: 'bg-transparent border-2 border-[#eab308] text-[#eab308] hover:border-[#f43f5e] hover:bg-gradient-to-r hover:from-[#f43f5e] hover:to-[#eab308] hover:text-deep-blue shadow-[0_0_10px_rgba(234,179,8,0.2)] hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]'
    };
  }

  // 2. Ceremonia de Inauguración
  if (titleLower.includes('inauguraci')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#ffe600]/10 via-[#041221] to-[#fe9800]/10 border border-[#ffe600]/30 hover:border-[#ffe600] shadow-[inset_0_0_15px_rgba(254,152,0,0.05)] hover:shadow-[inset_0_0_20px_rgba(254,152,0,0.1),0_0_20px_rgba(254,152,0,0.15)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={inauguracionBg} 
            alt="Inauguracion background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#ffe600]',
      pinIconColor: 'text-[#fe9800]',
      timeTextClass: 'text-[#ffe600] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#ffe600] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#ffe600] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#ffe600]/30 text-[#ffe600] hover:border-[#ffe600] hover:bg-[#ffe600] hover:text-deep-blue shadow-[0_0_10px_rgba(255,230,0,0.05)] hover:shadow-[0_0_15px_rgba(255,230,0,0.2)]'
    };
  }

  // 2.5 Cumbre de Ventas (Conferencias especiales d4-new-speaker y d4-2)
  if (eventId === 'd4-new-speaker' || eventId === 'd4-2') {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-cyan-950/15 via-[#041221] to-blue-950/15 border border-cyan-400/40 hover:border-cyan-300 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[inset_0_0_25px_rgba(6,182,212,0.25),0_0_25px_rgba(6,182,212,0.3)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={conferenciaBg} 
            alt="Cumbre de Ventas background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-cyan-400',
      pinIconColor: 'text-blue-400',
      timeTextClass: 'text-cyan-400 font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-cyan-400 hover:underline',
      titleClass: 'text-white font-extrabold hover:text-cyan-300 transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-cyan-400/30 text-cyan-400 hover:border-cyan-300 hover:bg-cyan-500 hover:text-deep-blue shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]'
    };
  }

  // 3. Conferencia Magistral / Cumbre IA
  if (titleLower.includes('nestor') || titleLower.includes('cumbre') || titleLower.includes('conferencia') || titleLower.includes('ponente')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#3b82f6]/10 via-[#041221] to-[#a855f7]/15 border border-[#3b82f6]/40 hover:border-[#a855f7] shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[inset_0_0_25px_rgba(168,85,247,0.15),0_0_25px_rgba(59,130,246,0.2)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={conferenciaBg} 
            alt="Conferencia background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#3b82f6]',
      pinIconColor: 'text-[#a855f7]',
      timeTextClass: 'text-[#3b82f6] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#3b82f6] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#a855f7] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#3b82f6]/40 text-[#3b82f6] hover:border-[#a855f7] hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#a855f7] hover:text-white shadow-[0_0_10px_rgba(59,130,246,0.1)] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]'
    };
  }

  // 4. Foto del recuerdo
  if (titleLower.includes('foto') || titleLower.includes('recuerdo')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#38bdf8]/10 via-[#041221] to-white/5 border border-white/20 hover:border-white shadow-[inset_0_0_15px_rgba(255,255,255,0.03)] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={fotoBg} 
            alt="Foto background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-white',
      pinIconColor: 'text-[#38bdf8]',
      timeTextClass: 'text-white font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-white hover:underline',
      titleClass: 'text-white font-extrabold hover:text-white/80 transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-white/20 text-white/80 hover:border-white hover:bg-white hover:text-deep-blue shadow-[0_0_10px_rgba(255,255,255,0.05)]'
    };
  }

  // 5. Comida / Banquete
  if (titleLower.includes('comida') || titleLower.includes('coctel') || titleLower.includes('brindis')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#ea580c]/10 via-[#041221] to-[#fbbf24]/10 border border-[#ea580c]/30 hover:border-[#ea580c] shadow-[inset_0_0_15px_rgba(234,88,12,0.05)] hover:shadow-[0_0_20px_rgba(234,88,12,0.15)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={comidaBg} 
            alt="Comida background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#ea580c]',
      pinIconColor: 'text-[#fbbf24]',
      timeTextClass: 'text-[#ea580c] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#ea580c] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#ea580c] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#ea580c]/30 text-[#ea580c] hover:border-[#ea580c] hover:bg-[#ea580c] hover:text-white shadow-[0_0_10px_rgba(234,88,12,0.05)]'
    };
  }

  // 6. Evento de damas
  if (titleLower.includes('damas')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#ec4899]/15 via-[#041221] to-[#db2777]/10 border border-[#ec4899]/30 hover:border-[#ec4899] shadow-[inset_0_0_15px_rgba(236,72,153,0.05)] hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={damasBg} 
            alt="Damas background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#ec4899]',
      pinIconColor: 'text-[#db2777]',
      timeTextClass: 'text-[#ec4899] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#ec4899] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#ec4899] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#ec4899]/30 text-[#ec4899] hover:border-[#ec4899] hover:bg-[#ec4899] hover:text-white shadow-[0_0_10px_rgba(236,72,153,0.05)]'
    };
  }

  // 7. Ejecutivo Distinguido / Gala / Clausura / Cena & baile de cierre
  if (titleLower.includes('ejecutivo') || titleLower.includes('gala') || titleLower.includes('cierre') || titleLower.includes('baile')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#fbbf24]/15 via-[#030712] to-[#b45309]/15 border border-[#fbbf24]/50 hover:border-[#fbbf24] shadow-[inset_0_0_20px_rgba(251,191,36,0.08),0_0_15px_rgba(251,191,36,0.1)] hover:shadow-[inset_0_0_35px_rgba(251,191,36,0.15),0_0_25px_rgba(251,191,36,0.25)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={galaBg} 
            alt="Gala background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#fbbf24]',
      pinIconColor: 'text-[#b45309]',
      timeTextClass: 'text-[#fbbf24] font-black',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'text-[#fbbf24] hover:text-white hover:underline',
      titleClass: 'text-[#fbbf24] font-extrabold hover:text-white transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border-2 border-[#fbbf24] text-[#fbbf24] hover:border-white hover:bg-gradient-to-r hover:from-[#fbbf24] hover:to-[#b45309] hover:text-deep-blue shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.35)]'
    };
  }

  // 8. Junta de presidentes / Toma de protesta / Consejo
  if (titleLower.includes('junta') || titleLower.includes('consejo') || titleLower.includes('protesta') || titleLower.includes('clausura')) {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#d97706]/10 via-[#041221] to-[#0284c7]/10 border border-[#d97706]/40 hover:border-[#d97706] shadow-[inset_0_0_15px_rgba(217,119,6,0.05)] hover:shadow-[0_0_20px_rgba(217,119,6,0.15)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={juntaBg} 
            alt="Junta background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#d97706]',
      pinIconColor: 'text-[#0284c7]',
      timeTextClass: 'text-[#d97706] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#d97706] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#d97706] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#d97706]/40 text-[#d97706] hover:border-[#d97706] hover:bg-[#d97706] hover:text-deep-blue shadow-[0_0_10px_rgba(217,119,6,0.05)]'
    };
  }

  // 9. Paseo / Recorrido / Tour / Experiencia Regional
  if (titleLower.includes('paseo') || titleLower.includes('recorrido') || titleLower.includes('experiencia regional') || eventId === 'd5-1') {
    return {
      isRetro: false,
      containerClass: 'bg-gradient-to-r from-[#0284c7]/15 via-[#041221] to-[#0ea5e9]/10 border border-[#0284c7]/30 hover:border-[#38bdf8] shadow-[inset_0_0_15px_rgba(2,132,199,0.05)] hover:shadow-[0_0_20px_rgba(2,132,199,0.15)]',
      patternOverlay: (
        <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none select-none mix-blend-overlay">
          <img 
            src={paseoBg} 
            alt="Paseo background" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      ),
      clockIconColor: 'text-[#38bdf8]',
      pinIconColor: 'text-[#0284c7]',
      timeTextClass: 'text-[#38bdf8] font-bold',
      descTextClass: 'text-on-surface-variant',
      locationClass: 'hover:text-[#38bdf8] hover:underline',
      titleClass: 'text-white font-extrabold hover:text-[#38bdf8] transition-colors duration-200',
      calendarButtonClass: 'bg-transparent border border-[#0284c7]/30 text-[#38bdf8] hover:border-[#38bdf8] hover:bg-[#0284c7] hover:text-white shadow-[0_0_10px_rgba(2,132,199,0.05)]'
    };
  }

  // Default Fallback
  return {
    isRetro: false,
    containerClass: 'bg-surface-card border border-surface-card-high hover:border-accent-orange/20',
    patternOverlay: null,
    clockIconColor: 'text-secondary-orange',
    pinIconColor: 'text-[#ffc080]',
    timeTextClass: 'font-bold',
    descTextClass: 'text-on-surface-variant',
    locationClass: 'hover:text-secondary-orange hover:underline',
    titleClass: 'text-white',
    calendarButtonClass: 'bg-transparent border border-surface-card-high text-on-surface-variant hover:border-secondary-orange hover:bg-secondary-orange hover:text-deep-blue'
  };
}

export default function ScheduleSection() {
  const [selectedDay, setSelectedDay] = useState<number>(3);

  const filteredEvents = SCHEDULE_EVENTS.filter((event) => {
    return event.day === selectedDay;
  });

  return (
    <section className="py-12 bg-deep-blue border-t border-surface-card">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[80px]">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-[#fe9800] tracking-widest block mb-2">CRONOGRAMA OFICIAL</span>
            <h3 className="font-headline font-black text-3xl md:text-5xl text-white tracking-tight uppercase leading-none">
              PROGRAMA <span className="text-[#ffc080]">DEL CONGRESO</span>
            </h3>
            <p className="text-on-surface-variant font-sans text-xs md:text-sm mt-3 max-w-lg leading-relaxed">
              Planifica tu agenda diaria seleccionando los días del congreso y agregando las sesiones a tu Google Calendar.
            </p>
          </div>
        </div>

        {/* Days Tabs (Sept 3, 4, 5) */}
        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
          {[3, 4, 5].map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              id={`tab-day-${dayNum}`}
              className={`py-4 md:py-6 border font-headline text-center uppercase tracking-wider leading-none cursor-pointer duration-200 transition-all ${
                selectedDay === dayNum
                  ? 'border-secondary-orange bg-surface-card text-white font-black'
                  : 'border-surface-card-high text-on-surface-variant bg-surface-card/30 hover:bg-surface-card/60 hover:text-white'
              }`}
            >
              <span className="font-mono text-[10px] text-secondary-orange block mb-1 font-bold">
                {dayNum === 3 ? 'JUEVES' : dayNum === 4 ? 'VIERNES' : 'SÁBADO'}
              </span>
              <span className="text-base md:text-lg">0{dayNum} Sept</span>
            </button>
          ))}
        </div>

        {/* Agenda Timings List */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
                if (event.id === 'd4-2') {
                  return null;
                }

                if (event.id === 'd4-new-speaker') {
                  const event2 = filteredEvents.find((e) => e.id === 'd4-2');
                  const linkedSpeaker1 = SPEAKERS.find((s) => s.id === 'invitado-keynote');
                  const linkedSpeaker2 = SPEAKERS.find((s) => s.id === 'nestor');
                  
                  return (
                    <div 
                      key="cumbre-ventas-group"
                      className="relative border border-[#0ea5e9]/40 bg-[#020e1a] rounded-3xl overflow-hidden shadow-[0_0_35px_rgba(14,165,233,0.15)] transition-all duration-300 hover:border-[#0ea5e9]/70"
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none select-none mix-blend-overlay">
                        <img 
                          src={conferenciaBg} 
                          alt="Cumbre de Ventas background" 
                          className="w-full h-full object-cover object-center" 
                        />
                      </div>

                      {/* Header Section */}
                      <div className="relative p-6 md:p-10 text-center border-b border-white/10 z-10">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase select-none mx-auto mb-4">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                          Evento Especial Dentro de COMEV 2026
                        </div>

                        {/* Main Logo */}
                        <div className="py-2">
                          <img 
                            src={cumbreVentasLogo} 
                            alt="Cumbre de Ventas 2026" 
                            className="h-20 md:h-28 mx-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                      </div>

                      {/* Sub-events List */}
                      <div className="divide-y divide-white/10 z-10 relative bg-[#020e1a]/40">
                        
                        {/* Event 1 */}
                        <div className="p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center hover:bg-white/[0.015] transition-colors duration-200">
                          {/* Large Number Column */}
                          <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                            <span className="text-4xl md:text-5xl font-black text-[#0ea5e9]/20 font-mono tracking-tighter">01</span>
                          </div>

                          {/* Content Column */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                              Conferencia Magistral
                            </div>

                            <h4 className="font-headline text-lg md:text-xl font-bold text-white leading-snug uppercase">
                              {linkedSpeaker1 ? linkedSpeaker1.role : event.title}
                            </h4>

                            <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-secondary-orange uppercase">
                              <span>Ponente:</span>
                              <span className="px-2 py-0.5 rounded bg-secondary-orange/10 border border-secondary-orange/20 text-white ml-1 font-semibold">
                                {linkedSpeaker1 ? linkedSpeaker1.name : "Conferencista Invitado"}
                              </span>
                            </div>

                            <p className="font-sans text-xs md:text-sm leading-relaxed text-on-surface-variant">
                              {linkedSpeaker1 ? linkedSpeaker1.bio : event.description}
                            </p>
                          </div>

                          {/* Location Column */}
                          <div className="md:col-span-3 flex items-start gap-1.5 font-sans text-on-surface-variant leading-relaxed md:justify-end">
                            <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            {event.locationUrl ? (
                              <a 
                                href={event.locationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="transition-all duration-150 text-sm md:text-base font-bold text-cyan-200 hover:text-cyan-400 hover:underline"
                              >
                                {event.location}
                              </a>
                            ) : (
                              <span className="text-sm md:text-base font-bold text-cyan-200">{event.location}</span>
                            )}
                          </div>
                        </div>

                        {/* Event 2 */}
                        {event2 && (
                          <div className="p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center hover:bg-white/[0.015] transition-colors duration-200">
                            {/* Large Number Column */}
                            <div className="md:col-span-1 flex items-center justify-start md:justify-center">
                              <span className="text-4xl md:text-5xl font-black text-[#0ea5e9]/20 font-mono tracking-tighter">02</span>
                            </div>

                            {/* Content Column */}
                            <div className="md:col-span-8 space-y-3">
                              <div className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-mono font-bold tracking-wider uppercase">
                                Conferencia Magistral
                              </div>

                              <h4 className="font-headline text-lg md:text-xl font-bold text-white leading-snug flex items-center flex-wrap gap-2">
                                <span>Cumbre: Néstor Guerra</span>
                                <span className="text-xs md:text-sm font-sans font-normal text-on-surface-variant">. CONFERENCISTA INTERNACIONAL IA & NEGOCIOS</span>
                              </h4>

                              <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-secondary-orange uppercase">
                                <span>Ponente:</span>
                                <span className="px-2 py-0.5 rounded bg-secondary-orange/10 border border-secondary-orange/20 text-white ml-1 font-semibold inline-flex items-center gap-1.5 font-sans">
                                  {linkedSpeaker2 ? linkedSpeaker2.name : event2.speakerName}
                                  <svg className="w-5 h-3.5 shadow-sm border border-white/10 rounded-sm inline-block shrink-0" viewBox="0 0 3 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <title>España</title>
                                    <rect width="3" height="2" fill="#AD1519" />
                                    <rect y="0.5" width="3" height="1" fill="#FABD00" />
                                  </svg>
                                </span>
                              </div>

                              <p className="font-sans text-xs md:text-sm leading-relaxed text-on-surface-variant">
                                {event2.description}
                              </p>
                            </div>

                            {/* Location Column */}
                            <div className="md:col-span-3 flex items-start gap-1.5 font-sans text-on-surface-variant leading-relaxed md:justify-end">
                              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              {event2.locationUrl ? (
                                <a 
                                  href={event2.locationUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="transition-all duration-150 text-sm md:text-base font-bold text-cyan-200 hover:text-cyan-400 hover:underline"
                                >
                                  {event2.location}
                                </a>
                              ) : (
                                <span className="text-sm md:text-base font-bold text-cyan-200">{event2.location}</span>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                }

                const cardStyle = getEventCardStyle(event.id, event.title);
                const linkedSpeaker = event.speakerId ? SPEAKERS.find((s) => s.id === event.speakerId) : null;
                return (
                  <div 
                    key={event.id}
                    className={`relative transition-all duration-300 p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center overflow-hidden ${cardStyle.containerClass}`}
                  >
                    {/* Pattern Overlay */}
                    {cardStyle.patternOverlay}

                    {/* Retro elements if applicable */}
                    {cardStyle.isRetro && (
                      <div className="absolute right-[22%] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden lg:block opacity-80 hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-20 h-24" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <radialGradient id="discoGlow" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                              <stop offset="35%" stopColor="#d946ef" stopOpacity="0.5" />
                              <stop offset="70%" stopColor="#eab308" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                          {/* Glow effect */}
                          <circle cx="16" cy="20" r="16" fill="url(#discoGlow)" className="animate-pulse" />
                          {/* Hanging chain */}
                          <line x1="16" y1="0" x2="16" y2="10" stroke="#eab308" strokeWidth="1" strokeDasharray="1,1.5" />
                          {/* Disco Ball base */}
                          <circle cx="16" cy="20" r="10" stroke="#eab308" strokeWidth="1.5" fill="#1e1e24" />
                          {/* Grid mirror patterns */}
                          <path d="M16 10v20 M6 20h20 M9 15h14 M9 25h14 M11 12.5h10 M11 27.5h10 M13 11h6 M13 29h6" stroke="#eab308" strokeWidth="0.8" opacity="0.75" />
                          <path d="M11 11.5C14 13.5 14 26.5 11 28.5 M21 11.5C18 13.5 18 26.5 21 28.5 M8 14.5C12 16.5 12 23.5 8 25.5 M24 14.5C20 16.5 20 23.5 24 25.5" stroke="#eab308" strokeWidth="0.8" opacity="0.5" />
                          {/* Sparkles */}
                          <path d="M6 10l1 1 1-1-1-1z M25 28l1 1 1-1-1-1z" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
                          <path d="M26 12l1.5 1.5 1.5-1.5-1.5-1.5z M5 26l1 1 1-1-1-1z" fill="#ffffff" className="animate-pulse" />
                        </svg>
                      </div>
                    )}

                    {/* Dynamic Event Representative Watermark for other events */}
                    {!cardStyle.isRetro && getEventWatermark(event.id, event.title)}

                    {/* Left Column: Location (Timing is commented out but kept in code) */}
                    <div className="md:col-span-3 space-y-2 relative z-10">
                      {/* Horario oculto temporalmente - se reactivará después
                      <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                        <Clock className={`w-3.5 h-3.5 ${cardStyle.clockIconColor}`} strokeWidth={2.5} />
                        <span className={cardStyle.timeTextClass}>{event.time}</span>
                      </div>
                      */}
                      <div className={`flex items-start gap-1.5 font-sans ${cardStyle.descTextClass} leading-relaxed`}>
                        <MapPin className={`w-4 h-4 ${cardStyle.pinIconColor} shrink-0 mt-0.5`} />
                        {event.locationUrl ? (
                          <a 
                            href={event.locationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`transition-all duration-150 text-sm md:text-base font-bold ${cardStyle.locationClass}`}
                          >
                            {event.location}
                          </a>
                        ) : (
                          <span className="text-sm md:text-base font-bold">{event.location}</span>
                        )}
                      </div>
                    </div>

                    {/* Center Column: Description and Speaker (Extended to 9 columns since calendar button is hidden) */}
                    <div className="md:col-span-9 space-y-3 relative z-10">
                      <div>
                        {(event.id === 'd4-new-speaker' || event.id === 'd4-2') && (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-[10px] md:text-xs font-mono font-bold tracking-wider mb-3 uppercase select-none w-fit">
                            <img src={cumbreVentasLogo} className="h-4 w-auto object-contain" alt="Cumbre de Ventas" />
                            <span>Conferencia Cumbre de Ventas 2026</span>
                          </div>
                        )}
                        {event.title === 'Ejecutivo Distinguido Nacional' ? (
                          <button
                            onClick={() => {
                              const section = document.getElementById('executive-highlight');
                              if (section) {
                                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`font-headline font-extrabold text-lg md:text-xl leading-snug text-left cursor-pointer hover:underline transition-all duration-150 pb-1 ${cardStyle.titleClass}`}
                          >
                            {event.title}
                          </button>
                        ) : (
                          <h4 className={`font-headline text-lg md:text-xl leading-snug ${cardStyle.titleClass}`}>
                            {event.speakerId === 'invitado-keynote' && linkedSpeaker ? (
                              <span>Conferencia Magistral: {linkedSpeaker.role}</span>
                            ) : event.id === 'd4-2' ? (
                              <span className="inline-flex flex-wrap items-center gap-2">
                                <span>Cumbre: Néstor Guerra</span>
                                <svg className="w-8 h-5.5 shadow-md border border-white/10 rounded-sm inline-block shrink-0" viewBox="0 0 3 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <title>España</title>
                                  <rect width="3" height="2" fill="#AD1519" />
                                  <rect y="0.5" width="3" height="1" fill="#FABD00" />
                                </svg>
                                <span>. CONFERENCISTA INTERNACIONAL IA & NEGOCIOS</span>
                              </span>
                            ) : (
                              event.title
                            )}
                          </h4>
                        )}
                      </div>

                      {(event.speakerName || (event.speakerId && linkedSpeaker)) && (
                        <p className="font-sans text-xs text-secondary-orange font-medium flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" /> Ponente:{' '}
                          <span className="text-white underline underline-offset-2 decoration-accent-orange/40 inline-flex items-center gap-1.5">
                            {linkedSpeaker ? linkedSpeaker.name : event.speakerName}
                            {event.speakerId === 'nestor' && (
                              <svg className="w-6 h-4 shadow-sm border border-white/10 rounded-sm inline-block shrink-0" viewBox="0 0 3 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <title>España</title>
                                <rect width="3" height="2" fill="#AD1519" />
                                <rect y="0.5" width="3" height="1" fill="#FABD00" />
                              </svg>
                            )}
                          </span>
                        </p>
                      )}

                      <p className={`font-sans text-xs md:text-sm leading-relaxed ${cardStyle.descTextClass}`}>
                        {event.speakerId === 'invitado-keynote' && linkedSpeaker ? linkedSpeaker.bio : event.description}
                      </p>
                    </div>

                    {/* Right Column: Interaction Action Selector (Commented out but kept in code) */}
                    {/* 
                    <div className="md:col-span-2 flex md:justify-end relative z-10">
                      <a
                        href={getGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noreferrer"
                        id={`btn-calendar-event-${event.id}`}
                        className={`w-full md:w-auto px-4 py-2.5 font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-1.5 text-center no-underline cursor-pointer ${cardStyle.calendarButtonClass}`}
                      >
                        <CalendarCheck className="w-3.5 h-3.5" /> AGREGAR A CALENDARIO
                      </a>
                    </div>
                    */}

                  </div>
                );
            })
          ) : (
            <div className="text-center py-16 bg-surface-card border border-surface-card-high">
              <BookOpen className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
              <p className="font-sans text-sm text-on-surface-variant">No hay sesiones programadas para este día.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
