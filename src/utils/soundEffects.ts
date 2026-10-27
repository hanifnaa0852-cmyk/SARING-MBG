/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API pure synthesizer for futuristic AI sound effects
// Zero external files or libraries required.

class SoundFx {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Futuristic AI Login sequence: Sub-bass swell + rapid quantum data pulses + resonant harmonic sweep + grant chord
  public playAiLoginSequence() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Sub-bass power surge (warp hum)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(65, now);
    subOsc.frequency.exponentialRampToValueAtTime(180, now + 0.5);
    subOsc.frequency.exponentialRampToValueAtTime(80, now + 1.2);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.2);

    // 2. High-speed digital scanning bleeps (quantum data inspection)
    const scanFrequencies = [880, 1174, 1318, 1760, 2093, 2637, 3136];
    scanFrequencies.forEach((freq, idx) => {
      const bleepTime = now + 0.1 + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, bleepTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, bleepTime + 0.05);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.1, bleepTime);
      filter.Q.setValueAtTime(8, bleepTime);

      gain.gain.setValueAtTime(0.001, bleepTime);
      gain.gain.linearRampToValueAtTime(0.08, bleepTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, bleepTime + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(bleepTime);
      osc.stop(bleepTime + 0.07);
    });

    // 3. Resonant holographic beam sweep (center verification)
    const beamOsc = ctx.createOscillator();
    const beamFilter = ctx.createBiquadFilter();
    const beamGain = ctx.createGain();

    beamOsc.type = 'sawtooth';
    beamOsc.frequency.setValueAtTime(220, now + 0.4);
    beamOsc.frequency.exponentialRampToValueAtTime(880, now + 1.0);

    beamFilter.type = 'lowpass';
    beamFilter.frequency.setValueAtTime(400, now + 0.4);
    beamFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.9);
    beamFilter.frequency.exponentialRampToValueAtTime(600, now + 1.3);

    beamGain.gain.setValueAtTime(0.001, now + 0.4);
    beamGain.gain.linearRampToValueAtTime(0.12, now + 0.7);
    beamGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    beamOsc.connect(beamFilter);
    beamFilter.connect(beamGain);
    beamGain.connect(ctx.destination);

    beamOsc.start(now + 0.4);
    beamOsc.stop(now + 1.3);

    // 4. Grand "Access Granted / Gate Open" harmonic chord at t = 1.05s
    const chordTime = now + 1.0;
    const chordFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Purity chord)

    chordFreqs.forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, chordTime);

      gain.gain.setValueAtTime(0.001, chordTime);
      gain.gain.linearRampToValueAtTime(0.12, chordTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(chordTime);
      osc.stop(chordTime + 0.95);
    });
  }

  // Subtle futuristic click for UI interactions
  public playClickBlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  // Friendly soft card flip sound
  public playCardFlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  }

  // Cute mascot audit inspection chime
  public playMascotChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [880, 1174, 1760]; // A5, D6, A6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.05, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.13);
    });
  }

  // Crystal harmonic chime when shards snap and assemble into logo
  public playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6 (Major 7th sparkle)
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.045;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.5);
    });
  }
}

export const soundFx = new SoundFx();
