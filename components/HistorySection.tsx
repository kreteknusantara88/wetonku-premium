import React from 'react';
import { HistoryItem } from '../types';
import { formatDateID } from '../utils/javaneseCalc';
import { History, Trash2, Calendar, Star, ChevronRight, Pencil } from 'lucide-react';

interface HistorySectionProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onEdit: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ history, onSelect, onEdit, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 px-1">
        <div>
          <h3 className="font-serif font-bold text-2xl text-java-dark flex items-center gap-2">
            <History className="text-java-brown" size={24} />
            Riwayat Perhitungan
          </h3>
          <p className="text-sm text-stone-700 font-medium mt-1 ml-8">
            Daftar perhitungan weton terakhir Anda
          </p>
        </div>
        <button 
          onClick={onClear}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-300 text-sm font-bold shadow-sm"
        >
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
          <span>Bersihkan</span>
        </button>
      </div>

      {/* Grid Layout for History Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="group relative bg-white rounded-2xl p-5 border border-stone-200 shadow-md hover:shadow-xl hover:shadow-stone-200/50 hover:border-java-brown/30 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden w-full"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-10 bg-gradient-to-br from-stone-50 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Top Row: Date, Edit & Arrow */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 group-hover:bg-java-bg group-hover:text-java-brown transition-colors">
                    <Calendar size={12} />
                    <span>{formatDateID(item.result.date)}</span>
                  </div>
                  
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="p-1.5 text-stone-500 hover:text-java-accent hover:bg-stone-200 rounded-lg transition-colors"
                    title="Ubah Tanggal"
                  >
                    <Pencil size={12} />
                  </button>
                </div>

                {/* View/Select Button (Chevron) */}
                <button 
                  onClick={() => onSelect(item)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 bg-stone-50 hover:bg-java-brown hover:text-white transition-all duration-300 transform hover:rotate-[-45deg] sm:hover:rotate-0 border border-stone-100"
                  title="Lihat Hasil"
                >
                   <ChevronRight size={18} />
                </button>
              </div>

              {/* Main Content Area - Click to Select */}
              <div onClick={() => onSelect(item)} className="cursor-pointer flex-grow">
                  {/* Middle: Weton Name */}
                  <div className="mb-4">
                     <h4 className="font-serif font-bold text-xl md:text-2xl text-java-dark group-hover:text-java-brown transition-colors">
                       {item.result.day.name} <span className="text-java-gold">{item.result.pasaran.name}</span>
                     </h4>
                  </div>

                  {/* Bottom: Neptu Badge */}
                  <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
                     <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">Total Neptu</span>
                     <div className="flex items-center gap-1.5 text-java-dark font-bold font-mono">
                        <Star size={14} className="text-java-gold fill-java-gold" />
                        <span className="text-lg">{item.result.totalNeptu}</span>
                     </div>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};