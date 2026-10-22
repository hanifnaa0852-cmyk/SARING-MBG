/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Kitchen, DecisionLogEntry } from '../types';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface DetailKasusPageProps {
  kitchen: Kitchen;
  onBack: () => void;
  onAddDecisionLog: (entry: DecisionLogEntry) => void;
}

export const DetailKasusPage: React.FC<DetailKasusPageProps> = ({
  kitchen,
  onBack,
  onAddDecisionLog
}) => {
  const [verificationStep, setVerificationStep] = useState<number>(2); // 1 = Mesin, 2 = Penugasan, 3 = Lapangan, 4 = Final
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationReason, setClarificationReason] = useState('');
  const [isClarificationSuccess, setIsClarificationSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAssignVerifier = () => {
    setVerificationStep(3);
    const newEntry: DecisionLogEntry = {
      id: `log-${Date.now()}`,
      time: 'Hari Ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      sppgId: kitchen.id,
      kitchenName: kitchen.name,
      region: kitchen.region,
      label: kitchen.triase,
      tingkat: kitchen.triase === 'Merah' ? 'Tingkat 3' : 'Tingkat 2',
      keputusan: 'Verifikasi Lapangan Ditugaskan',
      verifikator: 'Auditor Tim 3 MBG',
      alasan: `Penugasan audit lapangan terpadu menindaklanjuti indikator ${kitchen.activeFlags.join(', ')}`,
      hasilDiubah: false
    };
    onAddDecisionLog(newEntry);
    showToast(`Tim verifikator lapangan berhasil ditugaskan untuk ${kitchen.id}.`);
  };

  const handleSubmitClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationReason.trim()) return;

    setVerificationStep(4);
    const newEntry: DecisionLogEntry = {
      id: `log-${Date.now()}`,
      time: 'Hari Ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      sppgId: kitchen.id,
      kitchenName: kitchen.name,
      region: kitchen.region,
      label: kitchen.triase,
      tingkat: 'Tingkat 2',
      keputusan: 'Koreksi Administratif & Klarifikasi Disetujui',
      verifikator: 'Auditor Tim 3 MBG',
      alasan: clarificationReason,
      hasilDiubah: true
    };
    onAddDecisionLog(newEntry);
    setIsClarificationSuccess(true);
    setTimeout(() => {
      setShowClarificationModal(false);
      setIsClarificationSuccess(false);
      setClarificationReason('');
      showToast('Klarifikasi tertulis berhasil dicatat dalam Register Keputusan Triase.');
    }, 1500);
  };

  // Find max value in daily chart for height scaling
  const maxDaySpend = Math.max(...kitchen.dailyFinancials.map(d => Math.max(d.reportedSpend, d.vaOutflow))) || 10000000;

  return (
    <div className="px-8 py-6 space-y-6 max-w-[1600px] w-full mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb & Top Bar Utilities */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#454652] text-xs">
          <button onClick={onBack} className="hover:text-[#000F4A] transition-colors cursor-pointer">
            Pilar Audit MBG
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#C5C5D4]">chevron_right</span>
          <button onClick={onBack} className="hover:text-[#000F4A] transition-colors cursor-pointer">
            Antrean Mingguan
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#C5C5D4]">chevron_right</span>
          <span className="font-semibold text-[#000F4A]">{kitchen.id}</span>
        </nav>

        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-white text-[#000F4A] border border-[#E0E2E7] rounded-lg shadow-xs hover:bg-[#F1F4F9] transition-colors text-xs font-semibold self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Kembali ke Antrean</span>
        </button>
      </div>

      {/* Header Banner Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E0E2E7] flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">
                {kitchen.id} – {kitchen.region}
              </h1>

              {kitchen.triase === 'Merah' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FCEBEB] text-[#B02A2A] text-xs uppercase tracking-wider font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">cancel</span>
                  <span>MERAH - TAHAN OPERASIONAL &amp; VERIFIKASI LAPANGAN</span>
                </div>
              )}
              {kitchen.triase === 'Kuning' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFF4CC] text-[#8A5A00] text-xs uppercase tracking-wider font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#8A5A00]">warning</span>
                  <span>KUNING - KLARIFIKASI DOKUMEN</span>
                </div>
              )}
              {kitchen.triase === 'Hijau' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F6F0] text-[#1E9E6A] text-xs uppercase tracking-wider font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#1E9E6A]">check_circle</span>
                  <span>HIJAU - SIAP SALUR PENUH</span>
                </div>
              )}
            </div>

            <p className="text-[#454652] text-sm">
              Top-up diajukan <span className="font-bold text-[#000F4A] font-mono"><AnimatedNumber value={kitchen.topUpRequested} prefix="Rp " /></span>, Minggu 4 (Siklus T+7)
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-[#F1F4F9] px-4 py-2.5 rounded-lg border border-[#E0E2E7]">
            <span className="material-symbols-outlined text-[#fcb803] text-[22px]">timer</span>
            <div>
              <p className="text-[10px] text-[#454652] uppercase font-semibold">Sisa Waktu Tindakan</p>
              <p className="text-sm font-bold text-[#181C20]">
                {kitchen.verificationDeadline} <span className="font-normal text-[#454652]">(Selasa, 16:00 WIB)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Metadata Tags */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[#454652] text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECEEF3]">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B]">soup_kitchen</span>
            <span>Kategori Dapur: <strong className="text-[#181C20] font-semibold">{kitchen.name}</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECEEF3]">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B]">groups</span>
            <span>Kapasitas: <strong className="text-[#181C20] font-semibold font-mono">{kitchen.capacityLabel}</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECEEF3]">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B]">account_balance_wallet</span>
            <span>ID Virtual Account: <strong className="text-[#181C20] font-semibold font-mono">VA-BGN-3302-{kitchen.id.replace('SPPG Contoh ', '')}</strong></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ECEEF3]">
            <span className="material-symbols-outlined text-[16px] text-[#1E9E6A]">verified</span>
            <span>Status Dapur Fisik: <strong className="text-[#1E9E6A] font-semibold">Terdaftar {kitchen.status === 'beroperasi' ? 'Aktif' : kitchen.status}</strong></span>
          </div>
        </div>
      </div>

      {/* Two-Column Forensic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Primary Evidentiary Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* CARD 1: Red Flag Aktif */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] overflow-hidden">
            <div className="p-4 flex items-center justify-between bg-[#F1F4F9] border-b border-[#E0E2E7]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#D64545] text-[22px]">warning</span>
                <h2 className="text-base font-bold text-[#000F4A]">
                  Red Flag Aktif ({kitchen.activeFlags.length} Temuan Sistem)
                </h2>
              </div>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                kitchen.triase === 'Merah' ? 'bg-[#FCEBEB] text-[#B02A2A]' : 'bg-[#FFF4CC] text-[#8A5A00]'
              }`}>
                {kitchen.triase === 'Merah' ? 'Prioritas Tinggi' : 'Klarifikasi Diperlukan'}
              </span>
            </div>

            {/* Auditor Banner Note */}
            <div className="px-5 py-2.5 bg-[#F7F9FE] border-b border-[#ECEEF3] flex items-start gap-2 text-xs">
              <span className="material-symbols-outlined text-[#011F7B] text-[18px] shrink-0 mt-0.5">info</span>
              <p className="text-[#454652] leading-snug">
                <strong className="text-[#181C20] font-semibold">Perhatian Auditor:</strong> Indikator risiko awal hasil otomatisasi mesin aturan, bukan bukti bersalah / vonis hukum. Keputusan mutlak bergantung verifikasi faktual lapangan.
              </p>
            </div>

            {/* Flags List */}
            <div className="p-5 space-y-4">
              {kitchen.activeFlags.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#E8F6F0] text-[#1E9E6A] text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Semua parameter kepatuhan terpenuhi. Dapur siap untuk penyaluran top-up penuh.</span>
                </div>
              ) : (
                kitchen.activeFlags.map((flag) => {
                  if (flag === 'R4a') {
                    const deviasi = (((kitchen.reportedCostPerPortion - kitchen.paguPerPorsi) / kitchen.paguPerPorsi) * 100).toFixed(1);
                    return (
                      <div key={flag} className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#D64545] text-white text-[11px] font-bold tracking-wider">
                              R4a
                            </span>
                            <h3 className="text-sm font-semibold text-[#181C20]">
                              Biaya bahan per porsi melebihi pagu
                            </h3>
                          </div>
                          <span className="text-[10px] text-[#454652] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E0E2E7]">
                            Indikator risiko, bukan bukti
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E0E2E7] text-xs">
                          <p className="text-[#181C20]">
                            Dilaporkan <span className="font-bold text-[#D64545] font-mono">Rp {kitchen.reportedCostPerPortion.toLocaleString('id-ID')}</span> per porsi vs Pagu Maksimum <span className="font-bold text-[#181C20] font-mono">Rp {kitchen.paguPerPorsi.toLocaleString('id-ID')}</span> per porsi
                            <span className="inline-block ml-1 px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A] font-bold text-[11px] font-mono">
                              (+{deviasi}% deviasi)
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-[#454652] leading-relaxed">
                          <strong className="text-[#181C20] font-medium">Konteks:</strong> Menu terlapor berupa ayam filet dan telur organik di {kitchen.region} melebihi standar harga satuan regional yang ditetapkan juknis BGN.
                        </p>
                      </div>
                    );
                  }

                  if (flag === 'R5') {
                    const diffRp = Math.abs(kitchen.reportedSpendTotal - kitchen.vaOutflowTotal);
                    const diffPct = ((diffRp / kitchen.reportedSpendTotal) * 100).toFixed(1);
                    return (
                      <div key={flag} className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#D64545] text-white text-[11px] font-bold tracking-wider">
                              R5
                            </span>
                            <h3 className="text-sm font-semibold text-[#181C20]">
                              Rekonsiliasi tidak sejalan
                            </h3>
                          </div>
                          <span className="text-[10px] text-[#454652] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E0E2E7]">
                            Indikator risiko, bukan bukti
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E0E2E7] text-xs">
                          <p className="text-[#181C20]">
                            Dilaporkan terpakai <span className="font-bold text-[#000F4A] font-mono">Rp {kitchen.reportedSpendTotal.toLocaleString('id-ID')}</span> vs Arus keluar Virtual Account (VA) <span className="font-bold text-[#000F4A] font-mono">Rp {kitchen.vaOutflowTotal.toLocaleString('id-ID')}</span>
                            <span className="inline-block ml-1 px-1.5 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A] font-bold text-[11px] font-mono">
                              (Selisih: Rp {diffRp.toLocaleString('id-ID')} atau {diffPct}%)
                            </span>
                          </p>
                        </div>
                        <p className="text-xs text-[#454652] leading-relaxed">
                          <strong className="text-[#181C20] font-medium">Konteks:</strong> Arus pengeluaran kas tunai/nota warung lokal belum terbukukan di mutasi perbankan VA BGN. Terdapat indikasi pergeseran ke luar channel resmi virtual account.
                        </p>
                      </div>
                    );
                  }

                  if (flag === 'R1') {
                    return (
                      <div key={flag} className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#D64545] text-white text-[11px] font-bold tracking-wider">
                              R1
                            </span>
                            <h3 className="text-sm font-semibold text-[#181C20]">
                              Duplikasi Virtual Account Aktif
                            </h3>
                          </div>
                          <span className="text-[10px] text-[#454652] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E0E2E7]">
                            Indikator risiko, bukan bukti
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E0E2E7] text-xs">
                          <p className="text-[#181C20]">
                            Terdeteksi <span className="font-bold text-[#D64545]">{kitchen.activeVaCount} Virtual Account aktif</span> pada alamat/pengelola yang sama.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (flag === 'R2') {
                    return (
                      <div key={flag} className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#D64545] text-white text-[11px] font-bold tracking-wider">
                              R2
                            </span>
                            <h3 className="text-sm font-semibold text-[#181C20]">
                              Status Dapur Tidak Beroperasi / Izin Belum Lengkap
                            </h3>
                          </div>
                          <span className="text-[10px] text-[#454652] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#E0E2E7]">
                            Indikator risiko, bukan bukti
                          </span>
                        </div>
                        <div className="p-3 bg-white rounded-lg border border-[#E0E2E7] text-xs">
                          <p className="text-[#181C20]">
                            Dapur tercatat berstatus <span className="font-bold text-[#D64545] uppercase">{kitchen.status}</span> di pangkalan data SIPGN.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })
              )}
            </div>
          </div>

          {/* CARD 2: Daily Report vs VA Outflow */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#000F4A]">
                  Laporan Harian vs Mutasi VA (Senin - Sabtu)
                </h2>
                <p className="text-xs text-[#454652] mt-0.5">
                  Komparasi arus dana operasional yang dilaporkan SPPG harian terhadap arus keluar mutasi rekening Virtual Account resmi BGN.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#011F7B]"></span>
                  <span className="text-[#454652]">Lapor SPPG</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-[#fcb803]"></span>
                  <span className="text-[#454652]">Mutasi VA BGN</span>
                </div>
              </div>
            </div>

            {/* Grouped Bar Visualization */}
            <div className="bg-[#F1F4F9] p-5 rounded-xl border border-[#E0E2E7]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 items-end pt-4 pb-1">
                {kitchen.dailyFinancials.map((d) => {
                  const repMillions = (d.reportedSpend / 1000000).toFixed(1).replace('.', ',');
                  const vaMillions = (d.vaOutflow / 1000000).toFixed(1).replace('.', ',');
                  const repHeight = Math.min(100, Math.round((d.reportedSpend / maxDaySpend) * 85) + 10);
                  const vaHeight = Math.min(100, Math.round((d.vaOutflow / maxDaySpend) * 85) + 10);

                  return (
                    <div key={d.dayName} className="flex flex-col items-center gap-2">
                      <div className={`text-[10px] font-bold font-mono ${d.isAnomaly ? 'text-[#D64545]' : 'text-[#454652]'}`}>
                        Rp {repMillions} / {vaMillions}
                      </div>

                      <div className="flex items-end gap-1.5 h-36 w-full justify-center relative">
                        {/* Daily Anomaly Beam Ping */}
                        {d.isAnomaly && (
                          <div className="absolute inset-0 bg-[#D64545]/10 rounded-lg animate-pulse pointer-events-none"></div>
                        )}

                        <div
                          className={`w-4 bg-[#011F7B] rounded-t-xs transition-all duration-700 ease-out relative group ${
                            d.isAnomaly ? 'ring-1 ring-[#D64545]' : ''
                          }`}
                          style={{ height: `${repHeight}%` }}
                        >
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-[#000F4A] text-white text-[9px] whitespace-nowrap z-10 font-mono">
                            Lapor: Rp {repMillions} jt
                          </div>
                        </div>

                        <div
                          className={`w-4 bg-[#fcb803] rounded-t-xs transition-all duration-700 ease-out relative group ${
                            d.isAnomaly ? 'ring-1 ring-[#D64545]' : ''
                          }`}
                          style={{ height: `${vaHeight}%` }}
                        >
                          <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-[#fcb803] text-[#000F4A] text-[9px] whitespace-nowrap z-10 font-bold font-mono">
                            VA: Rp {vaMillions} jt
                          </div>
                        </div>
                      </div>

                      <div className={`text-[11px] font-bold uppercase ${d.isAnomaly ? 'text-[#D64545] flex items-center gap-0.5' : 'text-[#181C20]'}`}>
                        <span>{d.dayName}</span>
                        {d.isAnomaly && <span className="material-symbols-outlined text-[13px] animate-bounce">priority_high</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabular Summary Bar */}
            <div className="overflow-x-auto border border-[#E0E2E7] rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#000F4A] text-white uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="py-2 px-3">Hari Siklus</th>
                    <th className="py-2 px-3 text-right">Lapor SPPG</th>
                    <th className="py-2 px-3 text-right">Mutasi VA Resmi</th>
                    <th className="py-2 px-3 text-right">Discrepancy (Selisih)</th>
                    <th className="py-2 px-3 text-center">Status Harian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEEF3] text-[#181C20]">
                  {kitchen.dailyFinancials.map((d) => {
                    const selisih = d.reportedSpend - d.vaOutflow;
                    const selisihPct = ((selisih / d.reportedSpend) * 100).toFixed(1);
                    return (
                      <tr
                        key={d.dayName}
                        className={`hover:bg-[#F1F4F9] transition-colors ${
                          d.isAnomaly ? 'bg-[#FCEBEB]/30' : ''
                        }`}
                      >
                        <td className={`py-2 px-3 font-semibold ${d.isAnomaly ? 'text-[#D64545]' : ''}`}>
                          {d.dateLabel}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          Rp {d.reportedSpend.toLocaleString('id-ID')}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums">
                          Rp {d.vaOutflow.toLocaleString('id-ID')}
                        </td>
                        <td className={`py-2 px-3 text-right font-mono tabular-nums ${
                          d.isAnomaly ? 'text-[#D64545] font-bold' : 'text-[#454652]'
                        }`}>
                          - Rp {selisih.toLocaleString('id-ID')} ({selisihPct}%)
                        </td>
                        <td className="py-2 px-3 text-center">
                          {d.isAnomaly ? (
                            <span className="px-2 py-0.5 rounded bg-[#FCEBEB] text-[10px] font-bold text-[#B02A2A]">
                              Anomali
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-[#ECEEF3] text-[10px] font-semibold text-[#454652]">
                              Wajar
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Forensic Callout Banner */}
            <div className="p-3.5 rounded-lg bg-[#FFF4CC]/50 border border-[#F0DB85] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#8A5A00] text-[20px] shrink-0">
                crisis_alert
              </span>
              <p className="text-xs text-[#8A5A00] leading-relaxed">
                <strong className="font-bold text-[#6A4B00]">Temuan Forensik:</strong> Selisih akumulasi terpusat pada hari operasional dengan deviasi belanja bahan vs rekening koran. Disarankan untuk memvalidasi kuitansi manual fisik pedagang pasar sebelum rilis operasional.
              </p>
            </div>
          </div>

          {/* CARD 3: Rincian Alokasi Dana Top-up Diajukan */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#ECEEF3] pb-3">
              <h2 className="text-base font-bold text-[#000F4A]">
                Rincian Alokasi Dana Top-up Diajukan
              </h2>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#454652] font-semibold">Total Pengajuan</span>
                <p className="text-xl font-bold text-[#000F4A] font-mono">
                  Rp {kitchen.topUpRequested.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Komponen Bahan Baku Pokok */}
              <div className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white text-[#000F4A] font-bold border border-[#E0E2E7]">
                      Porsi 80%
                    </span>
                    <div className="inline-flex items-center gap-1 text-[#1E9E6A] font-semibold text-xs">
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>Hak Anak Terlindungi</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#181C20] pt-1">Bahan Baku Pokok</h3>
                  <p className="text-xs text-[#454652]">Beras, Lauk Pauk, Sayur Mayur, dan Susu Segar</p>
                  <div className="pt-1">
                    <span className="text-2xl font-bold text-[#000F4A] font-mono">
                      <AnimatedNumber value={kitchen.foodBudget} prefix="Rp " />
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-[#E0E2E7] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A]"></span>
                  <p className="text-xs text-[#181C20] font-semibold">
                    Status: <span className="text-[#1E9E6A]">Dilindungi &amp; Siap Salur Porsi Minimum Darurat</span>
                  </p>
                </div>
              </div>

              {/* Komponen Operasional & Jasa Pengolah */}
              <div className="p-4 rounded-xl bg-[#FCEBEB]/30 border border-[#FAC7C7] flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white text-[#D64545] font-bold border border-[#FAC7C7]">
                      Porsi 20%
                    </span>
                    <div className="inline-flex items-center gap-1 text-[#D64545] font-semibold text-xs">
                      <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                      <span>Tahan Penguncian</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#181C20] pt-1">Operasional &amp; Jasa Pengolah</h3>
                  <p className="text-xs text-[#454652]">Honor Juru Masak, Gas LPG, Listrik, Logistik Distribusi</p>
                  <div className="pt-1">
                    <span className="text-2xl font-bold text-[#D64545] font-mono">
                      <AnimatedNumber value={kitchen.heldBudget} prefix="Rp " />
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded bg-white border border-[#FAC7C7] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D64545]"></span>
                  <p className="text-xs text-[#181C20] font-semibold">
                    Status: <span className="text-[#D64545]">{kitchen.triase === 'Hijau' ? 'Tidak Ditahan' : 'Ditahan Sementara sampai Klarifikasi Selesai'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tiered Decision, Status Stepper, Actions & Rights (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CARD 1: Keputusan Berjenjang */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#000F4A]">Keputusan Berjenjang</h2>
              <span className="text-[10px] text-[#454652] uppercase font-semibold">Triase Gerbang</span>
            </div>

            <div className="space-y-2.5">
              {/* Tier Hijau */}
              <div className={`p-3 rounded-lg border transition-all ${
                kitchen.triase === 'Hijau'
                  ? 'bg-[#E8F6F0] border-[#A3DFC4] shadow-xs'
                  : 'bg-[#F1F4F9] border-[#E0E2E7] opacity-60'
              } flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A]"></span>
                  <span className="text-xs font-semibold text-[#181C20]">Tier Hijau</span>
                </div>
                <span className="text-xs text-[#454652]">Top-up 100% Otomatis</span>
              </div>

              {/* Tier Kuning */}
              <div className={`p-3 rounded-lg border transition-all ${
                kitchen.triase === 'Kuning'
                  ? 'bg-[#FFF4CC] border-[#F0DB85] shadow-xs'
                  : 'bg-[#F1F4F9] border-[#E0E2E7] opacity-60'
              } flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fcb803]"></span>
                  <span className="text-xs font-semibold text-[#181C20]">Tier Kuning</span>
                </div>
                <span className="text-xs text-[#454652]">Bahan Cair, Operasional Ditahan</span>
              </div>

              {/* Tier Merah */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                kitchen.triase === 'Merah'
                  ? 'bg-[#FCEBEB] border-[#FAC7C7] shadow-xs'
                  : 'bg-[#F1F4F9] border-[#E0E2E7] opacity-60'
              } space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#D64545] font-bold text-xs">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Tier Merah {kitchen.triase === 'Merah' ? 'Aktif' : ''}</span>
                  </div>
                  {kitchen.triase === 'Merah' && (
                    <span className="px-2 py-0.5 rounded bg-[#D64545] text-white text-[9px] uppercase font-bold">
                      Kondisi Kasus
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#181C20] leading-relaxed">
                  Top-up <strong className="text-[#D64545]">HANYA</strong> bahan baku minimum darurat bila dapur fisik terbukti ada dan tetap memasak; penahanan penuh komponen operasional; penugasan verifikasi lapangan dengan batas usulan 5 hari kerja.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#F1F4F9] border border-[#E0E2E7] flex items-center justify-between text-xs">
              <span className="text-[#454652] font-medium">Usulan Jatuh Tempo SPP</span>
              <span className="font-bold text-[#000F4A] font-mono">Selasa, 16:00 WIB</span>
            </div>
          </div>

          {/* CARD 2: Vertical Timeline Stepper */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#000F4A]">Status Verifikasi</h2>
              <span className="text-[10px] text-[#454652] uppercase font-semibold">Siklus Audit</span>
            </div>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ECEEF3]">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#1E9E6A] text-white flex items-center justify-center text-[11px] shadow-xs">
                  <span className="material-symbols-outlined text-[13px]">check</span>
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#181C20] leading-tight">Dibaca mesin aturan</p>
                    <span className="text-[10px] text-[#1E9E6A] font-bold">Selesai</span>
                  </div>
                  <p className="text-[11px] text-[#454652]">
                    {kitchen.activeFlags.length} red flag terdeteksi otomatis
                  </p>
                  <p className="text-[10px] text-[#757683] font-mono">Kamis, 08:00 WIB</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] shadow-xs ${
                  verificationStep >= 2 ? 'bg-[#fcb803] text-[#000F4A]' : 'bg-[#ECEEF3] text-[#757683]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {verificationStep > 2 ? 'check' : 'hourglass_empty'}
                  </span>
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#000F4A] leading-tight">Penugasan verifikator</p>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      verificationStep > 2 ? 'bg-[#E8F6F0] text-[#1E9E6A]' : 'bg-[#FFF4CC] text-[#8A5A00]'
                    }`}>
                      {verificationStep > 2 ? 'Ditugaskan' : 'Menunggu'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#454652]">
                    {verificationStep > 2 ? 'Tim Audit B regional ditugaskan' : 'Menunggu tindakan auditor'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`relative ${verificationStep < 3 ? 'opacity-50' : ''}`}>
                <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] shadow-xs ${
                  verificationStep >= 3 ? 'bg-[#011F7B] text-white' : 'bg-[#ECEEF3] text-[#757683]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">
                    {verificationStep > 3 ? 'check' : 'person_pin_circle'}
                  </span>
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#181C20] leading-tight">Verifikasi lapangan</p>
                  <p className="text-[11px] text-[#454652]">Pengecekan fisik dapur, kuitansi pasar &amp; nota</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`relative ${verificationStep < 4 ? 'opacity-50' : ''}`}>
                <span className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] shadow-xs ${
                  verificationStep >= 4 ? 'bg-[#1E9E6A] text-white' : 'bg-[#ECEEF3] text-[#757683]'
                }`}>
                  <span className="material-symbols-outlined text-[13px]">task_alt</span>
                </span>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-[#181C20] leading-tight">Pemilahan hasil &amp; rekomendasi final</p>
                  <p className="text-[11px] text-[#454652]">
                    {verificationStep >= 4 ? 'Klarifikasi diterima & tercatat di Register' : 'Menunggu laporan fisik'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: Action Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-[#E0E2E7] p-5 space-y-3">
            <h2 className="text-sm font-bold text-[#000F4A]">Aksi Verifikasi &amp; Tindak Lanjut</h2>

            {/* Primary CTA (Warm Yellow Orange) */}
            <button
              onClick={handleAssignVerifier}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#fcb803] text-[#000F4A] text-sm font-bold shadow-sm hover:bg-[#eaa700] transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              <span>Tugaskan Verifikator</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => setShowClarificationModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#E0E2E7] text-[#011F7B] text-xs font-semibold shadow-xs hover:bg-[#F1F4F9] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
              <span>Minta Klarifikasi Tertulis</span>
            </button>

            <div className="pt-2 text-center">
              <button
                onClick={() => showToast('Memuat data komparasi audit Minggu 3...')}
                className="inline-flex items-center gap-1.5 text-xs text-[#011F7B] hover:underline font-semibold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                <span>Lihat Riwayat Minggu Lalu (Minggu 3)</span>
              </button>
            </div>
          </div>

          {/* CARD 4: Hak Dapur & Asas Praduga */}
          <div className="p-4 rounded-xl bg-[#F1F4F9] border border-[#E0E2E7] space-y-1">
            <div className="flex items-center gap-1.5 text-[#011F7B] font-semibold text-xs">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Hak Dapur &amp; Asas Praduga</span>
            </div>
            <p className="text-xs text-[#454652] leading-relaxed">
              <strong className="text-[#181C20] font-semibold">Hak Dapur:</strong> Dapur menerima kode red flag dan alasan penandaan serta berhak mengajukan klarifikasi tertulis beserta bukti nota fisik dan rekap mutasi dalam tenggat waktu yang ditentukan.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: Minta Klarifikasi Tertulis (Updates local state & Register Keputusan) */}
      {showClarificationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E0E2E7] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#000F4A]">
                  Klarifikasi Tertulis &amp; Catatan Verifikasi
                </h3>
                <p className="text-xs text-[#454652] mt-0.5">
                  Unit: <strong className="text-[#000F4A]">{kitchen.id}</strong> ({kitchen.name})
                </p>
              </div>
              <button
                onClick={() => setShowClarificationModal(false)}
                className="p-1 rounded-lg text-[#757683] hover:bg-[#F1F4F9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {isClarificationSuccess ? (
              <div className="p-6 text-center space-y-2">
                <span className="material-symbols-outlined text-5xl text-[#1E9E6A]">task_alt</span>
                <h4 className="text-base font-bold text-[#000F4A]">Klarifikasi Berhasil Dicatat</h4>
                <p className="text-xs text-[#454652]">Entri baru telah ditambahkan ke Register Keputusan Triase &amp; Penyelesaian.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitClarification} className="space-y-4">
                <div className="p-3 bg-[#F1F4F9] rounded-lg border border-[#E0E2E7] text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#757683]">Indikator Terpicu:</span>
                  <div className="flex gap-2">
                    {kitchen.activeFlags.map(f => (
                      <span key={f} className="px-2 py-0.5 rounded bg-[#FCEBEB] text-[#B02A2A] font-bold font-mono">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#000F4A] block">
                    Alasan Tertulis / Temuan Bukti Fisik <span className="text-[#D64545]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={clarificationReason}
                    onChange={(e) => setClarificationReason(e.target.value)}
                    placeholder="Contoh: Faktur beras asli sesuai pagu Rp 8.000, selisih akibat salah ketik koma desimal pada formulir digital..."
                    className="w-full p-3 text-xs bg-white border border-[#E0E2E7] rounded-lg text-[#181C20] placeholder:text-[#757683] focus:outline-none focus:ring-2 focus:ring-[#011F7B]/20"
                  />
                  <p className="text-[10px] text-[#757683]">
                    Catatan ini wajib diisi dan akan tercatat secara permanen di Register Audit BPK/BPKP.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowClarificationModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#454652] hover:bg-[#F1F4F9] rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-[#011F7B] text-white hover:bg-[#000F4A] rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Simpan ke Register Keputusan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
