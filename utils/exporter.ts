import { UserProfile, HistoryItem, DailyInsight, JodohResult, JodohAnalysis, RejekiAnalysis, AuraAnalysis, HariBaikRecommendation, WetonResult } from '../types';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// --- HELPER: GET ALL DATA ---
const getAllData = () => {
  const profileStr = localStorage.getItem('user_profile');
  const historyStr = localStorage.getItem('weton_history');
  const insightStr = localStorage.getItem('daily_insight');
  
  // New persistent keys
  const jodohStr = localStorage.getItem('last_jodoh');
  const rejekiStr = localStorage.getItem('last_rejeki');
  const auraStr = localStorage.getItem('last_aura');
  const hariBaikStr = localStorage.getItem('last_haribaik');

  return {
    profile: profileStr ? JSON.parse(profileStr) as UserProfile : null,
    history: historyStr ? JSON.parse(historyStr) as HistoryItem[] : [],
    insight: insightStr ? JSON.parse(insightStr) as DailyInsight : null,
    jodoh: jodohStr ? JSON.parse(jodohStr) as { result: JodohResult, analysis: JodohAnalysis | null } : null,
    rejeki: rejekiStr ? JSON.parse(rejekiStr) as { weton: WetonResult, analysis: RejekiAnalysis | null } : null,
    aura: auraStr ? JSON.parse(auraStr) as { weton: WetonResult, analysis: AuraAnalysis | null } : null,
    hariBaik: hariBaikStr ? JSON.parse(hariBaikStr) as { weton: WetonResult, recommendations: HariBaikRecommendation | null } : null,
  };
};

