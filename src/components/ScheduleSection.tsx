import { useState } from 'react';
import { SCHEDULE_EVENTS } from '../data';
import { ScheduleEvent } from '../types';
import { Clock, MapPin, Grid, Layers, CalendarCheck, BookOpen, UserCheck, Star } from 'lucide-react';

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
              return (
                <div 
                  key={event.id}
                  className="bg-surface-card border border-surface-card-high hover:border-accent-orange/20 transition-all duration-200 p-6 md:p-8 grid md:grid-cols-12 gap-6 items-center"
                >
                  {/* Left Column: Timing */}
                  <div className="md:col-span-3 space-y-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                      <Clock className="w-3.5 h-3.5 text-secondary-orange" strokeWidth={2.5} />
                      <span className="font-bold">{event.time}</span>
                    </div>
                    <div className="flex items-start gap-1.5 font-sans text-xs text-on-surface-variant leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-[#ffc080] shrink-0 mt-0.5" />
                      {event.locationUrl ? (
                        <a 
                          href={event.locationUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-secondary-orange hover:underline transition-all duration-150"
                        >
                          {event.location}
                        </a>
                      ) : (
                        <span>{event.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Center Column: Description and Speaker */}
                  <div className="md:col-span-7 space-y-3">
                    <div>
                      {event.title === 'Ejecutivo Distinguido Nacional' ? (
                        <button
                          onClick={() => {
                            const section = document.getElementById('executive-highlight');
                            if (section) {
                              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }}
                          className="font-headline font-extrabold text-lg md:text-xl text-white hover:text-secondary-orange leading-snug text-left cursor-pointer hover:underline transition-all duration-150 pb-1"
                        >
                          {event.title}
                        </button>
                      ) : (
                        <h4 className="font-headline font-extrabold text-lg md:text-xl text-white leading-snug">
                          {event.title}
                        </h4>
                      )}
                    </div>

                    {event.speakerName && (
                      <p className="font-sans text-xs text-secondary-orange font-medium flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" /> Ponente: <span className="text-white underline underline-offset-2 decoration-accent-orange/40">{event.speakerName}</span>
                      </p>
                    )}

                    <p className="font-sans text-xs md:text-sm text-on-surface-variant leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Right Column: Interaction Action Selector */}
                  <div className="md:col-span-2 flex md:justify-end">
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noreferrer"
                      id={`btn-calendar-event-${event.id}`}
                      className="w-full md:w-auto px-4 py-2.5 font-mono text-[10px] font-black tracking-widest uppercase transition-all duration-150 flex items-center justify-center gap-1.5 bg-transparent border border-surface-card-high text-on-surface-variant hover:border-secondary-orange hover:bg-secondary-orange hover:text-deep-blue text-center no-underline cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" /> AGREGAR A CALENDARIO
                    </a>
                  </div>

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
