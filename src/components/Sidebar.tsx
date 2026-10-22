/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PageId } from '../types';
import { SaringLogoSvg } from './SaringLogoSvg';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, onLogout }) => {
  // Pure 6 audit navigation items
  const navItems: { id: PageId; label: string; icon: string }[] = [
    { id: 'ringkasan', label: 'Ringkasan', icon: 'analytics' },
    { id: 'antrean-mingguan', label: 'Antrean Mingguan', icon: 'pending_actions' },
    { id: 'simulator-ambang', label: 'Simulator Ambang', icon: 'tune' },
    { id: 'kamus-red-flag', label: 'Kamus Red Flag', icon: 'menu_book' },
    { id: 'error-vs-fraud', label: 'Error vs Fraud', icon: 'rule' },
    { id: 'indikator-pilot', label: 'Indikator Pilot', icon: 'flag_circle' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#011F7B] z-50 flex flex-col justify-between text-white select-none shadow-2xl overflow-y-auto">
      <div className="flex flex-col">
        {/* Brand Header (Di atasnya Pilar Audit MBG) - Dikembalikan ke semula: Navy #011F7B dengan teks putih */}
        <div className="px-6 pt-6 pb-5 border-b border-white/10 bg-[#011F7B]">
          <div className="flex items-center gap-2.5 mb-1 text-left">
            <div className="w-8 h-8 shrink-0 flex items-center justify-center p-0.5 rounded-lg bg-[#000F4A] border border-[#FFBA09]/40 shadow-xs">
              <SaringLogoSvg size={28} theme="dark" animated={true} idSuffix="nav-brand" />
            </div>
            <span className="text-[1.375rem] font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
              SARING-MBG
            </span>
          </div>
          <p className="text-xs text-white/70 leading-snug">
            Gerbang red flag sebelum top-up mingguan
          </p>
        </div>

        {/* Section di Bawah Pilar Audit MBG - Gradasi Biru ke Hitam dengan Aksen Kuning Emas */}
        <div className="relative flex-1 bg-gradient-to-b from-[#011F7B] via-[#010F3D] to-[#00081F] pb-4">
          {/* Ambient yellow/gold glow refleksi halus */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBA09]/5 rounded-full blur-2xl pointer-events-none"></div>

          {/* Section Title: Pilar Audit MBG */}
          <div className="px-6 pt-5 pb-2.5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              Pilar Audit MBG
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFBA09] animate-pulse"></span>
          </div>

          {/* Navigation Items dengan Gradasi Aksen Kuning Emas (#FFBA09) saat Aktif */}
          <nav className="flex flex-col gap-1 relative z-10">
            {navItems.map((item) => {
              const isActive =
                activePage === item.id ||
                (item.id === 'antrean-mingguan' && activePage === 'detail-kasus');
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FFBA09]/20 via-[#FFBA09]/10 to-transparent text-white border-l-4 border-[#FFBA09] font-bold shadow-xs'
                      : 'text-white/80 hover:bg-white/5 hover:text-white border-l-4 border-transparent font-normal'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${
                      isActive ? 'text-[#FFBA09]' : 'text-white/70'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Protocol Version Footer & Logout Button (Gradasi Hitam Gelap di Bawah) */}
      <div className="px-6 pb-6 pt-4 bg-[#00081F] border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between text-white/70 text-xs">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#1E9E6A]"></span>
            Protokol Aktif
          </span>
          <span className="text-[11px] font-mono uppercase font-semibold text-white/80">
            v1.4
          </span>
        </div>
        <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
          Kementerian Keuangan RI
        </p>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[11px] font-medium transition-colors cursor-pointer border border-white/10"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Keluar ke Beranda</span>
          </button>
        )}
      </div>
    </aside>
  );
};
