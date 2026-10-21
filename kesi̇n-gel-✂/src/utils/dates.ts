function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Format YYYY-MM-DD
export function getTodayDateString(): string {
  const d = new Date();
  return toLocalDateString(d);
}

export function getDateStringOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return toLocalDateString(d);
}

export function formatTurkishDate(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00`);
  const todayStr = getTodayDateString();
  const tomorrowStr = getDateStringOffset(1);

  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  if (dateStr === todayStr) {
    return `Bugün (${date.getDate()} ${months[date.getMonth()]})`;
  }
  if (dateStr === tomorrowStr) {
    return `Yarın (${date.getDate()} ${months[date.getMonth()]})`;
  }

  return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`;
}
