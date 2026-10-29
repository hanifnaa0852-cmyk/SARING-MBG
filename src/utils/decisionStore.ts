/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DecisionLogEntry } from '../types';

/**
 * 40 Seeded Synthetic Register Entries
 * Timestamps are strictly AFTER the weekly gate run (Senin-Selasa Minggu 4).
 * Every entry reaching Tingkat 3 has previously passed Tingkat 2.
 * Consistent SPPG naming: "SPPG Contoh NNN" and regions "Wilayah A/B/C".
 * Action for Tingkat 3: "Rujukan ke Inspektorat Utama untuk audit investigatif".
 */
export const INITIAL_DECISION_LOGS: DecisionLogEntry[] = [
  // 1. Tingkat 3 for SPPG Contoh 087 (passed Tingkat 2 first below at log-4)
  {
    id: 'log-1',
    time: 'Jumat, 16:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 087',
    kitchenName: 'SPPG Contoh 087',
    region: 'Wilayah B',
    label: 'Merah',
    tingkat: 'Tingkat 3',
    keputusan: 'Rujukan ke Inspektorat Utama untuk audit investigatif',
    verifikator: 'Inspektorat Utama BGN',
    alasan: 'Hasil pemeriksaan lapangan Tingkat 2 menemukan nota stempel palsu berulang 3 hari berturut-turut; berkas diteruskan ke audit investigatif.',
    hasilDiubah: false
  },
  // 2. Tingkat 2 correction
  {
    id: 'log-2',
    time: 'Jumat, 14:15 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 156',
    kitchenName: 'SPPG Contoh 156',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Kesalahan ketik harga telur pada nota pelaporan terbukti murni salah input; kuitansi fisik asli sesuai pagu Rp10.000, operasional dilepas.',
    hasilDiubah: true
  },
  // 3. Tingkat 2 full release
  {
    id: 'log-3',
    time: 'Jumat, 11:20 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 212',
    kitchenName: 'SPPG Contoh 212',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Keterlambatan unggah nota pasar basah terbukti akibat gangguan transmisi sinyal lokal di remote area; fisik kuitansi lengkap dan sah.',
    hasilDiubah: true
  },
  // 4. Tingkat 2 for SPPG Contoh 087 (Prerequisite for log-1)
  {
    id: 'log-4',
    time: 'Kamis, 15:45 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 087',
    kitchenName: 'SPPG Contoh 087',
    region: 'Wilayah B',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Diteruskan & Sanggahan Ditolak',
    verifikator: 'Verifikator BGN',
    alasan: 'Verifikasi lapangan mengonfirmasi selisih kas 34% tidak didukung bukti fisik logistik pasar; diteruskan ke penelaahan indikasi kesengajaan.',
    hasilDiubah: false
  },
  // 5. Tingkat 3 for SPPG Contoh 014 (passed Tingkat 2 below at log-7)
  {
    id: 'log-5',
    time: 'Kamis, 14:10 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 014',
    kitchenName: 'SPPG Contoh 014',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 3',
    keputusan: 'Rujukan ke Inspektorat Utama untuk audit investigatif',
    verifikator: 'Inspektorat Utama BGN',
    alasan: 'Dapur belum beroperasi dan izin SLHS belum ada, namun mengajukan top-up operasional penuh dengan klaim distribusi fiktif.',
    hasilDiubah: false
  },
  // 6. Tingkat 2 correction
  {
    id: 'log-6',
    time: 'Kamis, 11:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 092',
    kitchenName: 'SPPG Contoh 092',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Faktur distributor sayur pasar lokal tertukar nomor tanggal pencatatan; berkas pembukuan telah disinkronkan.',
    hasilDiubah: true
  },
  // 7. Tingkat 2 for SPPG Contoh 014 (Prerequisite for log-5)
  {
    id: 'log-7',
    time: 'Kamis, 09:20 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 014',
    kitchenName: 'SPPG Contoh 014',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Top-up Penuh Dikonfirmasi',
    verifikator: 'Verifikator BGN',
    alasan: 'Kunjungan fisik membuktikan sarana dapur masih renovasi berat dan belum terbit SLHS; tidak ada penyaluran makan riil.',
    hasilDiubah: false
  },
  // 8. Tingkat 3 for SPPG Contoh 045 (passed Tingkat 2 below at log-11)
  {
    id: 'log-8',
    time: 'Rabu, 16:50 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 045',
    kitchenName: 'SPPG Contoh 045',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 3',
    keputusan: 'Rujukan ke Inspektorat Utama untuk audit investigatif',
    verifikator: 'Inspektorat Utama BGN',
    alasan: 'Indikasi kepemilikan rekening Virtual Account ganda terhubung dengan aliran dana mencurigakan ke pengurus.',
    hasilDiubah: false
  },
  // 9. Tingkat 2
  {
    id: 'log-9',
    time: 'Rabu, 15:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 188',
    kitchenName: 'SPPG Contoh 188',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Nota belanja ikan air tawar lokal terlambat cap basah pedagang keliling; telah disahkan kepala desa setempat.',
    hasilDiubah: true
  },
  // 10. Tingkat 1 automatic check
  {
    id: 'log-10',
    time: 'Rabu, 14:00 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 055',
    kitchenName: 'SPPG Contoh 055',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Peringatan deviasi arus keluar kas VA 11,2% vs laporan harian; SLA tanggapan tertulis 3 hari kerja.',
    hasilDiubah: false
  },
  // 11. Tingkat 2 for SPPG Contoh 045 (Prerequisite for log-8)
  {
    id: 'log-11',
    time: 'Rabu, 11:45 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 045',
    kitchenName: 'SPPG Contoh 045',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Dilanjutkan',
    verifikator: 'Verifikator BGN',
    alasan: 'Konfirmasi bank mitra menunjukkan adanya dua nomor VA aktif secara tidak sah; klarifikasi pengurus tidak memuaskan.',
    hasilDiubah: false
  },
  // 12. Tingkat 2
  {
    id: 'log-12',
    time: 'Rabu, 10:15 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 063',
    kitchenName: 'SPPG Contoh 063',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Salah entri digit desimal pada nota minyak goreng; nilai riil telah dikonfirmasi distributor resmi.',
    hasilDiubah: true
  },
  // 13. Tingkat 3 for SPPG Contoh 319 (passed Tingkat 2 below at log-16)
  {
    id: 'log-13',
    time: 'Rabu, 09:00 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 319',
    kitchenName: 'SPPG Contoh 319',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 3',
    keputusan: 'Rujukan ke Inspektorat Utama untuk audit investigatif',
    verifikator: 'Inspektorat Utama BGN',
    alasan: 'Ditemukan faktur fiktif penyedia daging sapi dengan alamat palsu serta aliran dana ke rekening terafiliasi.',
    hasilDiubah: false
  },
  // 14. Tingkat 1
  {
    id: 'log-14',
    time: 'Selasa, 16:40 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 112',
    kitchenName: 'SPPG Contoh 112',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Biaya bahan per porsi Rp10.450 melampaui pagu acuan Rp10.000 (R4 aktif sendirian).',
    hasilDiubah: false
  },
  // 15. Tingkat 2
  {
    id: 'log-15',
    time: 'Selasa, 15:55 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 128',
    kitchenName: 'SPPG Contoh 128',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Tetap Berjalan',
    verifikator: 'Verifikator BGN',
    alasan: 'Sanggahan SPPG belum melampirkan kuitansi asli stempel toko; diberikan waktu tambahan hingga batas SLA 3 hari.',
    hasilDiubah: false
  },
  // 16. Tingkat 2 for SPPG Contoh 319 (Prerequisite for log-13)
  {
    id: 'log-16',
    time: 'Selasa, 14:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 319',
    kitchenName: 'SPPG Contoh 319',
    region: 'Wilayah A',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Ditegaskan',
    verifikator: 'Verifikator BGN',
    alasan: 'Pemeriksaan lapangan mendapati ketidakcocokan bukti stok beras dan daging di gudang pendingin SPPG.',
    hasilDiubah: false
  },
  // 17 - 40: Standard post-gate entries ensuring full 40 entries
  {
    id: 'log-17',
    time: 'Selasa, 13:45 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 144',
    kitchenName: 'SPPG Contoh 144',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Dapur keliru memasukkan biaya gas LPG pada nota bahan pangan; alokasi dipindahkan ke pos operasional.',
    hasilDiubah: true
  },
  {
    id: 'log-18',
    time: 'Selasa, 13:10 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 167',
    kitchenName: 'SPPG Contoh 167',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'R5 aktif dengan selisih 12,8% antara laporan belanja harian dan arus mutasi VA.',
    hasilDiubah: false
  },
  {
    id: 'log-19',
    time: 'Selasa, 12:20 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 182',
    kitchenName: 'SPPG Contoh 182',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Klarifikasi nota pembelian buah pisang dan pepaya telah disahkan oleh komite sekolah dan koperasi mitra.',
    hasilDiubah: true
  },
  {
    id: 'log-20',
    time: 'Selasa, 11:40 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 195',
    kitchenName: 'SPPG Contoh 195',
    region: 'Wilayah B',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Bahan Baku Minimum Dicairkan, Operasional Ditahan',
    verifikator: 'Verifikator BGN',
    alasan: 'Unit dapur beroperasi nyata melayani 2.100 porsi; bahan baku dialirkan demi kontinuitas makan siswa, operasional ditahan verifikasi lapangan maks. 4 hari kerja.',
    hasilDiubah: false
  },
  {
    id: 'log-21',
    time: 'Selasa, 11:05 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 204',
    kitchenName: 'SPPG Contoh 204',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'R4 aktif karena biaya per porsi dilaporkan Rp10.200 (melebihi batas acuan tanpa toleransi).',
    hasilDiubah: false
  },
  {
    id: 'log-22',
    time: 'Selasa, 10:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 219',
    kitchenName: 'SPPG Contoh 219',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Selisih harga bumbu dapur akibat diskon grosir pasar belum tercatat; pembukuan telah direvisi.',
    hasilDiubah: true
  },
  {
    id: 'log-23',
    time: 'Selasa, 10:00 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 231',
    kitchenName: 'SPPG Contoh 231',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Selisih belanja pasar vs rekening koran mencapai 11,5% pada hari Kamis dan Jumat.',
    hasilDiubah: false
  },
  {
    id: 'log-24',
    time: 'Selasa, 09:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 248',
    kitchenName: 'SPPG Contoh 248',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Struk transaksi EDC bank mitra tertinggal di pedagang sayur; berkas fisik telah diserahkan lengkap.',
    hasilDiubah: true
  },
  {
    id: 'log-25',
    time: 'Selasa, 09:05 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 262',
    kitchenName: 'SPPG Contoh 262',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'R5 aktif dengan deviasi akumulasi belanja mingguan sebesar 13,1%.',
    hasilDiubah: false
  },
  {
    id: 'log-26',
    time: 'Selasa, 08:45 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 275',
    kitchenName: 'SPPG Contoh 275',
    region: 'Wilayah B',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Penahanan Operasional Dikonfirmasi',
    verifikator: 'Verifikator BGN',
    alasan: 'Dapur belum melengkapi sertifikasi SLHS dan status operasional di SIPGN masih penundaan verifikasi.',
    hasilDiubah: false
  },
  {
    id: 'log-27',
    time: 'Selasa, 08:20 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 288',
    kitchenName: 'SPPG Contoh 288',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Salah tulis nama penyedia tempe dan tahu; faktur fisik pedagang pasar lokal terbukti absah.',
    hasilDiubah: true
  },
  {
    id: 'log-28',
    time: 'Selasa, 08:05 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 305',
    kitchenName: 'SPPG Contoh 305',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Biaya bahan per porsi Rp10.300 di atas pagu; menunggu penjelasan harga pasar lokal.',
    hasilDiubah: false
  },
  {
    id: 'log-29',
    time: 'Selasa, 07:50 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 322',
    kitchenName: 'SPPG Contoh 322',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Nota belanja telur ayam lokal sempat tertahan di koperasi peternak; bukti transfer bank valid.',
    hasilDiubah: true
  },
  {
    id: 'log-30',
    time: 'Selasa, 07:35 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 339',
    kitchenName: 'SPPG Contoh 339',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Arus keluar kas rekening VA lebih rendah 14,2% dibanding laporan belanja SPPG.',
    hasilDiubah: false
  },
  {
    id: 'log-31',
    time: 'Selasa, 07:20 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 351',
    kitchenName: 'SPPG Contoh 351',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Operator salah menjumlahkan nota sayuran hari Sabtu; selisih telah dikoreksi administratif.',
    hasilDiubah: true
  },
  {
    id: 'log-32',
    time: 'Selasa, 07:05 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 368',
    kitchenName: 'SPPG Contoh 368',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'R4 aktif karena pengajuan harga beras premium melampaui harga acuan Rp10.000.',
    hasilDiubah: false
  },
  {
    id: 'log-33',
    time: 'Senin, 18:45 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 380',
    kitchenName: 'SPPG Contoh 380',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Surat pernyataan komite sekolah mengonfirmasi porsi riil telah terdistribusi 100% tepat sasaran.',
    hasilDiubah: true
  },
  {
    id: 'log-34',
    time: 'Senin, 18:15 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 394',
    kitchenName: 'SPPG Contoh 394',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'R5 aktif dengan deviasi belanja 11,8% pada transaksi Jumat sore.',
    hasilDiubah: false
  },
  {
    id: 'log-35',
    time: 'Senin, 17:50 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 410',
    kitchenName: 'SPPG Contoh 410',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Kwitansi pedagang cabai dan bawang lokal terlambat diunggah karena hujan deras; fisik valid.',
    hasilDiubah: true
  },
  {
    id: 'log-36',
    time: 'Senin, 17:25 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 427',
    kitchenName: 'SPPG Contoh 427',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Peringatan otomatis harga bahan pangan dilaporkan Rp10.150 per porsi.',
    hasilDiubah: false
  },
  {
    id: 'log-37',
    time: 'Senin, 16:55 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 445',
    kitchenName: 'SPPG Contoh 445',
    region: 'Wilayah C',
    label: 'Merah',
    tingkat: 'Tingkat 2',
    keputusan: 'Bahan Baku Minimum Dicairkan, Operasional Ditahan',
    verifikator: 'Verifikator BGN',
    alasan: 'Verifikasi fisik dapur ada dan memasak; selisih belanja 28% sedang diteliti oleh tim audit wilayah.',
    hasilDiubah: false
  },
  {
    id: 'log-38',
    time: 'Senin, 16:30 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 460',
    kitchenName: 'SPPG Contoh 460',
    region: 'Wilayah B',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Top-up Dicairkan Penuh',
    verifikator: 'Verifikator BGN',
    alasan: 'Distributor beras menyerahkan faktur pajak resmi pengganti nota sementara pasar tradisional.',
    hasilDiubah: true
  },
  {
    id: 'log-39',
    time: 'Senin, 16:05 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 478',
    kitchenName: 'SPPG Contoh 478',
    region: 'Wilayah A',
    label: 'Kuning',
    tingkat: 'Tingkat 1',
    keputusan: 'Menunggu Klarifikasi Tertulis SPPG',
    verifikator: 'Mesin Aturan SARING-MBG',
    alasan: 'Selisih penarikan tunai pasar vs nota belanja dilaporkan mencapai 12,4%.',
    hasilDiubah: false
  },
  {
    id: 'log-40',
    time: 'Senin, 15:40 WIB (Minggu 4)',
    sppgId: 'SPPG Contoh 495',
    kitchenName: 'SPPG Contoh 495',
    region: 'Wilayah C',
    label: 'Kuning',
    tingkat: 'Tingkat 2',
    keputusan: 'Koreksi Administratif Top-up',
    verifikator: 'Verifikator BGN',
    alasan: 'Pembetulan jumlah porsi siswa yang hadir saat kegiatan ekstrakurikuler Sabtu; data telah disahkan kepala sekolah.',
    hasilDiubah: true
  }
];
