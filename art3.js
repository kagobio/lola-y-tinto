// @ts-nocheck
import { THREE } from './models.js';
import { BG, RIOBG, MATBG, BOXBG, SPR } from './28-assets.js';
import { NPCSPR } from './npc-assets.js';
Object.assign(SPR, NPCSPR);
export const PPU = 64;
const cache = new Map();
function mkAsset(name, flip) {
  const key = name + (flip ? '|f' : ''); if (cache.has(key)) return cache.get(key);
  const m = SPR[name]; if (!m) throw new Error('no sprite ' + name);
  const [w, h, src] = m; const c = document.createElement('canvas'); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.minFilter = THREE.LinearMipmapLinearFilter; tex.magFilter = THREE.LinearFilter; tex.generateMipmaps = true; tex.anisotropy = 4;
  const a = { tex, w: w / PPU, h: h / PPU, alpha: null, pw: w, ph: h };
  const img = new Image(); img.onload = () => { const x = c.getContext('2d'); if (flip) { x.translate(w, 0); x.scale(-1, 1); } x.drawImage(img, 0, 0); a.alpha = x.getImageData(0, 0, w, h).data; tex.needsUpdate = true; };
  img.src = src; cache.set(key, a); return a;
}
export const hit = (a, u, v) => { if (!a || !a.alpha) return true; const x = Math.min(a.pw - 1, Math.max(0, Math.floor(u * a.pw))), y = Math.min(a.ph - 1, Math.max(0, Math.floor((1 - v) * a.ph))); return a.alpha[(y * a.pw + x) * 4 + 3] > 40; };
const smat = new Map();
function sm(tex) { let m = smat.get(tex); if (!m) { m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }); smat.set(tex, m); } return m; }
export function mkSprite(a, flip) { const g = new THREE.PlaneGeometry(a.w, a.h); const m = new THREE.Mesh(g, sm(a.tex)); m.rotation.x = -Math.PI / 2; m.position.set(0, 0, -a.h / 2); if (flip) m.scale.x = -1; m.userData.asset = a; const grp = new THREE.Group(); grp.add(m); grp.userData.spr = m; return grp; }
export function setAsset(grp, a) { const m = grp.userData.spr; m.material = sm(a.tex); m.geometry.dispose(); m.geometry = new THREE.PlaneGeometry(a.w, a.h); m.position.z = -a.h / 2; m.userData.asset = a; }
export function makeGround(W, D) {
  const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 4;
  const img = new Image(); img.onload = () => { t.image = img; t.needsUpdate = true; }; img.src = BG;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: t })); m.rotation.x = -Math.PI / 2; m.position.set(W / 2, 0, D / 2); return m;
}
const KEY = { counter: 'counter', fregadero: 'fregadero' };
export const ART = new Proxy({}, { get: (_, k) => () => mkAsset(KEY[k] || k) });
export function personAsset(id, dir, fr) { return mkAsset('p_' + id + dir, fr === 2); }
export function npcAsset(id) { return mkAsset('n_' + id); }
export function makeGroundAt(x0, W, D, src) {
  const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter; t.anisotropy = 4;
  const img = new Image(); img.onload = () => { t.image = img; t.needsUpdate = true; }; img.src = src || RIOBG;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: t })); m.rotation.x = -Math.PI / 2; m.position.set(x0 + W / 2, 0, D / 2); return m;
}
export function catAsset(id, dir, fr, sleep) { if (sleep) return mkAsset('c_' + id + '_sleep'); if (fr > 0) return mkAsset('c_' + id + '_walk', dir === 1); return mkAsset('c_' + id + '_sit'); }
export function plotAsset(p) {
  if (!p.type) return mkAsset('plot0'); if (p.stage <= 0) return mkAsset('plot1'); if (p.stage < 3) return mkAsset('plot2');
  return mkAsset(p.type === 'girasol' ? 'plotGirasol' : p.type === 'patata' ? 'plotPatata' : 'plotTomate');
}
export const iconURL = t => { const m = SPR[t === 'comedero' ? 'comedero1' : t === 'fregadero' ? 'fregadero' : t]; return m ? m[2] : null; };
export { RIOBG };
