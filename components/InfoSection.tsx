import React from 'react';
import { BookOpen, Moon, Hash, Calendar, Sun, Flame, Droplets, Wind, Flower, Mountain, Sparkles, Waves, CircleDot } from 'lucide-react';
import { DAYS, PASARANS } from '../constants';

const getDayIcon = (name: string) => {
  switch (name) {
    case 'Minggu': return <Sun size={14} className="text-orange-500" />;
    case 'Senin': return <Moon size={14} className="text-blue-400" />;
    case 'Selasa': return <Flame size={14} className="text-red-500" />;
    case 'Rabu': return <Droplets size={14} className="text-cyan-500" />;
    case 'Kamis': return <Wind size={14} className="text-amber-500" />;
    case 'Jumat': return <Flower size={14} className="text-pink-500" />;
    case 'Sabtu': return <Mountain size={14} className="text-stone-600" />;
    default: return <Calendar size={14} className="text-stone-400" />;
  }
};

const getPasaranIcon = (name: string) => {
  switch (name) {
    case 'Legi': return <Wind size={14} className="text-sky-500" />;
    case 'Pahing': return <Flame size={14} className="text-red-600" />;
    case 'Pon': return <Waves size={14} className="text-yellow-600" />;
    case 'Wage': return <Mountain size={14} className="text-stone-800" />;
    case 'Kliwon': return <Sparkles size={14} className="text-purple-500" />;
    default: return <CircleDot size={14} className="text-stone-400" />;
  }
};

export const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="text-center mb-8">
        <h2 className="font-serif font-bold text-2xl text-java-dark mb-2">Mengenal Konsep Dasar</h2>
        <div className="h-1 w-16 bg-java-gold mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Weton */}
        <div className="bg-white/60 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md">
          <div className="w-10 h-10 bg-java-brown/10 text-java-brown rounded-full flex items-center justify-center mb-4">
            <BookOpen size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Apa itu Weton?</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Weton adalah peringatan hari kelahiran dalam kalender Jawa yang merupakan gabungan antara hari dalam seminggu (Senin-Minggu) dan hari pasaran.
          </p>
        </div>

        {/* Card 2: Pasaran */}
        <div className="bg-white/60 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md">
          <div className="w-10 h-10 bg-java-gold/10 text-java-accent rounded-full flex items-center justify-center mb-4">
            <Moon size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Pancawara (Pasaran)</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Siklus 5 hari dalam budaya Jawa: <strong>Legi, Pahing, Pon, Wage,</strong> dan <strong>Kliwon</strong>. Setiap pasaran dipercaya memiliki karakter energi alam yang unik.
          </p>
        </div>

        {/* Card 3: Neptu */}
        <div className="bg-white/60 backdrop-blur-sm border border-stone-200 p-6 rounded-2xl hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md">
          <div className="w-10 h-10 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center mb-4">
            <Hash size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-java-dark mb-2">Nilai Neptu</h3>
          <p className="text-sm text-stone-600 leading-relaxed">
            Angka bernilai khusus dari penjumlahan nilai hari dan pasaran. Neptu digunakan untuk meramal watak, kecocokan jodoh, dan hari baik.
          </p>
        </div>
      </div>

      {/* Tabel Referensi Neptu */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-md">
        <div className="p-5 border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-java-dark flex items-center gap-2">
            <Hash size={18} className="text-java-accent" />
            <span>Kamus Nilai Neptu</span>
          </h3>
          <span className="text-xs text-stone-400 font-medium bg-white border border-stone-200 px-3 py-1 rounded-full">Referensi</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
           {/* Table Hari */}
           <div className="p-6 border-b md:border-b-0 md:border-r border-stone-100">
              <h4 className="font-bold text-stone-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Calendar size={14} />
                 Nilai Hari (Dina)
              </h4>
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 text-stone-600">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold">Nama Hari</th>
                      <th className="py-3 px-4 text-right font-semibold">Neptu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {DAYS.map((item, idx) => (
                       <tr key={item.id} className={`transition-colors hover:bg-stone-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                         <td className="py-2.5 px-4 text-stone-700 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center">
                                  {getDayIcon(item.name)}
                              </div>
                              <span>{item.name}</span>
                            </div>
                         </td>
                         <td className="py-2.5 px-4 text-right font-mono text-java-brown font-bold">{item.neptu}</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>

           {/* Table Pasaran */}
           <div className="p-6">
              <h4 className="font-bold text-stone-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Moon size={14} />
                 Nilai Pasaran
              </h4>
              <div className="overflow-hidden rounded-xl border border-stone-200">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 text-stone-600">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold">Nama Pasaran</th>
                      <th className="py-3 px-4 text-right font-semibold">Neptu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {PASARANS.map((item, idx) => (
                       <tr key={item.id} className={`transition-colors hover:bg-stone-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}`}>
                         <td className="py-2.5 px-4 text-stone-700 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center">
                                  {getPasaranIcon(item.name)}
                              </div>
                              <span>{item.name}</span>
                            </div>
                         </td>
                         <td className="py-2.5 px-4 text-right font-mono text-java-accent font-bold">{item.neptu}</td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};