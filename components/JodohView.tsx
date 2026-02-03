import React, { useState, useEffect } from 'react';
import { calculateJodoh, formatDateID, generateGoogleCalendarUrl } from '../utils/javaneseCalc';
import { getJodohInterpretation, getWeddingDateRecommendations } from '../services/geminiService';
import { JodohResult, JodohAnalysis, WeddingRecommendation } from '../types';
import { HeartHandshake, Search, Heart, User, Sparkles, Scale, Info, CalendarHeart, AlertOctagon, CheckCircle2, BellPlus, Calendar, ShieldAlert, BadgeCheck, Clock, Trash2, BookOpen } from 'lucide-react';

interface JodohViewProps {
  language?: 'id' | 'jv';
}

export const JodohView: React.FC<JodohViewProps> = ({ language = 'id' }) => {
  const [date1, setDate1] = useState('');
  const [time1, setTime1] = useState('');
  const [date2, setDate2] = useState('');
  const [time2, setTime2] = useState('');
  
  const [result, setResult] = useState<JodohResult | null>(null);
  const [analysis, setAnalysis] = useState<JodohAnalysis | null>(null);
  const [weddingRecs, setWeddingRecs] = useState<WeddingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeddingLoading, setIsWeddingLoading] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem('last_jodoh');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.result) setResult(parsed.result);
        if (parsed.analysis) setAnalysis(parsed.analysis);
      } catch (e) {
        console.error("Failed to load jodoh state", e);
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (result) {
      localStorage.setItem('last_jodoh', JSON.stringify({ result, analysis }));
    }
  }, [result, analysis]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date1 || !date2) return;
    
    setAnalysis(null);
    setWeddingRecs(null);
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const calcResult = calculateJodoh(d1, time1, d2, time2);
    setResult(calcResult);
    
    // Auto scroll to result
    setTimeout(() => {
        const element = document.getElementById('jodoh-result');
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setAnalysis(null);
    setWeddingRecs(null);
    setDate1('');
    setDate2('');
    setTime1('');
    setTime2('');
    localStorage.removeItem('last_jodoh');
  };

  const handleInterpret = async () => {
    if (!result) return;
    setIsLoading(true);
    const aiData = await getJodohInterpretation(result, language as 'id' | 'jv');
    setAnalysis(aiData);
    setIsLoading(false);
  };

  const handleWeddingRecommendations = async () => {
    if (!result) return;
    setIsWeddingLoading(true);
    const aiData = await getWeddingDateRecommendations(result.weton1, result.weton2, language as 'id' | 'jv');
    setWeddingRecs(aiData);
    setIsWeddingLoading(false);
    
    setTimeout(() => {
      const element = document.getElementById('wedding-recs');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const openCalendar = (dateText: string, description: string) => {
    const currentYear = new Date().getFullYear();
    const url = generateGoogleCalendarUrl(
      dateText, 
      currentYear, 
      "Rencana Pernikahan (Hari Baik)", 
      `${description}\n\nDipilih berdasarkan perhitungan Primbon WetonKu.`
    );
    if (url) {
      window.open(url, '_blank');
    } else {
      alert("Format tanggal kompleks, silakan set manual di kalender.");
    }
  };

  // Helper to get traditional nuances specifically for Ratu, Jodoh, Topo
  const getJodohNuance = (category: string) => {
    switch (category) {
      case 'Ratu':
        return {
          meaning: "Layaknya Raja & Ratu (Dihormati)",
          desc: "Pasangan ini ditakdirkan sangat harmonis, berkharisma, dan disegani oleh lingkungan. Biasanya memiliki kedudukan sosial atau ekonomi yang kuat dan membuat orang lain iri.",
          bg: "bg-blue-50 border-blue-100 text-blue-800"
        };
      case 'Jodoh':
        return {
          meaning: "Suratan Takdir (Saling Melengkapi)",
          desc: "Memiliki ikatan batin yang sangat kuat. Meskipun ada pertengkaran kecil, mereka mudah rukun kembali. Pasangan ini saling menerima kekurangan dan ditakdirkan menua bersama.",
          bg: "bg-emerald-50 border-emerald-100 text-emerald-800"
        };
      case 'Topo':
        return {
          meaning: "Tirakat / Ujian di Awal",
          desc: "Hubungan ini mungkin mengalami kesulitan di awal (bisa masalah ekonomi atau penyesuaian sifat). Namun 'Topo' artinya bertapa; jika sabar melewati ujian awal, kebahagiaan & kesuksesan besar menanti di akhir.",
          bg: "bg-amber-50 border-amber-100 text-amber-800"
        };
      case 'Tinari':
        return {
          meaning: "Kebahagiaan (Kemudahan Rejeki)",
          desc: "Pasangan yang membawa keberuntungan. Rejeki cenderung mudah didapat dan keluarga selalu diliputi kebahagiaan.",
          bg: "bg-teal-50 border-teal-100 text-teal-800"
        };
      case 'Padu':
        return {
          meaning: "Sering Berdebat",
          desc: "Sering terjadi pertengkaran untuk masalah sepele, namun tidak sampai pada perceraian. Perlu banyak kesabaran.",
          bg: "bg-orange-50 border-orange-100 text-orange-800"
        };
      case 'Sujan':
        return {
          meaning: "Waspada (Ancaman Perselingkuhan)",
          desc: "Ada potensi konflik besar atau kehadiran orang ketiga. Membutuhkan benteng agama dan komitmen yang sangat kuat.",
          bg: "bg-red-50 border-red-100 text-red-800"
        };
      case 'Pesthi':
        return {
          meaning: "Rukun & Tentram",
          desc: "Rumah tangga yang adem ayem, rukun, dan damai. Jarang ada konflik besar, hidup mengalir tenang.",
          bg: "bg-indigo-50 border-indigo-100 text-indigo-800"
        };
      case 'Pegat':
        return {
          meaning: "Risiko Perpisahan",
          desc: "Kategori rawan yang mengindikasikan risiko perpisahan (cerai hidup/mati) atau masalah ekonomi berat. Perlu ruwatan atau kewaspadaan tinggi.",
          bg: "bg-stone-100 border-stone-200 text-stone-600"
        };
      default:
        return {
          meaning: category,
          desc: "Kombinasi weton ini memiliki karakteristik unik sesuai hitungan pembagian 8.",
          bg: "bg-stone-50 border-stone-100 text-stone-600"
        };
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-java-dark mb-4">
          Harmoni & <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-400">Keselarasan</span>
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
             ? "Nganalisis dinamika sesambungan kangge mbangun pangerten lan nglengkapi kekirangan."
             : "Menganalisis potensi dinamika hubungan untuk membangun saling pengertian dan melengkapi kekurangan pasangan."
          }
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 md:p-8 border border-white mb-12">
        <form onSubmit={handleCalculate} className="flex flex-col gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Input 1 */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-java-brown uppercase tracking-wider flex items-center gap-2">
                 <User size={16} className="text-java-brown" />
                 {language === 'jv' ? 'Wiyosan Panjenengan' : 'Data Kamu'}
               </label>
               <div className="flex gap-2">
                 <input
                   type="date"
                   required
                   value={date1}
                   onChange={(e) => setDate1(e.target.value)}
                   className="flex-grow p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold focus:border-transparent outline-none transition-all w-full text-stone-800"
                 />
                 <input
                   type="time"
                   value={time1}
                   onChange={(e) => setTime1(e.target.value)}
                   className="w-24 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold focus:border-transparent outline-none transition-all text-stone-800"
                   title="Jam Lahir (Opsional)"
                   placeholder="Jam"
                 />
               </div>
             </div>
             {/* Input 2 */}
             <div className="space-y-2">
               <label className="text-sm font-bold text-java-brown uppercase tracking-wider flex items-center gap-2">
                 <Heart size={16} className="text-pink-500" />
                 {language === 'jv' ? 'Wiyosan Pasangan' : 'Data Pasangan'}
               </label>
               <div className="flex gap-2">
                 <input
                   type="date"
                   required
                   value={date2}
                   onChange={(e) => setDate2(e.target.value)}
                   className="flex-grow p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold focus:border-transparent outline-none transition-all w-full text-stone-800"
                 />
                 <input
                   type="time"
                   value={time2}
                   onChange={(e) => setTime2(e.target.value)}
                   className="w-24 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold focus:border-transparent outline-none transition-all text-stone-800"
                   title="Jam Lahir (Opsional)"
                   placeholder="Jam"
                 />
               </div>
             </div>
           </div>
           
           <div className="text-[10px] text-stone-500 text-center italic font-medium">
             *Jam lahir (opsional). Jika diisi ≥ 18:00, perhitungan weton otomatis geser ke hari berikutnya.
           </div>

           <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-java-dark to-stone-800 hover:from-java-brown hover:to-java-dark text-java-gold font-bold rounded-xl transition-all shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 active:scale-[0.99] flex items-center justify-center gap-2 group mt-2"
            >
              <HeartHandshake size={20} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">{language === 'jv' ? 'Mirsani Kecocokan' : 'Analisis Keselarasan'}</span>
            </button>
        </form>
      </div>

      {/* Result Display */}
      {result && (
        <div id="jodoh-result" className="animate-fade-in-up">
           <div className="flex justify-end mb-4">
              <button onClick={handleReset} className="text-xs flex items-center gap-1 text-stone-400 hover:text-red-500">
                <Trash2 size={12} /> Reset Hasil
              </button>
           </div>

           <div className="relative mb-12">
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -z-10 hidden md:block"></div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Weton 1 */}
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform">
                   <div className="text-xs text-stone-400 font-bold uppercase mb-1">Kamu</div>
                   <div className="text-xl font-serif font-bold text-java-dark">
                     {result.weton1.day.name} <span className="text-java-gold">{result.weton1.pasaran.name}</span>
                   </div>
                   <div className="text-sm text-stone-500 mt-2">Neptu <strong>{result.weton1.totalNeptu}</strong></div>
                   {result.weton1.isAfterMaghrib && <div className="text-[10px] text-pink-500 mt-1 italic">*Lahir Malam (Hari+1)</div>}
                </div>

                {/* Connection Heart */}
                <div className="flex flex-col items-center justify-center">
                   <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-pink-500/30 animate-pulse">
                      <Heart size={32} fill="currentColor" />
                   </div>
                   <div className="mt-4 bg-white px-4 py-1 rounded-full border border-stone-200 shadow-sm text-xs font-mono font-bold text-stone-500">
                     Total Neptu: {result.totalCombinedNeptu}
                   </div>
                </div>

                {/* Weton 2 */}
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm text-center transform hover:-translate-y-1 transition-transform">
                   <div className="text-xs text-stone-400 font-bold uppercase mb-1">Pasangan</div>
                   <div className="text-xl font-serif font-bold text-java-dark">
                     {result.weton2.day.name} <span className="text-java-gold">{result.weton2.pasaran.name}</span>
                   </div>
                   <div className="text-sm text-stone-500 mt-2">Neptu <strong>{result.weton2.totalNeptu}</strong></div>
                   {result.weton2.isAfterMaghrib && <div className="text-[10px] text-pink-500 mt-1 italic">*Lahir Malam (Hari+1)</div>}
                </div>
             </div>
           </div>

           {/* Category Result with Nuanced Description */}
           {(() => {
              const nuance = getJodohNuance(result.category);
              return (
                <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden mb-8 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-java-gold via-pink-500 to-java-gold"></div>
                    <div className="p-8 md:p-12 text-center">
                        <span className="inline-block px-4 py-1 bg-stone-100 text-stone-500 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                            Pola Hubungan (Sisa {result.remainder})
                        </span>
                        
                        <h2 className="text-5xl md:text-7xl font-serif font-bold text-java-dark mb-2">
                            {result.category}
                        </h2>
                        
                        <h3 className="text-lg md:text-xl font-medium text-java-brown mb-6">
                            "{nuance.meaning}"
                        </h3>

                        {/* Static Traditional Description */}
                        <div className={`max-w-2xl mx-auto p-6 rounded-2xl ${nuance.bg} mb-6`}>
                            <div className="flex items-start justify-center gap-2 text-sm leading-relaxed font-medium opacity-90">
                                <BookOpen size={18} className="mt-0.5 flex-shrink-0" />
                                <p>{nuance.desc}</p>
                            </div>
                        </div>
                    </div>

                    {!analysis && (
                        <div className="pb-12 px-8 flex justify-center">
                            <button
                                onClick={handleInterpret}
                                disabled={isLoading}
                                className="px-8 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition-colors flex items-center gap-2 group"
                            >
                                {isLoading ? (
                                    <>
                                    <div className="animate-spin h-4 w-4 border-2 border-rose-600 border-t-transparent rounded-full"></div>
                                    <span>Menggali Lebih Dalam...</span>
                                    </>
                                ) : (
                                    <>
                                    <Sparkles size={18} />
                                    <span>Analisis AI & Saran</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
              );
           })()}

           {/* AI Analysis */}
           {analysis && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up mb-8">
                {/* Meaning Card */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-md">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                      <Info size={24} />
                   </div>
                   <h3 className="font-serif font-bold text-xl text-java-dark mb-3">Perspektif Mendalam</h3>
                   <p className="text-stone-700 leading-relaxed text-sm md:text-base font-medium">
                     {analysis.meaning}
                   </p>
                </div>

                {/* Advice Card */}
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-md">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <Scale size={24} />
                   </div>
                   <h3 className="font-serif font-bold text-xl text-java-dark mb-3">Kunci Keharmonisan</h3>
                   <p className="text-stone-700 leading-relaxed text-sm md:text-base font-medium">
                     {analysis.advice}
                   </p>
                </div>

                {/* Score Bar */}
                <div className="md:col-span-2 bg-java-dark text-java-cream p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
                   <div>
                      <h4 className="font-bold text-lg text-java-gold mb-1">Indikator Keselarasan</h4>
                      <p className="text-sm text-stone-400">Potensi harmoni yang dapat dicapai dengan saling pengertian.</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-48 h-4 bg-white/10 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-gradient-to-r from-orange-400 to-green-500 transition-all duration-1000 ease-out"
                           style={{ width: `${analysis.compatibilityScore}%` }}
                         ></div>
                      </div>
                      <span className="text-4xl font-serif font-bold">{analysis.compatibilityScore}%</span>
                   </div>
                </div>
             </div>
           )}

           {/* Wedding Date Recommendation Section */}
           {analysis && (
             <div className="border-t-2 border-stone-100 pt-8 mt-12 animate-fade-in-up">
                <div className="text-center mb-8">
                   <h3 className="text-2xl font-serif font-bold text-java-dark mb-2">Ikhtiar Waktu Terbaik</h3>
                   <p className="text-java-brown font-medium text-sm max-w-md mx-auto">
                     Merencanakan akad nikah di waktu yang memiliki energi positif (Dewasa Ayu) untuk mengawali niat baik.
                   </p>
                </div>
                
                {!weddingRecs ? (
                  <div className="flex justify-center">
                    <button
                        onClick={handleWeddingRecommendations}
                        disabled={isWeddingLoading}
                        className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/30 flex items-center gap-2 group hover:-translate-y-1"
                    >
                        {isWeddingLoading ? (
                            <>
                             <div className="animate-spin h-5 w-5 border-2 border-white/50 border-t-white rounded-full"></div>
                             <span>Menghitung...</span>
                            </>
                        ) : (
                            <>
                             <CalendarHeart size={20} className="group-hover:scale-110 transition-transform" />
                             <span>Cari Rekomendasi Hari</span>
                            </>
                        )}
                    </button>
                  </div>
                ) : (
                  <div id="wedding-recs" className="space-y-6 animate-fade-in-up">
                     
                     {/* 1. Nearest Best Date (Hero Card) - SLIM BANNER LAYOUT */}
                     <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl shadow-lg overflow-hidden text-white relative group">
                        {/* Background Deco */}
                        <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
                            <Sparkles size={120} />
                        </div>

                        <div className="relative z-10 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
                           
                           {/* Left: Date & ID */}
                           <div className="flex-shrink-0 md:border-r md:border-emerald-500/30 md:pr-6">
                              <div className="flex items-center gap-2 mb-1">
                                 <div className="px-2 py-0.5 rounded bg-emerald-400/20 text-[10px] font-bold uppercase tracking-wider text-emerald-100 border border-emerald-400/30">
                                    Rekomendasi Utama
                                 </div>
                              </div>
                              <h3 className="text-2xl md:text-3xl font-serif font-bold leading-none mb-1 text-white">
                                {weddingRecs.nearestGoodDate.date}
                              </h3>
                              <p className="text-base md:text-lg text-emerald-100 font-medium">
                                {weddingRecs.nearestGoodDate.dayName}
                              </p>
                           </div>

                           {/* Middle: Reason */}
                           <div className="flex-grow min-w-0">
                              <p className="text-sm text-emerald-50 leading-relaxed opacity-90 italic border-l-2 border-emerald-400/30 pl-3 md:pl-0 md:border-l-0">
                                 "{weddingRecs.nearestGoodDate.reason}"
                              </p>
                           </div>

                           {/* Right: Button */}
                           <div className="flex-shrink-0 mt-1 md:mt-0">
                              <button 
                                onClick={() => openCalendar(weddingRecs.nearestGoodDate.date, weddingRecs.nearestGoodDate.reason)}
                                className="w-full md:w-auto px-5 py-2.5 bg-white text-emerald-800 font-bold rounded-xl shadow hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 text-sm"
                              >
                                 <BellPlus size={16} />
                                 <span>Simpan</span>
                              </button>
                           </div>

                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 2. Good Dates List */}
                        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center gap-2">
                                <CalendarHeart className="text-emerald-600" size={20} />
                                <h4 className="font-bold text-stone-700">Alternatif Hari Baik</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                {weddingRecs.goodDates.map((item, idx) => (
                                    <div key={idx} className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 hover:border-emerald-200 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-stone-800">{item.date}</div>
                                                <div className="text-xs font-bold text-emerald-600 uppercase">{item.dayName}</div>
                                            </div>
                                            <button 
                                                onClick={() => openCalendar(item.date, item.reason)}
                                                className="text-stone-400 hover:text-emerald-600"
                                            >
                                                <BellPlus size={18} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-stone-600 italic leading-relaxed">
                                            Kenapa baik? "{item.reason}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Bad Dates List */}
                        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="p-5 border-b border-stone-100 bg-red-50 flex items-center gap-2">
                                <AlertOctagon className="text-red-600" size={20} />
                                <h4 className="font-bold text-red-800">Hari Pantangan (Naas)</h4>
                            </div>
                            <div className="p-5 space-y-4">
                                {weddingRecs.avoidDates.map((item, idx) => (
                                    <div key={idx} className="bg-red-50/50 rounded-xl p-4 border border-red-100 group">
                                        <div className="mb-2">
                                            <div className="font-bold text-stone-800">{item.date}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-red-500 uppercase">{item.dayName}</span>
                                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">{item.reason}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-start mt-2 pt-2 border-t border-red-100/50">
                                            <ShieldAlert size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs text-stone-600 leading-relaxed">
                                                <strong className="text-red-700">Risiko:</strong> {item.impact}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                     
                     {/* Reasoning Footer */}
                     <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 text-center">
                        <Info size={24} className="text-stone-400 mx-auto mb-2" />
                        <p className="text-stone-700 text-sm leading-relaxed italic max-w-2xl mx-auto font-medium">
                           "{weddingRecs.generalAdvice}"
                        </p>
                     </div>
                  </div>
                )}
             </div>
           )}
        </div>
      )}
    </div>
  );
};