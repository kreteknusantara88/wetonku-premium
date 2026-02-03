import React, { useState, useEffect } from 'react';
import { getJavaneseDate, formatDateID } from '../utils/javaneseCalc';
import { JavaneseDateInfo } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Moon, Sun, Info, CheckCircle2, Star } from 'lucide-react';

interface KalenderViewProps {
  language?: 'id' | 'jv';
}

export const KalenderView: React.FC<KalenderViewProps> = ({ language = 'id' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarGrid, setCalendarGrid] = useState<(JavaneseDateInfo | null)[]>([]);
  const [selectedDay, setSelectedDay] = useState<JavaneseDateInfo | null>(null);

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  // Set selected day to today if it's in the current view and nothing is selected yet
  useEffect(() => {
      const today = new Date();
      if (today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
          const todayInfo = getJavaneseDate(today);
          setSelectedDay(todayInfo);
      }
  }, [currentDate]);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)

    const grid: (JavaneseDateInfo | null)[] = [];

    // Fill empty slots for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      grid.push(null);
    }

    // Fill days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      grid.push(getJavaneseDate(d));
    }

    setCalendarGrid(grid);
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1);
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const getPasaranColor = (name: string) => {
    switch (name) {
      case 'Legi': return 'bg-white border-stone-200 text-stone-700'; 
      case 'Pahing': return 'bg-red-50 border-red-200 text-red-700'; 
      case 'Pon': return 'bg-amber-50 border-amber-200 text-amber-700'; 
      case 'Wage': return 'bg-stone-800 border-stone-900 text-stone-200'; 
      case 'Kliwon': return 'bg-purple-50 border-purple-200 text-purple-700'; 
      default: return 'bg-white text-stone-700';
    }
  };

  const today = new Date();
  const isToday = (d: Date) => d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  const isSelected = (d: Date) => selectedDay && d.getDate() === selectedDay.gregorianDate.getDate() && d.getMonth() === selectedDay.gregorianDate.getMonth() && d.getFullYear() === selectedDay.gregorianDate.getFullYear();

  // Helper to extract range of Javanese/Hijri months in current grid
  const validDays = calendarGrid.filter(d => d !== null) as JavaneseDateInfo[];
  const firstDay = validDays.length > 0 ? validDays[0] : null;
  const lastDay = validDays.length > 0 ? validDays[validDays.length - 1] : null;

  // Construct Label logic
  const getMonthRangeLabel = (start: string, end: string, year: number) => {
      if (start === end) return `${start} ${year}`;
      return `${start} - ${end} ${year}`;
  };

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-teal-800 mb-4">
          Kalender <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">Jawa & Hijriah</span>
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
             ? "Tanggap warsa jangkep kanthi petungan Jawi (Saka), Hijriah, lan Masehi."
             : "Penanggalan lengkap mencakup Masehi, Jawa (Sultan Agungan/Saka), dan Hijriah beserta hari pasaran."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Calendar Grid Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-white/50 overflow-hidden relative z-10">
            {/* Header Controls - Redesigned for maximum visibility */}
            <div className="flex items-center justify-between p-4 md:p-6 bg-teal-50/50 border-b border-teal-100">
                <button onClick={() => changeMonth(-1)} className="p-2 md:p-3 hover:bg-white text-teal-700 rounded-full transition-colors shadow-sm bg-white/50">
                    <ChevronLeft />
                </button>
                
                <div className="flex-grow text-center px-2">
                    {/* Masehi Main */}
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-teal-900 leading-tight mb-2">
                        {new Intl.DateTimeFormat(language === 'jv' ? 'jv-ID' : 'id-ID', { month: 'long', year: 'numeric' }).format(currentDate)}
                    </h2>
                    
                    {/* Sub-details (Javanese & Hijri) - Vertical Stack for Mobile Safety */}
                    {firstDay && lastDay && (
                        <div className="flex flex-col gap-1.5 justify-center items-center w-full">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/50 rounded-full border border-teal-200/50">
                                <span className="text-[10px] md:text-xs font-bold text-teal-800 uppercase tracking-wider">Jawa</span>
                                <span className="text-xs md:text-sm font-medium text-teal-700">
                                    {getMonthRangeLabel(firstDay.javaneseMonth, lastDay.javaneseMonth, lastDay.javaneseYear)}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/40 rounded-full border border-amber-200/40">
                                <span className="text-[10px] md:text-xs font-bold text-amber-800 uppercase tracking-wider">Hijriah</span>
                                <span className="text-xs md:text-sm font-medium text-amber-700">
                                    {getMonthRangeLabel(firstDay.hijriMonth, lastDay.hijriMonth, lastDay.hijriYear)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <button onClick={() => changeMonth(1)} className="p-2 md:p-3 hover:bg-white text-teal-700 rounded-full transition-colors shadow-sm bg-white/50">
                    <ChevronRight />
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center bg-white border-b border-stone-100">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                <div key={i} className={`py-3 font-bold text-xs uppercase tracking-wider ${i === 0 ? 'text-red-500' : 'text-stone-600'}`}>
                    {d}
                </div>
            ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-stone-100 gap-px border-b border-stone-100">
            {calendarGrid.map((dayInfo, idx) => {
                const isActive = dayInfo && isSelected(dayInfo.gregorianDate);
                const isCurrentDay = dayInfo && isToday(dayInfo.gregorianDate);

                return (
                    <div 
                    key={idx} 
                    onClick={() => dayInfo && setSelectedDay(dayInfo)}
                    className={`
                        min-h-[90px] md:min-h-[120px] p-1.5 md:p-2 relative flex flex-col justify-between cursor-pointer transition-all duration-300
                        ${!dayInfo ? 'bg-stone-50/50 cursor-default' : 'bg-white hover:bg-teal-50/30'}
                        ${isActive ? '!bg-teal-50 ring-2 ring-teal-700 z-10 shadow-xl scale-[1.02]' : ''}
                        ${isCurrentDay ? '!bg-amber-50 ring-2 ring-inset ring-amber-400 z-20 shadow-lg' : ''}
                    `}
                    >
                    {dayInfo && (
                        <>
                        {/* Top: Gregorian Date */}
                        <div className="flex justify-between items-start">
                             <span className={`text-base md:text-2xl font-bold font-serif leading-none ${dayInfo.weton.day.id === 0 ? 'text-red-500' : 'text-stone-700'}`}>
                                {dayInfo.gregorianDate.getDate()}
                            </span>
                            {/* Indicators */}
                             <div className="flex flex-col gap-1 items-end">
                                {isCurrentDay && (
                                    <span className="text-[8px] md:text-[9px] font-bold text-amber-700 bg-amber-100 px-1 md:px-1.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
                                        <Star size={6} fill="currentColor" /> <span className="hidden md:inline">Hari Ini</span>
                                    </span>
                                )}
                             </div>
                        </div>
    
                        {/* Bottom: Info */}
                        <div className="mt-auto space-y-0.5 md:space-y-1">
                            <div className="flex justify-between items-end px-0.5">
                                <span className="text-[8px] md:text-[10px] text-stone-600 font-medium">{dayInfo.hijriDay}</span>
                                <span className="text-[8px] md:text-[10px] text-stone-600 font-medium">{dayInfo.javaneseDay}</span>
                            </div>
                            
                            <div className={`
                                text-[8px] md:text-[10px] font-bold uppercase text-center py-0.5 md:py-1 rounded border shadow-sm truncate
                                ${getPasaranColor(dayInfo.weton.pasaran.name)}
                            `}>
                                {dayInfo.weton.pasaran.name}
                            </div>
                        </div>
                        </>
                    )}
                    </div>
                );
            })}
            </div>
            
            {/* Footer / Legend */}
            <div className="p-4 bg-stone-50 text-[10px] text-stone-700 flex flex-wrap gap-4 justify-center items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> Hari Ini
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> Tanggal Dipilih
                </div>
            </div>
        </div>

        {/* Details Side Panel */}
        <div className="lg:col-span-1">
             {selectedDay ? (
                 <div className="bg-white rounded-3xl shadow-xl border border-white/50 p-6 sticky top-24 animate-fade-in-up">
                      <div className="text-center mb-6 pb-6 border-b border-stone-100">
                          <h3 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-2">Detail Tanggal</h3>
                          <div className="text-5xl font-serif font-bold text-teal-900 mb-2">
                              {selectedDay.gregorianDate.getDate()}
                          </div>
                          <div className="text-lg text-teal-700 font-medium">
                              {new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', weekday: 'long' }).format(selectedDay.gregorianDate)}
                          </div>
                      </div>

                      <div className="space-y-4">
                          {/* Weton Info - Highlighted */}
                          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100 shadow-sm">
                               <div className="flex items-center gap-2 mb-3">
                                   <div className="w-8 h-8 rounded-full bg-white text-teal-600 flex items-center justify-center shadow-sm">
                                        <CalendarIcon size={16} />
                                   </div>
                                   <span className="font-bold text-teal-900 text-sm uppercase">Weton Jawa</span>
                               </div>
                               <div className="text-center py-2 bg-white/60 rounded-xl border border-teal-200/50">
                                   <div className="text-2xl font-serif font-bold text-teal-900">
                                       {selectedDay.weton.day.name} {selectedDay.weton.pasaran.name}
                                   </div>
                                   <div className="text-sm text-teal-700 mt-1 font-medium bg-teal-100/50 inline-block px-3 py-1 rounded-full">
                                       Neptu: {selectedDay.weton.totalNeptu} ({selectedDay.weton.day.neptu} + {selectedDay.weton.pasaran.neptu})
                                   </div>
                               </div>
                          </div>

                          {/* Javanese Info */}
                          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 hover:bg-stone-100 transition-colors">
                               <div className="flex items-center gap-2 mb-2">
                                   <Moon size={16} className="text-stone-600" />
                                   <span className="font-bold text-stone-800 text-sm uppercase">Penanggalan Jawa</span>
                               </div>
                               <div className="flex justify-between items-center text-sm px-2">
                                   <span className="text-stone-600">Bulan/Tahun</span>
                                   <span className="font-bold text-stone-800">{selectedDay.javaneseDay} {selectedDay.javaneseMonth} {selectedDay.javaneseYear}</span>
                               </div>
                          </div>

                           {/* Hijri Info */}
                           <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 hover:bg-stone-100 transition-colors">
                               <div className="flex items-center gap-2 mb-2">
                                   <Moon size={16} className="text-stone-600" />
                                   <span className="font-bold text-stone-800 text-sm uppercase">Penanggalan Hijriah</span>
                               </div>
                               <div className="flex justify-between items-center text-sm px-2">
                                   <span className="text-stone-600">Bulan/Tahun</span>
                                   <span className="font-bold text-stone-800">{selectedDay.hijriDay} {selectedDay.hijriMonth} {selectedDay.hijriYear}</span>
                               </div>
                          </div>
                      </div>
                 </div>
             ) : (
                 <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 text-center h-full flex flex-col items-center justify-center opacity-70">
                     <Info size={48} className="text-stone-300 mb-4" />
                     <p className="text-stone-600 font-medium">Pilih tanggal di kalender untuk melihat detail lengkap.</p>
                 </div>
             )}
        </div>

      </div>
    </div>
  );
};