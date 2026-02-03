import React, { useState, useEffect } from 'react';
import { UserProfile, WetonResult, JodohResult } from '../types';
import { calculateWeton, calculateJodoh, getDailyDirections, formatDateID } from '../utils/javaneseCalc';
import { User, Calendar, Save, Trash2, Heart, Users, PencilLine, Compass, Navigation, AlertOctagon, Clock, Moon } from 'lucide-react';

interface ProfileViewProps {
  language?: 'id' | 'jv';
  userProfile: UserProfile | null;
  onUpdateProfile: (p: UserProfile | null) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ language = 'id', userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  
  // Friend Comparison State
  const [friendName, setFriendName] = useState('');
  const [friendDate, setFriendDate] = useState('');
  const [friendTime, setFriendTime] = useState('');
  const [compareResult, setCompareResult] = useState<JodohResult | null>(null);

  // Daily Direction State
  const [todayDirections, setTodayDirections] = useState<{ fortune: string; avoid: string; weton: WetonResult } | null>(null);

  // Sync internal state with prop
  useEffect(() => {
    if (userProfile) {
      setNameInput(userProfile.name);
      setDateInput(userProfile.birthDate);
      setTimeInput(userProfile.birthTime || '');
      setTodayDirections(getDailyDirections(new Date()));
      setIsEditing(false);
    } else {
      setIsEditing(true);
      setTodayDirections(null);
    }
  }, [userProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput || !dateInput) return;
    
    const newProfile: UserProfile = { 
      name: nameInput, 
      birthDate: dateInput,
      birthTime: timeInput 
    };
    
    onUpdateProfile(newProfile);
    setIsEditing(false);
    
    // Refresh directions (though they are general, it initializes the view)
    setTodayDirections(getDailyDirections(new Date()));
  };

