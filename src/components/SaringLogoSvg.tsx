/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface SaringLogoSvgProps {
  size?: number | string;
  theme?: 'dark' | 'light';
  animated?: boolean;
  className?: string;
  idSuffix?: string;
  /**
   * Controlled assembly progress: 0 (completely shattered into shards) to 100 (fully unified logo).
   * If omitted, uses standard state or CSS animation.
   */
  assemblyProgress?: number;
  /**
   * If true, triggers the automated assembly animation where shards fly together into the logo.
   */
  isAssembling?: boolean;
}

export const SaringLogoSvg: React.FC<SaringLogoSvgProps> = ({
  size = 240,
  theme = 'dark',
  animated = true,
  className = '',
  idSuffix = 'main',
  assemblyProgress,
  isAssembling = false,
}) => {
  const isDark = theme === 'dark';
  const filterId = `saring-glow-${idSuffix}`;
  const pulseFilterId = `saring-pulse-${idSuffix}`;
  const goldGradId = `saring-gold-${idSuffix}`;
  const shieldGradId = `saring-shield-${idSuffix}`;
  const emeraldGradId = `saring-emerald-${idSuffix}`;
  const ringGradId = `saring-ring-${idSuffix}`;

  // If assemblyProgress is provided, compute manual transform factors
  const hasManualProgress = typeof assemblyProgress === 'number';
  const rawP = hasManualProgress ? Math.min(100, Math.max(0, assemblyProgress!)) / 100 : 1;
  // Apply cubic ease-out curve for natural physical magnetic snapping
  const p = Math.pow(rawP, 0.85);
  const invP = 1 - p;

  const animClass = animated
    ? isAssembling
      ? `saring-assemble-${idSuffix}`
      : `saring-loop-${idSuffix}`
    : 'saring-static';

  // Manual transform helper when controlled via prop
  const getManualStyle = (
    tx: number,
    ty: number,
    rot: number,
    scale: number = 1,
    originX: number = 120,
    originY: number = 120
  ) => {
    if (!hasManualProgress) return {};
    const currTx = tx * invP;
    const currTy = ty * invP;
    const currRot = rot * invP;
    const currScale = scale + (1 - scale) * p;
    const currOpacity = 0.15 + 0.85 * p;
    return {
      transform: `translate(${currTx}px, ${currTy}px) rotate(${currRot}deg) scale(${currScale})`,
      transformOrigin: `${originX}px ${originY}px`,
      opacity: currOpacity,
      transition: 'transform 80ms cubic-bezier(0.16, 1, 0.3, 1), opacity 80ms ease-out',
    };
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={`select-none overflow-visible ${className} ${animClass}`}
      role="img"
      aria-label="Logo SARING-MBG: Audit Dana Makan Bergizi Gratis"
    >
      <defs>
        {/* Glow Filters */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id={pulseFilterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
        </filter>

        {/* Premium Gold Gradient (Simbol Integritas Dana APBN) */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFECA8" />
          <stop offset="40%" stopColor="#FFBA09" />
          <stop offset="70%" stopColor="#E5A100" />
          <stop offset="100%" stopColor="#FFBA09" />
        </linearGradient>

        {/* Deep Authority Navy Gradient (Perisai Pengawasan Fiskal) */}
        <linearGradient id={shieldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#02248A' : '#011F7B'} />
          <stop offset="50%" stopColor={isDark ? '#01175E' : '#001550'} />
          <stop offset="100%" stopColor={isDark ? '#000D36' : '#000F4A'} />
        </linearGradient>

        {/* Emerald Sprout Gradient (Simbol Nutrisi & Makanan Segar Lokal) */}
        <linearGradient id={emeraldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4AE3A0" />
          <stop offset="60%" stopColor="#1E9E6A" />
          <stop offset="100%" stopColor="#0E6B44" />
        </linearGradient>

        {/* Treasury Ring Gradient */}
        <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFBA09" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#FFE799" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFBA09" stopOpacity="0.2" />
        </linearGradient>

        {/* Laser Scanner Beam */}
        <linearGradient id={`grad-laser-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFBA09" stopOpacity="0" />
          <stop offset="20%" stopColor="#FFBA09" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="80%" stopColor="#FFBA09" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFBA09" stopOpacity="0" />
        </linearGradient>

        {/* Embedded Keyframes for 60fps Shard Assembly and Ambient Audit Loops */}
        <style>{`
          /* ===============================================================
             AUTOMATED SHARD ASSEMBLY ANIMATION (saat Login atau Pemicu)
             Pecahan-pecahan berkumpul menjadi satu logo utuh
          =============================================================== */
          .saring-assemble-${idSuffix} .shard-top-left {
            animation: assembleTopLeft_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-top-right {
            animation: assembleTopRight_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-flank-left {
            animation: assembleFlankLeft_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-flank-right {
            animation: assembleFlankRight_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-bottom-apex {
            animation: assembleBottomApex_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-star-crest {
            animation: assembleStarCrest_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-nutrition-bowl {
            animation: assembleBowl_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-emerald-sprout {
            animation: assembleSprout_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-filter-grid {
            animation: assembleFilterGrid_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .saring-assemble-${idSuffix} .shard-energy-burst {
            animation: energyShockwave_${idSuffix} 2.4s ease-out forwards;
          }
          .saring-assemble-${idSuffix} .shard-micro-particle {
            animation: particleSuckIn_${idSuffix} 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          /* Keyframe sequences for each shard flying together */
          @keyframes assembleTopLeft_${idSuffix} {
            0% { transform: translate(-80px, -70px) rotate(-35deg) scale(0.6); opacity: 0.2; }
            50% { transform: translate(-25px, -20px) rotate(-10deg) scale(0.9); opacity: 0.8; }
            78% { transform: translate(2px, 1px) rotate(1deg) scale(1.02); opacity: 1; }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleTopRight_${idSuffix} {
            0% { transform: translate(80px, -70px) rotate(35deg) scale(0.6); opacity: 0.2; }
            50% { transform: translate(25px, -20px) rotate(10deg) scale(0.9); opacity: 0.8; }
            78% { transform: translate(-2px, 1px) rotate(-1deg) scale(1.02); opacity: 1; }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleFlankLeft_${idSuffix} {
            0% { transform: translate(-95px, 15px) rotate(-40deg) scale(0.5); opacity: 0.15; }
            50% { transform: translate(-30px, 5px) rotate(-12deg) scale(0.85); opacity: 0.85; }
            80% { transform: translate(1px, -1px) scale(1.03); opacity: 1; }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleFlankRight_${idSuffix} {
            0% { transform: translate(95px, 15px) rotate(40deg) scale(0.5); opacity: 0.15; }
            50% { transform: translate(30px, 5px) rotate(12deg) scale(0.85); opacity: 0.85; }
            80% { transform: translate(-1px, -1px) scale(1.03); opacity: 1; }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleBottomApex_${idSuffix} {
            0% { transform: translate(0, 95px) rotate(15deg) scale(0.5); opacity: 0.2; }
            55% { transform: translate(0, 25px) rotate(4deg) scale(0.9); opacity: 0.9; }
            82% { transform: translate(0, -2px) scale(1.04); opacity: 1; }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleStarCrest_${idSuffix} {
            0% { transform: translate(0, -90px) rotate(-180deg) scale(0.3); opacity: 0; }
            60% { transform: translate(0, -10px) rotate(20deg) scale(1.1); opacity: 1; filter: drop-shadow(0 0 14px #FFBA09); }
            80% { transform: translate(0, 2px) rotate(0deg) scale(1.15); }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
          }
          @keyframes assembleBowl_${idSuffix} {
            0% { transform: translate(0, 60px) scale(0.4); opacity: 0.1; }
            50% { transform: translate(0, 15px) scale(0.8); opacity: 0.85; }
            80% { transform: translate(0, -1px) scale(1.05); }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes assembleSprout_${idSuffix} {
            0% { transform: translate(0, -35px) scale(0.2); opacity: 0; }
            55% { transform: translate(0, -8px) scale(0.7); opacity: 0.7; }
            82% { transform: translate(0, 0) scale(1.12); opacity: 1; filter: drop-shadow(0 0 8px #4AE3A0); }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          @keyframes assembleFilterGrid_${idSuffix} {
            0% { opacity: 0; transform: scale(0.3); }
            65% { opacity: 0.4; transform: scale(0.85); }
            85% { opacity: 0.95; transform: scale(1.02); }
            100% { opacity: 0.9; transform: scale(1); }
          }
          @keyframes energyShockwave_${idSuffix} {
            0%, 75% { opacity: 0; transform: scale(0.5); }
            78% { opacity: 0.95; transform: scale(0.95); stroke-width: 4px; }
            92% { opacity: 0.4; transform: scale(1.25); stroke-width: 1.5px; }
            100% { opacity: 0; transform: scale(1.4); stroke-width: 0px; }
          }
          @keyframes particleSuckIn_${idSuffix} {
            0% { transform: translate(var(--p-ox, 0), var(--p-oy, 0)); opacity: 0.7; }
            70% { transform: translate(0, 0); opacity: 1; }
            85% { opacity: 0; }
            100% { transform: translate(0, 0); opacity: 0; }
          }

          /* ===============================================================
             AMBIENT AUDIT SCANNER & PULSE LOOP (Ketika sudah utuh)
          =============================================================== */
          .saring-loop-${idSuffix} .cls-shield-aura {
            animation: shieldAura_${idSuffix} 5s ease-in-out infinite;
          }
          .saring-loop-${idSuffix} .cls-star-pulse {
            transform-origin: 120px 48px;
            animation: starPulse_${idSuffix} 4s ease-in-out infinite;
          }
          .saring-loop-${idSuffix} .cls-audit-scan {
            animation: auditLaserSweep_${idSuffix} 4.5s ease-in-out infinite;
          }
          .saring-loop-${idSuffix} .cls-sprout-breathe {
            transform-origin: 120px 115px;
            animation: sproutBreathe_${idSuffix} 3.5s ease-in-out infinite;
          }
          .saring-loop-${idSuffix} .cls-ring-rotate {
            transform-origin: 120px 125px;
            animation: ringRotate_${idSuffix} 16s linear infinite;
          }

          @keyframes shieldAura_${idSuffix} {
            0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 6px rgba(1,31,123,0.4)); }
            50% { opacity: 0.85; filter: drop-shadow(0 0 16px rgba(255,186,9,0.5)); }
          }
          @keyframes starPulse_${idSuffix} {
            0%, 100% { transform: scale(1); filter: drop-shadow(0 0 3px #FFBA09); }
            50% { transform: scale(1.12); filter: drop-shadow(0 0 10px #FFECA8); }
          }
          @keyframes auditLaserSweep_${idSuffix} {
            0% { transform: translateY(50px); opacity: 0; }
            15% { opacity: 0.95; }
            50% { transform: translateY(170px); opacity: 0.95; }
            65% { opacity: 0; transform: translateY(178px); }
            100% { opacity: 0; transform: translateY(178px); }
          }
          @keyframes sproutBreathe_${idSuffix} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); filter: drop-shadow(0 0 6px rgba(74,227,160,0.6)); }
          }
          @keyframes ringRotate_${idSuffix} {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </defs>

      {/* Background Outer Glow Ring */}
      <circle
        cx="120"
        cy="120"
        r="105"
        fill="none"
        stroke="url(#saring-gold-${idSuffix})"
        strokeWidth="1"
        strokeDasharray="4 6"
        opacity={isDark ? '0.25' : '0.4'}
        className="cls-ring-rotate"
      />

      {/* Shockwave Burst Ring upon Assembly */}
      <circle
        cx="120"
        cy="125"
        r="75"
        fill="none"
        stroke="#FFE599"
        strokeWidth="3"
        opacity="0"
        className="shard-energy-burst"
      />

      {/* =========================================================================
          GROUP: SHARDS / PECASAN-PECAHAN PERISAI AUDIT (Outer Shield Structure)
      ========================================================================= */}
      <g id="shield-structure">
        {/* SHARD 1: Sayap Perisai Kiri Atas */}
        <g
          className="shard-top-left"
          style={getManualStyle(-80, -70, -35, 0.6, 75, 55)}
        >
          {/* Outer Bevel Frame */}
          <path
            d="M 120 30 C 95 32 65 38 45 48 C 39 70 37 92 36 115 L 75 105 L 120 85 Z"
            fill="url(#saring-shield-${idSuffix})"
            stroke="url(#saring-gold-${idSuffix})"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Subtle inner facet line */}
          <path
            d="M 120 30 L 75 105 L 45 48"
            fill="none"
            stroke="#FFECA8"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
        </g>

        {/* SHARD 2: Sayap Perisai Kanan Atas */}
        <g
          className="shard-top-right"
          style={getManualStyle(80, -70, 35, 0.6, 165, 55)}
        >
          <path
            d="M 120 30 C 145 32 175 38 195 48 C 201 70 203 92 204 115 L 165 105 L 120 85 Z"
            fill="url(#saring-shield-${idSuffix})"
            stroke="url(#saring-gold-${idSuffix})"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M 120 30 L 165 105 L 195 48"
            fill="none"
            stroke="#FFECA8"
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />
        </g>

        {/* SHARD 3: Dinding Perisai Kiri Bawah (Flank Kiri) */}
        <g
          className="shard-flank-left"
          style={getManualStyle(-95, 15, -40, 0.5, 45, 140)}
        >
          <path
            d="M 36 115 C 38 150 65 180 85 195 L 98 152 L 75 105 Z"
            fill="url(#saring-shield-${idSuffix})"
            stroke="url(#saring-gold-${idSuffix})"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="36,115 75,105 52,138"
            fill="#02248A"
            opacity="0.5"
          />
        </g>

        {/* SHARD 4: Dinding Perisai Kanan Bawah (Flank Kanan) */}
        <g
          className="shard-flank-right"
          style={getManualStyle(95, 15, 40, 0.5, 195, 140)}
        >
          <path
            d="M 204 115 C 202 150 175 180 155 195 L 142 152 L 165 105 Z"
            fill="url(#saring-shield-${idSuffix})"
            stroke="url(#saring-gold-${idSuffix})"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon
            points="204,115 165,105 188,138"
            fill="#001550"
            opacity="0.5"
          />
        </g>

        {/* SHARD 5: Ujung Runcing Dasar Perisai (Shield Apex) */}
        <g
          className="shard-bottom-apex"
          style={getManualStyle(0, 95, 15, 0.5, 120, 205)}
        >
          <path
            d="M 85 195 C 100 206 112 212 120 216 C 128 212 140 206 155 195 L 120 170 Z"
            fill="url(#saring-gold-${idSuffix})"
            stroke="#FFECA8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner dark notch */}
          <polygon
            points="120,210 98,194 120,180 142,194"
            fill="#000F4A"
          />
        </g>
      </g>

      {/* =========================================================================
          GROUP: SARING-MBG AUDIT FILTER & KISI DATA (The Screening Gate)
      ========================================================================= */}
      <g
        id="audit-filter-matrix"
        className="shard-filter-grid"
        style={getManualStyle(0, 0, 0, 0.4, 120, 125)}
      >
        {/* Treasury Central Shield Plate */}
        <circle
          cx="120"
          cy="125"
          r="54"
          fill={isDark ? '#011244' : '#011A66'}
          stroke="url(#saring-gold-${idSuffix})"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* Precision Audit Ticks along the Circular Rim (12 Point Cycle) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={`tick-${deg}`}
            x1="120"
            y1="73"
            x2="120"
            y2="77"
            stroke="#FFECA8"
            strokeWidth="1.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 120 125)`}
            opacity="0.75"
          />
        ))}

        {/* Precision Saring Matrix Lines (Pemeriksaan Deterministik R1, R2, R4a, R5) */}
        <g stroke="#FFBA09" strokeOpacity="0.25" strokeWidth="1">
          <line x1="80" y1="110" x2="160" y2="110" />
          <line x1="72" y1="125" x2="168" y2="125" />
          <line x1="80" y1="140" x2="160" y2="140" />
          <line x1="105" y1="85" x2="105" y2="165" />
          <line x1="120" y1="75" x2="120" y2="175" />
          <line x1="135" y1="85" x2="135" y2="165" />
        </g>

        {/* Data Validation Verified Nodes */}
        <circle cx="105" cy="110" r="2.2" fill="#4AE3A0" />
        <circle cx="135" cy="110" r="2.2" fill="#4AE3A0" />
        <circle cx="105" cy="140" r="2.2" fill="#4AE3A0" />
        <circle cx="135" cy="140" r="2.2" fill="#FFBA09" />
      </g>

      {/* =========================================================================
          GROUP: MAKAN BERGIZI GRATIS (Golden Nutrition Cloche, Bowl, Sprout & Steam)
      ========================================================================= */}
      <g id="nutritious-meal-core">
        {/* SHARD 7: Mangkuk Emas Pangan Bergizi & Kubah Saji (Cloche & Bowl) */}
        <g
          className="shard-nutrition-bowl"
          style={getManualStyle(0, 60, 0, 0.4, 120, 145)}
        >
          {/* Golden Serving Bowl / Mangkuk Bergizi */}
          <path
            d="M 82 135 C 82 135 88 162 120 162 C 152 162 158 135 158 135 Z"
            fill="url(#saring-gold-${idSuffix})"
            stroke="#FFECA8"
            strokeWidth="1.8"
            filter={`url(#${filterId})`}
          />

          {/* Upper Rim Plate */}
          <ellipse
            cx="120"
            cy="135"
            rx="38"
            ry="6.5"
            fill="#FFF1BF"
            stroke="#E5A100"
            strokeWidth="1.2"
          />

          {/* Bowl Pedestal Base */}
          <path
            d="M 108 162 L 104 167 L 136 167 L 132 162 Z"
            fill="url(#saring-gold-${idSuffix})"
          />

          {/* Treasury Checkmark on the bowl (Verifikasi Lolos Bahan Baku) */}
          <path
            d="M 112 147 L 118 153 L 129 141"
            fill="none"
            stroke="#011F7B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* SHARD 8: Tunas Daun Nutrisi Zamrud (Bahan Baku Segar Lokal MBG) */}
        <g
          className="shard-emerald-sprout cls-sprout-breathe"
          style={getManualStyle(-15, -40, -15, 0.3, 120, 115)}
        >
          {/* Daun Sayur / Tunas Pertumbuhan Kiri */}
          <path
            d="M 120 132 C 104 125 100 110 110 102 C 120 95 122 114 120 132 Z"
            fill="url(#saring-emerald-${idSuffix})"
            stroke="#4AE3A0"
            strokeWidth="1.2"
          />
          {/* Daun Sayur / Tunas Pertumbuhan Kanan */}
          <path
            d="M 120 132 C 136 125 140 110 130 102 C 120 95 118 114 120 132 Z"
            fill="url(#saring-emerald-${idSuffix})"
            stroke="#4AE3A0"
            strokeWidth="1.2"
          />
          {/* Tulang Daun Bersinar */}
          <line
            x1="120"
            y1="132"
            x2="120"
            y2="105"
            stroke="#FFECA8"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Uap Hangat Pangan Bernutrisi (Warm Nutrition Aroma Steam) */}
          <path
            d="M 114 96 C 112 90 118 85 116 80"
            fill="none"
            stroke="#FFECA8"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M 126 96 C 128 90 122 85 124 80"
            fill="none"
            stroke="#FFECA8"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>
      </g>

      {/* =========================================================================
          GROUP: BINTANG INTEGRITAS AUDIT (Eight-Point Star of Transparency)
      ========================================================================= */}
      <g
        id="star-of-integrity"
        className="shard-star-crest cls-star-pulse"
        style={getManualStyle(0, -90, -180, 0.3, 120, 48)}
      >
        {/* Glow halo */}
        <circle cx="120" cy="48" r="16" fill="#FFBA09" opacity="0.25" filter={`url(#${filterId})`} />

        {/* Main 8-Point Diamond Star */}
        <polygon
          points="120,33 123.5,44.5 135,48 123.5,51.5 120,63 116.5,51.5 105,48 116.5,44.5"
          fill="url(#saring-gold-${idSuffix})"
          stroke="#FFFFFF"
          strokeWidth="1"
          filter={`url(#${filterId})`}
        />

        {/* Diagonal Micro Rays */}
        <polygon
          points="120,40 125.5,42.5 128,48 125.5,53.5 120,56 114.5,53.5 112,48 114.5,42.5"
          fill="#FFECA8"
          opacity="0.85"
        />

        {/* Center Diamond Light Point */}
        <circle cx="120" cy="48" r="2" fill="#FFFFFF" />
      </g>

      {/* =========================================================================
          AUDIT LASER SCANNER SWEEP (Active Forensics Sweep during gate screening)
      ========================================================================= */}
      <g className="cls-audit-scan pointer-events-none">
        <rect
          x="48"
          y="0"
          width="144"
          height="3"
          fill={`url(#grad-laser-${idSuffix})`}
          filter={`url(#${filterId})`}
        />
      </g>

      {/* =========================================================================
          MICRO SHARDS / DATA FRAGMENTS (Flying into the core during assembly)
      ========================================================================= */}
      {isAssembling && (
        <g id="micro-particles" className="pointer-events-none">
          {[
            { ox: -120, oy: -80, x: 70, y: 65, size: 4, col: '#FFBA09' },
            { ox: 130, oy: -90, x: 170, y: 65, size: 5, col: '#4AE3A0' },
            { ox: -140, oy: 40, x: 50, y: 130, size: 4, col: '#FFECA8' },
            { ox: 140, oy: 50, x: 190, y: 130, size: 5, col: '#FFBA09' },
            { ox: -90, oy: 120, x: 80, y: 180, size: 4, col: '#4AE3A0' },
            { ox: 100, oy: 120, x: 160, y: 180, size: 4, col: '#FFECA8' },
            { ox: 0, oy: -130, x: 120, y: 35, size: 6, col: '#FFFFFF' },
            { ox: 0, oy: 140, x: 120, y: 215, size: 5, col: '#FFBA09' },
          ].map((pt, idx) => (
            <polygon
              key={`shard-particle-${idx}`}
              className="shard-micro-particle"
              points={`${pt.x},${pt.y - pt.size} ${pt.x + pt.size},${pt.y} ${pt.x},${pt.y + pt.size} ${pt.x - pt.size},${pt.y}`}
              fill={pt.col}
              style={{
                '--p-ox': `${pt.ox}px`,
                '--p-oy': `${pt.oy}px`,
                animationDelay: `${idx * 0.08}s`,
              } as React.CSSProperties}
            />
          ))}
        </g>
      )}
    </svg>
  );
};
