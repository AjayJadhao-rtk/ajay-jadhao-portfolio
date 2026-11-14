/**
 * Professional Interactive Audio Engine for Ajay Jadhao's Portfolio
 * 
 * Powered by Web Audio API Synthesizers & Step Sequencer:
 * - Soundtrack: Serene, atmospheric Lo-Fi Anime / Ghibli-inspired Dreamscape (74 BPM)
 *   * Warm, pillowy low-pass kick drum (calm heartbeat pulse)
 *   * Soft brushed acoustic rimshot / vinyl snare
 *   * Gentle swinging 8th-note hi-hats with soft analog warmth
 *   * Deep, smooth acoustic-electric sub bassline (Fmaj7 -> Cmaj7/E -> Dm9 -> Bbmaj7)
 *   * Lush warm Rhodes / dream-pop electric piano chords
 *   * Twinkling celestial music-box / bell arpeggio melody
 * - Futuristic tactile UI sound effects (clicks, surface bend, modal unfold, radar chirp)
 * - 100% compliant with browser autoplay policies
 */

class PortfolioAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isMusicPlaying = false;
    this.isUnlocked = false;
    this.masterGain = null;
    this.sfxGain = null;
    this.musicGain = null;

    // Lo-Fi Sequencer State (74 BPM relaxed downtempo)
    this.stepIntervalId = null;
    this.stepIndex = 0;
    this.bpm = 74;
    this.stepDuration = (60 / this.bpm) / 4; // 16th note = ~202.7ms

    this.noiseBuffer = null;

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

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.70, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Generate subtle vinyl/noise buffer for lo-fi brush and hats
      const bufferSize = this.ctx.sampleRate * 2;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } catch (e) {}
  }

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

  // =========================================================================
  // SERENE LO-FI PERCUSSION (Warm Kick, Soft Rimshot, Gentle Swing Hats)
  // =========================================================================

  /**
   * Warm, pillowy low-pass heartbeat kick
   */
  playLofiKick(time, velocity = 0.7) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, t);

    gain.gain.setValueAtTime(0.45 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  /**
   * Soft brushed acoustic rimshot / vinyl snare
   */
  playLofiSnare(time, velocity = 0.5) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    const t = time || this.ctx.currentTime;

    // Warm low tone body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.08);

    oscGain.gain.setValueAtTime(0.18 * velocity, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + 0.15);

    // Filtered soft brush noise
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.Q.setValueAtTime(1.2, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.12 * velocity, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noiseSource.start(t);
    noiseSource.stop(t + 0.24);
  }

  /**
   * Warm, soft swung hi-hat with vinyl character
   */
  playLofiHat(time, velocity = 0.3) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    const t = time || this.ctx.currentTime;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(7500, t);
    filter.Q.setValueAtTime(2.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noiseSource.start(t);
    noiseSource.stop(t + 0.05);
  }

  // =========================================================================
  // WARM RHODES CHORDS, DEEP BASS & TWINKLING CELESTA MELODY
  // =========================================================================

  /**
   * Warm Rhodes electric piano chords with soft envelope
   */
  playLofiChord(freqs, time, duration = 1.4, velocity = 0.45) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      // Dual oscillator for rich warmth: Sine + Soft Triangle
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, t);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.002, t); // slight analog chorus detune

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);
      filter.frequency.exponentialRampToValueAtTime(500, t + duration);
      filter.Q.setValueAtTime(1.1, t);

      // Gentle piano envelope
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.055 * velocity, t + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
    });
  }

  /**
   * Deep, smooth acoustic-electric sub bass
   */
  playLofiBass(freq, time, duration = 0.75, velocity = 0.6) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28 * velocity, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  /**
   * Sparkling celesta / music box / anime sky melody notes
   */
  playCelestaLead(freq, time, duration = 0.6, velocity = 0.35) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.2, t);
    filter.Q.setValueAtTime(1.5, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.045 * velocity, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  // =========================================================================
  // SERENE 74-BPM LO-FI CHILLHOP / GHIBLI STEP SEQUENCER
  // =========================================================================

  startMusic() {
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.stepIndex = 0;

    /**
     * Heartwarming, nostalgic anime progression in F Major / D Minor:
     * Bar 1: Fmaj7  (F3, A3, C4, E4)   - Peaceful morning sky
     * Bar 2: Cmaj7  (E3, G3, B3, C4)   - Gentle reflection
     * Bar 3: Dm9    (D3, F3, A3, C4, E4) - Contemplative depth
     * Bar 4: Bbmaj7 (Bb2, D3, F3, A3)  - Uplifting horizon
     */
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 261.63], // Cmaj7/E
      [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
      [116.54, 146.83, 174.61, 220.00], // Bbmaj7
    ];

    const bassNotes = [
      87.31,  // F2
      82.41,  // E2
      73.42,  // D2
      58.27,  // Bb1
    ];

    // Pentatonic anime sky bell melody (Hz) across 64 steps
    const melodyPattern = [
      // Bar 1 (Fmaj7): Warm morning sunrise
      523.25, 0, 587.33, 0, 659.25, 0, 0, 523.25,
      0, 659.25, 783.99, 0, 659.25, 0, 587.33, 0,
      // Bar 2 (Cmaj7): Wind in the trees
      493.88, 0, 523.25, 0, 659.25, 0, 0, 493.88,
      0, 587.33, 659.25, 0, 587.33, 0, 523.25, 0,
      // Bar 3 (Dm9): Looking skyward
      440.00, 0, 523.25, 0, 587.33, 0, 0, 659.25,
      0, 783.99, 880.00, 0, 783.99, 0, 659.25, 0,
      // Bar 4 (Bbmaj7): Gentle breath
      587.33, 0, 523.25, 0, 440.00, 0, 0, 392.00,
      0, 440.00, 523.25, 0, 587.33, 0, 0, 0
    ];

    const runStep = () => {
      if (!this.isMusicPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime + 0.02;
      const step = this.stepIndex % 64; // 4 bars of 16 steps
      const bar = Math.floor(step / 16); // 0, 1, 2, 3
      const stepInBar = step % 16;       // 0 to 15
      const beatInBar = Math.floor(stepInBar / 4); // 0, 1, 2, 3
      const stepInBeat = stepInBar % 4; // 0, 1, 2, 3

      // 1. CHORD PADS: Played on beat 1 of each bar with long smooth decay
      if (stepInBar === 0) {
        this.playLofiChord(chords[bar], t, 2.8, 0.42);
        this.playLofiBass(bassNotes[bar], t, 1.8, 0.65);
      } else if (stepInBar === 8) {
        // Subtle chord continuation / syncopated gentle strum on beat 3
        this.playLofiChord(chords[bar], t, 1.5, 0.28);
      }

      // 2. KICK: Beat 1 (stepInBar === 0) and syncopated beat 3.5 (stepInBar === 10)
      if (stepInBar === 0) {
        this.playLofiKick(t, 0.75);
      } else if (stepInBar === 10) {
        this.playLofiKick(t, 0.55);
      }

      // 3. SNARE / RIMSHOT: Beat 2 and Beat 4 (stepInBar === 4 and stepInBar === 12)
      if (stepInBar === 4 || stepInBar === 12) {
        this.playLofiSnare(t, 0.5);
      }

      // 4. HI-HATS: Swung 8th notes (steps 0, 2, 4, 6, 8, 10, 12, 14)
      if (stepInBeat === 0 || stepInBeat === 2) {
        const vel = stepInBeat === 0 ? 0.35 : 0.22;
        this.playLofiHat(t, vel);
      }

      // 5. CELESTA / ANIME SKY MELODY: Twinkling music box notes
      const melodyFreq = melodyPattern[step];
      if (melodyFreq && melodyFreq > 0) {
        this.playCelestaLead(melodyFreq, t, 0.7, 0.38);
      }

      this.stepIndex++;
    };

    // Run clock loop at 16th-note resolution (~202ms per step at 74 BPM)
    this.stepIntervalId = setInterval(runStep, this.stepDuration * 1000);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.stepIntervalId) {
      clearInterval(this.stepIntervalId);
      this.stepIntervalId = null;
    }
  }

  // =========================================================================
  // TACTILE UI SOUND EFFECTS (Calm & Elegant)
  // =========================================================================

  playSystemBoot() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      // Soft major chime (F3, A3, C4, E4)
      const notes = [174.61, 220.0, 261.63, 329.63, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.001, t + delay);
        gain.gain.linearRampToValueAtTime(0.06, t + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + delay);
        osc.stop(t + delay + 0.85);
      });
    } catch (e) {}
  }

  playSurfaceBend() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(65, t + 0.08);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, t);

      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.085);
    } catch (e) {}
  }

  playHover() {
    if (this.isMuted || !this.isUnlocked) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.03);

      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.035);
    } catch (e) {}
  }

  playClick() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.035);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {}
  }

  playModalOpen() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.0001, t + delay);
        gain.gain.linearRampToValueAtTime(0.04, t + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + delay);
        osc.stop(t + delay + 0.5);
      });
    } catch (e) {}
  }

  playModalClose() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, t);
      osc.frequency.exponentialRampToValueAtTime(196, t + 0.1);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.11);
    } catch (e) {}
  }

  playRadarPing() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, t);
      osc.frequency.exponentialRampToValueAtTime(1320, t + 0.15);

      gain.gain.setValueAtTime(0.025, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.17);
    } catch (e) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.70, t + 0.1);
    }
    return this.isMuted;
  }

  setVolume(val) {
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(val * 0.70, t + 0.05);
    }
  }
}

export const audioEngine = new PortfolioAudioEngine();
