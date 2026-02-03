import React from 'react';
import { X, Sparkles, Code2, PenTool, Flower } from 'lucide-react';

interface AppInfoModalProps {
  onClose: () => void;
}

export const AppInfoModal: React.FC<AppInfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl animate-fade-in-up">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-java-dark to-stone-800"></div>
        <div className="absolute top-0 right-0 p-6 opacity-10 text-white pointer-events-none">
            <Flower size={120} />
        </div>

        {/* Close Button - Increased z-index to 50 to sit above content */}
        <button 
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 p-8 pt-10">
           {/* Header */}
           <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center p-1 border-4 border-java-gold text-java-brown">
                  <Flower size={48} />
              </div>
           </div>

           <div className="text-center mb-8">
              <h2 className="font-serif font-bold text-2xl text-java-dark">WetonKu</h2>
              <p className="text-xs font-bold text-java-gold uppercase tracking-[0.2em] mb-3">Kearifan Jawa Digital</p>
              <p className="text-stone-700 text-sm leading-relaxed font-medium">
                Sebuah upaya melestarikan warisan leluhur (Ilmu Titen) melalui teknologi. Aplikasi ini dirancang untuk membantu Anda mengenali potensi diri, menjaga harmoni, dan melangkah dengan kesadaran penuh.
              </p>
           </div>

           {/* Credits Section */}
           <div className="space-y-4 border-t border-stone-200 pt-6">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Code2 size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Dikembangkan Oleh</div>
                    <div className="font-serif font-bold text-java-dark text-lg">Abinaya AI Studio</div>
                 </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                 <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <PenTool size={20} />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Desain UI/UX Oleh</div>
                    <div className="font-serif font-bold text-java-dark text-lg">Adhitya Indra Nugroho</div>
                 </div>
              </div>
           </div>

           <div className="mt-8 text-center">
              <p className="text-[10px] text-stone-500 font-bold">
                Versi 1.0.0 &copy; {new Date().getFullYear()}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};