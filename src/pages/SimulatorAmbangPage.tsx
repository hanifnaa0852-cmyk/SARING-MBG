/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SimulationParameters } from '../types';
import { generateSyntheticKitchens, computeSimulationMetrics, computeTradeOffCurve } from '../utils/syntheticData';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface SimulatorAmbangPageProps {
  currentParams: SimulationParameters;
  onUpdateParams: (newParams: SimulationParameters) => void;
}

export const SimulatorAmbangPage: React.FC<SimulatorAmbangPageProps> = ({
  currentParams,
  onUpdateParams,
}) => {
  const [params, setParams] = useState<SimulationParameters>(currentParams);
  const [preset, setPreset] = useState<string>('kalibrasi_awal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Re-run simulation live with current params
  const simulatedKitchens = useMemo(() => {
    return generateSyntheticKitchens(params, 4);
  }, [params]);

  const metrics = useMemo(() => {
    return computeSimulationMetrics(simulatedKitchens, params);
  }, [simulatedKitchens, params]);

  const tradeOffData = useMemo(() => {
    return computeTradeOffCurve(params);
  }, [params.tolR4a, params.propProblematic, params.propHonestError]);

  const handleSliderChange = (key: keyof SimulationParameters, value: number) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    onUpdateParams(updated);
  };

  const handlePresetChange = (presetKey: string) => {
    setPreset(presetKey);
    let updated: SimulationParameters;
    if (presetKey === 'ketat') {
      updated = {
        tolR5: 5,
        tolR4a: 0,
        propProblematic: 78,
        propHonestError: 14,
        fieldCapacity: 450,
      };
    } else if (presetKey === 'longgar') {
      updated = {
        tolR5: 20,
        tolR4a: 5,
        propProblematic: 35,
        propHonestError: 20,
        fieldCapacity: 250,
      };
    } else {
      updated = {
        tolR5: 10,
        tolR4a: 0,
        propProblematic: 75.2,
        propHonestError: 16,
        fieldCapacity: 400,
      };
    }
    setParams(updated);
    onUpdateParams(updated);
    showToast(`Preset "${presetKey === 'ketat' ? 'Pemeriksaan Ketat' : presetKey === 'longgar' ? 'Fasilitasi Kelancaran Salur' : 'Kalibrasi Awal (Urgensi Tinggi)'}" diterapkan.`);
  };

  const handleReset = () => {
    const defaultParams: SimulationParameters = {
      tolR5: 10,
      tolR4a: 0,
      propProblematic: 75.2,
      propHonestError: 16,
      fieldCapacity: 400,
    };
    setPreset('kalibrasi_awal');
    setParams(defaultParams);
    onUpdateParams(defaultParams);
    showToast('Parameter simulasi dikembalikan ke nilai default.');
  };

  const handleExportCSV = () => {
    const headers = ['Toleransi R5 (%)', 'Tingkat Positif Palsu (%)', 'Tingkat Negatif Palsu (%)', 'Jumlah Dapur Ditandai', 'Dana Tertahan (Rp)'];
    const rows = tradeOffData.map((d) => [d.tolR5, d.falsePositiveRate, d.falseNegativeRate, d.flaggedCount, d.withheldTotal]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Skenario_TradeOff_Ambang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Skenario simulasi berhasil diunduh dalam format CSV.');
  };

  // SVG Chart Dimensions & Dynamic Marker Position
  // R5 range 5% - 30% mapped to SVG X: 60 - 720
  const chartX = 60 + ((params.tolR5 - 5) / 25) * (720 - 60);

  return (
    <div className="w-full px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Top Bar Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-[#454652] text-xs">
          <span>Pilar Audit MBG</span>
          <span className="material-symbols-outlined text-[16px] text-[#757683]">chevron_right</span>
          <span className="font-semibold text-[#011F7B]">Simulator Ambang</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-xs border border-[#E0E2E7] text-[#011F7B] text-xs">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span className="font-semibold">Preset:</span>
            <select
              value={preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="bg-transparent border-0 text-[#000F4A] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="kalibrasi_awal">Kalibrasi Awal Tahap 1</option>
              <option value="ketat">Pemeriksaan Ketat (Zero-Leakage)</option>
              <option value="longgar">Fasilitasi Kelancaran Salur</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E0E2E7] text-[#011F7B] text-xs font-semibold shadow-xs hover:bg-[#F1F4F9] transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Skenario (CSV)</span>
          </button>
        </div>
      </div>

      {/* Header Row */}
      <div>
        <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">Simulator Ambang dan Trade-off</h1>
        <p className="text-sm text-[#454652] mt-1">
          Geser ambang untuk melihat dana tertahan, positif palsu, dan beban verifikasi. Semua angka sintetis.
        </p>
      </div>

      {/* Main Grid: 2-column split (35% Left Panel, 65% Right Area) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT PANEL (Parameter Kalibrasi Ambang) ~35% */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl p-6 shadow-sm border border-[#E0E2E7] flex flex-col gap-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#ECEEF3]">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#011F7B]/10 flex items-center justify-center text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </span>
              <span className="text-base font-bold text-[#000F4A]">Parameter Kalibrasi</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#ECEEF3] text-[#454652] uppercase tracking-wider font-semibold">
              5 Parameter
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Slider 1: R5 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#000F4A]">
                  Toleransi selisih rekonsiliasi R5
                </label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#011F7B] text-white font-bold font-mono">
                  {params.tolR5}%
                </span>
              </div>
              <p className="text-[11px] text-[#454652] leading-relaxed">
                Batas toleransi deviasi antara laporan dapur vs arus keluar VA BGN sebelum terpicu R5.
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={params.tolR5}
                  onChange={(e) => handleSliderChange('tolR5', Number(e.target.value))}
                  className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
                />
                <div className="flex justify-between text-[10px] text-[#757683] mt-1 font-mono">
                  <span>5% (Ketat)</span>
                  <span>30% (Longgar)</span>
                </div>
              </div>
            </div>

            {/* Slider 2: R4a */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#000F4A]">
                  Toleransi biaya bahan di atas pagu (R4a)
                </label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECEEF3] text-[#000F4A] font-bold font-mono">
                  {params.tolR4a === 0 ? '0% - Pagu Ketat' : `${params.tolR4a}% (+Rp ${(params.tolR4a * 80).toFixed(0)})`}
                </span>
              </div>
              <p className="text-[11px] text-[#454652] leading-relaxed">
                Toleransi kenaikan harga pasar lokal terhadap pagu regional (Rp 8.000/porsi).
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={params.tolR4a}
                  onChange={(e) => handleSliderChange('tolR4a', Number(e.target.value))}
                  className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
                />
                <div className="flex justify-between text-[10px] text-[#757683] mt-1 font-mono">
                  <span>0% (Rp 8.000)</span>
                  <span>15% (+Rp 1.200)</span>
                </div>
              </div>
            </div>

            {/* Slider 3: Proporsi Dapur Bermasalah */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#000F4A]">
                  Proporsi dapur bermasalah riil
                </label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECEEF3] text-[#000F4A] font-bold font-mono">
                  {params.propProblematic}% (~{Math.round(500 * (params.propProblematic / 100))} dapur)
                </span>
              </div>
              <p className="text-[11px] text-[#454652] leading-relaxed">
                Estimasi proporsi dapur dengan indikasi penyimpangan tata kelola nyata (asumsi data sintetis).
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="2"
                  max="85"
                  step="0.5"
                  value={params.propProblematic}
                  onChange={(e) => handleSliderChange('propProblematic', Number(e.target.value))}
                  className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
                />
                <div className="flex justify-between text-[10px] text-[#757683] mt-1 font-mono">
                  <span>2% (10 unit)</span>
                  <span>85% (425 unit)</span>
                </div>
              </div>
            </div>

            {/* Slider 4: Proporsi Kesalahan Jujur */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#000F4A]">
                  Proporsi kesalahan input jujur
                </label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECEEF3] text-[#000F4A] font-bold font-mono">
                  {params.propHonestError}% (~{Math.round(500 * (params.propHonestError / 100))} dapur)
                </span>
              </div>
              <p className="text-[11px] text-[#454652] leading-relaxed">
                Human error administratif, salah input koma desimal, atau nota terlambat unggah.
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="3"
                  max="30"
                  step="1"
                  value={params.propHonestError}
                  onChange={(e) => handleSliderChange('propHonestError', Number(e.target.value))}
                  className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
                />
                <div className="flex justify-between text-[10px] text-[#757683] mt-1 font-mono">
                  <span>3% (15 unit)</span>
                  <span>30% (150 unit)</span>
                </div>
              </div>
            </div>

            {/* Slider 5: Kapasitas Verifikasi */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#000F4A]">
                  Kapasitas verifikasi lapangan/minggu
                </label>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECEEF3] text-[#000F4A] font-bold font-mono">
                  {params.fieldCapacity} Dapur
                </span>
              </div>
              <p className="text-[11px] text-[#454652] leading-relaxed">
                Jumlah maksimal SPPG yang dapat diverifikasi fisik oleh tim auditor &amp; PPK per siklus.
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={params.fieldCapacity}
                  onChange={(e) => handleSliderChange('fieldCapacity', Number(e.target.value))}
                  className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
                />
                <div className="flex justify-between text-[10px] text-[#757683] mt-1 font-mono">
                  <span>50 SPPG</span>
                  <span>500 SPPG</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onUpdateParams({ ...params });
                showToast('Simulasi berhasil dijalankan ulang.');
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#fcb803] text-[#000F4A] text-xs font-bold shadow-xs hover:bg-[#eaa700] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Jalankan Ulang Simulasi</span>
            </button>
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[#011F7B] text-xs font-semibold hover:bg-[#F1F4F9] rounded-lg transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset ke Default</span>
            </button>
          </div>
        </div>

        {/* RIGHT AREA ~65% */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-4 rounded-xl shadow-xs border border-[#E0E2E7]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-[#011F7B]">query_stats</span>
              <div>
                <h2 className="text-sm font-bold text-[#000F4A]">Hasil Simulasi Dampak &amp; Beban Operasional</h2>
                <p className="text-xs text-[#454652]">Model probabilitas bersyarat dengan perataan top-up mingguan</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECEEF3] text-[#000F4A] text-[10px] font-bold uppercase tracking-wider self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
              <span>Siklus Mingguan N=500 Dapur</span>
            </div>
          </div>

          {/* Grid of 6 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Card 1: Dapur Merah */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Dapur Merah (Audit Lapangan)
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">block</span>
                    Tahan
                  </span>
                </div>
                <div className="text-xl font-bold text-[#D64545] font-mono tabular-nums">
                  <AnimatedNumber value={metrics.merahCount} suffix=" dapur" /> (<AnimatedNumber value={(metrics.merahCount / 500) * 100} decimals={1} suffix="%" />)
                </div>
              </div>
              <p className="text-xs text-[#454652] mt-3 leading-snug">
                Bahan darurat cair, operasional ditahan penuh
              </p>
            </div>

            {/* Card 2: Dapur Kuning */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Dapur Kuning (Klarifikasi Dokumen)
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FFF4CC] text-[#8A5A00] text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    Verifikasi
                  </span>
                </div>
                <div className="text-xl font-bold text-[#8A5A00] font-mono tabular-nums">
                  <AnimatedNumber value={metrics.kuningCount} suffix=" dapur" /> (<AnimatedNumber value={(metrics.kuningCount / 500) * 100} decimals={1} suffix="%" />)
                </div>
              </div>
              <p className="text-xs text-[#454652] mt-3 leading-snug">
                Bahan cair, operasional ditahan 3 hari
              </p>
            </div>

            {/* Card 3: Dana Tertahan Sementara */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Dana Tertahan Sementara
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#ECEEF3] text-[#000F4A]">
                    Ilustrasi
                  </span>
                </div>
                <div className="text-xl font-bold text-[#000F4A] font-mono tabular-nums">
                  <AnimatedNumber value={metrics.withheldTotal / 1000000000} decimals={2} prefix="Rp " suffix=" Miliar" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[#454652]">
                <span>Porsi operasional <AnimatedNumber value={metrics.flaggedCount} /> dapur</span>
                <span className="font-mono text-[#757683] text-[11px]">
                  dari Rp {(metrics.totalRequested / 1000000000).toFixed(2).replace('.', ',')} M
                </span>
              </div>
            </div>

            {/* Card 4: Positif Palsu */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Positif Palsu (% Ditandai)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A]">
                    Beban Dapur Jujur
                  </span>
                </div>
                <div className="text-xl font-bold text-[#000F4A] font-mono tabular-nums">
                  <AnimatedNumber value={metrics.falsePositiveRate} decimals={1} suffix="%" />
                </div>
              </div>
              <p className="text-xs text-[#454652] mt-3 leading-snug">
                <AnimatedNumber value={metrics.falsePositivesCount} /> dari {metrics.flaggedCount} dapur ditandai adalah kesalahan input jujur
              </p>
            </div>

            {/* Card 5: Negatif Palsu */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Negatif Palsu (Bermasalah Lolos)
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#FFF4CC] text-[#8A5A00]">
                    Risiko Kebocoran
                  </span>
                </div>
                <div className="text-xl font-bold text-[#000F4A] font-mono tabular-nums">
                  <AnimatedNumber value={metrics.falseNegativesCount} suffix=" dapur" /> (<AnimatedNumber value={metrics.falseNegativeRate} decimals={1} suffix="%" />)
                </div>
              </div>
              <p className="text-xs text-[#454652] mt-3 leading-snug">
                Dapur berisiko tinggi yang terlewat &amp; lolos top-up 100%
              </p>
            </div>

            {/* Card 6: Beban Lapangan vs Kapasitas */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E0E2E7] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start justify-between gap-1 mb-2">
                  <span className="text-[10px] uppercase text-[#454652] tracking-wider font-semibold">
                    Beban Lapangan vs Kapasitas
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    metrics.isOverCapacity ? 'bg-[#FCEBEB] text-[#B02A2A]' : 'bg-[#E8F6F0] text-[#1E9E6A]'
                  }`}>
                    {metrics.isOverCapacity ? 'Kelebihan Beban' : 'Aman'}
                  </span>
                </div>
                <div className={`text-xl font-bold font-mono tabular-nums ${
                  metrics.isOverCapacity ? 'text-[#D64545]' : 'text-[#000F4A]'
                }`}>
                  <AnimatedNumber value={metrics.flaggedCount} /> / {metrics.capacity} Dapur (<AnimatedNumber value={metrics.burdenPercent} decimals={1} suffix="%" />)
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="w-full bg-[#ECEEF3] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metrics.isOverCapacity ? 'bg-[#D64545]' : 'bg-[#011F7B]'
                    }`}
                    style={{ width: `${Math.min(100, metrics.burdenPercent)}%` }}
                  ></div>
                </div>
                <p className={`text-xs leading-snug ${
                  metrics.isOverCapacity ? 'text-[#D64545] font-semibold' : 'text-[#1E9E6A] font-medium'
                }`}>
                  {metrics.isOverCapacity
                    ? `melebihi kapasitas verifikasi (+${metrics.fieldBurden - metrics.capacity} unit tertunda)`
                    : `Aman: Kapasitas tim verifikasi mencukupi (+${metrics.capacity - metrics.fieldBurden} kuota tersisa)`}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Trade-off Chart Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E0E2E7] flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#011F7B] text-[20px]">show_chart</span>
                  <h3 className="text-sm font-bold text-[#000F4A]">
                    Analisis Trade-off Ambang Sensitivitas (R5 vs Akurasi)
                  </h3>
                </div>
                <p className="text-xs text-[#454652] mt-0.5">
                  Hubungan invers antara Dapur Jujur Tertahan (Tipe I) dan Risiko Kebocoran Lolos (Tipe II)
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-[#011F7B] rounded-full"></span>
                  <span className="font-semibold text-[#011F7B]">Positif Palsu (Jujur Tertahan)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-1 bg-[#fcb803] rounded-full"></span>
                  <span className="font-semibold text-[#8A5A00]">Negatif Palsu (Risiko Lolos)</span>
                </div>
              </div>
            </div>

            {/* Inline Scalable SVG Curve Chart */}
            <div className="w-full bg-[#F1F4F9] rounded-xl p-4 border border-[#E0E2E7]">
              <div className="relative w-full aspect-[21/9] min-h-[200px]">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 760 220" preserveAspectRatio="none">
                  <defs>
                    <style>{`
                      @keyframes flowWaveNavy {
                        0% { stroke-dashoffset: 120; }
                        100% { stroke-dashoffset: 0; }
                      }
                      @keyframes flowWaveGold {
                        0% { stroke-dashoffset: -120; }
                        100% { stroke-dashoffset: 0; }
                      }
                      @keyframes pulseNode {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.4); opacity: 0.7; }
                      }
                      .curve-flow-navy {
                        stroke-dasharray: 6 3;
                        animation: flowWaveNavy 3s linear infinite;
                      }
                      .curve-flow-gold {
                        stroke-dasharray: 6 3;
                        animation: flowWaveGold 3s linear infinite;
                      }
                    `}</style>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="60" y1="20" x2="720" y2="20" stroke="#E0E2E7" strokeDasharray="4" />
                  <line x1="60" y1="60" x2="720" y2="60" stroke="#E0E2E7" strokeDasharray="4" />
                  <line x1="60" y1="100" x2="720" y2="100" stroke="#E0E2E7" strokeDasharray="4" />
                  <line x1="60" y1="140" x2="720" y2="140" stroke="#E0E2E7" strokeDasharray="4" />
                  <line x1="60" y1="180" x2="720" y2="180" stroke="#C5C5D4" strokeWidth="1.5" />

                  {/* Y Axis Labels */}
                  <text x="45" y="24" textAnchor="end" fill="#757683" fontSize="11" fontFamily="Plus Jakarta Sans">60%</text>
                  <text x="45" y="64" textAnchor="end" fill="#757683" fontSize="11" fontFamily="Plus Jakarta Sans">45%</text>
                  <text x="45" y="104" textAnchor="end" fill="#757683" fontSize="11" fontFamily="Plus Jakarta Sans">30%</text>
                  <text x="45" y="144" textAnchor="end" fill="#757683" fontSize="11" fontFamily="Plus Jakarta Sans">15%</text>
                  <text x="45" y="184" textAnchor="end" fill="#757683" fontSize="11" fontFamily="Plus Jakarta Sans">0%</text>

                  {/* Active Setting Indicator Zone */}
                  <rect
                    x={chartX - 12}
                    y="15"
                    width="24"
                    height="165"
                    rx="4"
                    fill="#011F7B"
                    fillOpacity="0.08"
                  />
                  <line
                    x1={chartX}
                    y1="15"
                    x2={chartX}
                    y2="180"
                    stroke="#011F7B"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />

                  {/* Curve 1: Positif Palsu (Navy #011F7B with Moving Flow) */}
                  <path
                    d="M 60 33 C 120 50, 150 75, 192 81 C 240 88, 280 110, 324 116 C 380 124, 420 138, 456 142 C 510 148, 550 156, 588 158 C 640 161, 680 167, 720 169"
                    fill="none"
                    stroke="#011F7B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="curve-flow-navy"
                  />

                  {/* Curve 2: Negatif Palsu (Yellow #fcb803 with Moving Flow) */}
                  <path
                    d="M 60 177 C 110 176, 150 174, 192 172 C 240 170, 280 163, 324 158 C 380 152, 420 143, 456 137 C 510 128, 550 120, 588 110 C 640 98, 680 84, 720 78"
                    fill="none"
                    stroke="#fcb803"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="curve-flow-gold"
                  />

                  {/* Data Points Positif Palsu */}
                  <circle cx="60" cy="33" r="4" fill="#011F7B" />
                  <circle cx="192" cy="81" r="5.5" fill="#011F7B" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="324" cy="116" r="4" fill="#011F7B" />
                  <circle cx="456" cy="142" r="4" fill="#011F7B" />
                  <circle cx="588" cy="158" r="4" fill="#011F7B" />
                  <circle cx="720" cy="169" r="4" fill="#011F7B" />

                  {/* Data Points Negatif Palsu */}
                  <circle cx="60" cy="177" r="4" fill="#fcb803" />
                  <circle cx="192" cy="172" r="5.5" fill="#fcb803" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="324" cy="158" r="4" fill="#fcb803" />
                  <circle cx="456" cy="137" r="4" fill="#fcb803" />
                  <circle cx="588" cy="110" r="4" fill="#fcb803" />
                  <circle cx="720" cy="78" r="4" fill="#fcb803" />

                  {/* Interactive Pin Marker with Animated Beacon */}
                  <g transform={`translate(${chartX}, 45)`}>
                    <circle cx="0" cy="0" r="8" fill="#FFBA09" opacity="0.3" className="animate-ping" />
                    <rect x="-80" y="-26" width="160" height="22" rx="4" fill="#011F7B" />
                    <text x="0" y="-11" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans">
                      Titik Aktif: Ambang {params.tolR5}%
                    </text>
                    <polygon points="-4,-4 4,-4 0,0" fill="#011F7B" />
                  </g>

                  {/* X Axis Labels */}
                  <text x="60" y="202" textAnchor="middle" fill="#454652" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">5%</text>
                  <text x="192" y="202" textAnchor="middle" fill="#011F7B" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans">10%</text>
                  <text x="324" y="202" textAnchor="middle" fill="#454652" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">15%</text>
                  <text x="456" y="202" textAnchor="middle" fill="#454652" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">20%</text>
                  <text x="588" y="202" textAnchor="middle" fill="#454652" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">25%</text>
                  <text x="720" y="202" textAnchor="middle" fill="#454652" fontSize="12" fontWeight="600" fontFamily="Plus Jakarta Sans">30%</text>
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs text-[#454652] px-2 pt-2">
                <span className="font-medium">← Zona Pengawasan Ketat</span>
                <span className="font-semibold text-[#011F7B]">Toleransi Selisih R5 (%)</span>
                <span className="font-medium">Zona Akselerasi Salur →</span>
              </div>
            </div>

            {/* Trade-off Principle Callout */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#ECEEF3] border-l-4 border-[#011F7B] text-xs">
              <span className="material-symbols-outlined text-[18px] text-[#011F7B] shrink-0 mt-0.5">balance</span>
              <div>
                <span className="font-bold text-[#000F4A]">Prinsip Ekuilibrium Audit:</span>
                <span className="text-[#454652] ml-1">
                  Ambang yang ketat (&lt; 10%) menangkap lebih banyak potensi fraud namun menahan puluhan dapur jujur (risiko disrupsi makanan anak). Ambang yang terlalu longgar (&gt; 20%) memperlancar likuiditas tetapi meningkatkan risiko kebocoran kas negara tanpa verifikasi.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Muted Footer Note Card */}
      <div className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] flex items-start gap-3 text-[#454652] text-xs">
        <span className="material-symbols-outlined text-[20px] text-[#011F7B] shrink-0 mt-0.5">info</span>
        <p className="leading-relaxed">
          <strong className="text-[#000F4A] font-semibold">Catatan Metodologi Audit:</strong> Simulasi ini menunjukkan cara kerja mekanisme pertukaran risiko (trade-off), bukan membuktikan efektivitas statis. Ambang batas adalah usulan dinamis yang dikalibrasi berkala pada uji coba lapangan untuk menyeimbangkan pelindungan integritas APBN dan kepastian pemenuhan nutrisi anak sekolah tanpa jeda pasokan.
        </p>
      </div>
    </div>
  );
};
