import { DayInfo, PasaranInfo } from './types';

export const DAYS: DayInfo[] = [
  { id: 0, name: 'Minggu', neptu: 5 },
  { id: 1, name: 'Senin', neptu: 4 },
  { id: 2, name: 'Selasa', neptu: 3 },
  { id: 3, name: 'Rabu', neptu: 7 },
  { id: 4, name: 'Kamis', neptu: 8 },
  { id: 5, name: 'Jumat', neptu: 6 },
  { id: 6, name: 'Sabtu', neptu: 9 },
];

// Pasaran cycle order: Legi, Pahing, Pon, Wage, Kliwon
export const PASARANS: PasaranInfo[] = [
  { id: 0, name: 'Legi', neptu: 5 },
  { id: 1, name: 'Pahing', neptu: 9 },
  { id: 2, name: 'Pon', neptu: 7 },
  { id: 3, name: 'Wage', neptu: 4 },
  { id: 4, name: 'Kliwon', neptu: 8 },
];
