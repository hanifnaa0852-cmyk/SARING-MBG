/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DecisionLogEntry, TriaseLabel } from '../types';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { soundFx } from '../utils/soundEffects';

interface ErrorVsFraudPageProps {
  decisionLogs: DecisionLogEntry[];
  onAddDecisionLog?: (entry: DecisionLogEntry) => void;
}

// 4 Synthetic Scenarios for Penjelajah Kasus
interface ScenarioPreset {
  id: string;
  title: string;
  icon: string;
  desc: string;
  sppgDefault: string;
  alasanDefault: string;
  toggles: {
    redFlag: boolean;
    selisihTerkonfirmasi: boolean;
    tandaPenyembunyian: boolean;
    polaBerulang: boolean;
    pemasokTerafiliasi: boolean;
  };
}

const SCENARIOS: ScenarioPreset[] = [
  {
    id: 'salah-input',
    title: 'Salah input laporan',
    icon: 'edit_document',
    desc: 'Operator salah ketik biaya bahan baku Rp11.500 (melebihi pagu acuan Rp10.000). Nota fisik pasar basah diverifikasi sah.',
    sppgDefault: 'SPPG Ciamis 156 (SPPG Ciamis Kota 156)',
    alasanDefault: 'Kekeliruan ketik kolom biaya bahan; faktur fisik pedagang pasar sah dan pagu dikoreksi administratif.',
    toggles: {
      redFlag: true,
      selisihTerkonfirmasi: true,
      tandaPenyembunyian: false,
      polaBerulang: false,
      pemasokTerafiliasi: false,
    },
  },
  {
    id: 'laporan-terlambat',
    title: 'Laporan terlambat',
    icon: 'pending_actions',
    desc: 'Dapur berada di blank spot wilayah pegunungan; unggahan nota tertunda saat cut-off Rabu 23:59 WIB.',
    sppgDefault: 'SPPG Malang 212 (SPPG Klojen Malang 212)',
    alasanDefault: 'Transmisi nota terlambat akibat pemadaman jaringan telekomunikasi; fisik berkas lengkap dan sah.',
    toggles: {
      redFlag: true,
      selisihTerkonfirmasi: false,
      tandaPenyembunyian: false,
      polaBerulang: false,
      pemasokTerafiliasi: false,
    },
  },
  {
    id: 'selisih-berulang',
    title: 'Selisih berulang 3 minggu',
    icon: 'history',
    desc: 'Deviasi arus kas VA vs nota berulang di minggu 2, 3, dan 4 tanpa perbaikan bukti pembukuan.',
    sppgDefault: 'SPPG Banyumas 087 (SPPG Purwokerto Timur 087)',
    alasanDefault: 'Selisih pengeluaran berulang selama 3 pekan berturut-turut; bukti pembukuan tidak dapat dipertanggungjawabkan.',
    toggles: {
      redFlag: true,
      selisihTerkonfirmasi: true,
      tandaPenyembunyian: false,
      polaBerulang: true,
      pemasokTerafiliasi: false,
    },
  },
  {
    id: 'dokumen-rekayasa',
    title: 'Dokumen direkayasa + pemasok terafiliasi',
    icon: 'warning',
    desc: 'Nota belanja dicetak ulang dengan stempel buatan dan rekening toko pemasok atas nama pengurus dapur.',
    sppgDefault: 'SPPG Garut 319 (SPPG Tarogong Garut 319)',
    alasanDefault: 'Ditemukan nota pasar direkayasa dan rekening penyedia logistik terindikasi terafiliasi pengurus dapur.',
    toggles: {
      redFlag: true,
      selisihTerkonfirmasi: true,
      tandaPenyembunyian: true,
      polaBerulang: false,
      pemasokTerafiliasi: true,
    },
  },
];

interface LevelDefinition {
  levelNumber: 1 | 2 | 3 | 4;
  title: string;
  tagline: string;
  isLocked?: boolean;
  lockedLabel?: string;
  disimpulkanOleh: string;
  disimpulkanIcon: string;
  buktiMinimal: string[];
  contohDiSaring: string;
  tindakan: string;
  batasDijaga: string;
  mengapaBegini: string;
}

const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    levelNumber: 1,
    title: 'Indikator Risiko',
    tagline: 'Pola data menyimpang dari aturan.',
    disimpulkanOleh: 'Mesin Aturan SARING-MBG',
    disimpulkanIcon: 'psychology',
    buktiMinimal: [
      'Red flag aktif (R1, R2, R4a, atau R5)',
      'Deviasi statistik nota pelaporan vs data pembanding',
      'Peringatan otomatis sebelum penerbitan SPP',
    ],
    contohDiSaring:
      'R4a aktif karena biaya bahan per porsi dilaporkan Rp10.800 (melebihi pagu Rp10.000), atau R5 selisih pelaporan vs arus keluar VA.',
    tindakan:
      'Penetapan label Kuning atau Merah; penahanan porsi cadangan operasional (20%) atau penahanan total; belum ada tuduhan kepada pihak manapun.',
    batasDijaga:
      'Indikator risiko adalah pemicu pemeriksaan awal, bukan bukti kesalahan dan bukan penetapan kerugian.',
    mengapaBegini:
      'Mesin aturan hanya membaca angka dan logika relasional. Keberadaan red flag tidak otomatis berarti ada kecurangan, melainkan sinyal kewaspadaan fiskal.',
  },
  {
    levelNumber: 2,
    title: 'Bukti Salah Saji',
    tagline: 'Selisih terkonfirmasi antara laporan dan bukti faktual.',
    disimpulkanOleh: 'Verifikator Wilayah BGN',
    disimpulkanIcon: 'fact_check',
    buktiMinimal: [
      'Pemeriksaan dokumen fisik faktur/nota pasar basah',
      'Cek fisik lapangan ke unit dapur dan gudang bahan',
      'Konfirmasi langsung pihak ketiga (komite sekolah / pedagang)',
    ],
    contohDiSaring:
      'Konfirmasi komite sekolah menunjukkan absensi porsi riil siswa 1.800 porsi, sedangkan klaim laporan mingguan mencatat 2.200 porsi.',
    tindakan:
      'Koreksi nilai top-up anggaran; selesai secara administratif apabila tanpa tanda penyembunyian, dan dapur diberikan pembinaan teknis.',
    batasDijaga:
      'Membedakan kekeliruan ketik (human error) dari kesengajaan; memulihkan integritas tata kelola tanpa mengkriminalisasi kesalahan teknis.',
    mengapaBegini:
      'Banyak kekeliruan di lapangan bersumber dari keterbatasan literasi administrasi operator SPPG. Prinsip kehati-hatian mengutamakan rektifikasi administratif.',
  },
  {
    levelNumber: 3,
    title: 'Indikasi Kesengajaan',
    tagline: 'Salah saji disertai tanda penyembunyian atau pola berulang.',
    disimpulkanOleh: 'Inspektorat Utama BGN / APIP (termasuk BPKP)',
    disimpulkanIcon: 'policy',
    buktiMinimal: [
      'Dokumen sengaja direkayasa atau nota fiktif berturut-turut',
      'Pola selisih berulang di banyak minggu tanpa perbaikan',
      'Pemasok bahan baku terafiliasi dengan pengurus dapur',
    ],
    contohDiSaring:
      'Ditemukan stempel toko palsu pada nota belanja, selisih anggaran terjadi selama 3 minggu berturut-turut, atau mutasi dana mengalir ke rekening pribadi pengurus.',
    tindakan:
      'Rujukan resmi ke audit investigatif mendalam, pembekuan Virtual Account sementara, dan penahanan penuh alokasi dana operasional.',
    batasDijaga:
      'Hanya menyatakan ada cukup petunjuk awal untuk diteruskan ke audit investigatif; bukan vonis bersalah pidana.',
    mengapaBegini:
      'Auditor dan gerbang pencegahan tidak membuat penetapan hukum bahwa tindak pidana fraud terjadi; kesengajaan adalah unsur hukum yang ditentukan dalam proses hukum.',
  },
  {
    levelNumber: 4,
    title: 'Kesimpulan',
    tagline: 'Pernyataan kerugian negara dan penetapan tindak pidana. Disimpulkan oleh: BPK (kerugian negara); APH dan pengadilan (unsur pidana). DI LUAR GERBANG.',
    isLocked: true,
    lockedLabel: 'DI LUAR GERBANG',
    disimpulkanOleh: 'BPK (kerugian negara); APH dan pengadilan (unsur pidana)',
    disimpulkanIcon: 'account_balance',
    buktiMinimal: [
      'Laporan Hasil Pemeriksaan Investigatif BPK (penetapan kerugian negara)',
      'Berita Acara Penyidikan Aparat Penegak Hukum (Polri/Kejaksaan/KPK)',
      'Putusan Pengadilan Tindak Pidana Korupsi berkekuatan hukum tetap',
    ],
    contohDiSaring:
      'Kesimpulan: pernyataan kerugian negara dan penetapan tindak pidana. Disimpulkan oleh: BPK (kerugian negara); APH dan pengadilan (unsur pidana). DI LUAR GERBANG.',
    tindakan:
      'Penetapan kerugian keuangan negara oleh BPK; penyidikan dan penuntutan unsur pidana oleh APH; vonis serta eksekusi putusan pengadilan.',
    batasDijaga:
      'Gerbang SARING-MBG berhenti sebelum tingkat ini. Kesimpulan kerugian negara dan penetapan pidana sepenuhnya berada di luar gerbang sistem administratif MBG.',
    mengapaBegini:
      'Negara hukum membatasi kewenangan administratif. Gerbang MBG adalah instrumen verifikasi pencairan top-up, bukan lembaga penilai kerugian negara atau peradilan yudisial.',
  },
];

