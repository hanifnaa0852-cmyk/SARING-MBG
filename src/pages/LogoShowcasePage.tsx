/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SaringLogoSvg } from '../components/SaringLogoSvg';
import { AiLoginModal } from '../components/AiLoginModal';
import { soundFx } from '../utils/soundEffects';

interface LogoShowcasePageProps {
  onGoToApp?: () => void;
  onGoToLanding?: () => void;
}

export const LogoShowcasePage: React.FC<LogoShowcasePageProps> = ({ onGoToApp, onGoToLanding }) => {
  const [animKey, setAnimKey] = useState<number>(0);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Interactive Shard Assembly Playground State
  const [assemblyValue, setAssemblyValue] = useState<number>(100);
  const [isAutoAssembling, setIsAutoAssembling] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Monitor tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabHidden(document.visibilityState === 'hidden');
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestart = () => {
    setAnimKey((prev) => prev + 1);
    setAssemblyValue(100);
    setIsAutoAssembling(false);
    soundFx.playClickBlip();
    showToast('Animasi logo diputar ulang dalam siklus penuh.');
  };

  const handleTriggerShardAssembly = () => {
    soundFx.playClickBlip();
    setIsAutoAssembling(true);
    setAssemblyValue(0);

    const startTime = Date.now();
    const duration = 2400;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setAssemblyValue(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        soundFx.playSuccessChime();
        showToast('Kepingan logo berhasil bersatu mengunci perisai audit!');
      }
    }, 35);
  };

  const handleCopySvg = () => {
    soundFx.playClickBlip();
    const rawSvg = `<!-- Logo SARING-MBG: Audit Dana Makan Bergizi Gratis -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Logo SARING-MBG">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFECA8" />
      <stop offset="40%" stop-color="#FFBA09" />
      <stop offset="100%" stop-color="#E5A100" />
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#02248A" />
      <stop offset="50%" stop-color="#01175E" />
      <stop offset="100%" stop-color="#000D36" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4AE3A0" />
      <stop offset="60%" stop-color="#1E9E6A" />
      <stop offset="100%" stop-color="#0E6B44" />
    </linearGradient>
  </defs>
  <!-- Perisai Pengawasan Fiskal -->
  <path d="M 120 30 C 95 32 65 38 45 48 C 39 70 37 92 36 115 C 38 150 65 180 85 195 C 100 206 112 212 120 216 C 128 212 140 206 155 195 C 175 180 202 150 204 115 C 203 92 201 70 195 48 C 175 38 145 32 120 30 Z" fill="url(#shieldGrad)" stroke="url(#goldGrad)" stroke-width="2.5" />
  <!-- Matriks Saringan Audit MBG -->
  <circle cx="120" cy="125" r="54" fill="#011244" stroke="url(#goldGrad)" stroke-width="2" />
  <!-- Mangkuk Pangan Bergizi & Tunas Nutrisi -->
  <path d="M 82 135 C 82 135 88 162 120 162 C 152 162 158 135 158 135 Z" fill="url(#goldGrad)" />
  <path d="M 120 132 C 104 125 100 110 110 102 C 120 95 122 114 120 132 Z" fill="url(#emeraldGrad)" />
  <path d="M 120 132 C 136 125 140 110 130 102 C 120 95 118 114 120 132 Z" fill="url(#emeraldGrad)" />
  <!-- Bintang Integritas Audit -->
  <polygon points="120,33 123.5,44.5 135,48 123.5,51.5 120,63 116.5,51.5 105,48 116.5,44.5" fill="url(#goldGrad)" />
</svg>`;

    navigator.clipboard.writeText(rawSvg).then(() => {
      showToast('Kode SVG Logo SARING-MBG berhasil disalin ke clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#010D30] via-[#000F4A] to-[#000820] text-white flex flex-col items-center px-4 py-8 md:px-8 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#011F7B] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FFBA09] animate-bounce">
          <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">verified</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* AI Login Modal (Interactive demo right inside showcase) */}
      <AiLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setIsLoginModalOpen(false);
          showToast('Autentikasi verifikator berhasil! Logo telah menyatu sempurna.');
        }}
      />

      {/* Top Breadcrumb Navigation */}
      <header className="w-full max-w-5xl flex items-center justify-between pb-6 border-b border-white/10 text-xs text-[#B8C4E6]">
        <div className="flex items-center gap-2">
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Beranda</span>
            </button>
          )}
          <span>/</span>
          <span className="text-[#FFBA09] font-bold">Identitas Visual &amp; Konsep Logo</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFBA09] hover:bg-[#eaa700] text-[#000F4A] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            <span>Uji Animasi Login Asli</span>
          </button>

          {onGoToApp && (
            <button
              onClick={onGoToApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#011F7B] hover:bg-[#02248A] text-white border border-[#FFBA09]/40 font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <span>Masuk ke Dasbor</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
        </div>
      </header>

      {/* Title & Philosophy Badge */}
      <div className="text-center mt-8 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#011F7B] border border-[#FFBA09]/50 text-[#FFBA09] text-[11px] font-mono tracking-widest uppercase mb-3 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#4AE3A0] animate-ping"></span>
          <span>KONSEP BARU: AUDIT DANA MAKAN BERGIZI GRATIS</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Lambang Pengawasan Fiskal &amp; Hak Gizi Anak
        </h1>
        <p className="mt-2 text-xs md:text-sm text-[#B8C4E6] leading-relaxed">
          Mengintegrasikan <strong>Perisai Pertahanan Fiskal APBN</strong>, <strong>Kubah &amp; Mangkuk Makan Bergizi</strong>, <strong>Tunas Pangan Lokal Segar</strong>, dan <strong>Matriks Saringan Pra-SPP</strong>.
        </p>
      </div>

      {/* Main Hero Showcase: Dynamic Logo Stage */}
      <section className="relative w-full max-w-3xl my-8 p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#011652]/80 via-[#010F3D]/90 to-[#000A26] border border-[#FFBA09]/50 shadow-[0_0_60px_rgba(1,31,123,0.8)] flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFBA09]/15 rounded-full blur-[90px] pointer-events-none"></div>

        {/* Central Logo Container */}
        <div className="relative z-10 flex items-center justify-center my-4">
          <SaringLogoSvg
            size={280}
            theme="dark"
            animated={!isTabHidden}
            assemblyProgress={assemblyValue}
            isAssembling={isAutoAssembling}
            idSuffix={`hero-${animKey}`}
            className="drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
          />
        </div>

        {/* Wordmark and Tagline */}
        <div className="mt-4 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-[#60A5FA] via-[#FFECA8] to-[#FFBA09] bg-clip-text text-transparent">
            SARING-MBG
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#B8C4E6] tracking-wide">
            Sistem Audit Red Flag &amp; Gatekeeping Top-Up Mingguan MBG
          </p>
          <span className="text-[11px] font-mono text-[#4AE3A0] mt-1">
            {assemblyValue === 100
              ? 'Status: Perisai Utuh & Tervalidasi'
              : `Status: Kepingan Berpencar (${assemblyValue}%)`}
          </span>
        </div>

        {/* Interactive Shard Assembly Scrubber & Buttons */}
        <div className="mt-8 w-full max-w-lg bg-[#000B2B]/80 border border-white/10 rounded-2xl p-5 shadow-inner flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#FFBA09] font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">view_in_ar</span>
              <span>Laboratorium Kepingan Pecahan (Shard Assembly)</span>
            </span>
            <span className="font-mono text-white font-bold bg-[#011F7B] px-2 py-0.5 rounded">
              {assemblyValue}%
            </span>
          </div>

          {/* Interactive Range Slider (0% = Shattered, 100% = Unified) */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={assemblyValue}
              onChange={(e) => {
                setIsAutoAssembling(false);
                setAssemblyValue(Number(e.target.value));
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#FFBA09]"
            />
            <div className="flex justify-between text-[10px] text-[#B8C4E6]/70 font-mono">
              <span>0% (Kepingan Terpecah)</span>
              <span>50% (Ditarik Magnetik)</span>
              <span>100% (Menyatu Utuh)</span>
            </div>
          </div>

          {/* Quick Action Button Group */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => {
                soundFx.playClickBlip();
                setIsAutoAssembling(false);
                setAssemblyValue(0);
                showToast('Logo dipecah menjadi kepingan-kepingan terpisah.');
              }}
              className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
            >
              Pecahkan Logo (0%)
            </button>

            <button
              onClick={handleTriggerShardAssembly}
              className="py-2 px-3 rounded-lg bg-[#FFBA09] hover:bg-[#eaa700] text-[#000F4A] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Animasi Gabung</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClickBlip();
                setIsAutoAssembling(false);
                setAssemblyValue(100);
                showToast('Logo disatukan kembali 100%.');
              }}
              className="py-2 px-3 rounded-lg bg-[#011F7B] hover:bg-[#02248A] text-white font-semibold text-xs border border-[#FFBA09]/40 transition-colors cursor-pointer"
            >
              Satukan (100%)
            </button>
          </div>
        </div>

        {/* Action Controls: Restart & Copy SVG */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Putar Ulang Siklus</span>
          </button>

          <button
            onClick={handleCopySvg}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#011F7B] hover:bg-[#02248A] text-white border border-[#FFBA09]/50 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>Salin SVG Baru</span>
          </button>
        </div>
      </section>

      {/* Grid of Key Features & Scalability */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
        {/* 1. Scalability Demonstration (128px, 64px, 32px) */}
        <div className="bg-[#000F4A]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFBA09] mb-2">
              <span className="material-symbols-outlined text-[18px]">photo_size_select_actual</span>
              <span>Skalabilitas Responsif</span>
            </div>
            <h3 className="text-base font-bold text-white">Ketajaman di Segala Ukuran</h3>
            <p className="text-xs text-[#B8C4E6] mt-1">
              Geometri vektor dirancang presisi dengan grid 240px agar tetap terbaca jelas dari kartu hero hingga ikon navigasi 28px di sidebar.
            </p>
          </div>

          <div className="my-6 flex items-end justify-around gap-4 p-4 bg-[#010F3D]/60 rounded-xl border border-white/5">
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={110} theme="dark" animated={true} idSuffix="sz-110" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">110px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={60} theme="dark" animated={true} idSuffix="sz-60" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">60px</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={32} theme="dark" animated={false} idSuffix="sz-32" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">32px</span>
            </div>
          </div>

          <div className="text-[11px] text-[#B8C4E6]/70 italic text-center">
            Mangkuk emas dan tunas nutrisi tetap kontras di resolusi kecil.
          </div>
        </div>

        {/* 2. Light Background Document Version */}
        <div className="bg-white text-[#181C20] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#011F7B] mb-2">
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
              <span>Varian Latar Terang</span>
            </div>
            <h3 className="text-base font-bold text-[#000F4A]">Penerapan SPP &amp; Kop Surat Resmi</h3>
            <p className="text-xs text-[#454652] mt-1">
              Perisai #011F7B dengan aksen emas #FFBA09 dan daun zamrud #1E9E6A untuk laporan PDF dan berita acara audit.
            </p>
          </div>

          <div className="my-6 flex items-center justify-center p-6 bg-[#F7F9FE] rounded-xl border border-[#E0E2E7]">
            <SaringLogoSvg size={130} theme="light" animated={true} idSuffix="light-preview" />
          </div>

          <div className="flex items-center justify-between text-xs text-[#454652] pt-2 border-t border-[#ECEEF3]">
            <span className="font-semibold text-[#011F7B]">Kontras WCAG AA:</span>
            <span className="font-mono font-bold text-[#1E9E6A]">Lolos 9.2:1</span>
          </div>
        </div>

        {/* 3. Anatomi Animasi Login Kepingan */}
        <div className="bg-[#000F4A]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#4AE3A0] mb-2">
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              <span>Protokol Login Kepingan</span>
            </div>
            <h3 className="text-base font-bold text-white">Mekanisme Rekonstruksi Logo</h3>
            <p className="text-xs text-[#B8C4E6] mt-1">
              Saat auditor / verifikator melakukan autentikasi, kepingan data 500 virtual account dan logistik diselaraskan menjadi satu kesatuan logo.
            </p>
          </div>

          <div className="my-4 space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#011448] border border-white/10 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#FFBA09] text-[#000F4A] flex items-center justify-center font-bold text-[10px]">1</span>
              <span><strong>0% - 30%:</strong> Kepingan terpecah melayang di ruang audit</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#011448] border border-white/10 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4AE3A0] text-[#000F4A] flex items-center justify-center font-bold text-[10px]">2</span>
              <span><strong>30% - 75%:</strong> Tarikan magnetik menyatukan sayap perisai</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#011448] border border-white/10 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#011F7B] text-white flex items-center justify-center font-bold text-[10px]">3</span>
              <span><strong>75% - 100%:</strong> Kunci kriptografis &amp; shockwave emas menyala</span>
            </div>
          </div>

          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#4AE3A0] hover:bg-[#3ecb8e] text-[#000F4A] font-bold text-xs transition-colors cursor-pointer text-center"
          >
            Buka Simulasi Login Penuh
          </button>
        </div>
      </div>

      {/* Anatomy & Meaning Documentation */}
      <div className="w-full max-w-5xl bg-[#000F4A]/50 border border-white/10 rounded-2xl p-6 md:p-8 my-4 text-xs text-[#B8C4E6] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">architecture</span>
          <span>Makna 5 Elemen Utama Lambang SARING-MBG</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-[#010F3D]/80 rounded-xl border border-white/10 space-y-1">
            <span className="text-[#FFBA09] font-bold block">1. Perisai Fiskal</span>
            <p>Ketahanan APBN dan perlindungan hukum sebelum dana berpindah ke rekening SPPG.</p>
          </div>
          <div className="p-3 bg-[#010F3D]/80 rounded-xl border border-white/10 space-y-1">
            <span className="text-[#FFECA8] font-bold block">2. Mangkuk Emas</span>
            <p>Simbol hak porsi makan bergizi anak sekolah (pagu bahan baku diprioritaskan cair).</p>
          </div>
          <div className="p-3 bg-[#010F3D]/80 rounded-xl border border-white/10 space-y-1">
            <span className="text-[#4AE3A0] font-bold block">3. Tunas Daun Gizi</span>
            <p>Pasokan bahan pangan segar lokal (sayur, lauk pauk ber-SLHS) dari ekosistem UMKM.</p>
          </div>
          <div className="p-3 bg-[#010F3D]/80 rounded-xl border border-white/10 space-y-1">
            <span className="text-white font-bold block">4. Matriks Saringan</span>
            <p>Pemeriksaan deterministik 4 indikator (R1, R2, R4a, R5) sebelum penerbitan SPP.</p>
          </div>
          <div className="p-3 bg-[#010F3D]/80 rounded-xl border border-white/10 space-y-1">
            <span className="text-[#60A5FA] font-bold block">5. Bintang Transparansi</span>
            <p>Akuntabilitas publik dan transparansi hasil triase yang dapat diaudit oleh BPK.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B8C4E6]/60 gap-3">
        <span>© 2026 Badan Gizi Nasional (BGN) · Tata Kelola MBG</span>
        <span>SVG Murni + Animasi Kepingan Kinetik · Nol Dependensi Eksternal</span>
      </footer>
    </div>
  );
};
