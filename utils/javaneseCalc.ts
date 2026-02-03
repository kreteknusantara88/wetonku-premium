import { DAYS, PASARANS } from '../constants';
import { WetonResult, JodohResult, JodohCategoryName, CalendarDayPrediction, PancasudaCategory, JavaneseDateInfo } from '../types';

/**
 * Calculates the Weton (Day + Pasaran) and Neptu for a given date.
 * Includes logic for Javanese day change at Maghrib (approx 18:00).
 */
export const calculateWeton = (date: Date, timeStr?: string): WetonResult => {
  // Normalize date to prevent timezone offsets affecting calculation
  const target = new Date(date);
  target.setHours(12, 0, 0, 0); // Default to noon for calculation safety

  let isAfterMaghrib = false;

  // Check Maghrib Rule (18:00)
  if (timeStr) {
    const [hours] = timeStr.split(':').map(Number);
    if (!isNaN(hours) && hours >= 18) {
      // Shift to next day
      target.setDate(target.getDate() + 1);
      isAfterMaghrib = true;
    }
  }

  // Get Day of Week (0 = Sunday, etc.)
  const dayIndex = target.getDay();
  const dayInfo = DAYS.find(d => d.id === dayIndex) || DAYS[0];

  // Calculate Pasaran
  // Reference date: January 1, 1900 (Monday Pahing)
  const anchorDate = new Date(1900, 0, 1); 
  anchorDate.setHours(12, 0, 0, 0);

  // Difference in milliseconds
  const diffTime = target.getTime() - anchorDate.getTime();
  // Difference in days (floored)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 1 Jan 1900 was Pahing. 
  // Pasaran array: [Legi, Pahing, Pon, Wage, Kliwon]
  // Pahing is index 1.
  // Formula: (AnchorIndex + DiffDays) % 5
  // Handle negative days for dates before 1900
  const anchorPasaranIndex = 1; // Pahing
  let pasaranIndex = (anchorPasaranIndex + diffDays) % 5;
  
  if (pasaranIndex < 0) {
    pasaranIndex += 5;
  }

  const pasaranInfo = PASARANS[pasaranIndex];

  return {
    date: target, // Return the adjusted date
    day: dayInfo,
    pasaran: pasaranInfo,
    totalNeptu: dayInfo.neptu + pasaranInfo.neptu,
    isAfterMaghrib
  };
};

export const formatDateID = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Calculates Javanese/Islamic Date details
 */
export const getJavaneseDate = (date: Date): JavaneseDateInfo => {
  const weton = calculateWeton(date);
  
  // Use Intl.DateTimeFormat to get Islamic Civil date
  // Note: 'islamic-civil' is a common approximation. 
  // For standard Javanese Mataram calendar, there's a slight offset sometimes, but this is the best standard approximation.
  const islamicFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-civil', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Example output: "19 Ramadan 1445"
  const islamicDateStr = islamicFormatter.format(date);
  const parts = islamicDateStr.split(' ');
  
  // Parsing might vary by browser locale implementation, usually [Day, Month, Year] or [Day, Month, "Tahun", Year] in ID
  // Let's rely on formatToParts for safety
  const partsObj = islamicFormatter.formatToParts(date);
  
  const hDay = parseInt(partsObj.find(p => p.type === 'day')?.value || '1');
  const hMonthName = partsObj.find(p => p.type === 'month')?.value || '';
  const hYear = parseInt(partsObj.find(p => p.type === 'year')?.value || '1445');

  // Mapping Islamic Month to Javanese
  const islamicToJavaneseMonth: Record<string, string> = {
    'Muharram': 'Sura',
    'Muharam': 'Sura',
    'Safar': 'Sapar',
    'Rabi’ul-Awal': 'Mulud',
    'Rabiul Awal': 'Mulud',
    'Rabiulawal': 'Mulud',
    'Rabi’ul-Akhir': 'Bakda Mulud',
    'Rabiul Akhir': 'Bakda Mulud',
    'Rabiulakhir': 'Bakda Mulud',
    'Jumadil-Awal': 'Jumadil Awal',
    'Jumadil Awal': 'Jumadil Awal',
    'Jumadil-Akhir': 'Jumadil Akhir',
    'Jumadil Akhir': 'Jumadil Akhir',
    'Rajab': 'Rejeb',
    'Sya’ban': 'Ruwah',
    'Syaban': 'Ruwah',
    'Syakban': 'Ruwah',
    'Ramadan': 'Pasa',
    'Ramadhan': 'Pasa',
    'Syawal': 'Sawal',
    'Zulkaidah': 'Sela', // or Dulkangidah
    'Dzulkaidah': 'Sela',
    'Zulhijah': 'Besar',
    'Dzulhijjah': 'Besar'
  };

  // Find partial match for robustness
  let javaMonth = hMonthName;
  const keys = Object.keys(islamicToJavaneseMonth);
  for (const k of keys) {
     if (hMonthName.includes(k) || k.includes(hMonthName)) {
       javaMonth = islamicToJavaneseMonth[k];
       break;
     }
  }

  // Javanese Year (Sultan Agungan) is roughly Hijri + 512
  const jYear = hYear + 512;

  return {
    gregorianDate: date,
    hijriDay: hDay,
    hijriMonth: hMonthName,
    hijriYear: hYear,
    javaneseDay: hDay, // Day number is typically same/synced with Hijri
    javaneseMonth: javaMonth,
    javaneseYear: jYear,
    weton: weton
  };
};

