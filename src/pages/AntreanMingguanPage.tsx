/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Kitchen, Region, TriaseLabel, RedFlagCode } from '../types';
import { AnimatedNumber } from '../components/AnimatedNumber';

interface AntreanMingguanPageProps {
  kitchens: Kitchen[];
  onSelectKitchenForDetail: (kitchen: Kitchen) => void;
  onSendRecommendationToPPK: () => void;
}

export const AntreanMingguanPage: React.FC<AntreanMingguanPageProps> = ({
  kitchens,
  onSelectKitchenForDetail,
  onSendRecommendationToPPK,
}) => {
  const [selectedKitchenId, setSelectedKitchenId] = useState<string>('SPPG Contoh 087');
  const [triaseFilter, setTriaseFilter] = useState<'all' | TriaseLabel>('all');
  const [regionFilter, setRegionFilter] = useState<'all' | Region>('all');
  const [flagFilter, setFlagFilter] = useState<'all' | RedFlagCode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set(['SPPG Contoh 087']));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Kitchens with default priority sort (Merah > Kuning > Hijau)
  const filteredKitchens = useMemo(() => {
    const list = kitchens.filter((k) => {
      if (triaseFilter !== 'all' && k.triase !== triaseFilter) return false;
      if (regionFilter !== 'all' && k.region !== regionFilter) return false;
      if (flagFilter !== 'all' && !k.activeFlags.includes(flagFilter)) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = k.id.toLowerCase().includes(query);
        const matchesName = k.name.toLowerCase().includes(query);
        const matchesLocation = k.location.toLowerCase().includes(query);
        const matchesPartner = k.partner.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesLocation && !matchesPartner) return false;
      }
      return true;
    });

    // Default urgency ordering: Merah first, then Kuning, then Hijau
    const urgencyOrder: Record<TriaseLabel, number> = { Merah: 0, Kuning: 1, Hijau: 2 };
    return [...list].sort((a, b) => {
      const diff = urgencyOrder[a.triase] - urgencyOrder[b.triase];
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    });
  }, [kitchens, triaseFilter, regionFilter, flagFilter, searchQuery]);

  // Selected Kitchen Object for Drawer
  const selectedKitchen = useMemo(() => {
    return kitchens.find((k) => k.id === selectedKitchenId) || filteredKitchens[0] || kitchens[0];
  }, [kitchens, selectedKitchenId, filteredKitchens]);

  // Counts for Segmented Tabs
  const hijauCount = kitchens.filter((k) => k.triase === 'Hijau').length;
  const kuningCount = kitchens.filter((k) => k.triase === 'Kuning').length;
  const merahCount = kitchens.filter((k) => k.triase === 'Merah').length;

  const totalUsulan = kitchens.reduce((sum, k) => sum + k.topUpRequested, 0);
  const operasionalDitahan = kitchens
    .filter((k) => k.triase !== 'Hijau')
    .reduce((sum, k) => sum + k.heldBudget, 0);

  const totalUsulanMiliar = (totalUsulan / 1000000000).toFixed(2).replace('.', ',');
  const operasionalDitahanJuta = (operasionalDitahan / 1000000).toFixed(1).replace('.', ',');

  // Pagination
  const totalPages = Math.ceil(filteredKitchens.length / pageSize) || 1;
  const paginatedKitchens = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredKitchens.slice(start, start + pageSize);
  }, [filteredKitchens, currentPage, pageSize]);

  const toggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedRowIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRowIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.size === paginatedKitchens.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(paginatedKitchens.map((k) => k.id)));
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID SPPG', 'Nama Dapur', 'Wilayah', 'Triase', 'Red Flags', 'Dana Usulan', 'Bahan Baku', 'Operasional', 'Insentif (Usulan)', 'Dana Tertahan', 'Rekomendasi'];
    const rows = filteredKitchens.map((k) => [
      k.id,
      k.name,
      k.region,
      k.triase,
      k.activeFlags.join(';') || '-',
      k.topUpRequested,
      k.bahanBakuBudget || k.foodBudget,
      k.operasionalBudget,
      k.insentifBudget,
      k.heldBudget,
      k.recommendationAction
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Antrean_TopUp_Minggu4_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Daftar antrean berhasil diekspor ke format CSV/XLSX.');
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] w-full mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#000F4A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#fcb803] animate-bounce">
          <span className="material-symbols-outlined text-[#fcb803] text-[20px]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header & Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#454652] text-xs uppercase tracking-wider font-semibold">
            <span>PILAR AUDIT MBG</span>
            <span className="text-[#C5C5D4]">/</span>
            <span className="text-[#011F7B] font-bold">SIKLUS TOP-UP MINGGUAN</span>
          </div>
          <h1 className="text-2xl font-bold text-[#000F4A] tracking-tight">Antrean Top-up Minggu 4</h1>
          <p className="text-sm text-[#454652] max-w-3xl">
            Daftar antrean verifikasi kepatuhan dan status pelepasan dana operasional SPPG sebelum penerbitan Surat Permintaan Pembayaran (SPP) oleh Pejabat Pembuat Komitmen (PPK).
          </p>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#011F7B] border border-[#E0E2E7] text-sm font-semibold shadow-xs hover:bg-[#F1F4F9] transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Ekspor Daftar (XLSX)</span>
          </button>
          <button
            onClick={() => {
              onSendRecommendationToPPK();
              showToast('Rekomendasi triase antrean berhasil dikirimkan ke meja kerja PPK.');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#fcb803] text-[#000F4A] text-sm font-bold shadow-sm hover:bg-[#eaa700] transition-all focus:ring-4 focus:ring-[#fcb803]/30 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">send_and_archive</span>
            <span>Kirim Rekomendasi ke PPK</span>
          </button>
        </div>
      </div>

      {/* High-Urgency Executive Banner */}
      <div className="bg-gradient-to-r from-[#FFF0F0] via-[#FCEBEB] to-[#FFF5F5] rounded-xl p-5 border-2 border-[#D64545]/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#D64545] text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#D64545] text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                STATUS AUDIT MINGGU 4
              </span>
              <span className="text-xs font-bold text-[#B02A2A] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#D64545] animate-ping"></span>
                <span>{merahCount} SPPG ({((merahCount / kitchens.length) * 100).toFixed(1).replace('.', ',')}%) Kategori Merah</span>
              </span>
            </div>
            <p className="text-xs text-[#181C20] leading-relaxed max-w-4xl">
              Mekanisme proteksi likuiditas pra-SPP: untuk Kuning, bahan baku dicairkan, operasional &amp; insentif ditahan sementara (usulan 3 hari kerja). Untuk Merah, hanya bahan baku minimum dicairkan bila dapur terbukti beroperasi, operasional &amp; insentif ditahan (usulan 5 hari kerja). Total dana tertahan sementara: <strong>Rp {operasionalDitahanJuta} Juta</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          <div className="bg-white/90 border border-[#D64545]/30 rounded-lg px-3 py-2 text-right">
            <div className="text-[10px] text-[#757683] uppercase font-bold tracking-wider">Verifikasi Lapangan Inspektorat Utama BGN</div>
            <div className="text-sm font-extrabold text-[#D64545] font-mono">
              {merahCount} Dapur (usulan 5 hari kerja)
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E0E2E7] p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Control Triase Filter */}
          <div className="inline-flex p-1 rounded-lg bg-[#ECEEF3] flex-wrap gap-1">
            <button
              onClick={() => { setTriaseFilter('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                triaseFilter === 'all'
                  ? 'bg-white text-[#000F4A] shadow-xs'
                  : 'text-[#454652] hover:text-[#181C20]'
              }`}
            >
              Semua (<AnimatedNumber value={kitchens.length} />)
            </button>
            <button
              onClick={() => { setTriaseFilter('Hijau'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                triaseFilter === 'Hijau'
                  ? 'bg-white text-[#000F4A] shadow-xs'
                  : 'text-[#454652] hover:text-[#181C20]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
              <span>Hijau (<AnimatedNumber value={hijauCount} />)</span>
            </button>
            <button
              onClick={() => { setTriaseFilter('Kuning'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all flex items-center gap-1.5 ${
                triaseFilter === 'Kuning'
                  ? 'bg-white text-[#000F4A] shadow-xs'
                  : 'text-[#454652] hover:text-[#181C20]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#fcb803]"></span>
              <span>Kuning (<AnimatedNumber value={kuningCount} />)</span>
            </button>
            <button
              onClick={() => { setTriaseFilter('Merah'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                triaseFilter === 'Merah'
                  ? 'bg-[#D64545] text-white shadow-xs'
                  : 'bg-[#FCEBEB] text-[#B02A2A] hover:bg-[#F8D7D7]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#D64545] animate-ping"></span>
              <span>Merah (<AnimatedNumber value={merahCount} />)</span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold tracking-wider ${
                triaseFilter === 'Merah' ? 'bg-white/25 text-white' : 'bg-[#D64545] text-white'
              }`}>
                DOMINAN 75,2%
              </span>
            </button>
          </div>

          {/* Quick Summary Metrics Counter Strip */}
          <div className="hidden xl:flex items-center gap-4 text-[#454652] text-xs bg-[#F1F4F9] px-3.5 py-1.5 rounded-lg border border-[#E0E2E7]">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-[#757683] font-semibold">Total Usulan:</span>
              <span className="font-bold text-[#000F4A] tabular-nums font-mono">
                <AnimatedNumber value={totalUsulan / 1000000000} decimals={2} prefix="Rp " suffix=" Miliar" />
              </span>
            </div>
            <span className="text-[#C5C5D4]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-[#757683] font-semibold">Dana Tertahan:</span>
              <span className="font-bold text-[#D64545] tabular-nums font-mono">Rp {operasionalDitahanJuta} Juta</span>
            </div>
            <span className="text-[#C5C5D4]">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] uppercase tracking-wider text-[#B02A2A] font-bold">Prioritas Inspektorat Utama BGN:</span>
              <span className="px-2 py-0.5 rounded bg-[#FCEBEB] text-[#D64545] font-bold font-mono text-[11px]">
                {merahCount} SPPG
              </span>
            </div>
          </div>
        </div>

        {/* Search & Advanced Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#757683]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Cari ID SPPG atau penanggung jawab..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E0E2E7] rounded-lg text-[#000F4A] placeholder:text-[#757683] focus:outline-none focus:ring-2 focus:ring-[#011F7B]/20"
            />
          </div>

          {/* Red Flag Dropdown */}
          <div className="md:col-span-3">
            <select
              value={flagFilter}
              onChange={(e) => { setFlagFilter(e.target.value as any); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E2E7] rounded-lg text-[#000F4A] focus:outline-none focus:ring-2 focus:ring-[#011F7B]/20 cursor-pointer"
            >
              <option value="all">Semua Red Flag</option>
              <option value="R1">R1 (Duplikasi Rekening VA)</option>
              <option value="R2">R2 (SPPG Belum Beroperasi / SLHS)</option>
              <option value="R4a">R4a (Biaya Bahan &gt; Pagu)</option>
              <option value="R5">R5 (Rekonsiliasi Lapor vs VA)</option>
            </select>
          </div>

          {/* Wilayah Dropdown */}
          <div className="md:col-span-3">
            <select
              value={regionFilter}
              onChange={(e) => { setRegionFilter(e.target.value as any); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-sm bg-white border border-[#E0E2E7] rounded-lg text-[#000F4A] focus:outline-none focus:ring-2 focus:ring-[#011F7B]/20 cursor-pointer"
            >
              <option value="all">Semua Wilayah Kerja</option>
              <option value="Wilayah A">Wilayah A</option>
              <option value="Wilayah B">Wilayah B</option>
              <option value="Wilayah C">Wilayah C</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={() => {
                setTriaseFilter('all');
                setRegionFilter('all');
                setFlagFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              title="Reset penyaringan"
              type="button"
              className="w-full py-2 px-1 text-center text-xs font-semibold text-[#757683] hover:text-[#ba1a1a] transition-colors flex items-center justify-center gap-1 rounded hover:bg-[#ECEEF3] border border-transparent hover:border-[#E0E2E7]"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Table ~67% & Detail Drawer ~33%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Table Section (8 of 12 columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="bg-white rounded-xl shadow-xs border border-[#E0E2E7] overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#011F7B] text-white text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedKitchens.length > 0 && selectedRowIds.size === paginatedKitchens.length}
                        onChange={toggleSelectAll}
                        className="rounded text-[#011F7B] focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">ID SPPG</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Wilayah</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Triase</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Red Flag</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">Dana Usulan (Rp)</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">Tindakan Rekomendasi</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">Batas Verifikasi</th>
                    <th className="py-2.5 px-3 text-center w-12">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEEF3] text-xs text-[#181C20]">
                  {paginatedKitchens.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-[#454652]">
                        <span className="material-symbols-outlined text-3xl text-[#757683] block mb-1">search_off</span>
                        Tidak ada unit SPPG yang cocok dengan penyaringan yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    paginatedKitchens.map((k) => {
                      const isSelected = selectedKitchen.id === k.id;
                      const isChecked = selectedRowIds.has(k.id);

                      let triaseBadgeClass = 'bg-[#E8F6F0] text-[#1E9E6A]';
                      let triaseIcon = 'check_circle';
                      let shadowHighlight = 'shadow-[inset_4px_0_0_#1E9E6A]';

                      if (k.triase === 'Merah') {
                        triaseBadgeClass = 'bg-[#FCEBEB] text-[#B02A2A]';
                        triaseIcon = 'dangerous';
                        shadowHighlight = 'shadow-[inset_4px_0_0_#ba1a1a]';
                      } else if (k.triase === 'Kuning') {
                        triaseBadgeClass = 'bg-[#FFF4CC] text-[#8A5A00]';
                        triaseIcon = 'warning';
                        shadowHighlight = 'shadow-[inset_4px_0_0_#fcb803]';
                      }

                      return (
                        <tr
                          key={k.id}
                          onClick={() => setSelectedKitchenId(k.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? `bg-[#F1F4F9] ${shadowHighlight}`
                              : 'hover:bg-[#F7F9FE]'
                          }`}
                        >
                          <td className="py-3 px-3 text-center" onClick={(e) => toggleSelectRow(k.id, e)}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded text-[#011F7B] focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#000F4A] whitespace-nowrap">
                            {k.id}
                          </td>
                          <td className="py-3 px-3 text-[#454652] whitespace-nowrap">
                            {k.region}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${triaseBadgeClass}`}>
                              <span className="material-symbols-outlined text-[13px]">{triaseIcon}</span>
                              <span>{k.triase}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {k.activeFlags.length === 0 ? (
                              <span className="text-[#757683]">-</span>
                            ) : (
                              <div className="flex items-center gap-1">
                                {k.activeFlags.map((flag) => (
                                  <span
                                    key={flag}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      k.triase === 'Merah'
                                        ? 'bg-[#FCEBEB] text-[#B02A2A]'
                                        : 'bg-[#FFF4CC] text-[#8A5A00]'
                                    }`}
                                  >
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-[#000F4A] tabular-nums font-mono whitespace-nowrap">
                            Rp {k.topUpRequested.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3 text-[#181C20] whitespace-nowrap">
                            {k.recommendationAction}
                          </td>
                          <td className={`py-3 px-3 text-center font-semibold tabular-nums whitespace-nowrap ${
                            k.triase === 'Merah' ? 'text-[#D64545]' : k.triase === 'Kuning' ? 'text-[#8A5A00]' : 'text-[#757683]'
                          }`}>
                            {k.verificationDeadline}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectKitchenForDetail(k);
                              }}
                              title="Buka Detail Kasus Lengkap"
                              className="p-1 rounded hover:bg-white text-[#011F7B]"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                chevron_right
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-4 py-3 bg-[#F1F4F9] border-t border-[#E0E2E7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#454652]">
              <div className="flex items-center gap-3">
                <span>
                  Menampilkan <strong className="text-[#000F4A] font-bold">
                    {filteredKitchens.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
                    {Math.min(currentPage * pageSize, filteredKitchens.length)}
                  </strong> dari <strong className="text-[#000F4A] font-bold">{filteredKitchens.length}</strong> unit SPPG
                </span>
                <div className="hidden md:flex items-center gap-1.5">
                  <span>Ukuran:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-white border border-[#E0E2E7] rounded px-1.5 py-0.5 text-[#000F4A] text-xs focus:outline-none"
                  >
                    <option value={10}>10 / halaman</option>
                    <option value={25}>25 / halaman</option>
                    <option value={50}>50 / halaman</option>
                  </select>
                </div>
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1 select-none">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded hover:bg-white border border-transparent hover:border-[#E0E2E7] text-[#757683] transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  &lt; Sebelumnya
                </button>
                <span className="px-3 py-1 rounded bg-[#011F7B] text-white font-bold text-xs">
                  {currentPage}
                </span>
                <span className="text-xs text-[#757683]">dari {totalPages}</span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded hover:bg-white border border-transparent hover:border-[#E0E2E7] text-[#000F4A] font-semibold transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Selanjutnya &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Legend Box under Table */}
          <div className="bg-[#F1F4F9] rounded-xl p-4 border border-[#E0E2E7] space-y-2">
            <div className="flex items-center gap-1.5 text-[#000F4A] text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">policy</span>
              <span>Panduan Kebijakan Triase Gerbang Mingguan</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
              {/* Hijau Legend */}
              <div className="p-3 rounded-lg bg-white border border-[#E0E2E7] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#1E9E6A]">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Hijau (Siap Salur)</span>
                </div>
                <p className="text-[#454652] leading-relaxed text-[11px]">
                  Semua 3 komponen dicairkan (bahan baku, operasional, dan insentif) langsung ke rekening operasional SPPG tanpa penahanan.
                </p>
              </div>

              {/* Kuning Legend */}
              <div className="p-3 rounded-lg bg-white border border-[#E0E2E7] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#8A5A00]">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Kuning (Klarifikasi Dokumen)</span>
                </div>
                <p className="text-[#454652] leading-relaxed text-[11px]">
                  Bahan baku tetap cair; operasional dan insentif ditahan sementara menunggu klarifikasi tertulis (usulan 3 hari kerja).
                </p>
              </div>

              {/* Merah Legend */}
              <div className="p-3 rounded-lg bg-white border border-[#E0E2E7] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#D64545]">
                  <span className="material-symbols-outlined text-[16px]">dangerous</span>
                  <span>Merah (Audit Investigasi)</span>
                </div>
                <p className="text-[#454652] leading-relaxed text-[11px]">
                  Hanya bahan baku minimum darurat bila SPPG terbukti ada &amp; beroperasi; operasional &amp; insentif ditahan (usulan); verifikasi lapangan usulan 5 hari kerja.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Detail Drawer / Side Panel (4 of 12 columns) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 sticky top-20">
          <div className="bg-white rounded-xl shadow-md border border-[#E0E2E7] overflow-hidden">
            {/* Drawer Header */}
            <div className="bg-[#011F7B] p-4 text-white flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#fcb803]">
                    Berkas Pemeriksaan
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{selectedKitchen.id}</h2>
                <div className="pt-0.5">
                  {selectedKitchen.triase === 'Merah' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-[#FCEBEB] text-[#B02A2A] uppercase font-bold tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">dangerous</span>
                      <span>MERAH - TAHAN OPERASIONAL</span>
                    </span>
                  )}
                  {selectedKitchen.triase === 'Kuning' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-[#FFF4CC] text-[#8A5A00] uppercase font-bold tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>KUNING - VERIFIKASI DOKUMEN</span>
                    </span>
                  )}
                  {selectedKitchen.triase === 'Hijau' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-[#E8F6F0] text-[#1E9E6A] uppercase font-bold tracking-wider">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>HIJAU - SIAP SALUR PENUH</span>
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSelectKitchenForDetail(selectedKitchen)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                title="Buka Halaman Detail Penuh"
              >
                <span>Buka Detail</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="p-4 space-y-4 text-xs">
              {/* Section 1: Profil Dapur */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#757683]">
                  <span className="material-symbols-outlined text-[15px]">soup_kitchen</span>
                  <span>1. Profil Dapur &amp; Penanggung Jawab</span>
                </div>
                <div className="bg-[#F1F4F9] rounded-lg p-3 space-y-1.5 border border-[#E0E2E7]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#454652]">Nama Dapur:</span>
                    <span className="font-semibold text-[#000F4A]">{selectedKitchen.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#454652]">Lokasi Layanan:</span>
                    <span className="font-medium text-[#181C20]">{selectedKitchen.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#454652]">Kapasitas:</span>
                    <span className="font-medium text-[#181C20]">{selectedKitchen.capacityLabel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#454652]">Mitra Pengelola:</span>
                    <span className="font-semibold text-[#011F7B]">{selectedKitchen.partner}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Rincian Anggaran */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#757683]">
                  <span className="material-symbols-outlined text-[15px]">payments</span>
                  <span>2. Rincian Anggaran Diajukan</span>
                </div>
                <div className="rounded-lg p-3 bg-[#F1F4F9] space-y-2 border border-[#E0E2E7]">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#454652]">Total Usulan Top-Up:</span>
                    <span className="text-base font-bold text-[#000F4A] tabular-nums font-mono">
                      Rp {selectedKitchen.topUpRequested.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#454652] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
                        <span>Bahan Baku (Pagu Dilindungi)</span>
                      </span>
                      <span className="font-bold text-[#1E9E6A] tabular-nums font-mono">
                        Rp {(selectedKitchen.bahanBakuBudget || selectedKitchen.foodBudget).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#454652] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#011F7B]"></span>
                        <span>Operasional Dapur</span>
                      </span>
                      <span className="font-bold text-[#000F4A] tabular-nums font-mono">
                        Rp {(selectedKitchen.operasionalBudget || Math.round(selectedKitchen.topUpRequested * 0.2)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#454652] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FFBA09]"></span>
                        <span>Insentif (Rp2.000/porsi)</span>
                        <span className="text-[9px] px-1 py-0.2 bg-[#FFBA09]/20 text-[#8A5A00] font-bold rounded">USULAN</span>
                      </span>
                      <span className="font-bold text-[#8A5A00] tabular-nums font-mono">
                        Rp {(selectedKitchen.insentifBudget || (selectedKitchen.weeklyPortions * 2000)).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#E0E2E7]">
                      <span className="text-[#454652] flex items-center gap-1 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#D64545]"></span>
                        <span>Dana Tertahan (Ilustrasi)</span>
                      </span>
                      <span className={`font-bold tabular-nums font-mono ${
                        selectedKitchen.triase === 'Hijau' ? 'text-[#757683]' : 'text-[#D64545]'
                      }`}>
                        Rp {selectedKitchen.triase === 'Hijau' ? '0' : selectedKitchen.heldBudget.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 text-[10px] text-[#757683] font-medium flex justify-between">
                    <span>Perlakuan Insentif: <strong className="text-[#000F4A]">Usulan</strong></span>
                    <span>Status: <strong className={selectedKitchen.triase === 'Hijau' ? 'text-[#1E9E6A]' : selectedKitchen.triase === 'Kuning' ? 'text-[#8A5A00]' : 'text-[#D64545]'}>{selectedKitchen.triase}</strong></span>
                  </div>
                </div>
              </div>

              {/* Section 3: Indikator Red Flag */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#757683]">
                  <span className="material-symbols-outlined text-[15px]">flag</span>
                  <span>3. Indikator Red Flag Terpicu</span>
                </div>
                <div className="space-y-1.5">
                  {selectedKitchen.activeFlags.length === 0 ? (
                    <div className="p-3 rounded-lg bg-[#E8F6F0] text-[#1E9E6A] flex items-center gap-2 border border-[#A3DFC4]">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Tidak ditemukan red flag aktif. Semua parameter kepatuhan terpenuhi.</span>
                    </div>
                  ) : (
                    selectedKitchen.activeFlags.map((code) => {
                      let title = '';
                      let desc = '';
                      let diff = '';

                      if (code === 'R4a') {
                        title = 'R4a: Integritas Nota Logistik / Pagu';
                        const diffPct = (((selectedKitchen.reportedCostPerPortion - selectedKitchen.paguPerPorsi) / selectedKitchen.paguPerPorsi) * 100).toFixed(1);
                        diff = `Deviasi +${diffPct}%`;
                        desc = `Biaya bahan Rp ${selectedKitchen.reportedCostPerPortion.toLocaleString('id-ID')}/porsi melebihi pagu regional Rp ${selectedKitchen.paguPerPorsi.toLocaleString('id-ID')}.`;
                      } else if (code === 'R5') {
                        title = 'R5: Rekonsiliasi Rekening VA';
                        const diffRp = Math.abs(selectedKitchen.reportedSpendTotal - selectedKitchen.vaOutflowTotal);
                        const diffPct = ((diffRp / selectedKitchen.reportedSpendTotal) * 100).toFixed(1);
                        diff = `Selisih ${diffPct}%`;
                        desc = `Selisih Rp ${diffRp.toLocaleString('id-ID')} antara lapor harian SPPG vs mutasi keluar VA BGN.`;
                      } else if (code === 'R1') {
                        title = 'R1: Duplikasi Rekening VA';
                        diff = 'VA Ganda';
                        desc = `Ditemukan ${selectedKitchen.activeVaCount} virtual account aktif pada unit dapur dan penanggung jawab yang sama.`;
                      } else if (code === 'R2') {
                        title = 'R2: Status Operasional SPPG';
                        diff = `Status: ${selectedKitchen.status}`;
                        desc = 'Top-up diajukan untuk SPPG yang belum beroperasi, disuspend, atau belum ber-SLHS.';
                      } else if (code === 'R3') {
                        title = 'R3: Penetapan Penerima / Hari Layanan';
                        diff = 'Anomali Porsi';
                        desc = 'Porsi harian yang dilaporkan melebihi alokasi penetapan penerima atau dilaporkan pada hari non-layanan.';
                      }

                      return (
                        <div key={code} className="p-2.5 rounded-lg bg-[#F1F4F9] border border-[#E0E2E7] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FCEBEB] text-[#B02A2A]">
                              {title}
                            </span>
                            <span className="text-[#D64545] font-bold font-mono">{diff}</span>
                          </div>
                          <p className="text-[11px] text-[#454652] leading-snug">
                            {desc}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Section 4: Tindakan Audit & Timeline */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#757683]">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  <span>4. Tindakan Audit &amp; Batas Waktu</span>
                </div>
                <div className="p-3 rounded-lg bg-[#ECEEF3] space-y-1.5 border border-[#C5C5D4]/40">
                  <div className="flex items-center justify-between">
                    <span className="text-[#454652]">Rekomendasi Utama:</span>
                    <span className="font-semibold text-[#000F4A]">{selectedKitchen.recommendationAction}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#454652]">Sisa Waktu Klarifikasi:</span>
                    <span className="font-bold text-[#D64545] flex items-center gap-1 font-mono">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      <span>{selectedKitchen.verificationDeadline}</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-[#757683]">
                    Jatuh tempo SPP: Selasa, 16:00 WIB
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => onSelectKitchenForDetail(selectedKitchen)}
                    className="w-full py-2.5 px-3 rounded-lg bg-[#011F7B] text-white font-bold shadow-xs hover:bg-[#000F4A] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_search</span>
                    <span>Buka Detail Kasus Lengkap</span>
                  </button>
                  <button
                    onClick={() => {
                      showToast(`Surat Tugas Verifikasi Lapangan untuk ${selectedKitchen.id} sedang disiapkan.`);
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-[#E0E2E7] text-[#011F7B] font-semibold shadow-xs hover:bg-[#F1F4F9] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                    <span>Terbitkan Surat Verifikasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
