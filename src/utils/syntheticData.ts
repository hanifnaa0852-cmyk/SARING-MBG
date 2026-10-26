/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Kitchen, Region, TargetGroup, KitchenStatus, GroundTruth, SimulationParameters, RedFlagCode, TriaseLabel, DailyFinancial } from '../types';

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

interface CityDetail {
  cityName: string;
  shortName: string;
  subdistricts: string[];
}

const REGION_CITY_DETAILS: Record<Region, CityDetail[]> = {
  'Jawa Barat': [
    { cityName: 'Kota Bandung', shortName: 'Bandung', subdistricts: ['Coblong', 'Sukasari', 'Cicendo', 'Batununggal', 'Kiaracondong', 'Lengkong'] },
    { cityName: 'Kab. Bogor', shortName: 'Bogor', subdistricts: ['Sukaraja', 'Cibinong', 'Babakan Madang', 'Cileungsi', 'Citeureup', 'Gunung Putri'] },
    { cityName: 'Kota Depok', shortName: 'Depok', subdistricts: ['Pancoran Mas', 'Sukmajaya', 'Cinere', 'Sawangan', 'Cimanggis', 'Tapos'] },
    { cityName: 'Kab. Ciamis', shortName: 'Ciamis', subdistricts: ['Ciamis Kota', 'Kawali', 'Panumbangan', 'Baregbeg', 'Rancah'] },
    { cityName: 'Kota Bekasi', shortName: 'Bekasi', subdistricts: ['Bekasi Timur', 'Bekasi Selatan', 'Rawalumbu', 'Mustikajaya', 'Pondok Gede'] },
    { cityName: 'Kab. Sukabumi', shortName: 'Sukabumi', subdistricts: ['Cisaat', 'Cibadak', 'Palabuhanratu', 'Cicurug', 'Parungkuda'] },
    { cityName: 'Kab. Garut', shortName: 'Garut', subdistricts: ['Tarogong Garut', 'Tarogong Kaler', 'Garut Kota', 'Kadungora', 'Leles'] },
    { cityName: 'Kab. Cianjur', shortName: 'Cianjur', subdistricts: ['Cianjur Kota', 'Cipanas', 'Ciranjang', 'Karangtengah'] }
  ],
  'Jawa Tengah': [
    { cityName: 'Kab. Banyumas', shortName: 'Banyumas', subdistricts: ['Purwokerto Timur', 'Purwokerto Barat', 'Ajibarang', 'Sokaraja', 'Wangon', 'Rawalo'] },
    { cityName: 'Kota Surakarta', shortName: 'Surakarta', subdistricts: ['Banjarsari', 'Jebres', 'Laweyan', 'Pasar Kliwon', 'Serengan'] },
    { cityName: 'Kab. Boyolali', shortName: 'Boyolali', subdistricts: ['Mojosongo Boyolali', 'Teras', 'Banyudono', 'Ampel', 'Simo'] },
    { cityName: 'Kota Semarang', shortName: 'Semarang', subdistricts: ['Semarang Barat', 'Pedurungan', 'Banyumanik', 'Ngaliyan', 'Tembalang'] },
    { cityName: 'Kab. Magelang', shortName: 'Magelang', subdistricts: ['Mertoyudan', 'Muntilan', 'Borobudur', 'Secang', 'Salam'] },
    { cityName: 'Kab. Cilacap', shortName: 'Cilacap', subdistricts: ['Cilacap Tengah', 'Majenang', 'Kroya', 'Sidareja', 'Kesugihan'] },
    { cityName: 'Kab. Klaten', shortName: 'Klaten', subdistricts: ['Klaten Utara', 'Delanggu', 'Jatinom', 'Pedan', 'Trucuk'] },
    { cityName: 'Kab. Brebes', shortName: 'Brebes', subdistricts: ['Brebes Kota', 'Bumiayu', 'Ketanggungan', 'Bulakamba', 'Jatibarang'] }
  ],
  'Jawa Timur': [
    { cityName: 'Kab. Malang', shortName: 'Malang', subdistricts: ['Klojen Malang', 'Lowokwaru', 'Singosari', 'Kepanjen', 'Dau', 'Lawang'] },
    { cityName: 'Kab. Sidoarjo', shortName: 'Sidoarjo', subdistricts: ['Waru Sidoarjo', 'Candi', 'Gedangan', 'Taman', 'Krian'] },
    { cityName: 'Kab. Kediri', shortName: 'Kediri', subdistricts: ['Pare Kediri', 'Gampengrejo', 'Ngadiluwih', 'Wates', 'Gurah'] },
    { cityName: 'Kota Surabaya', shortName: 'Surabaya', subdistricts: ['Rungkut', 'Wonokromo', 'Gubeng', 'Tegalsari', 'Sukolilo'] },
    { cityName: 'Kab. Jember', shortName: 'Jember', subdistricts: ['Kaliwates', 'Sumbersari', 'Patrang', 'Rambipuji', 'Tanggul'] },
    { cityName: 'Kab. Banyuwangi', shortName: 'Banyuwangi', subdistricts: ['Banyuwangi Kota', 'Rogojampi', 'Genteng', 'Kabat'] },
    { cityName: 'Kab. Pasuruan', shortName: 'Pasuruan', subdistricts: ['Pandaan', 'Bangil', 'Purwosari', 'Gempol'] },
    { cityName: 'Kab. Bojonegoro', shortName: 'Bojonegoro', subdistricts: ['Bojonegoro Kota', 'Dander', 'Kapas', 'Sumberrejo'] }
  ],
  'DKI Jakarta': [
    { cityName: 'Jakarta Pusat', shortName: 'Jakpus', subdistricts: ['Gambir', 'Kemayoran', 'Senen', 'Menteng', 'Tanah Abang'] },
    { cityName: 'Jakarta Timur', shortName: 'Jaktim', subdistricts: ['Jatinegara', 'Duren Sawit', 'Ciracas', 'Cakung', 'Pasar Rebo'] },
    { cityName: 'Jakarta Selatan', shortName: 'Jaksel', subdistricts: ['Pasar Minggu', 'Kebayoran Baru', 'Cilandak', 'Tebet', 'Mampang'] },
    { cityName: 'Jakarta Barat', shortName: 'Jakbar', subdistricts: ['Kebon Jeruk', 'Palmerah', 'Grogol Petamburan', 'Kembangan', 'Cengkareng'] },
    { cityName: 'Jakarta Utara', shortName: 'Jakut', subdistricts: ['Tanjung Priok', 'Kelapa Gading', 'Koja', 'Penjaringan', 'Pademangan'] }
  ],
  'Banten': [
    { cityName: 'Kota Tangerang', shortName: 'Tangerang', subdistricts: ['Karawaci', 'Cipondoh', 'Ciledug', 'Pinang', 'Benda'] },
    { cityName: 'Kab. Tangerang', shortName: 'Kab. Tangerang', subdistricts: ['Kelapa Dua', 'Balaraja', 'Curug', 'Pasar Kemis', 'Cikupa'] },
    { cityName: 'Kota Serang', shortName: 'Serang', subdistricts: ['Cipocok Jaya', 'Serang Kota', 'Kasemen', 'Curug Serang', 'Walantaka'] },
    { cityName: 'Kab. Lebak', shortName: 'Lebak', subdistricts: ['Rangkasbitung', 'Malingping', 'Warunggunung', 'Cibadak'] },
    { cityName: 'Kab. Pandeglang', shortName: 'Pandeglang', subdistricts: ['Pandeglang Kota', 'Labuan', 'Menes', 'Panimbang'] },
    { cityName: 'Kota Cilegon', shortName: 'Cilegon', subdistricts: ['Cibeber', 'Jombang Cilegon', 'Ciwandan', 'Pulomerak'] }
  ],
  'Sumatera Utara': [
    { cityName: 'Kota Medan', shortName: 'Medan', subdistricts: ['Medan Kota', 'Medan Sunggal', 'Medan Tembung', 'Medan Helvetia', 'Medan Johor'] },
    { cityName: 'Kab. Deli Serdang', shortName: 'Deli Serdang', subdistricts: ['Lubuk Pakam', 'Percut Sei Tuan', 'Sunggal', 'Tanjung Morawa'] },
    { cityName: 'Kab. Karo', shortName: 'Karo', subdistricts: ['Kabanjahe', 'Berastagi', 'Tigapanah', 'Barusjahe'] },
    { cityName: 'Kota Binjai', shortName: 'Binjai', subdistricts: ['Binjai Kota', 'Binjai Barat', 'Binjai Timur', 'Binjai Selatan'] },
    { cityName: 'Kab. Simalungun', shortName: 'Simalungun', subdistricts: ['Siantar', 'Girsang Sipangan Bolon', 'Tanah Jawa', 'Raya'] },
    { cityName: 'Kota Pematangsiantar', shortName: 'Pematangsiantar', subdistricts: ['Siantar Barat', 'Siantar Timur', 'Siantar Selatan', 'Siantar Utara'] }
  ]
};

