/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DecisionLogEntry } from '../types';

export const INITIAL_DECISION_LOGS: DecisionLogEntry[] = [
  {
    id: 'log-1',
    time: 'Kamis, 07:45 WIB',
    sppgId: 'SPPG Banyumas 087',
    kitchenName: 'SPPG Purwokerto Timur 087',
    region: 'Jawa Tengah',
    label: 'Merah',
    tingkat: 'Tingkat 3',
    keputusan: 'Dirujuk ke Inspektorat Utama',
    verifikator: 'Auditor Tim 3 MBG',
    alasan: 'Rekonsiliasi R5 selisih 34% disertai ketidaksesuaian nota fiktif berturut-turut pada 3 hari belanja',
    hasilDiubah: true
  },
  {
    id: 'log-2',
    time: 'Kamis, 07:15 WIB',
    sppgId: 'SPPG Ciamis 156',
    kitchenName: 'SPPG Ciamis Kota 156',
    region: 'Jawa Barat',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator Jawa Barat',
    alasan: 'Selisih dari salah input pagu R4a, faktur beras asli sesuai pagu Rp 10.000, dikoreksi administratif',
    hasilDiubah: true
  },
  {
    id: 'log-3',
    time: 'Rabu, 16:20 WIB',
    sppgId: 'SPPG Malang 212',
    kitchenName: 'SPPG Klojen Malang 212',
    region: 'Jawa Timur',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator Jawa Timur',
    alasan: 'Nota basah pasar terunggah terlambat karena kendala jaringan di remote area; fisik telah diverifikasi sah',
    hasilDiubah: true
  },
  {
    id: 'log-4',
    time: 'Rabu, 15:40 WIB',
    sppgId: 'SPPG Bandung 014',
    kitchenName: 'SPPG Coblong Bandung 014',
    region: 'Jawa Barat',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Dilanjutkan',
    verifikator: 'Verifikator Jawa Barat',
    alasan: 'Dapur dalam masa renovasi parsial izin sanitasi belum final, bahan pokok disalurkan via dapur penyangga',
    hasilDiubah: false
  },
  {
    id: 'log-5',
    time: 'Rabu, 14:10 WIB',
    sppgId: 'SPPG Boyolali 092',
    kitchenName: 'SPPG Mojosongo Boyolali 092',
    region: 'Jawa Tengah',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Dapur',
    verifikator: 'Sistem SIPGN',
    alasan: 'Deteksi nomor rekening VA perlu konfirmasi ulang kepemilikan rekening bersama SPPG',
    hasilDiubah: false
  },
  {
    id: 'log-6',
    time: 'Rabu, 11:30 WIB',
    sppgId: 'SPPG Depok 045',
    kitchenName: 'SPPG Pancoran Mas Depok 045',
    region: 'Jawa Barat',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Pagu Operasional',
    verifikator: 'Verifikator Jawa Barat',
    alasan: 'Salah catat biaya gas elpiji pada kolom logistik harian, dokumen revisi telah divalidasi',
    hasilDiubah: true
  }
];
