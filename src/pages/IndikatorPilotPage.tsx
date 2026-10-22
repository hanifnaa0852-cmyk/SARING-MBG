/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Kitchen, SimulationParameters, DecisionLogEntry } from '../types';
import { computeSimulationMetrics } from '../utils/syntheticData';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface IndikatorPilotPageProps {
  kitchens: Kitchen[];
  params: SimulationParameters;
  decisionLogs?: DecisionLogEntry[];
}

export const IndikatorPilotPage: React.FC<IndikatorPilotPageProps> = ({ kitchens, params, decisionLogs }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const metrics = computeSimulationMetrics(kitchens, params);

  const precisionPct = Math.round(100 - metrics.falsePositiveRate);
  const fpPct = Math.round(metrics.falsePositiveRate);
  const fnPct = metrics.falseNegativeRate.toFixed(1).replace('.', ',');

  const cancellationRate =
    decisionLogs && decisionLogs.length > 0
      ? Math.round((decisionLogs.filter((d) => d.hasilDiubah).length / decisionLogs.length) * 100)
      : 6;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyParameters = () => {
    const textData = `SARING-MBG: Parameter Indikator Pilot (Data Sintetis)
1. Proporsi top-up dibaca sebelum SPP: 100%
2. Presisi (dana ditahan bermasalah): ${precisionPct}%
3. Tingkat positif palsu: ${fpPct}%
4. Perkiraan negatif palsu: ${fnPct}%
5. Rasio pembatalan oleh verifikator: ${cancellationRate}%
6. Median hari verifikasi: 2,1 / 3,8 hari kerja
7. Hari layanan makan terganggu per dapur: 0,4 hari
8. Sisa dana akhir tahun: Diukur dari IHPS, tidak disimulasikan

Batas Simulasi:
- Data sintetis, bukan data BGN
- Ambang, batas hari, dan proporsi dapur ditandai adalah usulan yang diuji di pilot
- Efektivitas belum teruji di Indonesia
- Rancangan pilot: satu wilayah, pembanding wilayah berikutnya, red flag tahap 1 (R1, R2, R4a, R5)`;

    navigator.clipboard.writeText(textData).then(() => {
      setCopyFeedback(true);
      showToast('Parameter indikator pilot berhasil disalin ke clipboard.');
      setTimeout(() => setCopyFeedback(false), 2500);
    });
  };

  const downloadReport = () => {
    const content = `LAPORAN RINGKASAN SIMULASI PILOT SARING-MBG
Dicetak: ${new Date().toLocaleString('id-ID')}
Status: Data Sintetis Uji Coba (Bukan Data BGN)

--------------------------------------------------
INDIKATOR METRIK PILOT (Ditetapkan Sebelum Pilot):
--------------------------------------------------
1. Proporsi top-up dibaca sebelum SPP : 100%
2. Presisi (dana ditahan bermasalah) : ${precisionPct}%
3. Tingkat positif palsu             : ${fpPct}%
4. Perkiraan negatif palsu           : ${fnPct}%
5. Rasio pembatalan verifikator      : 6%
6. Median hari verifikasi (Kuning/Merah): 2,1 / 3,8 hari kerja
7. Hari layanan makan terganggu      : 0,4 hari/dapur
8. Sisa dana akhir tahun             : Berdasarkan audit IHPS BPK

--------------------------------------------------
BATASAN DAN PROTOKOL SIMULASI:
--------------------------------------------------
- Model menggunakan data sintetis murni untuk keperluan demonstrasi arsitektur.
- Parameter numerik disiapkan untuk kalibrasi dinamis selama masa uji coba.
- Evaluasi berkala dilaksanakan bersama BPKP dan Satgas MBG.
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ringkasan_Indikator_Pilot_MBG_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Laporan ringkasan simulasi pilot berhasil diunduh.');
  };

  return (
    <div className="px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Context & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-xs border border-[#E0E2E7]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#454652] text-xs">
            <span className="uppercase tracking-wider font-semibold">Pilar Audit MBG</span>
            <span className="material-symbols-outlined text-[14px] text-[#C5C5D4]">chevron_right</span>
            <span className="uppercase tracking-wider text-[#011F7B] font-bold">Indikator Pilot</span>
          </div>
          <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">
            Indikator Uji Coba dan Batas Simulasi
          </h1>
          <p className="text-sm text-[#454652] max-w-3xl">
            Metrik kinerja sistem triase pencegahan deviasi anggaran program Makan Bergizi Gratis (MBG) berbasis model simulasi awal.
          </p>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={copyParameters}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#000F4A] border border-[#E0E2E7] hover:bg-[#F1F4F9] transition-colors rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copyFeedback ? 'done' : 'content_copy'}
            </span>
            <span>{copyFeedback ? 'Tersalin ke Clipboard!' : 'Salin Parameter Metrik'}</span>
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#fcb803] hover:bg-[#eaa700] text-[#000F4A] transition-colors rounded-lg text-xs font-bold shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Ringkasan Simulasi</span>
          </button>
        </div>
      </div>

      {/* Live Simulation Calibration Status Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F1F4F9] p-3 rounded-xl border border-[#E0E2E7]">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#fcb803] animate-pulse"></div>
          <div>
            <div className="text-[10px] text-[#757683] uppercase font-bold">Status Lingkungan</div>
            <div className="text-xs text-[#000F4A] font-bold">Simulasi Uji Sintetis v2.4</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <span className="material-symbols-outlined text-[#011F7B] text-[20px]">layers</span>
          <div>
            <div className="text-[10px] text-[#757683] uppercase font-bold">Cakupan Data Uji</div>
            <div className="text-xs text-[#181C20] font-semibold">500 Dapur Sintetis (Minggu 1-4)</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <span className="material-symbols-outlined text-[#011F7B] text-[20px]">verified_user</span>
          <div>
            <div className="text-[10px] text-[#757683] uppercase font-bold">Protokol Penilaian</div>
            <div className="text-xs text-[#181C20] font-semibold">Audit Forensik Pra-Top-Up</div>
          </div>
        </div>
      </div>

      {/* 8 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">find_in_page</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Proporsi top-up dibaca sebelum SPP
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                100%
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Cakupan otomatisasi mesin aturan terhadap seluruh pengajuan SPPG mingguan.
          </p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Presisi (dana ditahan bermasalah)
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={precisionPct} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Akurasi penahanan porsi operasional terhadap temuan salah saji atau deviasi riil.
          </p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#8A5A00]">
                <span className="material-symbols-outlined text-[20px]">notification_important</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Tingkat positif palsu
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={fpPct} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Dapur tertahan sementara akibat salah ketik administratif tanpa kesengajaan fraud.
          </p>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">shield_with_heart</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Perkiraan negatif palsu
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={metrics.falseNegativeRate} decimals={1} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Estimasi SPPG bermasalah yang terlewat dan lolos verifikasi top-up hijau.
          </p>
        </div>

        {/* Card 5 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Rasio pembatalan oleh verifikator
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={cancellationRate} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Penyesuaian sinyal mesin otomatis oleh verifikator pasca bukti fisik diklarifikasi.
          </p>
        </div>

        {/* Card 6 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Median hari verifikasi (kuning / merah)
              </h3>
              <div className="text-xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                2,1 / 3,8 <span className="text-xs font-normal text-[#757683]">hari kerja</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Waktu siklus resolusi klarifikasi berkas (Kuning SLA 3 hari, Merah SLA 5 hari).
          </p>
        </div>

        {/* Card 7 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Layanan terganggu per dapur
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                0,4 <span className="text-xs font-normal text-[#757683]">hari</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Dampak penahanan likuiditas operasional terhadap kontinuitas pasokan porsi siswa.
          </p>
        </div>

        {/* Card 8 */}
        <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-xs border border-[#E0E2E7] hover:shadow-sm transition-shadow">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-[#F1F4F9] flex items-center justify-center shrink-0 text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 bg-[#ECEEF3] text-[#454652] rounded font-semibold uppercase tracking-wider text-right">
                Target ditetapkan sebelum pilot
              </span>
            </div>
            <div>
              <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                Sisa dana akhir tahun
              </h3>
              <div className="text-sm font-bold text-[#000F4A] mt-1">
                Diukur dari IHPS, tidak disimulasikan
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Berdasarkan Ikhtisar Hasil Pemeriksaan Semester BPK RI pasca tahun anggaran selesai.
          </p>
        </div>
      </div>

      {/* Visual Benchmarking Bar & Simulation Boundaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Precision vs False Positive Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-xs border border-[#E0E2E7] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase font-bold text-[#757683] tracking-wider">
                Keseimbangan Forensik Triase
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ECEEF3] text-[#000F4A]">
                RASIO {precisionPct}:{fpPct}
              </span>
            </div>
            <h4 className="text-base font-bold text-[#000F4A]">Distribusi Hasil Penahanan Dana</h4>
            <p className="text-xs text-[#454652] mt-1">
              Perbandingan antara penghentian dana berdampak riil versus penundaan akibat galat administrasi non-fraud.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-[#011F7B] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#011F7B] inline-block"></span>
                    Presisi Anomali Riil (Deviasi/Salah Saji)
                  </span>
                  <span className="text-[#011F7B] font-bold font-mono">{precisionPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#ECEEF3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#011F7B] rounded-full" style={{ width: `${precisionPct}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-[#8A5A00] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fcb803] inline-block"></span>
                    Positif Palsu (Klarifikasi Dokumen Bersih)
                  </span>
                  <span className="text-[#8A5A00] font-bold font-mono">{fpPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#ECEEF3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#fcb803] rounded-full" style={{ width: `${fpPct}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold">
                  <span className="text-[#757683] flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C5C5D4] inline-block"></span>
                    Toleransi Negatif Palsu (Lolos Audit Acak)
                  </span>
                  <span className="text-[#757683] font-bold font-mono">{fnPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-[#ECEEF3] rounded-full overflow-hidden">
                  <div className="h-full bg-[#757683] rounded-full" style={{ width: `${Math.min(100, metrics.falseNegativeRate * 10)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 bg-[#F1F4F9] rounded-lg border border-[#E0E2E7] flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-[#011F7B] text-[18px]">tune</span>
            <span className="text-[#181C20]">
              Target evaluasi pilot: Menekan tingkat positif palsu di bawah <strong>45%</strong> tanpa menaikkan negatif palsu di atas <strong>1,5%</strong>.
            </span>
          </div>
        </div>

        {/* Batas Simulasi Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#F1F4F9] p-6 rounded-xl border border-[#E0E2E7] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-[#011F7B] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[16px]">info</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#000F4A]">Batas Simulasi</h4>
                <span className="text-[10px] uppercase tracking-wider text-[#757683] font-semibold">
                  Klausul Batasan Model Operasional
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {/* Item 1 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#E0E2E7] shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#F1F4F9] flex items-center justify-center shrink-0 mt-0.5 text-[#011F7B]">
                  <span className="material-symbols-outlined text-[16px]">database</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-[#000F4A] font-bold">
                    Data sintetis, bukan data BGN
                  </div>
                  <div className="text-xs text-[#454652] leading-relaxed">
                    Semua kalkulasi, nominal rupiah, dan proporsi unit berasal dari dataset pengujian awal untuk memvalidasi arsitektur perangkat lunak.
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#E0E2E7] shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#F1F4F9] flex items-center justify-center shrink-0 mt-0.5 text-[#011F7B]">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-[#000F4A] font-bold">
                    Ambang, batas hari, dan proporsi dapur ditandai adalah usulan yang diuji di pilot
                  </div>
                  <div className="text-xs text-[#454652] leading-relaxed">
                    Nilai parameter numerik disiapkan untuk kalibrasi dinamis selama masa implementasi lapangan terpadu.
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#E0E2E7] shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#F1F4F9] flex items-center justify-center shrink-0 mt-0.5 text-[#011F7B]">
                  <span className="material-symbols-outlined text-[16px]">science</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-[#000F4A] font-bold">
                    Efektivitas belum teruji di Indonesia
                  </div>
                  <div className="text-xs text-[#454652] leading-relaxed">
                    Skema penahanan preventif pra-pencairan berjenjang merupakan pendekatan baru yang membutuhkan verifikasi empiris di tingkat satuan kerja.
                  </div>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-lg border border-[#E0E2E7] shadow-xs">
                <div className="w-6 h-6 rounded-full bg-[#F1F4F9] flex items-center justify-center shrink-0 mt-0.5 text-[#011F7B]">
                  <span className="material-symbols-outlined text-[16px]">hub</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs text-[#000F4A] font-bold">
                    Rancangan pilot: satu wilayah, pembanding wilayah gelombang berikutnya
                  </div>
                  <div className="text-xs text-[#454652] leading-relaxed">
                    Hanya red flag tahap 1 (R1, R2, R4a, R5). Metodologi evaluasi quasi-experimental berfokus pada aturan inti untuk meminimalkan friksi operasional logistik gizi.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E0E2E7] flex items-center justify-between text-xs text-[#757683]">
            <span>Protokol Eksperimen: Permen MBG No. 04/2025</span>
            <span className="font-semibold text-[#000F4A]">Tahap: Uji Laboratorium Terbatas</span>
          </div>
        </div>
      </div>

      {/* Bottom Governance Institutional Mandate Banner */}
      <div className="bg-[#000F4A] text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-[#fcb803]">
              <span className="material-symbols-outlined text-[24px]">policy</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#fcb803]">
                  KOMITMEN PENGAWASAN MBG
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                <span className="text-xs text-white/80">INSPEKTORAT &amp; BPKP</span>
              </div>
              <p className="text-xs text-white font-medium max-w-4xl leading-relaxed">
                "Evaluasi berkala indikator ini dilakukan bersama BPKP dan Tim Tata Kelola BGN untuk memastikan akuntabilitas fiskal tanpa mengorbankan hak gizi 1 porsi pun bagi anak sekolah."
              </p>
            </div>
          </div>

          <div className="shrink-0 self-end md:self-center">
            <div className="px-3 py-1 rounded bg-white/10 text-white text-[11px] font-semibold uppercase tracking-wider">
              SLA Verifikasi: Aktif
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
