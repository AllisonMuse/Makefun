// Tiny synthesized sounds, no audio files: a WebAudio oscillator and a noise burst.
// The game never needs sound to play; every call is guarded so a browser without
// audio (or a muted tab) just stays quiet.
export function createAudio() {
  let context = null;
  function ensure() {
    if (context) return context;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
    } catch {
      return null;
    }
    return context;
  }
  function tone(frequency, duration, type, gainValue, when = 0) {
    const ctx = ensure();
    if (!ctx) return;
    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(gainValue, ctx.currentTime + when);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + when + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(ctx.currentTime + when);
      oscillator.stop(ctx.currentTime + when + duration);
    } catch { /* sound is optional */ }
  }
  return {
    chop() { tone(180, 0.08, 'square', 0.08); },
    sizzle() { tone(1200, 0.15, 'sine', 0.03); tone(900, 0.2, 'sine', 0.02, 0.05); },
    pickup() { tone(660, 0.07, 'sine', 0.06); },
    served() { tone(523, 0.12, 'sine', 0.1); tone(659, 0.12, 'sine', 0.1, 0.09); tone(784, 0.2, 'sine', 0.1, 0.18); },
    wrong() { tone(140, 0.25, 'sawtooth', 0.08); },
    lost() { tone(220, 0.3, 'triangle', 0.08); tone(165, 0.4, 'triangle', 0.08, 0.15); },
    levelUp() { tone(440, 0.1, 'sine', 0.09); tone(587, 0.1, 'sine', 0.09, 0.08); tone(880, 0.18, 'sine', 0.09, 0.16); },
  };
}
