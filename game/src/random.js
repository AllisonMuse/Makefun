// A tiny seeded random source (mulberry32) so a screenshot scene with a fixed seed
// always plays out the same way. The live game seeds it from the clock.
export function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(random, list) {
  return list[Math.floor(random() * list.length)];
}
