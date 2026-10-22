/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Region =
  | 'Jawa Barat'
  | 'Jawa Tengah'
  | 'Jawa Timur'
  | 'DKI Jakarta'
  | 'Banten'
  | 'Sumatera Utara';

export type TargetGroup = 'SD' | 'SMP';

export type KitchenStatus = 'beroperasi' | 'belum beroperasi' | 'suspend';

export type GroundTruth = 'problematic' | 'honest_error' | 'normal';

export type TriaseLabel = 'Hijau' | 'Kuning' | 'Merah';

export type RedFlagCode = 'R1' | 'R2' | 'R4a' | 'R5';

export interface DailyFinancial {
  dayName: string; // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  dateLabel: string; // 'Senin, 20 Jan'
  reportedSpend: number; // in Rupiah
  vaOutflow: number; // in Rupiah
  isAnomaly: boolean;
}

export interface Kitchen {
  id: string; // e.g. "SPPG Banyumas 087"
  name: string; // e.g. "SPPG Purwokerto Timur 087"
  region: Region;
  location: string; // e.g. "Kab. Banyumas, Wilayah B"
  partner: string; // e.g. "Koperasi Mitra MBG Bersama"
  capacity: number; // portions/day, e.g. 2450
  capacityLabel: string; // "2.450 porsi/hari (3 SD)"
  targetGroup: TargetGroup;
  paguPerPorsi: number; // Rp 8.000 for SD, Rp 10.000 for SMP
  activeVaCount: number; // 1 for normal, >1 for duplicate
  status: KitchenStatus;
  reportedCostPerPortion: number; // Rp 7.500 - 9.800
  dailyFinancials: DailyFinancial[];
  reportedSpendTotal: number; // sum of 6 days
  vaOutflowTotal: number; // sum of 6 days
  vaBalance: number; // e.g. Rp 120.000.000 (cap Rp 500 juta context)
  topUpRequested: number; // e.g. Rp 48.200.000
  foodBudget: number; // 80% (tetap cair)
  heldBudget: number; // 20% (ditahan jika Kuning/Merah)
  
  // Simulation metadata
  groundTruth: GroundTruth;
  
  // Computed live
  activeFlags: RedFlagCode[];
  triase: TriaseLabel;
  verificationDeadline: string; // e.g. "4 hari kerja tersisa"
  recommendationAction: string; // e.g. "Verifikasi lapangan"
  verificationStatus: 'Mesin Aturan' | 'Menunggu Verifikator' | 'Verifikasi Lapangan' | 'Selesai';
}

export interface SimulationParameters {
  tolR5: number; // 5 - 30%, default 10
  tolR4a: number; // 0 - 15%, default 0
  propProblematic: number; // 2 - 10%, default 4
  propHonestError: number; // 3 - 15%, default 8
  fieldCapacity: number; // 50 - 500, default 150
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
