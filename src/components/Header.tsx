/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-white z-40 border-b border-[#E0E2E7] shadow-[0_1px_8px_rgba(1,31,123,0.04)]">
      {/* Top subtle yellow border accent aligned with color palette */}
      <div className="h-0.5 bg-[#FFBA09] w-full"></div>

      <div className="h-[62px] w-full px-8 flex items-center justify-between">
        {/* Left: Persistent simulation honesty disclaimer chip */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#F7F9FE] border-[1.5px] border-[#011F7B] text-[#011F7B]">
            <span className="material-symbols-outlined text-[16px] text-[#011F7B]">
              warning
            </span>
            <span className="text-[11px] tracking-wider uppercase font-bold">
              SIMULASI ILUSTRATIF - data sintetis, bukan data BGN
            </span>
          </div>
        </div>

        {/* Right: Timestamp, User Identity, and Quick Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-[#454652] text-xs">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span>Pembaruan: Senin, sebelum penerbitan SPP (Minggu 4)</span>
          </div>

          <div className="w-px h-6 bg-[#C5C5D4]/60 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#181C20] leading-tight">
                Verifikator BGN
              </p>
              <p className="text-[11px] text-[#454652] uppercase tracking-wider font-semibold">
                Badan Gizi Nasional
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#000F4A] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Keluar ke Halaman Utama"
                className="p-1.5 rounded-lg hover:bg-[#F1F4F9] text-[#757683] hover:text-[#000F4A] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
