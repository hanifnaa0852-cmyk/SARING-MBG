/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Region = 'Wilayah A' | 'Wilayah B' | 'Wilayah C';

export type TargetGroup = 'SD' | 'SMP';

export type KitchenStatus = 'beroperasi' | 'belum beroperasi' | 'suspend';

export type GroundTruth = 'problematic' | 'honest_error' | 'normal';

export type TriaseLabel = 'Hijau' | 'Kuning' | 'Merah';

export type RedFlagCode = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7' | 'R8';

export interface DailyFinancial {
  dayName: string; // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  dateLabel: string; // e.g. 'Senin (Minggu 4)'
  reportedSpend: number; // in Rupiah
  vaOutflow: number; // in Rupiah
  isAnomaly: boolean;
}

export interface Kitchen {
  id: string; // e.g. "SPPG Contoh 087"
  name: string; // e.g. "SPPG Contoh 087"
  region: Region;
  location: string; // e.g. "Kecamatan 01, Wilayah B"
  partner: string; // e.g. "Yayasan Contoh"
  capacity: number; // portions/day, e.g. 2450
  capacityLabel: string; // "2.450 porsi/hari"
  targetGroup: TargetGroup;
  status: KitchenStatus;
  hasSLHS: boolean; // Sertifikat Laik Higiene Sanitasi
  activeVaCount: number; // 1 for normal, >1 for duplicate
  penerimaSinkronisasi: number; // Jumlah penerima hasil sinkronisasi per hari
  porsiDilaporkan: number[]; // Porsi dilaporkan Senin - Sabtu (6 hari)
  totalPorsiDilaporkan: number; // Total porsi 6 hari
  hariTanpaLayanan: boolean; // Dilaporkan pada hari tanpa layanan
  biayaBahanPerPorsi: number; // Biaya bahan dilaporkan per porsi
  hargaAcuan: number; // Harga acuan bahan per porsi (HET / survei pasar), default Rp10.000
  danaDilaporkanTerpakai: number; // Dana dilaporkan terpakai (sum of 6 days reported spend)
  arusKeluarVa: number; // Arus keluar mutasi VA (sum of 6 days)
  saldoVa: number; // Saldo sisa pada rekening VA
  dailyFinancials: DailyFinancial[];
  
  // Weekly Top-Up Components (TWO components only: bahan baku & operasional)
  weeklyPortions: number; // total porsi dilaporkan
  topUpRequested: number; // total = bahanBakuBudget + operasionalBudget
  bahanBakuBudget: number; // Komponen 1: Bahan baku
  operasionalBudget: number; // Komponen 2: Operasional (share e.g. 20%)
  foodBudget: number; // alias to bahanBakuBudget
  heldBudget: number; // Dana tertahan sementara berdasarkan aturan perlakuan
  paidBahanBaku: number; // Nilai bahan baku yang dicairkan
  paidOperasional: number; // Nilai operasional yang dicairkan
  
  // Simulation metadata
  groundTruth: GroundTruth;
  schoolConfirmationSampled: boolean; // Sampel 10% konfirmasi sekolah/posyandu untuk R8
  schoolConfirmedPortions?: number; // Porsi menurut konfirmasi pihak ketiga
  
  // Consecutive cycle state
  prevWeekKuning: boolean; // Siklus minggu sebelumnya Kuning
  clarificationAccepted: boolean; // Klarifikasi diterima pada siklus sebelumnya
  isConsecutiveKuningMerah: boolean; // Merah akibat Kuning 2 siklus berturut-turut tanpa klarifikasi diterima
  
  // Computed live
  activeFlags: RedFlagCode[];
  triase: TriaseLabel;
  triggerReason: string; // Logika aturan pemicu label (e.g. "R5 + R3 aktif bersamaan", "R1 aktif", "Kuning 2 siklus tanpa klarifikasi")
  verificationDeadline: string; // "usulan 3 hari kerja" (Kuning), "usulan 4 hari kerja" (Merah)
  recommendationAction: string; // Teks perlakuan operasional
  verificationStatus: 'Mesin Aturan' | 'Menunggu Verifikator' | 'Verifikasi Lapangan' | 'Selesai';
}

export interface SimulationParameters {
  mode: 'tahap1' | 'tahap1_2'; // "Tahap 1 saja (rancangan pilot: R1, R2, R3)" [default] | "Tahap 1 + 2 (tambah R4, R5, R8)"
  tolR3: number; // 0 - 20%, default 5% (toleransi kelebihan porsi R3)
  tolR4: number; // 0 - 15%, default 0% (toleransi biaya bahan R4)
  tolR5: number; // 5 - 30%, default 10% (toleransi selisih rekonsiliasi R5)
  hargaAcuan: number; // default 10000, label "perlu dicek ke juknis"
  operasionalShare: number; // default 20 (%), label "asumsi simulasi"
  propProblematic: number; // 2 - 10%, default 4%
  propHonestError: number; // 3 - 15%, default 8%
  fieldCapacity: number; // 50 - 500, default 150 (label: "asumsi: jumlah verifikator BGN belum diketahui")
  docReviewCapacity: number; // default 600 (label: "asumsi")
}

export interface SimulationMetrics {
  total: number;
  hijauCount: number;
  kuningCount: number;
  merahCount: number;
  flaggedCount: number;
  falsePositivesCount: number;
  falsePositiveRate: number; // Positif palsu: dapur bertanda bukan bermasalah / seluruh dapur bertanda
  falseNegativesCount: number; // Negatif palsu: dapur bermasalah berlabel Hijau
  falseNegativeRate: number; // Negatif palsu dari audit sampel hijau / total dapur
  falseNegativesOverHijauRate: number; // Negatif palsu / dapur Hijau
  sensitivity: number;
  specificity: number;
  precisionBaseRate: number; // p*s / (p*s + (1-p)*(1-k))
  withheldTotal: number; // Dana tertahan sementara
  totalRequested: number;
  fieldBurden: number; // Beban lapangan (Merah only)
  fieldCapacity: number;
  merahLateCount: number; // Merah terlambat dilaporkan ke Inspektorat Utama
  docReviewBurden: number; // Beban reviu dokumen (Kuning)
  docReviewCapacity: number;
  kuningReleasedCount: number; // Kuning dilepas karena verifikator terlambat
  burdenPercent: number;
  isOverCapacity: boolean;
  medianDaysKuning: number;
  medianDaysMerah: number;
  disruptedDaysPerKitchen: number;
}

export interface DecisionLogEntry {
  id: string;
  time: string;
  sppgId: string;
  kitchenName: string;
  region: Region;
  label: TriaseLabel;
  tingkat: 'Tingkat 1' | 'Tingkat 2' | 'Tingkat 3' | 'Tingkat 4';
  keputusan: string;
  verifikator: string;
  alasan: string;
  hasilDiubah: boolean;
}

export type PageId =
  | 'landing'
  | 'logo-showcase'
  | 'ringkasan'
  | 'antrean-mingguan'
  | 'detail-kasus'
  | 'simulator-ambang'
  | 'kamus-red-flag'
  | 'error-vs-fraud'
  | 'indikator-pilot';