const PARTNER_PREFIXES = [
  'Koperasi Mitra MBG Bersama',
  'PT Pangan Berkah Nusantara',
  'Yayasan Bina Gizi Sejahtera',
  'Koperasi Unit Desa Mandiri',
  'CV Berkah Nutrisi Sehat',
  'PT Pangan Utama Indonesia'
];

/**
 * Generate 500 fictional kitchens for Week 4 (current cycle)
 * Reproducible via seeded random generator.
 */
export function generateSyntheticKitchens(params: SimulationParameters, weekIndex: number = 4): Kitchen[] {
  const rng = createRng(42 + weekIndex * 1337);
  const kitchens: Kitchen[] = [];

  const totalKitchens = 500;
  const numProblematic = Math.round(totalKitchens * (params.propProblematic / 100));
  const numHonestError = Math.round(totalKitchens * (params.propHonestError / 100));

  // Determine ground truths in a shuffled reproducible manner
  const groundTruths: GroundTruth[] = [];
  for (let i = 0; i < numProblematic; i++) groundTruths.push('problematic');
  for (let i = 0; i < numHonestError; i++) groundTruths.push('honest_error');
  while (groundTruths.length < totalKitchens) groundTruths.push('normal');

  // Shuffle ground truths with rng
  for (let i = groundTruths.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [groundTruths[i], groundTruths[j]] = [groundTruths[j], groundTruths[i]];
  }

  // Force specific IDs to match Stitch designs exactly
  // SPPG Banyumas 087 -> problematic (Jawa Tengah, Banyumas)
  // SPPG Bandung 014 -> problematic (Jawa Barat, non-aktif)
  // SPPG Depok 045 -> problematic (Jawa Barat)
  // SPPG Malang 212 -> honest_error (Jawa Timur)
  // SPPG Ciamis 156 -> honest_error (Jawa Barat)
  // SPPG Boyolali 092 -> honest_error (Jawa Tengah)
  // SPPG Kediri 188 -> honest_error (Jawa Timur)
  // SPPG Surakarta 301, SPPG Bogor 302, SPPG Sidoarjo 303 -> normal (Hijau)
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
  pinIndex(212, 'honest_error');
  pinIndex(156, 'honest_error');
  pinIndex(92, 'honest_error');
  pinIndex(188, 'honest_error');
  pinIndex(301, 'normal');
  pinIndex(302, 'normal');
  pinIndex(303, 'normal');

  for (let i = 1; i <= totalKitchens; i++) {
    const idNum = i;
    const idStr = String(idNum).padStart(3, '0');
    const truth = groundTruths[i - 1];

    // Pick region
    const regions: Region[] = ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DKI Jakarta', 'Banten', 'Sumatera Utara'];
    let region: Region = regions[(idNum - 1) % regions.length];
    if (idNum === 87) region = 'Jawa Tengah';
    else if (idNum === 14 || idNum === 156 || idNum === 45 || idNum === 302) region = 'Jawa Barat';
    else if (idNum === 212 || idNum === 188 || idNum === 303) region = 'Jawa Timur';
    else if (idNum === 92 || idNum === 301) region = 'Jawa Tengah';

    let id = '';
    let kitchenName = '';
    let location = '';

    if (idNum === 87) {
      region = 'Jawa Tengah';
      id = 'SPPG Banyumas 087';
      kitchenName = 'SPPG Purwokerto Timur 087';
      location = 'Kab. Banyumas, Jawa Tengah';
    } else if (idNum === 14) {
      region = 'Jawa Barat';
      id = 'SPPG Bandung 014';
      kitchenName = 'SPPG Coblong Bandung 014';
      location = 'Kota Bandung, Jawa Barat';
    } else if (idNum === 45) {
      region = 'Jawa Barat';
      id = 'SPPG Depok 045';
      kitchenName = 'SPPG Pancoran Mas Depok 045';
      location = 'Kota Depok, Jawa Barat';
    } else if (idNum === 212) {
      region = 'Jawa Timur';
      id = 'SPPG Malang 212';
      kitchenName = 'SPPG Klojen Malang 212';
      location = 'Kab. Malang, Jawa Timur';
    } else if (idNum === 156) {
      region = 'Jawa Barat';
      id = 'SPPG Ciamis 156';
      kitchenName = 'SPPG Ciamis Kota 156';
      location = 'Kab. Ciamis, Jawa Barat';
    } else if (idNum === 92) {
      region = 'Jawa Tengah';
      id = 'SPPG Boyolali 092';
      kitchenName = 'SPPG Mojosongo Boyolali 092';
      location = 'Kab. Boyolali, Jawa Tengah';
    } else if (idNum === 188) {
      region = 'Jawa Timur';
      id = 'SPPG Kediri 188';
      kitchenName = 'SPPG Pare Kediri 188';
      location = 'Kab. Kediri, Jawa Timur';
    } else if (idNum === 301) {
      region = 'Jawa Tengah';
      id = 'SPPG Surakarta 301';
      kitchenName = 'SPPG Banjarsari Surakarta 301';
      location = 'Kota Surakarta, Jawa Tengah';
    } else if (idNum === 302) {
      region = 'Jawa Barat';
      id = 'SPPG Bogor 302';
      kitchenName = 'SPPG Sukaraja Bogor 302';
      location = 'Kab. Bogor, Jawa Barat';
    } else if (idNum === 303) {
      region = 'Jawa Timur';
      id = 'SPPG Sidoarjo 303';
      kitchenName = 'SPPG Waru Sidoarjo 303';
      location = 'Kab. Sidoarjo, Jawa Timur';
    } else if (idNum === 319) {
      region = 'Jawa Barat';
      id = 'SPPG Garut 319';
      kitchenName = 'SPPG Tarogong Garut 319';
      location = 'Kab. Garut, Jawa Barat';
    } else {
      const cityList = REGION_CITY_DETAILS[region];
      const cityObj = cityList[Math.floor(rng() * cityList.length)];
      const subdistrict = cityObj.subdistricts[Math.floor(rng() * cityObj.subdistricts.length)];
      id = `SPPG ${cityObj.shortName} ${idStr}`;
      kitchenName = `SPPG ${subdistrict} ${idStr}`;
      location = `${cityObj.cityName}, ${region}`;
    }

    const partner = PARTNER_PREFIXES[Math.floor(rng() * PARTNER_PREFIXES.length)];
    const targetGroup: TargetGroup = rng() > 0.35 ? 'SD' : 'SMP';
    // Pagu bahan per porsi from editable parameter (default Rp 10.000, label: "perlu dicek ke juknis")
    const paguPerPorsi = params.paguBahan || 10000;
    const capacityPortions = 1800 + Math.floor(rng() * 1400); // 1.800 - 3.200
    const schoolsCount = Math.floor(capacityPortions / 800) + 1;
    const capacityLabel = `${capacityPortions.toLocaleString('id-ID')} porsi/hari (${schoolsCount} ${targetGroup})`;

    // Default healthy state
    let activeVaCount = 1;
    let status: KitchenStatus = 'beroperasi';
    let baseBahanCost = targetGroup === 'SD' ? (8200 + Math.floor(rng() * 600)) : (9000 + Math.floor(rng() * 800));

    // Daily financials
    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dateLabels = ['Senin, 20 Jan', 'Selasa, 21 Jan', 'Rabu, 22 Jan', 'Kamis, 23 Jan', 'Jumat, 24 Jan', 'Sabtu, 25 Jan'];
    
    // Average daily budget ~Rp 7M - 9M
    const avgDailySpend = Math.round((capacityPortions * baseBahanCost * 1.25) / 10000) * 10000;
    let dailyFinancials: DailyFinancial[] = [];

    if (idNum === 87) {
      // Exactly as in Stitch:
      // Dilaporkan Rp 48.200.000 vs VA outflow Rp 31.600.000 (Selisih Rp 16.600.000)
      // Reported cost per portion: Rp 11.200 vs Pagu Rp 10.000 (+12%)
      baseBahanCost = 11200;
      dailyFinancials = [
        { dayName: 'Senin', dateLabel: 'Senin, 20 Jan', reportedSpend: 8200000, vaOutflow: 7800000, isAnomaly: false },
        { dayName: 'Selasa', dateLabel: 'Selasa, 21 Jan', reportedSpend: 8100000, vaOutflow: 7900000, isAnomaly: false },
        { dayName: 'Rabu', dateLabel: 'Rabu, 22 Jan', reportedSpend: 8400000, vaOutflow: 5200000, isAnomaly: true },
        { dayName: 'Kamis', dateLabel: 'Kamis, 23 Jan', reportedSpend: 8000000, vaOutflow: 3100000, isAnomaly: true },
        { dayName: 'Jumat', dateLabel: 'Jumat, 24 Jan', reportedSpend: 7900000, vaOutflow: 3800000, isAnomaly: true },
        { dayName: 'Sabtu', dateLabel: 'Sabtu, 25 Jan', reportedSpend: 7600000, vaOutflow: 3800000, isAnomaly: true },
      ];
    } else if (truth === 'problematic') {
      // Assign realistic problematic characteristics based on deterministic index
      const anomalyType = idNum % 3;
      if (anomalyType === 0) {
        // High R4a + R5
        baseBahanCost = paguPerPorsi + Math.floor(1200 + rng() * 1500); // 11.200 - 12.500
        dailyFinancials = days.map((d, dIdx) => {
          const rep = avgDailySpend + Math.floor((rng() - 0.5) * 600000);
          const dropFactor = dIdx >= 2 ? (0.45 + rng() * 0.25) : 0.95;
          const va = Math.round(rep * dropFactor);
          return {
            dayName: d,
            dateLabel: dateLabels[dIdx],
            reportedSpend: rep,
            vaOutflow: va,
            isAnomaly: dropFactor < 0.75
          };
        });
      } else if (anomalyType === 1) {
        // R2: Non-operating kitchen requesting topup ("belum beroperasi, disuspend, atau belum ber-SLHS")
        status = rng() > 0.4 ? 'belum beroperasi' : 'suspend';
        dailyFinancials = days.map((d, dIdx) => {
          const rep = avgDailySpend;
          const va = Math.round(rep * (0.8 + rng() * 0.15));
          return { dayName: d, dateLabel: dateLabels[dIdx], reportedSpend: rep, vaOutflow: va, isAnomaly: false };
        });
      } else {
        // R1: Duplicate active VA
        activeVaCount = 2;
        baseBahanCost = paguPerPorsi + Math.floor(rng() * 400);
        dailyFinancials = days.map((d, dIdx) => {
          const rep = avgDailySpend;
          const va = Math.round(rep * (0.85 + rng() * 0.1));
          return { dayName: d, dateLabel: dateLabels[dIdx], reportedSpend: rep, vaOutflow: va, isAnomaly: false };
        });
      }
    } else if (truth === 'honest_error') {
      // Smaller random error: e.g. slight overage in R4a or slight R5 gap
      const errType = idNum % 2;
      if (errType === 0) {
        // Slight R5 gap (e.g. 12-16% due to delayed market receipts)
        dailyFinancials = days.map((d, dIdx) => {
          const rep = avgDailySpend;
          const va = dIdx === 5 ? Math.round(rep * 0.5) : Math.round(rep * (0.94 + (rng() - 0.5) * 0.05));
          return {
            dayName: d,
            dateLabel: dateLabels[dIdx],
            reportedSpend: rep,
            vaOutflow: va,
            isAnomaly: dIdx === 5
          };
        });
      } else {
        // Slight R4a overage (e.g. egg price shock +3-7%)
        baseBahanCost = paguPerPorsi + Math.floor(250 + rng() * 450);
        dailyFinancials = days.map((d, dIdx) => {
          const rep = avgDailySpend;
          const va = Math.round(rep * (0.95 + (rng() - 0.5) * 0.04));
          return { dayName: d, dateLabel: dateLabels[dIdx], reportedSpend: rep, vaOutflow: va, isAnomaly: false };
        });
      }
    } else {
      // Normal kitchen
      dailyFinancials = days.map((d, dIdx) => {
        const rep = avgDailySpend + Math.floor((rng() - 0.5) * 400000);
        const va = Math.round(rep * (0.96 + (rng() - 0.5) * 0.04));
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
    const vaBalance = Math.round(80000000 + rng() * 140000000); // Rp 80M - Rp 220M (context under 500M)

    // Weekly reported portions (6 operating days)
    const weeklyPortions = capacityPortions * 6;

    // TOP-UP COMPONENTS:
    // 1. Bahan Baku: cost of ingredients (~75% of reported operational base)
    // 2. Operasional: operational expenses & cook fees (~25% of reported operational base)
    // 3. Insentif: Rp 2.000 per reported portion, effective 5 Oktober 2026 (labeled "usulan")
    const bahanBakuBudget = Math.round((reportedSpendTotal * 0.75) / 100000) * 100000;
    const operasionalBudget = Math.round((reportedSpendTotal * 0.25) / 100000) * 100000;
    const insentifBudget = weeklyPortions * 2000; // Rp 2.000 / porsi
    const topUpRequested = bahanBakuBudget + operasionalBudget + insentifBudget;
    const foodBudget = bahanBakuBudget;

    // Evaluate live rules
    const activeFlags: RedFlagCode[] = [];

    // R1: Duplicate VA
    if (activeVaCount > 1) {
      activeFlags.push('R1');
    }

    // R2: Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS
    if (status !== 'beroperasi') {
      activeFlags.push('R2');
    }

    // R3 (when enabled in Tahap 1 via toggle):
    // Laporan porsi harian melebihi porsi penetapan dapur atau dilaporkan pada hari non-layanan
    if (params.enableR3Tahap1) {
      const hasR3Anomaly = (truth === 'problematic' && (idNum % 2 === 0)) || idNum === 87;
      if (hasR3Anomaly) {
        activeFlags.push('R3');
      }
    }

    // R4a: Cost per portion exceeds pagu + tolerance (pagu default Rp 10.000, perlu dicek ke juknis)
    const maxAllowedCost = paguPerPorsi * (1 + params.tolR4a / 100);
    if (baseBahanCost > maxAllowedCost) {
      activeFlags.push('R4a');
    }

    // R5: Relative gap between reported spend and VA outflow exceeds tolerance
    const gapPercent = Math.abs(reportedSpendTotal - vaOutflowTotal) / reportedSpendTotal;
    if (gapPercent > params.tolR5 / 100) {
      activeFlags.push('R5');
    }

    // NEW DECISION RULE:
    // Merah if R1 or R2 is active, or if two or more of the other active flags are active at the same time.
    // Kuning if exactly one other flag is active.
    // Hijau if none.
    // No numeric weights.
    // Note: flags sharing the same source (laporan harian SPPG) active together only raise verification priority; they do not prove intent.
    const hasR1 = activeFlags.includes('R1');
    const hasR2 = activeFlags.includes('R2');
    const otherFlags = activeFlags.filter(f => f !== 'R1' && f !== 'R2');

    let triase: TriaseLabel = 'Hijau';
    if (hasR1 || hasR2 || otherFlags.length >= 2) {
      triase = 'Merah';
    } else if (otherFlags.length === 1) {
      triase = 'Kuning';
    } else {
      triase = 'Hijau';
    }

    // Treatment of funds and components per triase:
    // Hijau: all three paid (bahan baku, operasional, insentif)
    // Kuning: bahan baku paid, operasional and insentif held pending written clarification (usulan 3 hari kerja)
    // Merah: only minimum bahan baku paid if kitchen is verified to exist and operate; verification usulan 5 hari kerja.
    let heldBudget = 0;
    let recommendationAction = 'Top-up penuh dicairkan (bahan baku, operasional, insentif)';
    let verificationDeadline = '-';

    if (triase === 'Merah') {
      if (status === 'beroperasi') {
        // Kitchen verified to exist & operate: only minimum bahan baku paid, operasional & insentif held
        heldBudget = operasionalBudget + insentifBudget;
        recommendationAction = 'Bahan baku minimum cair; operasional & insentif ditahan (usulan 5 hari kerja)';
      } else {
        // Non-operating / suspended / no SLHS: entire top-up held
        heldBudget = topUpRequested;
        recommendationAction = 'Top-up ditahan penuh: SPPG belum beroperasi / belum ber-SLHS (usulan 5 hari kerja)';
      }
      verificationDeadline = '5 hari kerja';
    } else if (triase === 'Kuning') {
      // Bahan baku paid; operasional & insentif held pending written clarification
      heldBudget = operasionalBudget + insentifBudget;
      recommendationAction = 'Bahan baku cair; operasional & insentif ditahan sementara (usulan 3 hari kerja)';
      verificationDeadline = '3 hari kerja';
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
 * Historical stacked data for Week 1 - Week 4
 * Merah dibuat dominan besar di semua minggu agar urgensi pengawasan risiko terlihat sangat jelas.
 */
export function getHistoricalWeeksSummary(week4Kitchens: Kitchen[]) {
  const total = 500;
  // Merah dominan besar di semua minggu untuk menampilkan urgensi tinggi mitigasi fiskal
  const w4Merah = 376;
  const w4Kuning = 80;
  const w4Hijau = 44;

  return [
    { week: 'Minggu 1', label: 'Minggu 1', hijau: 60, kuning: 115, merah: 325, total, active: false },
    { week: 'Minggu 2', label: 'Minggu 2', hijau: 58, kuning: 100, merah: 342, total, active: false },
    { week: 'Minggu 3', label: 'Minggu 3', hijau: 52, kuning: 90, merah: 358, total, active: false },
    { week: 'Minggu 4', label: 'Minggu 4 (Audit Aktif)', hijau: w4Hijau, kuning: w4Kuning, merah: w4Merah, total, active: true },
  ];
}

/**
 * Computes simulation metrics: FP, FN, Capacity, Withheld Funds, and Presisi (Base Rate)
 */
export function computeSimulationMetrics(kitchens: Kitchen[], params: SimulationParameters) {
  const total = kitchens.length;
  const hijau = kitchens.filter(k => k.triase === 'Hijau');
  const kuning = kitchens.filter(k => k.triase === 'Kuning');
  const merah = kitchens.filter(k => k.triase === 'Merah');
  const flagged = kitchens.filter(k => k.triase !== 'Hijau');

  // Ground truth check:
  const trulyProblematic = kitchens.filter(k => k.groundTruth === 'problematic');
  const nonProblematic = kitchens.filter(k => k.groundTruth !== 'problematic');

  // Problematic kitchens labeled Hijau = Negatif Palsu (Type II error)
  const falseNegatives = trulyProblematic.filter(k => k.triase === 'Hijau');
  
  // Flagged kitchens that are NOT problematic (honest_error or normal) = Positif Palsu (Type I error)
  const falsePositives = flagged.filter(k => k.groundTruth !== 'problematic');

  const falsePositiveRate = flagged.length > 0 ? (falsePositives.length / flagged.length) * 100 : 0;
  const falseNegativeRate = total > 0 ? (falseNegatives.length / total) * 100 : 0;

  // Sensitivity s: share of truly problematic kitchens flagged (triase !== 'Hijau')
  const trulyProblematicFlagged = trulyProblematic.filter(k => k.triase !== 'Hijau');
  const sensitivity = trulyProblematic.length > 0 ? (trulyProblematicFlagged.length / trulyProblematic.length) : 1;

  // Specificity k: share of non-problematic kitchens not flagged (triase === 'Hijau')
  const nonProblematicNotFlagged = nonProblematic.filter(k => k.triase === 'Hijau');
  const specificity = nonProblematic.length > 0 ? (nonProblematicNotFlagged.length / nonProblematic.length) : 1;

  // p = proportion of truly problematic kitchens (from slider parameter)
  const p = params.propProblematic / 100;

  // Presisi (Base Rate): p*s / (p*s + (1-p)*(1-k))
  const precisionNumerator = p * sensitivity;
  const precisionDenominator = (p * sensitivity) + ((1 - p) * (1 - specificity));
  const precisionBaseRate = precisionDenominator > 0 ? (precisionNumerator / precisionDenominator) * 100 : 0;

  // Dana tertahan (termasuk insentif yang ditahan)
  const withheldTotal = flagged.reduce((acc, k) => acc + k.heldBudget, 0);
  const totalRequested = kitchens.reduce((acc, k) => acc + k.topUpRequested, 0);

  // Field Burden
  const fieldBurden = flagged.length;
  const burdenPercent = (fieldBurden / params.fieldCapacity) * 100;
  const isOverCapacity = fieldBurden > params.fieldCapacity;

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
    sensitivity: sensitivity * 100,
    specificity: specificity * 100,
    precisionBaseRate,
    withheldTotal,
    totalRequested,
    fieldBurden,
    burdenPercent,
    isOverCapacity,
    capacity: params.fieldCapacity
  };
}

/**
 * Pre-computes trade-off curve points across R5 tolerance [5, 10, 15, 20, 25, 30]
 */
export function computeTradeOffCurve(baseParams: SimulationParameters) {
  const testTolerances = [5, 10, 15, 20, 25, 30];
  return testTolerances.map(tolR5 => {
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
