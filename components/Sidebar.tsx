import React from 'react';
import { 
  Home, 
  Sparkles, 
  Flower, 
  Menu, 
  X, 
  HeartHandshake, 
  CalendarDays, 
  Sun, 
  UserCircle2, 
  Fingerprint,
  Wallet,
  ScrollText,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'home' | 'calculator' | 'jodoh' | 'haribaik' | 'rejeki' | 'aura' | 'profile' | 'kalender';
  onNavigate: (tab: 'home' | 'calculator' | 'jodoh' | 'haribaik' | 'rejeki' | 'aura' | 'profile' | 'kalender') => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  language: 'id' | 'jv';
  setLanguage: (lang: 'id' | 'jv') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onNavigate,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  language,
  setLanguage
}) => {
  
  // Dictionary for menu items
  const menuDict = {
    home: { id: 'Beranda', jv: 'Pendhapa' },
    profile: { id: 'Profil', jv: 'Jati Diri' },
    calculator: { id: 'Cek Weton', jv: 'Niti Watak' },
    aura: { id: 'Aura', jv: 'Cahya Urip' },
    rejeki: { id: 'Rejeki', jv: 'Sandhang Pangan' },
    jodoh: { id: 'Jodoh', jv: 'Tresna' },
    haribaik: { id: 'Hari Baik', jv: 'Dina Becik' },
    kalender: { id: 'Kalender', jv: 'Tanggalan' },
    mainMenu: { id: 'Menu Utama', jv: 'Daftar Utama' },
    selfKnow: { id: 'Kenali Diri', jv: 'Kawruh Jiwa' },
    harmony: { id: 'Harmoni', jv: 'Memayu Hayuning' },
    kearifan: { id: 'Kearifan Jawa', jv: 'Kawruh Jawi' }
  };

  // Configuration for colors and styles per tab
  const getTabStyle = (id: string) => {
    switch (id) {
      case 'home': return { 
        activeBg: 'bg-gradient-to-r from-sky-600 to-blue-600', 
        shadow: 'shadow-blue-500/30', 
        iconColor: 'text-sky-500', 
        hoverBg: 'group-hover:bg-sky-50',
        activeText: 'text-white'
      };
      case 'profile': return { 
        activeBg: 'bg-gradient-to-r from-indigo-600 to-violet-600', 
        shadow: 'shadow-indigo-500/30', 
        iconColor: 'text-indigo-500', 
        hoverBg: 'group-hover:bg-indigo-50',
        activeText: 'text-white'
      };
      case 'kalender': return { 
        activeBg: 'bg-gradient-to-r from-emerald-600 to-teal-600', 
        shadow: 'shadow-emerald-500/30', 
        iconColor: 'text-emerald-500', 
        hoverBg: 'group-hover:bg-emerald-50',
        activeText: 'text-white'
      };
      case 'calculator': return { 
        activeBg: 'bg-gradient-to-r from-java-brown to-amber-700', 
        shadow: 'shadow-amber-900/30', 
        iconColor: 'text-java-brown', 
        hoverBg: 'group-hover:bg-orange-50',
        activeText: 'text-white'
      };
      case 'aura': return { 
        activeBg: 'bg-gradient-to-r from-fuchsia-600 to-pink-600', 
        shadow: 'shadow-fuchsia-500/30', 
        iconColor: 'text-fuchsia-500', 
        hoverBg: 'group-hover:bg-fuchsia-50',
        activeText: 'text-white'
      };
      case 'rejeki': return { 
        activeBg: 'bg-gradient-to-r from-amber-500 to-yellow-600', 
        shadow: 'shadow-amber-500/30', 
        iconColor: 'text-amber-600', 
        hoverBg: 'group-hover:bg-amber-50',
        activeText: 'text-white'
      };
      case 'jodoh': return { 
        activeBg: 'bg-gradient-to-r from-rose-500 to-red-600', 
        shadow: 'shadow-rose-500/30', 
        iconColor: 'text-rose-500', 
        hoverBg: 'group-hover:bg-rose-50',
        activeText: 'text-white'
      };
      case 'haribaik': return { 
        activeBg: 'bg-gradient-to-r from-teal-500 to-cyan-600', 
        shadow: 'shadow-teal-500/30', 
        iconColor: 'text-teal-600', 
        hoverBg: 'group-hover:bg-teal-50',
        activeText: 'text-white'
      };
      default: return { 
        activeBg: 'bg-stone-800', 
        shadow: 'shadow-stone-500/30', 
        iconColor: 'text-stone-500', 
        hoverBg: 'group-hover:bg-stone-100',
        activeText: 'text-white'
      };
    }
  };

  const navGroups = [
    {
      title: language === 'id' ? menuDict.mainMenu.id : menuDict.mainMenu.jv,
      items: [
        { id: 'home', label: language === 'id' ? menuDict.home.id : menuDict.home.jv, icon: Home },
        { id: 'profile', label: language === 'id' ? menuDict.profile.id : menuDict.profile.jv, icon: UserCircle2 },
        { id: 'kalender', label: language === 'id' ? menuDict.kalender.id : menuDict.kalender.jv, icon: Calendar },
      ]
    },
    {
      title: language === 'id' ? menuDict.selfKnow.id : menuDict.selfKnow.jv,
      items: [
        { id: 'calculator', label: language === 'id' ? menuDict.calculator.id : menuDict.calculator.jv, icon: Fingerprint },
        { id: 'aura', label: language === 'id' ? menuDict.aura.id : menuDict.aura.jv, icon: Sun },
        { id: 'rejeki', label: language === 'id' ? menuDict.rejeki.id : menuDict.rejeki.jv, icon: Wallet },
      ]
    },
    {
      title: language === 'id' ? menuDict.harmony.id : menuDict.harmony.jv,
      items: [
        { id: 'jodoh', label: language === 'id' ? menuDict.jodoh.id : menuDict.jodoh.jv, icon: HeartHandshake },
        { id: 'haribaik', label: language === 'id' ? menuDict.haribaik.id : menuDict.haribaik.jv, icon: CalendarDays },
      ]
    }
  ] as const;

  return (
    <>
      {/* Mobile Header / Toggle - Dark Blue #052659 */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#052659] border-b border-white/10 flex items-center justify-between px-4 z-50 shadow-md">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-java-gold text-java-dark rounded-lg flex items-center justify-center">
             <Flower size={18} strokeWidth={2} />
           </div>
           <span className="font-serif font-bold text-lg text-white">Weton<span className="text-java-gold">Ku</span></span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Container - Solid Dark Blue #052659 */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#052659] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 
        md:sticky md:top-0 md:h-screen flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        
        {/* Logo Area (Desktop) */}
        <div className="flex flex-col items-center justify-center py-10 px-4 border-b border-white/10 relative overflow-hidden flex-shrink-0 group">
           {/* Subtle background decoration */}
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700 text-white">
              <Flower size={120} className="animate-spin-slow" />
           </div>

           <div className="w-20 h-20 bg-gradient-to-br from-[#0a3a80] to-[#021024] text-java-gold rounded-3xl flex items-center justify-center shadow-xl shadow-black/20 mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10 border border-white/10">
             <Flower size={48} strokeWidth={1.5} className="group-hover:animate-pulse" />
           </div>
           
           <div className="flex flex-col items-center w-full relative z-10">
             <span className="font-serif font-bold text-6xl tracking-tighter text-white leading-none w-full text-center drop-shadow-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-java-gold transition-all duration-500">
                Weton<span className="text-java-gold">Ku</span>
             </span>
             <div className="h-1 w-24 bg-java-gold rounded-full mt-4 mb-3 group-hover:w-32 transition-all duration-500"></div>
             <span className="text-[10px] text-stone-400 font-bold tracking-[0.3em] uppercase group-hover:text-java-gold transition-colors">
               {language === 'id' ? menuDict.kearifan.id : menuDict.kearifan.jv}
             </span>
           </div>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          
          {/* Language Toggle */}
          <div className="px-4 mb-2">
            <div className="bg-black/20 p-1.5 rounded-2xl flex relative shadow-inner border border-white/5">
               <button 
                 onClick={() => setLanguage('id')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${language === 'id' ? 'bg-white text-java-dark shadow-sm scale-100' : 'text-stone-400 hover:text-white scale-95'}`}
               >
                 <span className="text-base">🇮🇩</span> IND
               </button>
               <button 
                 onClick={() => setLanguage('jv')}
                 className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${language === 'jv' ? 'bg-java-gold text-java-dark shadow-sm scale-100' : 'text-stone-400 hover:text-white scale-95'}`}
               >
                 <span className="text-base">ꦗ</span> JAWA
               </button>
            </div>
            <p className="text-[10px] text-center mt-2 text-stone-400 font-medium">
               {language === 'jv' ? 'Mode Basa Jawi (Krama Inggil)' : 'Mode Bahasa Indonesia'}
            </p>
          </div>

          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="relative">
              <h3 className="px-4 text-[10px] font-extrabold text-stone-400 uppercase tracking-widest mb-3 font-sans flex items-center gap-2">
                {groupIdx === 1 && <ScrollText size={12} />}
                {groupIdx === 2 && <Sparkles size={12} />}
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const style = getTabStyle(item.id);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                        ${isActive 
                          ? `${style.activeBg} ${style.activeText} ${style.shadow} shadow-lg scale-[1.02]` 
                          : `text-stone-300 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/5`
                        }
                      `}
                    >
                      {/* Interactive Hover Background for non-active */}
                      {!isActive && (
                        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 bg-white/5`}></div>
                      )}

                      {/* Icon Container */}
                      <div className={`
                         relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                         ${isActive ? 'bg-white/20 text-white' : `bg-white/5 text-stone-300 group-hover:bg-white/20 group-hover:text-white`}
                      `}>
                         <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-300 group-hover:rotate-12" />
                      </div>
                      
                      <span className={`relative z-10 font-medium tracking-wide text-sm transition-all duration-300 ${isActive ? 'font-bold' : 'group-hover:translate-x-1'}`}>
                        {item.label}
                      </span>
                      
                      {/* Active Indicator Dot */}
                      {isActive && (
                        <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse shadow-md"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};