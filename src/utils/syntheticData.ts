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
  SimulationMetrics,
  DecisionLogEntry
} from '../types';

export const DEFAULT_SIMULATION_PARAMETERS: SimulationParameters = {
  mode: 'tahap1', // "Tahap 1 saja (rancangan pilot: R1, R2, R3)" [default]
  tolR3: 5, // 0 - 20%, default 5%
  tolR4: 0, // 0 - 15%, default 0%
  tolR5: 10, // 5 - 30%, default 10%
  hargaAcuan: 10000, // default Rp10.000, label "perlu dicek ke juknis"
  operasionalShare: 20, // default 20%, label "asumsi simulasi"
  propProblematic: 4, // 2 - 10%, default 4%
  propHonestError: 8, // 3 - 15%, default 8%
  fieldCapacity: 150, // 50 - 500, default 150 (label: "asumsi: jumlah verifikator BGN belum diketahui")
  docReviewCapacity: 600, // default 600 (label: "asumsi")
};

// Deterministic Mulberry32 RNG
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
 * Generate 500 synthetic kitchens with persistent state across Minggu 1 to 4.
 * Core inputs:
 * - Laporan harian SIPGN (Senin-Sabtu)
 * - Status SPPG (beroperasi, suspend, SLHS)
 * - Mutasi VA Himbara (Tahap 2)
 */