// --- HELPER: GENERATE HTML CONTENT ---
const generateHTMLContent = () => {
  const { profile, history, insight, jodoh, rejeki, aura, hariBaik } = getAllData();
  const timestamp = new Date().toLocaleString('id-ID');

  // Colors based on new Palette:
  // Primary (Dark Blue): #052659
  // Accent (Medium Blue): #5483B3
  // Highlights (Light Blue): #7DA0CA
  // Dark Text: #021024
  // BG: #F8FBFF
  
  const styles = `
    <style>
      body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #021024; max-width: 800px; margin: 0 auto; padding: 40px; background: #fff; }
      .header { text-align: center; border-bottom: 2px solid #7DA0CA; padding-bottom: 20px; margin-bottom: 30px; }
      h1 { color: #052659; margin: 0; font-size: 28px; }
      .meta { font-size: 12px; color: #5483B3; margin-top: 5px; }
      .section { margin-bottom: 30px; border: 1px solid #e0f2fe; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
      h2 { color: #021024; background-color: #F8FBFF; padding: 10px; border-left: 5px solid #7DA0CA; margin-top: 0; font-size: 18px; }
      h3 { color: #5483B3; font-size: 16px; margin-bottom: 5px; margin-top: 15px; }
      p { margin: 5px 0; }
      ul { margin: 5px 0 10px 20px; padding: 0; }
      li { margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
      th, td { border: 1px solid #e0f2fe; padding: 8px; text-align: left; }
      th { background-color: #F8FBFF; color: #021024; font-weight: bold; }
      tr:nth-child(even) { background-color: #F8FBFF; }
      .highlight { color: #052659; font-weight: bold; }
      .quote { font-style: italic; background: #f0f9ff; padding: 10px; border-left: 3px solid #7DA0CA; margin: 10px 0; color: #052659; }
      .no-data { font-style: italic; color: #999; font-size: 13px; }
      
      @media print {
        body { padding: 0; max-width: 100%; }
        .section { box-shadow: none; border: none; page-break-inside: avoid; }
        .no-print { display: none; }
      }
      
      .toolbar {
        position: fixed; top: 0; left: 0; right: 0; background: #021024; color: white; padding: 10px; text-align: center; z-index: 1000;
        display: flex; gap: 10px; justify-content: center; align-items: center;
      }
      .btn {
        background: #7DA0CA; color: #021024; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; text-decoration: none; font-size: 14px;
      }
      .btn:hover { background: #C1E8FF; }
      .page-content { margin-top: 60px; }
    </style>
  `;

  let html = `
    <html>
    <head>
      <title>Laporan WetonKu - ${timestamp}</title>
      ${styles}
    </head>
    <body>
      <div class="toolbar no-print">
        <span>Laporan Siap.</span>
        <button class="btn" onclick="window.print()">Cetak / Simpan PDF</button>
        <span style="font-size: 12px; color: #aaa;">(Tips: Untuk ke Google Docs, tekan Ctrl+A lalu Copy-Paste)</span>
      </div>
      
      <div class="page-content">
        <div class="header">
          <h1>Laporan Analisis WetonKu</h1>
          <div class="meta">Dibuat pada: ${timestamp}</div>
        </div>
  `;

  // 1. PROFIL
  html += `<div class="section"><h2>1. Profil Pengguna</h2>`;
  if (profile) {
    html += `
      <table>
        <tr><th width="150">Nama</th><td>${profile.name}</td></tr>
        <tr><th>Tanggal Lahir</th><td>${profile.birthDate}</td></tr>
        <tr><th>Jam Lahir</th><td>${profile.birthTime || '-'}</td></tr>
      </table>
    `;
  } else {
    html += `<div class="no-data">Belum ada data profil.</div>`;
  }
  html += `</div>`;

  // 2. INSIGHT
  html += `<div class="section"><h2>2. Wawasan Harian</h2>`;
  if (insight) {
    html += `
      <p><strong>Tanggal:</strong> ${insight.date}</p>
      <div class="quote">"${insight.quote}"</div>
      <p><strong>Nasihat:</strong> ${insight.advice}</p>
      <p><strong>Energi Keberuntungan:</strong> ${insight.luckMeter}/10</p>
    `;
  } else {
    html += `<div class="no-data">Belum ada data insight harian.</div>`;
  }
  html += `</div>`;

  // 3. JODOH
  html += `<div class="section"><h2>3. Analisis Jodoh Terakhir</h2>`;
  if (jodoh) {
    html += `
      <p><strong>Kamu:</strong> ${jodoh.result.weton1.day.name} ${jodoh.result.weton1.pasaran.name} (Neptu ${jodoh.result.weton1.totalNeptu})</p>
      <p><strong>Pasangan:</strong> ${jodoh.result.weton2.day.name} ${jodoh.result.weton2.pasaran.name} (Neptu ${jodoh.result.weton2.totalNeptu})</p>
      <div style="margin: 15px 0; padding: 10px; background: #f0f9ff; border: 1px solid #7DA0CA; border-radius: 6px;">
         <p style="margin:0;"><strong>Hasil Perhitungan:</strong> <span class="highlight" style="font-size:1.2em;">${jodoh.result.category}</span> (Sisa ${jodoh.result.remainder})</p>
      </div>
    `;
    if (jodoh.analysis) {
      html += `
        <h3>Makna Hubungan</h3><p>${jodoh.analysis.meaning}</p>
        <h3>Saran Keharmonisan</h3><p>${jodoh.analysis.advice}</p>
        <p><strong>Estimasi Kecocokan:</strong> ${jodoh.analysis.compatibilityScore}%</p>
      `;
    }
  } else {
    html += `<div class="no-data">Belum ada data analisis jodoh.</div>`;
  }
  html += `</div>`;

  // 4. REJEKI
  html += `<div class="section"><h2>4. Analisis Rejeki & Karir</h2>`;
  if (rejeki && rejeki.analysis) {
    html += `
      <p><strong>Basis Weton:</strong> ${rejeki.weton.day.name} ${rejeki.weton.pasaran.name}</p>
      <h3>Pola Rejeki</h3><p>${rejeki.analysis.fortunePattern}</p>
      <h3>Karir/Usaha yang Cocok</h3>
      <ul>${rejeki.analysis.suitableCareers.map(c => `<li>${c}</li>`).join('')}</ul>
      <h3>Falsafah Penjaga Harta</h3><p class="quote">${rejeki.analysis.wealthMaintenance}</p>
    `;
  } else {
    html += `<div class="no-data">Belum ada data analisis rejeki.</div>`;
  }
  html += `</div>`;

  // 5. AURA
  html += `<div class="section"><h2>5. Analisis Aura & Energi</h2>`;
  if (aura && aura.analysis) {
    html += `
      <p><strong>Elemen Dominan:</strong> ${aura.analysis.element}</p>
      <h3>Profil Aura</h3><p>${aura.analysis.auraProfile}</p>
      <h3>Pola Keberuntungan</h3><p>${aura.analysis.luckTendency}</p>
      <h3>Saran Laku Prihatin</h3><p>${aura.analysis.spiritualAdvice}</p>
    `;
  } else {
    html += `<div class="no-data">Belum ada data analisis aura.</div>`;
  }
  html += `</div>`;

  // 6. HARI BAIK
  html += `<div class="section"><h2>6. Rekomendasi Hari Baik</h2>`;
  if (hariBaik && hariBaik.recommendations) {
    html += `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <div>
          <h3>Pernikahan</h3>
          <ul>${hariBaik.recommendations.marriage.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div>
          <h3>Bisnis/Usaha</h3>
          <ul>${hariBaik.recommendations.business.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div>
          <h3>Pindah Rumah</h3>
          <ul>${hariBaik.recommendations.moving.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div>
          <h3 style="color: #dc2626;">Hindari (Naas)</h3>
          <ul>${hariBaik.recommendations.avoid.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  } else {
    html += `<div class="no-data">Belum ada data hari baik.</div>`;
  }
  html += `</div>`;

  // 7. RIWAYAT
  html += `<div class="section"><h2>7. Riwayat Perhitungan</h2>`;
  if (history.length > 0) {
    html += `<table><thead><tr><th>No</th><th>Tanggal</th><th>Weton</th><th>Neptu</th></tr></thead><tbody>`;
    history.forEach((item, idx) => {
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${new Date(item.result.date).toLocaleDateString('id-ID')}</td>
          <td>${item.result.day.name} ${item.result.pasaran.name}</td>
          <td>${item.result.totalNeptu}</td>
        </tr>
      `;
    });
    html += `</tbody></table>`;
  } else {
    html += `<div class="no-data">Data riwayat kosong.</div>`;
  }
  html += `</div>`;

  html += `
      <div style="text-align:center; font-size: 11px; color: #999; margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
        &copy; ${new Date().getFullYear()} WetonKu - Aplikasi Kearifan Jawa Digital
      </div>
    </div>
    </body></html>
  `;

  return html;
};

