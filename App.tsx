import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { CalculatorView } from './components/CalculatorView';
import { JodohView } from './components/JodohView';
import { HariBaikView } from './components/HariBaikView';
import { RejekiView } from './components/RejekiView';
import { AuraView } from './components/AuraView';
import { ProfileView } from './components/ProfileView';
import { KalenderView } from './components/KalenderView';
import { AppInfoModal } from './components/AppInfoModal';
import { Info, RotateCcw, FileDown, FileText, Sheet, FileType2, Database, Upload, Download, FileType, ExternalLink, Sparkles } from 'lucide-react';
import { exportToTXT, exportToXLS, exportToPDF, exportToJSON, importFromJSON, exportToDOC, openReportInNewTab } from './utils/exporter';
import { UserProfile } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'jodoh' | 'haribaik' | 'rejeki' | 'aura' | 'profile' | 'kalender'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showBackupMenu, setShowBackupMenu] = useState(false);
  const [language, setLanguage] = useState<'id' | 'jv'>('id');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const handleUpdateProfile = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem('user_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('user_profile');
      localStorage.removeItem('daily_insight'); // Clear cache when profile removed
    }
  };

  const handleResetApp = () => {
    if (window.confirm(language === 'jv' 
      ? "Menapa panjenengan yakin badhe ngreset aplikasi? Sedaya data profil lan riwayat badhe ical." 
      : "Apakah Anda yakin ingin mereset aplikasi? Semua data profil, riwayat, dan input akan dihapus.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleRestoreClick = () => {
     fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file) {
        importFromJSON(file, (success) => {
           if (success) {
              alert(language === 'jv' ? "Data kasil dipun pulihaken!" : "Data berhasil dipulihkan!");
              window.location.reload();
           } else {
              alert(language === 'jv' ? "Gagal mulihaken data." : "Gagal memulihkan data. Format file mungkin salah.");
           }
        });
     }
  };

  return (
    <div className="min-h-screen font-sans bg-java-bg selection:bg-java-gold selection:text-white pb-0 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        onNavigate={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 md:pt-0 min-h-screen transition-all duration-300 relative overflow-x-hidden ukiran-bg flex flex-col">
        
        {/* Action Buttons Container 
            Mobile: Relative positioning (in flow), pushed content down.
            Desktop: Absolute positioning (top right).
        */}
        <div className="w-full flex justify-end items-center gap-2 px-4 py-4 md:absolute md:top-8 md:right-8 md:w-auto md:p-0 z-20">
          
          {/* Backup/Restore Group */}
          <div className="relative group" onMouseEnter={() => setShowBackupMenu(true)} onMouseLeave={() => setShowBackupMenu(false)}>
             <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={handleFileChange}
             />
             <button 
                className="p-2 bg-white/80 backdrop-blur hover:bg-violet-50 text-stone-400 hover:text-violet-600 rounded-full shadow-sm hover:shadow-md border border-stone-200 transition-all duration-300"
                title="Backup / Restore Data"
                onClick={() => setShowBackupMenu(!showBackupMenu)}
             >
                <Database size={18} />
             </button>

             {/* Backup Options Dropdown */}
             <div className={`absolute top-full right-0 mt-2 flex flex-col gap-2 transition-all duration-300 origin-top-right z-30 ${showBackupMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                <button 
                    onClick={exportToJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-violet-50 hover:text-violet-700 whitespace-nowrap"
                >
                    <Download size={14} className="text-violet-500" />
                    <span>Backup JSON</span>
                </button>
                <button 
                    onClick={handleRestoreClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-violet-50 hover:text-violet-700 whitespace-nowrap"
                >
                    <Upload size={14} className="text-violet-500" />
                    <span>Restore JSON</span>
                </button>
             </div>
          </div>

          {/* Export Group */}
          <div className="relative group" onMouseEnter={() => setShowExportMenu(true)} onMouseLeave={() => setShowExportMenu(false)}>
            <button 
              className="p-2 bg-white/80 backdrop-blur hover:bg-emerald-50 text-stone-400 hover:text-emerald-600 rounded-full shadow-sm hover:shadow-md border border-stone-200 transition-all duration-300"
              title="Export Laporan"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <FileDown size={18} />
            </button>
            
            {/* Export Options Dropdown */}
            <div className={`absolute top-full right-0 mt-2 flex flex-col gap-2 transition-all duration-300 origin-top-right z-30 ${showExportMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
               <button 
                  onClick={openReportInNewTab}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap"
               >
                  <ExternalLink size={14} className="text-indigo-500" />
                  <span>Lihat Laporan</span>
               </button>
               <button 
                  onClick={exportToTXT}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-800 whitespace-nowrap"
               >
                  <FileText size={14} className="text-stone-400" />
                  <span>TXT</span>
               </button>
               <button 
                  onClick={exportToDOC}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap"
               >
                  <FileType size={14} className="text-blue-500" />
                  <span>DOC (Word)</span>
               </button>
               <button 
                  onClick={exportToXLS}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-green-50 hover:text-green-700 whitespace-nowrap"
               >
                  <Sheet size={14} className="text-green-500" />
                  <span>XLS</span>
               </button>
               <button 
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-lg border border-stone-100 text-xs font-bold text-stone-600 hover:bg-red-50 hover:text-red-700 whitespace-nowrap"
               >
                  <FileType2 size={14} className="text-red-500" />
                  <span>PDF</span>
               </button>
            </div>
          </div>

          <div className="flex gap-2">
             {/* Reset Button */}
            <button 
              onClick={handleResetApp}
              className="p-2 bg-white/80 backdrop-blur hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-full shadow-sm hover:shadow-md border border-stone-200 transition-all duration-300 group"
              title={language === 'jv' ? "Wangsulaken Aplikasi (Reset)" : "Reset Aplikasi"}
            >
              <RotateCcw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
            </button>

            {/* App Info Trigger Button */}
            <button 
              onClick={() => setShowInfo(true)}
              className="p-2 bg-white/80 backdrop-blur hover:bg-white text-stone-400 hover:text-java-gold rounded-full shadow-sm hover:shadow-md border border-stone-200 transition-all duration-300 group"
              title="Tentang Aplikasi"
            >
              <Info size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:py-12 relative z-10 flex-grow w-full">
          
          {/* 
            View Persistence Logic:
            Using 'hidden' class instead of conditional rendering ensures 
            components remain mounted and retain their state (inputs, results) 
            when switching tabs. 
          */}
          
          <div className={activeTab === 'home' ? 'block' : 'hidden'}>
            <HomeView 
               onNavigateToProfile={() => setActiveTab('profile')} 
               language={language}
               userProfile={userProfile} 
            />
          </div>

          <div className={activeTab === 'profile' ? 'block' : 'hidden'}>
            <ProfileView 
               language={language} 
               userProfile={userProfile}
               onUpdateProfile={handleUpdateProfile}
            />
          </div>

          <div className={activeTab === 'calculator' ? 'block' : 'hidden'}>
            <CalculatorView language={language} />
          </div>

          <div className={activeTab === 'jodoh' ? 'block' : 'hidden'}>
            <JodohView language={language} />
          </div>

          <div className={activeTab === 'rejeki' ? 'block' : 'hidden'}>
            <RejekiView language={language} />
          </div>

          <div className={activeTab === 'haribaik' ? 'block' : 'hidden'}>
            <HariBaikView language={language} />
          </div>

          <div className={activeTab === 'aura' ? 'block' : 'hidden'}>
            <AuraView language={language} />
          </div>

          <div className={activeTab === 'kalender' ? 'block' : 'hidden'}>
            <KalenderView language={language} />
          </div>

        </div>

        {/* Footer (Digital Edition & Copyright) - Moved from Sidebar */}
        <footer className="w-full py-6 text-center relative z-10 mt-auto">
            <div className="inline-block p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-stone-200/50 hover:bg-white/60 transition-all duration-500 hover:shadow-sm group cursor-default">
               <p className="text-xs font-bold text-java-brown uppercase tracking-wider flex items-center justify-center gap-1.5 mb-1.5">
                  <Sparkles size={12} className="text-java-gold group-hover:rotate-12 transition-transform" />
                  {language === 'id' ? 'Edisi Digital' : 'Edisi Digital'}
               </p>
               <p className="text-[10px] text-stone-600 mb-1.5 italic">
                  {language === 'id' ? 'Melestarikan budaya dengan teknologi.' : 'Nguri-uri kabudayan kanthi teknologi.'}
               </p>
               <p className="text-[10px] text-stone-400 font-medium">
                 &copy; 2026 WetonKu App
               </p>
            </div>
        </footer>

        {/* Modal */}
        {showInfo && <AppInfoModal onClose={() => setShowInfo(false)} />}
      </main>

    </div>
  );
}

export default App;