import React from 'react';
import { BookOpen, Moon, Hash, Calendar, Sun, Flame, Droplets, Wind, Flower, Mountain, Sparkles, Waves, CircleDot, UserPlus } from 'lucide-react';
import { DAYS, PASARANS } from '../constants';
import { UserProfile } from '../types';
import { DailyInsightCard } from './DailyInsightCard';

const getDayIcon = (name: string) => {
  switch (name) {
    case 'Minggu': return <Sun size={16} className="text-orange-500" />;
    case 'Senin': return <Moon size={16} className="text-blue-400" />;
    case 'Selasa': return <Flame size={16} className="text-red-500" />;
    case 'Rabu': return <Droplets size={16} className="text-cyan-500" />;
    case 'Kamis': return <Wind size={16} className="text-amber-500" />;
    case 'Jumat': return <Flower size={16} className="text-pink-500" />;
    case 'Sabtu': return <Mountain size={16} className="text-stone-600" />;
    default: return <Calendar size={16} className="text-stone-400" />;
  }
};

const getPasaranIcon = (name: string) => {
  switch (name) {
    case 'Legi': return <Wind size={16} className="text-sky-500" />;
    case 'Pahing': return <Flame size={16} className="text-red-600" />;
    case 'Pon': return <Waves size={16} className="text-yellow-600" />;
    case 'Wage': return <Mountain size={16} className="text-stone-800" />;
    case 'Kliwon': return <Sparkles size={16} className="text-purple-500" />;
    default: return <CircleDot size={16} className="text-stone-400" />;
  }
};

interface HomeViewProps {
  onNavigateToProfile?: () => void;
  language?: 'id' | 'jv';
  userProfile: UserProfile | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateToProfile, language = 'id', userProfile }) => {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <div className="text-center mb-10 py-6">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-java-dark mb-4 leading-tight">
          Warisan Leluhur untuk <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-java-brown to-java-accent">Mengenali Diri</span>
        </h1>
        <p className="text-java-brown font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          {language === 'jv' 
             ? "Mangertosi jatidiri lumantar ilmu titen lan kearifan budaya Jawi."
             : "\"Bukan tentang meramal masa depan, melainkan upaya memahami potensi diri melalui kearifan budaya Jawa (Ilmu Titen) yang dipadukan dengan teknologi.\""
          }
        </p>
      </div>

      {/* Daily Insight Section */}
      <div className="mb-12 max-w-4xl mx-auto">
         {userProfile ? (
            <DailyInsightCard profile={userProfile} language={language} />
         ) : (
            <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-stone-200 text-center shadow-lg">
               <div className="w-16 h-16 bg-java-gold/10 text-java-brown rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus size={32} />
               </div>
               <h3 className="font-serif font-bold text-2xl text-java-dark mb-2">Pesan Bijak Harian</h3>
               <p className="text-stone-700 font-medium max-w-md mx-auto mb-6">
                  Buat profil untuk mendapatkan falsafah Jawa harian sebagai bahan refleksi dan penyemangat diri.
               </p>
               {onNavigateToProfile && (
                 <button 
                   onClick={onNavigateToProfile}
                   className="px-8 py-3 bg-java-dark text-java-gold font-bold rounded-xl shadow-lg hover:bg-stone-800 transition-colors"
                 >
                   Mulai Perjalanan Diri
                 </button>
               )}
            </div>
         )}
      </div>

      <div className="mt-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="font-serif font-bold text-2xl text-java-dark mb-2">Filosofi Dasar</h2>
          <div className="h-1 w-16 bg-java-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Weton */}
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 bg-java-brown/10 text-java-brown rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Weton Sebagai Cermin</h3>
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              Hari kelahiran bukan kebetulan, melainkan penanda waktu yang membawa karakteristik energi alam tertentu untuk dipelajari kelebihan dan kekurangannya.
            </p>
          </div>

          {/* Card 2: Pasaran */}
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 bg-java-gold/10 text-java-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Moon size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Siklus Pancawara</h3>
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              Lima elemen pasar (Legi, Pahing, Pon, Wage, Kliwon) mengajarkan kita tentang dinamika psikologis dan interaksi sosial manusia dengan lingkungannya.
            </p>
          </div>

          {/* Card 3: Neptu */}
          <div className="bg-white/80 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Hash size={24} />
            </div>
            <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Neptu & Harmoni</h3>
            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              Simbol angka yang digunakan leluhur untuk memetakan keselarasan, mencari waktu yang tepat untuk bertindak, dan menjaga keseimbangan hidup.
            </p>
          </div>
        </div>

        {/* Tabel Referensi Neptu - Refined */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-lg shadow-stone-200/40">
          <div className="p-5 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-java-dark flex items-center gap-2">
              <Hash size={18} className="text-java-accent" />
              <span>Kamus Nilai Neptu</span>
            </h3>
            <span className="text-xs text-stone-500 font-bold bg-white border border-stone-200 px-3 py-1 rounded-full shadow-sm">
                Referensi Dasar
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
             {/* Table Hari */}
             <div className="p-6">
                <h4 className="font-bold text-java-brown text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Calendar size={14} className="text-java-brown" />
                   Nilai Hari (Saptawara)
                </h4>
                <div className="overflow-hidden rounded-xl border border-stone-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-100/80 text-java-brown text-xs uppercase tracking-wide">
                        <th className="py-3 px-4 text-left font-bold">Nama Hari</th>
                        <th className="py-3 px-4 text-right font-bold">Neptu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {DAYS.map((item, idx) => (
                         <tr key={item.id} className={`transition-colors hover:bg-stone-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                           <td className="py-2.5 px-4 text-stone-800 font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-600">
                                    {getDayIcon(item.name)}
                                </div>
                                <span className="font-semibold">{item.name}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-4 text-right">
                               <span className="inline-block w-8 h-8 leading-8 text-center rounded-lg bg-stone-100 text-java-brown font-mono font-bold">
                                   {item.neptu}
                               </span>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>

             {/* Table Pasaran */}
             <div className="p-6">
                <h4 className="font-bold text-java-brown text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Moon size={14} className="text-java-accent" />
                   Nilai Pasaran (Pancawara)
                </h4>
                <div className="overflow-hidden rounded-xl border border-stone-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-100/80 text-java-brown text-xs uppercase tracking-wide">
                        <th className="py-3 px-4 text-left font-bold">Nama Pasaran</th>
                        <th className="py-3 px-4 text-right font-bold">Neptu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {PASARANS.map((item, idx) => (
                         <tr key={item.id} className={`transition-colors hover:bg-stone-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                           <td className="py-2.5 px-4 text-stone-800 font-medium">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-600">
                                    {getPasaranIcon(item.name)}
                                </div>
                                <span className="font-semibold">{item.name}</span>
                              </div>
                           </td>
                           <td className="py-2.5 px-4 text-right">
                               <span className="inline-block w-8 h-8 leading-8 text-center rounded-lg bg-stone-100 text-java-accent font-mono font-bold">
                                   {item.neptu}
                               </span>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};