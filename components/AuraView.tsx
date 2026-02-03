import React, { useState, useEffect } from 'react';
import { calculateWeton } from '../utils/javaneseCalc';
import { getAuraAnalysis } from '../services/geminiService';
import { WetonResult, AuraAnalysis } from '../types';
import { Sun, User, Search, Loader2, Sparkles, Feather, Zap, Flower, Trash2 } from 'lucide-react';

interface AuraViewProps {
  language?: 'id' | 'jv';
}

export const AuraView: React.FC<AuraViewProps> = ({ language = 'id' }) => {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [weton, setWeton] = useState<WetonResult | null>(null);
  const [analysis, setAnalysis] = useState<AuraAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('last_aura');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.weton) setWeton(parsed.weton);
        if (parsed.analysis) setAnalysis(parsed.analysis);
      } catch (e) {
        console.error("Failed to load aura state", e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (weton) {
      localStorage.setItem('last_aura', JSON.stringify({ weton, analysis }));
    }
  }, [weton, analysis]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput) return;
    setAnalysis(null);
    const w = calculateWeton(new Date(dateInput), timeInput);
    setWeton(w);
  };

  const handleReset = () => {
    setWeton(null);
    setAnalysis(null);
    setDateInput('');
    setTimeInput('');
    localStorage.removeItem('last_aura');
  };

  const handleAnalyze = async () => {
    if (!weton) return;
    setIsLoading(true);
    const result = await getAuraAnalysis(weton, language as 'id' | 'jv');
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-java-dark mb-4">
          Refleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-500">Energi Diri</span>
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
             ? "Mangenali karakter energi spiritual kangge nggayuh katentreman batin lan mancaraken cahya positif."
             : "Mengenali karakter energi spiritual untuk mencapai ketenangan batin dan memancarkan aura positif."
          }
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-6 md:p-8 border border-white mb-10 max-w-2xl mx-auto">
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-java-brown uppercase tracking-wider flex items-center gap-2">
               <User size={16} className="text-java-brown" />
               Tanggal & Jam Lahir
            </label>
            <div className="flex gap-2">
               <input
                 type="date"
                 required
                 value={dateInput}
                 onChange={(e) => setDateInput(e.target.value)}
                 className="flex-grow p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none transition-all w-full text-stone-800"
               />
               <input
                 type="time"
                 value={timeInput}
                 onChange={(e) => setTimeInput(e.target.value)}
                 className="w-24 p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none transition-all text-stone-800"
                 title="Jam Lahir (Opsional)"
               />
               <button 
                 type="submit"
                 className="px-6 bg-java-dark text-java-gold rounded-xl font-bold hover:bg-stone-800 transition-colors"
               >
                 <Search size={20} />
               </button>
            </div>
            <p className="text-[10px] text-stone-500 italic text-center font-medium">Jika lahir ≥ 18:00 (Maghrib), hari Jawa dihitung hari berikutnya.</p>
          </div>
        </form>

        {/* Weton Summary */}
        {weton && (
           <div className="mt-6 p-4 bg-violet-50 rounded-2xl border border-violet-100 flex items-center justify-between animate-fade-in-up">
              <div>
                 <div className="text-xs text-violet-700 font-bold uppercase mb-1">Weton Anda</div>
                 <div className="text-xl font-serif font-bold text-java-dark">
                    {weton.day.name} <span className="text-java-gold">{weton.pasaran.name}</span>
                 </div>
                 <div className="text-sm text-stone-700 font-medium">Neptu: {weton.totalNeptu}</div>
                 {weton.isAfterMaghrib && <div className="text-[10px] text-violet-600 mt-1 italic">*Disesuaikan karena lahir malam</div>}
              </div>
              
              {!analysis && (
                  <button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white rounded-xl font-bold text-sm hover:bg-violet-700 transition-all shadow-lg shadow-violet-600/20 hover:-translate-y-0.5"
                  >
                     {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                     <span>Baca Energi</span>
                  </button>
              )}
           </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up relative">
           
           <button 
             onClick={handleReset}
             className="absolute -top-12 right-0 flex items-center gap-1 text-xs text-stone-400 hover:text-red-500"
           >
             <Trash2 size={12} /> Reset Analisis
           </button>

           {/* Aura Profile (Full Width) */}
           <div className="md:col-span-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-20">
                   <Sun size={140} />
               </div>
               <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                           <Sun size={20} className="text-java-gold" />
                       </div>
                       <h3 className="font-serif font-bold text-xl">Metafora Energi Alam</h3>
                   </div>
                   <p className="text-xl md:text-2xl font-serif leading-relaxed mb-6 opacity-90">
                       "{analysis.auraProfile}"
                   </p>
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium">
                       <Zap size={14} />
                       <span>Elemen Dominan: {analysis.element}</span>
                   </div>
               </div>
           </div>

           {/* Luck Tendency */}
           <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-md group hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Sparkles size={24} />
               </div>
               <h3 className="font-serif font-bold text-xl text-java-dark mb-4">Potensi Keberuntungan</h3>
               <p className="text-stone-700 leading-relaxed text-sm md:text-base font-medium">
                   {analysis.luckTendency}
               </p>
           </div>

           {/* Spiritual Advice (Laku) */}
           <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-md group hover:shadow-lg transition-all duration-300">
               <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Feather size={24} />
               </div>
               <h3 className="font-serif font-bold text-xl text-java-dark mb-4">Saran Kebiasaan (Laku)</h3>
               <p className="text-stone-700 leading-relaxed text-sm md:text-base italic font-medium">
                   "{analysis.spiritualAdvice}"
               </p>
               <div className="mt-4 flex items-center gap-2 text-xs text-stone-400 font-bold uppercase tracking-widest">
                   <Flower size={12} />
                   <span>Harmonisasi Diri</span>
               </div>
           </div>

        </div>
      )}
    </div>
  );
};