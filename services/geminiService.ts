import { GoogleGenAI, Type } from "@google/genai";
import { WetonResult, WetonAnalysis, JodohResult, JodohAnalysis, HariBaikRecommendation, WeddingRecommendation, RejekiAnalysis, AuraAnalysis, DailyInsight } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageInstruction = (lang: 'id' | 'jv') => {
  if (lang === 'jv') {
    return "Gunakan Bahasa Jawa Krama Inggil (Basa Jawa Halus) yang sangat sopan, bijak, dan berwibawa layaknya sesepuh Keraton. Jangan gunakan bahasa ngoko.";
  }
  return "Gunakan Bahasa Indonesia yang berwibawa, bijak, dan sedikit sentuhan sastra namun mudah dipahami.";
};

export const getWetonInterpretation = async (weton: WetonResult, lang: 'id' | 'jv' = 'id'): Promise<WetonAnalysis | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const prompt = `
      Analisis mendalam untuk Weton: ${weton.day.name} ${weton.pasaran.name}.
      Neptu: ${weton.totalNeptu} (${weton.day.name}: ${weton.day.neptu} + ${weton.pasaran.name}: ${weton.pasaran.neptu}).
      
      Sebagai ahli Primbon Jawa sepuh, berikan analisis mendalam dalam 5 aspek spesifik berikut:
      1. Sifat kepribadian (Watak dasar, aura positif/negatif).
      2. Cara berpikir & bersikap (Mentalitas, cara mengambil keputusan, interaksi sosial).
      3. Bakat alami (Potensi terpendam, bidang keahlian yang cocok).
      4. Cara rezeki datang (Pola keberuntungan, jenis pekerjaan/usaha yang membawa kekayaan).
      5. Pantangan (Hari naas/sial, kebiasaan buruk yang harus dihindari, arah sial).

      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality: { 
              type: Type.STRING, 
              description: "Sifat kepribadian, watak dasar, dan aura." 
            },
            thinkingStyle: { 
              type: Type.STRING, 
              description: "Cara berpikir, mentalitas, dan sikap sosial." 
            },
            talents: { 
              type: Type.STRING, 
              description: "Bakat alami dan potensi karir." 
            },
            fortune: { 
              type: Type.STRING, 
              description: "Pola rezeki dan pekerjaan yang cocok." 
            },
            taboos: { 
              type: Type.STRING, 
              description: "Pantangan, hari naas, dan hal yang harus dihindari." 
            },
          },
          required: ["personality", "thinkingStyle", "talents", "fortune", "taboos"],
        },
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WetonAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getJodohInterpretation = async (result: JodohResult, lang: 'id' | 'jv' = 'id'): Promise<JodohAnalysis | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    
    // Inject cultural context for specific categories to ensure nuanced AI response
    let categoryContext = "";
    if (result.category === 'Ratu') {
      categoryContext = "NOTE KHUSUS: Kategori 'Ratu' (Sisa 2) bermakna pasangan ini akan sangat disegani, dihormati layaknya raja ratu, dan harmonis. Tekankan aspek kemuliaan dan kehormatan sosial dalam analisis.";
    } else if (result.category === 'Jodoh') {
      categoryContext = "NOTE KHUSUS: Kategori 'Jodoh' (Sisa 3) bermakna memang sudah suratan takdir, saling menerima kelebihan/kekurangan, dan rukun sampai tua. Tekankan aspek ikatan batin yang kuat.";
    } else if (result.category === 'Topo') {
      categoryContext = "NOTE KHUSUS: Kategori 'Topo' (Sisa 4) bermakna 'Bertapa'. Awal pernikahan akan mengalami ujian (ekonomi/adaptasi), tapi jika kuat 'prihatin' di awal, akan sukses besar dan bahagia di akhir. Tekankan pentingnya kesabaran di masa awal.";
    }

    const prompt = `
      Analisis Kecocokan Jodoh Primbon Jawa (Metode Bagi 8).
      
      Pihak 1: ${result.weton1.day.name} ${result.weton1.pasaran.name} (Neptu ${result.weton1.totalNeptu})
      Pihak 2: ${result.weton2.day.name} ${result.weton2.pasaran.name} (Neptu ${result.weton2.totalNeptu})
      
      Total Neptu Gabungan: ${result.totalCombinedNeptu}.
      Sisa Pembagian 8: ${result.remainder}.
      Kategori Primbon: ${result.category}.
      
      ${categoryContext}
      
      Tugas:
      1. Jelaskan makna filosofis dari kategori "${result.category}" dalam konteks rumah tangga secara mendalam dan bijak.
      2. Berikan saran konkret (nasihat) bagaimana pasangan ini sebaiknya menyikapi hubungan mereka agar langgeng.
      3. Berikan skor kecocokan estimasi (0-100).

      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meaning: { type: Type.STRING, description: "Makna kategori jodoh." },
            advice: { type: Type.STRING, description: "Saran dan nasihat." },
            compatibilityScore: { type: Type.NUMBER, description: "Skor kecocokan 0-100." }
          },
          required: ["meaning", "advice", "compatibilityScore"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as JodohAnalysis;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error (Jodoh):", error);
    return null;
  }
}

