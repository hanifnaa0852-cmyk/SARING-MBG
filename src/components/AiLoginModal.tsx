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

  const stepMessages = [
    'MENGHUBUNGKAN PROTOKOL GERBANG AUDIT BGN-KEMENKEU...',
    'MEMVERIFIKASI KREDENSIAL AUDITOR DAN TANDA TANGAN KRIPTOGRAFIS...',
    'MENYELARASKAN DATA 500 VIRTUAL ACCOUNT & LOGISTIK HARIAN SPPG...',
    'VERIFIKASI TUNTAS! GERBANG DANA DIBUKA SECARA BERJENJANG...',
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setProgress(0);
      return;
    }

    // Trigger futuristic AI login sound sequence
    soundFx.playAiLoginSequence();

    // Progress animation loop over 2.2 seconds
    const startTime = Date.now();
    const duration = 2200; // 2.2s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 30) {
        setStep(0);
      } else if (pct < 65) {
        setStep(1);
      } else if (pct < 92) {
        setStep(2);
      } else {
        setStep(3);
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setTimeout(() => {
          onSuccess();
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#010F3D]/85 backdrop-blur-md animate-in fade-in duration-300">
      {/* Ambient background particles & glows */}
      <div className="absolute w-96 h-96 bg-[#011F7B]/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute w-80 h-80 bg-[#FFBA09]/15 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="relative w-full max-w-lg bg-[#000F4A]/90 border border-[#FFBA09]/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,186,9,0.25)] flex flex-col items-center text-center overflow-hidden">
        {/* Futuristic Corner Target Marks */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFBA09]"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFBA09]"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFBA09]"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFBA09]"></div>

        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011F7B] border border-[#FFBA09]/50 text-[#FFBA09] text-[10px] font-mono tracking-widest uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-[#1E9E6A] animate-ping"></span>
          <span>AUTENTIKASI AI PROTOKOL v1.4</span>
        </div>

        {/* Center Scanner Logo with Holographic Rings */}
        <div className="relative my-2 flex items-center justify-center">
          {/* Animated Hologram Rings */}
          <div className="absolute w-44 h-44 rounded-full border border-[#FFBA09]/30 border-dashed animate-spin" style={{ animationDuration: '8s' }}></div>
          <div className="absolute w-52 h-52 rounded-full border border-[#003AC0]/50 animate-ping" style={{ animationDuration: '2.5s' }}></div>

          {/* Central Logo */}
          <div className="relative z-10 p-2 bg-[#010F3D]/90 rounded-2xl border border-white/10 shadow-2xl">
            <SaringLogoSvg size={140} theme="dark" animated={true} idSuffix="modal-scan" />
          </div>

          {/* Vertical Laser Scan Beam Sweep */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#FFBA09] to-transparent shadow-[0_0_12px_#FFBA09] animate-bounce" style={{ animationDuration: '1.2s' }}></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-xl font-extrabold text-white font-['Plus_Jakarta_Sans',sans-serif]">
          <span className="bg-gradient-to-r from-[#60A5FA] via-[#93C5FD] to-[#FFBA09] bg-clip-text text-transparent">
            SARING-MBG
          </span>{' '}
          Risk Gate
        </h3>
        <p className="text-xs text-[#B8C4E6] mt-1">
          Penyelarasan Algoritma Screening Mingguan Sebelum Top-Up
        </p>

        {/* Futuristic Circular Percentage Ring (Menggantikan volume bars) */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Outer spinning dashed ring */}
            <div
              className="absolute inset-0 rounded-full border border-[#FFBA09]/25 border-dashed animate-spin pointer-events-none"
              style={{ animationDuration: '6s' }}
            ></div>

            {/* SVG Circular Ring */}
            <svg className="w-24 h-24 transform -rotate-90 overflow-visible" viewBox="0 0 80 80">
              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#011F7B" />
                  <stop offset="60%" stopColor="#FFBA09" />
                  <stop offset="100%" stopColor="#FFE599" />
                </linearGradient>
                <filter id="circleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background track circle */}
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="5"
                fill="none"
              />

              {/* Progress active stroke */}
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="url(#circleGrad)"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
                strokeLinecap="round"
                fill="none"
                filter="url(#circleGlow)"
                className="transition-all duration-100 ease-out"
              />
            </svg>

            {/* Center percentage text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold font-mono text-[#FFBA09] tracking-tight leading-none drop-shadow-[0_0_8px_rgba(255,186,9,0.5)]">
                {progress}%
              </span>
              <span className="text-[8px] font-mono uppercase text-[#B8C4E6] tracking-wider mt-1">
                VALIDASI
              </span>
            </div>
          </div>
        </div>

        {/* Step Status Text */}
        <div className="w-full bg-[#010F3D]/80 border border-white/10 rounded-xl p-3 min-h-[54px] flex items-center justify-center">
          <span className="text-xs font-mono font-semibold text-[#FFBA09] tracking-wide">
            {stepMessages[step]}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-4">
          <div className="flex justify-between text-[11px] font-mono text-[#B8C4E6] mb-1">
            <span>PROGRES VALIDASI</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#011F7B] via-[#FFBA09] to-[#FFE599] rounded-full transition-all duration-100 shadow-[0_0_8px_#FFBA09]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Skip Button */}
        <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-white/10 text-xs">
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
            className="inline-flex items-center gap-1.5 text-[#FFBA09] hover:underline font-semibold cursor-pointer"
          >
            <span>Lewati Animasi</span>
            <span className="material-symbols-outlined text-[16px]">fast_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
