import React, { useState, useEffect } from 'react';
import { calculateWeton, generateMonthCalendar, formatDateID, generateGoogleCalendarUrl, calculatePancasuda } from '../utils/javaneseCalc';
import { getHariBaikRecommendations } from '../services/geminiService';
import { WetonResult, CalendarDayPrediction, HariBaikRecommendation } from '../types';
import { Calendar, ChevronLeft, ChevronRight, Briefcase, Home, Heart, AlertTriangle, Sparkles, User, CheckCircle2, XCircle, BellPlus, CalendarCheck, BookOpen, Clock, Trash2 } from 'lucide-react';

interface HariBaikViewProps {
  language?: 'id' | 'jv';
}

export const HariBaikView: React.FC<HariBaikViewProps> = ({ language = 'id' }) => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); // For month navigation
  const [weton, setWeton] = useState<WetonResult | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarDayPrediction[]>([]);
  const [recommendations, setRecommendations] = useState<HariBaikRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState<CalendarDayPrediction | null>(null);
  
  // State for manual check
  const [manualCheckDate, setManualCheckDate] = useState('');
  const [manualCheckResult, setManualCheckResult] = useState<CalendarDayPrediction | null>(null);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('last_haribaik');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.weton) {
          setWeton(parsed.weton);
          // Regenerate calendar based on saved weton and current selected date
          generateCalendarData(parsed.weton, selectedDate);
        }
        if (parsed.recommendations) setRecommendations(parsed.recommendations);
      } catch (e) {
        console.error("Failed to load haribaik state", e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (weton) {
      localStorage.setItem('last_haribaik', JSON.stringify({ weton, recommendations }));
    }
  }, [weton, recommendations]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;
    
    const w = calculateWeton(new Date(birthDate), birthTime);
    setWeton(w);
    generateCalendarData(w, selectedDate);
    setRecommendations(null); // Reset AI recommendations when weton changes
    setManualCheckResult(null); // Reset manual check
  };

  const handleReset = () => {
    setWeton(null);
    setRecommendations(null);
    setManualCheckResult(null);
    setBirthDate('');
    setBirthTime('');
    localStorage.removeItem('last_haribaik');
  };

  const generateCalendarData = (userWeton: WetonResult, date: Date) => {
    const data = generateMonthCalendar(userWeton, date.getFullYear(), date.getMonth());
    setCalendarData(data);
  };

  useEffect(() => {
    if (weton) {
      generateCalendarData(weton, selectedDate);
    }
  }, [selectedDate, weton]);

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + delta, 1);
    setSelectedDate(newDate);
  };

  const fetchRecommendations = async () => {
    if (!weton) return;
    setIsLoading(true);
    const recs = await getHariBaikRecommendations(weton, selectedDate.getMonth(), selectedDate.getFullYear(), language as 'id' | 'jv');
    setRecommendations(recs);
    setIsLoading(false);
  };

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCheckDate || !weton) return;
    
    const date = new Date(manualCheckDate);
    const result = calculatePancasuda(weton, date);
    setManualCheckResult(result);
  };

  const openCalendar = (dateText: string, title: string, desc: string) => {
    const url = generateGoogleCalendarUrl(dateText, selectedDate.getFullYear(), title, desc);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Format tanggal tidak dikenali sistem kalender otomatis.");
    }
  };

  const getPancasudaColor = (category: string) => {
    switch (category) {
      case 'Sri': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Lungguh': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Gedhong': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Lara': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Pati': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-stone-100 text-stone-500';
    }
  };
  
  const getPancasudaLabel = (category: string) => {
     switch (category) {
      case 'Sri': return 'Rezeki Melimpah';
      case 'Lungguh': return 'Dihormati';
      case 'Gedhong': return 'Kekayaan';
      case 'Lara': return 'Sakit / Halangan';
      case 'Pati': return 'Bahaya / Gagal';
      default: return '';
    }
  };

  const pancasudaDefinitions = [
    { key: 'Sri', title: 'Sri (Rezeki)', desc: 'Simbol kemakmuran. Hari yang subur dan mudah untuk mencari nafkah, bertani, atau urusan pangan.', color: 'bg-emerald-50 text-emerald-800 border-emerald-100' },
    { key: 'Lungguh', title: 'Lungguh (Derajat)', desc: 'Simbol kedudukan. Hari yang baik untuk urusan karir, naik jabatan, dan mendapatkan kehormatan sosial.', color: 'bg-blue-50 text-blue-800 border-blue-100' },
    { key: 'Gedhong', title: 'Gedhong (Harta)', desc: 'Simbol kekayaan materi. Bermakna potensi kemapanan ekonomi, menyimpan uang, atau membeli aset berharga.', color: 'bg-amber-50 text-amber-800 border-amber-100' },
    { key: 'Lara', title: 'Lara (Rintangan)', desc: 'Simbol kesakitan. Ada potensi gangguan kesehatan, kelelahan fisik, atau pikiran yang sedang kacau.', color: 'bg-orange-50 text-orange-800 border-orange-100' },
    { key: 'Pati', title: 'Pati (Ujung/Buntu)', desc: 'Simbol akhir atau kematian (rezeki mati). Energi cenderung surut, sebaiknya hindari memulai hal besar.', color: 'bg-red-50 text-red-800 border-red-100' },
  ];

  const RecommendationItem: React.FC<{ text: string; type: 'marriage' | 'business' | 'moving' | 'avoid' }> = ({ text, type }) => {
    let icon = <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />;
    let title = "";
    let desc = "";

    if (type === 'marriage') {
      title = "Rencana Pernikahan";
      desc = `Hitungan Primbon: Hari ini memiliki energi baik untuk akad/hajatan (${text}).`;
    } else if (type === 'business') {
      icon = <CheckCircle2 size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />;
      title = "Rencana Usaha";
      desc = `Hitungan Primbon: Hari ini baik untuk memulai langkah bisnis (${text}).`;
    } else if (type === 'moving') {
      icon = <CheckCircle2 size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />;
      title = "Rencana Pindah";
      desc = `Hitungan Primbon: Hari ini selaras untuk menempati tempat baru (${text}).`;
    } else if (type === 'avoid') {
      icon = <XCircle size={14} className="mt-0.5 flex-shrink-0 text-red-500" />;
      title = "Kurang Baik";
      desc = `Peringatan: Sebaiknya tunda kegiatan besar pada hari ini (${text}).`;
    }

    return (
      <li className="text-sm text-stone-600 flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors group">
        <div className="flex items-start gap-2">
          {icon}
          <span>{text}</span>
        </div>
        {type !== 'avoid' && (
          <button
            onClick={() => openCalendar(text, title, desc)}
            className="text-stone-400 hover:text-java-accent transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 p-1"
            title="Buat Pengingat di Google Calendar"
          >
            <BellPlus size={16} />
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="animate-fade-in-up pb-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-java-dark mb-4">
          Keselarasan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Waktu</span>
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
             ? "Ngrancang hajat kanthi kesadaran, nyelarasaken aktivitas kaliyan irama alam lan wektu."
             : "Merencanakan hajat dengan kesadaran penuh (mindfulness), menyelaraskan aktivitas dengan irama alam dan waktu."
          }
        </p>
      </div>

      {/* Input Section */}
      {!weton ? (
         <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-8 border border-white">
           <form onSubmit={handleCalculate} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-java-brown uppercase tracking-wider flex items-center gap-2">
                   <User size={16} className="text-java-brown" />
                   {language === 'jv' ? 'Tanggal Wiyosan Panjenengan' : 'Tanggal Lahir Anda'}
                 </label>
                 <div className="flex gap-2">
                   <input
                     type="date"
                     required
                     value={birthDate}
                     onChange={(e) => setBirthDate(e.target.value)}
                     className="flex-grow p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none transition-all w-full text-stone-800"
                   />
                   <input
                     type="time"
                     value={birthTime}
                     onChange={(e) => setBirthTime(e.target.value)}
                     className="w-24 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none transition-all text-stone-800"
                     title="Jam Lahir (Opsional)"
                   />
                 </div>
                 <p className="text-[10px] text-stone-500 italic mt-1 font-medium">*Lahir setelah 18:00 (Maghrib) dihitung hari berikutnya.</p>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-java-dark text-java-gold font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Tampilkan Kalender
              </button>
           </form>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Column */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Calendar Header */}
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
                   <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                      <ChevronLeft />
                   </button>
                   <h2 className="font-serif font-bold text-xl text-java-dark">
                      {new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(selectedDate)}
                   </h2>
                   <button onClick={() => changeMonth(1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                      <ChevronRight />
                   </button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center text-[10px] md:text-xs">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">Sri (Rezeki)</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full border border-blue-200">Lungguh (Kehormatan)</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-200">Gedhong (Kecukupan)</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full border border-orange-200">Lara (Rintangan)</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full border border-red-200">Pati (Ujung/Akhir)</span>
                </div>

                {/* Calendar Grid */}
                <div className="bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden p-4 md:p-6">
                   <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d, i) => (
                          <div key={i} className={`text-xs font-bold uppercase py-2 ${i === 0 ? 'text-red-500' : 'text-stone-400'}`}>{d}</div>
                      ))}
                   </div>
                   
                   <div className="grid grid-cols-7 gap-1 md:gap-2">
                      {/* Empty slots for start of month */}
                      {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }).map((_, i) => (
                          <div key={`empty-${i}`} className="aspect-square"></div>
                      ))}

                      {/* Days */}
                      {calendarData.map((day) => (
                          <button
                             key={day.date.toISOString()}
                             onClick={() => setSelectedDayDetail(day)}
                             className={`
                                relative aspect-square rounded-xl border flex flex-col items-center justify-center transition-all duration-200 group
                                ${getPancasudaColor(day.category)}
                                ${selectedDayDetail?.date.toISOString() === day.date.toISOString() ? 'ring-2 ring-java-dark scale-105 z-10' : 'hover:scale-105 hover:shadow-md'}
                             `}
                          >
                             <span className="text-sm md:text-lg font-bold">{day.date.getDate()}</span>
                             <span className="text-[8px] md:text-[10px] font-medium opacity-70 hidden md:block">{day.category}</span>
                             {/* Dot indicator for small screens */}
                             <div className={`md:hidden w-1.5 h-1.5 rounded-full mt-1 ${day.isGood ? 'bg-current' : 'bg-current opacity-50'}`}></div>
                          </button>
                      ))}
                   </div>
                </div>

                {/* Selected Day Detail */}
                {selectedDayDetail && (
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-md animate-fade-in-up">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Detail Tanggal</p>
                                <h3 className="text-2xl font-serif font-bold text-java-dark">
                                    {formatDateID(selectedDayDetail.date)}
                                </h3>
                                <p className="text-stone-600 mt-1">
                                    {selectedDayDetail.weton.day.name} {selectedDayDetail.weton.day.neptu} + {selectedDayDetail.weton.pasaran.name} {selectedDayDetail.weton.pasaran.neptu}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-center border ${getPancasudaColor(selectedDayDetail.category)}`}>
                                <div className="text-xl font-bold">{selectedDayDetail.category}</div>
                                <div className="text-[10px] uppercase font-bold opacity-75">{getPancasudaLabel(selectedDayDetail.category)}</div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-100 flex gap-4 text-sm text-stone-500">
                             <div>
                                 <span className="block text-xs font-bold text-stone-400 uppercase">Neptu Anda</span>
                                 <span className="font-mono">{weton.totalNeptu}</span>
                             </div>
                             <div>+</div>
                             <div>
                                 <span className="block text-xs font-bold text-stone-400 uppercase">Neptu Hari</span>
                                 <span className="font-mono">{selectedDayDetail.weton.totalNeptu}</span>
                             </div>
                             <div>=</div>
                             <div>
                                 <span className="block text-xs font-bold text-stone-400 uppercase">Total</span>
                                 <span className="font-mono">{weton.totalNeptu + selectedDayDetail.weton.totalNeptu}</span>
                             </div>
                             <div className="ml-auto">
                                 <span className="block text-xs font-bold text-stone-400 uppercase">Sisa Bagi 5</span>
                                 <span className="font-mono font-bold text-java-dark">{selectedDayDetail.score}</span>
                             </div>
                        </div>
                        
                        {selectedDayDetail.isGood && (
                           <div className="mt-4 pt-4 border-t border-stone-100">
                              <button 
                                onClick={() => openCalendar(formatDateID(selectedDayDetail.date), `Hari Baik: ${selectedDayDetail.category}`, `Hari ini jatuh pada hitungan ${selectedDayDetail.category} (Sisa ${selectedDayDetail.score}).`)}
                                className="w-full py-2 bg-stone-50 hover:bg-stone-100 text-stone-600 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                              >
                                <BellPlus size={16} />
                                <span>Tandai di Kalender</span>
                              </button>
                           </div>
                        )}
                    </div>
                )}

                {/* Kamus Pancasuda Section (New) */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mt-6">
                    <h3 className="font-serif font-bold text-lg text-java-dark mb-4 flex items-center gap-2">
                        <BookOpen size={20} className="text-stone-400" />
                        Kamus Istilah Pancasuda
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pancasudaDefinitions.map((def) => (
                            <div key={def.key} className={`p-4 rounded-xl border ${def.color}`}>
                                <div className="font-bold text-sm uppercase tracking-wide mb-1 flex items-center gap-2">
                                  {def.title}
                                </div>
                                <p className="text-xs opacity-90 leading-relaxed font-medium">
                                  {def.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar / AI Recommendations */}
            <div className="space-y-6">
                
                {/* User Info Card */}
                <div className="bg-java-dark text-java-cream p-6 rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <User size={64} />
                    </div>
                    <p className="text-xs font-bold text-java-gold uppercase tracking-widest mb-2">Weton Anda</p>
                    <h3 className="text-2xl font-serif font-bold mb-1">{weton.day.name} {weton.pasaran.name}</h3>
                    <p className="opacity-80">Neptu: {weton.totalNeptu}</p>
                    {weton.isAfterMaghrib && <p className="text-[10px] text-java-gold opacity-80 mt-1 italic">*Dihitung hari berikutnya (Lahir malam)</p>}
                    <button 
                       onClick={handleReset}
                       className="mt-4 text-xs underline opacity-60 hover:opacity-100"
                    >
                        Ganti Tanggal Lahir
                    </button>
                </div>

                {/* Recommendations Button / View */}
                {!recommendations ? (
                    <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm text-center">
                        <Sparkles size={32} className="mx-auto text-java-gold mb-3" />
                        <h3 className="font-bold text-stone-700 mb-2">Rekomendasi Waktu</h3>
                        <p className="text-sm text-stone-500 mb-4">
                            Minta Primbon AI membantu memilih tanggal yang paling selaras untuk hajat Anda.
                        </p>
                        <button
                            onClick={fetchRecommendations}
                            disabled={isLoading}
                            className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-stone-400 border-t-transparent rounded-full"></div>
                            ) : (
                                <>
                                    <Calendar size={16} />
                                    <span>Cari Rekomendasi</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center justify-between px-1">
                          <h3 className="font-serif font-bold text-lg text-java-dark">Rekomendasi {new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(selectedDate)}</h3>
                          <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-full">Ketuk Lonceng</span>
                        </div>
                        
                        {/* Marriage */}
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3 text-pink-600">
                                <Heart size={18} />
                                <span className="font-bold text-sm uppercase tracking-wide">Acara Keluarga</span>
                            </div>
                            <ul className="space-y-1">
                                {recommendations.marriage.map((date, idx) => (
                                    <RecommendationItem key={idx} text={date} type="marriage" />
                                ))}
                            </ul>
                        </div>

                        {/* Business */}
                        <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3 text-blue-600">
                                <Briefcase size={18} />
                                <span className="font-bold text-sm uppercase tracking-wide">Usaha & Karir</span>
                            </div>
                            <ul className="space-y-1">
                                {recommendations.business.map((date, idx) => (
                                  <RecommendationItem key={idx} text={date} type="business" />
                                ))}
                            </ul>
                        </div>

                         {/* Moving */}
                         <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3 text-amber-600">
                                <Home size={18} />
                                <span className="font-bold text-sm uppercase tracking-wide">Pindah Rumah</span>
                            </div>
                            <ul className="space-y-1">
                                {recommendations.moving.map((date, idx) => (
                                  <RecommendationItem key={idx} text={date} type="moving" />
                                ))}
                            </ul>
                        </div>

                        {/* Avoid */}
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-inner">
                            <div className="flex items-center gap-2 mb-3 text-red-600">
                                <AlertTriangle size={18} />
                                <span className="font-bold text-sm uppercase tracking-wide">Kurang Baik</span>
                            </div>
                            <ul className="space-y-1">
                                {recommendations.avoid.map((date, idx) => (
                                  <RecommendationItem key={idx} text={date} type="avoid" />
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                
                {/* Manual Date Check Section */}
                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm mt-6">
                    <h3 className="font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <CalendarCheck size={18} className="text-java-brown" />
                        Cek Tanggal Khusus
                    </h3>
                    <p className="text-xs text-stone-500 mb-4 leading-relaxed font-medium">
                        Punya rencana di tanggal tertentu? Cek keselarasan energinya di sini.
                    </p>
                    
                    <form onSubmit={handleManualCheck} className="space-y-3">
                         <div className="space-y-1">
                           <label className="text-xs font-bold text-java-brown uppercase tracking-wide">Pilih Tanggal</label>
                           <input 
                              type="date"
                              required
                              value={manualCheckDate}
                              onChange={(e) => setManualCheckDate(e.target.value)}
                              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-1 focus:ring-java-gold outline-none text-sm"
                           />
                         </div>
                         <button
                           type="submit"
                           className="w-full py-3 bg-java-brown hover:bg-java-dark text-white font-bold rounded-xl transition-colors text-sm"
                         >
                           Hitung Keselarasan
                         </button>
                    </form>

                    {/* Manual Check Result */}
                    {manualCheckResult && (
                       <div className={`mt-4 p-4 rounded-xl border animate-fade-in-up ${getPancasudaColor(manualCheckResult.category)}`}>
                           <div className="text-xs font-bold opacity-60 uppercase mb-1">{formatDateID(manualCheckResult.date)}</div>
                           <div className="flex justify-between items-end">
                              <div>
                                 <div className="font-serif font-bold text-lg leading-tight">{manualCheckResult.category}</div>
                                 <div className="text-xs font-medium">{getPancasudaLabel(manualCheckResult.category)}</div>
                              </div>
                              <div className="text-right">
                                  <div className="text-[10px] uppercase font-bold opacity-60">Sisa</div>
                                  <div className="font-mono font-bold text-xl">{manualCheckResult.score}</div>
                              </div>
                           </div>
                           <div className="mt-2 text-[10px] opacity-75 pt-2 border-t border-current border-opacity-20">
                               {manualCheckResult.weton.day.name} {manualCheckResult.weton.pasaran.name} (Neptu {manualCheckResult.weton.totalNeptu})
                           </div>
                       </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};