export const getHariBaikRecommendations = async (weton: WetonResult, month: number, year: number, lang: 'id' | 'jv' = 'id'): Promise<HariBaikRecommendation | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(year, month, 1));
    const prompt = `
      Sebagai ahli Primbon Jawa, berikan rekomendasi tanggal baik (Hari Baik) untuk bulan ${monthName} tahun ${year}.
      
      User Weton: ${weton.day.name} ${weton.pasaran.name} (Neptu ${weton.totalNeptu}).
      
      Tolong pilihkan tanggal-tanggal spesifik di bulan ${monthName} ${year} yang paling bagus untuk:
      1. Pernikahan / Hajatan Besar
      2. Memulai Usaha / Bisnis / Berdagang
      3. Pindah Rumah
      4. Mulai Bekerja / Melamar Kerja
      5. Hari Naas yang wajib dihindari (berdasarkan hitungan Dino Ringkel, Tali Wangke, atau Sampar Wangke umum).

      Format output JSON array string (contoh: ["10 Mei - Senin Pahing", "15 Mei - Sabtu Wage"]).
      INSTRUKSI BAHASA: Output tanggal boleh standar, tapi jika ada penjelasan tambahan gunakan bahasa yang diminta: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marriage: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tanggal baik pernikahan" },
            business: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tanggal baik usaha" },
            moving: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tanggal baik pindah rumah" },
            work: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tanggal baik kerja" },
            avoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Hari naas/buruk" },
          },
          required: ["marriage", "business", "moving", "work", "avoid"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as HariBaikRecommendation;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error (Hari Baik):", error);
    return null;
  }
};

export const getWeddingDateRecommendations = async (weton1: WetonResult, weton2: WetonResult, lang: 'id' | 'jv' = 'id'): Promise<WeddingRecommendation | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const today = new Date();
    const prompt = `
      Carikan tanggal pernikahan terbaik (Dewasa Ayu) untuk pasangan berikut:
      Pihak 1: ${weton1.day.name} ${weton1.pasaran.name}
      Pihak 2: ${weton2.day.name} ${weton2.pasaran.name}
      Tanggal akses hari ini: ${today.toLocaleDateString('id-ID')}
      
      Tugas Analisis Primbon:
      1. Tentukan 1 tanggal TERDEKAT dari hari ini yang energinya SANGAT BAIK.
      2. Tentukan 3 tanggal alternatif lain dalam 6 bulan ke depan yang baik.
      3. Tentukan hari/pasaran pantangan (Naas/Dino Ringkel/Gehing) yang mutlak harus dihindari.
      
      Untuk setiap tanggal baik, jelaskan KENAPA hari itu baik (misal: "Jatuh pada hitungan Wasesa Segara").
      Untuk hari buruk, jelaskan KENAPA buruk dan AKIBATNYA jika dilanggar (misal: "Tali Wangke, bisa menyebabkan sakit keras/perpisahan").

      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nearestGoodDate: {
               type: Type.OBJECT,
               properties: {
                  date: { type: Type.STRING, description: "Tanggal Masehi, misal: 12 Oktober 2024" },
                  dayName: { type: Type.STRING, description: "Hari Pasaran, misal: Sabtu Legi" },
                  reason: { type: Type.STRING, description: "Alasan filosofis kenapa baik." }
               }
            },
            goodDates: { 
              type: Type.ARRAY, 
              items: { 
                 type: Type.OBJECT,
                 properties: {
                    date: { type: Type.STRING },
                    dayName: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "Penjelasan kenapa hari ini dipilih" }
                 }
              }, 
              description: "Daftar tanggal alternatif" 
            },
            avoidDates: { 
              type: Type.ARRAY, 
              items: { 
                 type: Type.OBJECT,
                 properties: {
                    date: { type: Type.STRING, description: "Bisa spesifik tanggal atau umum (misal: Setiap Jumat Kliwon)" },
                    dayName: { type: Type.STRING },
                    reason: { type: Type.STRING, description: "Jenis pantangan (Gehing/Sanggar Waringin)" },
                    impact: { type: Type.STRING, description: "Akibat/konsekuensi jika dilanggar" }
                 }
              }, 
              description: "Daftar hari yang harus dihindari" 
            },
            generalAdvice: { 
              type: Type.STRING, 
              description: "Nasihat umum pernikahan." 
            }
          },
          required: ["nearestGoodDate", "goodDates", "avoidDates", "generalAdvice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as WeddingRecommendation;
    }
    return null;

  } catch (error) {
    console.error("Gemini API Error (Wedding Recommendations):", error);
    return null;
  }
};

