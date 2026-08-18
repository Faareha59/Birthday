// Web Audio API Sound Synthesizer for Twin Birthday Experience with Hamster Squeaks & Turbo Sounds
class SoundFXSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.customAudio) {
      this.customAudio.muted = muted;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.customAudio) {
      this.customAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Quick click / pop sound
  public playPop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  public playClick() {
    this.playPop();
  }

  // Chime / sparkle
  public playChime(freq = 880) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  // Blow candle sound
  public playBlowSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.4);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.4);
  }

  // 1. TURBO STUTUTU BLOW-OFF VALVE
  public playTurboBlowoff() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Initial whoosh
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.7);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(3, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Stututu flutter pulses (valve fluttering)
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 - i * 35, now + 0.12 + i * 0.09);

      oscGain.gain.setValueAtTime(0.25 - i * 0.04, now + 0.12 + i * 0.09);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18 + i * 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now + 0.12 + i * 0.09);
      osc.stop(now + 0.2 + i * 0.09);
    }
  }

  // 2. V8 SUPERCAR ENGINE REV + LIMITER BACKFIRE
  public playEngineRev(intensity = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(320 * intensity, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.6);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(2200, now + 0.25);
    filter.frequency.linearRampToValueAtTime(700, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.7);

    // Pop / Backfire bang at the end of the rev
    setTimeout(() => {
      if (this.ctx && !this.isMuted) {
        const bangTime = this.ctx.currentTime;
        const bangOsc = this.ctx.createOscillator();
        const bangGain = this.ctx.createGain();
        bangOsc.type = 'triangle';
        bangOsc.frequency.setValueAtTime(120, bangTime);
        bangOsc.frequency.exponentialRampToValueAtTime(30, bangTime + 0.1);
        bangGain.gain.setValueAtTime(0.4, bangTime);
        bangGain.gain.exponentialRampToValueAtTime(0.001, bangTime + 0.12);
        bangOsc.connect(bangGain);
        bangGain.connect(this.ctx.destination);
        bangOsc.start(bangTime);
        bangOsc.stop(bangTime + 0.13);
      }
    }, 280);
  }

  // 3. CUTE HAMSTER SQUEAK & HAPPY CHIRP
  public playHamsterSqueak() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Cute high-frequency bouncy chirp
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(2600, now + 0.24);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  // 3b. HAMSTER SUNFLOWER SEED CRUNCH / MUNCHING
  public playHamsterCrunch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.06);
      osc.frequency.exponentialRampToValueAtTime(300, now + i * 0.06 + 0.04);

      gain.gain.setValueAtTime(0.2, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.06);
    }
  }

  // 4. MEME AIRHORN BLAST (MLG Triple Horn)
  public playAirhorn() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [
      { f1: 370, f2: 466, dur: 0.12, del: 0 },
      { f1: 370, f2: 466, dur: 0.12, del: 0.15 },
      { f1: 370, f2: 466, dur: 0.35, del: 0.32 },
    ];

    freqs.forEach((horn) => {
      const osc1 = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';
      osc1.frequency.setValueAtTime(horn.f1, now + horn.del);
      osc2.frequency.setValueAtTime(horn.f2, now + horn.del);

      gain.gain.setValueAtTime(0.18, now + horn.del);
      gain.gain.exponentialRampToValueAtTime(0.01, now + horn.del + horn.dur);

      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now + horn.del);
      filter.Q.setValueAtTime(2, now + horn.del);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(this.ctx!.destination);

      osc1.start(now + horn.del);
      osc2.start(now + horn.del);
      osc1.stop(now + horn.del + horn.dur + 0.05);
      osc2.stop(now + horn.del + horn.dur + 0.05);
    });
  }

  // 5. METAL PIPE FALLING (Resonant iconic meme acoustic)
  public playMetalPipe() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const harmonics = [587, 880, 1174, 1760, 2349, 3520];

    harmonics.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const vol = (0.3 / (idx + 1)) * 0.8;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  // 6. VINE BOOM / +10,000 AURA BASS IMPACT
  public playVineBoom() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.5);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    // Distortion boost
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.0);
  }

  // Custom Audio File Support (MP3/WAV/M4A/etc.)
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private isBgmPlaying: boolean = false;

  public setCustomAudioSource(urlOrData: string) {
    this.customAudioUrl = urlOrData || null;
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    if (urlOrData && urlOrData.trim() !== '') {
      this.customAudio = new Audio(urlOrData);
      this.customAudio.loop = true;
      this.customAudio.muted = this.isMuted;
    }
  }

  public getCustomAudioSource(): string | null {
    return this.customAudioUrl;
  }

  public hasCustomAudio(): boolean {
    return !!this.customAudioUrl && !!this.customAudio;
  }

  public startBirthdayBGM() {
    if (this.isMuted) return;

    this.stopBirthdayBGM();
    this.isBgmPlaying = true;

    // Play custom audio exclusively (built-in synthesized music removed)
    if (this.customAudio) {
      this.customAudio.currentTime = 0;
      this.customAudio.play().catch(() => {
        // Handle autoplay policy
      });
    }
  }

  public stopBirthdayBGM() {
    this.isBgmPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying && !!this.customAudio && !this.customAudio.paused;
  }
}

export const sound = new SoundFXSystem();