  const handleDelete = () => {
    if (confirm('Hapus profil? Data riwayat tidak akan hilang, hanya profil ini.')) {
      onUpdateProfile(null);
      setIsEditing(true);
      setNameInput('');
      setDateInput('');
      setTimeInput('');
      setTodayDirections(null);
    }
  };

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !friendDate) return;
    
    const d1 = new Date(userProfile.birthDate);
    const d2 = new Date(friendDate);
    const res = calculateJodoh(d1, userProfile.birthTime || '', d2, friendTime);
    setCompareResult(res);
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in-up max-w-xl mx-auto">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-java-dark mb-2">Buat Profil Weton</h1>
           <p className="text-stone-700 text-sm font-medium">Simpan data Anda untuk akses fitur personalisasi dan wawasan harian.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
           <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-sm font-bold text-java-brown uppercase tracking-wider">Nama Panggilan</label>
                 <div className="relative">
                    <User className="absolute left-4 top-3.5 text-stone-400" size={20} />
                    <input 
                      type="text" 
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none text-stone-800"
                      placeholder="Masukkan nama Anda"
                    />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-java-brown uppercase tracking-wider">Tanggal Lahir</label>
                    <div className="relative">
                       <Calendar className="absolute left-4 top-3.5 text-stone-400" size={20} />
                       <input 
                         type="date" 
                         required
                         value={dateInput}
                         onChange={(e) => setDateInput(e.target.value)}
                         className="w-full pl-12 pr-2 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none text-sm text-stone-800"
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-java-brown uppercase tracking-wider flex items-center gap-1">
                       Jam Lahir <span className="text-[10px] lowercase font-normal opacity-70">(Opsional)</span>
                    </label>
                    <div className="relative">
                       <Clock className="absolute left-4 top-3.5 text-stone-400" size={20} />
                       <input 
                         type="time" 
                         value={timeInput}
                         onChange={(e) => setTimeInput(e.target.value)}
                         className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-java-gold outline-none text-sm text-stone-800"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                 <Moon size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                 <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    <strong>Catatan:</strong> Jika Anda lahir setelah <strong>Maghrib (18:00)</strong>, hari Jawa akan dihitung masuk ke hari berikutnya.
                 </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                 {userProfile && (
                   <button 
                     type="button" 
                     onClick={() => setIsEditing(false)}
                     className="flex-1 py-3 text-stone-500 font-bold hover:bg-stone-50 rounded-xl"
                   >
                     Batal
                   </button>
                 )}
                 <button 
                   type="submit"
                   className="flex-1 py-3 bg-java-dark text-java-gold font-bold rounded-xl shadow-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                 >
                   <Save size={18} /> Simpan Profil
                 </button>
              </div>
           </form>
        </div>
      </div>
    );
  }

  if (!userProfile) return null;

  const weton = calculateWeton(new Date(userProfile.birthDate), userProfile.birthTime);

  return (
    <div className="animate-fade-in-up">
       <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif font-bold text-java-dark">Profil Saya</h1>
          <div className="flex gap-2">
             <button onClick={() => setIsEditing(true)} className="p-2 text-stone-400 hover:text-java-brown hover:bg-white rounded-lg transition-colors">
                <PencilLine size={20} />
             </button>
             <button onClick={handleDelete} className="p-2 text-stone-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors">
                <Trash2 size={20} />
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <div className="md:col-span-1 space-y-6">
             <div className="bg-java-dark text-java-cream rounded-3xl p-8 relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 p-6 opacity-5">
                    <User size={140} />
                 </div>
                 <div className="relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto bg-java-gold text-java-dark rounded-full flex items-center justify-center font-serif text-3xl font-bold mb-4 shadow-lg border-4 border-java-dark">
                       {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-serif font-bold mb-1">{userProfile.name}</h2>
                    <p className="text-sm text-stone-400 mb-6">Lahir: {new Date(userProfile.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                       <div className="text-xs font-bold text-java-gold uppercase tracking-widest mb-1">Weton Anda</div>
                       <div className="text-2xl font-serif font-bold">
                          {weton.day.name} <span className="text-java-gold">{weton.pasaran.name}</span>
                       </div>
                       <div className="text-sm mt-1 opacity-70">Neptu: {weton.totalNeptu}</div>
                       
                       {weton.isAfterMaghrib && (
                          <div className="mt-3 text-[10px] bg-java-gold/20 text-java-gold px-2 py-1 rounded border border-java-gold/30">
                             *Lahir malam, hari Jawa +1
                          </div>
                       )}
                    </div>
                 </div>
             </div>

             {/* Daily Directions Card (NEW) */}
             {todayDirections && (
               <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-3">
                      <Compass size={20} className="text-java-brown" />
                      <h3 className="font-serif font-bold text-java-dark">Arah Energi Hari Ini</h3>
                   </div>
                   
                   <p className="text-xs text-stone-400 mb-4 italic">
                      {todayDirections.weton.day.name} {todayDirections.weton.pasaran.name}, {formatDateID(todayDirections.weton.date)}
                   </p>

                   <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <Navigation size={18} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                             <span className="block text-xs font-bold text-emerald-700 uppercase">Arah Rejeki (Pasaran)</span>
                             <span className="font-bold text-java-dark">{todayDirections.fortune}</span>
                          </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                          <AlertOctagon size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                             <span className="block text-xs font-bold text-red-700 uppercase">Hindari (Nogo Dino)</span>
                             <span className="font-bold text-java-dark">{todayDirections.avoid}</span>
                          </div>
                      </div>
                   </div>
               </div>
             )}
          </div>

          {/* Quick Compare Tool */}
          <div className="md:col-span-2">
             <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center">
                      <Users size={20} />
                   </div>
                   <div>
                      <h3 className="font-serif font-bold text-xl text-java-dark">Cek Kecocokan Cepat</h3>
                      <p className="text-sm text-stone-700 font-medium">Bandingkan weton Anda dengan teman atau pasangan.</p>
                   </div>
                </div>

                <form onSubmit={handleCompare} className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-grow w-full">
                       <label className="text-xs font-bold text-java-brown uppercase mb-1 block">Nama Teman</label>
                       <input 
                         type="text" 
                         value={friendName}
                         onChange={(e) => setFriendName(e.target.value)}
                         className="w-full p-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800"
                         placeholder="Nama..."
                       />
                    </div>
                    <div className="flex-grow w-full">
                       <label className="text-xs font-bold text-java-brown uppercase mb-1 block">Tanggal Lahir Teman</label>
                       <input 
                         type="date" 
                         required
                         value={friendDate}
                         onChange={(e) => setFriendDate(e.target.value)}
                         className="w-full p-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800"
                       />
                    </div>
                    <div className="w-24 flex-shrink-0">
                       <label className="text-xs font-bold text-java-brown uppercase mb-1 block">Jam</label>
                       <input 
                         type="time" 
                         value={friendTime}
                         onChange={(e) => setFriendTime(e.target.value)}
                         className="w-full p-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-800"
                         title="Opsional: Jam lahir"
                       />
                    </div>
                    <button type="submit" className="w-full md:w-auto px-6 py-2.5 bg-java-brown text-white font-bold rounded-lg text-sm hover:bg-java-dark transition-colors">
                       Cek
                    </button>
                </form>

                {compareResult && (
                   <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-white border border-pink-100 flex items-center justify-center animate-fade-in-up">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500">
                           <Heart size={24} fill="currentColor" />
                        </div>
                        <div>
                           <div className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Hasil (Dibagi 8)</div>
                           <div className="text-2xl font-serif font-bold text-java-dark">{compareResult.category}</div>
                           <div className="text-xs text-stone-500 mt-1">
                              {weton.day.name} {weton.pasaran.name} + {compareResult.weton2.day.name} {compareResult.weton2.pasaran.name}
                           </div>
                           {(weton.isAfterMaghrib || compareResult.weton2.isAfterMaghrib) && (
                              <div className="text-[10px] text-pink-600 mt-1 italic">
                                 *Salah satu weton disesuaikan (lahir setelah 18:00)
                              </div>
                           )}
                        </div>
                      </div>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};