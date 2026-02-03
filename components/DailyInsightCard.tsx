import React, { useEffect, useState } from 'react';
import { UserProfile, WetonResult, DailyInsight } from '../types';
import { calculateWeton, formatDateID } from '../utils/javaneseCalc';
import { getDailyInsight } from '../services/geminiService';
import { Sparkles, Quote, Lightbulb, RefreshCw } from 'lucide-react';

interface DailyInsightCardProps {
  profile: UserProfile;
  language: 'id' | 'jv';
}

export const DailyInsightCard: React.FC<DailyInsightCardProps> = ({ profile, language }) => {
  const [insight, setInsight] = useState<DailyInsight | null>(null);
  const [loading, setLoading] = useState(false);
  const [todayWeton, setTodayWeton] = useState<WetonResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const today = new Date();
    const tWeton = calculateWeton(today);
    setTodayWeton(tWeton);
    setError(false);

    const checkAndFetchInsight = async () => {
      const todayStr = today.toISOString().split('T')[0];
      const cached = localStorage.getItem('daily_insight');
      
      // Attempt to load from cache
      if (cached) {
        try {
          const parsed: DailyInsight = JSON.parse(cached);
          if (parsed.date === todayStr) {
            setInsight(parsed);
            return;
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }

      // Fetch new if not cached or date changed
      setLoading(true);
      try {
          const userWeton = calculateWeton(new Date(profile.birthDate), profile.birthTime);
          const newInsight = await getDailyInsight(userWeton, tWeton, language);
          
          if (newInsight) {
            setInsight(newInsight);
            localStorage.setItem('daily_insight', JSON.stringify(newInsight));
            setError(false);
          } else {
             setError(true);
          }
      } catch (e) {
          console.error("Failed to fetch insight", e);
          setError(true);
      } finally {
          setLoading(false);
      }
    };

    checkAndFetchInsight();
  }, [profile, language]);

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-br from-java-dark to-stone-900 rounded-3xl p-6 shadow-xl border border-java-gold/20 flex flex-col items-center justify-center text-white min-h-[200px] animate-pulse">
         <Sparkles className="animate-spin mb-3 text-java-gold" />
         <p className="text-sm font-serif italic text-white/80">Menyelaraskan energi hari ini...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="w-full bg-stone-100 rounded-3xl p-6 border border-stone-200 flex flex-col items-center justify-center text-stone-600 min-h-[150px]">
           <p className="mb-3 text-sm font-medium">Gagal memuat pesan harian.</p>
           <button 
             onClick={() => window.location.reload()}
             className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 rounded-lg shadow-sm hover:bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-700"
           >
             <RefreshCw size={14} /> Coba Lagi
           </button>
        </div>
     );
  }

  if (!insight || !todayWeton) return null;

  return (
    <div className="w-full bg-gradient-to-br from-java-dark to-stone-900 rounded-3xl p-6 md:p-8 shadow-xl border-t border-java-gold/30 relative overflow-hidden text-white animate-fade-in-up">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 p-12 opacity-5">
          <Sparkles size={150} />
       </div>
       
       <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
             <div>
                <div className="text-xs font-bold text-java-gold uppercase tracking-widest mb-1">
                   Weton Hari Ini
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">
                   {todayWeton.day.name} <span className="text-java-gold">{todayWeton.pasaran.name}</span>
                </h3>
                <p className="text-xs text-white/70 mt-1">{formatDateID(new Date())}</p>
             </div>
             <div className="text-right hidden sm:block">
                <div className="text-xs text-white/70">Halo,</div>
                <div className="font-bold text-lg text-white">{profile.name}</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Quote Section */}
             <div className="md:col-span-2 bg-white/5 rounded-2xl p-5 border border-white/10 relative">
                 <Quote className="absolute top-4 left-4 text-java-gold/20" size={32} />
                 <div className="relative z-10 text-center md:text-left pl-2">
                    <p className="font-serif text-lg italic leading-relaxed mb-3 text-white/95">"{insight.quote}"</p>
                    <div className="flex items-start gap-2 text-sm text-white/80 bg-black/20 p-3 rounded-lg">
                       <Lightbulb size={16} className="text-java-gold mt-0.5 flex-shrink-0" />
                       <span>{insight.advice}</span>
                    </div>
                 </div>
             </div>

             {/* Luck Meter */}
             <div className="bg-gradient-to-b from-java-gold/20 to-transparent rounded-2xl p-5 border border-java-gold/10 flex flex-col items-center justify-center text-center">
                 <div className="text-xs font-bold text-java-gold uppercase tracking-widest mb-2">Energi Anda</div>
                 <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                     <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-java-gold" strokeDasharray={226} strokeDashoffset={226 - (226 * insight.luckMeter) / 10} />
                     </svg>
                     <span className="text-2xl font-bold font-serif text-white">{insight.luckMeter}</span>
                 </div>
                 <span className="text-xs text-white/60">Skala 1-10</span>
             </div>
          </div>
       </div>
    </div>
  );
};