/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Kitchen, PageId } from '../types';
import { getHistoricalWeeksSummary } from '../utils/syntheticData';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { soundFx } from '../utils/soundEffects';

interface RingkasanPageProps {
  kitchens: Kitchen[];
  onNavigate: (page: PageId) => void;
}

export const RingkasanPage: React.FC<RingkasanPageProps> = ({ kitchens, onNavigate }) => {
  const [selectedWeek, setSelectedWeek] = useState<'w4' | 'w3' | 'w2' | 'w1'>('w4');
  const [activeRoadStep, setActiveRoadStep] = useState<number>(3);
  const [isAutoPlayingRoad, setIsAutoPlayingRoad] = useState<boolean>(false);

  useEffect(() => {
    if (!isAutoPlayingRoad) return;
    const timer = setInterval(() => {
      setActiveRoadStep((prev) => (prev % 5) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlayingRoad]);


  const total = kitchens.length;
  const hijauCount = kitchens.filter((k) => k.triase === 'Hijau').length;
  const kuningCount = kitchens.filter((k) => k.triase === 'Kuning').length;
  const merahCount = kitchens.filter((k) => k.triase === 'Merah').length;

  const hijauPct = ((hijauCount / total) * 100).toFixed(1).replace('.', ',');
  const kuningPct = ((kuningCount / total) * 100).toFixed(1).replace('.', ',');
  const merahPct = ((merahCount / total) * 100).toFixed(1).replace('.', ',');

  // Withheld operational funds for Yellow and Red
  const withheldTotal = kitchens
    .filter((k) => k.triase !== 'Hijau')
    .reduce((acc, k) => acc + k.heldBudget, 0);

  const withheldBillions = (withheldTotal / 1000000000).toFixed(1).replace('.', ',');

  const historicalData = getHistoricalWeeksSummary(kitchens);

  return (
    <div className="px-8 py-6 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
      {/* Top Area / Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">
              Ringkasan Gerbang Minggu Ini
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#ECEEF3] text-[#454652] text-xs font-semibold uppercase tracking-wider">
              Siklus Audit T+7
            </span>
          </div>
          <p className="text-sm text-[#454652]">
            Dibaca sebelum SPP top-up diterbitkan PPK untuk mitigasi anomali anggaran porsi & logistik
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Week Selector Dropdown */}
          <div className="relative inline-flex items-center bg-white rounded-lg shadow-sm border border-[#E0E2E7]">
            <span className="material-symbols-outlined text-[18px] text-[#454652] pl-3 pointer-events-none">
              calendar_today
            </span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value as any)}
              className="appearance-none bg-transparent pl-2 pr-9 py-2 text-sm font-semibold text-[#000F4A] focus:outline-none cursor-pointer"
            >
              <option value="w4">Minggu 4 (Aktif)</option>
              <option value="w3">Minggu 3 (Selesai)</option>
              <option value="w2">Minggu 2 (Selesai)</option>
              <option value="w1">Minggu 1 (Selesai)</option>
            </select>
            <span className="material-symbols-outlined text-[20px] text-[#454652] absolute right-2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Primary CTA Button: Exactly 1 per screen */}
          <button
            onClick={() => onNavigate('antrean-mingguan')}
            className="inline-flex items-center gap-2 bg-[#fcb803] hover:bg-[#eaa700] text-[#000F4A] px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-[#fcb803]/40 cursor-pointer"
          >
            <span>Buka Antrean Mingguan</span>
            <span className="material-symbols-outlined text-[20px] font-bold">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: Top-up diperiksa */}
        <div className="relative bg-white rounded-xl p-5 shadow-sm border border-[#E0E2E7] flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#011F7B]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold text-[#454652]">
                Top-Up Diperiksa
              </span>
              <span className="material-symbols-outlined text-[#011F7B] text-[20px]">
                fact_check
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] tabular-nums">
                <AnimatedNumber value={total} />
              </span>
              <span className="text-sm font-semibold text-[#454652]/70 tabular-nums">
                / {total} SPPG
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 bg-[#F1F4F9] rounded-lg p-2.5 flex items-center gap-1.5 text-[#000F4A]">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B]">
              verified_user
            </span>
            <span className="text-xs font-semibold">100% tervalidasi sebelum SPP</span>
          </div>
        </div>

        {/* KPI 2: Hijau */}
        <div className="relative bg-white rounded-xl p-5 shadow-sm border border-[#E0E2E7] flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1E9E6A]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8F6F0] text-[#1E9E6A] text-[11px] font-bold uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Aman - Siap Salur</span>
              </span>
              <span className="text-xs text-[#454652] font-bold tabular-nums">
                <AnimatedNumber value={(hijauCount / total) * 100} decimals={1} suffix="%" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] tabular-nums">
                <AnimatedNumber value={hijauCount} />
              </span>
              <span className="text-xs text-[#454652]">satuan</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#454652] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#1E9E6A]">bolt</span>
            <span>Top-up penuh dicairkan sesuai jadwal rutin</span>
          </p>
        </div>

        {/* KPI 3: Kuning */}
        <div className="relative bg-white rounded-xl p-5 shadow-sm border border-[#E0E2E7] flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#fcb803]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF4CC] text-[#8A5A00] text-[11px] font-bold uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">warning</span>
                <span>Verifikasi Lapangan</span>
              </span>
              <span className="text-xs text-[#454652] font-bold tabular-nums">
                <AnimatedNumber value={(kuningCount / total) * 100} decimals={1} suffix="%" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] tabular-nums">
                <AnimatedNumber value={kuningCount} />
              </span>
              <span className="text-xs text-[#454652]">satuan</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#454652] leading-relaxed">
            Bahan baku tetap cair; operasional ditahan pending klarifikasi nota
          </p>
        </div>

        {/* KPI 4: Merah */}
        <div className="relative bg-white rounded-xl p-5 shadow-sm border border-[#E0E2E7] flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#D64545]"></div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCEBEB] text-[#B02A2A] text-[11px] font-bold uppercase tracking-wide">
                <span className="material-symbols-outlined text-[14px]">dangerous</span>
                <span>Red Flag - Tahan Salur</span>
              </span>
              <span className="text-xs text-[#454652] font-bold tabular-nums">
                <AnimatedNumber value={(merahCount / total) * 100} decimals={1} suffix="%" />
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] tabular-nums">
                <AnimatedNumber value={merahCount} />
              </span>
              <span className="text-xs text-[#454652]">satuan</span>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#454652] leading-relaxed">
            Penyaluran bahan baku minimum darurat &amp; investigasi langsung ITJEN
          </p>
        </div>
      </div>

      {/* Row 2: Two Cards (Tren 4 Minggu ~65% vs Dana Tertahan ~35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl p-6 shadow-sm border border-[#E0E2E7] flex flex-col justify-between">
          <div>
            {/* Header and Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#ECEEF3]">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-[#000F4A]">Tren 4 Minggu Terakhir</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCEBEB] text-[#D64545] border border-[#F5C2C2] text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    <span className="material-symbols-outlined text-[13px]">emergency</span>
                    Urgensi Tinggi (Merah Dominan &gt;70%)
                  </span>
                </div>
                <p className="text-xs text-[#454652] mt-0.5">
                  Distribusi triase kepatuhan SPPG per periode mingguan (N = 500 unit dapur) — Pengawasan ketat pra-pencairan SPP
                </p>
              </div>

              {/* Legend Indicators */}
              <div className="flex items-center gap-3 self-start sm:self-auto bg-[#F1F4F9] px-3 py-1.5 rounded-lg border border-[#E0E2E7]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#1E9E6A]"></span>
                  <span className="text-xs text-[#181C20] font-medium">Hijau (Aman)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#fcb803]"></span>
                  <span className="text-xs text-[#181C20] font-medium">Kuning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-[#D64545] shadow-[0_0_6px_#D64545]"></span>
                  <span className="text-xs text-[#B02A2A] font-bold">Merah (Urgensi Kritis)</span>
                </div>
              </div>
            </div>

            {/* Stacked Bar Visualisation Container */}
            <div className="py-4 flex flex-col gap-4">
              {historicalData.map((item) => {
                const hPct = ((item.hijau / item.total) * 100).toFixed(1);
                const kPct = ((item.kuning / item.total) * 100).toFixed(1);
                const mPct = ((item.merah / item.total) * 100).toFixed(1);

                return (
                  <div
                    key={item.week}
                    className={`flex flex-col gap-1.5 ${
                      item.active ? 'p-3 bg-[#FFF5F5] rounded-xl border-2 border-[#D64545]/40 shadow-xs' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#000F4A] flex items-center gap-1.5">
                        {item.active && (
                          <span className="w-2 h-2 rounded-full bg-[#D64545] animate-ping"></span>
                        )}
                        {item.label}
                        {item.active && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#D64545] text-white font-bold font-mono">
                            SIKLUS AKTIF
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-3 text-[#454652] tabular-nums font-mono text-xs">
                        <span>H: <strong className="text-[#1E9E6A]">{item.hijau}</strong> ({hPct.replace('.', ',')}%)</span>
                        <span>K: <strong className="text-[#8A5A00]">{item.kuning}</strong> ({kPct.replace('.', ',')}%)</span>
                        <span className="px-2 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A] font-bold border border-[#F5C2C2]">
                          M: <strong className="text-[#D64545]">{item.merah}</strong> ({mPct.replace('.', ',')}%)
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-8 rounded-lg overflow-hidden flex bg-[#ECEEF3] shadow-inner border border-[#E0E2E7]">
                      {/* Hijau Bar Segment */}
                      <div
                        className="bg-[#1E9E6A] h-full flex items-center justify-center text-white text-[10px] font-bold transition-all hover:opacity-90"
                        style={{ width: `${hPct}%` }}
                        title={`Hijau: ${item.hijau} unit (${hPct}%)`}
                      >
                        {item.hijau}
                      </div>

                      {/* Kuning Bar Segment */}
                      <div
                        className="bg-[#fcb803] h-full flex items-center justify-center text-[#000F4A] text-[10px] font-bold transition-all hover:opacity-90"
                        style={{ width: `${kPct}%` }}
                        title={`Kuning: ${item.kuning} unit (${kPct}%)`}
                      >
                        {item.kuning}
                      </div>

                      {/* Merah Bar Segment (DOMINAN BESAR & MENONJOL) */}
                      <div
                        className="bg-gradient-to-r from-[#D64545] to-[#B02A2A] h-full flex items-center justify-center text-white text-xs font-extrabold shadow-inner relative transition-all hover:brightness-105"
                        style={{ width: `${mPct}%` }}
                        title={`Merah (Urgensi Kritis): ${item.merah} unit (${mPct}%)`}
                      >
                        <div className="flex items-center gap-1.5 px-2 truncate">
                          <span className="material-symbols-outlined text-[15px] animate-pulse">dangerous</span>
                          <span>Merah: {item.merah} Unit ({mPct.replace('.', ',')}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metric comparison footnote */}
          <div className="mt-3 pt-3 border-t border-[#ECEEF3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#454652]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FCEBEB] text-[#B02A2A] text-xs font-bold border border-[#F5C2C2]">
                <span className="material-symbols-outlined text-[15px]">report</span>
                Status Merah Dominan: &gt;75% Dapur Wajib Audit Lapangan
              </span>
              <span className="text-xs text-[#525363]">
                Tren eskalasi red flag memuncak di M4 (376 dapur terindikasi risiko)
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#D64545] bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
              URGENSI TERTINGGI: DANA OPERASIONAL DITAHAN
            </span>
          </div>
        </div>

        {/* Right Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-[#E0E2E7] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#011F7B] text-white text-[10px] font-bold uppercase tracking-wider">
                Simulasi Finansial
              </span>
              <span className="material-symbols-outlined text-[#011F7B] text-[20px]">
                account_balance_wallet
              </span>
            </div>
            <h2 className="text-base font-bold text-[#000F4A]">Dana Tertahan Sementara</h2>

            {/* Big Highlight Metric */}
            <div className="mt-4 bg-[#F1F4F9] rounded-xl p-5 text-center border border-[#E0E2E7]">
              <p className="text-[11px] uppercase tracking-wider text-[#454652] font-semibold mb-1">
                Total Pagu Operasional Ditangguhkan
              </p>
              <div className="text-3xl font-extrabold text-[#000F4A] tracking-tight tabular-nums">
                <AnimatedNumber value={withheldTotal / 1000000000} decimals={2} prefix="Rp " suffix=" miliar" />
              </div>
              <p className="mt-1.5 text-xs italic text-[#454652]">
                *bukan klaim kebocoran riil, bagian dari skenario simulasi
              </p>
            </div>

            {/* Breakdown Stats */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E0E2E7] shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fcb803]"></span>
                  <span className="text-xs text-[#181C20] font-medium">Median verifikasi kuning</span>
                </div>
                <span className="text-sm font-bold text-[#000F4A] tabular-nums font-mono">2,1 hari kerja</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#E0E2E7] shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]"></span>
                  <span className="text-xs text-[#181C20] font-medium">Median verifikasi merah</span>
                </div>
                <span className="text-sm font-bold text-[#000F4A] tabular-nums font-mono">3,8 hari kerja</span>
              </div>
            </div>
          </div>

          {/* Policy protection guarantee banner */}
          <div className="mt-5 p-3.5 rounded-lg bg-[#E8F6F0] border border-[#A3DFC4] flex items-start gap-2.5 text-[#1E9E6A]">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
              health_and_safety
            </span>
            <p className="text-xs leading-snug font-medium text-[#0F603E]">
              Alokasi bahan baku pokok siswa tetap dijamin 100% lancar tanpa hambatan pencairan di semua titik dapur.
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: Alur Gerbang Mingguan (Model Jalan Melengkung Animatif & Inovatif) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-[#E0E2E7] flex flex-col gap-6">
        {/* Header Kontrol & Navigasi Model Jalan */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#F0F2F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#011F7B] text-[#FFBA09] flex items-center justify-center shadow-md shadow-[#011F7B]/15">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#000F4A] tracking-tight">
                  Alur Gerbang Mingguan
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF0FF] text-[#011F7B] border border-[#CCD8FC] text-[11px] font-bold uppercase tracking-wider">
                  Model Jalan Audit
                </span>
              </div>
              <p className="text-xs text-[#525363] mt-0.5">
                Rute perjalanan berkas dari pelaporan dapur hingga pencairan bertingkat kas negara
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Auto-play simulation button */}
            <button
              onClick={() => {
                soundFx.playClickBlip();
                setIsAutoPlayingRoad(!isAutoPlayingRoad);
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isAutoPlayingRoad
                  ? 'bg-[#FFBA09] text-[#011F7B] ring-2 ring-[#FFBA09]/40 font-extrabold'
                  : 'bg-[#F1F4F9] text-[#011F7B] hover:bg-[#E5E9F2]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isAutoPlayingRoad ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{isAutoPlayingRoad ? 'Jeda Simulasi' : 'Jalankan Tur Otomatis'}</span>
            </button>

            {/* Step navigation buttons */}
            <div className="flex items-center bg-[#F1F4F9] rounded-lg p-0.5 border border-[#E0E2E7]">
              <button
                onClick={() => {
                  soundFx.playClickBlip();
                  setActiveRoadStep((prev) => (prev === 1 ? 5 : prev - 1));
                }}
                title="Langkah Sebelumnya"
                className="w-8 h-8 rounded-md flex items-center justify-center text-[#011F7B] hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="px-2.5 text-xs font-mono font-bold text-[#000F4A]">
                POS 0{activeRoadStep} / 05
              </span>
              <button
                onClick={() => {
                  soundFx.playClickBlip();
                  setActiveRoadStep((prev) => (prev === 5 ? 1 : prev + 1));
                }}
                title="Langkah Berikutnya"
                className="w-8 h-8 rounded-md flex items-center justify-center text-[#011F7B] hover:bg-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Station Tab Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 1, km: 'KM 01', label: 'Laporan SPPG', time: 'Senin–Sabtu' },
            { id: 2, km: 'KM 02', label: 'Mesin Red Flag', time: 'Kamis 07:59' },
            { id: 3, km: 'KM 03', label: 'Gerbang Triase', time: 'Kamis 08:00' },
            { id: 4, km: 'KM 04', label: 'Penerbitan SPP', time: 'Kamis 10:00' },
            { id: 5, km: 'KM 05', label: 'Verifikasi', time: 'T+3 Hari' }
          ].map((item) => {
            const isActive = activeRoadStep === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClickBlip();
                  setActiveRoadStep(item.id);
                }}
                className={`relative px-3 py-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#011F7B] text-white border-[#011F7B] shadow-md shadow-[#011F7B]/20 ring-2 ring-[#FFBA09]'
                    : 'bg-[#F7F9FC] text-[#454652] border-[#E5E8F0] hover:bg-[#EEF2F8]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span
                    className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#FFBA09] text-[#011F7B]' : 'bg-[#E4E8F2] text-[#011F7B]'
                    }`}
                  >
                    {item.km}
                  </span>
                  <span className={`text-[10px] ${isActive ? 'text-[#B8C4E6]' : 'text-[#7B7E8C]'}`}>
                    {item.time}
                  </span>
                </div>
                <div
                  className={`text-xs font-bold truncate ${
                    isActive ? 'text-[#FFBA09]' : 'text-[#000F4A]'
                  }`}
                >
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Winding Road Highway SVG Visual Container */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#011550] via-[#010D33] to-[#00081E] p-4 sm:p-6 overflow-hidden border border-[#011F7B]/50 shadow-inner">
          {/* Subtle blueprint grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Road landscape horizon tags */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#B8C4E6]/80 mb-2 px-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1E9E6A] animate-pulse"></span>
              TITIK AWAL: INPUT DAPUR SPPG
            </span>
            <span className="hidden sm:inline-block text-[#FFBA09] font-bold">
              • JALUR AUDIT PREVENTIF MBG 500 TITIK •
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FFBA09] animate-pulse"></span>
              TITIK AKHIR: PENCAIRAN TOP-UP & REKONSILIASI
            </span>
          </div>

          {/* SVG Canvas for Winding Road */}
          <div className="relative w-full overflow-x-auto pb-2">
            <svg
              viewBox="0 0 1100 270"
              className="w-full min-w-[860px] h-auto select-none overflow-visible"
            >
              <defs>
                {/* Glow for road boundary */}
                <filter id="roadAura" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Glow for beacon transport pod */}
                <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Linear gradient for active node aura */}
                <radialGradient id="activeNodeAura">
                  <stop offset="0%" stopColor="#FFBA09" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FFBA09" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Road Path Geometry Definition: Undulating S-Curve with zero tangent at stations */}
              {/* Station 1: (100, 160)
                  Station 2: (325, 95)
                  Station 3: (550, 175)
                  Station 4: (775, 95)
                  Station 5: (1000, 160) */}

              {/* 1. Road glow backdrop */}
              <path
                d="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                fill="none"
                stroke="#0230A5"
                strokeWidth="50"
                opacity="0.35"
                filter="url(#roadAura)"
              />

              {/* 2. Road Foundation Bed (Dark Asphalt Embankment) */}
              <path
                d="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                fill="none"
                stroke="#071126"
                strokeWidth="42"
                strokeLinecap="round"
              />

              {/* 3. Road Driving Surface (Smooth Asphalt Ribbon) */}
              <path
                d="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                fill="none"
                stroke="#0E1B3D"
                strokeWidth="34"
                strokeLinecap="round"
              />

              {/* 4. Guard Rails / Outer Road Trim Edge Lines */}
              <path
                d="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                fill="none"
                stroke="#25489E"
                strokeWidth="32"
                strokeDasharray="2 4"
                opacity="0.3"
              />

              {/* 5. Center Lane Divider: Animated Yellow Flowing Dash Markings */}
              <path
                d="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                fill="none"
                stroke="#FFBA09"
                strokeWidth="3"
                strokeDasharray="10 8"
                className="animate-road-dash"
                opacity="0.95"
              />

              {/* 6. High-Speed Luminous Audit Pod / Traveling Data Vehicle */}
              <g>
                <animateMotion
                  dur="11s"
                  repeatCount="indefinite"
                  path="M 100 160 C 190 160, 235 95, 325 95 C 415 95, 460 175, 550 175 C 640 175, 685 95, 775 95 C 865 95, 910 160, 1000 160"
                  rotate="auto"
                />
                {/* Pod Headlight Beam */}
                <ellipse cx="20" cy="0" rx="9" ry="3.5" fill="#FFEAA7" opacity="0.8" filter="url(#beaconGlow)" />
                {/* Pod Light Trail Behind */}
                <line x1="-16" y1="0" x2="-32" y2="0" stroke="#FFBA09" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
                {/* Pod Chassis */}
                <rect x="-15" y="-8" width="30" height="16" rx="8" fill="#FFBA09" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Pod Core Light */}
                <circle cx="2" cy="0" r="4" fill="#011F7B" />
                <circle cx="2" cy="0" r="2" fill="#FFFFFF" />
              </g>

              {/* 7. Road Stations / Checkpoints Along the Curve */}
              {[
                {
                  id: 1,
                  km: 'KM 01',
                  time: 'Senin–Sabtu',
                  title: 'Laporan SPPG',
                  x: 100,
                  y: 160,
                  labelSide: 'bottom',
                  icon: 'assignment'
                },
                {
                  id: 2,
                  km: 'KM 02',
                  time: 'Kamis 07:59',
                  title: 'Mesin Red Flag',
                  x: 325,
                  y: 95,
                  labelSide: 'top',
                  icon: 'psychology'
                },
                {
                  id: 3,
                  km: 'KM 03',
                  time: 'Kamis 08:00',
                  title: 'Gerbang Triase',
                  x: 550,
                  y: 175,
                  labelSide: 'bottom',
                  icon: 'traffic'
                },
                {
                  id: 4,
                  km: 'KM 04',
                  time: 'Kamis 10:00',
                  title: 'Penerbitan SPP',
                  x: 775,
                  y: 95,
                  labelSide: 'top',
                  icon: 'history_edu'
                },
                {
                  id: 5,
                  km: 'KM 05',
                  time: 'T+3 Hari',
                  title: 'Verifikasi Fisik',
                  x: 1000,
                  y: 160,
                  labelSide: 'bottom',
                  icon: 'task_alt'
                }
              ].map((st) => {
                const isActive = activeRoadStep === st.id;
                const isTop = st.labelSide === 'top';

                return (
                  <g
                    key={st.id}
                    onClick={() => {
                      soundFx.playClickBlip();
                      setActiveRoadStep(st.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Active Radar Ping Effect */}
                    {isActive && (
                      <>
                        <circle
                          cx={st.x}
                          cy={st.y}
                          r="32"
                          fill="url(#activeNodeAura)"
                          className="animate-pulse"
                        />
                        <circle
                          cx={st.x}
                          cy={st.y}
                          r="28"
                          fill="none"
                          stroke="#FFBA09"
                          strokeWidth="2"
                          opacity="0.7"
                          className="animate-ping"
                          style={{ transformOrigin: `${st.x}px ${st.y}px` }}
                        />
                      </>
                    )}

                    {/* Outer Road Hub Ring */}
                    <circle
                      cx={st.x}
                      cy={st.y}
                      r="22"
                      fill={isActive ? '#011F7B' : '#071536'}
                      stroke={isActive ? '#FFBA09' : '#2B4A96'}
                      strokeWidth={isActive ? '3.5' : '2'}
                      className="transition-all duration-300 group-hover:stroke-[#FFBA09]"
                    />

                    {/* Center Station Badge */}
                    <circle
                      cx={st.x}
                      cy={st.y}
                      r="15"
                      fill={isActive ? '#FFBA09' : '#0E2254'}
                      className="transition-colors duration-300"
                    />

                    {/* Station Number Text */}
                    <text
                      x={st.x}
                      y={st.y + 4.5}
                      textAnchor="middle"
                      fill={isActive ? '#011F7B' : '#FFFFFF'}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      0{st.id}
                    </text>

                    {/* Milestone Connection Pin / Guideline to Label */}
                    <line
                      x1={st.x}
                      y1={isTop ? st.y - 23 : st.y + 23}
                      x2={st.x}
                      y2={isTop ? st.y - 36 : st.y + 36}
                      stroke={isActive ? '#FFBA09' : '#3959A8'}
                      strokeWidth={isActive ? '2' : '1.5'}
                      strokeDasharray="2 2"
                    />

                    {/* Milestone Label Badge (Rendered in SVG with Crisp Typography) */}
                    <g transform={`translate(${st.x}, ${isTop ? st.y - 65 : st.y + 55})`}>
                      {/* Badge Background */}
                      <rect
                        x="-65"
                        y="-16"
                        width="130"
                        height="34"
                        rx="8"
                        fill={isActive ? '#FFBA09' : '#061332'}
                        stroke={isActive ? '#FFFFFF' : '#274794'}
                        strokeWidth={isActive ? '1.5' : '1'}
                        className="transition-all duration-300"
                      />
                      {/* Top Mini Tag: KM & Time */}
                      <text
                        x="0"
                        y="-3"
                        textAnchor="middle"
                        fill={isActive ? '#011F7B' : '#B8C4E6'}
                        fontSize="9"
                        fontWeight="700"
                        fontFamily="JetBrains Mono, monospace"
                      >
                        {st.km} • {st.time}
                      </text>
                      {/* Title */}
                      <text
                        x="0"
                        y="11"
                        textAnchor="middle"
                        fill={isActive ? '#000F4A' : '#FFFFFF'}
                        fontSize="11"
                        fontWeight="800"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {st.title}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Road footer caption hint */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#B8C4E6] mt-1 pt-3 border-t border-[#011F7B]/40">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#FFBA09]">touch_app</span>
              <span>Klik salah satu pos (KM 01 – KM 05) di atas untuk membuka perincian operasional</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-2 text-[11px] font-mono text-[#FFBA09]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E6A]"></span>
              SISTEM AKTIF: KAMIS MINGGU BERJALAN
            </span>
          </div>
        </div>

        {/* Interactive Station Deep-Dive Detail Panel (Pos Pemantauan Terpadu) */}
        {(() => {
          const STATIONS_DATA = [
            {
              id: 1,
              km: 'KM 01',
              waktu: 'Senin – Sabtu (Cut-off Rabu 23:59 WIB)',
              judul: 'Laporan Harian & Absensi SPPG',
              subjudul: 'Pencatatan realisasi porsi, menu gizi 4 sehat 5 sempurna, & nota logistik pasar',
              tahap: 'TAHAP 01 · INPUT & AGREGASI DATA',
              icon: 'assignment',
              pic: 'Operator SPPG & Kepala Dapur Wilayah',
              sla: 'Harian s/d 18:00 WIB (Cut-off Rabu 23:59 WIB)',
              statusKesiapan: '100% Data Teragregasi di Server BGN',
              inputData: [
                'Absensi porsi riil siswa penerima manfaat makan bergizi',
                'Dokumentasi variasi menu gizi harian (karbohidrat, protein, sayur, buah)',
                'Nota & kuitansi belanja logistik pasar basah & distributor resmi',
                'Nomor rekening Virtual Account (VA) operasional aktif per dapur'
              ],
              outputAksi: [
                'Data harian diagregasi menjadi total realisasi mingguan',
                'Enkripsi berkas laporan dan penguncian tanggal kirim (timestamp BGN)',
                'Kompilasi paket data siap disaring mesin aturan sebelum Kamis pagi'
              ],
              targetPage: 'antrean' as PageId,
              targetLabel: 'Lihat Antrean Dapur'
            },
            {
              id: 2,
              km: 'KM 02',
              waktu: 'Kamis 07:59 WIB (Proses Instan < 3 Detik)',
              judul: 'Mesin Aturan Red Flag',
              subjudul: 'Automasi komparasi harga acuan daerah, porsi, & kepatuhan mutasi rekening koran',
              tahap: 'TAHAP 02 · AUDIT MESIN REAL-TIME',
              icon: 'psychology',
              pic: 'Mesin Audit Otomatis SARING-MBG (BGN Engine)',
              sla: '< 3 Detik untuk 500 Dapur Nasional',
              statusKesiapan: 'Audit Otomatis Selesai Tanpa Intervensi Manual',
              inputData: [
                'Pagu harga bahan baku per wilayah (Rp8.000 / Rp10.000 per porsi)',
                'Rekening koran mutasi Virtual Account perbankan mitra BGN',
                'Status legalitas dapur, izin sanitasi, & akreditasi kelayakan',
                'Pola arus keluar kas rekening vs klaim pengeluaran di nota'
              ],
              outputAksi: [
                'Pendeteksian R1: Kepemilikan Virtual Account ganda / tumpang-tindih',
                'Pendeteksian R2: Status dapur non-aktif atau izin belum rampung',
                'Pendeteksian R4a: Biaya bahan melampaui pagu resmi wilayah',
                'Pendeteksian R4b: Selisih signifikan laporan belanja vs mutasi rekening'
              ],
              targetPage: 'kamus' as PageId,
              targetLabel: 'Buka Kamus Red Flag'
            },
            {
              id: 3,
              km: 'KM 03',
              waktu: 'Kamis 08:00 WIB (Penerbitan Label Triase)',
              judul: 'Gerbang Triase Kategori Risiko',
              subjudul: 'Penetapan status protektif berjenjang sebelum Surat Perintah Pembayaran diterbitkan',
              tahap: 'TAHAP 03 · PINTU GERBANG RISIKO',
              icon: 'traffic',
              pic: 'Sistem Penapisan Risiko BGN & Panel Pengawas',
              sla: 'Tepat Pukul 08:00 WIB Setiap Hari Kamis',
              statusKesiapan: 'Triase Diterbitkan: Hijau 392, Kuning 52, Merah 56',
              inputData: [
                'Hasil komputasi 4 red flag tahap 1 (R1, R2, R4a, R4b)',
                'Skor risiko komposit per unit SPPG',
                'Riwayat performa kepatuhan dan reputasi pekan sebelumnya'
              ],
              outputAksi: [
                'HIJAU: Lolos bersih 100%, rekomendasi top-up penuh langsung cair',
                'KUNING: Anomali moderat, top-up bahan pangan cair, dana operasional ditahan',
                'MERAH: Anomali kritis, seluruh top-up ditahan sementara ke antrean audit prioritas'
              ],
              targetPage: 'simulator' as PageId,
              targetLabel: 'Uji di Simulator Ambang'
            },
            {
              id: 4,
              km: 'KM 04',
              waktu: 'Kamis 10:00 – 12:00 WIB (Penerbitan SPP)',
              judul: 'PPK Menerbitkan SPP Berjenjang',
              subjudul: 'Eksekusi pencairan terproteksi: menjamin pasokan pangan & mengunci risiko fiskal',
              tahap: 'TAHAP 04 · EKSEKUSI ANGGARAN',
              icon: 'history_edu',
              pic: 'Pejabat Pembuat Komitmen (PPK) BGN & Kas Negara (KPPN)',
              sla: 'Maksimal 2 Jam Pasca Triase',
              statusKesiapan: 'SPP Diterbitkan Terproteksi Sesuai Rekomendasi Triase',
              inputData: [
                'Berita Acara Rekomendasi Triase Gerbang SARING-MBG',
                'Nilai pagu top-up bersih setelah pemotongan dana ditahan (held budget)',
                'Otorisasi tanda tangan elektronik pejabat berwenang'
              ],
              outputAksi: [
                'Top-up penuh ditransfer ke Virtual Account SPPG Hijau',
                'Top-up parsial (khusus bahan pangan) disalurkan ke SPPG Kuning',
                'Dana makan siang siswa tetap tiba tepat waktu, risiko kebocoran terisolasi di kas negara'
              ],
              targetPage: 'antrean' as PageId,
              targetLabel: 'Pantau Realisasi Dana'
            },
            {
              id: 5,
              km: 'KM 05',
              waktu: 'T+3 Hari Kerja (Jumat s/d Selasa Pekan Depan)',
              judul: 'Pemilahan Verifikasi Lapangan',
              subjudul: 'Audit fisik lapangan, pembuktian sanggahan, & pelepasan sisa dana ditahan',
              tahap: 'TAHAP 05 · RESOLUSI & AKUNTABILITAS',
              icon: 'task_alt',
              pic: 'Tim Verifikator Wilayah, Auditor BGN & Mitra Perbankan',
              sla: 'Maksimal 3 Hari Kerja Pasca Penetapan',
              statusKesiapan: 'Proses Resolusi Berjalan Berdasarkan Register Keputusan',
              inputData: [
                'Unggahan dokumen klarifikasi dan bukti nota sah dari pengelola SPPG',
                'Laporan hasil inspeksi mendadak (sidak) fisik dapur lapangan',
                'Konfirmasi data penerimaan bahan pangan dari pihak komite sekolah'
              ],
              outputAksi: [
                'Kesalahan Jujur (Human Error): Diberikan asistensi teknis dan sisa dana ditahan dilepas',
                'Fraud Terstruktur: Pembekuan izin permanen, penutupan VA, dan pelaporan penegak hukum',
                'Pembaruan otomatis register reputasi dapur untuk siklus pekan berikutnya'
              ],
              targetPage: 'errorFraud' as PageId,
              targetLabel: 'Buka Register Keputusan'
            }
          ];

          const currentStation =
            STATIONS_DATA.find((s) => s.id === activeRoadStep) || STATIONS_DATA[2];

          return (
            <div className="bg-[#F8FAFD] rounded-xl p-5 border border-[#CCD8FC] shadow-sm flex flex-col gap-4">
              {/* Header Info Pos Aktif */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F4]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#011F7B] text-[#FFBA09] flex items-center justify-center font-bold text-lg shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">
                      {currentStation.icon}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#011F7B] text-[#FFBA09] text-[10px] font-mono font-bold tracking-wider">
                        {currentStation.km}
                      </span>
                      <span className="text-xs font-bold text-[#011F7B] uppercase tracking-wide">
                        {currentStation.tahap}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#000F4A] mt-0.5">
                      {currentStation.judul}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#CCD8FC] text-xs font-semibold text-[#000F4A]">
                    <span className="material-symbols-outlined text-[16px] text-[#011F7B]">
                      schedule
                    </span>
                    <span>{currentStation.waktu}</span>
                  </span>
                  <button
                    onClick={() => onNavigate(currentStation.targetPage)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#011F7B] text-white text-xs font-bold hover:bg-[#001760] transition-colors shadow-sm"
                  >
                    <span>{currentStation.targetLabel}</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* 3-Kolom Rincian Operasional Pos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Kolom 1: Aktor Pelaksana & SLA */}
                <div className="bg-white rounded-xl p-4 border border-[#E0E2E7] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#011F7B] uppercase tracking-wider mb-2">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                      <span>Pelaksana & Standar Layanan</span>
                    </div>
                    <div className="space-y-2.5 text-xs mt-3">
                      <div>
                        <span className="text-[#696A75] block text-[11px] font-medium">
                          Penanggung Jawab (PIC):
                        </span>
                        <span className="font-bold text-[#000F4A] leading-snug">
                          {currentStation.pic}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#696A75] block text-[11px] font-medium">
                          Target SLA:
                        </span>
                        <span className="font-semibold text-[#011F7B]">
                          {currentStation.sla}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F0F2F6] flex items-center gap-2 text-[11px] text-[#1E9E6A] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
                    <span>{currentStation.statusKesiapan}</span>
                  </div>
                </div>

                {/* Kolom 2: Parameter & Data Masukan (Input) */}
                <div className="bg-white rounded-xl p-4 border border-[#E0E2E7] flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#011F7B] uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-[18px]">input</span>
                    <span>Parameter Data Masukan</span>
                  </div>
                  <ul className="space-y-1.5 mt-2 flex-1">
                    {currentStation.inputData.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#454652] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA09] shrink-0 mt-1.5"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kolom 3: Aksi & Luaran Sistem (Output) */}
                <div className="bg-white rounded-xl p-4 border border-[#E0E2E7] flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#011F7B] uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-[18px]">output</span>
                    <span>Aksi & Keputusan Sistem</span>
                  </div>
                  <ul className="space-y-1.5 mt-2 flex-1">
                    {currentStation.outputAksi.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#454652] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#011F7B] shrink-0 mt-1.5"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Governance Principle Callout Banner */}
        <div className="rounded-xl p-4 bg-gradient-to-r from-[#ECEEF3] to-[#F4F6FB] border border-[#C5C5D4]/50 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#011F7B] text-[#FFBA09] flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">gavel</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#454652] font-bold">
              Prinsip Pokok Tata Kelola MBG
            </span>
            <p className="text-base font-bold text-[#000F4A] mt-0.5">
              « Gerbang menahan uang, bukan menghukum orang. »
            </p>
            <p className="text-xs text-[#454652] mt-0.5 leading-relaxed">
              Menjaga integritas APBN dan kesinambungan pangan siswa melalui kendali likuiditas preventif, bukan sanksi represif retroaktif.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

