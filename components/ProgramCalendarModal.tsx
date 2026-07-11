'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { ScheduleEvent } from '../types';

const DAY_LABELS: Record<number, string> = {
  3: 'Jueves 03 Sept',
  4: 'Viernes 04 Sept',
  5: 'Sábado 05 Sept',
};

type CalendarEventItem = {
  event: ScheduleEvent;
  title: string;
  calendarUrl: string;
};

function parseEventTime(timeStr: string, day: number) {
  const parts = timeStr.split(' - ');
  if (parts.length !== 2) return null;

  function to24h(timePart: string) {
    const trimmed = timePart.trim();
    const match12 = trimmed.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (match12) {
      let hrs = parseInt(match12[1], 10);
      const mins = parseInt(match12[2], 10);
      const ampm = match12[3].toUpperCase();
      if (ampm === 'PM' && hrs < 12) hrs += 12;
      if (ampm === 'AM' && hrs === 12) hrs = 0;
      return { hrs, mins };
    }

    const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
      return { hrs: parseInt(match24[1], 10), mins: parseInt(match24[2], 10) };
    }

    return null;
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

  return `202609${pad(startDay)}T${pad(start.hrs)}${pad(start.mins)}00/202609${pad(endDay)}T${pad(end.hrs)}${pad(end.mins)}00`;
}

