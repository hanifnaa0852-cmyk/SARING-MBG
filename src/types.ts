/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Region = 'Wilayah A' | 'Wilayah B' | 'Wilayah C';

export type TargetGroup = 'SD' | 'SMP';

export type KitchenStatus = 'beroperasi' | 'belum beroperasi' | 'suspend';

export type GroundTruth = 'problematic' | 'honest_error' | 'normal';

export type TriaseLabel = 'Hijau' | 'Kuning' | 'Merah';

export type RedFlagCode = 'R1' | 'R2' | 'R3' | 'R4a' | 'R4b' | 'R5' | 'R6' | 'R7' | 'R8';

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
  paguPerPorsi: number; // default Rp 10.000 (perlu dicek ke juknis)
  activeVaCount: number; // 1 for normal, >1 for duplicate
  status: KitchenStatus;
  reportedCostPerPortion: number; // Rp 8.000 - 11.500
  dailyFinancials: DailyFinancial[];
  reportedSpendTotal: number; // sum of 6 days
  vaOutflowTotal: number; // sum of 6 days
  vaBalance: number; // e.g. Rp 120.000.000 (context under 500M)
  
  // Weekly Top-Up Components
  weeklyPortions: number; // reported portions in 6 days
  topUpRequested: number; // total = bahanBaku + operasional + insentif
  bahanBakuBudget: number; // Component 1: Bahan baku pokok
  operasionalBudget: number; // Component 2: Operasional & jasa pengolah
  insentifBudget: number; // Component 3: Insentif Rp 2.000/porsi (efektif 5 Okt 2026, usulan)
  foodBudget: number; // alias to bahanBakuBudget
  heldBudget: number; // dana tertahan sementara (operasional + insentif bila Kuning/Merah)
  
  // Simulation metadata
  groundTruth: GroundTruth;
  
  // Computed live
  activeFlags: RedFlagCode[];
  triase: TriaseLabel;
  verificationDeadline: string; // e.g. "usulan 3 hari kerja" (Kuning), "usulan 5 hari kerja" (Merah)
  recommendationAction: string; // e.g. "Verifikasi lapangan"
  verificationStatus: 'Mesin Aturan' | 'Menunggu Verifikator' | 'Verifikasi Lapangan' | 'Selesai';
}

export interface SimulationParameters {
  tolR5: number; // 5 - 30%, default 10
  tolR4a: number; // 0 - 15%, default 0
  paguBahan: number; // default 10000, label "perlu dicek ke juknis"
  enableR3Tahap1: boolean; // default false: "Pindahkan R3 ke Tahap 1 (bila data penetapan penerima sudah digital)"
  propProblematic: number; // 2 - 10%, default 4
  propHonestError: number; // 3 - 15%, default 8
  fieldCapacity: number; // 50 - 500, default 150
}

export interface SimulationMetrics {
  total: number;
  hijauCount: number;
  kuningCount: number;
  merahCount: number;
  flaggedCount: number;
  falsePositivesCount: number;
  falsePositiveRate: number;
  falseNegativesCount: number;
  falseNegativeRate: number;
  falseNegativesOverHijauRate: number;
  sensitivity: number;
  specificity: number;
  precisionBaseRate: number;
  withheldTotal: number;
  totalRequested: number;
  fieldBurden: number; // Beban lapangan (Merah)
  docReviewBurden: number; // Beban reviu dokumen (Kuning)
  burdenPercent: number; // Merah / fieldCapacity * 100
  isOverCapacity: boolean; // Merah > fieldCapacity
  capacity: number;
  medianDaysKuning: number;
  medianDaysMerah: number;
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
