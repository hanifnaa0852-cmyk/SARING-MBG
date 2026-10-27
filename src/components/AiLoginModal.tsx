/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SaringLogoSvg } from './SaringLogoSvg';
import { soundFx } from '../utils/soundEffects';

interface AiLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AiLoginModal: React.FC<AiLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isAssembled, setIsAssembled] = useState<boolean>(false);

  const stepMessages = [
    'MENGUMPULKAN KEPINGAN DATA: 500 VIRTUAL ACCOUNT & LOGISTIK...',
    'PENARIKAN KEPINGAN FISKAL: KISI SARINGAN & PERISAI AUDIT BERSATU...',
    'MENGUNCI PERISAI TATA KELOLA DANA MAKAN BERGIZI GRATIS...',
    'LOGO UTUH TERVALIDASI! PROTOKOL GERBANG AUDIT TERBUKA RESMI...',
  ];

  const shardLabels = [
    { name: 'Keping 1: Pagu Bahan Rp10.000', icon: 'payments', pos: 'top-2 left-2' },
    { name: 'Keping 2: 500 Virtual Account', icon: 'account_balance', pos: 'top-2 right-2' },
    { name: 'Keping 3: Nutrisi & Gizi Anak', icon: 'restaurant', pos: 'bottom-2 left-2' },
    { name: 'Keping 4: Saringan Pra-SPP', icon: 'verified_user', pos: 'bottom-2 right-2' },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setProgress(0);
      setIsAssembled(false);
      return;
    }

    // Trigger futuristic AI login audio sequence
    soundFx.playAiLoginSequence();

    // Progress animation loop over 2.6 seconds for graceful shard assembly
    const startTime = Date.now();
    const duration = 2600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStep(0);
        setIsAssembled(false);
      } else if (pct < 65) {
        setStep(1);
        setIsAssembled(false);
      } else if (pct < 88) {
        setStep(2);
        setIsAssembled(false);
      } else {
        setStep(3);
        setIsAssembled(true);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onSuccess();
        }, 400);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#010B2A]/90 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Ambient Deep Space Blue & Golden Aura Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-[#011F7B]/50 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-[380px] h-[380px] bg-[#FFBA09]/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#011448]/95 via-[#000E38]/95 to-[#000820]/95 border border-[#FFBA09]/60 rounded-3xl p-8 shadow-[0_0_70px_rgba(255,186,9,0.3)] flex flex-col items-center text-center overflow-hidden">
        {/* Futuristic Golden Corner L-Brackets */}
        <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FFBA09]"></div>
        <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#FFBA09]"></div>
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#FFBA09]"></div>
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FFBA09]"></div>

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#011F7B] border border-[#FFBA09]/60 text-[#FFBA09] text-[10px] font-mono tracking-widest uppercase mb-4 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#4AE3A0] animate-ping"></span>
          <span>REKONSTRUKSI KEPINGAN LOGO SARING-MBG</span>
        </div>

        {/* Dynamic Subtext */}
        <p className="text-xs text-[#B8C4E6] mb-3 max-w-md">
          {progress < 75
            ? 'Kepingan perisai audit, kisi data, dan mangkuk nutrisi bergerak menyatu...'
            : 'Kepingan saling mengunci! Lambang pengawasan fiskal MBG terbentuk sempurna.'}
        </p>

        {/* CENTERPIECE: Holographic Stage with Floating Shards assembling into Logo */}
        <div className="relative w-full h-64 my-1 flex items-center justify-center">
          {/* Circular Holographic Magnetic Field Rings */}
          <div
            className="absolute w-56 h-56 rounded-full border border-[#FFBA09]/25 border-dashed animate-spin pointer-events-none"
            style={{ animationDuration: '10s' }}
          ></div>
          <div
            className="absolute w-64 h-64 rounded-full border border-[#4AE3A0]/20 pointer-events-none transition-all duration-500"
            style={{
              transform: `scale(${0.85 + (progress / 100) * 0.25})`,
              opacity: progress > 70 ? 0.8 : 0.3,
            }}
          ></div>

          {/* Golden Shockwave on Snap (triggers when progress >= 80%) */}
          {progress >= 78 && (
            <div className="absolute w-60 h-60 rounded-full border-2 border-[#FFECA8] animate-ping pointer-events-none duration-700"></div>
          )}

          {/* Magnetic Trajectory Convergence Lines (Visible during assembly 0% - 75%) */}
          {progress < 75 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="0 0 400 256"
            >
              <defs>
                <linearGradient id="laserLine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFBA09" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#4AE3A0" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              {/* Lines connecting outer corners to center (200, 128) */}
              <line
                x1="40"
                y1="30"
                x2="170"
                y2="100"
                stroke="url(#laserLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={1 - progress / 80}
              />
              <line
                x1="360"
                y1="30"
                x2="230"
                y2="100"
                stroke="url(#laserLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={1 - progress / 80}
              />
              <line
                x1="30"
                y1="220"
                x2="160"
                y2="150"
                stroke="url(#laserLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={1 - progress / 80}
              />
              <line
                x1="370"
                y1="220"
                x2="240"
                y2="150"
                stroke="url(#laserLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity={1 - progress / 80}
              />
            </svg>
          )}

          {/* Floating Data Badge Shards (Drifting toward center) */}
          <div className="absolute inset-0 pointer-events-none">
            {shardLabels.map((shard, i) => {
              const inv = 1 - progress / 100;
              return (
                <div
                  key={shard.name}
                  className={`absolute ${shard.pos} hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#011F7B]/80 border border-[#FFBA09]/40 text-[#FFBA09] text-[10px] font-mono shadow-md backdrop-blur-xs transition-all duration-200`}
                  style={{
                    opacity: progress < 80 ? Math.max(0, 0.9 - (progress / 100) * 0.9) : 0,
                    transform: `scale(${0.8 + 0.2 * (1 - inv)}) translateY(${i < 2 ? -20 * inv : 20 * inv}px)`,
                  }}
                >
                  <span className="material-symbols-outlined text-[13px]">{shard.icon}</span>
                  <span>{shard.name}</span>
                </div>
              );
            })}
          </div>

          {/* THE LOGO WITH ACTIVE SHARD RECONSTRUCTION */}
          <div className="relative z-10 p-2">
            <SaringLogoSvg
              size={180}
              theme="dark"
              animated={true}
              assemblyProgress={progress}
              isAssembling={true}
              idSuffix="modal-shard"
            />
          </div>

          {/* Status Lock Seal Icon when 100% Assembled */}
          {isAssembled && (
            <div className="absolute bottom-2 z-20 flex items-center gap-1.5 px-3 py-1 bg-[#1E9E6A]/90 border border-[#4AE3A0] rounded-full text-white text-xs font-bold animate-bounce shadow-lg">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>TERKUNCI &amp; TERPADU</span>
            </div>
          )}
        </div>

        {/* Circular Ring & Percentage Indicator */}
        <div className="my-3 flex items-center justify-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-20 h-20 transform -rotate-90 overflow-visible" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#FFBA09"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-75 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-black font-mono text-[#FFBA09] tracking-tight leading-none">
                {progress}%
              </span>
              <span className="text-[8px] font-mono uppercase text-[#B8C4E6] mt-0.5">
                {progress < 80 ? 'GABUNG' : 'SELESAI'}
              </span>
            </div>
          </div>

          {/* Status Box */}
          <div className="flex-1 text-left bg-[#011448]/90 border border-[#FFBA09]/30 rounded-xl p-3 shadow-inner">
            <span className="text-[10px] uppercase font-mono font-bold text-[#4AE3A0] block">
              STATUS AUDIT VERIFIKASI:
            </span>
            <p className="text-xs font-semibold text-white mt-1 leading-snug">
              {stepMessages[step]}
            </p>
          </div>
        </div>

        {/* High-Tech Progress Bar */}
        <div className="w-full mt-2">
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-[#FFBA09]/30">
            <div
              className="h-full bg-gradient-to-r from-[#011F7B] via-[#FFBA09] to-[#4AE3A0] rounded-full transition-all duration-75 shadow-[0_0_10px_#FFBA09]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Skip & Replay Footer */}
        <div className="mt-5 flex items-center justify-between w-full pt-3 border-t border-white/10 text-xs">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={() => {
              soundFx.playClickBlip();
              onSuccess();
            }}
            className="inline-flex items-center gap-1.5 text-[#FFBA09] hover:underline font-bold cursor-pointer"
          >
            <span>Lewati Animasi</span>
            <span className="material-symbols-outlined text-[16px]">fast_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