export function generateSyntheticKitchens(
  params: SimulationParameters = DEFAULT_SIMULATION_PARAMETERS,
  targetWeek: number = 4
): Kitchen[] {
  const totalKitchens = 500;
  const numProblematic = Math.round(totalKitchens * (params.propProblematic / 100)); // default ~20
  const numHonestError = Math.round(totalKitchens * (params.propHonestError / 100)); // default ~40

  // Ground truths array deterministically seeded from base seed
  const baseRng = createRng(1001);
  const groundTruths: GroundTruth[] = [];
  for (let i = 0; i < numProblematic; i++) groundTruths.push('problematic');
  for (let i = 0; i < numHonestError; i++) groundTruths.push('honest_error');
  while (groundTruths.length < totalKitchens) groundTruths.push('normal');

  for (let i = groundTruths.length - 1; i > 0; i--) {
    const j = Math.floor(baseRng() * (i + 1));
    [groundTruths[i], groundTruths[j]] = [groundTruths[j], groundTruths[i]];
  }

  // Pin key representative showcase examples
  const pinIndex = (idNum: number, truth: GroundTruth) => {
    const idx = idNum - 1;
    const oldTruth = groundTruths[idx];
    groundTruths[idx] = truth;
    const swapIdx = groundTruths.findIndex((t, i) => i !== idx && t === truth);
    if (swapIdx !== -1) groundTruths[swapIdx] = oldTruth;
  };

  pinIndex(87, 'problematic'); // SPPG 087: Problematic flagship case
  pinIndex(14, 'problematic'); // SPPG 014: Status belum beroperasi / tanpa SLHS -> R2
  pinIndex(45, 'problematic'); // SPPG 045: VA Ganda -> R1
  pinIndex(63, 'problematic'); // SPPG 063: Kuning 2 siklus berturut-turut -> Merah
  pinIndex(28, 'problematic'); // SPPG 028: Drift halus lolos ambang -> Negatif Palsu (Hijau)
  pinIndex(70, 'problematic'); // SPPG 070: Drift halus lolos ambang -> Negatif Palsu (Hijau)
  pinIndex(156, 'honest_error'); // SPPG 156: Salah ketik biaya bahan -> R4 / R3
  pinIndex(212, 'honest_error'); // SPPG 212: Transmisi nota terlambat / R5 alone
  pinIndex(92, 'honest_error');  // SPPG 092: Kelebihan porsi ringan -> R3 alone
  pinIndex(188, 'honest_error'); // SPPG 188: Salah ketik administrasi
  pinIndex(301, 'normal');
  pinIndex(302, 'normal');
  pinIndex(303, 'normal');

  // Multi-week simulation storage: track prior week status for Kuning 2-cycle rule
  // Week 3 states to determine Week 4 consecutive Kuning rule
  const prevWeekKuningMap: Record<number, boolean> = {};
  const prevWeekClarificationAccepted: Record<number, boolean> = {};

  // Simulate persistent history for week 1, 2, 3
  for (let w = 1; w <= 3; w++) {
    const wRng = createRng(2000 + w * 777);
    for (let i = 1; i <= totalKitchens; i++) {
      const truth = groundTruths[i - 1];
      let wasKuning = false;
      if (truth === 'problematic') {
        wasKuning = wRng() < 0.40;
      } else if (truth === 'honest_error') {
        wasKuning = wRng() < 0.65;
      } else {
        wasKuning = wRng() < 0.04;
      }

      if (i === 63) {
        // Explicitly set SPPG 063 as Kuning in week 3 with unaccepted clarification
        wasKuning = true;
      }

      if (w === 3) {
        prevWeekKuningMap[i] = wasKuning;
        // Honest error clarifications accepted with high probability (85%), problematic rarely (15%)
        if (i === 63) {
          prevWeekClarificationAccepted[i] = false;
        } else if (truth === 'honest_error') {
          prevWeekClarificationAccepted[i] = wRng() < 0.85;
        } else if (truth === 'problematic') {
          prevWeekClarificationAccepted[i] = wRng() < 0.15;
        } else {
          prevWeekClarificationAccepted[i] = true;
        }
      }
    }
  }

  // Generate target week
  const rng = createRng(42 + targetWeek * 1337);
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const kitchens: Kitchen[] = [];

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

    // Master data
    const penerimaSinkronisasi = 1800 + Math.floor(rng() * 1200); // 1.800 - 3.000 porsi per hari
    const capacityLabel = `${penerimaSinkronisasi.toLocaleString('id-ID')} porsi/hari`;
    const hargaAcuan = params.hargaAcuan || 10000;

    let activeVaCount = 1;
    let status: KitchenStatus = 'beroperasi';
    let hasSLHS = true;
    let hariTanpaLayanan = false;

    // Continuous deviation generation
    let porsiFactor = 0.98 + rng() * 0.03; // normal: ~98% - 101% of synced recipients
    let bahanCostFactor = 0.88 + rng() * 0.08; // normal: Rp 8.800 - 9.600
    let vaGapFactor = 0.01 + rng() * 0.025; // normal: 1% - 3.5% gap
    let schoolDiff = 0; // for R8

    // R8 sampling: 10% random school-confirmation sample
    const schoolConfirmationSampled = rng() < 0.10;

    // Consecutive cycle tracking
    const prevWeekKuning = targetWeek === 4 ? Boolean(prevWeekKuningMap[i]) : false;
    const clarificationAccepted = targetWeek === 4 ? Boolean(prevWeekClarificationAccepted[i]) : true;

    // Specific deterministic case configurations
    if (idNum === 87) {
      // Benchmark: Problematic with R3, R4, R5 active together
      porsiFactor = 1.18; // 18% over synced recipients -> R3
      bahanCostFactor = 1.12; // Rp 11.200 (> Rp 10.000) -> R4
      vaGapFactor = 0.32; // 32% gap -> R5
    } else if (idNum === 14) {
      // Benchmark: R2 (status belum beroperasi & belum SLHS)
      status = 'belum beroperasi';
      hasSLHS = false;
    } else if (idNum === 45) {
      // Benchmark: R1 (2 VA aktif)
      activeVaCount = 2;
    } else if (idNum === 63) {
      // Benchmark: Kuning 2 siklus berturut-turut tanpa klarifikasi diterima -> Merah
      porsiFactor = 1.07; // mild R3 in both weeks
      // prevWeekKuning is true, clarificationAccepted is false
    } else if (idNum === 156) {
      // Benchmark: Honest error with R4 alone (+6%)
      bahanCostFactor = 1.06;
      porsiFactor = 1.00;
      vaGapFactor = 0.03;
    } else if (idNum === 212) {
      // Benchmark: Honest error with R5 alone (17% gap)
      vaGapFactor = 0.17;
      bahanCostFactor = 0.94;
    } else if (idNum === 92) {
      // Benchmark: Honest error with R3 alone (+9%)
      porsiFactor = 1.09;
      bahanCostFactor = 0.95;
      vaGapFactor = 0.03;
    } else if (idNum === 28 || idNum === 70) {
      // Problematic with subtle anomaly below thresholds -> Negatif Palsu (Hijau)
      porsiFactor = 1.03; // below 5% tolerance
      bahanCostFactor = 0.98; // below tolerance
      vaGapFactor = 0.06; // below 10% tolerance
    } else if (truth === 'problematic') {
      // Wide continuous distribution for truly problematic kitchens
      porsiFactor = 0.95 + rng() * 0.35; // 0.95 - 1.30
      bahanCostFactor = 0.90 + rng() * 0.32; // 0.90 - 1.22
      vaGapFactor = 0.03 + rng() * 0.40; // 3% - 43% gap

      if (rng() < 0.10) activeVaCount = 2; // R1 trigger
      if (rng() < 0.08) {
        status = rng() > 0.5 ? 'belum beroperasi' : 'suspend';
        hasSLHS = rng() > 0.5;
      }
      if (rng() < 0.12) hariTanpaLayanan = true;
      if (schoolConfirmationSampled && rng() < 0.45) schoolDiff = 0.15 + rng() * 0.25;
    } else if (truth === 'honest_error') {
      // Honest error deviations
      porsiFactor = 0.97 + rng() * 0.18; // 0.97 - 1.15
      bahanCostFactor = 0.90 + rng() * 0.18; // 0.90 - 1.08
      vaGapFactor = 0.03 + rng() * 0.22; // 3% - 25% gap
      if (rng() < 0.06) hariTanpaLayanan = true;
      if (schoolConfirmationSampled && rng() < 0.20) schoolDiff = 0.11 + rng() * 0.08;
    }

    // Daily reporting (Senin - Sabtu)
    const porsiDilaporkan = days.map((d, dIdx) => {
      // Non-service day check
      if (hariTanpaLayanan && dIdx === 5) {
        return Math.round(penerimaSinkronisasi * 0.9);
      }
      const dayVariation = 0.96 + rng() * 0.08;
      return Math.round(penerimaSinkronisasi * porsiFactor * dayVariation);
    });

    const totalPorsiDilaporkan = porsiDilaporkan.reduce((acc, p) => acc + p, 0);
    const biayaBahanPerPorsi = Math.round(hargaAcuan * bahanCostFactor);

    // Financial numbers
    // Top-up = reported spend
    const dailyReportedSpends = porsiDilaporkan.map((porsi) => {
      return Math.round((porsi * biayaBahanPerPorsi * 1.25) / 1000) * 1000;
    });

    const reportedSpendTotal = dailyReportedSpends.reduce((a, b) => a + b, 0);
    const vaOutflowTotal = Math.round(reportedSpendTotal * (1 - Math.min(0.85, vaGapFactor)));
    const saldoVa = Math.round(40000000 + rng() * 120000000); // Rp 40M - 160M

    const dailyFinancials: DailyFinancial[] = days.map((d, dIdx) => {
      const rep = dailyReportedSpends[dIdx];
      const vaRatio = (dIdx === 4 || dIdx === 5) ? (1 - vaGapFactor * 1.5) : (1 - vaGapFactor * 0.6);
      const va = Math.round(rep * Math.max(0.15, vaRatio));
      const dayGap = Math.abs(rep - va) / rep;
      return {
        dayName: d,
        dateLabel: `${d} (Minggu ${targetWeek})`,
        reportedSpend: rep,
        vaOutflow: va,
        isAnomaly: dayGap > params.tolR5 / 100
      };
    });

    // TWO COMPONENTS ONLY:
    // Bahan baku & operasional (operasional share default 20%, editable assumption)
    const operasionalSharePct = params.operasionalShare || 20;
    const operasionalBudget = Math.round((reportedSpendTotal * (operasionalSharePct / 100)) / 100000) * 100000;
    const bahanBakuBudget = reportedSpendTotal - operasionalBudget;
    const topUpRequested = bahanBakuBudget + operasionalBudget;
    const foodBudget = bahanBakuBudget;

    // School confirmation for R8
    const schoolConfirmedPortions = schoolConfirmationSampled
      ? Math.round(totalPorsiDilaporkan * (1 - schoolDiff))
      : undefined;

    // RED FLAG EVALUATION
    // Lapis 1 (Master Data): R1, R2
    // Lapis 2 (Laporan Mingguan): R3 first, then R4, R5, R8
    // Mode Switch:
    // Tahap 1 saja (rancangan pilot): R1, R2, R3
    // Tahap 1 + 2: R1, R2, R3, R4, R5, R8
    const activeFlags: RedFlagCode[] = [];

    // R1: Satu dapur, alamat, atau penanggung jawab memegang lebih dari satu VA aktif
    if (activeVaCount > 1) {
      activeFlags.push('R1');
    }

    // R2: Top-up untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS
    if (status !== 'beroperasi' || !hasSLHS) {
      activeFlags.push('R2');
    }

    // R3: Porsi harian melebihi penerima hasil sinkronisasi, atau dilaporkan pada hari tanpa layanan
    const maxDayPortion = Math.max(...porsiDilaporkan);
    const r3Limit = penerimaSinkronisasi * (1 + params.tolR3 / 100);
    if (maxDayPortion > r3Limit || hariTanpaLayanan) {
      activeFlags.push('R3');
    }

    // Mode 'tahap1_2' enables R4, R5, R8
    if (params.mode === 'tahap1_2') {
      // R4: Biaya bahan per porsi melebihi HET atau survei pasar (+ toleransi)
      const r4Limit = hargaAcuan * (1 + params.tolR4 / 100);
      if (biayaBahanPerPorsi > r4Limit) {
        activeFlags.push('R4');
      }

      // R5: Pemakaian yang dilaporkan tidak sejalan dengan arus keluar VA
      const gapPercent = Math.abs(reportedSpendTotal - vaOutflowTotal) / reportedSpendTotal;
      if (gapPercent > params.tolR5 / 100) {
        activeFlags.push('R5');
      }

      // R8: Porsi berbeda dengan konfirmasi sekolah atau posyandu (sampel acak 10%)
      if (schoolConfirmationSampled && schoolDiff > 0.10) {
        activeFlags.push('R8');
      }
    }

    // LABEL RULE (EXACT ESSAY DEFINITION; NO SCORES OR WEIGHTS)
    // Merah:
    // 1) R1 or R2 active;
    // 2) OR R5 active together with R3 or R4 (only in tahap1_2);
    // 3) OR the kitchen was Kuning two consecutive cycles without an accepted clarification.
    // Kuning:
    // Any one of R3, R4, R5, R8 active without a Merah condition.
    // Hijau:
    // No red flag active.
    const hasR1 = activeFlags.includes('R1');
    const hasR2 = activeFlags.includes('R2');
    const hasR3 = activeFlags.includes('R3');
    const hasR4 = activeFlags.includes('R4');
    const hasR5 = activeFlags.includes('R5');
    const hasR8 = activeFlags.includes('R8');

    const consecutiveKuningMerah = prevWeekKuning && !clarificationAccepted && (activeFlags.length > 0 || idNum === 63);

    let triase: TriaseLabel = 'Hijau';
    let triggerReason = 'Tidak ada red flag aktif; seluruh parameter lolos';

    if (hasR1) {
      triase = 'Merah';
      triggerReason = 'R1 aktif (satu dapur memegang lebih dari 1 VA aktif)';
    } else if (hasR2) {
      triase = 'Merah';
      triggerReason = 'R2 aktif (SPPG belum beroperasi, disuspend, atau belum ber-SLHS)';
    } else if (hasR5 && (hasR3 || hasR4)) {
      triase = 'Merah';
      triggerReason = hasR3 && hasR4
        ? 'R5 + R3 + R4 aktif bersamaan (selisih VA dan deviasi laporan harian)'
        : hasR3
        ? 'R5 + R3 aktif bersamaan (selisih mutasi VA dan kelebihan porsi)'
        : 'R5 + R4 aktif bersamaan (selisih mutasi VA dan biaya di atas acuan)';
    } else if (consecutiveKuningMerah) {
      triase = 'Merah';
      triggerReason = 'Kuning 2 siklus berturut-turut tanpa klarifikasi tertulis yang diterima';
    } else if (hasR3 || hasR4 || hasR5 || hasR8) {
      triase = 'Kuning';
      const triggered = activeFlags.filter(f => ['R3', 'R4', 'R5', 'R8'].includes(f));
      triggerReason = `${triggered.join(', ')} aktif (indikator tunggal tanpa kondisi Merah)`;
    } else {
      triase = 'Hijau';
      triggerReason = 'Tidak ada red flag aktif';
    }

    // TREATMENT PER LABEL (EXACT ESSAY DEFINITION)
    // Hijau: top-up penuh sesuai jadwal; a random sample of Hijau kitchens is audited each week without notice.
    // Kuning: bahan baku tetap cair; operasional ditahan sampai klarifikasi tertulis selesai, paling lama 3 hari kerja;
    //         the held component is paid together with the next week's SPP; if clarification is late because of verifikator, operasional is released without waiting.
    // Merah: bahan baku only for the penerima hasil sinkronisasi, and only if the remaining VA balance is not enough until the next SPP;
    //        waits for verifikasi lapangan, paling lama 4 hari kerja; held components are paid together with the next week's SPP;
    //        NO automatic release exception, and a late verification is reported to Inspektorat Utama. A kitchen that does not exist receives no funds.
    let heldBudget = 0;
    let paidBahanBaku = 0;
    let paidOperasional = 0;
    let recommendationAction = '';
    let verificationDeadline = '-';

    if (triase === 'Hijau') {
      paidBahanBaku = bahanBakuBudget;
      paidOperasional = operasionalBudget;
      heldBudget = 0;
      recommendationAction = 'Top-up penuh dicairkan sesuai jadwal; sampel acak dapur Hijau diaudit setiap minggu tanpa pemberitahuan';
      verificationDeadline = '-';
    } else if (triase === 'Kuning') {
      paidBahanBaku = bahanBakuBudget;
      paidOperasional = 0;
      heldBudget = operasionalBudget;
      recommendationAction = 'Bahan baku tetap cair; operasional ditahan sampai klarifikasi tertulis selesai (usulan maks. 3 hari kerja); dibayarkan pada SPP minggu berikutnya';
      verificationDeadline = 'usulan 3 hari kerja';
    } else if (triase === 'Merah') {
      verificationDeadline = 'usulan 4 hari kerja';
      if (status !== 'beroperasi' || !hasSLHS) {
        // Dapur tidak ada / belum beroperasi: tidak ada dana cair
        paidBahanBaku = 0;
        paidOperasional = 0;
        heldBudget = topUpRequested;
        recommendationAction = 'Seluruh top-up ditahan; dapur belum beroperasi/tanpa SLHS, hak penerima dialihkan sementara ke dapur terdekat; verifikasi lapangan maks. 4 hari kerja';
      } else {
        // Dapur beroperasi: hitung kebutuhan bahan baku penerima hasil sinkronisasi
        const bahanBakuNeeded = penerimaSinkronisasi * 6 * hargaAcuan;
        if (saldoVa >= bahanBakuNeeded) {
          // Saldo VA mencukupi sampai SPP berikutnya
          paidBahanBaku = 0;
          paidOperasional = 0;
          heldBudget = topUpRequested;
          recommendationAction = 'Saldo VA masih mencukupi kebutuhan bahan porsi sinkronisasi sampai SPP berikutnya; top-up ditahan menunggu verifikasi lapangan (usulan maks. 4 hari kerja)';
        } else {
          // Saldo VA tidak cukup: cairkan kekurangan bahan baku minimum
          const shortfall = Math.max(0, bahanBakuNeeded - saldoVa);
          paidBahanBaku = Math.min(bahanBakuBudget, shortfall);
          paidOperasional = 0;
          heldBudget = topUpRequested - paidBahanBaku;
          recommendationAction = `Bahan baku dicairkan sebesar kekurangan (Rp ${paidBahanBaku.toLocaleString('id-ID')}); operasional ditahan; verifikasi lapangan maks. 4 hari kerja oleh Verifikator BGN`;
        }
      }
    }

    kitchens.push({
      id,
      name: kitchenName,
      region,
      location,
      partner,
      capacity: penerimaSinkronisasi,
      capacityLabel,
      targetGroup,
      status,
      hasSLHS,
      activeVaCount,
      penerimaSinkronisasi,
      porsiDilaporkan,
      totalPorsiDilaporkan,
      hariTanpaLayanan,
      biayaBahanPerPorsi,
      hargaAcuan,
      danaDilaporkanTerpakai: reportedSpendTotal,
      arusKeluarVa: vaOutflowTotal,
      saldoVa,
      dailyFinancials,
      weeklyPortions: totalPorsiDilaporkan,
      topUpRequested,
      bahanBakuBudget,
      operasionalBudget,
      foodBudget,
      heldBudget,
      paidBahanBaku,
      paidOperasional,
      groundTruth: truth,
      schoolConfirmationSampled,
      schoolConfirmedPortions,
      prevWeekKuning,
      clarificationAccepted,
      isConsecutiveKuningMerah: consecutiveKuningMerah,
      activeFlags,
      triase,
      triggerReason,
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
 * Historical summary for Minggu 1 to 4 from the SAME seeded engine.
 * Reads persistent data per week.
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
 * Computes simulation metrics:
 * FP, FN, Capacity, Withheld Funds, and Presisi (Base Rate)
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

  // Dana tertahan sementara (= top-up diajukan minus amount paid under treatment rules)
  const withheldTotal = kitchens.reduce((acc, k) => acc + k.heldBudget, 0);
  const totalRequested = kitchens.reduce((acc, k) => acc + k.topUpRequested, 0);

  // Beban Lapangan (Merah only) vs Kapasitas
  const fieldBurden = merah.length;
  const merahLateCount = Math.max(0, fieldBurden - params.fieldCapacity); // Merah terlambat dilaporkan ke Inspektorat Utama

  // Beban Reviu Dokumen (Kuning only) vs Kapasitas
  const docReviewBurden = kuning.length;
  const kuningReleasedCount = Math.max(0, docReviewBurden - params.docReviewCapacity); // Kuning dilepas karena verifikator terlambat

  const burdenPercent = params.fieldCapacity > 0 ? (fieldBurden / params.fieldCapacity) * 100 : 0;
  const isOverCapacity = fieldBurden > params.fieldCapacity;

  // Draw verification durations per case from distribution (asumsi simulasi)
  // Kuning: klarifikasi dokumen 1-3 hari kerja
  const kuningDurations = kuning.map((k) => 1.3 + ((k.id.charCodeAt(k.id.length - 1) * 7) % 16) / 10);
  // Merah: verifikasi lapangan fisik 2-4 hari kerja (maks. 4 hari kerja)
  const merahDurations = merah.map((k) => 2.2 + ((k.id.charCodeAt(k.id.length - 1) * 9) % 18) / 10);

  const medianDaysKuning = kuningDurations.length > 0 ? Number(computeMedian(kuningDurations).toFixed(1)) : 2.1;
  const medianDaysMerah = merahDurations.length > 0 ? Number(computeMedian(merahDurations).toFixed(1)) : 3.4;

  // Disrupted service days per kitchen (estimasi ~0,4 hari rata-rata)
  const disruptedDaysPerKitchen = 0.4;

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
    fieldCapacity: params.fieldCapacity,
    merahLateCount,
    docReviewBurden,
    docReviewCapacity: params.docReviewCapacity,
    kuningReleasedCount,
    burdenPercent,
    isOverCapacity,
    medianDaysKuning,
    medianDaysMerah,
    disruptedDaysPerKitchen
  };
}

/**
 * Computes trade-off curve across selected tolerance threshold steps (R3, R4, or R5).
 * Re-runs the full simulation at each step so active point matches cards exactly.
 */
export function computeTradeOffCurve(
  baseParams: SimulationParameters,
  selectedThreshold: 'R3' | 'R4' | 'R5' = 'R5'
) {
  let testSteps: number[] = [];
  if (selectedThreshold === 'R3') {
    testSteps = [0, 5, 10, 15, 20];
  } else if (selectedThreshold === 'R4') {
    testSteps = [0, 3, 6, 9, 12, 15];
  } else {
    testSteps = [5, 10, 15, 20, 25, 30];
  }

  return testSteps.map((stepVal) => {
    let testParams = { ...baseParams };
    if (selectedThreshold === 'R3') {
      testParams.tolR3 = stepVal;
    } else if (selectedThreshold === 'R4') {
      testParams.tolR4 = stepVal;
    } else {
      testParams.tolR5 = stepVal;
    }

    const simulated = generateSyntheticKitchens(testParams, 4);
    const metrics = computeSimulationMetrics(simulated, testParams);
    return {
      thresholdValue: stepVal,
      falsePositiveRate: Number(metrics.falsePositiveRate.toFixed(1)),
      falseNegativeRate: Number(metrics.falseNegativeRate.toFixed(1)),
      flaggedCount: metrics.flaggedCount,
      withheldTotal: metrics.withheldTotal
    };
  });
}

/**
 * Seed 40 synthetic decision register logs with timestamps AFTER the weekly gate run.
 * Rules:
 * - Every entry reaching Tingkat 3 must have passed Tingkat 2 first.
 * - SPPG labels are consistent with the simulation state.
 */
export function generateInitialDecisionLogs(kitchens: Kitchen[]): DecisionLogEntry[] {
  const logs: DecisionLogEntry[] = [];
  const verifiers = [
    'Verifikator BGN (Wilayah A)',
    'Verifikator BGN (Wilayah B)',
    'Verifikator BGN (Wilayah C)'
  ];

  // Pick representative kitchens from simulation
  const flagKuning = kitchens.filter(k => k.triase === 'Kuning').slice(0, 24);
  const flagMerah = kitchens.filter(k => k.triase === 'Merah').slice(0, 16);
  const sampleList = [...flagKuning, ...flagMerah];

  const times = [
    'Senin, 14:15 WIB',
    'Senin, 16:30 WIB',
    'Selasa, 09:20 WIB',
    'Selasa, 11:45 WIB',
    'Selasa, 15:10 WIB',
    'Rabu, 10:00 WIB',
    'Rabu, 13:40 WIB',
    'Kamis, 09:15 WIB'
  ];

  sampleList.forEach((k, idx) => {
    const timeStr = times[idx % times.length];
    const verifikator = verifiers[idx % verifiers.length];
    let tingkat: 'Tingkat 1' | 'Tingkat 2' | 'Tingkat 3' | 'Tingkat 4' = 'Tingkat 2';
    let keputusan = '';
    let alasan = '';
    let hasilDiubah = false;

    if (k.id === 'SPPG Contoh 087') {
      // Benchmark Tingkat 3 (passed Tingkat 2 first)
      tingkat = 'Tingkat 3';
      keputusan = 'Rujukan ke Inspektorat Utama untuk audit investigatif';
      alasan = 'Pemeriksaan fisik Tingkat 2 menemukan selisih belanja berulang dan stempel nota terindikasi tidak sah; dirujuk ke Inspektorat Utama BGN';
      hasilDiubah = false;
    } else if (k.id === 'SPPG Contoh 156') {
      tingkat = 'Tingkat 2';
      keputusan = 'Klarifikasi Diterima & Koreksi Administratif';
      alasan = 'Faktur pasar basah fisik sah sesuai harga acuan Rp10.000; kekeliruan ketik koma desimal pada formulir SIPGN';
      hasilDiubah = true; // Label diubah / dibatalkan
    } else if (k.id === 'SPPG Contoh 212') {
      tingkat = 'Tingkat 2';
      keputusan = 'Klarifikasi Diterima & Salur Operasional Disetujui';
      alasan = 'Transmisi nota terlambat akibat pemadaman jaringan telekomunikasi; fisik berkas lengkap dan sah';
      hasilDiubah = true;
    } else if (k.id === 'SPPG Contoh 092') {
      tingkat = 'Tingkat 2';
      keputusan = 'Koreksi Porsi Administratif';
      alasan = 'Kelebihan porsi terkonfirmasi akibat penambahan siswa baru belum masuk SK sinkronisasi; dikoreksi administratif';
      hasilDiubah = true;
    } else if (k.triase === 'Merah') {
      if (idx % 3 === 0) {
        tingkat = 'Tingkat 3'; // Passed Tingkat 2 first
        keputusan = 'Rujukan ke Inspektorat Utama untuk audit investigatif';
        alasan = 'Verifikasi dokumen dan lapangan mengonfirmasi ketidaksesuaian material dan pola selisih mutasi VA berulang';
        hasilDiubah = false;
      } else {
        tingkat = 'Tingkat 2';
        keputusan = 'Verifikasi Lapangan Ditugaskan';
        alasan = 'Pemeriksaan fisik unit dapur dan pengecekan saldo VA sedang berlangsung oleh Verifikator BGN';
        hasilDiubah = false;
      }
    } else {
      // Kuning cases
      if (idx % 2 === 0) {
        tingkat = 'Tingkat 2';
        keputusan = 'Klarifikasi Tertulis Diterima';
        alasan = 'Bukti nota fisik dan mutasi rekening sesuai; kekeliruan penginputan laporan harian telah diperbaiki';
        hasilDiubah = true;
      } else {
        tingkat = 'Tingkat 2';
        keputusan = 'Menunggu Tanggapan SPPG';
        alasan = 'Surat permintaan klarifikasi tertulis telah dikirimkan ke Kepala SPPG (batas 3 hari kerja)';
        hasilDiubah = false;
      }
    }

    logs.push({
      id: `REG-2026-M4-${String(idx + 1).padStart(3, '0')}`,
      time: timeStr,
      sppgId: k.id,
      kitchenName: k.name,
      region: k.region,
      label: k.triase,
      tingkat,
      keputusan,
      verifikator,
      alasan,
      hasilDiubah
    });
  });

  return logs;
}
