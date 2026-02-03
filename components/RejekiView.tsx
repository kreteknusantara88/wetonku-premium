import React, { useState, useEffect } from 'react';
import { calculateWeton } from '../utils/javaneseCalc';
import { getRejekiInterpretation } from '../services/geminiService';
import { WetonResult, RejekiAnalysis } from '../types';
import { TrendingUp, Briefcase, Wallet, Search, ArrowRight, User, Loader2, Target, Coins, BriefcaseBusiness, Sparkles, Clock, Trash2 } from 'lucide-react';

interface RejekiViewProps {
  language?: 'id' | 'jv';
}

export const RejekiView: React.FC<RejekiViewProps> = ({ language = 'id' }) => {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [weton, setWeton] = useState<WetonResult | null>(null);
  const [analysis, setAnalysis] = useState<RejekiAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('last_rejeki');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.weton) setWeton(parsed.weton);
        if (parsed.analysis) setAnalysis(parsed.analysis);
      } catch (e) {
        console.error("Failed to load rejeki state", e);
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    if (weton) {
      localStorage.setItem('last_rejeki', JSON.stringify({ weton, analysis }));
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
    localStorage.removeItem('last_rejeki');
  };

  const handleAnalyze = async () => {
    if (!weton) return;
    setIsLoading(true);
    const result = await getRejekiInterpretation(weton, language as 'id' | 'jv');
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-java-dark mb-4">
          Strategi & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Etos Kerja</span>
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
             ? "Mangertosi pola energi rejeki kangge ngoptimalaken ikhtiar lan milih pakaryan ingkang selaras."
             : "Memahami pola energi rejeki untuk memaksimalkan ikhtiar, memilih bidang karir yang selaras, dan menerapkan laku prihatin yang tepat."
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
           <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between animate-fade-in-up">
              <div>
                 <div className="text-xs text-emerald-700 font-bold uppercase mb-1">Weton Anda</div>
                 <div className="text-xl font-serif font-bold text-java-dark">
                    {weton.day.name} <span className="text-java-gold">{weton.pasaran.name}</span>
                 </div>
                 <div className="text-sm text-stone-700 font-medium">Neptu: {weton.totalNeptu}</div>
                 {weton.isAfterMaghrib && <div className="text-[10px] text-emerald-600 mt-1 italic">*Disesuaikan karena lahir malam</div>}
              </div>
              
              {!analysis && (
                  <button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
                  >
                     {isLoading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                     <span>Analisis Potensi</span>
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

           {/* Pola Rejeki */}
           <div className="md:col-span-2 bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-8 border border-emerald-100 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Coins size={120} />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                       <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-java-dark">Pola & Aliran Rejeki</h3>
                 </div>
                 <p className="text-stone-700 leading-relaxed text-lg font-medium">
                    {analysis.fortunePattern}
                 </p>
              </div>
           </div>

           {/* Karir */}
           <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md h-full">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase size={20} />
                 </div>
                 <h3 className="text-lg font-serif font-bold text-java-dark">Bidang Karir Selaras</h3>
              </div>
              <ul className="space-y-3">
                 {analysis.suitableCareers.map((career, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                       <BriefcaseBusiness size={16} className="text-stone-500 mt-1 flex-shrink-0" />
                       <span className="text-stone-800 font-medium">{career}</span>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Falsafah */}
           <div className="bg-java-dark text-java-cream rounded-3xl p-6 border border-stone-800 shadow-md h-full relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Target size={80} />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 text-java-gold flex items-center justify-center">
                        <Wallet size={20} />
                     </div>
                     <h3 className="text-lg font-serif font-bold text-white">Laku Prihatin (Saran Spiritual)</h3>
                  </div>
                  <div className="prose prose-invert prose-sm">
                    <p className="text-white/90 leading-relaxed italic font-medium">
                       "{analysis.wealthMaintenance}"
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs text-white/50 uppercase tracking-widest font-bold">
                     <Sparkles size={12} /> Falsafah Jawa
                  </div>
               </div>
           </div>

        </div>
      )}
    </div>
  );
};