import React, { useState, useEffect } from 'react';
import { calculateWeton } from '../utils/javaneseCalc';
import { getWetonInterpretation } from '../services/geminiService';
import { WetonResult, HistoryItem, WetonAnalysis } from '../types';
import { WetonResultCard } from './WetonResultCard';
import { InterpretationView } from './InterpretationView';
import { HistorySection } from './HistorySection';
import { Search, CalendarDays, Clock } from 'lucide-react';

interface CalculatorViewProps {
  language?: 'id' | 'jv';
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({ language = 'id' }) => {
  const [dateInput, setDateInput] = useState<string>('');
  const [timeInput, setTimeInput] = useState<string>('');
  const [wetonResult, setWetonResult] = useState<WetonResult | null>(null);
  const [interpretation, setInterpretation] = useState<WetonAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('weton_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const hydratedHistory = parsed.map((item: any) => ({
          ...item,
          result: {
            ...item.result,
            date: new Date(item.result.date)
          }
        }));
        setHistory(hydratedHistory);
      } catch (error) {
        console.error("Failed to parse history", error);
        localStorage.removeItem('weton_history');
      }
    }
  }, []);

  const saveToHistory = (result: WetonResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      result: result
    };

    setHistory(prev => {
      const isDuplicate = prev.some(item => 
        item.result.date.toISOString().split('T')[0] === result.date.toISOString().split('T')[0]
      );
      
      let newHistory;
      if (isDuplicate) {
        const filtered = prev.filter(item => item.result.date.toISOString().split('T')[0] !== result.date.toISOString().split('T')[0]);
        newHistory = [newItem, ...filtered].slice(0, 5);
      } else {
        newHistory = [newItem, ...prev].slice(0, 5);
      }
      
      localStorage.setItem('weton_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('weton_history');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setWetonResult(item.result);
    const dateStr = item.result.date.toISOString().split('T')[0];
    setDateInput(dateStr);
    setTimeInput(''); // Reset time as history doesn't strictly store it separately in this simple version
    setInterpretation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditHistory = (item: HistoryItem) => {
    // Populate date but do not show result immediately, allowing user to edit
    const dateStr = item.result.date.toISOString().split('T')[0];
    setDateInput(dateStr);
    setWetonResult(null); // Clear result to indicate "Edit Mode"
    setInterpretation(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateInput) return;
    setInterpretation(null);
    const date = new Date(dateInput);
    const result = calculateWeton(date, timeInput);
    setWetonResult(result);
    saveToHistory(result);
  };

  const handleInterpret = async () => {
    if (!wetonResult) return;
    setIsLoading(true);
    const analysis = await getWetonInterpretation(wetonResult, language as 'id' | 'jv');
    setInterpretation(analysis);
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-java-dark mb-4">
          {language === 'jv' ? 'Peta Potensi Dhiri' : 'Peta Potensi Diri'}
        </h1>
        <p className="text-java-brown font-medium max-w-lg mx-auto leading-relaxed text-lg">
          {language === 'jv' 
            ? "Munggunakaken petungan Weton minangka sarana kangge mangertosi watak lan potensi panjenengan."
            : "Gunakan perhitungan Weton sebagai alat refleksi untuk memahami karakter dasar dan potensi tersembunyi Anda."
          }
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-stone-200/50 p-2 border border-white mb-10 transform transition-all hover:scale-[1.01] duration-500">
        <form onSubmit={handleCalculate} className="flex flex-col md:flex-row gap-2 bg-stone-50 rounded-2xl p-2 border border-stone-100">
          <div className="flex-grow flex gap-2">
            <div className="flex-grow relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-java-accent transition-colors">
                <CalendarDays size={20} />
              </div>
              <input
                type="date"
                id="birthdate"
                required
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 font-medium focus:ring-0 text-lg rounded-xl transition-all"
                placeholder={language === 'jv' ? "Pilih Tanggal Wiyosan" : "Pilih Tanggal Lahir"}
              />
            </div>
            
            {/* Optional Time Input */}
             <div className="w-32 relative group border-l border-stone-200">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-java-accent transition-colors">
                <Clock size={20} />
              </div>
              <input
                type="time"
                id="birthtime"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none outline-none text-stone-800 placeholder-stone-400 font-medium focus:ring-0 text-lg rounded-xl transition-all"
                title="Jam Lahir (Opsional)"
              />
            </div>
          </div>

          <div className="flex-shrink-0">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 bg-java-dark hover:bg-stone-800 text-java-gold font-bold rounded-xl transition-all shadow-lg shadow-stone-900/10 hover:shadow-stone-900/20 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Search size={20} className="group-hover:scale-110 transition-transform" />
              <span className="tracking-wide">Analisis</span>
            </button>
          </div>
        </form>
        <p className="text-center text-[10px] text-stone-500 mt-2 pb-2 font-medium">
            *Jam lahir opsional. Jika lahir ≥ 18:00 (Maghrib), hari Jawa dihitung masuk ke hari berikutnya.
        </p>
      </div>

      {/* Result Section */}
      {wetonResult && (
        <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          
          {wetonResult.isAfterMaghrib && (
             <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-xl border border-blue-100 text-sm text-center">
                 💡 <strong>Info:</strong> Karena jam lahir setelah 18:00 (Maghrib), perhitungan weton masuk ke hari berikutnya.
             </div>
          )}

          <WetonResultCard 
            result={wetonResult} 
            onInterpret={handleInterpret}
            isLoading={isLoading}
            hasInterpreted={!!interpretation}
          />

          {/* AI Output Section */}
          {interpretation && (
            <div className="mt-8">
               <InterpretationView data={interpretation} />
            </div>
          )}
        </div>
      )}

      {/* History Section */}
      <HistorySection 
        history={history} 
        onSelect={handleSelectHistory} 
        onEdit={handleEditHistory}
        onClear={handleClearHistory} 
      />
    </div>
  );
};