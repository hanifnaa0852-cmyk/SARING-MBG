/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFx } from '../utils/soundEffects';

interface MascotCharacterProps {
  variant?: 'hero' | 'floating' | 'card';
  onNavigateToApp?: () => void;
  className?: string;
}

const AUDIT_TIPS = [
  {
    title: 'Prinsip T+7 SARING-MBG',
    text: 'Halo! Saya Inspektur Saring, auditor muda pengawas MBG. Gerbang red flag otomatis menahan uang operasional dapur jika ada anomali, tapi anak sekolah tetap makan bergizi!',
    badge: 'PRINSIP UTAMA',
    badgeColor: 'bg-[#FFBA09]/20 text-[#FFBA09] border-[#FFBA09]/40',
  },
  {
    title: 'Jadwal Pindai Otomatis',
    text: 'Setiap Kamis jam 08:00 WIB, saya memeriksa 4 Red Flag (R1, R2, R4a, R5) secara otomatis & 100% deterministik tanpa black-box AI.',
    badge: 'AUDIT KAMIS',
    badgeColor: 'bg-[#60A5FA]/20 text-[#93C5FD] border-[#60A5FA]/40',
  },
  {
    title: 'Hasil Triase Pekan Ini',
    text: 'Dari 500 SPPG: 442 Hijau (cair 100%), 42 Kuning (tahan operasional 20%), dan 16 Merah (hanya bahan pangan). Uang aman, anak kenyang!',
    badge: 'TRIASE 3 LAPIS',
    badgeColor: 'bg-[#1E9E6A]/20 text-[#4ade80] border-[#1E9E6A]/40',
  },
  {
    title: 'Adil & Transparan',
    text: 'Human error dipilah dari kecurangan sengaja. Dapur kuning dan merah punya hak klarifikasi 3 hari kerja sebelum keputusan definitif.',
    badge: 'REGISTER KEPUTUSAN',
    badgeColor: 'bg-[#FFBA09]/20 text-[#FFBA09] border-[#FFBA09]/40',
  },
];

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  variant = 'hero',
  onNavigateToApp,
  className = '',
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // High-Definition 3D Animated Young Male Auditor Character
  const mascotImagePath = '/src/assets/images/mascot_male_auditor_1792658690649.jpg';

  const currentTip = AUDIT_TIPS[tipIndex];

  const handleNextTip = () => {
    soundFx.playCardFlip();
    setTipIndex((prev) => (prev + 1) % AUDIT_TIPS.length);
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 800);
  };

  const handleCharacterClick = () => {
    soundFx.playClickBlip();
    setIsWaving(true);
    handleNextTip();
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto ${className}`}>
        {isBubbleVisible && (
          <div className="mb-3 max-w-xs sm:max-w-sm bg-[#000F4A]/95 text-white p-4 rounded-2xl border border-[#FFBA09]/40 shadow-2xl backdrop-blur-md animate-fade-in text-xs relative">
            <button
              onClick={() => {
                soundFx.playClickBlip();
                setIsBubbleVisible(false);
              }}
              className="absolute top-2 right-2 text-white/60 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
              title="Tutup pesan"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${currentTip.badgeColor}`}>
                {currentTip.badge}
              </span>
              <span className="text-[10px] text-[#FFBA09] font-bold">Inspektur Saring</span>
            </div>
            <p className="text-white/90 leading-relaxed font-sans">{currentTip.text}</p>
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={handleNextTip}
                className="text-[10px] font-mono text-[#FFBA09] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tip Selanjutnya ({tipIndex + 1}/{AUDIT_TIPS.length})</span>
                <span className="material-symbols-outlined text-[12px]">navigate_next</span>
              </button>
              {onNavigateToApp && (
                <button
                  onClick={() => {
                    soundFx.playClickBlip();
                    onNavigateToApp();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FFBA09] text-[#011F7B] font-bold text-[10px] hover:bg-[#eaa700] transition cursor-pointer"
                >
                  Uji Dasbor
                </button>
              )}
            </div>
            {/* Pointer arrow to character */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-[#000F4A] border-r border-b border-[#FFBA09]/40 transform rotate-45"></div>
          </div>
        )}

        {/* Mascot Avatar Button */}
        <button
          onClick={handleCharacterClick}
          title="Klik Inspektur Saring untuk tips audit"
          className="group relative flex items-center justify-center cursor-pointer focus:outline-none"
        >
          {/* Animated Glow Aura */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#011F7B] via-[#FFBA09] to-[#60A5FA] opacity-75 blur-md group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"></div>
          
          {/* Circular Frame */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#FFBA09] bg-[#010F3D] overflow-hidden shadow-xl transform transition-transform duration-300 group-hover:scale-105">
            <img
              src={mascotImagePath}
              alt="Inspektur Saring - Karakter Animasi Auditor Muda MBG"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                isWaving ? 'scale-110' : 'group-hover:scale-105'
              }`}
            />
            {/* Live Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFBA09]/20 to-transparent h-4 animate-scan-line pointer-events-none"></div>
          </div>

          {/* Badge Ping */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFBA09] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FFBA09] text-[#011F7B] text-[8px] font-bold items-center justify-center">
              ✓
            </span>
          </span>
        </button>
      </div>
    );
  }

  // Default 'hero' or 'card' variant
  return (
    <div className={`relative ${className}`}>
      <div className="relative bg-[#000F4A]/80 backdrop-blur-xl border border-[#FFBA09]/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(1,15,61,0.6)] text-white overflow-hidden group">
        {/* Ambient background glows */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-[#60A5FA]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-[#FFBA09]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A] animate-pulse"></div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#FFBA09] uppercase">
              AUDITOR MUDA & MASKOT RESMI
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/10 border border-white/15 text-[#93C5FD]">
            3D HD · Karakter Pria
          </span>
        </div>

        {/* Main Character Body with 3D Image & Hologram Effect */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          {/* Left / Character Image Frame with Floating Animation */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center">
            <div
              onClick={handleCharacterClick}
              className="relative cursor-pointer group/mascot"
              title="Klik untuk menyapa Inspektur Saring"
            >
              {/* Outer Golden Halo Glow */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-b from-[#FFBA09]/40 via-[#60A5FA]/30 to-[#011F7B]/50 blur-lg opacity-80 group-hover/mascot:opacity-100 transition-opacity animate-pulse"></div>

              {/* Character Image Container with Floating Keyframe */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-[#FFBA09] bg-[#010F3D] shadow-2xl transition-all duration-300 transform group-hover/mascot:scale-105 animate-mascot-float">
                <img
                  src={mascotImagePath}
                  alt="Inspektur Saring - Karakter Animasi 3D Cowo Auditor Muda MBG"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top select-none"
                  loading="eager"
                />

                {/* Holographic scanner band sweeping over */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFBA09]/25 to-transparent h-8 w-full animate-scan-line pointer-events-none"></div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#000F4A] via-[#000F4A]/80 to-transparent p-2 text-center">
                  <div className="text-[11px] font-extrabold text-white tracking-wide font-['Plus_Jakarta_Sans',sans-serif]">
                    INSPEKTUR SARING
                  </div>
                  <div className="text-[9px] font-mono text-[#FFBA09]">
                    Auditor Muda MBG (3D)
                  </div>
                </div>
              </div>

              {/* Floating Status Pill */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full bg-[#011F7B] border border-[#FFBA09] text-[9px] font-mono font-bold text-[#FFBA09] shadow-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E6A] animate-ping"></span>
                <span>STATUS: SIAGA T+7</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-center text-[#93C5FD] font-mono">
              💡 Ketuk karakter untuk berganti tip
            </p>
          </div>

          {/* Right / Speech Bubble & Quick Explanations */}
          <div className="sm:col-span-7 flex flex-col justify-between h-full">
            {/* Interactive Speech Card */}
            <div className="relative bg-[#01175E]/90 border border-[#60A5FA]/30 rounded-2xl p-4 sm:p-5 shadow-inner backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${currentTip.badgeColor}`}>
                  {currentTip.badge}
                </span>
                <span className="text-[11px] font-mono text-[#93C5FD]">
                  {tipIndex + 1} / {AUDIT_TIPS.length}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#FFBA09]">smart_toy</span>
                <span>{currentTip.title}</span>
              </h4>

              <p className="text-xs text-[#E0E7FF] leading-relaxed font-normal min-h-[56px]">
                "{currentTip.text}"
              </p>

              {/* Tip controls */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handleNextTip}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFBA09] hover:text-[#eaa700] transition cursor-pointer"
                >
                  <span>Penjelasan Berikutnya</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <div className="flex gap-1.5">
                  {AUDIT_TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        soundFx.playCardFlip();
                        setTipIndex(i);
                      }}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        i === tipIndex ? 'w-5 bg-[#FFBA09]' : 'bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Buka tip ke-${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action badges */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#1E9E6A]">verified</span>
                <div className="leading-tight">
                  <div className="font-bold text-white">100% Deterministik</div>
                  <div className="text-[9px] text-[#93C5FD]">Tanpa skor misterius</div>
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#FFBA09]">shield</span>
                <div className="leading-tight">
                  <div className="font-bold text-white">Anak Tetap Makan</div>
                  <div className="text-[9px] text-[#93C5FD]">Hanya tahan operasional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
