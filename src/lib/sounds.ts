/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer mimicking Windows XP-era sound effects
// Designed to be lightweight, zero-dependency, and extremely faithful!

let audioCtx: AudioContext | null = null;
let isSoundEnabled = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    // Standard AudioContext initialization
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const setSoundsEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
};

export const getSoundsEnabled = () => {
  return isSoundEnabled;
};

// Helper: Custom Reverb / Echo generator using Web Audio Delay Node
function createEcho(ctx: AudioContext, input: AudioNode, delayTime = 0.25, feedbackVal = 0.4, mix = 0.3): AudioNode {
  const delay = ctx.createDelay();
  delay.delayTime.value = delayTime;

  const feedback = ctx.createGain();
  feedback.gain.value = feedbackVal;

  const wet = ctx.createGain();
  wet.gain.value = mix;

  // Feedback loop
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);

  // Connect wet path
  delay.connect(wet);
  return wet;
}

/**
 * Play Windows XP-style Startup Sound
 * Consists of:
 * 1. Warm lush pad chords (F major 7 / Bb major structures, soft attack, long release)
 * 2. High crisp chimes/bell melody (G5 -> Bb5 -> F6 -> C6 with delay/echo)
 */
export const playXpStartup = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.35, now); // comfortable volume
  masterGain.connect(ctx.destination);

  // ---- 1. WARM LUSH PAD CHORD ----
  // Notes: F3 (174.61), C4 (261.63), A4 (440.00), D5 (587.33), F5 (698.46)
  const padFreqs = [174.61, 261.63, 440.00, 587.33, 698.46];
  const padDuration = 4.0;

  padFreqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Warm tone: mix of triangle and sine
    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope
    gainNode.gain.setValueAtTime(0, now);
    // Slow swell (attack)
    gainNode.gain.linearRampToValueAtTime(0.06, now + 1.2);
    // Sustain
    gainNode.gain.setValueAtTime(0.06, now + 2.5);
    // Fade out (release)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + padDuration);

    osc.connect(gainNode);
    gainNode.connect(masterGain);
    
    osc.start(now);
    osc.stop(now + padDuration);
  });

  // ---- 2. HIGH CHIME MELODY ----
  // Melody notes: G5 (783.99), Bb5 (932.33), F6 (1396.91), C6 (1046.50)
  // Timings:
  // G5 at +1.0s
  // Bb5 at +1.25s
  // F6 at +1.5s
  // C6 at +1.8s
  const melody = [
    { freq: 783.99, time: 1.0 },
    { freq: 932.33, time: 1.25 },
    { freq: 1396.91, time: 1.50 },
    { freq: 1046.50, time: 1.80 }
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Pure crystal chime: sine wave
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    // Chime envelope: Instant strike, medium decay
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.setValueAtTime(0, now + note.time);
    gainNode.gain.linearRampToValueAtTime(0.12, now + note.time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + note.time + 1.8);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    // Also connect to a pleasant delay loop for retro space atmosphere
    const echo = createEcho(ctx, gainNode, 0.28, 0.35, 0.25);
    echo.connect(masterGain);

    osc.start(now + note.time);
    osc.stop(now + note.time + 2.5);
  });
};

/**
 * Play Windows XP-style Error Sound ("Bunk!" / "Ding!")
 * A low, metallic dual-frequency punch with very fast decay.
 */
export const playXpError = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.4, now);
  masterGain.connect(ctx.destination);

  // Windows XP error sound uses a low dissonant dual-tone around 150 Hz and 158 Hz.
  const frequencies = [148, 154, 280];
  const duration = 0.35;

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Mix of triangle and square for a punchy, warning-like timbre
    osc.type = idx === 2 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    // Envelope: sharp, rapid drop
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(idx === 2 ? 0.08 : 0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Low-pass filter to make it "dull" like the XP sound
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);

    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  });
};

/**
 * Play Windows XP-style Shutdown Sound
 * A warm chord fading down with descending melody:
 * F6 -> Bb5 -> G5 -> F5
 */
export const playXpShutdown = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.35, now);
  masterGain.connect(ctx.destination);

  // Descending melody
  const melody = [
    { freq: 1396.91, time: 0.0 }, // F6
    { freq: 932.33, time: 0.25 },  // Bb5
    { freq: 783.99, time: 0.50 },  // G5
    { freq: 698.46, time: 0.80 }   // F5
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note.freq, now + note.time);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.setValueAtTime(0, now + note.time);
    gainNode.gain.linearRampToValueAtTime(0.12, now + note.time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + note.time + 1.2);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now + note.time);
    osc.stop(now + note.time + 1.5);
  });

  // Fading backdrop chord
  const chord = [349.23, 523.25, 587.33]; // F4, C5, D5
  chord.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gainNode.gain.setValueAtTime(0.04, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.0);
  });
};

/**
 * Play Windows XP Balloon Notification Sound
 * Consists of two quick high-pitched crystal bubbles pops sliding up.
 */
export const playXpBalloon = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.2, now);
  masterGain.connect(ctx.destination);

  // First pop
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1400, now);
  osc1.frequency.exponentialRampToValueAtTime(2400, now + 0.08);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.15, now + 0.01);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start(now);
  osc1.stop(now + 0.1);

  // Second pop (slightly delayed and higher pitched)
  const delay = 0.07;
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1800, now + delay);
  osc2.frequency.exponentialRampToValueAtTime(3000, now + delay + 0.08);

  gain2.gain.setValueAtTime(0, now + delay);
  gain2.gain.linearRampToValueAtTime(0.18, now + delay + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.12);

  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(now + delay);
  osc2.stop(now + delay + 0.15);
};

/**
 * Play a quick crisp click sound for UI interaction.
 */
export const playXpClick = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Quick pitch slide down to mimic mechanical crisp button click
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
};

/**
 * 8-Bit descending square wave click synth (Terraria pickup style)
 */
export const playPixelBeep = () => {
  if (!isSoundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Classic 8-bit retro sound using square wave
  osc.type = 'square';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
  
  // Quick decay envelope
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};
