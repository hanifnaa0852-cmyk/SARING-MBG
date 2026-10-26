/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId } from '../types';

interface KamusRedFlagPageProps {
  onNavigate: (page: PageId) => void;
  enableR3Tahap1?: boolean;
  onToggleR3?: (enabled: boolean) => void;
}

export const KamusRedFlagPage: React.FC<KamusRedFlagPageProps> = ({
  onNavigate,
  enableR3Tahap1 = false,
  onToggleR3,
}) => {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownloadPDF = () => {
    const text = `PETUNJUK TEKNIS TRIASE RED FLAG SARING-MBG (Tahap 1, 2, 3)
Dicetak: ${new Date().toLocaleDateString('id-ID')}

INDIKATOR TAHAP 1 (INTI - DIJALANKAN OTOMATIS):
- R1: Satu dapur, alamat, atau penanggung jawab memiliki lebih dari 1 VA aktif.
- R2: Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS.
- R4a: Biaya bahan per porsi melebihi pagu bahan per porsi (default Rp10.000, perlu dicek ke juknis).
- R5: Dana dilaporkan terpakai tidak sejalan dengan arus keluar dan saldo VA.
${enableR3Tahap1 ? '- R3: Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan (Aktif di Tahap 1).\n' : ''}
INDIKATOR TAHAP 2 (TERENCANA):
${!enableR3Tahap1 ? '- R3: Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan.\n' : ''}- R4b: Deviasi volume bahan baku vs kehadiran siswa Dapodik > 10%.
- R8: Konsentrasi rekanan suplier tunggal lintas wilayah tanpa perizinan distributor.

INDIKATOR TAHAP 3 (EKSPLORATIF):
- R6: Anomali konsumsi energi (listrik/LPG) tidak proporsional dengan jumlah porsi masakan.
- R7: Analisis teks nota pasar manual terindikasi stempel rekayasa.

ATURAN TRIASE KEPUTUSAN:
- Merah: R1 atau R2 aktif, atau dua atau lebih bendera aktif lainnya aktif bersamaan. Top-up hanya bahan baku minimum darurat (bila dapur terbukti ada dan beroperasi); operasional dan insentif ditahan (usulan); verifikasi usulan 5 hari kerja.
- Kuning: Tepat satu bendera aktif lainnya aktif sendiri. Bahan baku cair, operasional dan insentif ditahan sementara menunggu klarifikasi tertulis (usulan 3 hari kerja).
- Hijau: Tidak ada red flag aktif. Seluruh komponen (bahan baku, operasional, insentif) dicairkan 100%.

Catatan: Bendera yang berbagi sumber yang sama (laporan harian SPPG) yang aktif bersamaan hanya menaikkan prioritas verifikasi; tidak membuktikan kesengajaan. Tanpa pembobotan numerik.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Juknis_Triase_RedFlag_MBG.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Juknis Triase berhasil diunduh.');
  };

  return (
    <div className="px-8 py-6 flex flex-col gap-6 max-w-[1600px] w-full mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Context Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[#454652] text-xs mb-1">
            <span>Pilar Audit MBG</span>
            <span className="material-symbols-outlined text-[14px] text-[#C5C5D4]">chevron_right</span>
            <span className="font-semibold text-[#000F4A]">Kamus Red Flag</span>
          </div>
          <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">
            Kamus Red Flag dan Aturan Keputusan
          </h1>
          <p className="text-sm text-[#454652] mt-1 max-w-4xl">
            Katalog indikator risiko otomatis, dasar rujukan temuan, dan logika triase gerbang sebelum penerbitan SPP.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#000F4A] border border-[#E0E2E7] text-xs font-semibold hover:bg-[#F1F4F9] transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Juknis Triase (PDF)</span>
          </button>
          <button
            onClick={() => onNavigate('simulator-ambang')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fcb803] text-[#000F4A] text-xs font-bold hover:bg-[#eaa700] transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Simulasikan di Ambang</span>
          </button>
        </div>
      </div>

      {/* R3 Toggle Banner */}
      <div className="p-4 rounded-xl bg-[#F7F9FE] border border-[#011F7B]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#011F7B]/10 flex items-center justify-center text-[#011F7B] shrink-0">
            <span className="material-symbols-outlined text-[20px]">sync_alt</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#000F4A]">
                Pindahkan R3 ke Tahap 1 (bila data penetapan penerima sudah digital)
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                enableR3Tahap1 ? 'bg-[#1E9E6A]/20 text-[#1E9E6A] border border-[#1E9E6A]/40' : 'bg-gray-200 text-gray-700'
              }`}>
                {enableR3Tahap1 ? 'AKTIF DI TAHAP 1' : 'DEFAULT OFF (DI TAHAP 2)'}
              </span>
            </div>
            <p className="text-[11px] text-[#454652] mt-0.5 leading-relaxed">
              R3: Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan. Jika diaktifkan, R3 ikut dihitung sebagai bendera aktif Tahap 1.
            </p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={enableR3Tahap1}
            onChange={(e) => {
              if (onToggleR3) onToggleR3(e.target.checked);
              showToast(e.target.checked ? 'R3 dipindahkan ke Tahap 1' : 'R3 dikembalikan ke Tahap 2');
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#011F7B]"></div>
          <span className="ml-2 text-xs font-bold text-[#000F4A]">
            {enableR3Tahap1 ? 'Aktif' : 'Non-aktif'}
          </span>
        </label>
      </div>

      {/* Section 1: Tab Navigation & Tabel Indikator Red Flag */}
      <div className="bg-white rounded-xl border border-[#E0E2E7] shadow-sm overflow-hidden">
        {/* Tabs Bar */}
        <div className="p-5 border-b border-[#ECEEF3]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#ECEEF3]">
            {/* Segmented Tab Controls */}
            <div className="inline-flex p-1 bg-[#F1F4F9] rounded-lg border border-[#E0E2E7]">
              <button
                onClick={() => setActiveStage(1)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeStage === 1
                    ? 'bg-[#011F7B] text-white shadow-xs'
                    : 'text-[#454652] hover:text-[#181C20]'
                }`}
              >
                <span>Tahap 1 (Inti)</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#fcb803] text-[#000F4A] font-bold leading-none">
                  {enableR3Tahap1 ? '5 Indikator Aktif' : '4 Indikator Aktif'}
                </span>
              </button>

              <button
                onClick={() => setActiveStage(2)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeStage === 2
                    ? 'bg-[#011F7B] text-white shadow-xs'
                    : 'text-[#454652] hover:text-[#181C20]'
                }`}
              >
                <span>Tahap 2</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#ECEEF3] text-[#454652] font-semibold leading-none">
                  {enableR3Tahap1 ? '2 Terencana (R3 di T1)' : '3 Terencana'}
                </span>
              </button>

              <button
                onClick={() => setActiveStage(3)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeStage === 3
                    ? 'bg-[#011F7B] text-white shadow-xs'
                    : 'text-[#454652] hover:text-[#181C20]'
                }`}
              >
                <span>Tahap 3 (Hipotesis)</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#ECEEF3] text-[#454652] font-semibold leading-none">
                  2 Eksploratif
                </span>
              </button>
            </div>

            {/* Execution Schedule Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F1F4F9] border border-[#E0E2E7] text-[#454652] text-xs">
              <span className="material-symbols-outlined text-[16px] text-[#011F7B]">update</span>
              <span>Batch Eksekusi: <strong className="text-[#181C20] font-semibold">Senin–Selasa</strong> (sebelum penerbitan SPP oleh PPK)</span>
            </div>
          </div>

          <p className="text-xs text-[#454652] mt-3">
            {activeStage === 1 && 'SPPG menginput laporan harian Senin–Sabtu; gerbang berjalan otomatis sebelum PPK menerbitkan SPP (Senin–Selasa) terhadap berkas SPPG mingguan untuk menentukan isolasi likuiditas belanja operasional dan insentif vs bahan baku.'}
            {activeStage === 2 && 'Indikator Tahap 2 disiapkan untuk integrasi API tingkat lanjut (mutasi perbankan Himbara, presensi sidik jari Dapodik, dan basis data NIB OSS).'}
            {activeStage === 3 && 'Indikator Tahap 3 merupakan model eksploratif forensik digital masa depan yang diuji coba secara laboratoris di bawah supervisi tim riset Inspektorat Utama BGN.'}
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#011F7B] text-white h-10 border-b border-white/10 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-2.5 px-4 w-20">Kode</th>
                <th className="py-2.5 px-4 min-w-[300px]">Red Flag</th>
                <th className="py-2.5 px-4 min-w-[200px]">Data yang Dicocokkan</th>
                <th className="py-2.5 px-4 min-w-[180px]">Dasar Rujukan</th>
                <th className="py-2.5 px-4 min-w-[190px]">Status Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF3] text-[#181C20]">
              {activeStage === 1 && (
                <>
                  {/* Row 1: R1 */}
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#011F7B] bg-[#DDE1FF] px-2 py-0.5 rounded">
                        R1
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Satu dapur, alamat, atau penanggung jawab punya lebih dari satu VA aktif, dicek ulang tiap minggu
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Deteksi anomali rekening ganda atau duplikasi entitas penerima dana untuk mencegah penyaluran berganda pada unit fiktif.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#757683]">database</span>
                        <span>Profil SPPG, data VA Himbara</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="font-medium text-[#000F4A]">Temuan BGN Juli 2026</span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECEEF3] border border-[#C5C5D4] text-[#181C20] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px] text-[#8A5A00]">manage_search</span>
                        <span>Perlu dicek ke sumber resmi</span>
                      </span>
                    </td>
                  </tr>

                  {/* Row 2: R2 */}
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#011F7B] bg-[#DDE1FF] px-2 py-0.5 rounded">
                        R2
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Pencegahan pencairan fiktif pada unit layanan yang belum beroperasi, disuspend, atau belum memiliki Sertifikat Laik Higiene Sanitasi (SLHS).
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#757683]">shield</span>
                        <span>Status SPPG di SIPGN &amp; basis data SLHS</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="font-medium text-[#000F4A]">Temuan BGN Juli 2026 &amp; Standar SLHS</span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECEEF3] border border-[#C5C5D4] text-[#181C20] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px] text-[#8A5A00]">manage_search</span>
                        <span>Perlu dicek ke sumber resmi</span>
                      </span>
                    </td>
                  </tr>

                  {/* Row 3: R4a */}
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#011F7B] bg-[#DDE1FF] px-2 py-0.5 rounded">
                        R4a
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Biaya bahan per porsi melebihi pagu bahan per porsi
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Deteksi deviasi belanja bahan makanan melampaui pagu bahan per porsi (default Rp10.000, perlu dicek ke juknis) ditambah toleransi.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#757683]">receipt_long</span>
                        <span>Laporan harian SIPGN, pagu bahan dalam juknis</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="font-medium text-[#000F4A]">Pagu tercatat dalam kajian KPK 2026 / Juknis BGN</span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECEEF3] border border-[#C5C5D4] text-[#181C20] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px] text-[#011F7B]">menu_book</span>
                        <span>Perlu dicek ke juknis</span>
                      </span>
                    </td>
                  </tr>

                  {/* Row 4: R5 */}
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#011F7B] bg-[#DDE1FF] px-2 py-0.5 rounded">
                        R5
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Dana dilaporkan terpakai tidak sejalan dengan arus keluar dan saldo VA minggu yang sama
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Discrepancy antara pencatatan pengeluaran SPPG vs mutasi perbankan VA BGN pada periode siklus anggaran berjalan.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <div className="inline-flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#757683]">account_balance</span>
                        <span>Laporan harian, mutasi VA</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="font-medium text-[#000F4A]">Prinsip rekonsiliasi</span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#011F7B]/10 border border-[#011F7B]/30 text-[#011F7B] text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[13px] text-[#011F7B]">balance</span>
                        <span>Turunan temuan BPK</span>
                      </span>
                    </td>
                  </tr>

                  {/* Optional Row 5: R3 when enabled in Tahap 1 */}
                  {enableR3Tahap1 && (
                    <tr className="hover:bg-[#F1F4F9]/60 transition-colors bg-[#EBF3FF]/40">
                      <td className="py-4 px-4 align-top">
                        <span className="inline-flex items-center justify-center font-bold text-white bg-[#011F7B] px-2 py-0.5 rounded">
                          R3
                        </span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                            Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1E9E6A]/20 text-[#1E9E6A] border border-[#1E9E6A]/40 shrink-0">
                            DIPINDAHKAN KE TAHAP 1
                          </span>
                        </div>
                        <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                          Deteksi pelaporan porsi makan bergizi yang melebihi kuota siswa terdaftar hasil penetapan, atau pelaporan klaim pada hari libur sekolah.
                        </p>
                      </td>
                      <td className="py-4 px-4 align-top text-[#454652]">
                        <div className="inline-flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-[#757683]">school</span>
                          <span>Data penetapan penerima, laporan porsi, kalender layanan</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="font-medium text-[#000F4A]">Kajian Verifikasi Penerima BGN</span>
                      </td>
                      <td className="py-4 px-4 align-top">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1E9E6A]/10 border border-[#1E9E6A]/30 text-[#1E9E6A] text-[10px] font-bold">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          <span>Aktif di Tahap 1</span>
                        </span>
                      </td>
                    </tr>
                  )}
                </>
              )}

              {activeStage === 2 && (
                <>
                  {/* R3 in Tahap 2 (shows status if moved or default) */}
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#757683] bg-[#ECEEF3] px-2 py-0.5 rounded">
                        R3
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                          Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan
                        </p>
                        {enableR3Tahap1 && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#1E9E6A]/20 text-[#1E9E6A] border border-[#1E9E6A]/40 shrink-0">
                            SEDANG AKTIF DI TAHAP 1
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Deteksi pelaporan porsi makan bergizi yang melebihi kuota siswa terdaftar hasil penetapan, atau pelaporan klaim pada hari libur sekolah.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <span>Data penetapan penerima MBG, laporan porsi, kalender sekolah</span>
                    </td>
                    <td className="py-4 px-4 align-top text-[#000F4A]">
                      Kajian Verifikasi Penerima BGN &amp; Juknis
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF4CC] text-[#8A5A00] text-[10px] font-bold">
                        <span>{enableR3Tahap1 ? 'Dipindahkan ke Tahap 1' : 'Tahap 2 (Terencana)'}</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#757683] bg-[#ECEEF3] px-2 py-0.5 rounded">
                        R4b
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Deviasi volume bahan baku vs kehadiran siswa Dapodik &gt; 10%
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Komparasi antara data siswa penerima makanan yang hadir fisik di sekolah dengan kalkulasi kilogram beras dan lauk yang dibeli.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <span>Log absensi sidik jari / foto siswa</span>
                    </td>
                    <td className="py-4 px-4 align-top text-[#000F4A]">
                      Kajian Logistik Bappenas
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF4CC] text-[#8A5A00] text-[10px] font-bold">
                        <span>Tahap 2 (Terencana)</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#757683] bg-[#ECEEF3] px-2 py-0.5 rounded">
                        R8
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Konsentrasi rekanan suplier tunggal lintas wilayah tanpa perizinan distributor
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Indikasi persekongkolan tender lokal atau monopoli pasokan sayur mayur/daging oleh badan usaha perantara tanpa izin edar.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <span>Data NIB &amp; NPWP pemasok SIPGN</span>
                    </td>
                    <td className="py-4 px-4 align-top text-[#000F4A]">
                      Temuan KPPU &amp; Inspektorat
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF4CC] text-[#8A5A00] text-[10px] font-bold">
                        <span>Tahap 2 (Terencana)</span>
                      </span>
                    </td>
                  </tr>
                </>
              )}

              {activeStage === 3 && (
                <>
                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#757683] bg-[#ECEEF3] px-2 py-0.5 rounded">
                        R6
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Anomali konsumsi energi (listrik/LPG) tidak proporsional dengan jumlah porsi masakan
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Pemodelan termodinamika memasak: konsumsi tabung gas LPG 12kg/50kg terlalu rendah dibandingkan 3.000 porsi matang yang diklaim.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <span>Sensor IoT meteran PLN / Pertamina</span>
                    </td>
                    <td className="py-4 px-4 align-top text-[#000F4A]">
                      Studi Efisiensi Dapur Riset
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECEEF3] text-[#757683] text-[10px] font-bold">
                        <span>Tahap 3 (Eksploratif)</span>
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center justify-center font-bold text-[#757683] bg-[#ECEEF3] px-2 py-0.5 rounded">
                        R7
                      </span>
                    </td>
                    <td className="py-4 px-4 align-top">
                      <p className="text-sm font-semibold text-[#000F4A] leading-snug">
                        Analisis teks nota pasar manual menggunakan kecerdasan buatan terindikasi stempel rekayasa
                      </p>
                      <p className="text-xs text-[#454652] mt-1 leading-relaxed">
                        Deteksi kesamaan pola goresan tanda tangan atau cap stempel toko sayur pada nota yang diterbitkan oleh pedagang berbeda.
                      </p>
                    </td>
                    <td className="py-4 px-4 align-top text-[#454652]">
                      <span>Pemindaian OCR kuitansi fisik</span>
                    </td>
                    <td className="py-4 px-4 align-top text-[#000F4A]">
                      Uji Coba Lab Forensik Digital
                    </td>
                    <td className="py-4 px-4 align-top">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ECEEF3] text-[#757683] text-[10px] font-bold">
                        <span>Tahap 3 (Eksploratif)</span>
                      </span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info Strip */}
        <div className="px-5 py-3 bg-[#F1F4F9] border-t border-[#ECEEF3] flex items-center justify-between text-xs text-[#454652]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
            <span>
              {activeStage === 1 ? 'Menampilkan 4 dari 4 Indikator Tahap 1 aktif di simulasi' : activeStage === 2 ? 'Menampilkan 3 Indikator Terencana Tahap 2' : 'Menampilkan 2 Indikator Eksploratif Tahap 3'}
            </span>
          </div>
          <div>
            <span>Target verifikasi mingguan: <strong className="text-[#000F4A] font-semibold">100% berkas SPP aktif</strong></span>
          </div>
        </div>
      </div>

      {/* Section 2: Card "Aturan keputusan (usulan, dikalibrasi di pilot)" */}
      <div className="bg-white rounded-xl border border-[#E0E2E7] shadow-sm p-6 flex flex-col gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[22px] text-[#011F7B]">alt_route</span>
            <h2 className="text-lg font-bold text-[#000F4A]">
              Aturan Keputusan Triase Gerbang (Usulan, Dikalibrasi di Pilot)
            </h2>
          </div>
          <p className="text-xs text-[#454652]">
            Kombinasi indikator yang menentukan tingkatan respon dan intervensi likuiditas mingguan sebelum SPP diterbitkan:
          </p>
        </div>

        {/* Triase Rows Container */}
        <div className="flex flex-col gap-3">
          {/* Row Merah */}
          <div className="p-4 rounded-xl bg-[#FCEBEB]/50 border border-[#FAC7C7] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start lg:items-center gap-3 min-w-[240px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FCEBEB] border border-[#F5AAAA] text-[#B02A2A] text-xs font-bold shadow-xs">
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Merah</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#B02A2A] tracking-wider">Kondisi Logika Trigger</span>
                <span className="text-xs font-semibold text-[#181C20]">R1 atau R2 aktif, ATAU dua atau lebih bendera aktif lainnya aktif bersamaan</span>
              </div>
            </div>

            <div className="flex-1 lg:max-w-2xl bg-white p-3 rounded-lg border border-[#FAC7C7]/60">
              <span className="text-[10px] uppercase font-bold text-[#D64545] tracking-wider block mb-0.5">
                Konsekuensi Operasional Gerbang
              </span>
              <p className="text-xs text-[#181C20] leading-snug">
                Hanya bahan baku minimum darurat yang dicairkan (bila dapur terbukti ada dan beroperasi); operasional dan insentif ditahan (usulan); penugasan verifikasi lapangan (usulan 5 hari kerja). Bila unit belum beroperasi atau disuspend, top-up ditahan penuh.
              </p>
            </div>
          </div>

          {/* Row Kuning */}
          <div className="p-4 rounded-xl bg-[#FFF4CC]/40 border border-[#F0DB85] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start lg:items-center gap-3 min-w-[240px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF4CC] border border-[#F0DB85] text-[#8A5A00] text-xs font-bold shadow-xs">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Kuning</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#8A5A00] tracking-wider">Kondisi Logika Trigger</span>
                <span className="text-xs font-semibold text-[#181C20]">Tepat satu bendera aktif lainnya aktif sendiri (misal hanya R4a, hanya R5, atau hanya R3)</span>
              </div>
            </div>

            <div className="flex-1 lg:max-w-2xl bg-white p-3 rounded-lg border border-[#F0DB85]/60">
              <span className="text-[10px] uppercase font-bold text-[#8A5A00] tracking-wider block mb-0.5">
                Konsekuensi Operasional Gerbang
              </span>
              <p className="text-xs text-[#181C20] leading-snug">
                Bahan baku dicairkan penuh; operasional dan insentif ditahan sementara menunggu klarifikasi tertulis (usulan 3 hari kerja).
              </p>
            </div>
          </div>

          {/* Row Hijau */}
          <div className="p-4 rounded-xl bg-[#E8F6F0]/50 border border-[#A3DFC4] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start lg:items-center gap-3 min-w-[240px]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F6F0] border border-[#A3DFC4] text-[#1E9E6A] text-xs font-bold shadow-xs">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Hijau</span>
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#1E9E6A] tracking-wider">Kondisi Logika Trigger</span>
                <span className="text-xs font-semibold text-[#181C20]">Tidak ada red flag aktif (bersih dari seluruh indikator aktif)</span>
              </div>
            </div>

            <div className="flex-1 lg:max-w-2xl bg-white p-3 rounded-lg border border-[#A3DFC4]/60">
              <span className="text-[10px] uppercase font-bold text-[#1E9E6A] tracking-wider block mb-0.5">
                Konsekuensi Operasional Gerbang
              </span>
              <p className="text-xs text-[#181C20] leading-snug">
                Top-up penuh 100% (bahan baku, operasional, dan insentif) langsung dicairkan ke rekening operasional SPPG secara otomatis tanpa hambatan likuiditas.
              </p>
            </div>
          </div>
        </div>

        {/* Logic Callout Box */}
        <div className="p-3.5 rounded-lg bg-[#F1F4F9] border border-[#E0E2E7] flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-[#011F7B] shrink-0 mt-0.5">info</span>
          <div className="text-xs text-[#454652] leading-relaxed">
            <strong className="font-semibold text-[#000F4A]">Catatan Logika Integritas:</strong> Tidak ada pembobotan numerik. Bendera yang berbagi sumber yang sama (laporan harian SPPG) yang aktif bersamaan hanya menaikkan prioritas verifikasi; tidak membuktikan kesengajaan.
          </div>
        </div>
      </div>

      {/* Section 3: Info Card "Transparansi & Akuntabilitas Tata Kelola" */}
      <div className="bg-white rounded-xl border border-[#E0E2E7] shadow-sm p-6 border-l-[6px] border-l-[#011F7B]">
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 text-[#000F4A] text-lg font-bold mb-1">
              <span className="material-symbols-outlined text-[22px]">policy</span>
              <h3>Prinsip Transparansi &amp; Akuntabilitas Sistem</h3>
            </div>
            <p className="text-xs text-[#181C20] italic bg-[#F1F4F9] p-3.5 rounded-lg border border-[#E0E2E7] leading-relaxed font-medium">
              “Ambang numerik dan parameter sampel acak tidak diumumkan. Kode red flag, alasan penandaan, dan hak klarifikasi tertulis disampaikan kepada dapur yang ditandai. Kamus lengkap dapat diaudit BPK dan BPKP.”
            </p>
          </div>

          {/* 3 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E2E7] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#011F7B]/10 flex items-center justify-center text-[#011F7B] mb-3">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <h4 className="text-xs font-bold text-[#000F4A] mb-1">
                  Kerahasiaan Ambang Numerik
                </h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  Mencegah manipulasi pelaporan di batas ambang toleransi (<em>gaming the metrics</em>) oleh operator SPPG nakal.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#ECEEF3] flex items-center gap-1.5 text-[#757683] text-[10px] uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">verified_user</span>
                <span>Perlindungan Algoritmik</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E2E7] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#fcb803]/20 flex items-center justify-center text-[#8A5A00] mb-3">
                  <span className="material-symbols-outlined text-[18px]">campaign</span>
                </div>
                <h4 className="text-xs font-bold text-[#000F4A] mb-1">
                  Hak Dapur &amp; Keterbukaan Alasan
                </h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  Memberikan transparansi kode temuan dan hak sanggah resmi dengan bukti faktur belanja bagi pengelola dapur yang tertahan.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#ECEEF3] flex items-center gap-1.5 text-[#757683] text-[10px] uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">rule</span>
                <span>Hak Jawab Transparan</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-xl bg-white border border-[#E0E2E7] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-[#DDE1FF] flex items-center justify-center text-[#011F7B] mb-3">
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                </div>
                <h4 className="text-xs font-bold text-[#000F4A] mb-1">
                  Auditabilitas Eksternal Penuh
                </h4>
                <p className="text-[11px] text-[#454652] leading-relaxed">
                  Seluruh formula, batasan parameter, dan log putusan mesin aturan terbuka penuh untuk diperiksa secara independen oleh BPK dan BPKP.
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-[#ECEEF3] flex items-center gap-1.5 text-[#757683] text-[10px] uppercase font-bold">
                <span className="material-symbols-outlined text-[14px]">gavel</span>
                <span>Standar Pengawasan Negara</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
