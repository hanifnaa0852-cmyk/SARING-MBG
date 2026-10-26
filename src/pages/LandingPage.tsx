/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';
import { SaringLogoSvg } from '../components/SaringLogoSvg';
import { AiLoginModal } from '../components/AiLoginModal';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { soundFx } from '../utils/soundEffects';

interface LandingPageProps {
  onNavigateToApp: (targetPage?: PageId) => void;
  onOpenLogoShowcase?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToApp,
  onOpenLogoShowcase,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetDestination, setTargetDestination] = useState<PageId>('ringkasan');

  // Interactive quick simulator preview state
  const [simR5, setSimR5] = useState<number>(10);
  const [simR4a, setSimR4a] = useState<number>(0);

  // Active step in "Alur Kerja"
  const [activeStep, setActiveStep] = useState<number>(1);

  // Active tab in "Masalahnya" comparison
  const [comparisonTab, setComparisonTab] = useState<'sebelum' | 'sesudah'>('sesudah');

  // Interactive tester for Kamus Red Flag
  const [testVaCount, setTestVaCount] = useState<number>(1);
  const [testStatus, setTestStatus] = useState<'beroperasi' | 'suspend' | 'belum beroperasi'>('beroperasi');
  const [testBahanCost, setTestBahanCost] = useState<number>(7800);
  const [testDisparity, setTestDisparity] = useState<number>(6); // % gap

  // Computed results for the mini preview
  const previewHijau = Math.max(380, Math.round(442 - (simR5 - 10) * 4 - simR4a * 3));
  const previewKuning = Math.round(42 + (simR5 - 10) * 2.5 + simR4a * 2);
  const previewMerah = 500 - previewHijau - previewKuning;

  const handleLaunchLogin = (target: PageId = 'ringkasan') => {
    soundFx.playClickBlip();
    setTargetDestination(target);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    onNavigateToApp(targetDestination);
  };

  const scrollToSection = (id: string) => {
    soundFx.playClickBlip();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Step information for Alur Kerja
  const stepDetails = [
    {
      num: 1,
      title: 'Laporan Harian SPPG',
      tag: 'INPUT LOGISTIK',
      desc: 'Setiap hari kerja (Senin–Sabtu), SPPG mencatat porsi disalurkan, nota pembelian bahan pangan dari pasar lokal, dan mutasi virtual account BGN.',
      metrics: '6 Hari / Minggu · 500 Dapur · Rerata 2.450 Porsi/Hari',
      icon: 'receipt_long',
      highlight: 'Setiap data terkunci pada pukul 23:59 WIB dengan tanda tangan digital.'
    },
    {
      num: 2,
      title: 'Mesin Aturan Red Flag',
      tag: 'PEMERIKSAAN OTOMATIS',
      desc: 'Kamis pukul 08:00 WIB, mesin mengevaluasi 4 indikator deterministik Tahap 1 (R1, R2, R4a, R5) tanpa bobot angka abstrak atau model black-box.',
      metrics: '< 1 Detik untuk 500 Dapur · 100% Konsistensi Deterministik',
      icon: 'smart_toy',
      highlight: 'Aturan tertulis resmi yang transparan dan dapat diaudit ulang kapan pun.'
    },
    {
      num: 3,
      title: 'Label Hijau / Kuning / Merah',
      tag: 'KLASIFIKASI TRIASE',
      desc: 'Hasil pembacaan memisahkan dapur ke dalam 3 antrean penanganan: Hijau (lancar 100%), Kuning (tahan operasional 20%), Merah (hanya bahan baku minimum).',
      metrics: '442 Hijau (88,4%) · 42 Kuning (8,4%) · 16 Merah (3,2%)',
      icon: 'traffic',
      highlight: 'Uang operasional ditahan sementara, hak makan bergizi anak sekolah tetap terjamin.'
    },
    {
      num: 4,
      title: 'PPK Menerbitkan SPP Top-up',
      tag: 'PENCAIRAN DANA',
      desc: 'Pejabat Pembuat Komitmen menerbitkan Surat Perintah Pembayaran (SPP) dengan proteksi likuiditas otomatis berbasis rekomendasi triase.',
      metrics: 'Rp 24,1 Miliar Cair Cepat · Rp 1,1 Miliar Diamankan Sementara',
      icon: 'payments',
      highlight: 'Mitigasi risiko kebocoran fiskal terjadi SEBELUM dana berpindah ke rekening dapur.'
    },
    {
      num: 5,
      title: 'Pemilahan Hasil Verifikasi',
      tag: 'REGISTER KEPUTUSAN',
      desc: 'Auditor BGN & Kemenkeu meneliti berkas yang ditahan: memilah kesalahan administratif jujur (*honest error*) dari indikasi kesengajaan (*fraud*).',
      metrics: '3 Hari Kerja Batas Klarifikasi · 4 Tingkat Keputusan Berjenjang',
      icon: 'gavel',
      highlight: 'SOP bertingkat menjamin keadilan bagi pengelola dapur yang melakukan human error.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#181C20] font-sans antialiased selection:bg-[#FFBA09] selection:text-[#000F4A]">
      {/* AI Login Modal with Sound & Animation */}
      <AiLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* =========================================================================
          NAVBAR (white, sticky, 76px)
      ========================================================================= */}
      <header className="sticky top-0 z-50 h-[76px] bg-white border-b border-[#E0E2E7] shadow-sm flex items-center px-4 md:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Shield-shaped logo mark in navy with a yellow spark, wordmark, badge, tagline */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClickBlip();
                if (onOpenLogoShowcase) onOpenLogoShowcase();
              }}
              title="Lihat Detail Logo & Animasi"
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#011F7B] flex items-center justify-center p-1 shadow-md group-hover:scale-105 transition-transform border border-[#FFBA09]/40">
                <SaringLogoSvg size={32} theme="dark" animated={true} idSuffix="nav-spark" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#011F7B] via-[#0034B3] to-[#FFBA09] bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                    SARING-MBG
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider bg-[#011F7B]/10 text-[#011F7B] border border-[#011F7B]/20 uppercase">
                    RED FLAG MINGGUAN
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#5B6785] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA09] animate-pulse"></span>
                  <span>Gerbang sebelum top-up</span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Links: Fitur Utama, Alur Kerja, Kamus Red Flag, Simulator, Arsitektur */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#454652]">
            <button
              onClick={() => scrollToSection('fitur-utama')}
              className="hover:text-[#011F7B] transition-colors cursor-pointer"
            >
              Fitur Utama
            </button>
            <button
              onClick={() => scrollToSection('alur-kerja')}
              className="hover:text-[#011F7B] transition-colors cursor-pointer"
            >
              Alur Kerja
            </button>
            <button
              onClick={() => scrollToSection('kamus-red-flag')}
              className="hover:text-[#011F7B] transition-colors cursor-pointer"
            >
              Kamus Red Flag
            </button>
            <button
              onClick={() => scrollToSection('simulator')}
              className="hover:text-[#011F7B] transition-colors cursor-pointer"
            >
              Simulator
            </button>
            <button
              onClick={() => scrollToSection('arsitektur')}
              className="hover:text-[#011F7B] transition-colors cursor-pointer"
            >
              Arsitektur
            </button>
          </nav>

          {/* Right: outline navy button "Lihat Simulator" and filled yellow button "Buka Dasbor Simulasi" */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleLaunchLogin('simulator-ambang')}
              className="hidden sm:inline-flex items-center px-4 py-2.5 rounded-xl border border-[#011F7B] text-[#011F7B] font-bold text-xs hover:bg-[#011F7B]/5 transition-all cursor-pointer"
            >
              Lihat Simulator
            </button>

            <button
              onClick={() => handleLaunchLogin('ringkasan')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Buka Dasbor Simulasi</span>
              <span className="material-symbols-outlined text-[16px] font-bold">arrow_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION (full width, dark, about 700px tall)
          Layered gradient from #011F7B to #010F3D, glowing blurred blobs #1B3FBF
      ========================================================================= */}
      <section className="relative w-full min-h-[720px] bg-gradient-to-b from-[#011F7B] via-[#01175E] to-[#010F3D] text-white flex items-center justify-center px-4 md:px-8 py-16 overflow-hidden">
        {/* Soft glowing blurred blobs of lighter blue (#1B3FBF at low opacity) for depth */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#1B3FBF]/25 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-[#1B3FBF]/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FFBA09]/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        ></div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Hero Content) */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Small pill above headline with pulse icon */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#FFBA09]/40 text-[#FFBA09] text-xs font-mono font-semibold tracking-wide backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFBA09] animate-ping"></span>
              <span>Prototipe Gerbang Red Flag Dana MBG</span>
            </div>

            {/* Giant Headline on Three Lines:
                "Baca Laporan Dapur" (white)
                "Sebelum Uang" (gradient white to #FFBA09)
                "Berpindah" (gradient #FFBA09 to warm orange) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] font-['Plus_Jakarta_Sans',sans-serif]">
              <span className="block text-white">Baca Laporan Dapur</span>
              <span className="block bg-gradient-to-r from-white via-[#FFE599] to-[#FFBA09] bg-clip-text text-transparent">
                Sebelum Uang
              </span>
              <span className="block bg-gradient-to-r from-[#FFBA09] via-[#FFA800] to-[#FF8400] bg-clip-text text-transparent">
                Berpindah
              </span>
            </h1>

            {/* Subtext (soft blue-grey #B8C4E6, 20px) */}
            <p className="mt-6 text-lg sm:text-xl text-[#B8C4E6] leading-relaxed max-w-2xl font-normal">
              Aturan red flag tertulis membaca laporan harian dan mutasi virtual account sebelum SPP top-up mingguan diterbitkan, lalu mencairkan secara berjenjang: hijau, kuning, atau merah. Menahan uang, bukan makanan.
            </p>

            {/* Two Buttons: primary yellow + arrow; secondary dark glass button with yellow border */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleLaunchLogin('ringkasan')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-extrabold text-sm transition-all shadow-[0_10px_25px_rgba(255,186,9,0.3)] active:scale-95 cursor-pointer"
              >
                <span>Buka Dasbor Simulasi</span>
                <span className="material-symbols-outlined text-[18px] font-bold">arrow_forward</span>
              </button>

              <button
                onClick={() => scrollToSection('alur-kerja')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#000F4A]/60 hover:bg-[#000F4A]/90 text-white font-bold text-sm border border-[#FFBA09]/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#FFBA09]">alt_route</span>
                <span>Lihat Alur Gerbang</span>
              </button>

              {onOpenLogoShowcase && (
                <button
                  onClick={onOpenLogoShowcase}
                  className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#B8C4E6] text-xs font-mono border border-white/10 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#FFBA09]">verified</span>
                  <span>Animasi Logo</span>
                </button>
              )}
            </div>

            {/* Mini stats row under buttons (mono-font with animated count-up!) */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-mono text-[#B8C4E6]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFBA09] animate-pulse"></span>
                <span className="uppercase tracking-wider">
                  <AnimatedNumber value={4} className="font-bold text-white text-sm mr-1" />
                  red flag tahap 1
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
                <span className="uppercase tracking-wider">
                  <AnimatedNumber value={3} className="font-bold text-white text-sm mr-1" />
                  label pencairan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                <span className="uppercase tracking-wider">
                  <AnimatedNumber value={500} className="font-bold text-white text-sm mr-1" />
                  dapur sintetis
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Glassmorphism Control Center */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#000F4A]/80 backdrop-blur-xl border border-[#FFBA09]/40 rounded-[28px] p-6 sm:p-7 shadow-[0_20px_60px_rgba(1,15,61,0.7)] text-white overflow-hidden group">
              {/* Subtle yellow-tinted border glow reflection */}
              <div className="absolute -top-24 -right-24 w-52 h-52 bg-[#FFBA09]/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Moving scanning wave across the card header */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBA09] to-transparent opacity-75 animate-pulse"></div>

                {/* Card Header */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#011F7B] flex items-center justify-center border border-[#FFBA09]/50 shadow-inner shrink-0">
                      <SaringLogoSvg size={38} theme="dark" animated={true} idSuffix="card-head-anim" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
                          Pusat Kendali SARING-MBG
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FFBA09]/20 text-[#FFBA09] border border-[#FFBA09]/40">
                          SIMULASI
                        </span>
                      </div>
                      <p className="text-xs text-[#B8C4E6] mt-0.5">
                        Gerbang red flag sebelum SPP top-up
                      </p>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-[#B8C4E6] shrink-0">
                    Data sintetis
                  </div>
                </div>

                {/* Status colors banner inside the card: Hijau, Kuning pale amber, Merah with LIVE Animated Count */}
                <div className="my-4 grid grid-cols-3 gap-2.5 p-2.5 bg-[#010F3D]/90 rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#1E9E6A]/20 border border-[#1E9E6A]/40 transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-[18px] text-[#1E9E6A] shrink-0">check_circle</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#1E9E6A] leading-none uppercase">Hijau</span>
                      <span className="text-xs font-mono font-extrabold text-white mt-0.5">
                        <AnimatedNumber value={442} /> SPPG
                      </span>
                      <span className="text-[9px] font-mono text-[#1E9E6A] font-semibold">100% Penuh</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#FFF4CC] border border-[#8A5A00]/40 transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-[18px] text-[#8A5A00] shrink-0">warning</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#8A5A00] leading-none uppercase">Kuning</span>
                      <span className="text-xs font-mono font-extrabold text-[#8A5A00] mt-0.5">
                        <AnimatedNumber value={42} /> SPPG
                      </span>
                      <span className="text-[9px] font-mono text-[#8A5A00]/90 font-semibold">Tahan 20%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-[#D64545]/20 border border-[#D64545]/40 transition-transform hover:scale-105">
                    <span className="material-symbols-outlined text-[18px] text-[#D64545] shrink-0">error</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#D64545] leading-none uppercase">Merah</span>
                      <span className="text-xs font-mono font-extrabold text-white mt-0.5">
                        <AnimatedNumber value={16} /> SPPG
                      </span>
                      <span className="text-[9px] font-mono text-[#D64545] font-semibold">Bahan Min</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Animated Distribution Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[10px] font-mono text-[#B8C4E6] mb-1">
                    <span>RASIO SALUR LIKUIDITAS MINGGUAN (N=500)</span>
                    <span className="text-white font-bold">88,4% Lancar</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden flex">
                    <div className="h-full bg-[#1E9E6A] transition-all duration-700" style={{ width: '88.4%' }}></div>
                    <div className="h-full bg-[#FFBA09] transition-all duration-700" style={{ width: '8.4%' }}></div>
                    <div className="h-full bg-[#D64545] transition-all duration-700" style={{ width: '3.2%' }}></div>
                  </div>
                </div>

                {/* Mono-font Section Label */}
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#FFBA09] uppercase mb-3 flex items-center justify-between">
                  <span>STATUS 3 LAPIS GERBANG (ILUSTRATIF):</span>
                  <span className="text-[9px] font-mono text-[#B8C4E6] bg-white/10 px-1.5 py-0.5 rounded">T+7 AUDIT</span>
                </div>

                {/* Three Rows: SARING, JENJANG, UMPAN */}
                <div className="space-y-3">
                  {/* Row 1: SARING */}
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-between gap-3 group/row">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#011F7B] flex items-center justify-center shrink-0 text-[#FFBA09] group-hover/row:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">filter_alt</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">SARING</span>
                          <span className="text-[10px] font-mono text-[#B8C4E6]">| Penyaringan Red Flag</span>
                        </div>
                        <p className="text-[11px] text-[#B8C4E6] mt-0.5">
                          R1, R2, R4a, R5 dibaca tiap minggu
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFBA09]/20 text-[#FFBA09] border border-[#FFBA09]/30 shrink-0">
                      Tahap 1
                    </span>
                  </div>

                  {/* Row 2: JENJANG */}
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-between gap-3 group/row">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#011F7B] flex items-center justify-center shrink-0 text-[#1E9E6A] group-hover/row:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">JENJANG</span>
                          <span className="text-[10px] font-mono text-[#B8C4E6]">| Pencairan Berjenjang</span>
                        </div>
                        <p className="text-[11px] text-[#B8C4E6] mt-0.5">
                          Hijau penuh, kuning tahan operasional, merah bahan minimum
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1E9E6A]/20 text-[#1E9E6A] border border-[#1E9E6A]/30 shrink-0">
                      3 Label
                    </span>
                  </div>

                  {/* Row 3: UMPAN */}
                  <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 flex items-center justify-between gap-3 group/row">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#011F7B] flex items-center justify-center shrink-0 text-[#FFBA09] group-hover/row:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">UMPAN</span>
                          <span className="text-[10px] font-mono text-[#B8C4E6]">| Pemilahan dan Umpan Audit</span>
                        </div>
                        <p className="text-[11px] text-[#B8C4E6] mt-0.5">
                          Error dipisah dari indikasi kesengajaan
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/15 text-white border border-white/20 shrink-0">
                      4 Tingkat
                    </span>
                  </div>
                </div>

                {/* Bottom: Full-width yellow button with navy text + arrow */}
                <button
                  onClick={() => handleLaunchLogin('ringkasan')}
                  className="w-full mt-6 py-3.5 px-4 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Masuk ke Dasbor Simulasi</span>
                  <span className="material-symbols-outlined text-[18px] font-bold">arrow_forward</span>
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: "MASALAHNYA" (Inovatif & Informatif dengan Mode Perbandingan Interaktif)
          Data Sudah Tercatat, Pembacaannya yang Terlambat
      ========================================================================= */}
      <section id="fitur-utama" className="py-20 px-4 md:px-8 bg-white border-b border-[#E0E2E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011F7B]/5 text-[#011F7B] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">priority_high</span>
              <span>Latar Belakang Kebijakan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#011F7B] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Data Sudah Tercatat, Pembacaannya yang Terlambat
            </h2>
            <p className="mt-3 text-base text-[#5B6785]">
              Tantangan mitigasi kebocoran anggaran makan bergizi bukan pada ketiadaan sistem catatan, melainkan jeda waktu antara pelaporan dan pencairan dana berikutnya.
            </p>
          </div>

          {/* Interactive Switcher: Konvensional vs SARING-MBG */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex p-1 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7]">
              <button
                onClick={() => {
                  soundFx.playClickBlip();
                  setComparisonTab('sebelum');
                }}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  comparisonTab === 'sebelum'
                    ? 'bg-white text-[#D64545] shadow-sm'
                    : 'text-[#5B6785] hover:text-[#011F7B]'
                }`}
              >
                Model Konvensional (Post-Audit)
              </button>
              <button
                onClick={() => {
                  soundFx.playClickBlip();
                  setComparisonTab('sesudah');
                }}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  comparisonTab === 'sesudah'
                    ? 'bg-[#011F7B] text-white shadow-sm'
                    : 'text-[#5B6785] hover:text-[#011F7B]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FFBA09] animate-pulse"></span>
                <span>Model SARING-MBG (Pre-Audit T+7)</span>
              </button>
            </div>
          </div>

          {/* Comparison Metric Banner (Animated) */}
          <div className="mb-10 p-5 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] shadow-xs">
              <span className="text-[11px] font-mono uppercase text-[#5B6785] font-bold block mb-1">
                Waktu Deteksi Anomali
              </span>
              <div className="text-2xl font-extrabold font-mono text-[#011F7B]">
                {comparisonTab === 'sebelum' ? '30–90 Hari' : '< 1 Jam (Pra-SPP)'}
              </div>
              <span className="text-[11px] text-[#5B6785] mt-1 block">
                {comparisonTab === 'sebelum' ? 'Uang terlanjur ditarik tunai' : 'Uang ditahan sebelum berpindah'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] shadow-xs">
              <span className="text-[11px] font-mono uppercase text-[#5B6785] font-bold block mb-1">
                Potensi Pemulihan Anggaran
              </span>
              <div className="text-2xl font-extrabold font-mono text-[#1E9E6A]">
                {comparisonTab === 'sebelum' ? '12% – 25%' : '100% Likuiditas Aman'}
              </div>
              <span className="text-[11px] text-[#5B6785] mt-1 block">
                {comparisonTab === 'sebelum' ? 'Proses TGR / hukum panjang' : 'Hak bayar ditangguhkan sementara'}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] shadow-xs">
              <span className="text-[11px] font-mono uppercase text-[#5B6785] font-bold block mb-1">
                Kepastian Gizi Anak Sekolah
              </span>
              <div className="text-2xl font-extrabold font-mono text-[#8A5A00]">
                {comparisonTab === 'sebelum' ? 'Dapur Tutup Total' : '100% Porsi Makan Tetap Cair'}
              </div>
              <span className="text-[11px] text-[#5B6785] mt-1 block">
                Pencairan berjenjang lindungi bahan baku
              </span>
            </div>
          </div>

          {/* Three Informative Cards with Expandable Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#011F7B]/40 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#011F7B]/10 text-[#011F7B] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <h3 className="text-lg font-bold text-[#011F7B] leading-snug">
                  Laporan harian menjadi dasar pengajuan dana
                </h3>
                <p className="mt-3 text-sm text-[#5B6785] leading-relaxed">
                  Dapur (SPPG) mencatat porsi terdistribusi dan bahan terpakai setiap hari kerja. Namun data ini sering hanya ditumpuk sebagai prasyarat administratif tanpa validasi anomali otomatis.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E0E2E7] flex items-center justify-between text-xs font-mono">
                <span className="text-[#011F7B] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Data Logistik Tersedia
                </span>
                <span className="px-2 py-0.5 rounded bg-[#011F7B]/10 text-[#011F7B] font-bold">
                  Tahap Input
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#FFBA09] hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFBA09]/20 text-[#8A5A00] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">history_toggle_off</span>
                </div>
                <h3 className="text-lg font-bold text-[#011F7B] leading-snug">
                  Penyisiran dilakukan setelah dana keluar
                </h3>
                <p className="mt-3 text-sm text-[#5B6785] leading-relaxed">
                  Audit konvensional (post-audit) baru menyisir bukti transaksi mingguan atau bulanan setelah uang terlanjur ditarik dari rekening penampung, membuat pemulihan kerugian negara lambat.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E0E2E7] flex items-center justify-between text-xs font-mono">
                <span className="text-[#8A5A00] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  Risiko Kas Hilang
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FFF4CC] text-[#8A5A00] font-bold">
                  Kelemahan Klasik
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#D64545]/40 hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#D64545]/10 text-[#D64545] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">speed</span>
                </div>
                <h3 className="text-lg font-bold text-[#011F7B] leading-snug">
                  Skala keputusan mingguan terlalu besar untuk diperiksa manual
                </h3>
                <p className="mt-3 text-sm text-[#5B6785] leading-relaxed">
                  Dengan ribuan SPPG di seluruh Nusantara yang mengajukan top-up serentak setiap Kamis, tim verifikator manusia akan kewalahan (*bottleneck*) jika harus memeriksa ratusan berkas tanpa triase cerdas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E0E2E7] flex items-center justify-between text-xs font-mono">
                <span className="text-[#D64545] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">group_off</span>
                  Kapasitas Terbatas
                </span>
                <span className="px-2 py-0.5 rounded bg-[#FCEBEB] text-[#D64545] font-bold">
                  Solusi: Triase
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: "ALUR KERJA" (Inovatif: Interaktif Step Selector + Animated Flow)
          Horizontal 5-step flow with numbered navy circles and yellow connectors
      ========================================================================= */}
      <section id="alur-kerja" className="py-20 px-4 md:px-8 bg-[#F5F7FC] border-b border-[#E0E2E7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFBA09]/20 text-[#8A5A00] text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
              <span>Mekanisme 5 Langkah Interaktif</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#011F7B] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Alur Kerja Gerbang Sebelum SPP Top-up
            </h2>
            <p className="mt-3 text-base text-[#5B6785]">
              Klik salah satu tahapan di bawah ini untuk melihat rincian proses, data masukan, serta keluaran auditnya.
            </p>
          </div>

          {/* 5-Step Horizontal Flow with Animated Connectors */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {stepDetails.map((step) => {
              const isSelected = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => {
                    soundFx.playClickBlip();
                    setActiveStep(step.num);
                  }}
                  className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#FFBA09] shadow-lg ring-2 ring-[#FFBA09]/40 scale-102'
                      : 'bg-white/80 hover:bg-white border-[#E0E2E7] hover:border-[#011F7B]/30 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-11 h-11 rounded-full font-extrabold font-mono text-base flex items-center justify-center shadow-md transition-colors ${
                          isSelected
                            ? 'bg-[#FFBA09] text-[#000F4A]'
                            : 'bg-[#011F7B] text-[#FFBA09]'
                        }`}
                      >
                        0{step.num}
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-[#011F7B]">
                        {step.icon}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FFBA09] mb-1">
                      {step.tag}
                    </div>
                    <h4 className="text-sm font-bold text-[#011F7B] mb-2 leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-xs text-[#5B6785] line-clamp-3 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ECEEF3] flex items-center justify-between text-[11px] font-semibold text-[#011F7B]">
                    <span>{isSelected ? 'Tahap Aktif' : 'Klik Rincian'}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isSelected ? 'expand_more' : 'chevron_right'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Card (Innovative Expandable Info) */}
          <div className="mt-6 p-6 sm:p-8 rounded-2xl bg-white border border-[#E0E2E7] shadow-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#011F7B]/10 text-[#011F7B] text-xs font-mono font-bold uppercase">
                <span>TAHAP 0{activeStep}: {stepDetails[activeStep - 1].tag}</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#011F7B]">
                {stepDetails[activeStep - 1].title}
              </h3>
              <p className="text-sm text-[#454652] leading-relaxed">
                {stepDetails[activeStep - 1].desc}
              </p>
              <div className="p-3 bg-[#F7F9FE] rounded-xl border border-[#ECEEF3] text-xs font-medium text-[#011F7B] flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#FFBA09]">lightbulb</span>
                <span>{stepDetails[activeStep - 1].highlight}</span>
              </div>
            </div>

            <div className="md:col-span-4 p-5 rounded-xl bg-[#011F7B] text-white flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#FFBA09] font-bold block mb-1">
                  METRIK IMPLEMENTASI
                </span>
                <p className="text-sm font-semibold font-mono text-white leading-snug">
                  {stepDetails[activeStep - 1].metrics}
                </p>
              </div>

              <button
                onClick={() => handleLaunchLogin('antrean-mingguan')}
                className="w-full py-2.5 px-3 rounded-lg bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Lihat Antrean Dapur</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Caption Banner */}
          <div className="mt-10 p-4 rounded-xl bg-[#011F7B] text-white flex items-center justify-center gap-3 text-center shadow-md">
            <span className="material-symbols-outlined text-[#FFBA09] text-[22px]">verified</span>
            <span className="text-sm sm:text-base font-bold tracking-wide">
              "Gerbang menahan uang, bukan menghukum orang."
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "KAMUS RED FLAG TAHAP 1" (Inovatif: Live Rule Testing Mini-Simulator)
          Four compact cards R1, R2, R4a, R5 with one-line descriptions
      ========================================================================= */}
      <section id="kamus-red-flag" className="py-20 px-4 md:px-8 bg-white border-b border-[#E0E2E7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011F7B]/10 text-[#011F7B] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Spesifikasi Algoritma Deterministik</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#011F7B] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Kamus Red Flag Tahap 1
              </h2>
              <p className="mt-2 text-base text-[#5B6785]">
                Empat indikator deterministik yang dihitung secara langsung tanpa bobot angka abstrak. Uji aturan di bawah ini secara langsung:
              </p>
            </div>

            <button
              onClick={() => handleLaunchLogin('kamus-red-flag')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#011F7B] hover:text-[#001356] cursor-pointer"
            >
              <span>Buka Kamus Lengkap (Tahap 1, 2, 3)</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* 4 Compact Cards with Live Interactive Testers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* R1: Rekening Ganda */}
            <div className="p-6 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#D64545] transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-mono font-extrabold text-[#D64545] bg-[#D64545]/10 px-2.5 py-1 rounded-lg">
                    R1
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded transition-colors ${
                    testVaCount > 1 ? 'bg-[#D64545] text-white' : 'bg-[#1E9E6A]/20 text-[#1E9E6A]'
                  }`}>
                    {testVaCount > 1 ? 'Merah (Aktif!)' : 'Wajar (Aman)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#011F7B] mb-2">
                  Duplikasi Rekening VA
                </h3>
                <p className="text-xs text-[#5B6785] leading-relaxed mb-4">
                  Lebih dari satu Virtual Account aktif terdaftar untuk dapur, alamat fisik, atau penanggung jawab yang sama.
                </p>

                {/* Micro Simulator R1 */}
                <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#011F7B]">
                    <span>Jumlah VA Aktif:</span>
                    <span className="font-mono font-bold">{testVaCount} Rekening</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={testVaCount}
                    onChange={(e) => setTestVaCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E0E2E7] rounded-lg appearance-none cursor-pointer accent-[#D64545]"
                  />
                  <span className="text-[10px] text-[#5B6785] font-mono block">
                    Geser ke 2 untuk menguji alert fatal.
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E0E2E7] text-[11px] font-mono text-[#5B6785]">
                Logika: <code>activeVaCount &gt; 1</code>
              </div>
            </div>

            {/* R2: Status Tidak Sah */}
            <div className="p-6 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#D64545] transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-mono font-extrabold text-[#D64545] bg-[#D64545]/10 px-2.5 py-1 rounded-lg">
                    R2
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded transition-colors ${
                    testStatus !== 'beroperasi' ? 'bg-[#D64545] text-white' : 'bg-[#1E9E6A]/20 text-[#1E9E6A]'
                  }`}>
                    {testStatus !== 'beroperasi' ? 'Merah (Aktif!)' : 'Wajar (Aman)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#011F7B] mb-2">
                  Status Operasional SPPG
                </h3>
                <p className="text-xs text-[#5B6785] leading-relaxed mb-4">
                  Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS.
                </p>

                {/* Micro Simulator R2 */}
                <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] space-y-2">
                  <div className="text-xs font-semibold text-[#011F7B] mb-1">
                    Status Dapur Uji:
                  </div>
                  <select
                    value={testStatus}
                    onChange={(e) => setTestStatus(e.target.value as any)}
                    className="w-full text-xs font-semibold p-1.5 rounded border border-[#E0E2E7] bg-white cursor-pointer"
                  >
                    <option value="beroperasi">Beroperasi (Normal)</option>
                    <option value="suspend">Suspend (Pelanggaran)</option>
                    <option value="belum beroperasi">Belum Beroperasi (Baru)</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E0E2E7] text-[11px] font-mono text-[#5B6785]">
                Logika: <code>status != 'beroperasi'</code>
              </div>
            </div>

            {/* R4a: Biaya Melebihi Pagu */}
            <div className="p-6 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#FFBA09] transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-mono font-extrabold text-[#8A5A00] bg-[#FFF4CC] px-2.5 py-1 rounded-lg">
                    R4a
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded transition-colors ${
                    testBahanCost > 10000 ? 'bg-[#FFBA09] text-[#000F4A]' : 'bg-[#1E9E6A]/20 text-[#1E9E6A]'
                  }`}>
                    {testBahanCost > 10000 ? 'Kuning (Aktif!)' : 'Wajar (Aman)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#011F7B] mb-2">
                  Biaya Bahan Melebihi Pagu
                </h3>
                <p className="text-xs text-[#5B6785] leading-relaxed mb-4">
                  Biaya bahan per porsi yang dilaporkan melampaui pagu bahan per porsi (default Rp10.000, perlu dicek ke juknis).
                </p>

                {/* Micro Simulator R4a */}
                <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#011F7B]">
                    <span>Lapor Bahan/Porsi:</span>
                    <span className="font-mono font-bold">Rp {testBahanCost.toLocaleString('id-ID')}</span>
                  </div>
                  <input
                    type="range"
                    min="8000"
                    max="12500"
                    step="100"
                    value={testBahanCost}
                    onChange={(e) => setTestBahanCost(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E0E2E7] rounded-lg appearance-none cursor-pointer accent-[#FFBA09]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#5B6785]">
                    <span>Rp 8.000</span>
                    <span className="text-[#011F7B] font-bold">Pagu Rp 10.000 (perlu dicek juknis)</span>
                    <span>Rp 12.500</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E0E2E7] text-[11px] font-mono text-[#5B6785]">
                Logika: <code>biaya &gt; pagu × (1 + tol)</code>
              </div>
            </div>

            {/* R5: Selisih Laporan vs Mutasi VA */}
            <div className="p-6 rounded-2xl bg-[#F7F9FE] border border-[#E0E2E7] hover:border-[#FFBA09] transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-mono font-extrabold text-[#8A5A00] bg-[#FFF4CC] px-2.5 py-1 rounded-lg">
                    R5
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded transition-colors ${
                    testDisparity > 10 ? 'bg-[#FFBA09] text-[#000F4A]' : 'bg-[#1E9E6A]/20 text-[#1E9E6A]'
                  }`}>
                    {testDisparity > 10 ? 'Kuning (Aktif!)' : 'Wajar (Aman)'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#011F7B] mb-2">
                  Selisih Laporan vs Mutasi VA
                </h3>
                <p className="text-xs text-[#5B6785] leading-relaxed mb-4">
                  Diskrepansi relatif antara total belanja bahan dilaporkan dan mutasi riil arus keluar rekening bank melebihi ambang batas.
                </p>

                {/* Micro Simulator R5 */}
                <div className="p-3 bg-white rounded-xl border border-[#ECEEF3] space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#011F7B]">
                    <span>Gap Diskrepansi:</span>
                    <span className="font-mono font-bold">{testDisparity}%</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="1"
                    value={testDisparity}
                    onChange={(e) => setTestDisparity(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#E0E2E7] rounded-lg appearance-none cursor-pointer accent-[#FFBA09]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#5B6785]">
                    <span>2%</span>
                    <span className="text-[#011F7B] font-bold">Ambang 10%</span>
                    <span>30%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#E0E2E7] text-[11px] font-mono text-[#5B6785]">
                Logika: <code>|lapor - mutasi| / mutasi &gt; ambang</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "SIMULATOR" (Inovatif: Animated Moving Graph + Count-Up Numbers)
          A preview card of sliders and three result numbers, with yellow button "Coba Simulator"
      ========================================================================= */}
      <section id="simulator" className="py-20 px-4 md:px-8 bg-[#F5F7FC] border-b border-[#E0E2E7]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl border border-[#E0E2E7] shadow-xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column of Simulator Preview */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011F7B]/10 text-[#011F7B] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Eksperimen Ambang Kebijakan</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#011F7B] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                Simulator Kalibrasi Ambang Kebijakan
              </h2>
              <p className="mt-3 text-base text-[#5B6785]">
                Sesuaikan toleransi R5 dan R4a untuk melihat langsung kompromi (*trade-off*) antara risiko beban verifikasi lapangan dan potensi kebocoran anggaran negara.
              </p>

              {/* Interactive Sliders */}
              <div className="mt-8 space-y-6 bg-[#F7F9FE] p-6 rounded-2xl border border-[#E0E2E7]">
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#011F7B] mb-2">
                    <span>Toleransi Selisih Mutasi VA (R5)</span>
                    <span className="font-mono text-base font-extrabold text-[#011F7B] bg-white px-2.5 py-0.5 rounded border border-[#E0E2E7]">
                      <AnimatedNumber value={simR5} suffix="%" />
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={simR5}
                    onChange={(e) => setSimR5(Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E2E7] rounded-lg appearance-none cursor-pointer accent-[#FFBA09]"
                  />
                  <div className="flex justify-between text-[11px] text-[#5B6785] font-mono mt-1">
                    <span>5% (Ketat)</span>
                    <span>10% (Default Rekomendasi)</span>
                    <span>30% (Longgar)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[#011F7B] mb-2">
                    <span>Toleransi Pagu Bahan Makanan (R4a)</span>
                    <span className="font-mono text-base font-extrabold text-[#011F7B] bg-white px-2.5 py-0.5 rounded border border-[#E0E2E7]">
                      <AnimatedNumber value={simR4a} suffix="%" />
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="1"
                    value={simR4a}
                    onChange={(e) => setSimR4a(Number(e.target.value))}
                    className="w-full h-2 bg-[#E0E2E7] rounded-lg appearance-none cursor-pointer accent-[#FFBA09]"
                  />
                  <div className="flex justify-between text-[11px] text-[#5B6785] font-mono mt-1">
                    <span>0% (Nol Pelanggaran Pagu)</span>
                    <span>15%</span>
                  </div>
                </div>

                {/* Animated Moving Simulation Visualizer (Dynamic SVG Bar Flow) */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] font-mono text-[#5B6785] mb-1.5">
                    <span>VISUALISASI PROPORSI TRIASE (FLOW ANIMASI):</span>
                    <span className="font-bold text-[#011F7B]">Total 500 SPPG</span>
                  </div>
                  <div className="relative w-full h-8 bg-[#E0E2E7] rounded-xl overflow-hidden flex shadow-inner">
                    <div
                      className="h-full bg-[#1E9E6A] transition-all duration-500 flex items-center justify-center text-[11px] font-bold text-white font-mono"
                      style={{ width: `${(previewHijau / 500) * 100}%` }}
                    >
                      {previewHijau > 350 ? `${previewHijau}` : ''}
                    </div>
                    <div
                      className="h-full bg-[#FFBA09] transition-all duration-500 flex items-center justify-center text-[11px] font-bold text-[#000F4A] font-mono"
                      style={{ width: `${(previewKuning / 500) * 100}%` }}
                    >
                      {previewKuning > 20 ? `${previewKuning}` : ''}
                    </div>
                    <div
                      className="h-full bg-[#D64545] transition-all duration-500 flex items-center justify-center text-[11px] font-bold text-white font-mono"
                      style={{ width: `${(previewMerah / 500) * 100}%` }}
                    >
                      {previewMerah > 10 ? `${previewMerah}` : ''}
                    </div>

                    {/* Moving Laser Scan Pulse */}
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_#ffffff] animate-ping opacity-60"
                      style={{ left: `${(previewHijau / 500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Three Result Numbers & Action Button (with Animated Numbers) */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#011F7B] text-white p-8 rounded-2xl shadow-xl border border-white/10 relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFBA09]/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFBA09]">
                    PROYEKSI TRIASE MINGGUAN (N=500)
                  </span>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-[#B8C4E6]">
                    Live Kalkulasi
                  </span>
                </div>

                {/* 3 Result Numbers with Animated Count */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#1E9E6A]"></span>
                      <span className="text-sm font-bold">Label Hijau (Lancar)</span>
                    </div>
                    <div className="text-xl font-mono font-extrabold text-[#1E9E6A]">
                      <AnimatedNumber value={previewHijau} suffix=" SPPG" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#FFBA09]"></span>
                      <span className="text-sm font-bold">Label Kuning (Tahan 20%)</span>
                    </div>
                    <div className="text-xl font-mono font-extrabold text-[#FFBA09]">
                      <AnimatedNumber value={previewKuning} suffix=" SPPG" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 transition-all hover:bg-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full bg-[#D64545]"></span>
                      <span className="text-sm font-bold">Label Merah (Bahan Min)</span>
                    </div>
                    <div className="text-xl font-mono font-extrabold text-[#D64545]">
                      <AnimatedNumber value={previewMerah} suffix=" SPPG" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={() => handleLaunchLogin('simulator-ambang')}
                  className="w-full py-4 px-6 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Coba Simulator Lengkap</span>
                  <span className="material-symbols-outlined text-[20px] font-bold">tune</span>
                </button>
                <p className="text-[11px] text-center text-[#B8C4E6] mt-2">
                  Akses kurva ROC, kalkulator dana tertahan, dan pengujian beban auditor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "BATAS SIMULASI" (Inovatif: Accordion & Batasan Metodologi)
          Bordered info card: "Data sintetis, bukan data BGN. Ambang dan batas hari adalah usulan yang diuji di pilot. Efektivitas belum teruji."
      ========================================================================= */}
      <section id="arsitektur" className="py-16 px-4 md:px-8 bg-white border-b border-[#E0E2E7]">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#FFF4CC]/40 border-2 border-[#8A5A00]/30 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-[#8A5A00]/15 text-[#8A5A00] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">info</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A5A00]">
                  BATASAN SIMULASI &amp; DISCLAIMER HUKUM
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#8A5A00]/20 text-[#8A5A00]">
                  PENTING
                </span>
              </div>
              <h3 className="text-base font-bold text-[#011F7B]">
                Data sintetis, bukan data BGN. Ambang dan batas hari adalah usulan yang diuji di pilot. Efektivitas belum teruji.
              </h3>
              <p className="mt-1.5 text-xs text-[#5B6785] leading-relaxed">
                Prototipe ini ditujukan murni sebagai demonstrasi metodologis tata kelola risiko keuangan publik. Seluruh entitas, nomor virtual account, dan catatan logistik merupakan hasil pembangkitan pseudorandom teruji untuk tujuan simulasi akademis.
              </p>
            </div>
          </div>

          {/* Three Methodology Validation Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F7F9FE] border border-[#E0E2E7] space-y-1">
              <span className="text-xs font-bold text-[#011F7B] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#1E9E6A]">verified</span>
                1. Data Terisolasi &amp; Aman
              </span>
              <p className="text-[11px] text-[#5B6785] leading-relaxed">
                Tidak ada data pribadi atau rekening operasional dapur nyata yang diakses atau dimanipulasi.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9FE] border border-[#E0E2E7] space-y-1">
              <span className="text-xs font-bold text-[#011F7B] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#FFBA09]">tune</span>
                2. Ambang Kalibrasi Pilot
              </span>
              <p className="text-[11px] text-[#5B6785] leading-relaxed">
                Parameter ambang toleransi 10% (R5) dirancang untuk disesuaikan saat masa uji coba lapangan.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F9FE] border border-[#E0E2E7] space-y-1">
              <span className="text-xs font-bold text-[#011F7B] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#011F7B]">shield</span>
                3. Akuntabilitas Pengambilan Keputusan
              </span>
              <p className="text-[11px] text-[#5B6785] leading-relaxed">
                Tiap intervensi manusia terdokumentasi dalam Register Keputusan lengkap dengan alasan formal auditor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FOOTER (deep navy #011F7B)
      ========================================================================= */}
      <footer className="w-full bg-[#011F7B] text-white pt-16 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: App Info */}
            <div className="md:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#FFBA09]/40">
                  <SaringLogoSvg size={28} theme="dark" animated={false} idSuffix="ft-logo" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFBA09] bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                  SARING-MBG
                </span>
              </div>
              <p className="text-xs text-[#B8C4E6] leading-relaxed max-w-sm mb-4">
                Simulasi instrumen screening red flag laporan harian dapur sebelum penerbitan Surat Perintah Pembayaran (SPP) top-up mingguan Program Makan Bergizi Gratis.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-[#FFBA09]">
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                <span>Prototipe pendamping naskah AEC Auditphoria 6.0</span>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFBA09] mb-4">
                Navigasi Modul
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B8C4E6]">
                <li>
                  <button
                    onClick={() => handleLaunchLogin('ringkasan')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Ringkasan Triase Mingguan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLaunchLogin('antrean-mingguan')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Antrean SPPG &amp; Dispatch PPK
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLaunchLogin('simulator-ambang')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Simulator Ambang &amp; Kurva Trade-off
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLaunchLogin('kamus-red-flag')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Kamus Red Flag (Tahap 1, 2, 3)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleLaunchLogin('error-vs-fraud')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Register Keputusan Error vs Fraud
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Akses Cepat */}
            <div className="md:col-span-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFBA09] mb-4">
                Mulai Uji Coba
              </h4>
              <p className="text-xs text-[#B8C4E6] leading-relaxed mb-4">
                Jelajahi simulasi interaktif lengkap dengan 500 dapur sintetis dan 4 minggu siklus anggaran.
              </p>
              <button
                onClick={() => handleLaunchLogin('ringkasan')}
                className="w-full py-3 px-4 rounded-xl bg-[#FFBA09] hover:bg-[#eaa700] text-[#011F7B] font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Masuk ke Dasbor Prototipe</span>
                <span className="material-symbols-outlined text-[16px] font-bold">login</span>
              </button>
            </div>
          </div>

          {/* Bottom Footer Note */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B8C4E6]/60 gap-4">
            <div>
              © 2026 Kementerian Keuangan RI · Badan Gizi Nasional (BGN) · Tata Kelola MBG
            </div>
            <div className="font-mono">
              Protokol Riset SARING-MBG v1.4
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
