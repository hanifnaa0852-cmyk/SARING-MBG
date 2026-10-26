/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Kitchen,
  Region,
  TargetGroup,
  KitchenStatus,
  GroundTruth,
  SimulationParameters,
  RedFlagCode,
  TriaseLabel,
  DailyFinancial,
  SimulationMetrics
} from '../types';

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  tolR5: 10,
  tolR4a: 0,
  paguBahan: 10000,
  enableR3Tahap1: false,
  propProblematic: 4, // 2-10%, default 4%
  propHonestError: 8, // 3-15%, default 8%
  fieldCapacity: 150, // 50-500, default 150
};

// Deterministic Pseudo-Random Generator (Mulberry32)
function createRng(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REGIONS: Region[] = ['Wilayah A', 'Wilayah B', 'Wilayah C'];

const PARTNER_NAMES = [
  'Yayasan Contoh Pangan Sehat',
  'Yayasan Contoh Nutrisi Bangsa',
  'Yayasan Contoh Mitra MBG',
  'Yayasan Contoh Berkah Gizi',
  'Yayasan Contoh Peduli Anak'
];

/**
 * Generate 500 synthetic kitchens for Minggu 4 (current gate run)
 * Single source of truth across all prototype pages.
 */
export function generateSyntheticKitchens(
  params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS,
  weekIndex: number = 4
): Kitchen[] {
  const rng = createRng(42 + weekIndex * 1337);
  const kitchens: Kitchen[] = [];

  const totalKitchens = 500;
  const numProblematic = Math.round(totalKitchens * (params.propProblematic / 100)); // ~20 at 4%
  const numHonestError = Math.round(totalKitchens * (params.propHonestError / 100)); // ~40 at 8%

  // Determine ground truths in a reproducible shuffled manner
  const groundTruths: GroundTruth[] = [];
  for (let i = 0; i < numProblematic; i++) groundTruths.push('problematic');
  for (let i = 0; i < numHonestError; i++) groundTruths.push('honest_error');
  while (groundTruths.length < totalKitchens) groundTruths.push('normal');

  // Shuffle ground truths deterministically
  for (let i = groundTruths.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [groundTruths[i], groundTruths[j]] = [groundTruths[j], groundTruths[i]];
  }

  // Pin key representative showcase examples to fixed IDs
  // SPPG Contoh 087 -> problematic with R4a + R5 (Merah)
  // SPPG Contoh 014 -> problematic with R2 (Merah: belum beroperasi/suspend/belum SLHS)
  // SPPG Contoh 045 -> problematic with R1 (Merah: VA ganda)
  // SPPG Contoh 028 -> problematic with subtle drift below tolerance (Negatif Palsu -> Hijau)
  // SPPG Contoh 070 -> problematic with subtle drift below tolerance (Negatif Palsu -> Hijau)
  // SPPG Contoh 156 -> honest_error (Kuning: R4a alone)
  // SPPG Contoh 212 -> honest_error (Kuning: R5 alone)
  // SPPG Contoh 092 -> honest_error (Kuning)
  // SPPG Contoh 188 -> honest_error (Kuning)
  // SPPG Contoh 301, 302, 303 -> normal (Hijau)
  const pinIndex = (idNum: number, truth: GroundTruth) => {
    const idx = idNum - 1;
    const oldTruth = groundTruths[idx];
    groundTruths[idx] = truth;
    const swapIdx = groundTruths.findIndex((t, i) => i !== idx && t === truth);
    if (swapIdx !== -1) groundTruths[swapIdx] = oldTruth;
  };

  pinIndex(87, 'problematic');
  pinIndex(14, 'problematic');
  pinIndex(45, 'problematic');
  pinIndex(28, 'problematic'); // subtle drift -> produces false negative when tolerance >= 10%
  pinIndex(70, 'problematic'); // subtle drift -> produces false negative when tolerance >= 8%
  pinIndex(156, 'honest_error');
  pinIndex(212, 'honest_error');
  pinIndex(92, 'honest_error');
  pinIndex(188, 'honest_error');
  pinIndex(301, 'normal');
  pinIndex(302, 'normal');
  pinIndex(303, 'normal');

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const dateLabels = [
    'Senin (Minggu 4)',
    'Selasa (Minggu 4)',
    'Rabu (Minggu 4)',
    'Kamis (Minggu 4)',
    'Jumat (Minggu 4)',
    'Sabtu (Minggu 4)'
  ];

  for (let i = 1; i <= totalKitchens; i++) {
    const idNum = i;
    const idStr = String(idNum).padStart(3, '0');
    const truth = groundTruths[i - 1];

    const region: Region = REGIONS[(idNum - 1) % REGIONS.length];
    const id = `SPPG Contoh ${idStr}`;
    const kitchenName = `SPPG Contoh ${idStr}`;
    const subdistrictNum = String((idNum % 25) + 1).padStart(2, '0');
    const location = `Kecamatan ${subdistrictNum}, ${region}`;
    const partner = PARTNER_NAMES[(idNum - 1) % PARTNER_NAMES.length];

    const targetGroup: TargetGroup = rng() > 0.4 ? 'SD' : 'SMP';
    // Single editable parameter: Pagu bahan per porsi (default Rp10.000, label "perlu dicek ke juknis")
    const paguPerPorsi = params.paguBahan || 10000;
    const capacityPortions = 1800 + Math.floor(rng() * 1400); // 1.800 - 3.200
    const capacityLabel = `${capacityPortions.toLocaleString('id-ID')} porsi/hari`;

    let activeVaCount = 1;
    let status: KitchenStatus = 'beroperasi';
    let baseBahanCost = Math.round(paguPerPorsi * (0.85 + (rng() * 0.1))); // Rp 8.500 - 9.500

    // Average daily spend ~Rp 18M - 28M
    const avgDailySpend = Math.round((capacityPortions * baseBahanCost * 1.33) / 100000) * 100000;
    let dailyFinancials: DailyFinancial[] = [];

    // Distinct profile setup
    if (idNum === 87) {
      // Benchmark flagship case: R4a (+12%) and R5 (34% gap) active together -> Merah
      baseBahanCost = 11200; // > pagu Rp10.000
      dailyFinancials = [
        { dayName: 'Senin', dateLabel: 'Senin (Minggu 4)', reportedSpend: 8200000, vaOutflow: 7800000, isAnomaly: false },
        { dayName: 'Selasa', dateLabel: 'Selasa (Minggu 4)', reportedSpend: 8100000, vaOutflow: 7900000, isAnomaly: false },
        { dayName: 'Rabu', dateLabel: 'Rabu (Minggu 4)', reportedSpend: 8400000, vaOutflow: 5200000, isAnomaly: true },
        { dayName: 'Kamis', dateLabel: 'Kamis (Minggu 4)', reportedSpend: 8000000, vaOutflow: 3100000, isAnomaly: true },
        { dayName: 'Jumat', dateLabel: 'Jumat (Minggu 4)', reportedSpend: 7900000, vaOutflow: 3800000, isAnomaly: true },
        { dayName: 'Sabtu', dateLabel: 'Sabtu (Minggu 4)', reportedSpend: 7600000, vaOutflow: 3800000, isAnomaly: true }
      ];
    } else if (idNum === 14) {
      // Benchmark flagship case: R2 (status belum beroperasi) -> Merah
      status = 'belum beroperasi';
      baseBahanCost = paguPerPorsi - 200;
      dailyFinancials = days.map((d, dIdx) => ({
        dayName: d,
        dateLabel: dateLabels[dIdx],
        reportedSpend: avgDailySpend,
        vaOutflow: Math.round(avgDailySpend * 0.88),
        isAnomaly: false
      }));
    } else if (idNum === 45) {
      // Benchmark flagship case: R1 (activeVaCount = 2) -> Merah
      activeVaCount = 2;
      baseBahanCost = paguPerPorsi - 100;
      dailyFinancials = days.map((d, dIdx) => ({
        dayName: d,
        dateLabel: dateLabels[dIdx],
        reportedSpend: avgDailySpend,
        vaOutflow: Math.round(avgDailySpend * 0.90),
        isAnomaly: false
      }));
    } else if (idNum === 156) {
      // Benchmark flagship case: R4a alone (+5%) -> Kuning
      baseBahanCost = 10500;
      dailyFinancials = days.map((d, dIdx) => ({
        dayName: d,
        dateLabel: dateLabels[dIdx],
        reportedSpend: avgDailySpend,
        vaOutflow: Math.round(avgDailySpend * 0.96),
        isAnomaly: false
      }));
    } else if (idNum === 212) {
      // Benchmark flagship case: R5 alone (16% gap) -> Kuning
      baseBahanCost = 9600;
      dailyFinancials = days.map((d, dIdx) => ({
        dayName: d,
        dateLabel: dateLabels[dIdx],
        reportedSpend: avgDailySpend,
        vaOutflow: Math.round(avgDailySpend * 0.84),
        isAnomaly: true
      }));
    } else if (truth === 'problematic') {
      // Continuous anomaly size generation for truly problematic kitchens:
      // R5 gap drawn from a wide continuous distribution (3% to 45% gap)
      // Some small (3-9%), some medium (10-25%), some large (25-45%)
      const r5GapRatio = 0.03 + (rng() * 0.42);
      // R4a overage drawn from wide continuous distribution (-5% to +27%)
      const r4aOverage = (rng() * 0.32) - 0.05;
      baseBahanCost = Math.round(paguPerPorsi * (1 + r4aOverage));

      if (rng() < 0.12) {
        activeVaCount = 2;
      }
      if (rng() < 0.12) {
        status = rng() > 0.5 ? 'belum beroperasi' : 'suspend';
      }

      dailyFinancials = days.map((d, dIdx) => {
        const rep = avgDailySpend + Math.floor((rng() - 0.5) * 500000);
        const dailyDrop = dIdx >= 3 ? (r5GapRatio * 1.8) : (r5GapRatio * 0.2);
        const va = Math.round(rep * (1 - Math.min(0.85, Math.max(0, dailyDrop))));
        return {
          dayName: d,
          dateLabel: dateLabels[dIdx],
          reportedSpend: rep,
          vaOutflow: va,
          isAnomaly: false
        };
      });
    } else if (truth === 'honest_error') {
      // Continuous anomaly size generation for honest-error kitchens:
      // R5 gap drawn from continuous distribution (4% to 26%)
      const r5GapRatio = 0.04 + (rng() * 0.22);
      // R4a overage drawn from -4% to +8%
      const r4aOverage = (rng() * 0.12) - 0.04;
      baseBahanCost = Math.round(paguPerPorsi * (1 + r4aOverage));

      dailyFinancials = days.map((d, dIdx) => {
        const rep = avgDailySpend + Math.floor((rng() - 0.5) * 400000);
        const dailyDrop = dIdx === 5 ? (r5GapRatio * 2.5) : (r5GapRatio * 0.4);
        const va = Math.round(rep * (1 - Math.min(0.85, Math.max(0, dailyDrop))));
        return {
          dayName: d,
          dateLabel: dateLabels[dIdx],
          reportedSpend: rep,
          vaOutflow: va,
          isAnomaly: false
        };
      });
    } else {
      // Normal kitchens: tight consistency, minimal natural friction (0.8% - 3.4% gap)
      const r5GapRatio = 0.008 + (rng() * 0.026);
      baseBahanCost = Math.round(paguPerPorsi * (0.87 + rng() * 0.08));
      dailyFinancials = days.map((d, dIdx) => {
        const rep = avgDailySpend + Math.floor((rng() - 0.5) * 300000);
        const va = Math.round(rep * (1 - (r5GapRatio * (0.8 + rng() * 0.4))));
        return {
          dayName: d,
          dateLabel: dateLabels[dIdx],
          reportedSpend: rep,
          vaOutflow: va,
          isAnomaly: false
        };
      });
    }

    const reportedSpendTotal = dailyFinancials.reduce((acc, curr) => acc + curr.reportedSpend, 0);
    const vaOutflowTotal = dailyFinancials.reduce((acc, curr) => acc + curr.vaOutflow, 0);
    const vaBalance = Math.round(80000000 + rng() * 140000000);

    // Weekly reported portions (6 days)
    const weeklyPortions = capacityPortions * 6;

    // TOP-UP COMPONENTS:
    // 1. Bahan baku: cost of ingredients (~75% of reported operational base)
    // 2. Operasional: operational expenses & cook fees (~25% of reported operational base)
    // 3. Insentif: Rp 2.000 per reported portion, effective 5 Oktober 2026 (usulan)
    const bahanBakuBudget = Math.round((reportedSpendTotal * 0.75) / 100000) * 100000;
    const operasionalBudget = Math.round((reportedSpendTotal * 0.25) / 100000) * 100000;
    const insentifBudget = weeklyPortions * 2000;
    const topUpRequested = bahanBakuBudget + operasionalBudget + insentifBudget;
    const foodBudget = bahanBakuBudget;

    // RULE ENGINE EVALUATION
    const activeFlags: RedFlagCode[] = [];

    // R1: Virtual Account ganda aktif
    if (activeVaCount > 1) {
      activeFlags.push('R1');
    }

    // R2: Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS
    if (status !== 'beroperasi') {
      activeFlags.push('R2');
    }

    // R3 (when enabled via toggle):
    // Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan
    if (params.enableR3Tahap1) {
      const hasR3Anomaly = (truth === 'problematic' && idNum % 3 === 0) || idNum === 87;
      if (hasR3Anomaly) {
        activeFlags.push('R3');
      }
    }

    // R4a: Biaya bahan di atas pagu bahan per porsi (+ toleransi)
    const maxAllowedCost = paguPerPorsi * (1 + params.tolR4a / 100);
    if (baseBahanCost > maxAllowedCost) {
      activeFlags.push('R4a');
    }

    // R5: Selisih relatif belanja dilaporkan vs arus keluar VA melebihi toleransi R5
    const gapPercent = Math.abs(reportedSpendTotal - vaOutflowTotal) / reportedSpendTotal;
    if (gapPercent > params.tolR5 / 100) {
      activeFlags.push('R5');
    }

    // Mark daily row anomalies consistently based on R5 tolerance
    dailyFinancials.forEach((d) => {
      const dayGap = Math.abs(d.reportedSpend - d.vaOutflow) / d.reportedSpend;
      d.isAnomaly = dayGap > params.tolR5 / 100;
    });

    // RULE TEXT & CLASSIFICATION (NO NUMERIC SCORES, NO REPUTATION HISTORY)
    // Merah: R1 or R2 active, or two or more of other flags active together (e.g. R4a and R5 active together).
    // Kuning: exactly one other flag active (e.g. R4a or R5 active alone).
    // Hijau: none.
    // Note: flags sharing the same source (laporan harian SPPG) active together only raise verification priority; they do not prove intent.
    const hasR1 = activeFlags.includes('R1');
    const hasR2 = activeFlags.includes('R2');
    const otherFlags = activeFlags.filter((f) => f !== 'R1' && f !== 'R2');

    let triase: TriaseLabel = 'Hijau';
    if (hasR1 || hasR2 || otherFlags.length >= 2) {
      triase = 'Merah';
    } else if (otherFlags.length === 1) {
      triase = 'Kuning';
    } else {
      triase = 'Hijau';
    }

    // TREATMENT:
    // Hijau: all three paid (bahan baku, operasional, insentif)
    // Kuning: bahan baku paid, operasional and insentif held pending written clarification (usulan 3 hari kerja)
    // Merah: only minimum bahan baku paid if kitchen is verified to exist and operate; operasional and insentif held; field verification by Verifikator BGN (usulan 5 hari kerja)
    let heldBudget = 0;
    let recommendationAction = 'Top-up penuh dicairkan (bahan baku, operasional, insentif)';
    let verificationDeadline = '-';

    if (triase === 'Merah') {
      if (status === 'beroperasi') {
        heldBudget = operasionalBudget + insentifBudget;
        recommendationAction = 'Bahan baku minimum dicairkan; operasional & insentif ditahan; verifikasi lapangan oleh Verifikator BGN (usulan 5 hari kerja); Inspektorat Utama BGN hanya mereviu eksepsi & menerima rujukan audit investigatif';
      } else {
        heldBudget = topUpRequested;
        recommendationAction = 'Top-up ditahan penuh: SPPG belum beroperasi / belum ber-SLHS; verifikasi lapangan oleh Verifikator BGN (usulan 5 hari kerja); Inspektorat Utama BGN hanya mereviu eksepsi & menerima rujukan audit investigatif';
      }
      verificationDeadline = 'usulan 5 hari kerja';
    } else if (triase === 'Kuning') {
      heldBudget = operasionalBudget + insentifBudget;
      recommendationAction = 'Bahan baku dicairkan; operasional & insentif ditahan sementara menunggu klarifikasi tertulis (usulan 3 hari kerja)';
      verificationDeadline = 'usulan 3 hari kerja';
    }

    kitchens.push({
      id,
      name: kitchenName,
      region,
      location,
      partner,
      capacity: capacityPortions,
      capacityLabel,
      targetGroup,
      paguPerPorsi,
      activeVaCount,
      status,
      reportedCostPerPortion: baseBahanCost,
      dailyFinancials,
      reportedSpendTotal,
      vaOutflowTotal,
      vaBalance,
      weeklyPortions,
      topUpRequested,
      bahanBakuBudget,
      operasionalBudget,
      insentifBudget,
      foodBudget,
      heldBudget,
      groundTruth: truth,
      activeFlags,
      triase,
      verificationDeadline,
      recommendationAction,
      verificationStatus: 'Mesin Aturan'
    });
  }

  return kitchens;
}

/**
 * Helper to compute median of a numeric array
 */
function computeMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Historical stacked data for Minggu 1 - Minggu 4
 * Single source of truth: Minggu 1 to 3 generated with the same seeded engine and a different seed per week.
 * Minggu 4 reads live from current simulation state.
 * All weeks strictly sum to 500 kitchens.
 */
export function getHistoricalWeeksSummary(
  week4Kitchens: Kitchen[],
  params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS
) {
  const total = 500;
  const w1Kitchens = generateSyntheticKitchens(params, 1);
  const w2Kitchens = generateSyntheticKitchens(params, 2);
  const w3Kitchens = generateSyntheticKitchens(params, 3);

  const w1Hijau = w1Kitchens.filter((k) => k.triase === 'Hijau').length;
  const w1Kuning = w1Kitchens.filter((k) => k.triase === 'Kuning').length;
  const w1Merah = w1Kitchens.filter((k) => k.triase === 'Merah').length;

  const w2Hijau = w2Kitchens.filter((k) => k.triase === 'Hijau').length;
  const w2Kuning = w2Kitchens.filter((k) => k.triase === 'Kuning').length;
  const w2Merah = w2Kitchens.filter((k) => k.triase === 'Merah').length;

  const w3Hijau = w3Kitchens.filter((k) => k.triase === 'Hijau').length;
  const w3Kuning = w3Kitchens.filter((k) => k.triase === 'Kuning').length;
  const w3Merah = w3Kitchens.filter((k) => k.triase === 'Merah').length;

  const w4Hijau = week4Kitchens.filter((k) => k.triase === 'Hijau').length;
  const w4Kuning = week4Kitchens.filter((k) => k.triase === 'Kuning').length;
  const w4Merah = week4Kitchens.filter((k) => k.triase === 'Merah').length;

  return [
    { week: 'Minggu 1', label: 'Minggu 1', hijau: w1Hijau, kuning: w1Kuning, merah: w1Merah, total, active: false },
    { week: 'Minggu 2', label: 'Minggu 2', hijau: w2Hijau, kuning: w2Kuning, merah: w2Merah, total, active: false },
    { week: 'Minggu 3', label: 'Minggu 3', hijau: w3Hijau, kuning: w3Kuning, merah: w3Merah, total, active: false },
    { week: 'Minggu 4', label: 'Minggu 4 (Aktif)', hijau: w4Hijau, kuning: w4Kuning, merah: w4Merah, total, active: true },
  ];
}

/**
 * Computes simulation metrics: FP, FN, Capacity, Withheld Funds, and Presisi (Base Rate)
 */
export function computeSimulationMetrics(kitchens: Kitchen[], params: SimulationParameters): SimulationMetrics {
  const total = kitchens.length;
  const hijau = kitchens.filter((k) => k.triase === 'Hijau');
  const kuning = kitchens.filter((k) => k.triase === 'Kuning');
  const merah = kitchens.filter((k) => k.triase === 'Merah');
  const flagged = kitchens.filter((k) => k.triase !== 'Hijau');

  // Ground truth check
  const trulyProblematic = kitchens.filter((k) => k.groundTruth === 'problematic');
  const nonProblematic = kitchens.filter((k) => k.groundTruth !== 'problematic');

  // Problematic kitchens labeled Hijau = Negatif Palsu (Type II error)
  const falseNegatives = trulyProblematic.filter((k) => k.triase === 'Hijau');

  // Flagged kitchens that are NOT problematic (honest_error or normal) = Positif Palsu (Type I error)
  const falsePositives = flagged.filter((k) => k.groundTruth !== 'problematic');

  const falsePositiveRate = flagged.length > 0 ? (falsePositives.length / flagged.length) * 100 : 0;
  const falseNegativeRate = total > 0 ? (falseNegatives.length / total) * 100 : 0;
  const falseNegativesOverHijauRate = hijau.length > 0 ? (falseNegatives.length / hijau.length) * 100 : 0;

  // Sensitivity s: share of truly problematic kitchens flagged (triase !== 'Hijau')
  const trulyProblematicFlagged = trulyProblematic.filter((k) => k.triase !== 'Hijau');
  const sensitivity = trulyProblematic.length > 0 ? (trulyProblematicFlagged.length / trulyProblematic.length) : 1;

  // Specificity k: share of non-problematic kitchens not flagged (triase === 'Hijau')
  const nonProblematicNotFlagged = nonProblematic.filter((k) => k.triase === 'Hijau');
  const specificity = nonProblematic.length > 0 ? (nonProblematicNotFlagged.length / nonProblematic.length) : 1;

  // p = proportion of truly problematic kitchens (from slider parameter)
  const p = params.propProblematic / 100;

  // Presisi (Base Rate): p*s / (p*s + (1-p)*(1-k))
  const precisionNumerator = p * sensitivity;
  const precisionDenominator = (p * sensitivity) + ((1 - p) * (1 - specificity));
  const precisionBaseRate = precisionDenominator > 0 ? (precisionNumerator / precisionDenominator) * 100 : 0;

  // Dana tertahan (operasional + insentif yang ditahan pada Minggu 4 untuk dapur Merah dan Kuning, atau top-up penuh bila belum beroperasi/suspend)
  const withheldTotal = flagged.reduce((acc, k) => acc + k.heldBudget, 0);
  const totalRequested = kitchens.reduce((acc, k) => acc + k.topUpRequested, 0);

  // Beban Lapangan (Merah) vs Kapasitas & Beban Reviu Dokumen (Kuning)
  const fieldBurden = merah.length; // Only Merah requires field verification
  const docReviewBurden = kuning.length; // Kuning requires written document clarification
  const burdenPercent = params.fieldCapacity > 0 ? (fieldBurden / params.fieldCapacity) * 100 : 0;
  const isOverCapacity = fieldBurden > params.fieldCapacity;

  // Draw verification durations per case from distribution (asumsi simulasi)
  // Kuning: klarifikasi dokumen 1-3 hari kerja (rata-rata ~2.1)
  const kuningDurations = kuning.map((k) => 1.4 + ((k.id.charCodeAt(k.id.length - 1) * 7) % 15) / 10);
  // Merah: verifikasi lapangan fisik 3-5 hari kerja (rata-rata ~3.8)
  const merahDurations = merah.map((k) => 2.6 + ((k.id.charCodeAt(k.id.length - 1) * 11) % 25) / 10);

  const medianDaysKuning = kuningDurations.length > 0 ? Number(computeMedian(kuningDurations).toFixed(1)) : 2.1;
  const medianDaysMerah = merahDurations.length > 0 ? Number(computeMedian(merahDurations).toFixed(1)) : 3.8;

  return {
    total,
    hijauCount: hijau.length,
    kuningCount: kuning.length,
    merahCount: merah.length,
    flaggedCount: flagged.length,
    falsePositivesCount: falsePositives.length,
    falsePositiveRate,
    falseNegativesCount: falseNegatives.length,
    falseNegativeRate,
    falseNegativesOverHijauRate,
    sensitivity: sensitivity * 100,
    specificity: specificity * 100,
    precisionBaseRate,
    withheldTotal,
    totalRequested,
    fieldBurden,
    docReviewBurden,
    burdenPercent,
    isOverCapacity,
    capacity: params.fieldCapacity,
    medianDaysKuning,
    medianDaysMerah
  };
}

/**
 * Pre-computes trade-off curve points across R5 tolerance [5, 10, 15, 20, 25, 30]
 * Uses identical metric computation engine so active point matches cards exactly.
 */
export function computeTradeOffCurve(baseParams: SimulationParameters) {
  const testTolerances = [5, 10, 15, 20, 25, 30];
  return testTolerances.map((tolR5) => {
    const testParams = { ...baseParams, tolR5 };
    const simulated = generateSyntheticKitchens(testParams, 4);
    const metrics = computeSimulationMetrics(simulated, testParams);
    return {
      tolR5,
      falsePositiveRate: Number(metrics.falsePositiveRate.toFixed(1)),
      falseNegativeRate: Number(metrics.falseNegativeRate.toFixed(1)),
      flaggedCount: metrics.flaggedCount,
      withheldTotal: metrics.withheldTotal
    };
  });
}
