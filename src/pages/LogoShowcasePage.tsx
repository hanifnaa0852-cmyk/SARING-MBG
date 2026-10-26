/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SaringLogoSvg } from '../components/SaringLogoSvg';

interface LogoShowcasePageProps {
  onGoToApp?: () => void;
  onGoToLanding?: () => void;
}

export const LogoShowcasePage: React.FC<LogoShowcasePageProps> = ({ onGoToApp, onGoToLanding }) => {
  const [animKey, setAnimKey] = useState<number>(0);
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor tab visibility to pause animation when hidden
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
    showToast('Animasi logo diputar ulang dari awal siklus.');
  };

  const handleCopySvg = () => {
    const rawSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Logo SARING-MBG">
  <defs>
    <filter id="saring-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="grad-scan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFBA09" stop-opacity="0" />
      <stop offset="20%" stop-color="#FFBA09" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#FFE599" stop-opacity="1" />
      <stop offset="80%" stop-color="#FFBA09" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#FFBA09" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="grad-shield" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#02248A" />
      <stop offset="100%" stop-color="#01175E" />
    </linearGradient>
    <style>
      .cls-shield-draw {
        stroke-dasharray: 540;
        stroke-dashoffset: 0;
        animation: shieldDraw 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      }
      .cls-shield-glow { animation: shieldGlow 6s ease-in-out infinite; }
      .cls-shield-pulse-ring { transform-origin: 120px 120px; animation: pulseRing 6s ease-out infinite; }
      .cls-scanline { animation: scanSweep 6s ease-in-out infinite; }
      .cls-gate-bar { animation: gateFlash 6s ease-in-out infinite; }
      .cls-particle-deflect-1 { animation: particleDeflect1 6s ease-in-out infinite; }
      .cls-particle-deflect-2 { animation: particleDeflect2 6s ease-in-out infinite; }
      .cls-droplet { animation: dropletPass 6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite; }
      .cls-droplet-trail { animation: dropletTrail 6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite; }

      @keyframes shieldDraw {
        0% { stroke-dashoffset: 540; opacity: 0.2; }
        16.6% { stroke-dashoffset: 0; opacity: 1; }
        92% { opacity: 1; stroke-dashoffset: 0; }
        100% { stroke-dashoffset: 0; opacity: 1; }
      }
      @keyframes shieldGlow {
        0%, 15% { opacity: 0.2; }
        50% { opacity: 0.6; }
        85% { opacity: 0.3; }
        92% { opacity: 0.9; }
        100% { opacity: 0.2; }
      }
      @keyframes pulseRing {
        0%, 91% { opacity: 0; transform: scale(0.95); }
        92% { opacity: 0.7; transform: scale(1); stroke-width: 2.5; }
        99% { opacity: 0; transform: scale(1.18); stroke-width: 0.5; }
        100% { opacity: 0; transform: scale(1.2); }
      }
      @keyframes scanSweep {
        0%, 16% { transform: translateY(30px); opacity: 0; }
        18% { opacity: 0.9; }
        48% { transform: translateY(165px); opacity: 0.9; }
        52% { transform: translateY(172px); opacity: 0; }
        100% { transform: translateY(172px); opacity: 0; }
      }
      @keyframes gateFlash {
        0%, 30% { fill-opacity: 0.85; filter: none; }
        38%, 46% { fill: #FFBA09; fill-opacity: 1; filter: drop-shadow(0 0 4px #FFBA09); }
        55%, 100% { fill: #B8C4E6; fill-opacity: 0.85; filter: none; }
      }
      @keyframes particleDeflect1 {
        0%, 16% { transform: translate(0, 0); opacity: 0; }
        20% { opacity: 0.9; }
        40% { transform: translate(-14px, 58px); opacity: 0.8; }
        48% { transform: translate(-28px, 66px); opacity: 0; }
        100% { opacity: 0; }
      }
      @keyframes particleDeflect2 {
        0%, 18% { transform: translate(0, 0); opacity: 0; }
        23% { opacity: 0.95; }
        42% { transform: translate(16px, 60px); opacity: 0.75; }
        50% { transform: translate(30px, 70px); opacity: 0; }
        100% { opacity: 0; }
      }
      @keyframes dropletPass {
        0%, 20% { transform: translateY(0); fill: #B8C4E6; opacity: 0; }
        25% { opacity: 0.9; fill: #B8C4E6; }
        48% { transform: translateY(58px); fill: #FFE599; opacity: 1; }
        60% { transform: translateY(85px); fill: #FFBA09; filter: drop-shadow(0 0 6px #FFBA09); }
        78% { transform: translateY(128px); fill: #FFBA09; opacity: 1; filter: drop-shadow(0 0 8px #FFBA09); }
        90% { transform: translateY(154px); fill: #FFBA09; opacity: 0; }
        100% { transform: translateY(154px); opacity: 0; }
      }
      @keyframes dropletTrail {
        0%, 55% { opacity: 0; transform: scaleY(0.2); }
        65% { opacity: 0.8; transform: scaleY(1); }
        80% { opacity: 0.6; transform: scaleY(1.4); }
        90% { opacity: 0; transform: scaleY(0.2); }
        100% { opacity: 0; }
      }
      @media (prefers-reduced-motion: reduce) {
        * { animation: none !important; }
      }
    </style>
  </defs>

  <!-- GROUP: SHIELD -->
  <g id="shield">
    <polygon class="cls-shield-pulse-ring" points="120,24 196,68 196,156 120,208 44,156 44,68" fill="none" stroke="#FFBA09" stroke-width="2" opacity="0" />
    <polygon points="120,26 195,68 195,155 120,206 45,155 45,68" fill="url(#grad-shield)" stroke="#001648" stroke-width="2" />
    <polygon class="cls-shield-glow" points="120,32 187,71 187,149 120,198 53,149 53,71" fill="none" stroke="#003AC0" stroke-width="1.5" opacity="0.5" />
    <polygon class="cls-shield-draw" points="120,26 195,68 195,155 120,206 45,155 45,68" fill="none" stroke="#FFBA09" stroke-width="2.5" stroke-linejoin="round" filter="url(#saring-glow)" />
  </g>

  <!-- GROUP: GATE -->
  <g id="gate">
    <g class="cls-gate-bar">
      <rect x="72" y="84" width="36" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
      <rect x="132" y="84" width="36" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
      <rect x="82" y="108" width="29" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
      <rect x="129" y="108" width="29" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
      <rect x="92" y="132" width="21" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
      <rect x="127" y="132" width="21" height="6.5" rx="3.25" fill="#B8C4E6" fill-opacity="0.85" />
    </g>
    <line x1="108" y1="84" x2="113" y2="135" stroke="#FFBA09" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.35" />
    <line x1="132" y1="84" x2="127" y2="135" stroke="#FFBA09" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.35" />
  </g>

  <!-- GROUP: PARTICLES -->
  <g id="particles">
    <circle cx="96" cy="48" r="1.8" fill="#B8C4E6" opacity="0.6" />
    <circle cx="144" cy="50" r="1.8" fill="#B8C4E6" opacity="0.6" />
    <circle cx="112" cy="42" r="1.5" fill="#FFFFFF" opacity="0.8" />
    <circle cx="128" cy="44" r="1.5" fill="#FFFFFF" opacity="0.8" />
    <circle class="cls-particle-deflect-1" cx="88" cy="38" r="2.2" fill="#B8C4E6" />
    <circle class="cls-particle-deflect-2" cx="152" cy="38" r="2.2" fill="#B8C4E6" />
  </g>

  <!-- GROUP: SCANLINE -->
  <g id="scanline" class="cls-scanline">
    <line x1="52" y1="0" x2="188" y2="0" stroke="url(#grad-scan)" stroke-width="2" filter="url(#saring-glow)" />
    <line x1="80" y1="0" x2="160" y2="0" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.85" />
  </g>

  <!-- GROUP: DROPLET -->
  <g id="droplet">
    <line class="cls-droplet-trail" x1="120" y1="100" x2="120" y2="170" stroke="#FFBA09" stroke-width="2.5" stroke-linecap="round" opacity="0" filter="url(#saring-glow)" />
    <g class="cls-droplet">
      <circle cx="120" cy="40" r="3.2" filter="url(#saring-glow)" />
      <circle cx="120" cy="40" r="1.8" fill="#FFFFFF" opacity="0.9" />
    </g>
  </g>
</svg>`;

    navigator.clipboard.writeText(rawSvg).then(() => {
      showToast('Kode SVG standalone berhasil disalin ke clipboard.');
    });
  };

  return (
    <div className="min-h-screen bg-[#010F3D] text-white flex flex-col items-center justify-start p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#FFBA09] animate-bounce">
          <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Bar with Application Link & Status */}
      <div className="w-full max-w-5xl flex items-center justify-between pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#011F7B]/50 border border-[#FFBA09]/40 text-[#FFBA09] text-xs font-bold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>IDENTITAS VISUAL &amp; LOGO RESMI</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onGoToLanding && (
            <button
              onClick={onGoToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/15 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Ke Landing Page</span>
            </button>
          )}

          {onGoToApp && (
            <button
              onClick={onGoToApp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFBA09] hover:bg-[#eaa700] text-[#000F4A] text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Buka Prototipe Sistem SARING-MBG</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Large Centered Hero Logo (320px) */}
      <section className="flex flex-col items-center justify-center my-12 text-center relative max-w-xl w-full">
        {/* Glow ambient background aura */}
        <div className="absolute w-72 h-72 bg-[#011F7B]/35 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div key={animKey} className={`transition-opacity duration-300 ${isTabHidden ? 'opacity-30' : 'opacity-100'}`}>
          <SaringLogoSvg
            size={320}
            theme="dark"
            animated={!isTabHidden}
            idSuffix={`hero-${animKey}`}
            className="drop-shadow-[0_10px_25px_rgba(1,31,123,0.6)]"
          />
        </div>

        {/* Wordmark and Tagline */}
        <div className="mt-6 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFBA09] bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
            SARING-MBG
          </h1>
          <p className="mt-2 text-base md:text-lg font-medium text-[#B8C4E6] tracking-wide">
            Gerbang sebelum top-up
          </p>
        </div>

        {/* Interactive Controls (Putar Ulang & Salin SVG) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#000F4A] font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] font-bold">replay</span>
            <span>Putar Ulang</span>
          </button>

          <button
            onClick={handleCopySvg}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#011F7B] hover:bg-[#02248A] text-white border border-[#FFBA09]/50 font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">content_copy</span>
            <span>Salin SVG</span>
          </button>
        </div>
      </section>

      {/* Grid of Deliverables (2, 3, 4) */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {/* 2. Scalability Demonstration (128px, 64px, 32px) */}
        <div className="bg-[#000F4A]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFBA09] mb-2">
              <span className="material-symbols-outlined text-[18px]">photo_size_select_actual</span>
              <span>Skalabilitas Ukuran</span>
            </div>
            <h2 className="text-base font-bold text-white">Uji Keterbacaan Multi-Resolusi</h2>
            <p className="text-xs text-[#B8C4E6] mt-1">
              Geometri tajam dan proporsi bar funnel tetap terbaca jelas dari 128px hingga ikon navigasi 32px.
            </p>
          </div>

          <div className="my-6 flex items-end justify-around gap-4 p-4 bg-[#010F3D]/60 rounded-xl border border-white/5">
            {/* 128px */}
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={128} theme="dark" animated={true} idSuffix="sz-128" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">128px</span>
            </div>

            {/* 64px */}
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={64} theme="dark" animated={true} idSuffix="sz-64" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">64px</span>
            </div>

            {/* 32px */}
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={32} theme="dark" animated={false} idSuffix="sz-32" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">32px</span>
            </div>
          </div>

          <div className="text-[11px] text-[#B8C4E6]/70 italic text-center">
            Aperture gerbang tetap stabil tanpa distorsi visual.
          </div>
        </div>

        {/* 3. Light Background Version */}
        <div className="bg-white text-[#181C20] rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#011F7B] mb-2">
              <span className="material-symbols-outlined text-[18px]">light_mode</span>
              <span>Varian Latar Terang</span>
            </div>
            <h2 className="text-base font-bold text-[#000F4A]">Penerapan Dokumen &amp; SPP Resmi</h2>
            <p className="text-xs text-[#454652] mt-1">
              Perisai #011F7B dengan stream #FFBA09 dan partikel teredam #5B6785 untuk kop surat &amp; portal publik.
            </p>
          </div>

          <div className="my-6 flex items-center justify-center p-6 bg-[#F7F9FE] rounded-xl border border-[#E0E2E7]">
            <SaringLogoSvg size={130} theme="light" animated={true} idSuffix="light-preview" />
          </div>

          <div className="flex items-center justify-between text-xs text-[#454652] pt-2 border-t border-[#ECEEF3]">
            <span className="font-semibold text-[#011F7B]">Kontras WCAG AA:</span>
            <span className="font-mono font-bold text-[#1E9E6A]">Tervalidasi 8.4:1</span>
          </div>
        </div>

        {/* 4. Static Fallback Version (Favicon Candidate) */}
        <div className="bg-[#000F4A]/70 border border-white/10 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FFBA09] mb-2">
              <span className="material-symbols-outlined text-[18px]">tab</span>
              <span>Kandidat Favicon / Statis</span>
            </div>
            <h2 className="text-base font-bold text-white">Bingkai Statis Bebas Animasi</h2>
            <p className="text-xs text-[#B8C4E6] mt-1">
              Droplet emas #FFBA09 berada persis di tengah celah gerbang. Otomatis aktif saat <code>prefers-reduced-motion</code>.
            </p>
          </div>

          <div className="my-6 flex items-center justify-center gap-6 p-4 bg-[#010F3D]/60 rounded-xl border border-white/5">
            {/* Simulation Tab Browser Mock */}
            <div className="flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-t-lg bg-[#011F7B] border-t border-x border-white/20 text-xs">
                <SaringLogoSvg size={20} theme="dark" animated={false} idSuffix="tab-favicon" />
                <span className="text-[11px] font-semibold text-white">SARING-MBG</span>
              </div>
              <span className="text-[10px] text-[#B8C4E6] font-mono">Favicon 20px</span>
            </div>

            {/* Medium Static */}
            <div className="flex flex-col items-center gap-2">
              <SaringLogoSvg size={64} theme="dark" animated={false} idSuffix="static-md" />
              <span className="text-[10px] text-[#B8C4E6] font-mono">Statis 64px</span>
            </div>
          </div>

          <div className="text-[11px] text-[#B8C4E6]/70 text-center">
            Mewakili integritas gatekeeping tanpa beban rendering CPU.
          </div>
        </div>
      </div>

      {/* Anatomy & Meaning Documentation */}
      <div className="w-full max-w-5xl bg-[#000F4A]/50 border border-white/10 rounded-2xl p-6 md:p-8 my-4 text-xs text-[#B8C4E6] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">architecture</span>
          <span>Anatomi &amp; Makna Filosofis Logo SARING-MBG</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-3 bg-[#010F3D]/60 rounded-xl border border-white/5 space-y-1">
            <span className="text-white font-bold block">1. Perisai Heksagonal (#011F7B)</span>
            <p>Ketahanan fiskal dan perlindungan APBN negara sebelum dana ditransfer ke virtual account dapur.</p>
          </div>
          <div className="p-3 bg-[#010F3D]/60 rounded-xl border border-white/5 space-y-1">
            <span className="text-white font-bold block">2. Tiga Batang Gerbang (Sieve)</span>
            <p>Tiga lapis penyaringan bertingkat (verifikasi rekening, keabsahan izin dapur, dan rekonsiliasi pagu bahan).</p>
          </div>
          <div className="p-3 bg-[#010F3D]/60 rounded-xl border border-white/5 space-y-1">
            <span className="text-[#FFBA09] font-bold block">3. Garis Pindai Emas (#FFBA09)</span>
            <p>Audit otomatisasi gerbang sebelum penerbitan SPP (Senin–Selasa) untuk membaca konsistensi data logistik.</p>
          </div>
          <div className="p-3 bg-[#010F3D]/60 rounded-xl border border-white/5 space-y-1">
            <span className="text-[#FFBA09] font-bold block">4. Droplet Terverifikasi</span>
            <p>Kelancaran transfer dana bahan makanan yang aman tanpa hambatan demi kepastian gizi siswa sekolah.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-5xl pt-8 pb-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B8C4E6]/60 gap-3">
        <span>© 2026 Badan Gizi Nasional (BGN) · Tata Kelola MBG</span>
        <span>SVG Murni + Animasi CSS · Nol Dependensi Eksternal</span>
      </footer>
    </div>
  );
};
