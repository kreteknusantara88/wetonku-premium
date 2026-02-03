import React from 'react';
import { WetonAnalysis } from '../types';
import { Sparkles, User, Brain, Star, TrendingUp, ShieldAlert, Quote } from 'lucide-react';

interface InterpretationViewProps {
  data: WetonAnalysis;
}

export const InterpretationView: React.FC<InterpretationViewProps> = ({ data }) => {
  const sections = [
    {
      id: 'personality',
      title: 'Karakter & Watak',
      icon: User,
      content: data.personality,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'thinking',
      title: 'Pola Pikir & Sikap',
      icon: Brain,
      content: data.thinkingStyle,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-100'
    },
    {
      id: 'talents',
      title: 'Potensi & Bakat',
      icon: Star,
      content: data.talents,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100'
    },
    {
      id: 'fortune',
      title: 'Peluang Rezeki',
      icon: TrendingUp,
      content: data.fortune,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      id: 'taboos',
      title: 'Hal yang Perlu Diwaspadai',
      icon: ShieldAlert,
      content: data.taboos,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-100'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Badge */}
      <div className="flex items-center justify-center gap-2 mb-8 opacity-80">
        <Sparkles size={16} className="text-java-gold" />
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-java-brown">Analisis Ilmu Titen Jawa</span>
        <Sparkles size={16} className="text-java-gold" />
      </div>

      <div className="grid gap-6">
        {sections.map((section, idx) => (
          <div 
            key={section.id}
            className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 transition-transform group-hover:scale-110 ${section.bg}`}></div>
            
            <div className="flex items-start gap-5 relative z-10">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${section.bg} ${section.color} flex items-center justify-center shadow-sm ring-1 ring-white`}>
                <section.icon size={24} strokeWidth={1.5} />
              </div>
              
              <div className="flex-grow">
                <h3 className={`font-serif font-bold text-lg mb-2 ${section.color} opacity-90`}>
                  {section.title}
                </h3>
                <p className="text-stone-700 leading-relaxed text-sm md:text-base font-medium">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-java-gold/20 flex flex-col items-center justify-center text-center bg-stone-50/50 rounded-xl p-6">
        <Quote className="w-8 h-8 text-java-brown mb-3 rotate-180 opacity-50" />
        <p className="text-sm md:text-base text-java-brown font-medium italic max-w-2xl leading-relaxed">
          "Weton adalah bagian dari <strong>Ilmu Titen</strong> (ilmu pengamatan statistik leluhur), bukan penentu takdir mutlak. Jadikan wawasan ini sebagai bahan introspeksi (muhasabah) untuk memaksimalkan potensi baik dan memperbaiki kekurangan diri. Nasib sejati tetaplah hasil dari doa dan ikhtiar manusia di hadapan Sang Pencipta."
        </p>
      </div>
    </div>
  );
};