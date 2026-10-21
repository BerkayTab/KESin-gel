import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mock } from 'node:test';
import { buildAppointmentCalendar } from '../src/utils/calendar.ts';
import { getTodayDateString, getDateStringOffset, formatTurkishDate } from '../src/utils/dates.ts';

const appointment = {
  id: 'apt-test', date: '2026-10-21', time: '23:30', totalDuration: 90,
  createdAt: '2026-10-20T12:00:00Z', barberName: 'Ahmet, Barber; Moda',
  barberDistrict: 'Kadıköy', services: [{ name: 'Saç, Sakal; Bakım' }], totalPrice: 650,
};

test('calendar includes identity, creation time and Istanbul appointment times in UTC', () => {
  const calendar = buildAppointmentCalendar(appointment);
  assert.ok(calendar.includes('UID:apt-test@kesingel\r\n'));
  assert.ok(calendar.includes('DTSTAMP:20261020T120000Z\r\n'));
  assert.ok(calendar.includes('DTSTART:20261021T203000Z\r\n'));
  assert.ok(calendar.includes('DTEND:20261021T220000Z\r\n'));
  assert.ok(calendar.endsWith('END:VCALENDAR\r\n'));
  assert.equal(calendar.replaceAll('\r\n', '').includes('\n'), false);
});

test('calendar uses duration correctly when an appointment crosses UTC midnight', () => {
  const calendar = buildAppointmentCalendar({ ...appointment, totalDuration: 240 });
  assert.ok(calendar.includes('DTEND:20261022T003000Z\r\n'));
});

test('calendar escapes punctuation and injected newlines as text', () => {
  const calendar = buildAppointmentCalendar({ ...appointment, barberDistrict: 'Moda\nEND:VEVENT' });
  assert.ok(calendar.includes('SUMMARY:Ahmet\\, Barber\\; Moda'));
  assert.ok(calendar.includes('LOCATION:Moda\\nEND:VEVENT\r\n'));
  assert.equal(calendar.split('\r\n').filter((line) => line === 'END:VEVENT').length, 1);
});

test('calendar folds Unicode text at 75 UTF-8 bytes without losing characters', () => {
  const name = 'Şişli saç ve sakal bakımı '.repeat(12);
  const calendar = buildAppointmentCalendar({ ...appointment, barberName: name });
  for (const line of calendar.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = calendar.replaceAll('\r\n ', '');
  assert.ok(unfolded.includes(`SUMMARY:${name} - Berber Randevusu (KESİN GEL)`));
});

test('local dates stay on the selected calendar day around UTC midnight', () => {
  const oldTZ = process.env.TZ;
  try {
    process.env.TZ = 'Europe/Istanbul';
    mock.timers.enable({ apis: ['Date'], now: new Date('2026-10-20T21:30:00Z') });
    assert.equal(getTodayDateString(), '2026-10-21');
    assert.equal(getDateStringOffset(1), '2026-10-22');
    assert.equal(getDateStringOffset(-1), '2026-10-20');
    assert.equal(formatTurkishDate('2026-10-21'), 'Bugün (21 Ekim)');
    assert.equal(formatTurkishDate('2026-10-22'), 'Yarın (22 Ekim)');
    process.env.TZ = 'America/Los_Angeles';
    assert.equal(formatTurkishDate('2026-10-25'), '25 Ekim, Paz');
    mock.timers.reset();
    mock.timers.enable({ apis: ['Date'], now: new Date('2027-01-01T01:30:00Z') });
    assert.equal(getTodayDateString(), '2026-12-31');
    assert.equal(getDateStringOffset(1), '2027-01-01');
  } finally {
    mock.timers.reset();
    if (oldTZ === undefined) delete process.env.TZ;
    else process.env.TZ = oldTZ;
  }
});
