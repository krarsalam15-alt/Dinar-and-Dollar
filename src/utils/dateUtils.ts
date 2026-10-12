/**
 * Dynamic Date Utilities for Real-time Daily Updates
 * Automatically synchronizes to the current day (e.g. 2026/10/12 or any future date)
 */

export function getCurrentDateInfo(dateObj: Date = new Date()) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();

  const pad = (n: number) => String(n).padStart(2, '0');
  const isoDate = `${year}/${pad(month)}/${pad(day)}`;

  const arabicDayName = dateObj.toLocaleDateString('ar-IQ', { weekday: 'long' });
  const arabicMonthName = dateObj.toLocaleDateString('ar-IQ', { month: 'long' });
  
  const fullArabicDate = `${arabicDayName} ${day} ${arabicMonthName} ${year}`;
  const fullBadge = `${fullArabicDate} (${isoDate})`;

  return {
    year,
    month,
    day,
    isoDate,
    arabicDayName,
    arabicMonthName,
    fullArabicDate,
    fullBadge,
  };
}

export function getCurrentTimeFormatted(dateObj: Date = new Date()) {
  return dateObj.toLocaleTimeString('ar-IQ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