/**
 * Menghitung kecocokan jodoh berdasarkan metode "Temu Rose" (Dibagi 8).
 */
export const calculateJodoh = (date1: Date, time1: string, date2: Date, time2: string): JodohResult => {
  const weton1 = calculateWeton(date1, time1);
  const weton2 = calculateWeton(date2, time2);

  const total = weton1.totalNeptu + weton2.totalNeptu;
  let remainder = total % 8;
  if (remainder === 0) remainder = 8;

  let category: JodohCategoryName = 'Pegat'; // Default

  switch (remainder) {
    case 1: category = 'Pegat'; break;
    case 2: category = 'Ratu'; break;
    case 3: category = 'Jodoh'; break;
    case 4: category = 'Topo'; break;
    case 5: category = 'Tinari'; break;
    case 6: category = 'Padu'; break;
    case 7: category = 'Sujan'; break;
    case 8: category = 'Pesthi'; break;
  }

  return {
    weton1,
    weton2,
    totalCombinedNeptu: total,
    category,
    remainder
  };
};

/**
 * Calculates Pancasuda prediction for a specific day relative to user's birth weton.
 * Formula: (Neptu User + Neptu Date) % 5
 */
export const calculatePancasuda = (userWeton: WetonResult, targetDate: Date): CalendarDayPrediction => {
  // Target date for calculation usually doesn't have a specific "time", we check the day itself.
  const targetWeton = calculateWeton(targetDate); 
  const totalCombined = userWeton.totalNeptu + targetWeton.totalNeptu;
  
  let remainder = totalCombined % 5;
  if (remainder === 0) remainder = 5;

  let category: PancasudaCategory = 'Pati';
  let isGood = false;

  switch (remainder) {
    case 1: 
      category = 'Sri'; 
      isGood = true; 
      break;
    case 2: 
      category = 'Lungguh'; 
      isGood = true; 
      break;
    case 3: 
      category = 'Gedhong'; 
      isGood = true; 
      break;
    case 4: 
      category = 'Lara'; 
      isGood = false; 
      break;
    case 5: 
      category = 'Pati'; 
      isGood = false; 
      break;
  }

  return {
    date: targetDate,
    weton: targetWeton,
    score: remainder,
    category,
    isGood
  };
};

export const generateMonthCalendar = (userWeton: WetonResult, year: number, month: number): CalendarDayPrediction[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar: CalendarDayPrediction[] = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    calendar.push(calculatePancasuda(userWeton, currentDate));
  }

  return calendar;
};

/**
 * Parses a date string like "10 Mei" or "10 Mei - Senin Pahing" to a Date object.
 */
export const parseIndonesianDateString = (text: string, year: number): Date | null => {
  try {
    const months = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const regex = /(\d+)\s+([a-zA-Z]+)/;
    const match = text.match(regex);

    if (match) {
      const day = parseInt(match[1]);
      const monthName = match[2].toLowerCase();
      const monthIndex = months.findIndex(m => m === monthName);

      if (monthIndex !== -1) {
        return new Date(year, monthIndex, day);
      }
    }
    return null;
  } catch (e) {
    return null;
  }
};

/**
 * Generates a Google Calendar Event URL
 */
export const generateGoogleCalendarUrl = (text: string, currentYear: number, title: string, description: string): string | null => {
  const date = parseIndonesianDateString(text, currentYear);
  if (!date) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');
  
  // Format YYYYMMDD
  const dateString = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  
  // Create all-day event (StartDate / EndDate+1)
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const nextDayString = `${nextDay.getFullYear()}${pad(nextDay.getMonth() + 1)}${pad(nextDay.getDate())}`;

  const details = `${description}\n\nSumber: WetonKu Primbon AI`;
  
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', `[WetonKu] ${title}`);
  url.searchParams.append('dates', `${dateString}/${nextDayString}`);
  url.searchParams.append('details', details);
  url.searchParams.append('sf', 'true');
  url.searchParams.append('output', 'xml');

  return url.toString();
};

/**
 * Calculates daily fortune directions based on Weton.
 */
export const getDailyDirections = (date: Date) => {
  const weton = calculateWeton(date);
  
  // Arah Rejeki based on Pasaran
  let fortuneDirection = '';
  switch (weton.pasaran.name) {
    case 'Legi': fortuneDirection = 'Timur / Utara'; break;
    case 'Pahing': fortuneDirection = 'Selatan'; break;
    case 'Pon': fortuneDirection = 'Barat'; break;
    case 'Wage': fortuneDirection = 'Utara'; break;
    case 'Kliwon': fortuneDirection = 'Timur / Pusat'; break;
    default: fortuneDirection = 'Timur';
  }

  // Arah Nogo Dino (Avoid) based on Day (Dina)
  // Simplified Nogo Dino map
  let avoidDirection = '';
  switch (weton.day.name) {
    case 'Minggu': avoidDirection = 'Timur'; break;
    case 'Senin': avoidDirection = 'Selatan'; break;
    case 'Selasa': avoidDirection = 'Barat'; break;
    case 'Rabu': avoidDirection = 'Utara'; break;
    case 'Kamis': avoidDirection = 'Tenggara'; break;
    case 'Jumat': avoidDirection = 'Timur Laut'; break;
    case 'Sabtu': avoidDirection = 'Barat Laut'; break;
    default: avoidDirection = 'Barat';
  }

  return {
    fortune: fortuneDirection,
    avoid: avoidDirection,
    weton: weton
  };
};