/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, SimulationParameters } from '../types';

interface KamusRedFlagPageProps {
  onNavigate: (page: PageId) => void;
  params?: SimulationParameters;
  onUpdateParams?: (newParams: SimulationParameters) => void;
}

export const KamusRedFlagPage: React.FC<KamusRedFlagPageProps> = ({
  onNavigate,
  params,
  onUpdateParams
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentMode = params?.mode || 'tahap1';

  const handleToggleMode = (mode: 'tahap1' | 'tahap1_2') => {
    if (onUpdateParams && params) {
      onUpdateParams({ ...params, mode });
      showToast(
        mode === 'tahap1'
          ? 'Mode diubah: Tahap 1 saja (R1, R2, R3 - rancangan pilot)'
          : 'Mode diubah: Tahap 1 + 2 (R1, R2, R3 + R4, R5, R8)'
      );
    }
  };

  const handleDownloadPDF = () => {
    const text = `KAMUS RED FLAG & ATURAN KEPUTUSAN SARING-MBG
Dicetak: ${new Date().toLocaleDateString('id-ID')}
Siklus: SPPG input laporan harian di SIPGN Senin-Sabtu; gerbang berjalan sebelum SPP disusun; PPK terbitkan SPP top-up mingguan pada Senin-Selasa.

TABEL KAMUS RED FLAG:
Tahap 1 | R1 | Satu dapur, alamat, atau penanggung jawab memegang lebih dari satu VA aktif | Profil SPPG, data VA Himbara | Kuat | Merah
Tahap 1 | R2 | Top-up untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS | Status SPPG | Kuat | Merah
Tahap 1 | R3 | Porsi harian melebihi penerima hasil sinkronisasi, atau dilaporkan pada hari tanpa layanan | Laporan harian, SK penerima | Sedang | Kuning
Tahap 2 | R4 | Biaya bahan per porsi melebihi HET atau survei pasar | Laporan harian, Panel Harga Pangan | Sedang | Kuning
Tahap 2 | R5 | Pemakaian yang dilaporkan tidak sejalan dengan arus keluar VA | Laporan harian, mutasi VA | Sedang | Kuning
Tahap 2 | R8 | Porsi berbeda dengan konfirmasi sekolah atau posyandu (sampel acak) | Konfirmasi pihak ketiga | Sedang | Kuning
Tahap 3 | R6, R7 | Pemasok terafiliasi pengurus; pergantian rekening menjelang top-up | NIB, data pengurus, log profil | Lemah | Memilih sampel audit (tidak menentukan label)

CATATAN:
- Ambang tidak diumumkan dan dikalibrasi di pilot.
- R4 bukan uji baru: ia menguji ulang dari luar dapur validasi harga yang sudah diwajibkan juknis.
- Daya prediksi red flag belum diuji pada data SPPG.

ATURAN KEPUTUSAN LABEL:
- Merah: R1 atau R2 aktif; ATAU R5 aktif bersamaan dengan R3 atau R4; ATAU dapur berlabel Kuning dua siklus berturut-turut tanpa klarifikasi tertulis yang diterima.
- Kuning: Salah satu dari R3, R4, R5, R8 aktif tanpa kondisi Merah.
- Hijau: Tidak ada red flag aktif.
Catatan: R3 saja bisa salah input, tetapi bila sekaligus tidak cocok dengan mutasi rekening (R5), polanya mulai menyerupai penggelembungan.

PERLAKUAN PER LABEL:
- Hijau: Top-up penuh sesuai jadwal; sampel acak dapur Hijau diaudit setiap minggu tanpa pemberitahuan.
- Kuning: Bahan baku tetap cair; operasional ditahan sampai klarifikasi tertulis selesai, paling lama 3 hari kerja (usulan); dibayarkan pada SPP minggu berikutnya; jika klarifikasi terlambat karena verifikator, operasional dilepas tanpa menunggu hasil.
- Merah: Bahan baku hanya untuk penerima hasil sinkronisasi, dan hanya bila sisa saldo VA tidak mencukupi sampai SPP berikutnya; menunggu verifikasi lapangan, paling lama 4 hari kerja (usulan); dibayarkan bersama SPP minggu berikutnya; TIDAK ADA pelepasan otomatis, dan keterlambatan dilaporkan ke Inspektorat Utama. Dapur yang tidak ada tidak menerima dana dan penerimanya dialihkan.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Kamus_RedFlag_SARING-MBG.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Kamus Red Flag berhasil diunduh.');
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
            Katalog tunggal indikator risiko, sumber data, kekuatan bukti, dan perlakuan triase gerbang sebelum PPK menerbitkan SPP top-up mingguan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#000F4A] border border-[#E0E2E7] text-xs font-semibold hover:bg-[#F1F4F9] transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh Kamus (Teks/PDF)</span>
          </button>
          <button
            onClick={() => onNavigate('simulator-ambang')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#fcb803] text-[#000F4A] text-xs font-bold hover:bg-[#eaa700] transition-colors shadow-xs cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Uji di Simulator Ambang</span>
          </button>
        </div>
      </div>

      {/* GATE INPUTS ARCHITECTURE STRIP */}
      <div className="bg-white rounded-xl border border-[#E0E2E7] shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#011F7B]">input</span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#000F4A]">
              Arsitektur Masukan Gerbang (Gate Inputs)
            </h2>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#454652]">
            Dibaca otomatis sebelum SPP disusun (Senin &amp; Selasa)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Input 1: Solid */}
          <div className="p-3.5 rounded-lg bg-[#F7F9FE] border border-[#011F7B]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#000F4A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#011F7B]"></span>
                  <span>1. Laporan Harian SIPGN</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#011F7B]/10 text-[#011F7B]">
                  Tahap 1 &amp; 2
                </span>
              </div>
              <p className="text-[#454652] leading-snug">
                Porsi harian disalurkan, nota pembelian bahan pangan dari pasar lokal, dan rekapitulasi Senin–Sabtu.
              </p>
            </div>
            <span className="text-[10px] text-[#757683] mt-2 italic">Masukan data primer dari dapur</span>
          </div>

          {/* Input 2: Solid */}
          <div className="p-3.5 rounded-lg bg-[#F7F9FE] border border-[#011F7B]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#000F4A] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
                  <span>2. Status SPPG &amp; Izin</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#1E9E6A]/20 text-[#1E9E6A]">
                  Tahap 1 (Lapis 1)
                </span>
              </div>
              <p className="text-[#454652] leading-snug">
                Verifikasi status SPPG (beroperasi, suspend) dan Sertifikat Laik Higiene Sanitasi (SLHS).
              </p>
            </div>
            <span className="text-[10px] text-[#757683] mt-2 italic">Uji data master (R1 &amp; R2)</span>
          </div>

          {/* Input 3: Dashed (Mutasi VA Himbara enters at Tahap 2) */}
          <div className="p-3.5 rounded-lg bg-[#FFFBEA] border-2 border-dashed border-[#fcb803] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[#8A5A00] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#fcb803]"></span>
                  <span>3. Mutasi VA Himbara</span>
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                  Tahap 2 (Masuk di Tahap 2)
                </span>
              </div>
              <p className="text-[#454652] leading-snug">
                Data mutasi rekening koran dan arus keluar Virtual Account bank Himbara mitra pemerintah.
              </p>
            </div>
            <span className="text-[10px] text-[#8A5A00] font-semibold mt-2">
              (Garis putus-putus: terintegrasi penuh saat Tahap 2 diaktifkan)
            </span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Banner */}
      <div className="p-4 rounded-xl bg-white border border-[#E0E2E7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#011F7B]/10 flex items-center justify-center text-[#011F7B] shrink-0">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#000F4A]">
                Pilihan Mode Evaluasi Red Flag di Prototipe
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ECEEF3] text-[#000F4A]">
                {currentMode === 'tahap1' ? 'Tahap 1 Saja (Default Pilot)' : 'Tahap 1 + 2'}
              </span>
            </div>
            <p className="text-[11px] text-[#454652] mt-0.5 leading-relaxed">
              Tahap 1 saja (rancangan pilot: R1, R2, R3). Tahap 1 + 2 mengaktifkan verifikasi lanjutan HET (R4), rekonsiliasi mutasi VA (R5), dan sampel sekolah (R8).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-[#F1F4F9] p-1 rounded-lg border border-[#E0E2E7]">
          <button
            onClick={() => handleToggleMode('tahap1')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'tahap1'
                ? 'bg-[#011F7B] text-white shadow-xs'
                : 'text-[#454652] hover:text-[#000F4A]'
            }`}
          >
            Tahap 1 Saja (Pilot)
          </button>
          <button
            onClick={() => handleToggleMode('tahap1_2')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'tahap1_2'
                ? 'bg-[#011F7B] text-white shadow-xs'
                : 'text-[#454652] hover:text-[#000F4A]'
            }`}
          >
            Tahap 1 + 2 (Penuh)
          </button>
        </div>
      </div>

      {/* SECTION 1: TABEL KAMUS RED FLAG (SINGLE SOURCE OF TRUTH) */}
      <div className="bg-white rounded-xl border border-[#E0E2E7] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#ECEEF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#011F7B]">menu_book</span>
              <h2 className="text-base font-bold text-[#000F4A]">
                Tabel Kamus Red Flag SARING-MBG
              </h2>
            </div>
            <p className="text-xs text-[#454652] mt-0.5">
              Lapis 1 menguji data master (R1, R2). Lapis 2 menguji laporan mingguan (R3 pertama, lalu R4, R5, R8).
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#ECEEF3] text-[#454652] font-semibold self-start sm:self-auto">
            7 Indikator Resmi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#000F4A] text-white font-mono uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-16">Tahap</th>
                <th className="py-3 px-4 w-16">Kode</th>
                <th className="py-3 px-6">Red Flag</th>
                <th className="py-3 px-4">Sumber Data</th>
                <th className="py-3 px-3 text-center">Kekuatan</th>
                <th className="py-3 px-3 text-center">Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEEF3] text-[#181C20]">
              {/* LAPIS 1: DATA MASTER */}
              <tr className="bg-[#F7F9FE]/60">
                <td colSpan={6} className="py-2 px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#011F7B] bg-[#011F7B]/5">
                  Lapis 1 — Uji Data Master (Sebelum Top-Up)
                </td>
              </tr>

              {/* R1 */}
              <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#011F7B]">1</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#011F7B]/10 text-[#011F7B] border border-[#011F7B]/20">
                    R1
                  </span>
                </td>
                <td className="py-3.5 px-6 font-semibold text-[#000F4A]">
                  Satu dapur, alamat, atau penanggung jawab memegang lebih dari satu VA aktif
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Profil SPPG, data VA Himbara</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#D64545]/15 text-[#B02A2A]">
                    Kuat
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FCEBEB] text-[#B02A2A] border border-[#FAC7C7]">
                    Merah
                  </span>
                </td>
              </tr>

              {/* R2 */}
              <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#011F7B]">1</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#011F7B]/10 text-[#011F7B] border border-[#011F7B]/20">
                    R2
                  </span>
                </td>
                <td className="py-3.5 px-6 font-semibold text-[#000F4A]">
                  Top-up untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Status SPPG (izin operasional &amp; SLHS)</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#D64545]/15 text-[#B02A2A]">
                    Kuat
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FCEBEB] text-[#B02A2A] border border-[#FAC7C7]">
                    Merah
                  </span>
                </td>
              </tr>

              {/* LAPIS 2: LAPORAN MINGGUAN */}
              <tr className="bg-[#F7F9FE]/60">
                <td colSpan={6} className="py-2 px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A5A00] bg-[#FFF4CC]/30">
                  Lapis 2 — Uji Laporan Mingguan SPPG (R3 Pertama, Lalu R4, R5, R8)
                </td>
              </tr>

              {/* R3 */}
              <tr className="hover:bg-[#F1F4F9]/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-[#011F7B]">1</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                    R3
                  </span>
                </td>
                <td className="py-3.5 px-6 font-semibold text-[#000F4A]">
                  Porsi harian melebihi penerima hasil sinkronisasi, atau dilaporkan pada hari tanpa layanan
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Laporan harian, SK penerima</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00]">
                    Sedang
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                    Kuning
                  </span>
                </td>
              </tr>

              {/* R4 */}
              <tr className={`hover:bg-[#F1F4F9]/60 transition-colors ${currentMode === 'tahap1' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                <td className="py-3.5 px-4 font-mono font-bold text-[#8A5A00]">2</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#ECEEF3] text-[#454652] border border-[#C5C5D4]">
                    R4
                  </span>
                </td>
                <td className="py-3.5 px-6">
                  <div className="font-semibold text-[#000F4A]">
                    Biaya bahan per porsi melebihi HET atau survei pasar
                  </div>
                  <div className="text-[10px] text-[#757683] mt-0.5">
                    Parameter: Harga acuan bahan per porsi (default Rp10.000, label: perlu dicek ke juknis)
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Laporan harian, Panel Harga Pangan</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00]">
                    Sedang
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                    Kuning
                  </span>
                </td>
              </tr>

              {/* R5 */}
              <tr className={`hover:bg-[#F1F4F9]/60 transition-colors ${currentMode === 'tahap1' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                <td className="py-3.5 px-4 font-mono font-bold text-[#8A5A00]">2</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#ECEEF3] text-[#454652] border border-[#C5C5D4]">
                    R5
                  </span>
                </td>
                <td className="py-3.5 px-6 font-semibold text-[#000F4A]">
                  Pemakaian yang dilaporkan tidak sejalan dengan arus keluar VA
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Laporan harian, mutasi VA</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00]">
                    Sedang
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                    Kuning
                  </span>
                </td>
              </tr>

              {/* R8 */}
              <tr className={`hover:bg-[#F1F4F9]/60 transition-colors ${currentMode === 'tahap1' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                <td className="py-3.5 px-4 font-mono font-bold text-[#8A5A00]">2</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#ECEEF3] text-[#454652] border border-[#C5C5D4]">
                    R8
                  </span>
                </td>
                <td className="py-3.5 px-6 font-semibold text-[#000F4A]">
                  Porsi berbeda dengan konfirmasi sekolah atau posyandu (sampel acak 10%)
                </td>
                <td className="py-3.5 px-4 text-[#454652]">Konfirmasi pihak ketiga (komite sekolah/posyandu)</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00]">
                    Sedang
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                    Kuning
                  </span>
                </td>
              </tr>

              {/* TAHAP 3: EKSPLORATIF (MEMILIH SAMPEL AUDIT, TIDAK MENENTUKAN LABEL) */}
              <tr className="bg-[#F7F9FE]/60">
                <td colSpan={6} className="py-2 px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#757683] bg-gray-100/60">
                  Tahap 3 — Memilih Sampel Audit (Eksploratif, Tidak Menentukan Label)
                </td>
              </tr>

              {/* R6, R7 */}
              <tr className="hover:bg-[#F1F4F9]/60 transition-colors opacity-75">
                <td className="py-3.5 px-4 font-mono font-bold text-[#757683]">3</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#ECEEF3] text-[#757683]">
                    R6, R7
                  </span>
                </td>
                <td className="py-3.5 px-6 text-[#454652]">
                  Pemasok terafiliasi pengurus; pergantian rekening menjelang top-up
                </td>
                <td className="py-3.5 px-4 text-[#757683]">NIB, data pengurus, log profil</td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-gray-100 text-[#757683]">
                    Lemah
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center">
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-gray-100 text-[#757683] border border-gray-200">
                    Sampel audit
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3 Mandated Notes Under Table */}
        <div className="p-4 bg-[#F7F9FE] border-t border-[#ECEEF3] space-y-1.5 text-xs text-[#454652]">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B] shrink-0 mt-0.5">info</span>
            <span><strong>Ambang tidak diumumkan dan dikalibrasi di pilot.</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B] shrink-0 mt-0.5">info</span>
            <span><strong>R4 bukan uji baru:</strong> ia menguji ulang dari luar dapur validasi harga yang sudah diwajibkan juknis.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B] shrink-0 mt-0.5">info</span>
            <span><strong>Daya prediksi red flag belum diuji pada data SPPG.</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 2: ATURAN KEPUTUSAN LABEL & PERLAKUAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Label Rule Box (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E0E2E7] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#011F7B]">rule</span>
            <h2 className="text-sm font-bold text-[#000F4A]">
              Aturan Penentuan Label Triase (Tanpa Skor &amp; Tanpa Bobot)
            </h2>
          </div>

          <div className="space-y-3">
            {/* Merah */}
            <div className="p-3.5 rounded-lg bg-[#FCEBEB]/50 border border-[#FAC7C7] space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-[#FCEBEB] text-[#B02A2A] border border-[#FAC7C7]">
                  Merah
                </span>
                <span className="text-xs font-bold text-[#181C20]">Prioritas Pemeriksaan Lapangan</span>
              </div>
              <ul className="list-disc list-inside text-xs text-[#454652] space-y-0.5 pt-1">
                <li>R1 atau R2 aktif; <strong>ATAU</strong></li>
                <li>R5 aktif bersamaan dengan R3 atau R4; <strong>ATAU</strong></li>
                <li>Dapur berlabel Kuning dua siklus berturut-turut tanpa klarifikasi tertulis yang diterima.</li>
              </ul>
            </div>

            {/* Kuning */}
            <div className="p-3.5 rounded-lg bg-[#FFF4CC]/40 border border-[#F0DB85] space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-[#FFF4CC] text-[#8A5A00] border border-[#F0DB85]">
                  Kuning
                </span>
                <span className="text-xs font-bold text-[#181C20]">Klarifikasi Dokumen Tertulis</span>
              </div>
              <p className="text-xs text-[#454652] pt-0.5">
                Salah satu dari R3, R4, R5, R8 aktif tanpa memenuhi kondisi Merah.
              </p>
            </div>

            {/* Hijau */}
            <div className="p-3.5 rounded-lg bg-[#E8F6F0]/50 border border-[#A3DFC4] space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-[#E8F6F0] text-[#1E9E6A] border border-[#A3DFC4]">
                  Hijau
                </span>
                <span className="text-xs font-bold text-[#181C20]">Lolos Otomatis</span>
              </div>
              <p className="text-xs text-[#454652] pt-0.5">
                Tidak ada red flag yang aktif (bersih dari indikator).
              </p>
            </div>
          </div>

          {/* Special Integrity Note */}
          <div className="p-3 bg-[#F1F4F9] rounded-lg border border-[#E0E2E7] text-xs text-[#454652] leading-relaxed">
            <strong className="text-[#000F4A]">Catatan Logika:</strong> R3 saja bisa salah input, tetapi bila sekaligus tidak cocok dengan mutasi rekening (R5), polanya mulai menyerupai penggelembungan.
          </div>
        </div>

        {/* Treatment Box (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E0E2E7] shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#011F7B]">payments</span>
            <h2 className="text-sm font-bold text-[#000F4A]">
              Perlakuan Pencairan Top-up per Label
            </h2>
          </div>

          <div className="space-y-3">
            {/* Merah Treatment */}
            <div className="p-3.5 rounded-lg bg-[#FCEBEB]/50 border border-[#FAC7C7] space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#B02A2A]">PERLAKUAN MERAH</span>
                <span className="font-mono text-[10px] font-bold text-[#B02A2A]">usulan maks. 4 hari kerja</span>
              </div>
              <p className="text-[#181C20] leading-snug">
                Bahan baku hanya untuk penerima hasil sinkronisasi, dan <strong>hanya bila sisa saldo VA tidak mencukupi sampai SPP berikutnya</strong>. Menunggu verifikasi lapangan (paling lama 4 hari kerja). Dana tertahan dibayarkan pada SPP minggu berikutnya setelah selesai.
              </p>
              <p className="text-[11px] text-[#B02A2A] font-semibold pt-1">
                TIDAK ADA pelepasan otomatis; keterlambatan verifikasi dilaporkan ke Inspektorat Utama. Dapur fiktif/tidak ada tidak menerima dana dan penerimanya dialihkan.
              </p>
            </div>

            {/* Kuning Treatment */}
            <div className="p-3.5 rounded-lg bg-[#FFF4CC]/40 border border-[#F0DB85] space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#8A5A00]">PERLAKUAN KUNING</span>
                <span className="font-mono text-[10px] font-bold text-[#8A5A00]">usulan maks. 3 hari kerja</span>
              </div>
              <p className="text-[#181C20] leading-snug">
                <strong>Bahan baku tetap cair</strong>; operasional ditahan sampai klarifikasi tertulis selesai (paling lama 3 hari kerja). Komponen yang ditahan dibayarkan bersama SPP minggu berikutnya.
              </p>
              <p className="text-[11px] text-[#8A5A00] font-semibold pt-1">
                Jika klarifikasi terlambat karena verifikator, operasional dilepas tanpa menunggu hasil.
              </p>
            </div>

            {/* Hijau Treatment */}
            <div className="p-3.5 rounded-lg bg-[#E8F6F0]/50 border border-[#A3DFC4] space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E9E6A]">PERLAKUAN HIJAU</span>
                <span className="font-mono text-[10px] font-bold text-[#1E9E6A]">Audit acak berkala</span>
              </div>
              <p className="text-[#181C20] leading-snug">
                Top-up penuh sesuai jadwal (bahan baku &amp; operasional). Sampel acak dapur Hijau diaudit setiap minggu tanpa pemberitahuan untuk menguji negatif palsu.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#757683] italic">
            * Seluruh batas hari verifikasi dan klarifikasi berlabel &ldquo;usulan&rdquo; dan dikalibrasi selama masa uji coba pilot.
          </div>
        </div>
      </div>
    </div>
  );
};
