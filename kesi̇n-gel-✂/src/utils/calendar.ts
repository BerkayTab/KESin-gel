import type { Appointment } from '../types';

function escapeText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function timestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

// iCalendar content lines are limited to 75 octets, including continuation spaces.
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  let result = '';
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) {
      result += '\r\n ';
      bytes = 1;
    }
    result += char;
    bytes += size;
  }
  return result;
}

export function buildAppointmentCalendar(appointment: Appointment): string {
  // All demo businesses are in Istanbul; appointment times are business-local.
  const start = new Date(`${appointment.date}T${appointment.time}:00+03:00`);
  const end = new Date(start.getTime() + appointment.totalDuration * 60_000);
  const description = `Hizmet: ${appointment.services.map((s) => s.name).join(', ')}\nTutar: ₺${appointment.totalPrice}`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KESIN GEL//Berber Randevusu//TR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${escapeText(appointment.id)}@kesingel`,
    `DTSTAMP:${timestamp(new Date(appointment.createdAt))}`,
    `DTSTART:${timestamp(start)}`,
    `DTEND:${timestamp(end)}`,
    `SUMMARY:${escapeText(`${appointment.barberName} - Berber Randevusu (KESİN GEL)`)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(appointment.barberDistrict)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].map(foldLine).join('\r\n');
}
