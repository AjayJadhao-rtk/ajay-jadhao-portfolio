/**
 * Professional Interactive Audio Engine for Ajay Jadhao's Portfolio
 * Powered by Web Audio API Physical Modeling & Acoustic Synthesis:
 * 1. Authentic Acoustic Grand Piano (hammer impulse + multi-harmonic partials + spruce soundboard resonance)
 * 2. Plucked Acoustic Guitar / Harp (dynamic plucked lowpass decay + wooden body resonance)
 * 3. Warm Bowed Cello / Double Bass (saw-tri blend + wooden formant filter + slow bowing attack + natural vibrato)
 * 4. Music Box / Celesta Chime (crystalline bell overtones + delicate sparkle)
 * 5. Tactile UI sound effects (surface bend tap, hover blip, click actuation, modal unfold, radar chirp)
 * 6. 100% compliant with browser autoplay policies (no AudioContext start warnings)
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

    // Music scheduler state
    this.musicTimeoutId = null;
    this.currentPatternIndex = 0;

    // Pre-create noise buffer for piano hammer impact
    this.hammerNoiseBuffer = null;

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
      this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      // Music Gain
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Generate 0.05s felt hammer noise buffer for realistic piano percussive transient
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
      this.hammerNoiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.hammerNoiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Decaying filtered white noise
        const decay = Math.exp(-i / (this.ctx.sampleRate * 0.008));
        data[i] = (Math.random() * 2 - 1) * decay;
      }
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

  // =========================================================================
  // ACOUSTIC PHYSICAL MODELING SYNTHESIZERS
  // =========================================================================

  /**
   * 1. ACOUSTIC GRAND PIANO NOTE
   * Simulates hammer impact transient, 4 harmonic partials with progressive decay,
   * and spruce wooden soundboard resonance filter.
   */
  playPianoNote(freq, startTime, duration = 3.5, velocity = 0.5) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const t = startTime || ctx.currentTime;

    // A. Wooden soundboard resonance bus
    const soundboardFilter = ctx.createBiquadFilter();
    soundboardFilter.type = 'peaking';
    soundboardFilter.frequency.setValueAtTime(750, t);
    soundboardFilter.Q.setValueAtTime(2.2, t);
    soundboardFilter.gain.setValueAtTime(4, t);

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, t);
    // Instant attack (hammer strike)
    noteGain.gain.linearRampToValueAtTime(0.08 * velocity, t + 0.004);
    // Natural exponential piano decay
    noteGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    soundboardFilter.connect(noteGain);
    noteGain.connect(this.musicGain);

    // B. Felt Hammer Percussive Attack Impulse
    if (this.hammerNoiseBuffer) {
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = this.hammerNoiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(Math.min(freq * 2.5, 3000), t);
      noiseFilter.Q.setValueAtTime(3.0, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03 * velocity, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.musicGain);

      noiseSource.start(t);
      noiseSource.stop(t + 0.03);
    }

    // C. Harmonic Partials (Fundamental + 2nd, 3rd, 4th harmonics)
    const harmonics = [
      { mult: 1, gainRatio: 1.0, decayMult: 1.0 },
      { mult: 2, gainRatio: 0.52, decayMult: 0.7 },
      { mult: 3, gainRatio: 0.22, decayMult: 0.45 },
      { mult: 4, gainRatio: 0.09, decayMult: 0.28 },
    ];

    harmonics.forEach(({ mult, gainRatio, decayMult }) => {
      const osc = ctx.createOscillator();
      const partGain = ctx.createGain();

      osc.type = 'sine';
      // Slight acoustic string inharmonicity
      const inharmonicity = 1 + 0.0004 * mult * mult;
      osc.frequency.setValueAtTime(freq * mult * inharmonicity, t);

      partGain.gain.setValueAtTime(gainRatio, t);
      partGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * decayMult);

      osc.connect(partGain);
      partGain.connect(soundboardFilter);

      osc.start(t);
      osc.stop(t + duration * decayMult + 0.05);
    });
  }

  /**
   * 2. ACOUSTIC PLUCKED GUITAR / HARP
   * Simulates plucked string with fast lowpass filter decay & wooden cavity resonance.
   */
  playAcousticGuitarPluck(freq, startTime, duration = 2.4, velocity = 0.45) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const t = startTime || ctx.currentTime;

    const osc = ctx.createOscillator();
    const oscBody = ctx.createOscillator();
    const pluckFilter = ctx.createBiquadFilter();
    const bodyFilter = ctx.createBiquadFilter();
    const pluckGain = ctx.createGain();

    // String pluck waveform
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    // Warm body harmonic
    oscBody.type = 'triangle';
    oscBody.frequency.setValueAtTime(freq * 0.5, t);

    // Dynamic lowpass filter: bright attack snap dampening down immediately
    pluckFilter.type = 'lowpass';
    pluckFilter.frequency.setValueAtTime(2800, t);
    pluckFilter.frequency.exponentialRampToValueAtTime(320, t + 0.12);
    pluckFilter.frequency.exponentialRampToValueAtTime(140, t + duration);
    pluckFilter.Q.setValueAtTime(2.0, t);

    // Wooden guitar body formant resonance (around 220Hz)
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(220, t);
    bodyFilter.Q.setValueAtTime(1.8, t);

    // Envelope
    pluckGain.gain.setValueAtTime(0.0001, t);
    pluckGain.gain.linearRampToValueAtTime(0.06 * velocity, t + 0.003);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(pluckFilter);
    oscBody.connect(bodyFilter);
    bodyFilter.connect(pluckFilter);
    pluckFilter.connect(pluckGain);
    pluckGain.connect(this.musicGain);

    osc.start(t);
    oscBody.start(t);
    osc.stop(t + duration + 0.05);
    oscBody.stop(t + duration + 0.05);
  }

  /**
   * 3. WARM BOWED CELLO / DOUBLE BASS
   * Slow bowing attack, warm wooden body formants, expressive gentle vibrato.
   */
  playCelloBass(freq, startTime, duration = 4.2, velocity = 0.5) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const t = startTime || ctx.currentTime;

    const oscMain = ctx.createOscillator();
    const oscSub = ctx.createOscillator();
    const bodyFilter = ctx.createBiquadFilter();
    const celloGain = ctx.createGain();

    // Dual bowed string texture
    oscMain.type = 'sawtooth';
    oscMain.frequency.setValueAtTime(freq, t);

    oscSub.type = 'triangle';
    oscSub.frequency.setValueAtTime(freq, t);

    // Expressive vibrato LFO
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.setValueAtTime(4.6, t); // 4.6 Hz natural human vibrato
    vibratoGain.gain.setValueAtTime(0.001, t);
    // Vibrato swells in gently after the bow catches the string
    vibratoGain.gain.linearRampToValueAtTime(freq * 0.012, t + 0.8);
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscMain.frequency);
    vibrato.start(t);

    // Cello wooden body resonance filter (warm 300Hz peak)
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(380, t);
    bodyFilter.Q.setValueAtTime(1.5, t);

    // Slow bowing envelope (70ms bow stroke attack)
    celloGain.gain.setValueAtTime(0.0001, t);
    celloGain.gain.linearRampToValueAtTime(0.075 * velocity, t + 0.12);
    celloGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    oscMain.connect(bodyFilter);
    oscSub.connect(bodyFilter);
    bodyFilter.connect(celloGain);
    celloGain.connect(this.musicGain);

    oscMain.start(t);
    oscSub.start(t);
    oscMain.stop(t + duration + 0.1);
    oscSub.stop(t + duration + 0.1);
    vibrato.stop(t + duration + 0.1);
  }

  /**
   * 4. MUSIC BOX / CELESTA CHIME
   * Crystalline bell chime with inharmonic chime partials for nostalgic sparkle.
   */
  playCelestaChime(freq, startTime, duration = 3.0, velocity = 0.4) {
    if (!this.ctx || this.isMuted) return;
    const ctx = this.ctx;
    const t = startTime || ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();

    // Fundamental bell tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    // Non-harmonic metallic tine chime
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.756, t);

    // Envelopes
    gain1.gain.setValueAtTime(0.0001, t);
    gain1.gain.linearRampToValueAtTime(0.035 * velocity, t + 0.002);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    gain2.gain.setValueAtTime(0.0001, t);
    gain2.gain.linearRampToValueAtTime(0.012 * velocity, t + 0.002);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.4);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.musicGain);
    gain2.connect(this.musicGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration + 0.05);
    osc2.stop(t + duration + 0.05);
  }

  // =========================================================================
  // GENERATIVE ACOUSTIC INSTRUMENTAL ENSEMBLE
  // =========================================================================

  startMusic() {
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    /**
     * Nostalgic Ghibli / Joe Hisaishi inspired acoustic chord progression:
     * 1. Eb maj9 (Eb, G, Bb, D, F)
     * 2. Cm9 (C, Eb, G, Bb, D)
     * 3. Ab maj7 (Ab, C, Eb, G)
     * 4. Bb9sus4 -> Bb7 (Bb, F, Ab, C -> D)
     */
    const patterns = [
      // Pattern 1: Eb maj9
      {
        cello: 77.78, // Eb2
        pianoChord: [155.56, 196.0, 233.08, 293.66], // Eb3, G3, Bb3, D4
        guitarArp: [196.0, 233.08, 293.66, 349.23, 392.0], // G3, Bb3, D4, F4, G4
        celesta: 587.33, // D5
      },
      // Pattern 2: Cm9
      {
        cello: 65.41, // C2
        pianoChord: [130.81, 155.56, 196.0, 233.08], // C3, Eb3, G3, Bb3
        guitarArp: [155.56, 196.0, 233.08, 293.66, 392.0], // Eb3, G3, Bb3, D4, G4
        celesta: 783.99, // G5
      },
      // Pattern 3: Ab maj7
      {
        cello: 51.91, // Ab1
        pianoChord: [103.83, 130.81, 155.56, 196.0], // Ab2, C3, Eb3, G3
        guitarArp: [130.81, 155.56, 196.0, 261.63, 311.13], // C3, Eb3, G3, C4, Eb4
        celesta: 622.25, // Eb5
      },
      // Pattern 4: Bb9sus4
      {
        cello: 58.27, // Bb1
        pianoChord: [116.54, 146.83, 174.61, 233.08, 261.63], // Bb2, D3, F3, Bb3, C4
        guitarArp: [174.61, 233.08, 261.63, 293.66, 349.23], // F3, Bb3, C4, D4, F4
        celesta: 698.46, // F5
      },
    ];

    const scheduleMeasure = () => {
      if (!this.isMusicPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const t = this.ctx.currentTime + 0.05;
      const current = patterns[this.currentPatternIndex];
      this.currentPatternIndex = (this.currentPatternIndex + 1) % patterns.length;

      // 1. Warm bowed Cello Bassline (duration 4.2s)
      this.playCelloBass(current.cello, t, 4.4, 0.55);

      // 2. Acoustic Grand Piano Chord (soft gentle hammer strike)
      current.pianoChord.forEach((freq, i) => {
        // Humanized slight rolling strum of piano keys (15ms stagger)
        this.playPianoNote(freq, t + i * 0.018, 4.0, 0.42);
      });

      // 3. Plucked Acoustic Guitar Arpeggio (staggered plucks throughout measure)
      current.guitarArp.forEach((freq, idx) => {
        const pluckTime = t + 0.4 + idx * 0.65;
        this.playAcousticGuitarPluck(freq, pluckTime, 2.2, 0.38);
      });

      // 4. Music Box / Celesta Chime on the downbeat accent
      this.playCelestaChime(current.celesta, t + 0.8, 3.2, 0.35);

      // Schedule next measure in 4.0 seconds
      this.musicTimeoutId = setTimeout(scheduleMeasure, 3950);
    };

    scheduleMeasure();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimeoutId) {
      clearTimeout(this.musicTimeoutId);
      this.musicTimeoutId = null;
    }
  }

  // =========================================================================
  // TACTILE UI SOUND EFFECTS
  // =========================================================================

  /**
   * TACTILE SURFACE BEND SOUND
   * Warm acoustic tap & elastic flex resonance when the screen bends under finger/mouse.
   */
  playSurfaceBend() {
    if (this.isMuted) return;
    this.isUnlocked = true;
    this.ensureContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    try {
      const t = this.ctx.currentTime;
      // Soft acoustic soundboard knock
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.07);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, t);

      gain.gain.setValueAtTime(0.08, t);
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
        this.musicGain.gain.linearRampToValueAtTime(0.08, t + 0.2);
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
        this.musicGain.gain.linearRampToValueAtTime(0.28, t + 0.3);
      }
    } catch (e) {}
  }

  // Radar / Divergence Chirp
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