export const ErrorVsFraudPage: React.FC<ErrorVsFraudPageProps> = ({
  decisionLogs,
  onAddDecisionLog,
}) => {
  // Selected level in Tangga Bukti (for Panel Informasi)
  const [selectedLadderLevel, setSelectedLadderLevel] = useState<1 | 2 | 3 | 4>(2);
  const [shakeLevel4, setShakeLevel4] = useState<boolean>(false);
  const [level4Alert, setLevel4Alert] = useState<string | null>(null);
  const [levelLockTooltip, setLevelLockTooltip] = useState<string | null>(null);

  // Accordion "Mengapa begini?" in Panel Informasi
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);

  // Penjelajah Kasus (Interactive Case Simulator)
  const [activeScenarioId, setActiveScenarioId] = useState<string>('salah-input');
  const [toggles, setToggles] = useState({
    redFlag: true,
    selisihTerkonfirmasi: true,
    tandaPenyembunyian: false,
    polaBerulang: false,
    pemasokTerafiliasi: false,
  });
  const [customSppg, setCustomSppg] = useState<string>('SPPG Ciamis 156 (SPPG Ciamis Kota 156)');
  const [customAlasan, setCustomAlasan] = useState<string>(
    'Kekeliruan ketik kolom biaya bahan; faktur fisik pedagang pasar sah dan pagu dikoreksi administratif.'
  );
  const [reasonError, setReasonError] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Register Keputusan Filters & Drawer
  const [filterLevel, setFilterLevel] = useState<string>('Semua');
  const [filterLabel, setFilterLabel] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDrawerLog, setSelectedDrawerLog] = useState<DecisionLogEntry | null>(null);
  const [newlyAddedLogId, setNewlyAddedLogId] = useState<string | null>(null);

  // KPI Modals
  const [activeModal, setActiveModal] = useState<'cancellation' | 'immutable' | null>(null);

  // Evaluated Reached Level for Active Case in Penjelajah Kasus
  const reachedLevel = useMemo<1 | 2 | 3>(() => {
    if (!toggles.redFlag) {
      return 1;
    }
    if (!toggles.selisihTerkonfirmasi) {
      return 1;
    }
    const hasIntentFlag =
      toggles.tandaPenyembunyian || toggles.polaBerulang || toggles.pemasokTerafiliasi;
    if (hasIntentFlag) {
      return 3;
    }
    return 2;
  }, [toggles]);

  // Dynamic Metrics computed from Register Keputusan
  const totalLogs = decisionLogs.length;
  const modifiedLogs = decisionLogs.filter((l) => l.hasilDiubah).length;
  const cancellationRatio = totalLogs > 0 ? Math.round((modifiedLogs / totalLogs) * 100) : 6;

  // Level counts for Donut Chart
  const countT1 = decisionLogs.filter((l) => l.tingkat === 'Tingkat 1').length;
  const countT2 = decisionLogs.filter((l) => l.tingkat === 'Tingkat 2').length;
  const countT3 = decisionLogs.filter((l) => l.tingkat === 'Tingkat 3').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch Scenario Preset
  const handleSelectScenario = (sc: ScenarioPreset) => {
    soundFx.playClickBlip();
    setActiveScenarioId(sc.id);
    setToggles({ ...sc.toggles });
    setCustomSppg(sc.sppgDefault);
    setCustomAlasan(sc.alasanDefault);
    setReasonError(false);

    // Auto-align view to the reached level
    let targetLvl: 1 | 2 | 3 = 1;
    if (sc.toggles.redFlag && sc.toggles.selisihTerkonfirmasi) {
      if (
        sc.toggles.tandaPenyembunyian ||
        sc.toggles.polaBerulang ||
        sc.toggles.pemasokTerafiliasi
      ) {
        targetLvl = 3;
      } else {
        targetLvl = 2;
      }
    }
    setSelectedLadderLevel(targetLvl);
  };

  // Handle Ladder Node Click
  const handleNodeClick = (level: 1 | 2 | 3 | 4) => {
    soundFx.playClickBlip();
    if (level === 4) {
      // Tingkat 4 is LOCKED outside the gate
      setShakeLevel4(true);
      setLevel4Alert(
        'Gerbang SARING-MBG berhenti di sini. Kesimpulan hukum bukan wewenang gerbang. Gerbang menahan uang, bukan menghukum orang.'
      );
      setTimeout(() => setShakeLevel4(false), 600);
      setTimeout(() => setLevel4Alert(null), 5000);
      setSelectedLadderLevel(4);
      return;
    }

    // Step-by-step logic: If user tries to click Tingkat 3 while active case hasn't reached Tingkat 2:
    if (level === 3 && reachedLevel < 2) {
      setLevelLockTooltip('Naik bertahap: butuh bukti tingkat 2 lebih dulu');
      setTimeout(() => setLevelLockTooltip(null), 3500);
      setSelectedLadderLevel(3);
      return;
    }

    setLevelLockTooltip(null);
    setLevel4Alert(null);
    setSelectedLadderLevel(level);
  };

  // Submit Case to Register Keputusan
  const handleRecordToRegister = () => {
    if (!customAlasan.trim()) {
      setReasonError(true);
      soundFx.playClickBlip();
      return;
    }
    setReasonError(false);
    soundFx.playClickBlip();

    const newLogId = `log-${Date.now()}`;
    const nowStr = `Hari Ini, ${new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    })} WIB`;

    let assignedLabel: TriaseLabel = 'Kuning';
    let assignedAction = 'Koreksi Administratif';
    if (reachedLevel === 1) {
      assignedLabel = 'Kuning';
      assignedAction = 'Verifikasi Dokumen Lanjutan';
    } else if (reachedLevel === 2) {
      assignedLabel = 'Kuning';
      assignedAction = 'Selesai Administratif & Pembinaan';
    } else if (reachedLevel === 3) {
      assignedLabel = 'Merah';
      assignedAction = 'Rujukan Investigasi & Penahanan Penuh';
    }

    const sppgCleanId = customSppg.includes('(')
      ? customSppg.split('(')[0].trim()
      : customSppg;
    const kitchenCleanName = customSppg.includes('(')
      ? customSppg.split('(')[1].replace(')', '').trim()
      : customSppg;

    let regionDetermined: any = 'Jawa Barat';
    if (customSppg.includes('Banyumas')) regionDetermined = 'Jawa Tengah';
    else if (customSppg.includes('Malang')) regionDetermined = 'Jawa Timur';

    const newEntry: DecisionLogEntry = {
      id: newLogId,
      time: nowStr,
      sppgId: sppgCleanId,
      kitchenName: kitchenCleanName,
      region: regionDetermined,
      label: assignedLabel,
      tingkat: `Tingkat ${reachedLevel}` as 'Tingkat 1' | 'Tingkat 2' | 'Tingkat 3',
      keputusan: assignedAction,
      verifikator: 'Auditor Tim Satgas BGN',
      alasan: customAlasan.trim(),
      hasilDiubah: reachedLevel === 2, // If level 2 without concealment, machine flag is corrected administratively
    };

    if (onAddDecisionLog) {
      onAddDecisionLog(newEntry);
    }
    setNewlyAddedLogId(newLogId);
    showToast(`Keputusan untuk ${customSppg} berhasil dicatat permanen ke Register Audit.`);

    setTimeout(() => {
      setNewlyAddedLogId(null);
    }, 4500);
  };

  // Filtered Decision Logs
  const filteredLogs = useMemo(() => {
    return decisionLogs.filter((log) => {
      const matchLevel = filterLevel === 'Semua' || log.tingkat === filterLevel;
      const matchLabel = filterLabel === 'Semua' || log.label === filterLabel;
      const matchSearch =
        !searchQuery ||
        log.sppgId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.kitchenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.verifikator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.alasan.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchLabel && matchSearch;
    });
  }, [decisionLogs, filterLevel, filterLabel, searchQuery]);

  // Export to CSV
  const handleExportCSV = () => {
    soundFx.playClickBlip();
    const headers = [
      'Waktu',
      'ID SPPG',
      'Nama Dapur',
      'Wilayah',
      'Label Triase',
      'Tingkat Tercapai',
      'Keputusan',
      'Verifikator',
      'Alasan Tertulis',
      'Hasil Diubah?',
    ];
    const rows = decisionLogs.map((l) => [
      l.time,
      l.sppgId,
      l.kitchenName,
      l.region,
      l.label,
      l.tingkat,
      l.keputusan,
      l.verifikator,
      `"${l.alasan.replace(/"/g, '""')}"`,
      l.hasilDiubah ? 'Ya' : 'Tidak',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Register_Keputusan_Audit_MBG_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Register Keputusan berhasil diekspor ke format CSV.');
  };

  const activeLevelDef =
    LEVEL_DEFINITIONS.find((l) => l.levelNumber === selectedLadderLevel) || LEVEL_DEFINITIONS[1];

  return (
    <div className="px-6 sm:px-8 py-6 flex flex-col gap-6 max-w-[1600px] w-full mx-auto select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#011F7B] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-[#FFBA09] animate-bounce">
          <span className="material-symbols-outlined text-[#FFBA09] text-[22px]">check_circle</span>
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EBF0FF] text-[#011F7B] text-[11px] font-bold font-mono tracking-wider border border-[#CCD8FC]">
              <span className="w-2 h-2 rounded-full bg-[#FFBA09] animate-pulse"></span>
              PILAR AUDIT MBG • TANGGA BUKTI
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF4CC] text-[#8A5A00] text-[11px] font-bold tracking-wider border border-[#FFE28A]">
              <span className="material-symbols-outlined text-[14px]">info</span>
              SIMULASI ILUSTRATIF - data sintetis, bukan data BGN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#000F4A] tracking-tight">
            Tangga Bukti: Pemilahan Error vs Indikasi Kesengajaan
          </h1>
          <p className="text-xs sm:text-sm text-[#454652] max-w-4xl leading-relaxed">
            Mencegah lonjakan dari indikator risiko (Tingkat 1) langsung ke vonis (Tingkat 4).
            Setiap tingkat menuntut eskalasi bukti faktual objektif. Menahan uang, bukan menghukum orang.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast('Matriks pembuktian sedang diunduh...')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-[#E0E2E7] text-[#011F7B] text-xs font-bold hover:bg-[#F1F4F9] transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-[#FFBA09] outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Matriks Tangga Bukti (PDF)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#011F7B] text-white text-xs font-bold hover:bg-[#001760] transition-colors shadow-xs cursor-pointer focus:ring-2 focus:ring-[#FFBA09] outline-none"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#FFBA09]">file_download</span>
            <span>Ekspor Register (CSV)</span>
          </button>
        </div>
      </div>

      {/* Row 1: 3 Interactive KPI Cards (All Clickable!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Rasio pembatalan oleh verifikator */}
        <button
          onClick={() => {
            soundFx.playClickBlip();
            setActiveModal('cancellation');
          }}
          className="text-left bg-white p-5 rounded-xl border border-[#E0E2E7] hover:border-[#FFBA09] hover:shadow-md transition-all group cursor-pointer focus:ring-2 focus:ring-[#FFBA09] outline-none flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#525363] uppercase tracking-wider font-mono">
                KONTROL KUALITAS ATURAN
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#011F7B] flex items-center justify-center group-hover:bg-[#FFBA09] group-hover:text-[#011F7B] transition-colors">
                <span className="material-symbols-outlined text-[20px]">published_with_changes</span>
              </span>
            </div>
            <h3 className="text-xs font-semibold text-[#454652]">
              Rasio pembatalan oleh verifikator
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] font-mono tracking-tight">
                <AnimatedNumber value={cancellationRatio} suffix="%" />
              </span>
              <span className="text-xs font-bold text-[#1E9E6A] flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check</span>
                Target sehat &lt;10%
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F0F2F6] flex items-center justify-between text-[11px] text-[#011F7B] font-bold">
            <span>{modifiedLogs} dari {totalLogs} keputusan dikoreksi</span>
            <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Lihat Analisis <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </button>

        {/* KPI 2: Keputusan tercatat tak terhapus (jejak audit) */}
        <button
          onClick={() => {
            soundFx.playClickBlip();
            setActiveModal('immutable');
          }}
          className="text-left bg-white p-5 rounded-xl border border-[#E0E2E7] hover:border-[#FFBA09] hover:shadow-md transition-all group cursor-pointer focus:ring-2 focus:ring-[#FFBA09] outline-none flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#525363] uppercase tracking-wider font-mono">
                INTEGRITAS LOGGING RESMI
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#EBF0FF] text-[#011F7B] flex items-center justify-center group-hover:bg-[#FFBA09] group-hover:text-[#011F7B] transition-colors">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </span>
            </div>
            <h3 className="text-xs font-semibold text-[#454652]">
              Keputusan tercatat tak terhapus (jejak audit)
            </h3>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-[#000F4A] font-mono tracking-tight">
                100%
              </span>
              <span className="text-xs font-bold text-[#011F7B] px-2 py-0.5 bg-[#EBF0FF] rounded font-mono">
                APPEND-ONLY
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F0F2F6] flex items-center justify-between text-[11px] text-[#011F7B] font-bold">
            <span>Anti-manipulasi &amp; tanpa fitur hapus</span>
            <span className="inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Prinsip Audit <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </button>

        {/* KPI 3: Distribusi tingkat tercapai */}
        <div className="bg-white p-5 rounded-xl border border-[#E0E2E7] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-[#525363] uppercase tracking-wider font-mono">
                SEBARAN TINGKAT BUKTI
              </span>
              <span className="text-[11px] font-mono font-bold text-[#757683]">
                TOTAL: {totalLogs}
              </span>
            </div>
            <h3 className="text-xs font-semibold text-[#454652]">
              Distribusi tingkat tercapai (Klik filter)
            </h3>

            {/* Segmented Donut / Level Bar Distribution */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { lvl: 'Tingkat 1', label: 'T1: Risiko', count: countT1, color: '#011F7B', bg: '#EBF0FF' },
                { lvl: 'Tingkat 2', label: 'T2: Salah Saji', count: countT2, color: '#1E9E6A', bg: '#E8F6F0' },
                { lvl: 'Tingkat 3', label: 'T3: Indikasi', count: countT3, color: '#D64545', bg: '#FDECEC' },
              ].map((item) => {
                const isSelected = filterLevel === item.lvl;
                return (
                  <button
                    key={item.lvl}
                    onClick={() => {
                      soundFx.playClickBlip();
                      setFilterLevel(isSelected ? 'Semua' : item.lvl);
                    }}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#FFBA09] ring-2 ring-[#FFBA09]/40 bg-white shadow-sm'
                        : 'border-[#E0E2E7] hover:border-[#CCD8FC]'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-[#525363]">{item.label}</span>
                    <span className="text-lg font-extrabold font-mono" style={{ color: item.color }}>
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#F0F2F6] flex items-center justify-between text-[11px] text-[#757683]">
            <span>Filter aktif: <strong className="text-[#000F4A]">{filterLevel}</strong></span>
            {filterLevel !== 'Semua' && (
              <button
                onClick={() => setFilterLevel('Semua')}
                className="text-[#011F7B] font-bold hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Core Showcase: Dark Glassmorphism Canvas (Zones A & B) */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#011244] via-[#010F3D] to-[#000820] p-6 sm:p-8 text-white border border-[#011F7B]/80 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Blurred blue blobs background for futuristic visual depth */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1B3FBF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFBA09]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Faint blueprint grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Sweeping Scanner Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFBA09]/60 to-transparent pointer-events-none animate-scan-line" />

        {/* Top Status Strip */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-[#011F7B]/50 font-mono text-xs">
          <div className="flex items-center gap-2 text-[#FFBA09]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E6A] animate-pulse"></span>
            <span className="font-bold tracking-wider">
              MODE: SIMULASI | GERBANG: AKTIF | TINGKAT MAKS: 3
            </span>
          </div>
          <div className="text-[#B8C4E6] text-[11px]">
            PRINSIP: TANGGA BUKTI BERJENJANG • ANTI-LONCATAN LEVEL
          </div>
        </div>

        {/* Alert when Tingkat 4 or Lock is clicked */}
        {level4Alert && (
          <div className="relative z-20 mb-5 p-4 rounded-xl bg-[#D64545]/20 border border-[#D64545] text-white flex items-start gap-3 animate-polite-shake shadow-lg backdrop-blur-md">
            <span className="material-symbols-outlined text-[#FFBA09] text-[24px] shrink-0 mt-0.5">
              shield
            </span>
            <div className="flex-1">
              <span className="font-bold text-[#FFBA09] text-xs uppercase tracking-wider block font-mono">
                BATAS HUKUM GERBANG (LEGAL BOUNDARY)
              </span>
              <p className="text-xs sm:text-sm font-semibold mt-0.5 text-white leading-relaxed">
                {level4Alert}
              </p>
            </div>
            <button
              onClick={() => setLevel4Alert(null)}
              className="text-[#B8C4E6] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}

        {levelLockTooltip && (
          <div className="relative z-20 mb-5 p-3.5 rounded-xl bg-[#FFBA09]/20 border border-[#FFBA09] text-white flex items-center gap-2.5 shadow-md">
            <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">lock</span>
            <span className="text-xs font-bold text-[#FFBA09]">{levelLockTooltip}</span>
          </div>
        )}

        {/* Two-Column Grid: Zone A (Ladder) & Zone B (Panel Informasi) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ZONE A: Tangga Bukti (Vertical Ladder, 4 Levels Stacked Bottom to Top) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FFBA09] text-[22px]">stairs</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Tangga Bukti (Evidence Ladder)
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#B8C4E6] px-2 py-0.5 rounded bg-[#011F7B]/50 border border-[#011F7B]">
                BAWAH → ATAS
              </span>
            </div>

            {/* Vertical Ladder Container */}
            <div className="relative flex flex-col gap-3 py-2">
              {/* Vertical Connecting Central Line */}
              <div className="absolute left-[34px] sm:left-[38px] top-6 bottom-6 w-1 bg-[#011F7B]/60 rounded-full pointer-events-none" />

              {/* Energy Beam climbing to active level */}
              <div
                className="absolute left-[34px] sm:left-[38px] w-1 bg-gradient-to-t from-[#FFBA09] to-[#FFE58F] rounded-full pointer-events-none transition-all duration-700 animate-energy-glow"
                style={{
                  bottom: '24px',
                  height:
                    reachedLevel === 1
                      ? '22%'
                      : reachedLevel === 2
                      ? '52%'
                      : '80%',
                }}
              />

              {/* LEVEL 4: KESIMPULAN (LOCKED, TOP NODE) */}
              <div
                onClick={() => handleNodeClick(4)}
                className={`relative flex items-center gap-4 p-3.5 rounded-xl border border-dashed transition-all cursor-pointer group ${
                  shakeLevel4 ? 'animate-polite-shake' : ''
                } ${
                  selectedLadderLevel === 4
                    ? 'border-[#FFBA09] bg-[#021338]/90 ring-2 ring-[#FFBA09]/50'
                    : 'border-[#757683]/40 bg-[#020A1E]/60 opacity-60 hover:opacity-90 hover:border-[#FFBA09]/60'
                }`}
              >
                {/* Hexagon Node */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      fill="#060F2B"
                      stroke="#FFBA09"
                      strokeWidth="2.5"
                      strokeDasharray="5 3"
                    />
                  </svg>
                  <span className="absolute font-mono font-extrabold text-sm text-[#FFBA09]">
                    04
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D64545]/30 text-[#FF8585] border border-[#D64545]/60 text-[9px] font-mono font-bold tracking-wider">
                      DI LUAR GERBANG
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFBA09] transition-colors mt-0.5">
                    Tingkat 4: Kesimpulan
                  </h3>
                  <p className="text-[11px] text-[#B8C4E6] leading-snug mt-1">
                    Kesimpulan: pernyataan kerugian negara dan penetapan tindak pidana. Disimpulkan oleh: BPK (kerugian negara); APH dan pengadilan (unsur pidana). DI LUAR GERBANG.
                  </p>
                </div>

                <span className="material-symbols-outlined text-[#FFBA09] text-[20px] shrink-0">
                  lock
                </span>
              </div>

              {/* BARRIER LINE: BATAS GERBANG */}
              <div className="relative my-1 py-1 flex items-center justify-between gap-3">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#FFBA09] to-transparent animate-pulse" />
                <span className="px-3 py-1 rounded-full bg-[#FFBA09] text-[#000F4A] text-[10px] font-mono font-extrabold tracking-wider shadow-md shadow-[#FFBA09]/30 flex items-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[13px]">block</span>
                  BATAS GERBANG (NON-JUDICIAL)
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent via-[#FFBA09] to-transparent animate-pulse" />
              </div>

              {/* LEVEL 3: INDIKASI KESENGAJAAN */}
              <div
                onClick={() => handleNodeClick(3)}
                className={`relative flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  selectedLadderLevel === 3
                    ? 'border-[#FFBA09] bg-[#02184E] shadow-lg shadow-[#FFBA09]/15 ring-2 ring-[#FFBA09]/60'
                    : 'border-[#011F7B]/80 bg-[#011442]/80 hover:bg-[#02184E] hover:border-[#FFBA09]/50'
                }`}
              >
                {/* Hexagon Node */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      fill={selectedLadderLevel === 3 ? '#011F7B' : '#031033'}
                      stroke={selectedLadderLevel === 3 ? '#FFBA09' : '#1E40AF'}
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute font-mono font-extrabold text-sm text-[#FFBA09]">
                    03
                  </span>
                  {reachedLevel === 3 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D64545] border-2 border-white animate-ping" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#D64545]/20 text-[#FF8585] text-[9px] font-mono font-bold">
                      INSPEKTORAT / BPKP
                    </span>
                    {reachedLevel === 3 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#FFBA09] text-[#000F4A] text-[9px] font-bold font-mono">
                        KASUS AKTIF
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFBA09] transition-colors mt-0.5">
                    Tingkat 3: Indikasi Kesengajaan
                  </h3>
                  <p className="text-[11px] text-[#B8C4E6] truncate mt-0.5">
                    Salah saji disertai tanda penyembunyian atau pola berulang
                  </p>
                </div>

                <span className="material-symbols-outlined text-[#B8C4E6] group-hover:text-[#FFBA09] text-[20px] shrink-0">
                  chevron_right
                </span>
              </div>

              {/* LEVEL 2: BUKTI SALAH SAJI */}
              <div
                onClick={() => handleNodeClick(2)}
                className={`relative flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  selectedLadderLevel === 2
                    ? 'border-[#FFBA09] bg-[#02184E] shadow-lg shadow-[#FFBA09]/15 ring-2 ring-[#FFBA09]/60'
                    : 'border-[#011F7B]/80 bg-[#011442]/80 hover:bg-[#02184E] hover:border-[#FFBA09]/50'
                }`}
              >
                {/* Hexagon Node */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      fill={selectedLadderLevel === 2 ? '#011F7B' : '#031033'}
                      stroke={selectedLadderLevel === 2 ? '#FFBA09' : '#1E40AF'}
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute font-mono font-extrabold text-sm text-[#FFBA09]">
                    02
                  </span>
                  {reachedLevel === 2 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#1E9E6A] border-2 border-white animate-ping" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#1E9E6A]/20 text-[#A3DFC4] text-[9px] font-mono font-bold">
                      VERIFIKATOR BGN
                    </span>
                    {reachedLevel === 2 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#1E9E6A] text-white text-[9px] font-bold font-mono">
                        KASUS AKTIF
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFBA09] transition-colors mt-0.5">
                    Tingkat 2: Bukti Salah Saji
                  </h3>
                  <p className="text-[11px] text-[#B8C4E6] truncate mt-0.5">
                    Selisih terkonfirmasi antara laporan &amp; bukti fisik
                  </p>
                </div>

                <span className="material-symbols-outlined text-[#B8C4E6] group-hover:text-[#FFBA09] text-[20px] shrink-0">
                  chevron_right
                </span>
              </div>

              {/* LEVEL 1: INDIKATOR RISIKO (BOTTOM NODE) */}
              <div
                onClick={() => handleNodeClick(1)}
                className={`relative flex items-center gap-4 p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  selectedLadderLevel === 1
                    ? 'border-[#FFBA09] bg-[#02184E] shadow-lg shadow-[#FFBA09]/15 ring-2 ring-[#FFBA09]/60'
                    : 'border-[#011F7B]/80 bg-[#011442]/80 hover:bg-[#02184E] hover:border-[#FFBA09]/50'
                }`}
              >
                {/* Hexagon Node */}
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
                    <polygon
                      points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                      fill={selectedLadderLevel === 1 ? '#011F7B' : '#031033'}
                      stroke={selectedLadderLevel === 1 ? '#FFBA09' : '#1E40AF'}
                      strokeWidth="3"
                    />
                  </svg>
                  <span className="absolute font-mono font-extrabold text-sm text-[#FFBA09]">
                    01
                  </span>
                  {reachedLevel === 1 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#FFBA09] border-2 border-white animate-ping" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#011F7B] text-[#B8C4E6] text-[9px] font-mono font-bold">
                      MESIN ATURAN
                    </span>
                    {reachedLevel === 1 && (
                      <span className="px-1.5 py-0.2 rounded bg-[#FFBA09] text-[#000F4A] text-[9px] font-bold font-mono">
                        KASUS AKTIF
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#FFBA09] transition-colors mt-0.5">
                    Tingkat 1: Indikator Risiko
                  </h3>
                  <p className="text-[11px] text-[#B8C4E6] truncate mt-0.5">
                    Pola data menyimpang dari aturan (R1, R2, R4a, R5)
                  </p>
                </div>

                <span className="material-symbols-outlined text-[#B8C4E6] group-hover:text-[#FFBA09] text-[20px] shrink-0">
                  chevron_right
                </span>
              </div>
            </div>
          </div>

          {/* ZONE B: Panel Informasi (Dynamic Level Detail HUD) */}
          <div className="lg:col-span-7 bg-[#02123B]/80 rounded-2xl p-6 border border-[#011F7B] shadow-inner flex flex-col gap-5">
            {/* HUD Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#011F7B]/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#FFBA09] text-[#000F4A] font-mono text-xs font-extrabold">
                    TINGKAT {activeLevelDef.levelNumber}
                  </span>
                  {activeLevelDef.isLocked && (
                    <span className="px-2 py-0.5 rounded bg-[#D64545] text-white text-[10px] font-mono font-bold">
                      {activeLevelDef.lockedLabel}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-extrabold text-white mt-1">
                  {activeLevelDef.title}
                </h2>
                <p className="text-xs text-[#B8C4E6] mt-0.5 italic">
                  "{activeLevelDef.tagline}"
                </p>
              </div>

              {/* Authority Chip */}
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#011F7B]/70 border border-[#011F7B] text-xs">
                <span className="material-symbols-outlined text-[#FFBA09] text-[20px]">
                  {activeLevelDef.disimpulkanIcon}
                </span>
                <div>
                  <span className="text-[9px] block text-[#B8C4E6] uppercase font-mono">
                    Disimpulkan Oleh:
                  </span>
                  <span className="font-bold text-white text-xs">
                    {activeLevelDef.disimpulkanOleh}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist: Bukti Minimal */}
            <div>
              <span className="text-xs font-bold text-[#FFBA09] uppercase tracking-wider font-mono flex items-center gap-1.5 mb-2.5">
                <span className="material-symbols-outlined text-[16px]">checklist</span>
                Bukti Minimal yang Diperlukan:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activeLevelDef.buktiMinimal.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#031544] border border-[#011F7B] flex items-start gap-2"
                  >
                    <span className="material-symbols-outlined text-[#1E9E6A] text-[18px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="text-xs text-white leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid: Contoh di SARING-MBG & Tindakan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contoh */}
              <div className="p-4 rounded-xl bg-[#031544] border border-[#011F7B] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#FFBA09] uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    Contoh di SARING-MBG:
                  </span>
                  <p className="text-xs text-[#B8C4E6] leading-relaxed">
                    {activeLevelDef.contohDiSaring}
                  </p>
                </div>
              </div>

              {/* Tindakan */}
              <div className="p-4 rounded-xl bg-[#031544] border border-[#011F7B] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#FFBA09] uppercase font-mono tracking-wider flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-[16px]">gavel</span>
                    Tindakan yang Diambil:
                  </span>
                  <p className="text-xs text-white font-medium leading-relaxed">
                    {activeLevelDef.tindakan}
                  </p>
                </div>
              </div>
            </div>

            {/* Batas yang dijaga */}
            <div className="p-3.5 rounded-xl bg-[#011F7B]/50 border border-[#011F7B] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#FFBA09] text-[20px] shrink-0 mt-0.5">
                shield
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#FFBA09] uppercase tracking-wider font-mono">
                  Batas yang Dijaga:
                </span>
                <p className="text-xs text-[#B8C4E6] mt-0.5 leading-relaxed">
                  {activeLevelDef.batasDijaga}
                </p>
              </div>
            </div>

            {/* Expandable Accordion: "Mengapa begini?" */}
            <div className="border border-[#011F7B] rounded-xl overflow-hidden bg-[#031544]">
              <button
                onClick={() => {
                  soundFx.playClickBlip();
                  setIsAccordionOpen(!isAccordionOpen);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#011F7B]/40 transition-colors"
              >
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FFBA09] text-[18px]">
                    help_outline
                  </span>
                  Mengapa begini? (Rasional Hukum &amp; Batas Kewenangan Auditor)
                </span>
                <span className="material-symbols-outlined text-[#FFBA09] text-[18px] transition-transform duration-300">
                  {isAccordionOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {isAccordionOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-[#B8C4E6] leading-relaxed border-t border-[#011F7B]/40">
                  <p className="mb-2">
                    {activeLevelDef.mengapaBegini}
                  </p>
                  <p className="text-[#FFBA09] font-medium text-[11px]">
                    Aturan dasar: Auditor tidak membuat penetapan hukum bahwa fraud terjadi; kesengajaan adalah unsur hukum yang ditentukan melalui proses hukum pembuktian.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ZONE C: PENJELAJAH KASUS & REGISTER KEPUTUSAN */}

      {/* Part 1: Penjelajah Kasus (Interactive Case Simulator) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E2E7] shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F2F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#011F7B] text-[#FFBA09] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#000F4A] tracking-tight">
                  Penjelajah Kasus Interaktif
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EBF0FF] text-[#011F7B] text-[11px] font-mono font-bold">
                  SIMULASI LIVE
                </span>
              </div>
              <p className="text-xs text-[#525363] mt-0.5">
                Uji skenario lapangan atau sesuaikan saklar bukti untuk mengamati kenaikan tingkat secara faktual
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#525363] font-medium">Tingkat Evaluasi:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold flex items-center gap-1.5 ${
                reachedLevel === 1
                  ? 'bg-[#EBF0FF] text-[#011F7B] border border-[#CCD8FC]'
                  : reachedLevel === 2
                  ? 'bg-[#E8F6F0] text-[#1E9E6A] border border-[#A3DFC4]'
                  : 'bg-[#FDECEC] text-[#D64545] border border-[#F5B5B5]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              TINGKAT {reachedLevel} TERCAPAI
            </span>
          </div>
        </div>

        {/* 4 Segmented Scenario Presets */}
        <div>
          <span className="text-xs font-bold text-[#525363] uppercase tracking-wider font-mono block mb-2">
            1. Pilih Skenario Sintetis (Pre-set Bukti):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIOS.map((sc) => {
              const isSelected = activeScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#011F7B] bg-[#EBF0FF]/60 shadow-sm ring-2 ring-[#FFBA09]'
                      : 'border-[#E0E2E7] bg-[#F7F9FC] hover:bg-[#EEF2F8]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#011F7B] text-[#FFBA09]' : 'bg-[#E0E2E7] text-[#011F7B]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{sc.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#000F4A] leading-snug">
                        {sc.title}
                      </h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#525363] line-clamp-2 leading-relaxed">
                    {sc.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5 Toggle Switches: Bukti yang Ditemukan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#525363] uppercase tracking-wider font-mono block">
              2. Bukti yang Ditemukan di Lapangan (Ubah Bebas Saklar):
            </span>
            <div className="space-y-2.5">
              {[
                {
                  key: 'redFlag',
                  label: 'Red flag aktif (R1, R2, R4a, atau R5)',
                  desc: 'Pola anomali komparasi harga atau selisih arus kas dibaca mesin',
                },
                {
                  key: 'selisihTerkonfirmasi',
                  label: 'Selisih terkonfirmasi (dokumen / cek fisik / konfirmasi pihak ketiga)',
                  desc: 'Verifikator memeriksa nota basah dan konfirmasi absensi riil siswa',
                },
                {
                  key: 'tandaPenyembunyian',
                  label: 'Tanda penyembunyian atau dokumen sengaja direkayasa',
                  desc: 'Nota fiktif, stempel toko buatan, atau kuitansi palsu berturut-turut',
                },
                {
                  key: 'polaBerulang',
                  label: 'Pola berulang di banyak minggu',
                  desc: 'Penyimpangan terjadi terus-menerus tanpa ada upaya rektifikasi',
                },
                {
                  key: 'pemasokTerafiliasi',
                  label: 'Pemasok terafiliasi dengan pengurus dapur (konflik kepentingan)',
                  desc: 'Arus dana kas belanja mengalir ke keluarga atau rekening pengurus',
                },
              ].map((sw) => {
                const isChecked = toggles[sw.key as keyof typeof toggles];
                return (
                  <div
                    key={sw.key}
                    onClick={() => {
                      soundFx.playClickBlip();
                      setToggles((prev) => ({
                        ...prev,
                        [sw.key]: !prev[sw.key as keyof typeof toggles],
                      }));
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-[#011F7B] bg-[#F3F6FD]'
                        : 'border-[#E0E2E7] bg-white hover:bg-[#F9FAFC]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#000F4A] block">
                        {sw.label}
                      </span>
                      <span className="text-[11px] text-[#525363] mt-0.5 block">
                        {sw.desc}
                      </span>
                    </div>

                    {/* Toggle Switch */}
                    <div
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                        isChecked ? 'bg-[#011F7B]' : 'bg-[#D1D5DB]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          isChecked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Result Box & Action Button */}
          <div className="lg:col-span-5 bg-[#F8FAFD] rounded-xl p-5 border border-[#CCD8FC] flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#011F7B] uppercase font-mono tracking-wider">
                  HASIL EVALUASI ATURAN
                </span>
                <span className="text-xs font-mono font-bold text-[#000F4A]">
                  TINGKAT {reachedLevel}
                </span>
              </div>

              {/* Status Banner */}
              <div
                className={`p-3.5 rounded-xl border mb-3 flex items-start gap-2.5 ${
                  reachedLevel === 1
                    ? 'bg-[#EBF0FF] border-[#CCD8FC] text-[#011F7B]'
                    : reachedLevel === 2
                    ? 'bg-[#E8F6F0] border-[#A3DFC4] text-[#1E9E6A]'
                    : 'bg-[#FDECEC] border-[#F5B5B5] text-[#D64545]'
                }`}
              >
                <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
                  {reachedLevel === 1 ? 'info' : reachedLevel === 2 ? 'task_alt' : 'warning'}
                </span>
                <div>
                  <h4 className="text-xs font-extrabold leading-snug">
                    {reachedLevel === 1
                      ? 'Tingkat 1: Indikator Risiko (Perlu Verifikasi)'
                      : reachedLevel === 2
                      ? 'Tingkat 2: Bukti Salah Saji (Selesai Administratif)'
                      : 'Tingkat 3: Indikasi Kesengajaan (Rujukan Audit Investigatif)'}
                  </h4>
                  <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                    {reachedLevel === 1 &&
                      'Penyimpangan data terdeteksi pada komparasi mesin; porsi operasional ditahan sementara menunggu verifikasi.'}
                    {reachedLevel === 2 &&
                      'Salah saji terkonfirmasi tanpa tanda penyembunyian; nilai top-up dikoreksi, sisa dana dicairkan, dan dapur dibina.'}
                    {reachedLevel === 3 &&
                      'Terdapat tanda penyembunyian atau pola berulang; berkas diteruskan ke Inspektorat Utama / BPKP untuk audit investigatif.'}
                  </p>
                </div>
              </div>

              {/* Green Chip for Level 2 Without Concealment */}
              {reachedLevel === 2 && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-[#E8F6F0] border border-[#1E9E6A] flex items-center gap-2 text-[#0F603E] text-xs font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[18px] text-[#1E9E6A]">
                    verified
                  </span>
                  <span>Selesai administratif, kekeliruan dikoreksi dan dapur dibina</span>
                </div>
              )}

              {/* Slogan Golden Principle */}
              <div className="p-3 rounded-lg bg-[#FFF8E6] border border-[#FFE28A] text-[#8A5A00] text-xs font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#FFBA09] shrink-0">
                  gavel
                </span>
                <span>« Gerbang menahan uang, bukan menghukum orang. »</span>
              </div>

              {/* Written Reason Required Input */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-[#000F4A] mb-1">
                  Alasan Tertulis Verifikator <span className="text-[#D64545]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={customAlasan}
                  onChange={(e) => {
                    setCustomAlasan(e.target.value);
                    if (e.target.value.trim()) setReasonError(false);
                  }}
                  placeholder="Wajib mengisi pertimbangan verifikator..."
                  className={`w-full text-xs p-2.5 rounded-lg border bg-white text-[#000F4A] focus:ring-2 focus:ring-[#FFBA09] outline-none ${
                    reasonError
                      ? 'border-[#D64545] ring-1 ring-[#D64545]'
                      : 'border-[#CCD8FC]'
                  }`}
                />
                {reasonError && (
                  <span className="text-[11px] font-bold text-[#D64545] mt-1 block">
                    Alasan tertulis tidak boleh kosong untuk dicatat ke register!
                  </span>
                )}
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              onClick={handleRecordToRegister}
              className="w-full py-3 px-4 rounded-xl bg-[#FFBA09] text-[#011F7B] font-extrabold text-xs shadow-md shadow-[#FFBA09]/20 hover:bg-[#E5A700] transition-colors flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-[#011F7B] outline-none"
            >
              <span className="material-symbols-outlined text-[18px]">save_as</span>
              <span>Catat ke Register Keputusan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Part 2: Register Keputusan (Interactive Table & Slide-in Drawer) */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E0E2E7] shadow-sm flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F0F2F6]">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#011F7B] text-[24px]">history_edu</span>
              <h2 className="text-xl font-bold text-[#000F4A] tracking-tight">
                Register Keputusan Audit
              </h2>
              <span className="px-2 py-0.5 rounded bg-[#EBF0FF] text-[#011F7B] text-[11px] font-mono font-bold">
                {filteredLogs.length} ENTRI
              </span>
            </div>
            <p className="text-xs text-[#525363] mt-0.5">
              Jejak audit permanen tidak dapat dihapus. Klik baris tabel untuk meninjau riwayat timeline verifikasi.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari SPPG / Verifikator..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#CCD8FC] text-xs text-[#000F4A] focus:ring-2 focus:ring-[#FFBA09] outline-none"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#757683] text-[16px]">
              search
            </span>
          </div>
        </div>

        {/* Filter Pills: Level & Label */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#525363] font-mono">TINGKAT:</span>
            {['Semua', 'Tingkat 1', 'Tingkat 2', 'Tingkat 3'].map((lvl) => {
              const count =
                lvl === 'Semua'
                  ? decisionLogs.length
                  : decisionLogs.filter((l) => l.tingkat === lvl).length;
              return (
                <button
                  key={lvl}
                  onClick={() => {
                    soundFx.playClickBlip();
                    setFilterLevel(lvl);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterLevel === lvl
                      ? 'bg-[#011F7B] text-[#FFBA09] shadow-sm'
                      : 'bg-[#F1F4F9] text-[#454652] hover:bg-[#E5E9F2]'
                  }`}
                >
                  {lvl} <span className="opacity-70 font-mono text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#525363] font-mono">LABEL:</span>
            {['Semua', 'Hijau', 'Kuning', 'Merah'].map((lbl) => {
              const count =
                lbl === 'Semua'
                  ? decisionLogs.length
                  : decisionLogs.filter((l) => l.label === lbl).length;
              return (
                <button
                  key={lbl}
                  onClick={() => {
                    soundFx.playClickBlip();
                    setFilterLabel(lbl);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    filterLabel === lbl
                      ? 'bg-[#011F7B] text-[#FFBA09] shadow-sm'
                      : 'bg-[#F1F4F9] text-[#454652] hover:bg-[#E5E9F2]'
                  }`}
                >
                  {lbl} <span className="opacity-70 font-mono text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-[#E0E2E7]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFD] text-[#525363] font-mono font-bold uppercase tracking-wider text-[11px] border-b border-[#E0E2E7]">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">SPPG / Nama Dapur</th>
                <th className="py-3 px-3">Label</th>
                <th className="py-3 px-3">Tingkat</th>
                <th className="py-3 px-4">Keputusan</th>
                <th className="py-3 px-3">Verifikator</th>
                <th className="py-3 px-4">Alasan Tertulis</th>
                <th className="py-3 px-3">Hasil Diubah?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E2E7]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-[#757683]">
                    Tidak ada catatan keputusan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isNewlyAdded = log.id === newlyAddedLogId;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => {
                        soundFx.playClickBlip();
                        setSelectedDrawerLog(log);
                      }}
                      className={`hover:bg-[#F3F6FD] cursor-pointer transition-colors ${
                        isNewlyAdded ? 'bg-[#FFF8E6] font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono text-[#525363] whitespace-nowrap">
                        {log.time}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#000F4A]">
                        <div>{log.sppgId}</div>
                        <div className="text-[11px] font-normal text-[#525363]">{log.kitchenName}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            log.label === 'Hijau'
                              ? 'bg-[#E8F6F0] text-[#1E9E6A]'
                              : log.label === 'Kuning'
                              ? 'bg-[#FFF4CC] text-[#8A5A00]'
                              : 'bg-[#FDECEC] text-[#D64545]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {log.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#EBF0FF] text-[#011F7B] font-mono font-bold text-[11px]">
                          {log.tingkat}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#000F4A] max-w-[200px] truncate">
                        {log.keputusan}
                      </td>
                      <td className="py-3 px-3 text-[#525363] whitespace-nowrap">
                        {log.verifikator}
                      </td>
                      <td className="py-3 px-4 text-[#525363] max-w-[240px] truncate">
                        {log.alasan}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            log.hasilDiubah
                              ? 'bg-[#FFF4CC] text-[#8A5A00] border border-[#FFE28A]'
                              : 'bg-[#ECEEF3] text-[#525363]'
                          }`}
                        >
                          {log.hasilDiubah ? 'Ya (Koreksi)' : 'Tidak (Sesuai)'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Honesty Note */}
      <div className="p-4 rounded-xl bg-[#ECEEF3] border border-[#C5C5D4]/40 flex items-center justify-between gap-4 text-xs text-[#525363]">
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-[#011F7B]">policy</span>
          <span>
            Aturan tingkat dan ambang adalah usulan yang dikalibrasi pada uji coba pilot. Data sintetis, bukan data BGN.
          </span>
        </span>
        <span className="font-mono text-[11px] font-bold text-[#011F7B] shrink-0">
          SARING-MBG v1.0
        </span>
      </div>

      {/* RIGHT-SIDE DRAWER: Riwayat & Timeline Keputusan */}
      {selectedDrawerLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-7 overflow-y-auto flex flex-col justify-between border-l border-[#E0E2E7]">
            <div className="flex flex-col gap-5">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#F0F2F6]">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#011F7B] px-2 py-0.5 rounded bg-[#EBF0FF] uppercase">
                    DETAIL REGISTER KEPUTUSAN
                  </span>
                  <h3 className="text-lg font-bold text-[#000F4A] mt-1">
                    {selectedDrawerLog.sppgId}
                  </h3>
                  <p className="text-xs text-[#525363]">{selectedDrawerLog.kitchenName}</p>
                </div>
                <button
                  onClick={() => setSelectedDrawerLog(null)}
                  className="w-8 h-8 rounded-lg bg-[#F1F4F9] text-[#011F7B] flex items-center justify-center hover:bg-[#E0E2E7] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedDrawerLog.label === 'Hijau'
                      ? 'bg-[#E8F6F0] text-[#1E9E6A]'
                      : selectedDrawerLog.label === 'Kuning'
                      ? 'bg-[#FFF4CC] text-[#8A5A00]'
                      : 'bg-[#FDECEC] text-[#D64545]'
                  }`}
                >
                  Label: {selectedDrawerLog.label}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#011F7B] text-[#FFBA09] font-mono text-xs font-bold">
                  {selectedDrawerLog.tingkat}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#F1F4F9] text-[#525363] text-xs">
                  {selectedDrawerLog.region}
                </span>
              </div>

              {/* Vertical Audit Timeline */}
              <div>
                <span className="text-xs font-bold text-[#000F4A] uppercase tracking-wider font-mono block mb-3">
                  Jejak Audit Timeline:
                </span>
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E0E2E7]">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#011F7B] text-white flex items-center justify-center text-[9px] font-bold">
                      1
                    </span>
                    <span className="text-[10px] font-mono text-[#757683]">Kamis 07:59 WIB</span>
                    <h5 className="text-xs font-bold text-[#000F4A]">Dibaca Mesin Aturan</h5>
                    <p className="text-[11px] text-[#525363]">
                      Komparasi otomatis mendeteksi anomali pada laporan mingguan SPPG.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#011F7B] text-white flex items-center justify-center text-[9px] font-bold">
                      2
                    </span>
                    <span className="text-[10px] font-mono text-[#757683]">Kamis 08:30 WIB</span>
                    <h5 className="text-xs font-bold text-[#000F4A]">Verifikasi Bukti Faktual</h5>
                    <p className="text-[11px] text-[#525363]">
                      Pemeriksaan faktur nota basah dan konfirmasi pihak sekolah oleh verifikator.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#FFBA09] text-[#000F4A] flex items-center justify-center text-[9px] font-bold">
                      3
                    </span>
                    <span className="text-[10px] font-mono text-[#757683]">
                      {selectedDrawerLog.time}
                    </span>
                    <h5 className="text-xs font-bold text-[#000F4A]">Keputusan Register</h5>
                    <p className="text-[11px] font-semibold text-[#011F7B]">
                      {selectedDrawerLog.keputusan}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#1E9E6A] text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                    <span className="text-[10px] font-mono text-[#1E9E6A]">Selesai Tercatat</span>
                    <h5 className="text-xs font-bold text-[#000F4A]">Reviu &amp; Pengawasan</h5>
                    <p className="text-[11px] text-[#525363]">
                      Entri terkunci pada register BGN; tidak dapat dimodifikasi atau dihapus.
                    </p>
                  </div>
                </div>
              </div>

              {/* Written Reason Box */}
              <div className="p-4 rounded-xl bg-[#F8FAFD] border border-[#CCD8FC]">
                <span className="text-[11px] font-bold text-[#011F7B] uppercase font-mono block mb-1">
                  Alasan Tertulis Verifikator ({selectedDrawerLog.verifikator}):
                </span>
                <p className="text-xs text-[#000F4A] leading-relaxed">
                  "{selectedDrawerLog.alasan}"
                </p>
              </div>

              {/* Note on Decision Modification */}
              <div className="p-3 rounded-lg bg-[#ECEEF3] text-xs text-[#525363]">
                <strong className="text-[#000F4A]">Catatan Perubahan Sinyal: </strong>
                {selectedDrawerLog.hasilDiubah
                  ? 'Sinyal mesin awal disesuaikan oleh verifikator setelah dokumen bukti faktual diklarifikasi (koreksi administratif).'
                  : 'Keputusan verifikator mengonfirmasi dan melanjutkan rekomendasi sinyal mesin otomatis.'}
              </div>
            </div>

            <button
              onClick={() => setSelectedDrawerLog(null)}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#011F7B] text-white text-xs font-bold hover:bg-[#001760] transition-colors"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: Rasio Pembatalan Explainer */}
      {activeModal === 'cancellation' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E0E2E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#011F7B] text-[24px]">
                  published_with_changes
                </span>
                <h3 className="text-base font-bold text-[#000F4A]">
                  Mengapa Rasio Pembatalan Penting?
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#757683] hover:text-[#000F4A]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#454652] leading-relaxed">
              Rasio pembatalan mengukur seberapa sering verifikator manusia mengubah sinyal awal mesin aturan otomatis.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FFF4CC] border border-[#FFE28A] text-[#8A5A00] text-xs font-medium">
              « Angka yang terlalu tinggi menandakan masalah kualitas aturan atau integritas. Angka yang terlalu rendah menandakan verifikator hanya stempel otomatis tanpa verifikasi kritis. »
            </div>

            {/* Mini Visual Bar Comparison */}
            <div className="space-y-2 mt-1">
              <span className="text-[11px] font-bold text-[#525363] uppercase font-mono">
                Statistik Keputusan Saat Ini:
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-medium">
                  <span>Sinyal Diubah (Koreksi Verifikator):</span>
                  <span className="font-bold text-[#8A5A00] font-mono">{modifiedLogs} kasus ({cancellationRatio}%)</span>
                </div>
                <div className="w-full bg-[#ECEEF3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FFBA09] h-full"
                    style={{ width: `${cancellationRatio}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs pt-2">
                <div className="flex justify-between font-medium">
                  <span>Sinyal Sesuai / Diteruskan:</span>
                  <span className="font-bold text-[#011F7B] font-mono">
                    {totalLogs - modifiedLogs} kasus ({100 - cancellationRatio}%)
                  </span>
                </div>
                <div className="w-full bg-[#ECEEF3] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#011F7B] h-full"
                    style={{ width: `${100 - cancellationRatio}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#011F7B] text-white text-xs font-bold hover:bg-[#001760] transition-colors"
            >
              Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: Immutable Logging Explainer */}
      {activeModal === 'immutable' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E0E2E7] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0F2F6]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#011F7B] text-[24px]">
                  security
                </span>
                <h3 className="text-base font-bold text-[#000F4A]">
                  Prinsip Jejak Audit Tak Terhapus
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-[#757683] hover:text-[#000F4A]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#454652] leading-relaxed">
              Dalam sistem pencegahan MBG, seluruh tindakan verifikator dan penerbitan SPP dicatat dalam register berseri <em>append-only</em>.
            </p>

            <div className="p-3.5 rounded-xl bg-[#E8F6F0] border border-[#A3DFC4] text-[#0F603E] text-xs font-medium space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#1E9E6A]">verified</span>
                Fitur Penghapusan Ditiadakan (No Delete Button)
              </div>
              <p className="text-[11px] leading-relaxed">
                Tidak ada tombol hapus pada antarmuka sistem. Kesalahan koreksi harus dicatat sebagai entri pembetulan baru dengan mencantumkan alasan tertulis dan identitas verifikator.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#F8FAFD] border border-[#CCD8FC] text-xs text-[#525363] space-y-1">
              <span className="font-bold text-[#000F4A] block">Jaminan Kepatuhan Eksternal:</span>
              <p className="text-[11px]">
                Jejak audit ini dapat langsung diakses oleh BPK, BPKP, dan Aparat Pengawas Internal Pemerintah (APIP) tanpa risiko berkas hilang.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-2 w-full py-2.5 rounded-xl bg-[#011F7B] text-white text-xs font-bold hover:bg-[#001760] transition-colors"
            >
              Tutup Penjelasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
