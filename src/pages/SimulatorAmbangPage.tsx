/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { SimulationParameters } from '../types';
import {
  generateSyntheticKitchens,
  computeSimulationMetrics,
  computeTradeOffCurve,
  DEFAULT_SIMULATION_PARAMETERS
} from '../utils/syntheticData';
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
  const [selectedChartThreshold, setSelectedChartThreshold] = useState<'R3' | 'R4' | 'R5'>('R5');
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

  // Trade-off curve for selected threshold (R3, R4, or R5)
  const tradeOffData = useMemo(() => {
    return computeTradeOffCurve(params, selectedChartThreshold);
  }, [params, selectedChartThreshold]);

  const handleSliderChange = (key: keyof SimulationParameters, value: number | string | boolean) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    onUpdateParams(updated);
  };

  const handlePresetChange = (presetKey: string) => {
    setPreset(presetKey);
    let updated: SimulationParameters;
    if (presetKey === 'ketat') {
      updated = {
        ...params,
        mode: 'tahap1_2',
        tolR3: 2,
        tolR4: 0,
        tolR5: 5,
        propProblematic: 6,
        propHonestError: 10,
        fieldCapacity: 200,
        docReviewCapacity: 700,
      };
    } else if (presetKey === 'longgar') {
      updated = {
        ...params,
        mode: 'tahap1_2',
        tolR3: 10,
        tolR4: 5,
        tolR5: 20,
        propProblematic: 3,
        propHonestError: 5,
        fieldCapacity: 120,
        docReviewCapacity: 500,
      };
    } else {
      updated = {
        ...DEFAULT_SIMULATION_PARAMETERS,
      };
    }
    setParams(updated);
    onUpdateParams(updated);
    showToast(`Preset "${presetKey === 'ketat' ? 'Pemeriksaan Ketat' : presetKey === 'longgar' ? 'Fasilitasi Kelancaran Salur' : 'Rancangan Pilot (Tahap 1 Default)'}" diterapkan.`);
  };

  const handleReset = () => {
    setPreset('kalibrasi_awal');
    setParams(DEFAULT_SIMULATION_PARAMETERS);
    onUpdateParams(DEFAULT_SIMULATION_PARAMETERS);
    showToast('Parameter simulasi dikembalikan ke default juknis pilot.');
  };

  const handleExportCSV = () => {
    const headers = ['Nilai Ambang (%)', 'Tingkat Positif Palsu (%)', 'Tingkat Negatif Palsu (%)', 'Jumlah Dapur Ditandai', 'Dana Tertahan (Rp)'];
    const rows = tradeOffData.map((d) => [d.thresholdValue, d.falsePositiveRate, d.falseNegativeRate, d.flaggedCount, d.withheldTotal]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Skenario_TradeOff_${selectedChartThreshold}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Skenario simulasi berhasil diunduh dalam format CSV.');
  };

  // SVG Chart Dimensions & Dynamic Marker Position
  // Mapped to SVG Y: 0 - 100% (Y: 180 -> 20, height 160)
  const getY = (val: number) => 180 - (Math.min(100, Math.max(0, val)) / 100) * 160;

  // Active value on X axis
  let activeThreshVal = params.tolR5;
  let minThresh = 5;
  let maxThresh = 30;
  if (selectedChartThreshold === 'R3') {
    activeThreshVal = params.tolR3;
    minThresh = 0;
    maxThresh = 20;
  } else if (selectedChartThreshold === 'R4') {
    activeThreshVal = params.tolR4;
    minThresh = 0;
    maxThresh = 15;
  }

  const getX = (val: number) => 60 + ((val - minThresh) / (maxThresh - minThresh || 1)) * 660;

  const fpPoints = tradeOffData.map(d => ({ x: getX(d.thresholdValue), y: getY(d.falsePositiveRate), tol: d.thresholdValue, val: d.falsePositiveRate }));
  const fnPoints = tradeOffData.map(d => ({ x: getX(d.thresholdValue), y: getY(d.falseNegativeRate), tol: d.thresholdValue, val: d.falseNegativeRate }));

  const fpPath = fpPoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
  const fnPath = fnPoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  const activeMarkerX = getX(activeThreshVal);
  const activeFpY = getY(metrics.falsePositiveRate);
  const activeFnY = getY(metrics.falseNegativeRate);

  return (
    <div className="w-full px-8 py-6 max-w-[1600px] mx-auto space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#454652] text-xs">
            <span>Pilar Audit MBG</span>
            <span className="material-symbols-outlined text-[14px] text-[#C5C5D4]">chevron_right</span>
            <span className="font-semibold text-[#000F4A]">Simulator Ambang &amp; Kurva Trade-off</span>
          </nav>
          <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight mt-1">
            Simulator Ambang &amp; Kurva Trade-off Forensik
          </h1>
          <p className="text-sm text-[#454652]">
            Eksplorasi trade-off sensitivitas red flag, kapasitas verifikator, dan kepastian salur bahan baku MBG.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#000F4A] border border-[#E0E2E7] rounded-lg shadow-xs hover:bg-[#F1F4F9] transition-colors text-xs font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Ekspor Skenario (CSV)</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PARAMETER CONTROLS (~35%) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-5 space-y-5">
          <div className="border-b border-[#ECEEF3] pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#757683]">
                Mode &amp; Parameter Gerbang
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#ECEEF3] text-[#000F4A]">
                N = 500 Dapur
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#000F4A] block">
                Cakupan Tahap Red Flag
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-[#F1F4F9] p-1 rounded-lg border border-[#E0E2E7]">
                <button
                  type="button"
                  onClick={() => handleSliderChange('mode', 'tahap1')}
                  className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center ${
                    params.mode === 'tahap1'
                      ? 'bg-[#011F7B] text-white shadow-xs'
                      : 'text-[#454652] hover:text-[#000F4A]'
                  }`}
                >
                  Tahap 1 (Pilot: R1, R2, R3)
                </button>
                <button
                  type="button"
                  onClick={() => handleSliderChange('mode', 'tahap1_2')}
                  className={`py-1.5 px-2 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center ${
                    params.mode === 'tahap1_2'
                      ? 'bg-[#011F7B] text-white shadow-xs'
                      : 'text-[#454652] hover:text-[#000F4A]'
                  }`}
                >
                  Tahap 1 + 2 (+ R4, R5, R8)
                </button>
              </div>
              <p className="text-[10px] text-[#757683]">
                {params.mode === 'tahap1'
                  ? 'Hanya R1, R2, R3 yang dihitung (sesuai rancangan awal pilot di satu wilayah).'
                  : 'Seluruh R1, R2, R3, R4, R5, dan R8 dihitung bersamaan.'}
              </p>
            </div>

            {/* Preset Selector */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#454652] block mb-1.5">Preset Kalibrasi:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: 'kalibrasi_awal', label: 'Pilot (Def)' },
                  { key: 'ketat', label: 'Ketat' },
                  { key: 'longgar', label: 'Longgar' },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handlePresetChange(p.key)}
                    className={`py-1 px-2 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                      preset === p.key
                        ? 'bg-[#011F7B] text-white border-[#011F7B] shadow-xs'
                        : 'bg-[#F1F4F9] text-[#454652] border-[#E0E2E7] hover:bg-[#ECEEF3]'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SLIDERS LIST */}
          <div className="space-y-4 text-xs">
            {/* Slider 1: Toleransi R3 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A] flex items-center gap-1">
                  <span>Toleransi kelebihan porsi (R3)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FFF4CC] text-[#8A5A00]">Tahap 1</span>
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.tolR3}%
                </span>
              </div>
              <p className="text-[11px] text-[#454652]">
                Batas wajar kelebihan porsi harian vs data penerima hasil sinkronisasi.
              </p>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={params.tolR3}
                onChange={(e) => handleSliderChange('tolR3', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>0% (Ketat)</span>
                <span>5% (Default)</span>
                <span>20% (Longgar)</span>
              </div>
            </div>

            {/* Slider 2: Toleransi R4 */}
            <div className={`flex flex-col gap-1.5 ${params.mode === 'tahap1' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A] flex items-center gap-1">
                  <span>Toleransi biaya bahan (R4)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ECEEF3] text-[#454652]">Tahap 2</span>
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.tolR4}%
                </span>
              </div>
              <p className="text-[11px] text-[#454652]">
                Toleransi harga bahan pasar vs harga acuan Rp {(params.hargaAcuan || 10000).toLocaleString('id-ID')}.
              </p>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={params.tolR4}
                onChange={(e) => handleSliderChange('tolR4', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>0% (Acuan HET)</span>
                <span>15%</span>
              </div>
            </div>

            {/* Slider 3: Toleransi R5 */}
            <div className={`flex flex-col gap-1.5 ${params.mode === 'tahap1' ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A] flex items-center gap-1">
                  <span>Toleransi selisih rekonsiliasi (R5)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#ECEEF3] text-[#454652]">Tahap 2</span>
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.tolR5}%
                </span>
              </div>
              <p className="text-[11px] text-[#454652]">
                Batas deviasi laporan belanja harian SPPG vs mutasi keluar Virtual Account.
              </p>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={params.tolR5}
                onChange={(e) => handleSliderChange('tolR5', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>5% (Ketat)</span>
                <span>10% (Default)</span>
                <span>30% (Longgar)</span>
              </div>
            </div>

            {/* Parameter Harga Acuan Bahan per Porsi */}
            <div className="p-3 bg-[#F7F9FE] rounded-lg border border-[#011F7B]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#000F4A]">
                  Harga acuan bahan per porsi
                </label>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FFBA09]/20 text-[#8A5A00] font-bold">
                  perlu dicek ke juknis
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#454652]">Rp</span>
                <input
                  type="number"
                  step="500"
                  min="6000"
                  max="16000"
                  value={params.hargaAcuan}
                  onChange={(e) => handleSliderChange('hargaAcuan', Number(e.target.value))}
                  className="w-full px-2.5 py-1 text-xs font-mono font-bold border border-[#E0E2E7] rounded bg-white text-[#000F4A]"
                />
              </div>
              <p className="text-[10px] text-[#757683]">
                Digunakan oleh R4 dan kalkulasi alokasi bahan baku minimum dapur Merah.
              </p>
            </div>

            {/* Parameter Porsi Operasional */}
            <div className="p-3 bg-[#F1F4F9] rounded-lg border border-[#E0E2E7] space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#000F4A]">
                  Porsi operasional top-up
                </label>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#ECEEF3] text-[#454652] font-semibold">
                  asumsi simulasi
                </span>
              </div>
              <div className="flex items-center justify-between">
                <input
                  type="range"
                  min="10"
                  max="35"
                  step="1"
                  value={params.operasionalShare}
                  onChange={(e) => handleSliderChange('operasionalShare', Number(e.target.value))}
                  className="w-3/4 h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#011F7B]"
                />
                <span className="font-mono font-bold text-xs text-[#000F4A]">
                  {params.operasionalShare}%
                </span>
              </div>
              <p className="text-[10px] text-[#757683]">
                Top-up hanya terdiri dari dua komponen: bahan baku ({(100 - params.operasionalShare)}%) dan operasional ({params.operasionalShare}%).
              </p>
            </div>

            {/* Slider 4: Proporsi Bermasalah Riil */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A]">
                  Proporsi dapur bermasalah riil (p)
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.propProblematic}% (~{Math.round(500 * (params.propProblematic / 100))} dapur)
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={params.propProblematic}
                onChange={(e) => handleSliderChange('propProblematic', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>2%</span>
                <span>4% (Default)</span>
                <span>10%</span>
              </div>
            </div>

            {/* Slider 5: Proporsi Kesalahan Jujur */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A]">
                  Proporsi kesalahan input jujur
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.propHonestError}% (~{Math.round(500 * (params.propHonestError / 100))} dapur)
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                step="0.5"
                value={params.propHonestError}
                onChange={(e) => handleSliderChange('propHonestError', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#fcb803]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>3%</span>
                <span>8% (Default)</span>
                <span>15%</span>
              </div>
            </div>

            {/* Slider 6: Kapasitas Lapangan Merah */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A]">
                  Kapasitas verifikasi lapangan (Merah)
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.fieldCapacity} / minggu
                </span>
              </div>
              <span className="text-[10px] text-[#757683] italic">
                asumsi: jumlah verifikator BGN belum diketahui
              </span>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={params.fieldCapacity}
                onChange={(e) => handleSliderChange('fieldCapacity', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#011F7B]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>50</span>
                <span>150 (Default)</span>
                <span>500</span>
              </div>
            </div>

            {/* Slider 7: Kapasitas Reviu Dokumen Kuning */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[#000F4A]">
                  Kapasitas reviu dokumen (Kuning)
                </label>
                <span className="font-mono font-bold text-[#000F4A] bg-[#ECEEF3] px-2 py-0.5 rounded">
                  {params.docReviewCapacity} / minggu
                </span>
              </div>
              <span className="text-[10px] text-[#757683] italic">
                asumsi kapasitas verifikator memeriksa berkas tertulis
              </span>
              <input
                type="range"
                min="200"
                max="1000"
                step="25"
                value={params.docReviewCapacity}
                onChange={(e) => handleSliderChange('docReviewCapacity', Number(e.target.value))}
                className="w-full h-2 bg-[#ECEEF3] rounded-lg appearance-none cursor-pointer accent-[#011F7B]"
              />
              <div className="flex justify-between text-[10px] text-[#757683] font-mono">
                <span>200</span>
                <span>600 (Default)</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-[#011F7B] text-xs font-semibold hover:bg-[#F1F4F9] rounded-lg transition-colors cursor-pointer border border-[#E0E2E7]"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Parameter ke Default</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DASHBOARD CARDS & TRADE-OFF CURVE (~65%) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* PRIMARY METRIC CARDS (10 Key Figures) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Dapur Merah */}
            <div className="bg-white p-4 rounded-xl border border-[#FAC7C7] bg-[#FCEBEB]/20 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B02A2A]">
                  DAPUR MERAH (BAHAN MINIMUM)
                </span>
                <div className="text-2xl font-black text-[#B02A2A] mt-1 font-mono">
                  <AnimatedNumber value={metrics.merahCount} /> <span className="text-xs font-normal text-[#454652]">/ 500</span>
                </div>
              </div>
              <p className="text-[11px] text-[#454652] mt-2 pt-2 border-t border-[#FAC7C7]/50">
                Verifikasi lapangan maks. 4 hari kerja oleh Verifikator BGN.
              </p>
            </div>

            {/* Card 2: Dapur Kuning */}
            <div className="bg-white p-4 rounded-xl border border-[#F0DB85] bg-[#FFF4CC]/20 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A5A00]">
                  DAPUR KUNING (KLARIFIKASI)
                </span>
                <div className="text-2xl font-black text-[#8A5A00] mt-1 font-mono">
                  <AnimatedNumber value={metrics.kuningCount} /> <span className="text-xs font-normal text-[#454652]">/ 500</span>
                </div>
              </div>
              <p className="text-[11px] text-[#454652] mt-2 pt-2 border-t border-[#F0DB85]/50">
                Bahan baku cair, operasional ditahan (klarifikasi maks. 3 hari kerja).
              </p>
            </div>

            {/* Card 3: Positif Palsu */}
            <div className="bg-white p-4 rounded-xl border border-[#E0E2E7] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#757683]">
                  POSITIF PALSU (TYPE I)
                </span>
                <div className="text-2xl font-bold text-[#000F4A] mt-1 font-mono">
                  <AnimatedNumber value={metrics.falsePositiveRate} decimals={1} suffix="%" />
                </div>
              </div>
              <div className="text-[10px] text-[#454652] mt-2 pt-2 border-t border-[#ECEEF3] space-y-0.5">
                <span className="font-semibold block">Penyebut: {metrics.falsePositivesCount} dapur tidak bermasalah / {metrics.flaggedCount} dapur ditandai</span>
              </div>
            </div>

            {/* Card 4: Negatif Palsu */}
            <div className="bg-white p-4 rounded-xl border border-[#E0E2E7] shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#757683]">
                  NEGATIF PALSU (LOLOS HIJAU)
                </span>
                <div className="text-2xl font-bold text-[#000F4A] mt-1 font-mono">
                  <AnimatedNumber value={metrics.falseNegativeRate} decimals={1} suffix="%" />
                </div>
              </div>
              <div className="text-[10px] text-[#454652] mt-2 pt-2 border-t border-[#ECEEF3] space-y-0.5">
                <span className="block font-semibold">Penyebut total: {metrics.falseNegativesCount} / 500 dapur</span>
                <span className="text-[#757683] block">Rasio atas Hijau: {metrics.falseNegativesOverHijauRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* SECOND ROW: PRESISI & DANA TERTAHAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Presisi Card */}
            <div className="bg-white p-5 rounded-xl border border-[#E0E2E7] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#011F7B]">
                  Presisi (Base Rate Formulasi)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#011F7B]/10 text-[#011F7B] rounded">
                  p·s / [p·s + (1-p)(1-k)]
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#000F4A] font-mono">
                  <AnimatedNumber value={metrics.precisionBaseRate} decimals={1} suffix="%" />
                </span>
                <span className="text-xs text-[#454652]">
                  proporsi tepat sasaran dari seluruh yang ditahan
                </span>
              </div>
              <p className="text-xs text-[#454652] leading-relaxed pt-1 border-t border-[#ECEEF3]">
                Bila dapur yang benar-benar bermasalah jarang, sebagian besar tanda jatuh pada dapur yang sah. Karena itu Kuning tetap mencairkan bahan baku dan ambang dikalibrasi di pilot.
              </p>
              <p className="text-[10px] text-[#757683] italic">
                * Presisi dihasilkan oleh asumsi simulasi (proporsi bermasalah dan kesalahan jujur), bukan temuan.
              </p>
            </div>

            {/* Dana Tertahan Card */}
            <div className="bg-white p-5 rounded-xl border border-[#E0E2E7] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-[#D64545]">
                  Dana Tertahan Sementara (Minggu 4)
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#FCEBEB] text-[#B02A2A] rounded">
                  Formula Perlakuan
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#D64545] font-mono">
                  Rp {(metrics.withheldTotal / 1000000).toFixed(1).replace('.', ',')} M
                </span>
                <span className="text-xs text-[#757683] font-mono">
                  / Rp {(metrics.totalRequested / 1000000000).toFixed(2).replace('.', ',')} M total top-up
                </span>
              </div>
              <p className="text-xs text-[#454652] leading-relaxed pt-1 border-t border-[#ECEEF3]">
                <strong>Formula &amp; Periode:</strong> Nilai top-up diajukan minus nilai yang dicairkan sesuai perlakuan pada Minggu 4 (operasional Kuning/Merah serta bahan baku dapur belum beroperasi/saldo mencukupi).
              </p>
              <div className="text-[11px] text-[#011F7B] font-semibold">
                Bahan baku tetap diprioritaskan cair untuk menjamin hak porsi makan anak sekolah.
              </div>
            </div>
          </div>

          {/* THIRD ROW: BEBAN KERJA & VERIFIKASI OVERFLOW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Beban Lapangan Merah */}
            <div className="bg-white p-4 rounded-xl border border-[#E0E2E7] shadow-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#757683] block">
                Beban Lapangan (Merah Saja)
              </span>
              <div className="text-xl font-bold text-[#000F4A] font-mono">
                {metrics.fieldBurden} / {params.fieldCapacity} <span className="text-xs font-normal text-[#757683]">dapur</span>
              </div>
              <div className="w-full bg-[#ECEEF3] h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${metrics.isOverCapacity ? 'bg-[#D64545]' : 'bg-[#1E9E6A]'}`}
                  style={{ width: `${Math.min(100, metrics.burdenPercent)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold block pt-1 ${metrics.isOverCapacity ? 'text-[#D64545]' : 'text-[#1E9E6A]'}`}>
                {metrics.isOverCapacity ? 'Kelebihan Beban Lapangan' : 'Kapasitas Lapangan Aman'}
              </span>
            </div>

            {/* Beban Reviu Dokumen Kuning */}
            <div className="bg-white p-4 rounded-xl border border-[#E0E2E7] shadow-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#757683] block">
                Beban Reviu Dokumen (Kuning)
              </span>
              <div className="text-xl font-bold text-[#000F4A] font-mono">
                {metrics.docReviewBurden} / {params.docReviewCapacity} <span className="text-xs font-normal text-[#757683]">berkas</span>
              </div>
              <div className="w-full bg-[#ECEEF3] h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#011F7B] rounded-full"
                  style={{ width: `${Math.min(100, (metrics.docReviewBurden / params.docReviewCapacity) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#454652] block pt-1 font-semibold">
                Reviu berkas tertulis (3 hari kerja)
              </span>
            </div>

            {/* Merah Terlambat */}
            <div className="bg-white p-4 rounded-xl border border-[#FAC7C7] bg-[#FCEBEB]/30 shadow-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#B02A2A] block">
                Merah Terlambat Lapang
              </span>
              <div className="text-xl font-bold text-[#B02A2A] font-mono">
                {metrics.merahLateCount} <span className="text-xs font-normal text-[#454652]">dapur</span>
              </div>
              <p className="text-[10px] text-[#454652] pt-1">
                Melampaui kapasitas lapangan; dilaporkan ke Inspektorat Utama BGN (tanpa pelepasan otomatis).
              </p>
            </div>

            {/* Kuning Dilepas */}
            <div className="bg-white p-4 rounded-xl border border-[#F0DB85] bg-[#FFF4CC]/30 shadow-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[#8A5A00] block">
                Kuning Dilepas Otomatis
              </span>
              <div className="text-xl font-bold text-[#8A5A00] font-mono">
                {metrics.kuningReleasedCount} <span className="text-xs font-normal text-[#454652]">dapur</span>
              </div>
              <p className="text-[10px] text-[#454652] pt-1">
                Operasional dicairkan karena verifikator terlambat melewati batas SLA 3 hari kerja.
              </p>
            </div>
          </div>

          {/* Mandated Beban Note */}
          <div className="p-3 bg-[#F7F9FE] rounded-lg border border-[#011F7B]/20 text-xs text-[#011F7B] leading-relaxed">
            <strong>Catatan Beban Riil:</strong> Bila 2% sampai 10% dari 27.485 SPPG ditandai, verifikator menangani sekitar 550 sampai 2.750 dapur per minggu, dan hanya yang Merah perlu dikunjungi (skenario, bukan prediksi).
          </div>

          {/* INTERACTIVE TRADE-OFF CURVE */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECEEF3] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-[#011F7B]">ssid_chart</span>
                  <h3 className="text-base font-bold text-[#000F4A]">
                    Kurva Trade-off: Positif Palsu vs Negatif Palsu (Skala 0–100%)
                  </h3>
                </div>
                <p className="text-xs text-[#454652] mt-0.5">
                  Titik aktif pada kurva dihitung dari penjaluran ulang simulasi penuh 500 dapur dan identik dengan kartu di atas.
                </p>
              </div>

              {/* Threshold Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-[#454652]">Uji Ambang:</span>
                <div className="flex items-center bg-[#F1F4F9] p-0.5 rounded-lg border border-[#E0E2E7] text-xs font-bold">
                  {(['R3', 'R4', 'R5'] as const).map((code) => (
                    <button
                      key={code}
                      onClick={() => setSelectedChartThreshold(code)}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        selectedChartThreshold === code
                          ? 'bg-[#011F7B] text-white shadow-xs'
                          : 'text-[#454652] hover:text-[#000F4A]'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SVG Chart Canvas */}
            <div className="relative w-full overflow-hidden bg-[#FAFBFD] rounded-xl border border-[#E0E2E7] p-2">
              <svg viewBox="0 0 760 210" className="w-full h-56 select-none font-mono">
                {/* Horizontal Grid lines (0%, 25%, 50%, 75%, 100%) */}
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = getY(pct);
                  return (
                    <g key={pct}>
                      <line x1="60" y1={y} x2="720" y2={y} stroke="#E0E2E7" strokeDasharray="3 3" />
                      <text x="52" y={y + 4} textAnchor="end" fontSize="10" fill="#757683">
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Axis labels for X values */}
                {tradeOffData.map((d) => {
                  const x = getX(d.thresholdValue);
                  return (
                    <g key={d.thresholdValue}>
                      <line x1={x} y1="20" x2={x} y2="180" stroke="#ECEEF3" strokeWidth="1" />
                      <text x={x} y="196" textAnchor="middle" fontSize="10" fill="#757683">
                        {d.thresholdValue}%
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Label */}
                <text x="390" y="208" textAnchor="middle" fontSize="10" fill="#011F7B" fontWeight="bold">
                  Nilai Ambang {selectedChartThreshold} (%)
                </text>

                {/* FP Curve (Gold) */}
                <path d={fpPath} fill="none" stroke="#fcb803" strokeWidth="2.5" strokeLinecap="round" />
                {fpPoints.map((p, i) => (
                  <circle key={`fp-${i}`} cx={p.x} cy={p.y} r="3" fill="#fcb803" />
                ))}

                {/* FN Curve (Blue) */}
                <path d={fnPath} fill="none" stroke="#011F7B" strokeWidth="2.5" strokeLinecap="round" />
                {fnPoints.map((p, i) => (
                  <circle key={`fn-${i}`} cx={p.x} cy={p.y} r="3" fill="#011F7B" />
                ))}

                {/* Active Parameter Vertical Line */}
                <line
                  x1={activeMarkerX}
                  y1="20"
                  x2={activeMarkerX}
                  y2="180"
                  stroke="#D64545"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />

                {/* Active Points Highlights */}
                <circle cx={activeMarkerX} cy={activeFpY} r="6" fill="#fcb803" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx={activeMarkerX} cy={activeFnY} r="6" fill="#011F7B" stroke="#FFFFFF" strokeWidth="2" />

                {/* Active Point Callout Labels */}
                <text x={activeMarkerX + 8} y={activeFpY - 6} fontSize="10" fill="#8A5A00" fontWeight="bold">
                  FP: {metrics.falsePositiveRate.toFixed(1)}%
                </text>
                <text x={activeMarkerX + 8} y={activeFnY + 12} fontSize="10" fill="#011F7B" fontWeight="bold">
                  FN: {metrics.falseNegativeRate.toFixed(1)}%
                </text>
              </svg>
            </div>

            {/* Chart Legend & Caption */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3 pt-1">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#fcb803]"></span>
                  <span className="font-semibold text-[#8A5A00]">
                    Positif Palsu (Dapur sah tertahan)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#011F7B]"></span>
                  <span className="font-semibold text-[#011F7B]">
                    Negatif Palsu (Dapur bermasalah lolos)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#D64545] rounded-full"></span>
                  <span className="font-mono text-[#D64545] font-semibold">
                    Ambang Aktif ({activeThreshVal}%)
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-[#757683] italic">
                * Ambang lebih longgar menurunkan positif palsu namun menaikkan risiko kebocoran negatif palsu.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
