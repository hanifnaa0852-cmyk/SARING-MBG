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
}

export const SaringLogoSvg: React.FC<SaringLogoSvgProps> = ({
  size = 240,
  theme = 'dark',
  animated = true,
  className = '',
  idSuffix = 'main',
}) => {
  const isDark = theme === 'dark';
  const filterId = `saring-glow-${idSuffix}`;
  const pulseFilterId = `saring-pulse-${idSuffix}`;
  const animClass = animated ? `saring-anim-${idSuffix}` : 'saring-static';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={`select-none ${className}`}
      role="img"
      aria-label="Logo SARING-MBG"
    >
      <defs>
        {/* Subtle glow filter */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id={pulseFilterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
        </filter>

        <linearGradient id={`grad-scan-${idSuffix}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFBA09" stopOpacity="0" />
          <stop offset="20%" stopColor="#FFBA09" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFE599" stopOpacity="1" />
          <stop offset="80%" stopColor="#FFBA09" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFBA09" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={`grad-shield-${idSuffix}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isDark ? '#02248A' : '#011F7B'} />
          <stop offset="100%" stopColor={isDark ? '#01175E' : '#001356'} />
        </linearGradient>

        {/* Scoped CSS animations for 6s seamless loop */}
        <style>{`
          .${animClass} .cls-shield-draw {
            stroke-dasharray: 540;
            stroke-dashoffset: 0;
            animation: shieldDraw_${idSuffix} 6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }
          .${animClass} .cls-shield-glow {
            animation: shieldGlow_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-shield-pulse-ring {
            transform-origin: 120px 120px;
            animation: pulseRing_${idSuffix} 6s ease-out infinite;
          }
          .${animClass} .cls-scanline {
            animation: scanSweep_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-gate-bar {
            animation: gateFlash_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-particle-deflected-1 {
            animation: particleDeflect1_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-particle-deflected-2 {
            animation: particleDeflect2_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-particle-deflected-3 {
            animation: particleDeflect3_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-particle-deflected-4 {
            animation: particleDeflect4_${idSuffix} 6s ease-in-out infinite;
          }
          .${animClass} .cls-droplet {
            animation: dropletPass_${idSuffix} 6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
          }
          .${animClass} .cls-droplet-trail {
            animation: dropletTrail_${idSuffix} 6s cubic-bezier(0.25, 0.8, 0.25, 1) infinite;
          }

          @keyframes shieldDraw_${idSuffix} {
            0% { stroke-dashoffset: 540; opacity: 0.2; }
            16.6% { stroke-dashoffset: 0; opacity: 1; }
            92% { opacity: 1; stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 0; opacity: 1; }
          }

          @keyframes shieldGlow_${idSuffix} {
            0%, 15% { opacity: 0.2; }
            50% { opacity: 0.6; }
            85% { opacity: 0.3; }
            92% { opacity: 0.9; }
            100% { opacity: 0.2; }
          }

          @keyframes pulseRing_${idSuffix} {
            0%, 91% { opacity: 0; transform: scale(0.95); }
            92% { opacity: 0.7; transform: scale(1); stroke-width: 2.5; }
            99% { opacity: 0; transform: scale(1.18); stroke-width: 0.5; }
            100% { opacity: 0; transform: scale(1.2); }
          }

          @keyframes scanSweep_${idSuffix} {
            0%, 16% { transform: translateY(30px); opacity: 0; }
            18% { opacity: 0.9; }
            48% { transform: translateY(165px); opacity: 0.9; }
            52% { transform: translateY(172px); opacity: 0; }
            100% { transform: translateY(172px); opacity: 0; }
          }

          @keyframes gateFlash_${idSuffix} {
            0%, 30% { filter: none; fill-opacity: 0.85; }
            38%, 46% { fill: #FFBA09; fill-opacity: 1; filter: drop-shadow(0 0 4px #FFBA09); }
            55%, 100% { fill: ${isDark ? '#B8C4E6' : '#011F7B'}; fill-opacity: 0.85; filter: none; }
          }

          @keyframes particleDeflect1_${idSuffix} {
            0%, 16% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.9; }
            40% { transform: translate(-14px, 58px); opacity: 0.8; }
            48% { transform: translate(-28px, 66px); opacity: 0; }
            100% { opacity: 0; }
          }

          @keyframes particleDeflect2_${idSuffix} {
            0%, 18% { transform: translate(0, 0); opacity: 0; }
            23% { opacity: 0.95; }
            42% { transform: translate(16px, 60px); opacity: 0.75; }
            50% { transform: translate(30px, 70px); opacity: 0; }
            100% { opacity: 0; }
          }

          @keyframes particleDeflect3_${idSuffix} {
            0%, 19% { transform: translate(0, 0); opacity: 0; }
            25% { opacity: 0.9; }
            44% { transform: translate(-20px, 80px); opacity: 0.7; }
            52% { transform: translate(-34px, 90px); opacity: 0; }
            100% { opacity: 0; }
          }

          @keyframes particleDeflect4_${idSuffix} {
            0%, 20% { transform: translate(0, 0); opacity: 0; }
            26% { opacity: 0.95; }
            45% { transform: translate(22px, 82px); opacity: 0.7; }
            53% { transform: translate(36px, 94px); opacity: 0; }
            100% { opacity: 0; }
          }

          @keyframes dropletPass_${idSuffix} {
            0%, 20% { transform: translateY(0); fill: #B8C4E6; opacity: 0; }
            25% { opacity: 0.9; fill: #B8C4E6; }
            48% { transform: translateY(58px); fill: #FFE599; opacity: 1; }
            60% { transform: translateY(85px); fill: #FFBA09; filter: drop-shadow(0 0 6px #FFBA09); }
            78% { transform: translateY(128px); fill: #FFBA09; opacity: 1; filter: drop-shadow(0 0 8px #FFBA09); }
            90% { transform: translateY(154px); fill: #FFBA09; opacity: 0; filter: none; }
            100% { transform: translateY(154px); opacity: 0; }
          }

          @keyframes dropletTrail_${idSuffix} {
            0%, 55% { opacity: 0; transform: scaleY(0.2); }
            65% { opacity: 0.8; transform: scaleY(1); }
            80% { opacity: 0.6; transform: scaleY(1.4); }
            90% { opacity: 0; transform: scaleY(0.2); }
            100% { opacity: 0; }
          }

          @media (prefers-reduced-motion: reduce) {
            .${animClass} * {
              animation: none !important;
            }
          }
        `}</style>
      </defs>

      <g className={animClass}>
        {/* GROUP 1: SHIELD */}
        <g id="shield">
          {/* Subtle soft pulse expansion ring */}
          {animated && (
            <polygon
              className="cls-shield-pulse-ring"
              points="120,24 196,68 196,156 120,208 44,156 44,68"
              fill="none"
              stroke="#FFBA09"
              strokeWidth="2"
              opacity="0"
            />
          )}

          {/* Shield Base Fill */}
          <polygon
            points="120,26 195,68 195,155 120,206 45,155 45,68"
            fill={`url(#grad-shield-${idSuffix})`}
            stroke={isDark ? '#001648' : '#D0D8F0'}
            strokeWidth="2"
          />

          {/* Inner ambient glow border */}
          <polygon
            className="cls-shield-glow"
            points="120,32 187,71 187,149 120,198 53,149 53,71"
            fill="none"
            stroke={isDark ? '#003AC0' : '#4768D6'}
            strokeWidth="1.5"
            opacity="0.5"
          />

          {/* Outer glowing dynamic boundary */}
          <polygon
            className={animated ? 'cls-shield-draw' : ''}
            points="120,26 195,68 195,155 120,206 45,155 45,68"
            fill="none"
            stroke="#FFBA09"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter={`url(#${filterId})`}
          />
        </g>

        {/* GROUP 2: GATE (Sieve / Funnel Bars) */}
        <g id="gate">
          {/* Tier 1 Bar (Top - Widest) */}
          <g className="cls-gate-bar">
            {/* Left flank */}
            <rect
              x="72"
              y="84"
              width="36"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
            {/* Right flank */}
            <rect
              x="132"
              y="84"
              width="36"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
          </g>

          {/* Tier 2 Bar (Middle - Narrower) */}
          <g className="cls-gate-bar">
            <rect
              x="82"
              y="108"
              width="29"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
            <rect
              x="129"
              y="108"
              width="29"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
          </g>

          {/* Tier 3 Bar (Bottom - Narrowest) */}
          <g className="cls-gate-bar">
            <rect
              x="92"
              y="132"
              width="21"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
            <rect
              x="127"
              y="132"
              width="21"
              height="6.5"
              rx="3.25"
              fill={isDark ? '#B8C4E6' : '#011F7B'}
              fillOpacity={isDark ? 0.8 : 0.9}
            />
          </g>

          {/* Central funnel subtle guide lines */}
          <line
            x1="108"
            y1="84"
            x2="113"
            y2="135"
            stroke="#FFBA09"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.35"
          />
          <line
            x1="132"
            y1="84"
            x2="127"
            y2="135"
            stroke="#FFBA09"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.35"
          />
        </g>

        {/* GROUP 3: PARTICLES */}
        <g id="particles">
          {/* Ambient incoming cluster at top */}
          <circle cx="96" cy="48" r="1.8" fill={isDark ? '#B8C4E6' : '#5B6785'} opacity="0.6" />
          <circle cx="144" cy="50" r="1.8" fill={isDark ? '#B8C4E6' : '#5B6785'} opacity="0.6" />
          <circle cx="112" cy="42" r="1.5" fill={isDark ? '#FFFFFF' : '#5B6785'} opacity="0.8" />
          <circle cx="128" cy="44" r="1.5" fill={isDark ? '#FFFFFF' : '#5B6785'} opacity="0.8" />

          {animated ? (
            <>
              {/* Deflected particle 1: hits tier 1 left bar */}
              <circle
                className="cls-particle-deflected-1"
                cx="88"
                cy="38"
                r="2.2"
                fill={isDark ? '#B8C4E6' : '#5B6785'}
              />

              {/* Deflected particle 2: hits tier 1 right bar */}
              <circle
                className="cls-particle-deflected-2"
                cx="152"
                cy="38"
                r="2.2"
                fill={isDark ? '#B8C4E6' : '#5B6785'}
              />

              {/* Deflected particle 3: hits tier 2 left bar */}
              <circle
                className="cls-particle-deflected-3"
                cx="96"
                cy="44"
                r="2"
                fill={isDark ? '#B8C4E6' : '#5B6785'}
              />

              {/* Deflected particle 4: hits tier 2 right bar */}
              <circle
                className="cls-particle-deflected-4"
                cx="142"
                cy="44"
                r="2"
                fill={isDark ? '#B8C4E6' : '#5B6785'}
              />
            </>
          ) : (
            // Static representation: dissipated ghost particles
            <>
              <circle cx="76" cy="98" r="1.5" fill="#FFBA09" opacity="0.4" />
              <circle cx="164" cy="98" r="1.5" fill="#FFBA09" opacity="0.4" />
              <circle cx="86" cy="120" r="1.2" fill={isDark ? '#B8C4E6' : '#5B6785'} opacity="0.3" />
              <circle cx="154" cy="120" r="1.2" fill={isDark ? '#B8C4E6' : '#5B6785'} opacity="0.3" />
            </>
          )}
        </g>

        {/* GROUP 4: SCANLINE */}
        <g id="scanline">
          {animated ? (
            <g className="cls-scanline">
              <line
                x1="52"
                y1="0"
                x2="188"
                y2="0"
                stroke={`url(#grad-scan-${idSuffix})`}
                strokeWidth="2"
                filter={`url(#${filterId})`}
              />
              <line
                x1="80"
                y1="0"
                x2="160"
                y2="0"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.85"
              />
            </g>
          ) : (
            // Static frame scanline resting near gate
            <g transform="translate(0, 108)">
              <line
                x1="65"
                y1="0"
                x2="175"
                y2="0"
                stroke={`url(#grad-scan-${idSuffix})`}
                strokeWidth="2"
                filter={`url(#${filterId})`}
                opacity="0.7"
              />
            </g>
          )}
        </g>

        {/* GROUP 5: DROPLET (The Single Verified Particle) */}
        <g id="droplet">
          {animated ? (
            <g>
              {/* Luminous trail */}
              <line
                className="cls-droplet-trail"
                x1="120"
                y1="100"
                x2="120"
                y2="170"
                stroke="#FFBA09"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0"
                filter={`url(#${filterId})`}
              />

              {/* The Passing Droplet */}
              <g className="cls-droplet">
                <circle cx="120" cy="40" r="3.2" filter={`url(#${filterId})`} />
                {/* Secondary core */}
                <circle cx="120" cy="40" r="1.8" fill="#FFFFFF" opacity="0.9" />
              </g>
            </g>
          ) : (
            // Static frozen frame: Droplet positioned cleanly mid-gate, transformed to golden #FFBA09!
            <g>
              {/* Soft upper trail */}
              <line
                x1="120"
                y1="96"
                x2="120"
                y2="132"
                stroke="#FFBA09"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Droplet at bottom gate exit */}
              <circle cx="120" cy="148" r="4.2" fill="#FFBA09" filter={`url(#${filterId})`} />
              <circle cx="120" cy="148" r="2.2" fill="#FFFFFF" />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
