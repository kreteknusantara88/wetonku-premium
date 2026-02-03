import React from 'react';
import { WetonResult } from '../types';
import { formatDateID } from '../utils/javaneseCalc';
import { Sparkles, Sun, Moon, Plus, Calculator, BookOpen } from 'lucide-react';

interface WetonResultCardProps {
  result: WetonResult;
  onInterpret: () => void;
  isLoading: boolean;
  hasInterpreted: boolean;
}

export const WetonResultCard: React.FC<WetonResultCardProps> = ({ 
  result, 
  onInterpret, 
  isLoading,
  hasInterpreted
}) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden flex flex-col md:flex-row">
      
      {/* LEFT SIDE: Main Result & Total Neptu */}
      <div className="w-full md:w-5/12 bg-java-dark text-java-cream p-8 md:p-10 relative flex flex-col justify-center min-h-[300px]">
         {/* Background Deco */}
         <div className="absolute top-0 right-0 p-8 opacity-5">
            <Calculator size={120} />
         </div>

         <div className="relative z-10">
            {/* Date Badge */}
            <div className="inline-block px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4 text-java-gold">
               {formatDateID(result.date)}
            </div>
            
            {/* Main Weton Name */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight">
               {result.day.name} <br />
               <span className="text-java-gold">{result.pasaran.name}</span>
            </h1>

            {/* Total Neptu Big Display */}
            <div className="mt-auto pt-6 border-t border-white/10">
               <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Total Neptu</div>
               <div className="flex items-baseline gap-2">
                  <span className="text-6xl md:text-7xl font-serif font-bold text-white">{result.totalNeptu}</span>
                  <span className="text-sm text-white/70 font-medium">({result.day.neptu} + {result.pasaran.neptu})</span>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: Details (Hari & Pasaran) */}
      <div className="w-full md:w-7/12 bg-white p-6 md:p-10 flex flex-col justify-center">
         <h3 className="text-sm font-bold text-java-brown uppercase tracking-widest mb-6 flex items-center gap-2">
            <Sparkles size={14} className="text-java-brown" />
            Rincian Perhitungan
         </h3>

         <div className="grid grid-cols-1 gap-4">
            {/* Day Row */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-lg hover:border-java-gold/50 hover:scale-[1.02] transition-all duration-300 group cursor-default">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-java-gold/10 text-java-gold flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                     <Sun size={24} />
                  </div>
                  <div>
                     <span className="text-xs font-bold text-stone-600 uppercase block mb-0.5">Hari (Dina)</span>
                     <span className="text-xl font-serif font-bold text-java-dark">{result.day.name}</span>
                  </div>
               </div>
               <div className="text-right">
                  <span className="text-xs font-bold text-stone-600 uppercase block mb-0.5">Nilai</span>
                  <span className="text-2xl font-mono font-bold text-java-dark">{result.day.neptu}</span>
               </div>
            </div>

            {/* Connector */}
            <div className="flex justify-center -my-3 relative z-10">
               <div className="bg-white text-stone-400 rounded-full p-1 border border-stone-200 shadow-sm z-10">
                  <Plus size={16} />
               </div>
            </div>

            {/* Pasaran Row */}
            <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-lg hover:border-java-brown/50 hover:scale-[1.02] transition-all duration-300 group cursor-default">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-java-brown/10 text-java-brown flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                     <Moon size={24} />
                  </div>
                  <div>
                     <span className="text-xs font-bold text-stone-600 uppercase block mb-0.5">Pasaran</span>
                     <span className="text-xl font-serif font-bold text-java-dark">{result.pasaran.name}</span>
                  </div>
               </div>
               <div className="text-right">
                   <span className="text-xs font-bold text-stone-600 uppercase block mb-0.5">Nilai</span>
                   <span className="text-2xl font-mono font-bold text-java-dark">{result.pasaran.neptu}</span>
               </div>
            </div>
         </div>

         {/* Educational Context Snippet */}
         <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 flex gap-3.5 relative overflow-hidden group hover:bg-stone-100/50 transition-colors">
            {/* Deco */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-java-gold/10 rounded-bl-full -mr-8 -mt-8"></div>

            <div className="flex-shrink-0 mt-0.5 relative z-10">
               <BookOpen size={18} className="text-java-brown" />
            </div>
            <div className="relative z-10">
               <h4 className="font-bold text-java-dark text-sm mb-1.5 font-serif">Sekilas Wawasan Primbon</h4>
               <p className="text-xs text-stone-700 leading-relaxed text-justify font-medium">
                  Nilai Neptu <strong>{result.totalNeptu}</strong> ini adalah kunci utama dalam metode <em>Pancasuda</em> (perhitungan sisa bagi). Para leluhur menggunakannya untuk memetakan arah keberuntungan, mencari kecocokan jodoh, hingga menghindari hari naas (<em>Dino Ringkel</em>) saat memulai hajat besar.
               </p>
            </div>
         </div>

         {/* Action Button */}
         {!hasInterpreted && (
           <div className="mt-6">
             <button
                onClick={onInterpret}
                disabled={isLoading}
                className="w-full py-4 px-6 bg-java-brown hover:bg-java-accent text-white rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-java-brown/20 hover:shadow-java-accent/30 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                    <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    <span>Mengakses Primbon AI...</span>
                    </>
                ) : (
                    <>
                    <Sparkles size={20} className="text-java-gold group-hover:animate-pulse" />
                    <span>Baca Watak & Peruntungan</span>
                    </>
                )}
              </button>
           </div>
         )}
      </div>
    </div>
  );
};