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

  const precisionPct = Number(metrics.precisionBaseRate.toFixed(1));
  const fpPct = Number(metrics.falsePositiveRate.toFixed(1));
  const fnPct = Number(metrics.falseNegativeRate.toFixed(1));

  const modifiedLogs = decisionLogs && decisionLogs.length > 0 ? decisionLogs.filter((d) => d.hasilDiubah).length : 3;
  const totalLogs = decisionLogs && decisionLogs.length > 0 ? decisionLogs.length : 40;
  const cancellationRate = Number(((modifiedLogs / totalLogs) * 100).toFixed(1));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyParameters = () => {
    const textData = `SARING-MBG: Parameter Indikator Pilot (Data Sintetis)
1. Proporsi top-up dibaca sebelum SPP: 100%
2. Presisi (dana ditahan yang terbukti bermasalah): ${precisionPct}%
3. Tingkat positif palsu: ${fpPct}%
4. Perkiraan negatif palsu: ${fnPct}%
5. Rasio pembatalan oleh verifikator: ${cancellationRate}% (n = ${totalLogs})
6. Median hari verifikasi: ${metrics.medianDaysKuning} / ${metrics.medianDaysMerah} hari kerja (asumsi simulasi; Kuning SLA 3 hari, Merah SLA 4 hari)
7. Hari layanan makan terganggu per dapur: ${metrics.disruptedDaysPerKitchen} hari

Rancangan Pilot:
Satu wilayah uji coba dengan pembanding wilayah berikutnya yang belum menerapkan gerbang; red flag tahap 1 (R1, R2, R3) diuji terlebih dahulu.

Batas Simulasi:
Data sintetis, bukan data BGN. Ambang, batas hari, dan proporsi dapur ditandai adalah usulan yang diuji di pilot. Efektivitas belum teruji.

Prasyarat:
Sinkronisasi SK penetapan penerima ke SIPGN, rekening Virtual Account bank Himbara terhubung, kapasitas tim verifikator BGN.`;

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
INDIKATOR METRIK PILOT (Target Ditetapkan Sebelum Pilot):
--------------------------------------------------
1. Proporsi top-up dibaca sebelum SPP : 100%
2. Presisi (dana ditahan bermasalah) : ${precisionPct}%
3. Tingkat positif palsu             : ${fpPct}%
4. Perkiraan negatif palsu           : ${fnPct}%
5. Rasio pembatalan verifikator      : ${cancellationRate}% (n = ${totalLogs})
6. Median hari verifikasi (Kuning/Merah): ${metrics.medianDaysKuning} / ${metrics.medianDaysMerah} hari kerja (asumsi simulasi)
7. Hari layanan makan terganggu      : ${metrics.disruptedDaysPerKitchen} hari per dapur

--------------------------------------------------
BATASAN DAN PROTOKOL SIMULASI:
--------------------------------------------------
- Satu wilayah uji coba dengan pembanding wilayah berikutnya yang belum menerapkan gerbang; red flag tahap 1 (R1, R2, R3) diuji terlebih dahulu.
- Data sintetis, bukan data BGN. Ambang, batas hari, dan proporsi dapur ditandai adalah usulan yang diuji di pilot. Efektivitas belum teruji.
- Prasyarat: Sinkronisasi SK penetapan penerima ke SIPGN, rekening Virtual Account bank Himbara terhubung, kapasitas tim verifikator BGN.
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

      {/* 7 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] uppercase text-[#757683] tracking-wider font-semibold">
                  Presisi (dana ditahan bermasalah)
                </h3>
                <span className="text-[8px] font-mono text-[#011F7B] bg-[#011F7B]/10 px-1.5 py-0.5 rounded font-bold">
                  p·s / [p·s+(1-p)(1-k)]
                </span>
              </div>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={precisionPct} decimals={1} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Bila dapur yang benar-benar bermasalah jarang, sebagian besar tanda jatuh pada dapur yang sah. Dihasilkan oleh asumsi simulasi, bukan temuan.
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
                <AnimatedNumber value={fpPct} decimals={1} suffix="%" />
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
                <AnimatedNumber value={fnPct} decimals={1} suffix="%" />
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
                Rasio pembatalan oleh verifikator (n = {totalLogs})
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                <AnimatedNumber value={cancellationRate} decimals={1} suffix="%" />
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Penyesuaian sinyal mesin otomatis oleh verifikator pasca bukti fisik diklarifikasi ({modifiedLogs} dari {totalLogs} kasus).
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
                {metrics.medianDaysKuning} / {metrics.medianDaysMerah} <span className="text-xs font-normal text-[#757683]">hari kerja</span>
              </div>
              <div className="text-[10px] text-[#757683] italic mt-0.5">
                asumsi simulasi (Kuning SLA 3 hari, Merah SLA 4 hari)
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Waktu siklus resolusi klarifikasi dokumen (Kuning) dan verifikasi lapangan (Merah).
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
                Hari layanan makan terganggu per dapur
              </h3>
              <div className="text-2xl font-bold text-[#000F4A] mt-1 tabular-nums font-mono">
                {metrics.disruptedDaysPerKitchen} <span className="text-xs font-normal text-[#757683]">hari</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-[#454652] mt-4 leading-relaxed pt-2.5 border-t border-[#ECEEF3]">
            Dampak penahanan likuiditas operasional terhadap kontinuitas pasokan porsi siswa.
          </p>
        </div>
      </div>

      {/* 3 Dedicated Core Cards for Pilot Implementation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card A: Rancangan Pilot */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0E2E7] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EBF0FF] flex items-center justify-center text-[#011F7B]">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <h3 className="text-base font-bold text-[#000F4A]">Rancangan Pilot</h3>
            </div>
            <p className="text-xs text-[#181C20] leading-relaxed font-semibold">
              Satu wilayah uji coba dengan pembanding wilayah berikutnya yang belum menerapkan gerbang; red flag tahap 1 (R1, R2, R3) diuji terlebih dahulu.
            </p>
            <p className="text-xs text-[#525363] leading-relaxed">
              Metodologi kuasi-eksperimental untuk mengukur efektivitas gerbang pencegahan dibanding penyisiran audit post-facto biasa.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#F1F4F9] text-[11px] font-mono text-[#011F7B] font-bold">
            Fokus: Tahap 1 (R1, R2, R3)
          </div>
        </div>

        {/* Card B: Batas Simulasi */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0E2E7] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FFF4CC] flex items-center justify-center text-[#8A5A00]">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </div>
              <h3 className="text-base font-bold text-[#000F4A]">Batas Simulasi</h3>
            </div>
            <p className="text-xs text-[#181C20] leading-relaxed font-semibold">
              Data sintetis, bukan data BGN. Ambang, batas hari, dan proporsi dapur ditandai adalah usulan yang diuji di pilot. Efektivitas belum teruji.
            </p>
            <p className="text-xs text-[#525363] leading-relaxed">
              Seluruh nominal rupiah dan sebaran kasus adalah model komputasi matematis ilustratif untuk kalibrasi operasional.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FFF4CC] text-[11px] font-mono text-[#8A5A00] font-bold">
            Klausul: Simulasi Ilustratif
          </div>
        </div>

        {/* Card C: Prasyarat */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-[#E0E2E7] flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E8F6F0] flex items-center justify-center text-[#1E9E6A]">
                <span className="material-symbols-outlined text-[20px]">checklist</span>
              </div>
              <h3 className="text-base font-bold text-[#000F4A]">Prasyarat Implementasi</h3>
            </div>
            <p className="text-xs text-[#181C20] leading-relaxed font-semibold">
              Sinkronisasi SK penetapan penerima ke SIPGN, rekening Virtual Account bank Himbara terhubung, kapasitas tim verifikator BGN.
            </p>
            <p className="text-xs text-[#525363] leading-relaxed">
              Ketiga pilar data dan sumber daya manusia ini merupakan fondasi mutlak agar gerbang pencegahan dapat berjalan tanpa mengganggu distribusi makan anak.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#E8F6F0] text-[11px] font-mono text-[#1E9E6A] font-bold">
            Status: Kesiapan Sistem &amp; SDM
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
