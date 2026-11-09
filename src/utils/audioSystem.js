/**
 * Professional Interactive Audio Engine for Ajay Jadhao's Portfolio
 * Powered by Web Audio API:
 * 1. Ultra-low latency tactile UI sound effects (hover, click, modal unfold, radar chirp)
 * 2. Generative nostalgic vintage-anime ambient soundtrack (warm Ghibli/Shinkai chords with tape warmth)
 * 3. 0 KB external audio download dependencies, instant startup, zero broken URLs
 * 4. 100% compliant with browser autoplay policies (no AudioContext start warnings)
 */

class PortfolioAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isMusicPlaying = false;
    this.isUnlocked = false; // Flag to prevent eager AudioContext creation before user gesture
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;

    // Ambient music synthesizer nodes
    this.musicIntervalId = null;

    // Register first user gesture to cleanly unlock audio without browser warnings
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.isUnlocked = true;
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
        ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((e) => {
          window.removeEventListener(e, unlock);
        });
      };

      ['click', 'keydown', 'pointerdown', 'touchstart'].forEach((e) => {
        window.addEventListener(e, unlock, { passive: true, once: true });
      });
    }
  }

  // Initialize Web Audio Context upon user interaction
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    } catch (e) {
      // AudioContext creation failure fallback
    }
  }

  // Ensure AudioContext is initialized and running
  async ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (e) {}
    }
  }

  // 1. TACTILE HOVER BLIP
  playHover() {
    // Skip hover sound if muted or user hasn't interacted yet to avoid autoplay warning
    if (this.isMuted || !this.isUnlocked) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.035);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t);

      gain.gain.setValueAtTime(0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {}
  }

  // 2. MECHANICAL ACTUATION CLICK
  playClick() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;

      // High transient
      const oscHigh = this.ctx.createOscillator();
      const gainHigh = this.ctx.createGain();
      oscHigh.type = 'triangle';
      oscHigh.frequency.setValueAtTime(950, t);
      oscHigh.frequency.exponentialRampToValueAtTime(240, t + 0.04);
      gainHigh.gain.setValueAtTime(0.12, t);
      gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      oscHigh.connect(gainHigh);
      gainHigh.connect(this.sfxGain);
      oscHigh.start(t);
      oscHigh.stop(t + 0.045);

      // Low tactile body
      const oscLow = this.ctx.createOscillator();
      const gainLow = this.ctx.createGain();
      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(180, t);
      oscLow.frequency.exponentialRampToValueAtTime(45, t + 0.06);
      gainLow.gain.setValueAtTime(0.15, t);
      gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      oscLow.connect(gainLow);
      gainLow.connect(this.sfxGain);
      oscLow.start(t);
      oscLow.stop(t + 0.07);
    } catch (e) {}
  }

  // 3. BLUEPRINT MODAL UNFOLD SOUND
  playModalOpen() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const notes = [293.66, 369.99, 440.0, 587.33];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.0001, t + delay);
        gain.gain.linearRampToValueAtTime(0.05, t + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + delay);
        osc.stop(t + delay + 0.5);
      });

      if (this.musicGain) {
        this.musicGain.gain.linearRampToValueAtTime(0.08, t + 0.2);
      }
    } catch (e) {}
  }

  // 4. MODAL CLOSE SOUND
  playModalClose() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.12);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.13);

      if (this.musicGain) {
        this.musicGain.gain.linearRampToValueAtTime(0.22, t + 0.3);
      }
    } catch (e) {}
  }

  // 5. RADAR / DIVERGENCE CHIRP
  playRadarPing() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2150, t);
      osc.frequency.exponentialRampToValueAtTime(1750, t + 0.18);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch (e) {}
  }

  // 6. GENERATIVE NOSTALGIC VINTAGE-ANIME MUSIC
  startMusic() {
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    const chords = [
      [155.56, 196.0, 233.08, 293.66, 349.23], // Eb maj9
      [130.81, 155.56, 196.0, 233.08, 261.63], // Cm9
      [103.83, 155.56, 207.65, 261.63, 311.13], // Ab maj7
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bb add9
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || !this.ctx || this.ctx.state !== 'running') return;
      try {
        const t = this.ctx.currentTime;
        const currentChord = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        currentChord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const subOsc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(freq * 0.5, t);

          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(0.18 + Math.random() * 0.05, t);
          lfoGain.gain.setValueAtTime(1.2, t);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start(t);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450 + idx * 80, t);
          filter.Q.setValueAtTime(1.2, t);

          const duration = 4.2;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.linearRampToValueAtTime(0.035, t + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

          osc.connect(filter);
          subOsc.connect(filter);
          filter.connect(gain);
          gain.connect(this.musicGain);

          osc.start(t);
          subOsc.start(t);
          osc.stop(t + duration);
          subOsc.stop(t + duration);
          lfo.stop(t + duration);
        });
      } catch (e) {}
    };

    playChord();
    this.musicIntervalId = setInterval(playChord, 3800);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicIntervalId) {
      clearInterval(this.musicIntervalId);
      this.musicIntervalId = null;
    }
  }

  // Toggle Mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.7, t + 0.1);
    }
    return this.isMuted;
  }

  // Set Master Volume (0.0 to 1.0)
  setVolume(val) {
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(val * 0.7, t + 0.05);
    }
  }
}

export const audioEngine = new PortfolioAudioEngine();
