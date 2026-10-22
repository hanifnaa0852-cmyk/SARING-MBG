/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DecisionLogEntry } from '../types';

export const INITIAL_DECISION_LOGS: DecisionLogEntry[] = [
  {
    id: 'log-1',
    time: 'Kamis, 07:45 WIB',
    sppgId: 'SPPG Contoh 087',
    kitchenName: 'SPPG Sentra Mandiri 087',
    region: 'Wilayah B',
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
    sppgId: 'SPPG Contoh 156',
    kitchenName: 'Sentra Gizi Priangan 156',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator Wly-A',
    alasan: 'Selisih dari salah input pagu R4a, faktur beras asli sesuai pagu Rp 8.000, dikoreksi administratif',
    hasilDiubah: true
  },
  {
    id: 'log-3',
    time: 'Rabu, 16:20 WIB',
    sppgId: 'SPPG Contoh 212',
    kitchenName: 'Dapur Sehat Berkah 212',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator Wly-C',
    alasan: 'Nota basah pasar terunggah terlambat karena kendala jaringan di remote area; fisik telah diverifikasi sah',
    hasilDiubah: true
  },
  {
    id: 'log-4',
    time: 'Rabu, 15:40 WIB',
    sppgId: 'SPPG Contoh 014',
    kitchenName: 'Dapur Nutrisi Sejahtera 014',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Dilanjutkan',
    verifikator: 'Verifikator Wly-A',
    alasan: 'Dapur dalam masa renovasi parsial izin sanitasi belum final, bahan pokok disalurkan via dapur penyangga',
    hasilDiubah: false
  },
  {
    id: 'log-5',
    time: 'Rabu, 14:10 WIB',
    sppgId: 'SPPG Contoh 092',
    kitchenName: 'Dapur Makmur 092',
    region: 'Wilayah B',
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
    sppgId: 'SPPG Contoh 045',
    kitchenName: 'Dapur Cemerlang Depok 045',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Pagu Operasional',
    verifikator: 'Verifikator Wly-A',
    alasan: 'Salah catat biaya gas elpiji pada kolom logistik harian, dokumen revisi telah divalidasi',
    hasilDiubah: true
  }
];
