// @ts-nocheck
let ac = null, master = null, mode = null, timer = 0, step = 0, nextT = 0, muted = false;
function ctx() {
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); master = ac.createGain(); master.gain.value = 0.5; master.connect(ac.destination); } catch (e) { ac = null; master = null; return null; } }
  try { if (ac.state === 'suspended') { const r = ac.resume(); if (r && r.catch) r.catch(() => {}); } } catch (e) {}
  return ac;
}
function tone(f, t, d, type, v, f2) {
  if (!ac || !master) return;
  const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.02);
}
function noise(t, d, v, hp) {
  if (!ac || !master) return;
  const n = Math.floor(ac.sampleRate * d), b = ac.createBuffer(1, n, ac.sampleRate), a = b.getChannelData(0); for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1;
  const s = ac.createBufferSource(); s.buffer = b; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp; const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  s.connect(f); f.connect(g); g.connect(master); s.start(t);
}
const BASS = [55, 0, 55, 0, 65.4, 0, 55, 0, 49, 0, 55, 0, 73.4, 0, 65.4, 0];
const PHR = [329.6, 349.2, 415.3, 440, 493.9]; // E phrygian-dominant
function sched() {
  if (!ac || !mode) return;
  while (nextT < ac.currentTime + 0.15) {
    const t = nextT;
    if (mode === 'techno') {
      const s = step % 16;
      if (s % 4 === 0) tone(150, t, 0.18, 'sine', 0.9, 40);
      if (s % 4 === 2) noise(t, 0.05, 0.25, 7000);
      if (s === 4 || s === 12) noise(t, 0.12, 0.3, 1800);
      if (BASS[s]) tone(BASS[s], t, 0.16, 'sawtooth', 0.12);
      if (s % 8 === 3) tone(PHR[(step >> 3) % 5] / 2, t, 0.1, 'square', 0.04);
      nextT += 60 / 128 / 4;
    } else {
      const s = step % 12; const acc = [0, 3, 6, 8, 10]; // compás de 12
      if (acc.includes(s)) { noise(t, 0.08, 0.35, 1200); tone(PHR[0] / 2, t, 0.25, 'triangle', 0.18); }
      if (s === 0 || s === 6) for (let i = 0; i < 4; i++) tone(PHR[i % 5], t + i * 0.025, 0.4, 'sawtooth', 0.05);
      if (s % 2 === 1) tone(PHR[(step * 3) % 5] * 2, t, 0.12, 'triangle', 0.07);
      nextT += 60 / 168 / 2;
    }
    step++;
  }
}
export function startMusic(m) { if (!ctx()) return; mode = m; step = 0; nextT = ac.currentTime + 0.05; clearInterval(timer); timer = setInterval(sched, 40); }
export function stopMusic() { mode = null; clearInterval(timer); }
export function setMuted(m) { muted = m; if (master) master.gain.value = m ? 0 : 0.5; }
export function sfx(k) {
  if (k === 'init') { ctx(); return; }
  if (!ctx() || muted) return; const t = ac.currentTime;
  if (k === 'coin') { tone(880, t, 0.08, 'square', 0.08); tone(1320, t + 0.07, 0.12, 'square', 0.08); }
  else if (k === 'place') { tone(200, t, 0.12, 'square', 0.12, 90); }
  else if (k === 'tick') { tone(500, t, 0.05, 'square', 0.05); }
  else if (k === 'win') { [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.09, 0.18, 'square', 0.09)); }
  else if (k === 'water') { noise(t, 0.4, 0.15, 3000); }
  else if (k === 'sizzle') { noise(t, 1.2, 0.12, 4000); }
  else if (k === 'purr') { tone(70, t, 0.5, 'sawtooth', 0.06); tone(78, t + 0.1, 0.5, 'sawtooth', 0.05); }
  else if (k === 'quack') { tone(240, t, 0.1, 'sawtooth', 0.1, 150); tone(210, t + 0.14, 0.14, 'sawtooth', 0.09, 120); }
  else if (k === 'paso') { tone(140, t, 0.045, 'triangle', 0.03); tone(190, t, 0.03, 'triangle', 0.016); }
  else if (k === 'door') { tone(170, t, 0.14, 'square', 0.07, 330); noise(t + 0.03, 0.1, 0.06, 2500); }
  else if (k === 'splash') { noise(t, 0.32, 0.2, 900); tone(300, t, 0.22, 'sine', 0.12, 85); }
  else if (k === 'meow') { tone(640, t, 0.13, 'sawtooth', 0.045, 890); tone(700, t + 0.15, 0.2, 'sawtooth', 0.04, 430); }
  else if (k === 'blip') { tone(660, t, 0.05, 'square', 0.035); }
  else if (k === 'pop') { tone(440, t, 0.06, 'square', 0.06, 880); }
}

export function audioDebug() { return { state: (typeof ac !== 'undefined' && ac) ? ac.state : 'none', t: (typeof ac !== 'undefined' && ac) ? +ac.currentTime.toFixed(2) : 0, muted: (typeof muted !== 'undefined' ? muted : null), mode: (typeof mode !== 'undefined' ? mode : null), gain: (typeof master !== 'undefined' && master) ? master.gain.value : null }; }
