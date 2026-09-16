/**
 * A small synthesised kit. No samples, nothing copyrighted, nothing preloaded —
 * the context is not created until a real user gesture asks for a sound, and
 * sound is off until the visitor turns it on.
 *
 * Ported from the oscillator kit already in public/assets/js/play.js.
 */

let AC: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

export function isEnabled() {
  return enabled;
}

export function setEnabled(on: boolean) {
  enabled = on;
  if (on) ensure();
  if (master) master.gain.value = on ? 0.5 : 0;
}

function ensure(): AudioContext | null {
  if (AC) {
    if (AC.state === 'suspended') void AC.resume();
    return AC;
  }
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  AC = new Ctor();
  master = AC.createGain();
  master.gain.value = enabled ? 0.5 : 0;
  master.connect(AC.destination);
  return AC;
}

function env(ctx: AudioContext, t: number, peak: number, dur: number) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  g.connect(master!);
  return g;
}

/** A gentle pentatonic, so any two keys pressed together still agree. */
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
const ROOT = 220;

export type Tone = 'tender' | 'bright' | 'low' | 'sharp' | 'still' | 'glad';

const VOICE: Record<Tone, { type: OscillatorType; octave: number; dur: number; peak: number; detune: number }> = {
  tender: { type: 'sine', octave: 1, dur: 1.5, peak: 0.3, detune: 4 },
  bright: { type: 'triangle', octave: 2, dur: 1.1, peak: 0.26, detune: 6 },
  low: { type: 'sine', octave: 0.5, dur: 2.0, peak: 0.34, detune: 3 },
  sharp: { type: 'square', octave: 2, dur: 0.5, peak: 0.13, detune: 8 },
  still: { type: 'sine', octave: 1, dur: 2.4, peak: 0.22, detune: 2 },
  glad: { type: 'triangle', octave: 2, dur: 0.42, peak: 0.24, detune: 10 },
};

/** `seed` picks the scale degree, so a given key always sounds like itself. */
export function play(tone: Tone = 'still', seed = 0) {
  if (!enabled) return;
  const ctx = ensure();
  if (!ctx || !master) return;

  const v = VOICE[tone];
  const t = ctx.currentTime;
  const semis = SCALE[Math.abs(seed) % SCALE.length];
  const freq = ROOT * v.octave * Math.pow(2, semis / 12);

  // Two slightly detuned voices — one oscillator alone sounds like a test tone.
  for (const cents of [-v.detune, v.detune]) {
    const o = ctx.createOscillator();
    o.type = v.type;
    o.frequency.setValueAtTime(freq, t);
    o.detune.setValueAtTime(cents, t);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(freq * 6, t);
    lp.frequency.exponentialRampToValueAtTime(Math.max(220, freq * 1.6), t + v.dur);
    o.connect(lp);
    lp.connect(env(ctx, t, v.peak / 2, v.dur));
    o.start(t);
    o.stop(t + v.dur + 0.1);
  }
}
