/**
 * Professional Interactive Audio Engine for Ajay Jadhao's Portfolio
 * Powered by Web Audio API Synthesizers & Step Sequencer:
 * 1. Energetic, exciting, driving electronic-acoustic hybrid soundtrack (124 BPM)
 *    - 4-on-the-floor punchy acoustic/electronic kick drum
 *    - Snappy transient snare & rimshot
 *    - 16th-note running groove hi-hats with offbeat accents
 *    - Driving arpeggiated running bassline (D minor electro-groove)
 *    - Energetic syncopated chord stabs (Dm9 -> Bbmaj7 -> Gm7 -> A7)
 *    - High-octane shimmering arpeggio lead melody
 * 2. Futuristic system boot & activation sound effects
 * 3. Tactile UI sound effects (surface bend tap, hover blip, click actuation, modal unfold, radar chirp)
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

    // Music Step Sequencer state
    this.stepIntervalId = null;
    this.stepIndex = 0;
    this.bpm = 124;
    this.stepDuration = (60 / this.bpm) / 4; // 16th note = ~121ms

    // Pre-create white noise buffer for drums & transients
    this.noiseBuffer = null;

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
      this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // SFX Gain
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Generate 1-second white noise buffer for drums & transients
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } catch (e) {
      // AudioContext creation fallback
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

  // =========================================================================
  // ENERGETIC PERCUSSION SYNTHESIZERS (Kick, Snare, Hi-Hats)
  // =========================================================================

  /**
   * Punchy, driving kick drum with fast pitch drop
   */
  playKick(time, velocity = 0.8) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch sweep: 155 Hz -> 42 Hz
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.08);

    gain.gain.setValueAtTime(0.35 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  /**
   * Snappy punchy snare & clap hybrid
   */
  playSnare(time, velocity = 0.6) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    const t = time || this.ctx.currentTime;

    // 1. Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.08);

    oscGain.gain.setValueAtTime(0.2 * velocity, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(oscGain);
    oscGain.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + 0.13);

    // 2. Noise snap
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18 * velocity, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.musicGain);
    noiseSource.start(t);
    noiseSource.stop(t + 0.18);
  }

  /**
   * Crisp 16th-note closed / open hi-hat
   */
  playHiHat(time, isOpen = false, velocity = 0.4) {
    if (!this.ctx || this.isMuted || !this.noiseBuffer) return;
    const t = time || this.ctx.currentTime;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(9000, t);
    filter.Q.setValueAtTime(3.5, t);

    const gain = this.ctx.createGain();
    const duration = isOpen ? 0.14 : 0.035;

    gain.gain.setValueAtTime(0.12 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    noiseSource.start(t);
    noiseSource.stop(t + duration + 0.01);
  }

  // =========================================================================
  // ENERGETIC BASSLINE, CHORDS & ARPEGGIO SYNTHESIZERS
  // =========================================================================

  /**
   * Punchy, resonant driving synth bassline note
   */
  playBass(freq, time, duration = 0.15, velocity = 0.7) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const oscSaw = this.ctx.createOscillator();
    const oscSquare = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    oscSaw.type = 'sawtooth';
    oscSaw.frequency.setValueAtTime(freq, t);

    oscSquare.type = 'square';
    oscSquare.frequency.setValueAtTime(freq, t);

    // Resonant lowpass filter sweep
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(260, t + duration * 0.85);
    filter.Q.setValueAtTime(3.2, t);

    gain.gain.setValueAtTime(0.18 * velocity, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    oscSaw.connect(filter);
    oscSquare.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    oscSaw.start(t);
    oscSquare.start(t);
    oscSaw.stop(t + duration + 0.02);
    oscSquare.stop(t + duration + 0.02);
  }

  /**
   * Uplifting syncopated chord stab
   */
  playChordStab(freqs, time, duration = 0.22, velocity = 0.45) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + duration);
      filter.Q.setValueAtTime(1.8, t);

      gain.gain.setValueAtTime(0.045 * velocity, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      osc.stop(t + duration + 0.02);
    });
  }

  /**
   * Shimmering, energetic lead arpeggio note
   */
  playArpLead(freq, time, duration = 0.12, velocity = 0.35) {
    if (!this.ctx || this.isMuted) return;
    const t = time || this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, t);
    filter.Q.setValueAtTime(2.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.05 * velocity, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  // =========================================================================
  // EXCITING 124-BPM STEP SEQUENCER
  // =========================================================================

  startMusic() {
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    this.stepIndex = 0;

    /**
     * Energetic 4-bar progression in D Minor:
     * Bar 1: Dm (D2 / Dm9)
     * Bar 2: Bb (Bb1 / Bbmaj7)
     * Bar 3: Gm (G1 / Gm7)
     * Bar 4: A (A1 / A7)
     */
    // 64 16th-notes running bassline frequencies (Hz)
    const bassRiff = [
      // Bar 1: Dm
      73.42, 73.42, 87.31, 73.42, 98.0, 73.42, 110.0, 87.31,
      73.42, 73.42, 87.31, 73.42, 98.0, 110.0, 130.81, 146.83,
      // Bar 2: Bb
      58.27, 58.27, 73.42, 58.27, 87.31, 58.27, 98.0, 87.31,
      58.27, 58.27, 73.42, 58.27, 87.31, 98.0, 110.0, 130.81,
      // Bar 3: Gm
      49.0, 49.0, 58.27, 49.0, 73.42, 49.0, 87.31, 73.42,
      49.0, 49.0, 58.27, 49.0, 73.42, 87.31, 98.0, 110.0,
      // Bar 4: A
      55.0, 55.0, 73.42, 55.0, 82.41, 55.0, 98.0, 82.41,
      55.0, 73.42, 82.41, 98.0, 110.0, 130.81, 146.83, 164.81,
    ];

    // Chords (Hz)
    const chords = {
      dm: [146.83, 174.61, 220.0, 261.63, 329.63], // D3, F3, A3, C4, E4
      bb: [116.54, 146.83, 174.61, 220.0],         // Bb2, D3, F3, A3
      gm: [98.0, 116.54, 146.83, 174.61],          // G2, Bb2, D3, F3
      a:  [110.0, 138.59, 164.81, 220.0],          // A2, C#3, E3, A3
    };

    // Shimmering Arpeggio notes (Hz)
    const arpNotes = [
      440.0, 523.25, 587.33, 659.25, 698.46, 587.33, 523.25, 440.0,
      392.0, 440.0, 523.25, 587.33, 659.25, 587.33, 523.25, 392.0,
      349.23, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 349.23,
      440.0, 554.37, 659.25, 783.99, 880.0, 783.99, 659.25, 554.37,
    ];

    const runStep = () => {
      if (!this.isMusicPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime + 0.02;
      const step = this.stepIndex % 64;
      const beatInBar = Math.floor((step % 16) / 4); // 0, 1, 2, 3
      const stepInBeat = step % 4; // 0, 1, 2, 3
      const bar = Math.floor(step / 16); // 0, 1, 2, 3

      // 1. KICK: 4-on-the-floor (every beat: stepInBeat === 0)
      if (stepInBeat === 0) {
        this.playKick(t, 0.85);
      }

      // 2. SNARE: Beats 2 and 4 (beatInBar === 1 or 3, stepInBeat === 0)
      if ((beatInBar === 1 || beatInBar === 3) && stepInBeat === 0) {
        this.playSnare(t, 0.7);
      }

      // 3. HI-HATS:
      // Open hat on the offbeats (stepInBeat === 2)
      if (stepInBeat === 2) {
        this.playHiHat(t, true, 0.45);
      } else {
        // Closed hats on 16th notes
        this.playHiHat(t, false, stepInBeat === 0 ? 0.35 : 0.2);
      }

      // 4. BASS: Driving 16th-note bassline
      const bassFreq = bassRiff[step] || 73.42;
      this.playBass(bassFreq, t, 0.12, 0.75);

      // 5. CHORD STABS: Syncopated energetic stabs (on beats 1.5, 2.5, 3.5)
      if (stepInBeat === 2 && (beatInBar === 0 || beatInBar === 2)) {
        let currentChord = chords.dm;
        if (bar === 1) currentChord = chords.bb;
        if (bar === 2) currentChord = chords.gm;
        if (bar === 3) currentChord = chords.a;
        this.playChordStab(currentChord, t, 0.2, 0.5);
      }

      // 6. ARP LEAD: Shimmering high melody on 16th notes
      const arpFreq = arpNotes[step % 32];
      if (arpFreq) {
        this.playArpLead(arpFreq, t, 0.1, 0.3);
      }

      this.stepIndex++;
    };

    // Run clock loop at 16th-note resolution
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
  // FUTURISTIC SYSTEM BOOT & WELCOME ACTUATION SOUNDS
  // =========================================================================

  /**
   * Exciting futuristic laboratory boot actuation sound when entering portfolio
   */
  playSystemBoot() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;

      // 1. Rising holographic frequency sweep
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(140, t);
      sweepOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.45);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(3600, t + 0.45);
      filter.Q.setValueAtTime(3.0, t);

      sweepGain.gain.setValueAtTime(0.01, t);
      sweepGain.gain.linearRampToValueAtTime(0.12, t + 0.35);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      sweepOsc.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(this.sfxGain);

      sweepOsc.start(t);
      sweepOsc.stop(t + 0.56);

      // 2. Triumphant major chord actuation chime (D, F#, A, D)
      const notes = [293.66, 369.99, 440.0, 587.33, 880.0];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = 0.35 + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.001, t + delay);
        gain.gain.linearRampToValueAtTime(0.08, t + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.65);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + delay);
        osc.stop(t + delay + 0.7);
      });
    } catch (e) {}
  }

  // Tactile Surface Bend Tap Sound
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
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + 0.07);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(420, t);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 0.075);
    } catch (e) {}
  }

  // Tactile Hover Blip
  playHover() {
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

  // Mechanical Actuation Click
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

  // Blueprint Modal Unfold Sound
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
        this.musicGain.gain.linearRampToValueAtTime(0.12, t + 0.2);
      }
    } catch (e) {}
  }

  // Modal Close Sound
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
        this.musicGain.gain.linearRampToValueAtTime(0.3, t + 0.3);
      }
    } catch (e) {}
  }

  // Radar / Divergence Ping
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

  // Toggle Mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.75, t + 0.1);
    }
    return this.isMuted;
  }

  // Set Master Volume (0.0 to 1.0)
  setVolume(val) {
    if (this.masterGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(val * 0.75, t + 0.05);
    }
  }
}

export const audioEngine = new PortfolioAudioEngine();