export const getRejekiInterpretation = async (weton: WetonResult, lang: 'id' | 'jv' = 'id'): Promise<RejekiAnalysis | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const prompt = `
      Analisis Rejeki dan Pekerjaan (Karir) berdasarkan Primbon Jawa Weton.
      
      Weton: ${weton.day.name} ${weton.pasaran.name}
      Neptu: ${weton.totalNeptu} (${weton.day.name}: ${weton.day.neptu} + ${weton.pasaran.name}: ${weton.pasaran.neptu})
      
      Sebagai ahli Primbon, berikan analisis spesifik:
      1. Pola Rejeki: Jelaskan siklus dan karakter rejeki weton ini (Apakah cepat, lambat, pasang surut, atau stabil? Arah rejeki dari mana?).
      2. Jenis Usaha & Pekerjaan: Sebutkan 5-7 bidang pekerjaan atau usaha yang paling cocok dan membawa keberuntungan (Hoki) bagi weton ini.
      3. Falsafah Rejeki: Berikan nasihat spiritual Jawa (laku prihatin atau cara menjaga) agar rejeki tetap lancar dan berkah.
      
      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fortunePattern: { type: Type.STRING, description: "Analisis pola dan siklus rejeki." },
            suitableCareers: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar pekerjaan/usaha yang cocok." },
            wealthMaintenance: { type: Type.STRING, description: "Tips spiritual menjaga rejeki." },
          },
          required: ["fortunePattern", "suitableCareers", "wealthMaintenance"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RejekiAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Rejeki):", error);
    return null;
  }
};

export const getAuraAnalysis = async (weton: WetonResult, lang: 'id' | 'jv' = 'id'): Promise<AuraAnalysis | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const prompt = `
      Analisis Aura, Energi Spiritual, dan Laku Hidup berdasarkan Weton (Primbon Jawa).
      
      Weton: ${weton.day.name} ${weton.pasaran.name}
      Neptu: ${weton.totalNeptu}
      
      Tugas: Berikan analisis yang filosofis, positif, dan mendidik (BUKAN klenik/mistik berlebihan). Fokus pada pengembangan diri dan keselarasan dengan alam.
      
      1. Profil Aura: Gambarkan "warna" atau "karakter" energi orang ini menggunakan metafora alam (misal: "Bagaikan Matahari Pagi yang menghangatkan" atau "Seperti Samudra yang dalam").
      2. Kecenderungan Keberuntungan: Bagaimana energi mereka menarik hal positif? Kapan momen energi terbaik mereka?
      3. Saran Laku Hidup (Tirakat Ringan): Berikan saran kebiasaan positif atau "laku" sederhana yang sesuai adat Jawa untuk menyeimbangkan diri (Contoh: "Rajin bangun pagi untuk menyerap udara segar", "Meditasi/hening cipta sejenak di malam hari", "Puasa bicara hal buruk", atau "Gemar bersedekah pada hari kelahiran"). Hindari saran yang aneh-aneh.
      4. Elemen Dominan: Tentukan satu elemen alam yang paling mewakili jiwa mereka (Api / Air / Angin / Tanah / Kayu).

      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            auraProfile: { type: Type.STRING, description: "Deskripsi metafora aura dan energi." },
            luckTendency: { type: Type.STRING, description: "Pola keberuntungan dan energi positif." },
            spiritualAdvice: { type: Type.STRING, description: "Saran laku tirakat/kebiasaan positif." },
            element: { type: Type.STRING, description: "Elemen alam dominan." },
          },
          required: ["auraProfile", "luckTendency", "spiritualAdvice", "element"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AuraAnalysis;
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Aura):", error);
    return null;
  }
};

export const getDailyInsight = async (userWeton: WetonResult, todayWeton: WetonResult, lang: 'id' | 'jv' = 'id'): Promise<DailyInsight | null> => {
  try {
    const langInstruction = getLanguageInstruction(lang);
    const prompt = `
      Buatkan "Weton Insight Harian" (Pesan Harian Jawa).
      
      Hari Ini: ${todayWeton.day.name} ${todayWeton.pasaran.name}
      Weton User: ${userWeton.day.name} ${userWeton.pasaran.name}
      
      Berikan nasihat singkat untuk hari ini:
      1. Quote Falsafah Jawa: Satu kalimat pepatah Jawa kuno beserta artinya yang relevan dengan energi hari ini untuk si user.
      2. Saran Sikap: Apa yang sebaiknya dilakukan user hari ini agar selamat dan beruntung (misal: "Hari ini pasaran Legi, cocok untuk bersosialisasi tapi jaga lisan").
      3. Luck Meter: Skala 1-10 seberapa selaras energi user dengan hari ini.

      Format JSON.
      INSTRUKSI BAHASA: ${langInstruction}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING, description: "Pepatah Jawa dan artinya." },
            advice: { type: Type.STRING, description: "Saran sikap harian." },
            luckMeter: { type: Type.NUMBER, description: "Skala keberuntungan 1-10." },
          },
          required: ["quote", "advice", "luckMeter"]
        }
      }
    });
    
    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        date: new Date().toISOString().split('T')[0],
        ...data
      };
    }
    return null;

  } catch (error) {
    console.error("Gemini API Daily Insight Error:", error);
    return null;
  }
}