// --- BACKUP: EXPORT JSON ---
export const exportToJSON = () => {
  const data = getAllData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WetonKu_Backup_${Date.now()}.json`;
  link.click();
};

// --- RESTORE: IMPORT JSON ---
export const importFromJSON = (file: File, callback: (success: boolean) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target?.result as string);
      if (json.profile) localStorage.setItem('user_profile', JSON.stringify(json.profile));
      if (json.history) localStorage.setItem('weton_history', JSON.stringify(json.history));
      if (json.insight) localStorage.setItem('daily_insight', JSON.stringify(json.insight));
      if (json.jodoh) localStorage.setItem('last_jodoh', JSON.stringify(json.jodoh));
      if (json.rejeki) localStorage.setItem('last_rejeki', JSON.stringify(json.rejeki));
      if (json.aura) localStorage.setItem('last_aura', JSON.stringify(json.aura));
      if (json.hariBaik) localStorage.setItem('last_haribaik', JSON.stringify(json.hariBaik));
      callback(true);
    } catch (error) {
      console.error("Failed to parse JSON backup", error);
      callback(false);
    }
  };
  reader.readAsText(file);
};

// --- OPEN REPORT IN NEW TAB (Google Docs Compatible View) ---
export const openReportInNewTab = () => {
  const htmlContent = generateHTMLContent();
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(htmlContent);
    win.document.close();
    win.focus();
  } else {
    alert("Pop-up diblokir. Izinkan pop-up untuk melihat laporan.");
  }
};

// --- EXPORT DOC (Word) ---
export const exportToDOC = () => {
  // Use the HTML generation but strip the toolbar for the file
  let html = generateHTMLContent();
  // Remove toolbar for the download file
  html = html.replace(/<div class="toolbar no-print">[\s\S]*?<\/div>/, ''); 
  
  const blob = new Blob(['\ufeff', html], {
    type: 'application/msword'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WetonKu_Laporan_${Date.now()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- EXPORT TXT ---
export const exportToTXT = () => {
  const { profile, history, insight, jodoh, rejeki, aura, hariBaik } = getAllData();
  const timestamp = new Date().toLocaleString('id-ID');
  
  let content = `LAPORAN LENGKAP APLIKASI WETONKU\nDiunduh pada: ${timestamp}\n==========================================\n\n`;

  // 1. PROFIL
  content += `[ 1. PROFIL PENGGUNA ]\n`;
  if (profile) {
    content += `Nama        : ${profile.name}\n`;
    content += `Tgl Lahir   : ${profile.birthDate}\n`;
    content += `Jam Lahir   : ${profile.birthTime || '-'}\n`;
  } else {
    content += `(Belum ada data profil)\n`;
  }
  content += `\n`;

  // 2. DAILY INSIGHT
  content += `[ 2. WAWASAN HARIAN ]\n`;
  if (insight) {
    content += `Tanggal     : ${insight.date}\n`;
    content += `Quote       : "${insight.quote}"\n`;
    content += `Nasihat     : ${insight.advice}\n`;
    content += `Energi      : ${insight.luckMeter}/10\n`;
  } else {
    content += `(Belum ada data insight harian)\n`;
  }
  content += `\n`;

  // 3. JODOH
  content += `[ 3. ANALISIS JODOH ]\n`;
  if (jodoh) {
    content += `Kamu        : ${jodoh.result.weton1.day.name} ${jodoh.result.weton1.pasaran.name} (Neptu ${jodoh.result.weton1.totalNeptu})\n`;
    content += `Pasangan    : ${jodoh.result.weton2.day.name} ${jodoh.result.weton2.pasaran.name} (Neptu ${jodoh.result.weton2.totalNeptu})\n`;
    content += `Hasil       : ${jodoh.result.category} (Sisa ${jodoh.result.remainder})\n`;
    if (jodoh.analysis) {
      content += `Makna       : ${jodoh.analysis.meaning}\n`;
      content += `Saran       : ${jodoh.analysis.advice}\n`;
      content += `Kecocokan   : ${jodoh.analysis.compatibilityScore}%\n`;
    }
  } else {
    content += `(Belum ada perhitungan jodoh terakhir)\n`;
  }
  content += `\n`;

  // 4. REJEKI
  content += `[ 4. ANALISIS REJEKI & KARIR ]\n`;
  if (rejeki) {
    content += `Weton       : ${rejeki.weton.day.name} ${rejeki.weton.pasaran.name}\n`;
    if (rejeki.analysis) {
      content += `Pola Rejeki : ${rejeki.analysis.fortunePattern}\n`;
      content += `Karir Cocok : ${rejeki.analysis.suitableCareers.join(', ')}\n`;
      content += `Falsafah    : ${rejeki.analysis.wealthMaintenance}\n`;
    }
  } else {
    content += `(Belum ada analisis rejeki terakhir)\n`;
  }
  content += `\n`;

  // 5. AURA
  content += `[ 5. ANALISIS AURA ]\n`;
  if (aura) {
    content += `Weton       : ${aura.weton.day.name} ${aura.weton.pasaran.name}\n`;
    if (aura.analysis) {
      content += `Profil Aura : ${aura.analysis.auraProfile}\n`;
      content += `Elemen      : ${aura.analysis.element}\n`;
      content += `Keberuntungan: ${aura.analysis.luckTendency}\n`;
      content += `Saran Laku  : ${aura.analysis.spiritualAdvice}\n`;
    }
  } else {
    content += `(Belum ada analisis aura terakhir)\n`;
  }
  content += `\n`;

  // 6. HARI BAIK
  content += `[ 6. REKOMENDASI HARI BAIK ]\n`;
  if (hariBaik && hariBaik.recommendations) {
    content += `Weton       : ${hariBaik.weton.day.name} ${hariBaik.weton.pasaran.name}\n`;
    content += `Pernikahan  : ${hariBaik.recommendations.marriage.join(', ')}\n`;
    content += `Bisnis      : ${hariBaik.recommendations.business.join(', ')}\n`;
    content += `Pindah Rumah: ${hariBaik.recommendations.moving.join(', ')}\n`;
    content += `Hindari     : ${hariBaik.recommendations.avoid.join(', ')}\n`;
  } else {
    content += `(Belum ada pencarian hari baik terakhir)\n`;
  }
  content += `\n`;

  // 7. RIWAYAT
  content += `[ 7. RIWAYAT PERHITUNGAN ]\n`;
  if (history.length > 0) {
    history.forEach((item, idx) => {
      const date = new Date(item.result.date).toLocaleDateString('id-ID');
      content += `${idx + 1}. ${date} - ${item.result.day.name} ${item.result.pasaran.name} (Neptu ${item.result.totalNeptu})\n`;
    });
  } else {
    content += `(Data riwayat kosong)\n`;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `WetonKu_Lengkap_${Date.now()}.txt`;
  link.click();
};

// --- EXPORT CSV (Excel Compatible) ---
export const exportToXLS = () => {
  const { profile, history, jodoh, rejeki, aura } = getAllData();
  
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Kategori,Item,Nilai/Detail,Keterangan Tambahan\n";

  // Profil
  if (profile) {
    csvContent += `PROFIL,Nama,${profile.name},-\n`;
    csvContent += `PROFIL,Lahir,${profile.birthDate} ${profile.birthTime || ''},-\n`;
  } else {
    csvContent += `PROFIL,Status,Belum diisi,-\n`;
  }

  // Jodoh
  if (jodoh) {
    csvContent += `JODOH,Kategori,${jodoh.result.category},Sisa ${jodoh.result.remainder}\n`;
    if(jodoh.analysis) csvContent += `JODOH,Skor,${jodoh.analysis.compatibilityScore}%,-\n`;
  } else {
    csvContent += `JODOH,Status,Belum ada data,-\n`;
  }

  // Rejeki
  if (rejeki && rejeki.analysis) {
    csvContent += `REJEKI,Pola,${rejeki.analysis.fortunePattern.replace(/,/g, ' ')},-\n`;
  } else {
    csvContent += `REJEKI,Status,Belum ada data,-\n`;
  }

  // Aura
  if (aura && aura.analysis) {
    csvContent += `AURA,Elemen,${aura.analysis.element},-\n`;
  } else {
    csvContent += `AURA,Status,Belum ada data,-\n`;
  }

  // History
  history.forEach(item => {
    const date = new Date(item.result.date).toLocaleDateString('id-ID');
    const wetonName = `${item.result.day.name} ${item.result.pasaran.name}`;
    csvContent += `RIWAYAT,${date},${wetonName},Neptu ${item.result.totalNeptu}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `WetonKu_Data_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- EXPORT PDF ---
export const exportToPDF = () => {
  const { profile, history, insight, jodoh, rejeki, aura, hariBaik } = getAllData();
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header Helper - Updated to Blue Palette
  const printHeader = (title: string, y: number) => {
    doc.setFillColor(248, 251, 255); // #F8FBFF
    doc.rect(14, y - 6, 182, 8, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(2, 16, 36); // #021024
    doc.text(title, 16, y);
    return y + 8;
  };

  // Main Title
  doc.setFillColor(2, 16, 36); // #021024
  doc.rect(0, 0, 210, 25, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("WetonKu - Laporan Lengkap", pageWidth / 2, 16, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 22, { align: "center" });

  let yPos = 40;

  // 1. PROFIL
  yPos = printHeader("1. PROFIL PENGGUNA", yPos);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  if (profile) {
    doc.text(`Nama: ${profile.name}`, 20, yPos); yPos += 5;
    doc.text(`Tanggal Lahir: ${profile.birthDate}`, 20, yPos); yPos += 5;
    doc.text(`Jam Lahir: ${profile.birthTime || '-'}`, 20, yPos);
  } else {
    doc.text("- Belum ada data profil -", 20, yPos);
  }
  yPos += 10;

  // 2. DAILY INSIGHT
  yPos = printHeader("2. WAWASAN HARIAN", yPos);
  if (insight) {
    doc.setFont("helvetica", "italic");
    const quote = doc.splitTextToSize(`"${insight.quote}"`, 170);
    doc.text(quote, 20, yPos);
    yPos += (quote.length * 5) + 2;
    doc.setFont("helvetica", "normal");
    const advice = doc.splitTextToSize(`Saran: ${insight.advice}`, 170);
    doc.text(advice, 20, yPos);
    yPos += (advice.length * 5) + 2;
    doc.text(`Meter Keberuntungan: ${insight.luckMeter}/10`, 20, yPos);
  } else {
    doc.text("- Belum ada data insight harian -", 20, yPos);
  }
  yPos += 10;

  // 3. JODOH
  yPos = printHeader("3. ANALISIS JODOH TERAKHIR", yPos);
  if (jodoh) {
    doc.text(`Kamu: ${jodoh.result.weton1.day.name} ${jodoh.result.weton1.pasaran.name}`, 20, yPos); yPos += 5;
    doc.text(`Pasangan: ${jodoh.result.weton2.day.name} ${jodoh.result.weton2.pasaran.name}`, 20, yPos); yPos += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Hasil: ${jodoh.result.category} (Sisa ${jodoh.result.remainder})`, 20, yPos); yPos += 5;
    doc.setFont("helvetica", "normal");
    
    if (jodoh.analysis) {
        const meaning = doc.splitTextToSize(`Makna: ${jodoh.analysis.meaning}`, 170);
        doc.text(meaning, 20, yPos); yPos += (meaning.length * 5) + 2;
        const advice = doc.splitTextToSize(`Saran: ${jodoh.analysis.advice}`, 170);
        doc.text(advice, 20, yPos); yPos += (advice.length * 5) + 2;
        doc.text(`Skor Kecocokan: ${jodoh.analysis.compatibilityScore}%`, 20, yPos);
    }
  } else {
    doc.text("- Belum ada data perhitungan jodoh -", 20, yPos);
  }
  yPos += 10;

  // Check Page Break
  if (yPos > 240) { doc.addPage(); yPos = 20; }

  // 4. REJEKI
  yPos = printHeader("4. ANALISIS REJEKI & KARIR", yPos);
  if (rejeki && rejeki.analysis) {
    const pattern = doc.splitTextToSize(`Pola: ${rejeki.analysis.fortunePattern}`, 170);
    doc.text(pattern, 20, yPos); yPos += (pattern.length * 5) + 2;
    const careers = doc.splitTextToSize(`Karir: ${rejeki.analysis.suitableCareers.join(', ')}`, 170);
    doc.text(careers, 20, yPos); yPos += (careers.length * 5) + 2;
  } else {
    doc.text("- Belum ada data analisis rejeki -", 20, yPos);
  }
  yPos += 10;

  // 5. AURA
  yPos = printHeader("5. ANALISIS AURA & ENERGI", yPos);
  if (aura && aura.analysis) {
     doc.text(`Elemen: ${aura.analysis.element}`, 20, yPos); yPos += 5;
     const profileAura = doc.splitTextToSize(`Profil: ${aura.analysis.auraProfile}`, 170);
     doc.text(profileAura, 20, yPos); yPos += (profileAura.length * 5) + 2;
     const advice = doc.splitTextToSize(`Laku: ${aura.analysis.spiritualAdvice}`, 170);
     doc.text(advice, 20, yPos); yPos += (advice.length * 5);
  } else {
    doc.text("- Belum ada data analisis aura -", 20, yPos);
  }
  yPos += 10;

  // Check Page Break
  if (yPos > 240) { doc.addPage(); yPos = 20; }

  // 6. RIWAYAT
  yPos = printHeader("6. RIWAYAT PERHITUNGAN KALKULATOR", yPos);
  yPos += 2;
  
  if (history.length > 0) {
    const tableData = history.map((item, idx) => [
      idx + 1,
      new Date(item.result.date).toLocaleDateString('id-ID'),
      `${item.result.day.name} ${item.result.pasaran.name}`,
      item.result.totalNeptu
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['No', 'Tanggal', 'Weton', 'Neptu']],
      body: tableData,
      theme: 'grid',
      // Header Fill Color: #7DA0CA (125, 160, 202)
      headStyles: { fillColor: [125, 160, 202] },
      styles: { fontSize: 9 }
    });
  } else {
    doc.text("- Tidak ada data riwayat tersimpan -", 20, yPos + 5);
  }

  doc.save(`WetonKu_Lengkap_${Date.now()}.pdf`);
};