function getGoogleCalendarUrl(event: ScheduleEvent, title: string) {
  if (!event.time?.trim()) return null;

  const dates = parseEventTime(event.time, event.day);
  if (!dates) return null;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `COMEV 2026: ${title}`,
    dates,
    details: event.description + (event.speakerName ? `\nPonente: ${event.speakerName}` : ''),
    location: event.location || '',
    ctz: 'America/Chihuahua',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getCalendarExportEvents(events: ScheduleEvent[]): CalendarEventItem[] {
  return events
    .filter((event) => event.time?.trim() && event.id !== 'd4-2')
    .map((event) => ({
      event,
      title: event.id === 'd4-new-speaker' ? 'Cumbre de Ventas 2026' : event.title,
      calendarUrl: getGoogleCalendarUrl(
        event,
        event.id === 'd4-new-speaker' ? 'Cumbre de Ventas 2026' : event.title
      ),
    }))
    .filter((item): item is CalendarEventItem => Boolean(item.calendarUrl));
}

interface ProgramCalendarModalProps {
  events: ScheduleEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgramCalendarModal({ events, isOpen, onClose }: ProgramCalendarModalProps) {
  const calendarEvents = useMemo(() => getCalendarExportEvents(events), [events]);
  const allIds = useMemo(() => calendarEvents.map((item) => item.event.id), [calendarEvents]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(allIds));
  const [bulkQueue, setBulkQueue] = useState<CalendarEventItem[] | null>(null);
  const [bulkIndex, setBulkIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set(allIds));
      setBulkQueue(null);
      setBulkIndex(0);
    }
  }, [isOpen, allIds]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allSelected = selectedIds.size === allIds.length;
  const hasSelection = selectedIds.size > 0;
  const isBulkMode = bulkQueue !== null;
  const isBulkComplete = isBulkMode && bulkIndex >= bulkQueue.length;
  const currentBulkItem = isBulkMode && !isBulkComplete ? bulkQueue[bulkIndex] : null;
  const bulkTotal = bulkQueue?.length ?? 0;
  const bulkProgress = bulkTotal > 0 ? Math.min(bulkIndex + 1, bulkTotal) : 0;

  function toggleEvent(id: string) {
    if (isBulkMode) return;
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (isBulkMode) return;
    setSelectedIds(allSelected ? new Set() : new Set(allIds));
  }

  function startBulkSchedule() {
    const queue = calendarEvents.filter(({ event }) => selectedIds.has(event.id));
    if (queue.length === 0) return;
    setBulkQueue(queue);
    setBulkIndex(0);
  }

  function exitBulkSchedule() {
    setBulkQueue(null);
    setBulkIndex(0);
  }

  function advanceBulkSchedule() {
    setBulkIndex((current) => current + 1);
  }

  function openCurrentBulkEvent() {
    if (!currentBulkItem?.calendarUrl) return;
    window.open(currentBulkItem.calendarUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-deep-blue/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-card border-2 border-secondary-orange w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-calendar-title"
      >
        <div className="border-b border-surface-variant p-4 md:p-6 flex justify-between items-start gap-4 bg-deep-blue">
          <div>
            <h4 id="program-calendar-title" className="font-headline font-black text-white text-xl tracking-tight uppercase">
              {isBulkMode ? 'Agendar todos' : 'Agendar programa'}
            </h4>
            <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
              {isBulkMode
                ? 'Abre un evento a la vez en Google Calendar, guárdalo y pulsa Siguiente hasta terminar.'
                : 'Selecciona los eventos y usa Agendar todos para recorrerlos uno por uno.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-white hover:bg-white/10 p-2 transition-colors border border-surface-variant shrink-0 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBulkMode ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {isBulkComplete ? (
              <div className="border border-secondary-orange/60 bg-secondary-orange/5 p-6 md:p-8 text-center">
                <p className="font-headline font-black text-white text-xl uppercase tracking-tight">
                  Programa agendado
                </p>
                <p className="font-sans text-sm text-on-surface-variant mt-3 leading-relaxed">
                  Recorriste los {bulkTotal} eventos seleccionados. Revisa tu Google Calendar para confirmar que quedaron guardados.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  <button
                    type="button"
                    onClick={exitBulkSchedule}
                    className="px-4 py-2 border border-secondary-orange text-secondary-orange font-headline text-xs font-bold uppercase tracking-wide hover:bg-secondary-orange hover:text-deep-blue transition-all cursor-pointer"
                  >
                    Volver al listado
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-secondary-orange bg-secondary-orange text-deep-blue font-headline text-xs font-bold uppercase tracking-wide hover:bg-white transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : currentBulkItem ? (
              <div className="border border-secondary-orange/60 bg-secondary-orange/5 p-5 md:p-8">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="font-mono text-[10px] md:text-xs text-secondary-orange font-bold uppercase tracking-wider">
                    Evento {bulkProgress} de {bulkTotal}
                  </span>
                  <button
                    type="button"
                    onClick={exitBulkSchedule}
                    className="font-headline text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wide hover:text-white transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="h-1.5 bg-surface-variant mb-6 overflow-hidden">
                  <div
                    className="h-full bg-secondary-orange transition-all duration-300"
                    style={{ width: `${(bulkIndex / bulkTotal) * 100}%` }}
                  />
                </div>

                <p className="font-mono text-[10px] text-secondary-orange font-bold uppercase tracking-wider mb-2">
                  {DAY_LABELS[currentBulkItem.event.day]}
                </p>
                <p className="font-headline font-black text-white text-xl md:text-2xl leading-snug">
                  {currentBulkItem.title}
                </p>
                <p className="font-mono text-sm text-on-surface-variant mt-2">{currentBulkItem.event.time}</p>
                {currentBulkItem.event.location && (
                  <p className="font-sans text-sm text-on-surface-variant mt-1">{currentBulkItem.event.location}</p>
                )}

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8">
                  <button
                    type="button"
                    id="btn-open-current-bulk-event"
                    onClick={openCurrentBulkEvent}
                    className="px-5 py-3 border border-secondary-orange bg-secondary-orange text-deep-blue font-headline text-xs font-bold uppercase tracking-wide hover:bg-white transition-all cursor-pointer"
                  >
                    Abrir en Google Calendar
                  </button>
                  <button
                    type="button"
                    id="btn-next-bulk-event"
                    onClick={advanceBulkSchedule}
                    className="px-5 py-3 border border-secondary-orange text-secondary-orange font-headline text-xs font-bold uppercase tracking-wide hover:bg-secondary-orange hover:text-deep-blue transition-all cursor-pointer"
                  >
                    Ya lo agregué — Siguiente
                  </button>
                  <button
                    type="button"
                    id="btn-skip-bulk-event"
                    onClick={advanceBulkSchedule}
                    className="px-5 py-3 border border-surface-variant text-on-surface-variant font-headline text-xs font-bold uppercase tracking-wide hover:text-white hover:border-white/30 transition-all cursor-pointer"
                  >
                    Omitir
                  </button>
                </div>

                <p className="font-sans text-[11px] text-on-surface-variant mt-6 leading-relaxed">
                  1. Pulsa Abrir en Google Calendar · 2. Guarda el evento en la pestaña que se abre · 3. Regresa aquí y pulsa Siguiente
                </p>
              </div>
            ) : null}

            {bulkQueue && (
              <div className="mt-6 space-y-2">
                {bulkQueue.map((item, index) => {
                  const isDone = index < bulkIndex;
                  const isCurrent = index === bulkIndex && !isBulkComplete;

                  return (
                    <div
                      key={item.event.id}
                      className={`border px-4 py-3 text-sm transition-colors ${
                        isCurrent
                          ? 'border-secondary-orange bg-secondary-orange/10 text-white'
                          : isDone
                            ? 'border-surface-variant/50 bg-surface-card/10 text-on-surface-variant line-through opacity-60'
                            : 'border-surface-variant bg-surface-card/20 text-on-surface-variant'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-wider mr-2">
                        {DAY_LABELS[item.event.day]}
                      </span>
                      {item.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="px-4 md:px-6 py-3 border-b border-surface-variant bg-surface-card/60 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] md:text-xs text-on-surface-variant uppercase tracking-wider">
                {selectedIds.size} de {allIds.length} seleccionados
              </span>
              <div className="flex flex-wrap items-center gap-2 ml-auto">
                <button
                  type="button"
                  id="btn-select-all-program-events"
                  onClick={toggleAll}
                  className="px-3 py-2 border border-secondary-orange text-secondary-orange font-headline text-[10px] md:text-xs font-bold uppercase tracking-wide hover:bg-secondary-orange hover:text-deep-blue transition-all cursor-pointer"
                >
                  {allSelected ? 'Quitar selección' : 'Seleccionar todos'}
                </button>
                <button
                  type="button"
                  id="btn-schedule-all-program-events"
                  onClick={startBulkSchedule}
                  disabled={!hasSelection}
                  className="px-4 py-2 border border-secondary-orange bg-secondary-orange text-deep-blue font-headline text-[10px] md:text-xs font-bold uppercase tracking-wide hover:bg-white transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-secondary-orange"
                >
                  Agendar todos
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
              {calendarEvents.map(({ event, title, calendarUrl }) => {
                const isSelected = selectedIds.has(event.id);

                return (
                  <div
                    key={event.id}
                    className={`border p-4 transition-colors ${
                      isSelected
                        ? 'border-secondary-orange/60 bg-secondary-orange/5'
                        : 'border-surface-variant bg-surface-card/20 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`program-event-${event.id}`}
                        checked={isSelected}
                        onChange={() => toggleEvent(event.id)}
                        className="mt-1 w-4 h-4 accent-secondary-orange cursor-pointer shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={`program-event-${event.id}`}
                          className="block font-mono text-[10px] text-secondary-orange font-bold uppercase tracking-wider mb-1 cursor-pointer"
                        >
                          {DAY_LABELS[event.day]}
                        </label>
                        <p className="font-headline font-bold text-white text-sm md:text-base leading-snug">
                          {title}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant mt-1">{event.time}</p>
                        {event.location && (
                          <p className="font-sans text-xs text-on-surface-variant mt-1">{event.location}</p>
                        )}
                      </div>

                      {isSelected && calendarUrl && (
                        <a
                          href={calendarUrl}
                          target="_blank"
                          rel="noreferrer"
                          id={`btn-calendar-program-${event.id}`}
                          className="shrink-0 px-3 py-2 border border-secondary-orange bg-secondary-orange text-deep-blue font-headline text-[10px] md:text-xs font-bold uppercase tracking-wide hover:bg-white transition-all no-underline text-center"
                        >
                          Google Calendar
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
