export const EVENT_TIMEZONE = 'America/Chihuahua';

/** Rompe hielo — 3 sep 2026, 7:00 pm hora de Chihuahua */
export const EVENT_START_MS = Date.UTC(2026, 8, 4, 1, 0, 0);

export const EVENT_START_LABEL = '3 sep 2026 · 7:00 pm · Chihuahua';

export interface EventTimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const ZERO: EventTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

export function getEventTimeLeft(nowMs = Date.now()): EventTimeLeft {
  const difference = EVENT_START_MS - nowMs;
  if (difference <= 0) return ZERO;

  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function getNowInEventTimeZone(now = new Date()): string {
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: EVENT_TIMEZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(now);
}
