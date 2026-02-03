
export type DayName = 'Minggu' | 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
export type PasaranName = 'Legi' | 'Pahing' | 'Pon' | 'Wage' | 'Kliwon';

export interface DayInfo {
  id: number; // 0 (Sunday) to 6 (Saturday)
  name: DayName;
  neptu: number;
}

export interface PasaranInfo {
  id: number;
  name: PasaranName;
  neptu: number;
}

export interface WetonResult {
  date: Date;
  day: DayInfo;
  pasaran: PasaranInfo;
  totalNeptu: number;
  isAfterMaghrib?: boolean; // Flag to indicate if date was shifted
}

export interface JavaneseDateInfo {
  gregorianDate: Date;
  hijriDay: number;
  hijriMonth: string; // Arabic name
  hijriYear: number;
  javaneseDay: number;
  javaneseMonth: string; // Javanese name (Sura, Sapar...)
  javaneseYear: number; // Hijri + 512
  weton: WetonResult;
}

export interface WetonAnalysis {
  personality: string;    // Sifat kepribadian
  thinkingStyle: string;  // Cara berpikir & bersikap
  talents: string;        // Bakat alami
  fortune: string;        // Cara rezeki datang
  taboos: string;         // Pantangan
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  result: WetonResult;
}

// Jodoh Types
export type JodohCategoryName = 'Pegat' | 'Ratu' | 'Jodoh' | 'Topo' | 'Tinari' | 'Padu' | 'Sujan' | 'Pesthi';

export interface JodohResult {
  weton1: WetonResult;
  weton2: WetonResult;
  totalCombinedNeptu: number;
  category: JodohCategoryName;
  remainder: number; // 1-8
}

export interface JodohAnalysis {
  meaning: string;    // Penjelasan makna kategori (e.g., arti "Ratu")
  advice: string;     // Saran menyikapi hubungan
  compatibilityScore: number; // 1-100 score estimation
}

export interface WeddingDateDetail {
  date: string;       // "12 Oktober 2024"
  dayName: string;    // "Sabtu Legi"
  reason: string;     // "Jatuh pada hitungan Sri (Rezeki)" atau "Tali Wangke"
  impact?: string;    // Akibat jika dilanggar (Khusus bad dates)
}

export interface WeddingRecommendation {
  nearestGoodDate: WeddingDateDetail; // Tanggal baik terdekat
  goodDates: WeddingDateDetail[]; // List tanggal baik lainnya
  avoidDates: WeddingDateDetail[]; // List pantangan
  generalAdvice: string;   // Nasihat umum
}

// Hari Baik Types
export type PancasudaCategory = 'Sri' | 'Lungguh' | 'Gedhong' | 'Lara' | 'Pati';

export interface CalendarDayPrediction {
  date: Date;
  weton: WetonResult;
  score: number; // (Neptu User + Neptu Day) % 5
  category: PancasudaCategory;
  isGood: boolean;
}

export interface HariBaikRecommendation {
  marriage: string[]; // List of dates/descriptions
  business: string[];
  moving: string[];
  work: string[];
  avoid: string[]; // General days to avoid
}

// Rejeki Types
export interface RejekiAnalysis {
  fortunePattern: string; // Pola rejeki (cepat/lambat/stabil)
  suitableCareers: string[]; // Jenis usaha/pekerjaan yang cocok
  wealthMaintenance: string; // Cara menjaga kelancaran rejeki (falsafah)
}

// Aura & Energi Types
export interface AuraAnalysis {
  auraProfile: string; // Deskripsi aura (misal: "Seperti Air yang Tenang")
  luckTendency: string; // Kecenderungan keberuntungan
  spiritualAdvice: string; // Saran laku tirakat ringan / etika hidup
  element: string; // Elemen dominan (misal: Api, Air, Angin, Tanah)
}

// New: User Profile & Daily Insight
export interface UserProfile {
  name: string;
  birthDate: string; // ISO String
  birthTime?: string; // HH:mm String (Optional)
}

export interface DailyInsight {
  date: string; // YYYY-MM-DD
  quote: string; // Falsafah Jawa
  advice: string; // Saran sikap hari ini
  luckMeter: number; // 1-10
}