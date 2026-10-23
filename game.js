// @ts-nocheck
import { THREE } from './models.js';
import { iconURL, makeGround, makeGroundAt, mkSprite, setAsset, hit, ART, personAsset, catAsset, plotAsset } from './art3.js';
import { startMusic, stopMusic, sfx, setMuted } from './audio.js';
import { MATBG, BOXBG } from './28-assets.js';

const W = 31, D = 23, GROW = 14;
const RIO = { x0: 34, W: 36, D: 24 };
const MAT = { x0: 72, W: 26, D: 18 };
const BOX = { x0: 100, W: 20, D: 14 };
const GW = BOX.x0 + BOX.W, GD = Math.max(D, RIO.D, MAT.D, BOX.D);
const CATALOG = {
  sofa: { name: 'Sofá', e: '🛋️', price: 90, w: 3, d: 1, flavor: 'Un sofá: gimnasio oficial de Lola y Tinto.' },
  planta: { name: 'Planta', e: '🪴', price: 20, w: 1, d: 1, flavor: 'Da vidilla. Mientras los gatos no se la coman.' },
  ficus: { name: 'Ficus grande', e: '🌿', price: 35, w: 1, d: 1, flavor: 'Selva urbana.' },
  alfombra: { name: 'Alfombra', e: '🟫', price: 30, w: 2, d: 2, walk: true, flavor: 'Mullida. Ideal para siesta de gato.' },
  techno: { name: 'Altavoz techno', e: '🔊', price: 40, w: 1, d: 1, use: 'techno', flavor: 'Toca para poner techno.' },
  flamenco: { name: 'Altavoz flamenco', e: '💃', price: 40, w: 1, d: 1, use: 'flamenco', flavor: 'Toca para poner flamenco.' },
  mancuernas: { name: 'Zona CrossFit', e: '🏋️', price: 45, w: 2, d: 2, walk: true, use: 'crossfit', flavor: 'Barra, kettlebells y mancuernas. WOD del día.' },
  pc: { name: 'Escritorio con PC', e: '💻', price: 70, w: 3, d: 1, use: 'pc', flavor: 'Para trabajar de informático.' },
  tax: { name: 'Escritorio de Hacienda', e: '🧾', price: 70, w: 3, d: 1, use: 'tax', flavor: 'Papeles, sellos y la calculadora.' },
  estanteria: { name: 'Estantería', e: '📚', price: 35, w: 2, d: 1, flavor: 'Libros de colores.' },
  lampara: { name: 'Lámpara', e: '💡', price: 18, w: 1, d: 1, flavor: 'Luz cálida.' },
  camaGato: { name: 'Cama para gatos', e: '🐾', price: 25, w: 1, d: 1, flavor: 'Los gatos la ignorarán a favor de una caja.' },
  sillon: { name: 'Sillón azul', e: '💺', price: 60, w: 2, d: 1, flavor: 'Un sillón para dos que caben en uno.' },
  cuadroFlamenco: { name: 'Cuadro flamenco', e: '🖼️', price: 25, w: 1, d: 1, wall: true, flavor: 'Olé.' },
  cuadroTechno: { name: 'Póster techno', e: '🌌', price: 25, w: 1, d: 1, wall: true, flavor: 'Neones.' },
  reloj: { name: 'Reloj de pared', e: '🕒', price: 15, w: 1, d: 1, wall: true, flavor: 'Siempre da la hora (más o menos).' },
  catTree: { name: 'Árbol rascador', e: '🌳', price: 0, w: 1, d: 1, flavor: 'El reino de Lola y Tinto.', hidden: true },
  tv: { name: 'Tele', e: '📺', price: 0, w: 3, d: 1, use: 'tv', hidden: true, flavor: 'Una serie.' },
  mesa: { name: 'Mesa', e: '🍽️', price: 0, w: 3, d: 2, use: 'table', hidden: true },
  cama: { name: 'Cama', e: '🛏️', price: 0, w: 3, d: 2, use: 'bed', hidden: true },
  mesilla: { name: 'Mesilla', e: '🗄️', price: 0, w: 1, d: 1, hidden: true, flavor: 'Mesilla de madera.' },
  comedero: { name: 'Comedero', e: '🐟', price: 0, w: 1, d: 1, use: 'bowl', hidden: true },
  nevera: { name: 'Nevera', e: '🧊', w: 1, d: 1, use: 'fridge', hidden: true, fixed: true },
  fogones: { name: 'Fogones y horno', e: '🍳', w: 1, d: 1, use: 'cook', hidden: true, fixed: true },
  lavadora: { name: 'Lavadora', e: '🧺', w: 1, d: 1, hidden: true, fixed: true, flavor: 'La lavadora: ropa de CrossFit, la de siempre.' },
  fregadero: { name: 'Fregadero', e: '🚰', w: 3, d: 1, use: 'sink', hidden: true, fixed: true },
  grifo: { name: 'Barril de agua', e: '🚿', w: 2, d: 1, use: 'sink', hidden: true, fixed: true },
  inodoro: { name: 'Baño', e: '🚽', w: 1, d: 1, hidden: true, fixed: true, flavor: 'Lo básico.' },
};
const ARTKEY = new Proxy({}, { get: (_, t) => t === 'comedero' ? 'comedero0' : t });
const artOf = t => ART[ARTKEY[t]]();
const ITEMS = {
  huevo: { n: 'Huevos', e: '🥚', buy: 3, sell: 1 }, patata: { n: 'Patata', e: '🥔', buy: 2, sell: 1 }, cebolla: { n: 'Cebolla', e: '🧅', buy: 2, sell: 1 },
  pescado: { n: 'Pescado', e: '🐟', buy: 6, sell: 3 }, platano: { n: 'Plátano', e: '🍌', buy: 2, sell: 1 }, leche: { n: 'Leche', e: '🥛', buy: 2, sell: 1 },
  tomate: { n: 'Tomate', e: '🍅', buy: 3, sell: 4 }, pimiento: { n: 'Pimiento', e: '🫑', buy: 3, sell: 4 }, girasol: { n: 'Girasol', e: '🌻', sell: 25 },
  s_tomate: { n: 'Semillas de tomate', e: '🌱', buy: 4, seed: 'tomate', sell: 0 }, s_patata: { n: 'Semillas de patata', e: '🌱', buy: 3, seed: 'patata', sell: 0 },
  s_pimiento: { n: 'Semillas de pimiento', e: '🌱', buy: 4, seed: 'pimiento', sell: 0 }, s_girasol: { n: 'Semillas de girasol', e: '🌱', buy: 5, seed: 'girasol', sell: 0 },
  tortilla: { n: 'Tortilla de patata', e: '🍳', sell: 30, eat: 40 }, ensalada: { n: 'Ensalada', e: '🥗', sell: 25, eat: 30 },
  batido: { n: 'Batido post-CrossFit', e: '🥤', sell: 15, eat: 25 }, pescadito: { n: 'Pescadito para gatos', e: '🍣', sell: 0, cat: true },
};
const RECIPES = [
  { id: 'tortilla', n: 'Tortilla de patata', e: '🍳', need: { patata: 2, huevo: 2, cebolla: 1 } },
  { id: 'pescadito', n: 'Pescadito para Lola y Tinto', e: '🍣', need: { pescado: 1 } },
  { id: 'batido', n: 'Batido post-CrossFit', e: '🥤', need: { platano: 1, leche: 1 } },
  { id: 'ensalada', n: 'Ensalada de huerto', e: '🥗', need: { tomate: 2, pimiento: 1 } },
];
const CROPS = { tomate: { c: 0xd8352a }, patata: { c: 0x8a6a40 }, pimiento: { c: 0xe8902a }, girasol: { c: 0xf2c631 } };
const PLOTS = [[5, 16], [7, 16], [9, 16], [5, 18], [7, 18], [9, 18]];
const MISSIONS = [
  { id: 'comedero', t: 'Llena el comedero de Lola y Tinto con un pescadito', r: 20 },
  { id: 'tortilla', t: 'Cocina una tortilla de patata', r: 20 },
  { id: 'cosecha', t: 'Cosecha tu primera verdura del huerto', r: 25 },
  { id: 'mimos', t: 'Hazles 4 mimos a Lola y Tinto', r: 15 },
  { id: 'mueble', t: 'Compra y coloca un mueble nuevo', r: 20 },
  { id: 'musica', t: 'Pon música: techno o flamenco', r: 20 },
  { id: 'crossfit', t: 'Haced CrossFit', r: 20 },
  { id: 'trabajo', t: 'Trabaja un rato (informática o Hacienda)', r: 30 },
  { id: 'paseo', t: 'Sal a pasear por Madrid Río', r: 25 },
  { id: 'puente', t: 'Cruza el puente del Manzanares hasta la otra orilla', r: 25 },
  { id: 'matadero', t: 'Visita el Matadero, las antiguas naves de Arganzuela', r: 30 },
  { id: 'box', t: 'Haced un WOD los dos en el box de CrossFit', r: 30 },
];
const SAVE = 'lyt-casa-v4';

function defaultState() {
  return {
    coins: 220, day: 1, can: 6, names: { el: 'Él', ella: 'Ella' }, energy: { el: 100, ella: 100 },
    inv: { s_tomate: 2, s_girasol: 1, huevo: 2, patata: 2, cebolla: 1, pescado: 1 },
    furn: [
      { uid: 1, type: 'catTree', x: 7, z: 7, r: 0 }, { uid: 2, type: 'sofa', x: 10, z: 9, r: 0 }, { uid: 3, type: 'tv', x: 9, z: 5, r: 0 },
      { uid: 4, type: 'mesa', x: 18, z: 10, r: 0 },
      { uid: 9, type: 'cama', x: 20, z: 5, r: 0 }, { uid: 10, type: 'mesilla', x: 23, z: 5, r: 0 }, { uid: 13, type: 'pc', x: 24, z: 5, r: 0 },
      { uid: 12, type: 'comedero', x: 7, z: 10, r: 0 }, { uid: 14, type: 'estanteria', x: 13, z: 5, r: 0 }, { uid: 15, type: 'lampara', x: 16, z: 5, r: 0 },
      { uid: 20, type: 'nevera', x: 17, z: 8, r: 0, fixed: 1 }, { uid: 21, type: 'fogones', x: 18, z: 8, r: 0, fixed: 1 }, { uid: 23, type: 'fregadero', x: 19, z: 8, r: 0, fixed: 1 }, { uid: 22, type: 'lavadora', x: 22, z: 8, r: 0, fixed: 1 },
      { uid: 25, type: 'grifo', x: 11, z: 17, r: 0, fixed: 1 }, { uid: 26, type: 'inodoro', x: 24, z: 9, r: 0, fixed: 1 },
    ],
    plots: PLOTS.map(() => ({ type: null, stage: 0, water: 0, t: 0 })),
    bowl: 0, cats: { lola: { hunger: 80, love: 60 }, tinto: { hunger: 80, love: 60 } },
    stats: {}, done: {}, nextUid: 100, ended: false, started: false, pos: null, seenRioNote: false,
  };
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(SAVE)); if (s && s.furn) return Object.assign(defaultState(), s); } catch (e) {}
  return defaultState();
}

/* ---------------- DOM helpers ---------------- */
function h(tag, cls, content, attrs) {
  const e = document.createElement(tag); if (cls) e.className = cls;
  if (content !== undefined && content !== null) { if (Array.isArray(content)) content.forEach(c => c && e.append(c)); else if (content instanceof Node) e.append(content); else e.textContent = content; }
  if (attrs) Object.assign(e, attrs); return e;
}
function btn(text, cb, cls) { const b = h('button', 'g-btn ' + (cls || ''), text); b.type = 'button'; b.addEventListener('click', e => { e.stopPropagation(); cb(e); }); return b; }

function tex(draw, size, rx, ry) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'); draw(x, size);
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const rnd = (() => { let s = 7; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; })();

const EMO = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2300}-\u{23FF}\u{2190}-\u{21FF}]/gu;
const stripE = t => t.replace(/🪙 ?/gu, 'Monedas ').replace(EMO, '').replace(/ {2,}/g, ' ').replace(/^ +/, '').replace(/ +([.,:])/g, '$1');
export function mountGame(root) {
  const S = load();
  const save = () => {
    try {
      if (typeof chars !== 'undefined') { S.pos = S.pos || {}; for (const id of ['el', 'ella']) { const [cx, cz] = cellOf(chars[id].g.position); S.pos[id] = { x: cx, z: cz, w: chars[id].where }; } }
      localStorage.setItem(SAVE, JSON.stringify(S));
    } catch (e) {}
  };

  /* layout */
  root.innerHTML = '';
  root.classList.add('g-root');
  const stage = h('div', 'g-stage'); root.append(stage);
  const cardIcon = (id, c) => { const u = iconURL(id); if (!u) return h('div', 'g-card-e', ''); const im = h('img', 'g-card-i'); im.src = u; return im; };
  const cleanNode = n => { if (n.nodeType === 3) { if (/[^\u0000-\u2000]/.test(n.nodeValue)) { const v = stripE(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } } else n.childNodes.forEach(cleanNode); };
  new MutationObserver(ms => { for (const m of ms) { if (m.type === 'characterData') cleanNode(m.target); else m.addedNodes.forEach(cleanNode); } }).observe(root, { childList: true, subtree: true, characterData: true });
  const canvas = h('canvas', 'g-canvas'); stage.append(canvas);
  const ui = h('div', 'g-ui'); stage.append(ui);
  const floats = h('div', 'g-floats'); ui.append(floats);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2)); renderer.setClearColor(0x3f7a35);
  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-10, 10, 10, -10, -100, 200);
  scene.add(makeGround(W, D));
  scene.add(makeGroundAt(RIO.x0, RIO.W, RIO.D));
  scene.add(makeGroundAt(MAT.x0, MAT.W, MAT.D, MATBG));
  scene.add(makeGroundAt(BOX.x0, BOX.W, BOX.D, BOXBG));
  const put = (a, x, zb, y) => { const g = mkSprite(a); g.position.set(x, (y || 0.1) + zb * 0.01, zb); scene.add(g); return g; };

  /* ---------------- grid / furniture ---------------- */
  const blocked = Array.from({ length: GW }, () => new Array(GD).fill(0));
  const terr = Array.from({ length: GW }, () => new Array(GD).fill(0));
  const statik = Array.from({ length: GW }, () => new Array(GD).fill(0));
  for (const [x0, z0, x1, z1] of [[6, 6, 15, 10], [8, 4, 19, 5], [6, 5, 7, 5], [16, 8, 16, 9], [17, 8, 22, 12], [20, 4, 26, 6], [25, 7, 25, 7], [24, 8, 26, 10], [23, 9, 23, 9], [14, 11, 14, 12], [12, 13, 17, 14], [4, 15, 12, 20], [13, 15, 16, 20], [17, 15, 19, 20], [20, 15, 29, 15], [18, 14, 29, 14]]) for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) terr[x][z] = 1;
  // --- Madrid Río (segundo mapa, desplazado RIO.x0) ---
  const RX = RIO.x0;
  const rterr = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) terr[RX + x][z] = 1; };
  const rstat = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) statik[RX + x][z] = 1; };
  rterr(0, 7, 35, 9);       // plaza del Matadero
  rterr(16, 9, 20, 11);     // paseo central plaza -> paseo
  rterr(21, 10, 29, 11);    // gen8: carril este plaza -> paseo (arregla acceso al Box)
  rterr(0, 12, 35, 14);     // paseo principal + franja de bancos
  rterr(17, 12, 18, 22);    // puente sobre el Manzanares
  rterr(0, 22, 35, 23);     // orilla sur
  // salida de casa: sendero del jardín hasta la valla
  for (const [gx, gz] of [[14, 21], [15, 21], [16, 21], [14, 22], [15, 22], [16, 22]]) terr[gx][gz] = 1;
  // obstáculos del parque
  rstat(2, 7, 5, 9);        // edificio gris (Cineteca)
  rstat(27, 7, 34, 8);      // jardín derecho de la plaza
  rstat(17, 7, 18, 8);      // fuente circular de la plaza
  rstat(30, 10, 31, 11);    // kiosco
  rstat(0, 13, 2, 14); rstat(31, 13, 35, 14); // arboledas del paseo
  rstat(1, 12, 1, 12);      // cartel "A casa"
  rstat(28, 13, 29, 14);    // estación de calistenia
  rstat(0, 22, 1, 23); rstat(32, 22, 35, 23); rstat(22, 22, 22, 22); // orilla sur
  for (const [bx, bz] of [[7, 7], [12, 7], [22, 7], [12, 11], [13, 11], [23, 11], [24, 11], [4, 12], [27, 12], [2, 22], [3, 22], [10, 22], [11, 22], [23, 22]]) statik[RX + bx][bz] = 1; // árboles de plaza y bancos
  // --- Matadero interior (MAT) y box de CrossFit (BOX) ---
  const MX = MAT.x0, BXX = BOX.x0;
  const mterr = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) terr[MX + x][z] = 1; };
  const mstat = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) statik[MX + x][z] = 1; };
  const bterr = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) terr[BXX + x][z] = 1; };
  const bstat = (x0, z0, x1, z1) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) statik[BXX + x][z] = 1; };
  mterr(0, 0, MAT.W - 1, MAT.D - 1);
  mstat(0, 0, 1, 17); mstat(24, 0, 25, 17); mstat(0, 0, 25, 2);   // muros de ladrillo
  mstat(0, 15, 11, 17); mstat(14, 15, 25, 17);                    // muro sur; puerta x12..13 z15..17
  mstat(3, 5, 8, 7); mstat(17, 5, 22, 7); mstat(10, 9, 16, 11);   // paneles de expo
  mstat(3, 12, 6, 13);                                            // butacas Cineteca
  bterr(0, 0, BOX.W - 1, BOX.D - 1);
  bstat(0, 0, 1, 13); bstat(18, 0, 19, 13); bstat(0, 0, 19, 1);   // muros
  bstat(0, 12, 8, 13); bstat(11, 12, 19, 13);                     // muro sur; puerta x9..10 z12..13
  bstat(2, 4, 2, 7);          // rig izquierdo
  bstat(17, 4, 18, 6);        // rig derecho con anillas
  bstat(16, 2, 16, 4);        // cuerda de trepar
  bstat(7, 9, 9, 11);         // cajas pliométricas (x10..11 libres: pasillo puerta)
  bstat(2, 11, 3, 12);        // bici de asalto
  bstat(17, 10, 17, 12);      // pila de discos
  // box de CrossFit: edificio-isla al este del paseo de Madrid Río, puerta al sur
  rstat(32, 10, 35, 11);
  const fmesh = new Map(); // uid -> group
  const refs = [];       // interactables
  const plotCells = i => { const [x, z] = PLOTS[i]; return [[x, z], [x + 1, z], [x, z + 1], [x + 1, z + 1]]; };
  function fp(t, r) { const c = CATALOG[t]; return [c.w, c.d]; }
  function cellsOf(f) { const [fw, fd] = fp(f.type, f.r); const out = []; for (let i = 0; i < fw; i++) for (let j = 0; j < fd; j++) out.push([f.x + i, f.z + j]); return out; }
  function rebuildBlocked() { for (const col of blocked) col.fill(0); for (const f of S.furn) { const c = CATALOG[f.type]; if (c.wall || c.walk) continue; for (const [x, z] of cellsOf(f)) if (x >= 0 && z >= 0 && x < W && z < D) blocked[x][z]++; } for (let i = 0; i < PLOTS.length; i++) for (const [x, z] of plotCells(i)) blocked[x][z]++; }
  function placeMesh(f) {
    const c = CATALOG[f.type]; const grp = mkSprite(artOf(f.type), f.r % 2 === 1);
    const [fw, fd] = fp(f.type, f.r); const zb = c.wall ? 3.3 : f.z + fd; grp.position.set(f.x + fw / 2, (c.walk ? 0.06 : 0.1) + zb * 0.01, zb); grp.userData.ref = { kind: 'furn', f }; scene.add(grp); fmesh.set(f.uid, grp);
    if (f.type === 'comedero') setAsset(grp, S.bowl > 0 ? ART.comedero1() : ART.comedero0());
  }
  function removeMesh(uid) { const g = fmesh.get(uid); if (g) { scene.remove(g); fmesh.delete(uid); } }
  S.furn.forEach(placeMesh); rebuildBlocked();

  // plots (raised beds)
  const plotG = PLOTS.map(([x, z], i) => { const g = mkSprite(plotAsset({})); g.position.set(x + 1, 0.1 + (z + 2) * 0.01, z + 2); g.userData.ref = { kind: 'plot', i }; scene.add(g); return g; });
  function drawPlot(i) { setAsset(plotG[i], plotAsset(S.plots[i])); }
  S.plots.forEach((_, i) => drawPlot(i));

  /* ---------------- Madrid Río: objetos e interacciones ---------------- */
  function zoneRef(kind, cells, extra) {
    let x0 = 1e9, z0 = 1e9, x1 = -1e9, z1 = -1e9;
    for (const [x, z] of cells) { x0 = Math.min(x0, x); z0 = Math.min(z0, z); x1 = Math.max(x1, x); z1 = Math.max(z1, z); }
    const w = x1 - x0 + 1, d = z1 - z0 + 1;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.set(x0 + w / 2, 0.05 + (z0 + d) * 0.01, z0 + d / 2);
    m.userData.ref = Object.assign({ kind, cells }, extra || {});
    scene.add(m); return m;
  }
  const RL = (cells) => cells.map(([x, z]) => [RX + x, z]);
  zoneRef('matadero', RL([[13, 6], [14, 6], [15, 6], [16, 6], [17, 6], [18, 6], [19, 6], [20, 6], [21, 6], [22, 6]]));
  zoneRef('kiosk', RL([[30, 10], [31, 10], [30, 11], [31, 11]]));
  zoneRef('fuente', RL([[17, 7], [18, 7], [17, 8], [18, 8]]));
  for (const bc of [[[12, 11], [13, 11]], [[23, 11], [24, 11]], [[4, 12]], [[27, 12]], [[10, 22], [11, 22]], [[2, 22], [3, 22]]]) zoneRef('bench', RL(bc));
  zoneRef('gymout', RL([[28, 13], [29, 13], [28, 14], [29, 14]]));
  const signRio = put(ART.cartel(), RX + 1.5, 12.8); signRio.userData.ref = { kind: 'gate', to: 'casa', cells: RL([[1, 12]]) };
  const signCasa = put(ART.cartel(), 13.4, 22.7); signCasa.userData.ref = { kind: 'gate', to: 'rio', cells: [[13, 22]] };
  const signMat = put(ART.cartel(), RX + 17.5, 8.6); signMat.userData.ref = { kind: 'gate', to: 'mat', cells: RL([[17, 8]]) };
  const signBox = put(ART.cartel(), RX + 33.5, 13.6); signBox.userData.ref = { kind: 'gate', to: 'box', cells: RL([[33, 13]]) };
  put(ART.gymout(), RX + 29.4, 15.05);
  const ducks = [];
  for (let i = 0; i < 3; i++) {
    const dz = 17.6 + (i % 2) * 1.6;
    const dg = put(ART.pato(), RX + 6 + i * 11, dz + 1);
    dg.userData.ref = { kind: 'duck', cells: [] };
    ducks.push({ g: dg, z: dz + 1, v: 0.35 + i * 0.12 });
  }
  ducks[0].g.userData.ref.g = ducks[0].g; ducks[1].g.userData.ref.g = ducks[1].g; ducks[2].g.userData.ref.g = ducks[2].g;
  const ML = (cells) => cells.map(([x, z]) => [MX + x, z]);
  const BL = (cells) => cells.map(([x, z]) => [BXX + x, z]);
  zoneRef('expo', ML([[3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7], [8, 7]]), { n: 1 });
  zoneRef('expo', ML([[17, 5], [18, 5], [19, 5], [20, 5], [21, 5], [22, 5], [17, 6], [18, 6], [19, 6], [20, 6], [21, 6], [22, 6], [17, 7], [18, 7], [19, 7], [20, 7], [21, 7], [22, 7]]), { n: 2 });
  zoneRef('expo', ML([[10, 9], [11, 9], [12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [10, 10], [11, 10], [12, 10], [13, 10], [14, 10], [15, 10], [16, 10], [10, 11], [11, 11], [12, 11], [13, 11], [14, 11], [15, 11], [16, 11]]), { n: 3 });
  zoneRef('cineteca', ML([[3, 12], [4, 12], [5, 12], [6, 12], [3, 13], [4, 13], [5, 13], [6, 13]]));
  const infoMat = put(ART.cartel(), MX + 15.5, 14.6); infoMat.userData.ref = { kind: 'matainfo', cells: ML([[15, 14]]) }; statik[MX + 15][14] = 1;
  const exitMat = put(ART.cartel(), MX + 12.5, 16.6); exitMat.userData.ref = { kind: 'gate', to: 'rio', cells: ML([[12, 16]]) }; statik[MX + 12][16] = 1;
  zoneRef('wod', BL([[2, 4], [2, 5], [2, 6], [2, 7]]), { st: 'el rig' });
  zoneRef('wod', BL([[17, 4], [18, 4], [17, 5], [18, 5], [17, 6], [18, 6]]), { st: 'las anillas' });
  zoneRef('wod', BL([[16, 2], [16, 3], [16, 4]]), { st: 'la cuerda' });
  zoneRef('wod', BL([[7, 9], [8, 9], [9, 9], [7, 10], [8, 10], [9, 10], [7, 11], [8, 11], [9, 11]]), { st: 'las cajas' });
  const exitBox = put(ART.cartel(), BXX + 9.5, 12.6); exitBox.userData.ref = { kind: 'gate', to: 'rio', cells: BL([[9, 12]]) }; statik[BXX + 9][12] = 1;
  zoneRef('boxdoor', RL([[31, 12], [32, 12], [33, 12], [34, 12], [35, 12], [33, 13], [34, 13]]));

  /* ---------------- people & cats ---------------- */
  const startCell = { el: [12, 7], ella: [13, 7] };
  const chars = {};
  for (const id of ['el', 'ella']) {
    const g = mkSprite(personAsset(id, 0, 0)); scene.add(g);
    const sp = S.pos && S.pos[id]; const [cx, cz] = sp && typeof sp.x === 'number' ? [sp.x, sp.z] : startCell[id];
    g.position.set(cx + 0.5, 0.1, cz + 0.5);
    g.userData.ref = { kind: 'person', id };
    chars[id] = { id, g, path: [], busy: null, anim: 0, after: null, face: 0, dir: 0, where: sp && sp.w && (sp.w === 'rio' || sp.w === 'mat' || sp.w === 'box') ? sp.w : 'casa' };
  }
  let active = 'el';
  const cats = {};
  for (const [id, cell] of [['lola', [8, 8]], ['tinto', [15, 5]]]) {
    const g = mkSprite(catAsset(id, 0, 0)); scene.add(g); g.position.set(cell[0] + 0.5, 0.1, cell[1] + 0.5); g.userData.ref = { kind: 'cat', id };
    cats[id] = { id, g, path: [], wait: 1 + Math.random() * 3, state: 'idle', y: 0, pet: 0, anim: 0, dir: 0, sleeping: false, face: 0 };
  }
  // name tags
  const tag = {};
  function mkTag(id, text, cls) { const e = h('div', 'g-tag ' + (cls || ''), text); floats.append(e); tag[id] = e; }
  mkTag('el', S.names.el, 'p'); mkTag('ella', S.names.ella, 'p'); mkTag('lola', 'Lola', 'c'); mkTag('tinto', 'Tinto', 'c');
  const prog = h('div', 'g-prog'); prog.append(h('div', 'g-prog-bar'), h('span', '')); floats.append(prog); prog.style.display = 'none';

  /* ---------------- pathing ---------------- */
  const cellOf = p => [Math.max(0, Math.min(GW - 1, Math.floor(p.x))), Math.max(0, Math.min(GD - 1, Math.floor(p.z)))];
  const free = (x, z) => x >= 0 && z >= 0 && x < GW && z < GD && terr[x][z] === 1 && blocked[x][z] === 0 && !statik[x][z];
  function bfs(sx, sz, goal) {
    const key = (x, z) => x * GD + z; const prev = new Map([[key(sx, sz), null]]); const q = [[sx, sz]];
    if (goal(sx, sz)) return [];
    for (let qi = 0; qi < q.length; qi++) {
      const [x, z] = q[qi];
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = x + dx, nz = z + dz; if (!free(nx, nz) || prev.has(key(nx, nz))) continue;
        if (dx && dz && (!free(x + dx, z) || !free(x, z + dz))) continue;
        prev.set(key(nx, nz), [x, z]);
        if (goal(nx, nz)) { const out = []; let c = [nx, nz]; while (c && !(c[0] === sx && c[1] === sz)) { out.push(c); c = prev.get(key(c[0], c[1])); } return out.reverse(); }
        q.push([nx, nz]);
      }
    }
    return null;
  }
  function adjGoal(cells) { const set = new Set(cells.map(c => c[0] + ',' + c[1])); return (x, z) => { for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (set.has((x + dx) + ',' + (z + dz))) return true; return false; }; }

  /* ---------------- HUD ---------------- */
  const top = h('div', 'g-top'); ui.append(top);
  const coinsEl = h('div', 'g-pill'); const dayEl = h('div', 'g-pill');
  const musicBtn = btn('Música', () => { toggleMute(); }, 'g-ico');
  const inIframe = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  if (inIframe) { stage.classList.add('g-fill'); stage.style.setProperty('--g-top-inset', 'calc(62px + env(safe-area-inset-top, 0px))'); }
  else { stage.classList.add('g-fill'); stage.style.setProperty('--g-top-inset', 'env(safe-area-inset-top, 0px)'); }
  let fsBtn = null;
  function toggleFS() {
    try {
      if (document.fullscreenElement) { const p = document.exitFullscreen(); if (p && p.catch) p.catch(() => {}); return; }
      if (stage.requestFullscreen) { const p = stage.requestFullscreen(); if (p && p.catch) p.catch(() => {}); }
    } catch (e) {}
  }
  if (document.fullscreenEnabled) {
    fsBtn = btn('Pantalla', () => { toggleFS(); }, 'g-ico');
    document.addEventListener('fullscreenchange', () => { if (fsBtn) fsBtn.textContent = document.fullscreenElement ? 'Salir' : 'Pantalla'; });
  }
  top.append(coinsEl, dayEl, h('div', 'g-sp'), musicBtn); if (fsBtn) top.append(fsBtn);
  const chips = h('div', 'g-chips'); ui.append(chips);
  const chipEl = {};
  for (const id of ['el', 'ella']) { const c = h('button', 'g-chip'); c.type = 'button'; c.addEventListener('click', e => { e.stopPropagation(); setActive(id); }); chips.append(c); chipEl[id] = c; }
  const catsEl = h('div', 'g-cats'); ui.append(catsEl);
  const bar = h('div', 'g-bar'); ui.append(bar);
  const toast = h('div', 'g-toast'); ui.append(toast);
  let toastT = 0;
  function say(t, ms) { toast.textContent = t; toast.classList.add('on'); toastT = ms || 2600; }
  let muted = false;
  function toggleMute() { muted = !muted; setMuted(muted); musicBtn.textContent = muted ? 'Sin sonido' : 'Música'; }
  const zoomLevels = [0.75, 1, 1.5]; let zi = 1;
  const bShop = btn('🛒 Tienda', () => openShop(), '');
  const bGoal = btn('Objetivos', () => openMissions(), '');
  const bBag = btn('Mochila', () => openBag(), '');
  const bReform = btn('Reforma', () => { if (chars[active].where !== 'casa' && !reform) { say('La reforma es en casa; fuera no.'); return; } reform = !reform; bReform.classList.toggle('on', reform); say(reform ? 'Modo reforma: toca un mueble para moverlo.' : 'Modo reforma desactivado.'); }, '');
  const bZoom = btn('Zoom', () => { zi = (zi + 1) % zoomLevels.length; follow = true; }, '');
  const bSave2 = btn('💾 Partida', () => openSaveGame(), '');
  bar.append(bShop, bGoal, bBag, bReform, bZoom, bSave2);
  let reform = false;

  function missionsDone() { return MISSIONS.filter(m => S.done[m.id]).length; }
  function updateHUD() {
    coinsEl.textContent = 'Monedas ' + S.coins; dayEl.textContent = '☀️ Día ' + S.day;
    for (const id of ['el', 'ella']) {
      const c = chipEl[id]; c.className = 'g-chip' + (active === id ? ' on' : ''); c.innerHTML = '';
      c.append(h('span', 'g-chip-n', (id === 'el' ? '👨‍💻 ' : '👩‍💼 ') + S.names[id]), h('span', 'g-meter', [Object.assign(h('i'), { style: 'width:' + Math.round(S.energy[id]) + '%' })]));
      tag[id].textContent = S.names[id];
    }
    catsEl.innerHTML = '';
    for (const id of ['lola', 'tinto']) { const c = S.cats[id]; catsEl.append(h('div', 'g-cat', '🐈‍⬛ ' + (id === 'lola' ? 'Lola' : 'Tinto') + '  ' + (c.hunger < 30 ? '🍽️' : '❤️'.repeat(Math.max(1, Math.round(c.love / 34)))))); }
    bGoal.textContent = 'Objetivos ' + missionsDone() + '/' + MISSIONS.length; bBag.textContent = 'Mochila'; bShop.textContent = 'Tienda';
  }
  function setActive(id) { active = id; follow = true; updateHUD(); }
  let follow = true;

  /* sheets */
  const sheetWrap = h('div', 'g-sheetwrap'); ui.append(sheetWrap);
  function openSheet(title, fill) {
    sheetWrap.innerHTML = ''; sheetWrap.classList.add('on');
    const s = h('div', 'g-sheet'); const hd = h('div', 'g-sheet-h', [h('b', '', title), btn('Cerrar', closeSheet, 'g-ico')]); const body = h('div', 'g-sheet-b'); s.append(hd, body); sheetWrap.append(s);
    sheetWrap.onclick = e => { if (e.target === sheetWrap) closeSheet(); }; fill(body); return body;
  }
  function closeSheet() { sheetWrap.classList.remove('on'); sheetWrap.innerHTML = ''; }
  function exportCode() { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
  function openSaveGame() {
    openSheet('💾 Guardar partida', (body) => {
      body.append(h('div', 'g-row-n', inIframe
        ? 'En este visor la partida no se guarda al cerrar: copia tu código para conservar el progreso y pégalo aquí para continuar.'
        : 'La partida se guarda sola en este dispositivo; usa el código para llevarla a otro.'));
      const ta = h('textarea', 'g-savecode'); ta.readOnly = true; ta.value = exportCode();
      const bCopy = btn('Copiar código', () => {
        ta.focus(); ta.select();
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ta.value).then(() => say('Código copiado al portapapeles.'), () => say('Código seleccionado: mantén y copia.'));
        else say('Código seleccionado: mantén y copia.');
      });
      const taIn = h('textarea', 'g-savecode'); taIn.placeholder = 'Pega aquí tu código de partida…';
      const bLoad = btn('Cargar partida', () => {
        try {
          const obj = JSON.parse(decodeURIComponent(escape(atob(taIn.value.trim()))));
          if (!obj || !obj.furn) { say('Ese código no vale.'); return; }
          importState(obj); closeSheet(); say('Partida cargada. ¡A jugar!'); sfx('win');
        } catch (e) { say('Ese código no vale.'); }
      });
      body.append(ta, h('div', 'g-savebtns', [bCopy]), h('div', 'g-row-n', '— o continúa una partida guardada —'), taIn, h('div', 'g-savebtns', [bLoad]));
    });
  }
  function importState(obj) {
    for (const f of S.furn.slice()) removeMesh(f.uid);
    const fresh = defaultState();
    for (const k of Object.keys(S)) delete S[k];
    Object.assign(S, fresh, obj);
    S.furn.forEach(placeMesh); rebuildBlocked();
    S.plots.forEach((_, i) => drawPlot(i));
    for (const id of ['el', 'ella']) {
      const p = S.pos && S.pos[id];
      const w = p && p.w && WORLDS[p.w] ? p.w : 'casa';
      const dest = p && typeof p.x === 'number' ? [p.x, p.z] : WORLDS[w].spawn;
      const c = chars[id]; c.where = w; c.path = []; c.busy = null; c.after = null;
      c.g.position.set(dest[0] + 0.5, 0.1, dest[1] + 0.5);
    }
    const a = chars[active]; camT.x = a.g.position.x; camT.z = a.g.position.z; follow = true;
    if (S.started) intro.style.display = 'none';
    refreshBowl(); updateHUD(); save();
  }
  const inv = k => S.inv[k] || 0;
  const addInv = (k, n) => { S.inv[k] = Math.max(0, inv(k) + n); if (!S.inv[k]) delete S.inv[k]; };
  function earn(n) { S.coins += n; updateHUD(); save(); }
  function mission(id) {
    if (S.done[id]) return; S.done[id] = 1; const m = MISSIONS.find(x => x.id === id); S.coins += m.r; sfx('win'); say('✅ Objetivo: ' + m.t + '  +' + m.r + '🪙', 3400); updateHUD(); save();
    if (missionsDone() === MISSIONS.length && !S.ended) setTimeout(openEnding, 1800);
  }
  const stat = (k, n = 1) => { S.stats[k] = (S.stats[k] || 0) + n; };

  function openShop(tab) {
    tab = tab || 'muebles';
    openSheet('Tienda', body => {
      const tabs = h('div', 'g-tabs', [btn('Muebles', () => openShop('muebles'), tab === 'muebles' ? 'on' : ''), btn('Mercado', () => openShop('mercado'), tab === 'mercado' ? 'on' : ''), btn('Vender', () => openShop('vender'), tab === 'vender' ? 'on' : '')]); body.append(tabs);
      body.append(h('div', 'g-note', 'Tienes Monedas ' + S.coins));
      if (tab === 'muebles') {
        const grid = h('div', 'g-grid');
        for (const [id, c] of Object.entries(CATALOG)) if (!c.hidden) {
          const b = h('button', 'g-card', [cardIcon(id, c), h('div', 'g-card-n', c.name), h('div', 'g-card-p', 'Monedas ' + c.price + (c.wall ? ' · pared' : ''))]); b.type = 'button';
          if (S.coins < c.price) b.classList.add('off');
          b.addEventListener('click', () => { if (S.coins < c.price) { say('Te faltan monedas para ' + c.name + '.'); return; } closeSheet(); startPlace(id, null); });
          grid.append(b);
        }
        body.append(grid);
      } else if (tab === 'mercado') {
        const grid = h('div', 'g-list');
        for (const [id, it] of Object.entries(ITEMS)) if (it.buy) {
          grid.append(h('div', 'g-row', [h('span', 'g-row-n', it.e + ' ' + it.n + (inv(id) ? '  (tienes ' + inv(id) + ')' : '')), btn('Monedas ' + it.buy, () => { if (S.coins < it.buy) { say('No llega para eso.'); return; } S.coins -= it.buy; addInv(id, 1); sfx('coin'); save(); updateHUD(); openShop('mercado'); })]));
        }
        body.append(grid);
      } else {
        const grid = h('div', 'g-list'); let any = false;
        for (const [id, n] of Object.entries(S.inv)) { const it = ITEMS[id]; if (!it || !it.sell) continue; any = true; grid.append(h('div', 'g-row', [h('span', 'g-row-n', it.e + ' ' + it.n + ' ×' + n), btn('Vender Monedas ' + it.sell, () => { addInv(id, -1); S.coins += it.sell; sfx('coin'); save(); updateHUD(); openShop('vender'); })])); }
        if (!any) grid.append(h('div', 'g-note', 'No tienes nada que vender todavía. Cocina o cosecha.'));
        body.append(grid);
      }
    });
  }
  function openBag() {
    openSheet('Mochila', body => {
      body.append(h('div', 'g-note', '💧 Regadera: ' + S.can + '/6 · Monedas ' + S.coins));
      const grid = h('div', 'g-list'); const keys = Object.keys(S.inv);
      if (!keys.length) grid.append(h('div', 'g-note', 'Vacía. Compra en la Tienda > Mercado.'));
      for (const k of keys) grid.append(h('div', 'g-row', [h('span', 'g-row-n', ITEMS[k].e + ' ' + ITEMS[k].n), h('b', '', '×' + S.inv[k])]));
      body.append(grid);
    });
  }
  function openMissions() {
    openSheet('Objetivos de la casa', body => {
      for (const m of MISSIONS) body.append(h('div', 'g-row' + (S.done[m.id] ? ' done' : ''), [h('span', 'g-row-n', (S.done[m.id] ? '✅ ' : '⬜ ') + m.t), h('b', '', 'Monedas ' + m.r)]));
      body.append(h('div', 'g-note', 'Consejo: elige a ' + S.names.el + ' o a ' + S.names.ella + ' arriba y toca el suelo o un objeto. ' + S.names.el + ' rinde más en el PC y ' + S.names.ella + ' con los papeles de Hacienda.'));
      let armT = 0;
      const rb = btn('Reiniciar partida', () => {
        if (Date.now() < armT) { try { localStorage.removeItem(SAVE); } catch (e) {} location.reload(); return; }
        armT = Date.now() + 4000; rb.textContent = '¿Seguro? Toca otra vez para borrar'; setTimeout(() => { armT = 0; rb.textContent = 'Reiniciar partida'; }, 4000);
      }, 'g-sub');
      body.append(rb);
    });
  }
  function openEnding() {
    S.ended = true; save();
    openSheet('Hogar, dulce hogar', body => {
      body.append(h('div', 'g-end', '🐈‍⬛🐈‍⬛'));
      body.append(h('p', 'g-p', S.names.el + ' y ' + S.names.ella + ' han terminado los objetivos de la casa de Isla Legazpi: huerto, cocina, trabajo, CrossFit y música (techno y flamenco, a turnos).'));
      body.append(h('p', 'g-p', 'Lola y Tinto ronronean en el rascador. Tinto reclama su mimito extra para el ojito, y se lo ha ganado. Todos se quieren mucho.'));
      body.append(btn('Seguir jugando', closeSheet, 'g-primary'));
    });
  }

  /* ---------------- placement ---------------- */
  let place = null; // {type,x,z,r,ghost,orig}
  const panel = h('div', 'g-place'); ui.append(panel); panel.style.display = 'none';
  const ghostMat = (ok, tex) => new THREE.MeshBasicMaterial({ map: tex, color: ok ? 0xaaffcc : 0xff9a9a, transparent: true, opacity: 0.7, alphaTest: 0.2, side: THREE.DoubleSide });
  function canPlace(type, x, z, r, uid) {
    const c = CATALOG[type]; const f = { type, x, z, r };
    if (c.wall) { if (z !== 0) return false; return !S.furn.some(o => o.uid !== uid && CATALOG[o.type].wall && o.x === x && o.z === z); }
    for (const [cx, cz] of cellsOf(f)) { if (cx < 0 || cz < 0 || cx >= W || cz >= D) return false; if (!terr[cx][cz] || !c.walk && blocked[cx][cz] && !(place && place.orig && S.furn.find(o => o.uid === uid) && false)) return false; }
    return true;
  }
  function refreshGhost() {
    if (!place) return;
    if (place.ghost) scene.remove(place.ghost);
    const c = CATALOG[place.type]; 
    const [fw, fd] = fp(place.type, place.r); const a = artOf(place.type); const grp = mkSprite(a, place.r % 2 === 1);
    const ok = canPlace(place.type, place.x, place.z, place.r, place.orig && place.orig.uid); place.ok = ok;
    grp.userData.spr.material = ghostMat(ok, a.tex); const zb = c.wall ? 3.3 : place.z + fd;
    grp.position.set(place.x + fw / 2, 0.5, zb); scene.add(grp); place.ghost = grp;
        place.btnOk.disabled = !ok; place.btnOk.classList.toggle('off', !ok);
  }
  function startPlace(type, orig) {
    if (chars[active].where !== 'casa') { say('Solo puedes colocar muebles en casa.'); return; }
    const c = CATALOG[type];
    if (orig) { removeMesh(orig.uid); S.furn = S.furn.filter(f => f.uid !== orig.uid); rebuildBlocked(); }
    const [cx, cz] = cellOf(chars[active].g.position);
    place = { type, x: orig ? orig.x : Math.min(W - 2, cx + 1), z: orig ? orig.z : Math.min(D - 2, cz + 1), r: orig ? orig.r : 0, orig };
    if (c.wall && !orig) { place.x = 12; place.z = 0; place.r = 0; }
    if (!c.wall && !orig) { let best = null, bd = 1e9; for (let x = 0; x < W; x++) for (let z = 0; z < D; z++) { if (!terr[x][z]) continue; if (!canPlace(type, x, z, 0, null)) continue; const d = Math.hypot(x - cx, z - cz); if (d < bd) { bd = d; best = [x, z]; } } if (best) { place.x = best[0]; place.z = best[1]; } }
    panel.innerHTML = ''; panel.style.display = 'flex';
    const label = h('div', 'g-place-t', (c.e + ' ' + c.name + (orig ? '' : ' · Monedas ' + c.price)));
    const okb = btn('✔ Colocar', () => confirmPlace(), 'g-primary'); place.btnOk = okb;
    panel.append(label, h('div', 'g-place-b', [btn('↻ Girar', () => { { place.r = (place.r + 1) % 2; refreshGhost(); } }), okb, orig && !orig.fixed ? btn('💰 Vender', () => sellPlaced()) : null, btn('Cancelar', () => cancelPlace())]));
    refreshGhost(); say('Toca el suelo (o arrastra) para mover. Verde = cabe.', 3000);
  }
  function endPlace() { if (place && place.ghost) scene.remove(place.ghost); place = null; panel.style.display = 'none'; }
  function confirmPlace() {
    if (!place || !place.ok) return; const c = CATALOG[place.type];
    if (place.orig) { S.furn.push({ uid: place.orig.uid, type: place.type, x: place.x, z: place.z, r: place.r }); placeMesh(S.furn[S.furn.length - 1]); }
    else { if (S.coins < c.price) return; S.coins -= c.price; const f = { uid: S.nextUid++, type: place.type, x: place.x, z: place.z, r: place.r }; S.furn.push(f); placeMesh(f); stat('placed'); mission('mueble'); }
    rebuildBlocked(); sfx('place'); endPlace(); updateHUD(); save();
  }
  function cancelPlace() { if (!place) return; if (place.orig) { const o = place.orig; S.furn.push(o); placeMesh(o); rebuildBlocked(); } endPlace(); }
  function sellPlaced() { if (!place || !place.orig) return; const c = CATALOG[place.type]; const back = Math.floor((c.price || 0) * 0.7); S.coins += back; say('Vendido por ' + back + ' 🪙'); endPlace(); rebuildBlocked(); updateHUD(); save(); }

  /* ---------------- mundo: casa <-> Madrid Río ---------------- */
  const fadeEl = h('div', 'g-fade'); ui.append(fadeEl);
  function fade() { fadeEl.classList.add('on'); setTimeout(() => fadeEl.classList.remove('on'), 260); }
  const WORLDS = {
    casa: { x0: 0, x1: W, z0: 0, z1: D, spawn: [15, 21] },
    rio: { x0: RIO.x0, x1: RIO.x0 + RIO.W, z0: 0, z1: RIO.D, spawn: [RIO.x0 + 4, 13] },
    mat: { x0: MAT.x0, x1: MAT.x0 + MAT.W, z0: 0, z1: MAT.D, spawn: [MAT.x0 + 12, 14] },
    box: { x0: BOX.x0, x1: BOX.x0 + BOX.W, z0: 0, z1: BOX.D, spawn: [BOX.x0 + 10, 12] },
  };
  function goWorld(id, to) {
    const ch = chars[id]; const w = WORLDS[to];
    const dest = w.spawn;
    ch.where = to; ch.path = []; ch.busy = null; ch.after = null;
    ch.g.position.set(dest[0] + 0.5, 0.1, dest[1] + 0.5);
    if (id === active) { camT.x = dest[0] + 0.5; camT.z = dest[1] + 0.5; follow = true; }
    fade(); sfx('win');
    if (to === 'rio') { say('Madrid Río: el Matadero está al norte, al final de la plaza, y el BOX al este, al final del paseo. Sigue sus carteles.', 4600); mission('paseo'); }
    else if (to === 'mat') { say('Dentro del Matadero: explora las expos y la Cineteca.', 3600); mission('matadero'); }
    else if (to === 'box') { say('El box: toca un rig, la cuerda o las cajas para hacer el WOD.', 3400); }
    else say('De vuelta en casa.', 2200);
    save(); updateHUD();
  }
  function openKiosk(id) {
    openSheet('Kiosco de Madrid Río', body => {
      body.append(h('div', 'g-note', 'Tienes Monedas ' + S.coins));
      for (const it of [{ n: 'Helado', e: '🍦', p: 5, en: 15 }, { n: 'Pipas', e: '🌰', p: 3, en: 6 }, { n: 'Bocadillo de tortilla', e: '🥖', p: 8, en: 25 }]) {
        body.append(h('div', 'g-row', [h('span', 'g-row-n', it.e + ' ' + it.n + '  (+' + it.en + ' energía)'), btn('Monedas ' + it.p, () => {
          if (S.coins < it.p) { say('No llega para eso.'); return; } closeSheet(); S.coins -= it.p;
          busy(id, 1.8, it.n, () => { S.energy[id] = Math.min(100, S.energy[id] + it.en); say(it.n + ': +' + it.en + ' energía'); sfx('coin'); updateHUD(); save(); });
        }, 'g-primary')]));
      }
    });
  }
  function openExpo(n) {
    const txt = {
      1: 'Expo de arte contemporáneo: piezas grandes, color y luz de nave industrial. Sales con ideas.',
      2: 'Expo de diseño y fotografía de Madrid Río y Arganzuela: el barrio en imágenes.',
      3: 'Instalación central del Matadero: sonido, luz y ladrillo. A Lola le daría un jamuyas, pero está en casa.',
    }[n] || 'Una expo muy interesante.';
    openSheet('Exposición', body => {
      body.append(h('p', 'g-p', txt));
      body.append(btn('Salir inspirado/a', () => { closeSheet(); S.energy[active] = Math.min(100, S.energy[active] + 5); say('Sales inspirado/a. +5 energía'); sfx('win'); updateHUD(); save(); }, 'g-primary'));
    });
  }
  function openMatadero() {
    openSheet('Matadero Madrid', body => {
      body.append(h('p', 'g-p', 'El antiguo matadero municipal de Arganzuela, hoy centro de creación contemporánea: exposiciones, la Cineteca, las Naves del Español, música y el mercado de diseño algunos findes.'));
      body.append(h('p', 'g-p', 'Ladrillo visto, arcos neomudéjares y la plaza llena de vida. Un clásico de vuestros paseos por Madrid Río.'));
      body.append(btn('Ver la expo', () => { closeSheet(); say('La expo está muy bien. Sales inspirado/a.'); sfx('win'); }, 'g-primary'));
    });
  }

  /* ---------------- actions ---------------- */
  function adjacentCells(ref) {
    if (ref.kind === 'furn') return cellsOf(ref.f); if (ref.kind === 'plot') return plotCells(ref.i); if (ref.cells) return ref.cells; return [];
  }
  function refPos(ref) {
    if (ref.kind === 'furn') { const g = fmesh.get(ref.f.uid); return g ? g.position : null; } if (ref.kind === 'plot') return plotG[ref.i].position;
    if (ref.g) return ref.g.position; if (ref.cells) return new THREE.Vector3(ref.cells[0][0] + 0.5, 0, ref.cells[0][1] + 0.5); return null;
  }
  function goDo(id, ref, fn) {
    const ch = chars[id]; if (ch.busy) { say('Un momento, está ocupado/a.'); return; }
    const [sx, sz] = cellOf(ch.g.position); let path;
    if (ref.kind === 'cat') { const cc = cellOf(cats[ref.id].g.position); path = bfs(sx, sz, (x, z) => Math.abs(x - cc[0]) + Math.abs(z - cc[1]) <= 1 && free(x, z)); }
    else path = bfs(sx, sz, adjGoal(adjacentCells(ref)));
    if (!path) { say('No hay camino hasta ahí.'); return; }
    ch.path = path; ch.after = () => { const p = ref.kind === 'cat' ? cats[ref.id].g.position : refPos(ref); if (p) ch.face = Math.atan2(p.x - ch.g.position.x, p.z - ch.g.position.z); fn(); }; follow = true;
    if (!path.length) { const a = ch.after; ch.after = null; a(); }
  }
  function busy(id, secs, label, done) { const ch = chars[id]; ch.busy = { t: 0, dur: secs, label, done }; sfx('tick'); }
  function needEnergy(id, n) { if (S.energy[id] < n) { say(S.names[id] + ' está agotado/a. Que coma algo (mesa) o duerma (cama).'); return false; } return true; }

  function useRef(id, ref) {
    const nm = S.names[id];
    if (ref.kind === 'plot') return doPlot(id, ref.i);
    if (ref.kind === 'cat') { return goDo(id, ref, () => petCat(id, ref.id)); }
    if (ref.kind === 'gate') return goDo(id, ref, () => goWorld(id, ref.to));
    if (ref.kind === 'bench') return goDo(id, ref, () => { busy(id, 2, 'descanso', () => { S.energy[id] = Math.min(100, S.energy[id] + 8); say(nm + ' descansa un rato mirando el río. +8 energía'); updateHUD(); save(); }); });
    if (ref.kind === 'fuente') return goDo(id, ref, () => { busy(id, 1.4, 'fuente', () => { S.can = 6; say('Regadera llena en la fuente de la plaza.'); updateHUD(); save(); }); });
    if (ref.kind === 'kiosk') return goDo(id, ref, () => openKiosk(id));
    if (ref.kind === 'matadero') return goDo(id, ref, () => goWorld(id, 'mat'));
    if (ref.kind === 'boxdoor') return goDo(id, ref, () => goWorld(id, 'box'));
    if (ref.kind === 'matainfo') return goDo(id, ref, () => openMatadero());
    if (ref.kind === 'expo') return goDo(id, ref, () => openExpo(ref.n));
    if (ref.kind === 'cineteca') return goDo(id, ref, () => { busy(id, 3, '🎬', () => { S.energy[id] = Math.min(100, S.energy[id] + 10); say('🎬 Cortometraje en la Cineteca. +10 energía'); sfx('win'); updateHUD(); save(); }); });
    if (ref.kind === 'wod') return goDo(id, ref, () => {
      if (!needEnergy(id, 20)) return;
      busy(id, 3.6, 'WOD', () => { S.energy[id] -= 20; stat('boxwod_' + id); earn(8); say('🏋️ WOD en ' + ref.st + ': +8 🪙'); if (S.stats.boxwod_el && S.stats.boxwod_ella) mission('box'); else say('WOD hecho en el box. Falta ' + (id === 'el' ? S.names.ella : S.names.el) + ' para el objetivo.', 3200); updateHUD(); save(); });
    });
    if (ref.kind === 'duck') { say('¡Cuac!'); if (ref.g) spawnFloat('✨', ref.g.position, 0.8); sfx('quack'); return; }
    if (ref.kind === 'gymout') return goDo(id, ref, () => {
      if (!needEnergy(id, 20)) return;
      busy(id, 3.6, 'WOD', () => { S.energy[id] -= 20; stat('wod_' + id); earn(8); say('Calistenia en Madrid Río: +8 Monedas'); if (S.stats.wod_el && S.stats.wod_ella) mission('crossfit'); else say('WOD hecho. Falta que lo haga ' + (id === 'el' ? S.names.ella : S.names.el) + ' para el objetivo.', 3200); updateHUD(); save(); });
    });
    if (ref.kind !== 'furn') return;
    const f = ref.f, c = CATALOG[f.type];
    if (!c.use) { say(c.flavor || c.name); return; }
    const k = c.use;
    goDo(id, ref, () => {
      if (k === 'cook') return openCook(id);
      if (k === 'fridge') { say('🧊 En la nevera no hay mucho: compra en la Tienda > Mercado.'); return openBag(); }
      if (k === 'sink') { busy(id, 1.4, '🚰', () => { S.can = 6; say('💧 Regadera llena.'); updateHUD(); save(); }); return; }
      if (k === 'bed') { busy(id, 3, '😴', () => { S.energy[id] = 100; S.day++; for (const p of S.plots) if (p.type) p.water = Math.max(0, p.water); say(nm + ' ha dormido como un tronco. Día ' + S.day + '.'); updateHUD(); save(); }); return; }
      if (k === 'table') return openEat(id);
      if (k === 'tv') { busy(id, 3, '📺', () => { S.energy[id] = Math.min(100, S.energy[id] + 10); say(nm + ' ve un capítulo con un gato encima.'); updateHUD(); }); return; }
      if (k === 'pc') { if (!needEnergy(id, 15)) return; busy(id, 3.2, '💻', () => { const g = id === 'el' ? 30 : 18; S.energy[id] -= 15; stat('work'); earn(g); say('💻 Trabajo hecho: +' + g + ' 🪙' + (id === 'el' ? ' (de informático, se nota)' : '')); mission('trabajo'); updateHUD(); }); return; }
      if (k === 'tax') { if (!needEnergy(id, 15)) return; busy(id, 3.2, '🧾', () => { const g = id === 'ella' ? 30 : 18; S.energy[id] -= 15; stat('work'); earn(g); say('🧾 Expedientes de Hacienda: +' + g + ' 🪙' + (id === 'ella' ? ' (con oficio)' : '')); mission('trabajo'); updateHUD(); }); return; }
      if (k === 'crossfit') { if (!needEnergy(id, 20)) return; busy(id, 3.6, '🏋️', () => { S.energy[id] -= 20; stat('wod_' + id); earn(8); say('🏋️ WOD completado: +8 🪙'); if (S.stats.wod_el && S.stats.wod_ella) mission('crossfit'); else say('🏋️ WOD hecho. Falta que lo haga ' + (id === 'el' ? S.names.ella : S.names.el) + ' para el objetivo.', 3200); updateHUD(); }); return; }
      if (k === 'techno' || k === 'flamenco') { const on = musicMode !== k; musicMode = on ? k : null; if (on) { startMusic(k); stat('music'); mission('musica'); say(k === 'techno' ? '🎧 Techno a todo trapo.' : '💃 Flamenco: ¡olé!'); } else { stopMusic(); say('Música apagada.'); } return; }
      if (k === 'bowl') {
        if (inv('pescadito') > 0) { busy(id, 1.4, '🍣', () => { addInv('pescadito', -1); S.bowl = Math.min(4, S.bowl + 3); refreshBowl(); mission('comedero'); say('🍣 Comedero lleno para Lola y Tinto.'); save(); }); }
        else say('Cocina un pescadito en los fogones (necesitas 1 pescado).' + (S.bowl ? ' Quedan ' + S.bowl + ' raciones.' : ''));
        return;
      }
    });
  }
  let musicMode = null;
  function refreshBowl() { for (const f of S.furn) if (f.type === 'comedero') { const g = fmesh.get(f.uid); if (g) setAsset(g, S.bowl > 0 ? ART.comedero1() : ART.comedero0()); } }
  function doPlot(id, i) {
    const p = S.plots[i];
    goDo(id, { kind: 'plot', i }, () => {
      if (!p.type) {
        openSheet('Plantar', body => {
          const seeds = Object.entries(ITEMS).filter(([k, v]) => v.seed && inv(k) > 0);
          if (!seeds.length) body.append(h('div', 'g-note', 'No tienes semillas. Compra en Tienda > Mercado.'));
          for (const [k, v] of seeds) body.append(h('div', 'g-row', [h('span', 'g-row-n', v.e + ' ' + v.n + ' ×' + inv(k)), btn('Plantar', () => { closeSheet(); busy(id, 1.2, '🌱', () => { addInv(k, -1); p.type = v.seed; p.stage = 0; p.t = 0; p.water = 0; drawPlot(i); sfx('place'); say('🌱 Plantado. Ahora riégalo.'); save(); }); })]));
        });
      } else if (p.stage >= 3) {
        busy(id, 1.2, '🧺', () => { const n = p.type === 'girasol' ? 1 : 2; addInv(p.type, n); const nm = ITEMS[p.type].n; p.type = null; p.stage = 0; p.water = 0; p.t = 0; drawPlot(i); sfx('coin'); say('🧺 Cosechado: ' + nm + ' ×' + n); stat('harv'); mission('cosecha'); save(); });
      } else if (p.water > 0) say('Ya está regado. Crece solo un ratito.');
      else {
        if (S.can <= 0) { say('💧 La regadera está vacía: rellénala en el fregadero o en el grifo.'); return; }
        busy(id, 1.2, '💧', () => { S.can--; p.water = 1; drawPlot(i); sfx('water'); say('💧 Regado (' + S.can + '/6)'); save(); });
      }
    });
  }
  function openCook(id) {
    openSheet('Cocinar', body => {
      for (const r of RECIPES) {
        const ok = Object.entries(r.need).every(([k, n]) => inv(k) >= n);
        const need = Object.entries(r.need).map(([k, n]) => ITEMS[k].e + n + (inv(k) >= n ? '' : ' (tienes ' + inv(k) + ')')).join('  ');
        const b = btn('Cocinar', () => { closeSheet(); busy(id, 4.2, '🍳', () => { for (const [k, n] of Object.entries(r.need)) addInv(k, -n); addInv(r.id, 1); sfx('coin'); say('🍽️ ' + r.n + ' listo.'); if (r.id === 'tortilla') mission('tortilla'); save(); }); sfx('sizzle'); }, ok ? 'g-primary' : 'off');
        if (!ok) b.disabled = true;
        body.append(h('div', 'g-row', [h('span', 'g-row-n', r.e + ' ' + r.n + '\n' + need), b]));
      }
      body.append(h('div', 'g-note', 'Los ingredientes se compran en la Tienda (Mercado) o salen de tu huerto.'));
    });
  }
  function openEat(id) {
    openSheet('Comer en la mesa', body => {
      const dishes = Object.entries(S.inv).filter(([k]) => ITEMS[k].eat);
      if (!dishes.length) body.append(h('div', 'g-note', 'No hay platos. Cocina algo en los fogones.'));
      for (const [k, n] of dishes) body.append(h('div', 'g-row', [h('span', 'g-row-n', ITEMS[k].e + ' ' + ITEMS[k].n + ' ×' + n + '  (+' + ITEMS[k].eat + ' energía)'), btn('Comer', () => { closeSheet(); busy(id, 2.4, '😋', () => { addInv(k, -1); S.energy[id] = Math.min(100, S.energy[id] + ITEMS[k].eat); say('😋 ¡Qué rico!'); updateHUD(); save(); }); }, 'g-primary')]));
    });
  }
  function petCat(id, cid) {
    const c = cats[cid]; c.pet = 2.2; c.path = []; const p = chars[id]; busy(id, 1.6, '🤚', () => { S.cats[cid].love = Math.min(100, S.cats[cid].love + 25); stat('pets'); spawnFloat('❤️', c.g.position, 1.0); sfx('purr'); if (S.stats.pets >= 4) mission('mimos'); updateHUD(); save(); });
  }
  const fl_ = [];
  function spawnFloat(txt, pos, y) { const FL = { '❤️': '+ mimo', '✨': '¡Listo!', '😋': 'ñam' }; txt = FL[txt] || (stripE(txt) || '+'); const e = h('div', 'g-fl', txt); floats.append(e); fl_.push({ e, pos: pos.clone(), y: y || 1, t: 0 }); }

  /* ---------------- input ---------------- */
  const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2(); const gplane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let camT = new THREE.Vector3(chars.el.g.position.x, 0, chars.el.g.position.z), pan = new THREE.Vector3();
  function pick(ev) {
    const r = canvas.getBoundingClientRect(); mouse.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(mouse, cam);
    const hits = ray.intersectObjects(scene.children, true); let ref = null;
    for (const hh of hits) { const ast = hh.object.userData && hh.object.userData.asset; if (ast && hh.uv && !hit(ast, hh.uv.x, hh.uv.y)) continue; let o = hh.object; while (o) { if (o.userData && o.userData.ref) { ref = o.userData.ref; break; } o = o.parent; } if (ref) break; }
    const pt = new THREE.Vector3(); ray.ray.intersectPlane(gplane, pt);
    return { ref, pt };
  }
  const ptrs = new Map(); let dragged = false, lastPan = null;
  canvas.addEventListener('pointerdown', e => { try { canvas.setPointerCapture(e.pointerId); } catch (err) {} ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY }); dragged = false; lastPan = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 8) dragged = true;
    if (!dragged) return;
    if (place) { const { pt } = pick(e); movePlace(pt); return; }
    const dx = e.clientX - lastPan.x, dy = e.clientY - lastPan.y; lastPan = { x: e.clientX, y: e.clientY };
    const ppu = cssPPU() * zoomLevels[zi]; follow = false;
    const wb = worldBounds(); camT.x = Math.max(wb.x0 + 2, Math.min(wb.x1 - 2, camT.x - dx / ppu)); camT.z = Math.max(2, Math.min(wb.z1 - 2, camT.z - dy / ppu));
  });
  canvas.addEventListener('pointerup', e => { ptrs.delete(e.pointerId); if (dragged) return; onTap(e); });
  canvas.addEventListener('pointercancel', e => ptrs.delete(e.pointerId));
  function movePlace(pt) { if (!place || !pt) return; const [fw, fd] = fp(place.type, place.r); place.x = Math.max(0, Math.min(W - fw, Math.floor(pt.x - (fw - 1) / 2 - 0.0))); place.z = Math.max(0, Math.min(D - fd, Math.floor(pt.z - (fd - 1) / 2))); if (CATALOG[place.type].wall) { place.z = 0; place.x = Math.max(8, Math.min(26, Math.floor(pt.x))); } refreshGhost(); }
  function onTap(e) {
    ensureAudio();
    if (!S.started) return;
    const { ref, pt } = pick(e);
    if (place) { movePlace(pt); return; }
    if (sheetWrap.classList.contains('on')) return;
    if (reform && ref && ref.kind === 'furn' && !CATALOG[ref.f.type].fixed) { startPlace(ref.f.type, ref.f); return; }
    if (ref && ref.kind === 'person') { setActive(ref.id); return; }
    if (ref) { useRef(active, ref); return; }
    if (pt) { const cx = Math.floor(pt.x), cz = Math.floor(pt.z); if (cx < 0 || cz < 0 || cx >= GW || cz >= GD) return; const ch = chars[active]; if (ch.busy) return; const [sx, sz] = cellOf(ch.g.position); const path = bfs(sx, sz, (x, z) => x === cx && z === cz); if (path && free(cx, cz)) { ch.path = path; ch.after = null; follow = true; spawnFloat('📍', new THREE.Vector3(cx + 0.5, 0, cz + 0.5), 0.1); } else say('Ahí no se puede pasar.'); }
  }
  function ensureAudio() { try { sfx('init'); } catch (err) {} }

  /* ---------------- intro ---------------- */
  const intro = h('div', 'g-intro'); ui.append(intro);
  function showIntro() {
    const nEl = h('input', '', null, { placeholder: 'Él (informático, techno)', maxLength: 14, value: S.names.el === 'Él' ? '' : S.names.el });
    const nElla = h('input', '', null, { placeholder: 'Ella (Hacienda, flamenco)', maxLength: 14, value: S.names.ella === 'Ella' ? '' : S.names.ella });
    intro.append(h('div', 'g-intro-c', [
      h('div', 'g-intro-t', 'Lola y Tinto'), h('div', 'g-intro-s', 'Casa en Isla Legazpi'),
      h('p', 'g-p', 'Amuebla la casa, cocina, cultiva el huerto de la terraza y cuida de Lola y Tinto. Y ahora: baja por el sendero del jardín para salir a Madrid Río, entra en el Matadero y entrena en el box de CrossFit.'),
      h('label', 'g-lab', ['Nombre de él (opcional)', nEl]), h('label', 'g-lab', ['Nombre de ella (opcional)', nElla]),
      btn('Jugar', () => { S.names.el = nEl.value.trim() || 'Él'; S.names.ella = nElla.value.trim() || 'Ella'; S.started = true; intro.style.display = 'none'; ensureAudio(); updateHUD(); save(); say('Toca el suelo para moverte. Empieza por Objetivos.', 4000); }, 'g-primary'),
    ]));
  }
  if (!S.started) showIntro(); else intro.style.display = 'none';
  if (S.started && !S.seenRioNote) { S.seenRioNote = 1; save(); setTimeout(() => say('Baja caminando hasta el final del jardín para salir a Madrid Río: Matadero al norte y BOX al este.', 5200), 900); }

  /* ---------------- sizing + loop ---------------- */
  let cw = 300, ch_ = 500;
  let pxs = 2;
  const zoomF = [0.75, 1, 1.5];
  function cssPPU() {
    const base = Math.min(cw / 15, ch_ / 11);
    const wb = worldBounds(); const ww = wb.x1 - wb.x0 + 1, wd = wb.z1 - wb.z0 + 1;
    const fill = Math.max(cw / ww, ch_ / wd);
    return Math.max(base, Math.min(fill, base * 1.6));
  }
  function resize() {
    const r = stage.getBoundingClientRect(); cw = Math.max(200, r.width); ch_ = Math.max(260, r.height);
    pxs = 1; renderer.setSize(cw, ch_, false);
  }
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();
  function worldBounds() { const w = WORLDS[chars[active].where] || WORLDS.casa; return w; }
  function updateCam(dt) {
    const g = chars[active].g.position; if (follow) { camT.x += (g.x - camT.x) * Math.min(1, dt * 5); camT.z += (g.z - camT.z) * Math.min(1, dt * 5); }
    const wb = worldBounds();
    const ppu = cssPPU() * zoomLevels[zi]; const hw = cw / (2 * ppu), hh = ch_ / (2 * ppu);
    if (hw * 2 < wb.x1 - wb.x0) camT.x = Math.max(wb.x0 + hw, Math.min(wb.x1 - hw, camT.x)); else camT.x = (wb.x0 + wb.x1) / 2; if (hh * 2 < wb.z1 - wb.z0) camT.z = Math.max(wb.z0 + hh, Math.min(wb.z1 - hh, camT.z)); else camT.z = (wb.z0 + wb.z1) / 2;
    cam.left = -hw; cam.right = hw; cam.top = hh; cam.bottom = -hh; cam.updateProjectionMatrix();
    cam.up.set(0, 0, -1); cam.position.set(camT.x, 40, camT.z); cam.lookAt(camT.x, 0, camT.z);
  }
  const v3 = new THREE.Vector3();
  function toScreen(pos, y) { v3.set(pos.x, 0, pos.z - y * 0.75).project(cam); return [(v3.x * 0.5 + 0.5) * cw, (-v3.y * 0.5 + 0.5) * ch_]; }
  function moveAlong(obj, path, speed, dt) {
    if (!path.length) return false; const t = path[0]; const tx = t[0] + 0.5, tz = t[1] + 0.5; const p = obj.g.position;
    const dx = tx - p.x, dz = tz - p.z; const d = Math.hypot(dx, dz); const st = speed * dt;
    if (d <= st) { p.x = tx; p.z = tz; path.shift(); } else { p.x += dx / d * st; p.z += dz / d * st; }
    obj.face = Math.atan2(dx, dz); return true;
  }
  function turn(g, target, dt) { let d = target - g.rotation.y; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; g.rotation.y += d * Math.min(1, dt * 12); }
  let last = performance.now(), acc = 0, raf = 0, clock = 0;
  const favs = [[7, 8], [9, 8], [12, 9], [15, 7], [21, 8], [8, 10]];
  function loop(now) {
    raf = requestAnimationFrame(loop);
    try { loopTick(now); } catch (err) { if (!window.__gerr) { window.__gerr = 1; } }
  }
  function loopTick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    // characters
    for (const id of ['el', 'ella']) {
      const c = chars[id]; const moving = moveAlong(c, c.path, 3.7, dt);
      if (!moving && c.after) { const a = c.after; c.after = null; a(); }
      if (c.busy) { c.busy.t += dt; if (c.busy.t >= c.busy.dur) { const b = c.busy; c.busy = null; b.done(); updateHUD(); save(); } }
      c.anim += dt * (moving ? 10 : 0);
      if (moving) { const ang = c.face; c.dir = Math.abs(Math.sin(ang)) > 0.7 ? (Math.sin(ang) > 0 ? 2 : 1) : (Math.cos(ang) > 0 ? 0 : 3); } else if (c.after === null && c.busy === null) {}
      if (!moving && c.busy) { const a = c.face; c.dir = Math.abs(Math.sin(a)) > 0.7 ? (Math.sin(a) > 0 ? 2 : 1) : (Math.cos(a) > 0 ? 0 : 3); }
      const fr = moving ? 1 + (Math.floor(c.anim) % 2) : (c.busy && Math.floor(clock * 6) % 2 ? 1 : 0);
      const key = id + c.dir + fr; if (c.key !== key) { c.key = key; setAsset(c.g, personAsset(id, c.dir, fr)); }
      c.g.position.y = 0.1 + c.g.position.z * 0.01 + 0.002 + (moving ? Math.abs(Math.sin(c.anim * Math.PI)) * 0.05 : 0);
      // idle wander for the non-active one
      if (id !== active && !moving && !c.busy && Math.random() < dt * 0.15) {
        const [sx, sz] = cellOf(c.g.position);
        const wb2 = c.where === 'rio' ? { x0: RIO.x0 + 1, x1: RIO.x0 + RIO.W - 2, z0: 7, z1: RIO.D - 1 }
          : c.where === 'mat' ? { x0: MAT.x0 + 2, x1: MAT.x0 + MAT.W - 3, z0: 3, z1: MAT.D - 4 }
          : c.where === 'box' ? { x0: BOX.x0 + 2, x1: BOX.x0 + BOX.W - 3, z0: 2, z1: BOX.D - 3 }
          : { x0: 6, x1: 25, z0: 4, z1: 10 };
        const gx = wb2.x0 + Math.floor(Math.random() * (wb2.x1 - wb2.x0)), gz = wb2.z0 + Math.floor(Math.random() * (wb2.z1 - wb2.z0));
        if (free(gx, gz)) { const p = bfs(sx, sz, (x, z) => x === gx && z === gz); if (p && p.length < 16) c.path = p; }
      }
    }
    // cats
    for (const id of ['lola', 'tinto']) {
      const c = cats[id], sc = S.cats[id]; sc.hunger = Math.max(0, sc.hunger - dt * 0.35); sc.love = Math.max(0, sc.love - dt * 0.06);
      let fr = 0, sleepy = false;
      if (c.pet > 0) { c.pet -= dt; }
      else {
        const mv = moveAlong(c, c.path, 2.2, dt);
        if (mv) { c.anim += dt * 9; fr = 1 + (Math.floor(c.anim) % 2); const a = c.face; c.dir = Math.abs(Math.sin(a)) > 0.7 ? (Math.sin(a) > 0 ? 2 : 1) : (Math.cos(a) > 0 ? 0 : 3); c.sleeping = false; }
        else {
          c.wait -= dt;
          if (c.arriveFn) { const f = c.arriveFn; c.arriveFn = null; f(); }
          if (c.wait <= 0) {
            c.sleeping = false; c.wait = 3 + Math.random() * 6; const [sx, sz] = cellOf(c.g.position);
            if (sc.hunger < 55 && S.bowl > 0) { const bf = S.furn.find(f => f.type === 'comedero'); if (bf) { const p = bfs(sx, sz, adjGoal(cellsOf(bf))); if (p) { c.path = p; c.arriveFn = () => { if (S.bowl > 0) { S.bowl--; sc.hunger = 100; refreshBowl(); spawnFloat('😋', c.g.position, 0.9); sfx('purr'); save(); } }; continue; } } }
            if (sc.hunger < 20 && !c.hungryTold) { c.hungryTold = 1; say((id === 'lola' ? 'Lola' : 'Tinto') + ' tiene hambre. Cocina un pescadito y llena el comedero.', 3500); }
            if (sc.hunger > 40) c.hungryTold = 0;
            const f = Math.random() < 0.45 ? favs[Math.floor(Math.random() * favs.length)] : null;
            const gx = f ? f[0] : 6 + Math.floor(Math.random() * 13), gz = f ? f[1] : 5 + Math.floor(Math.random() * 6);
            const p = bfs(sx, sz, (x, z) => x === gx && z === gz && free(x, z)) || (f ? bfs(sx, sz, adjGoal([[gx, gz]])) : null);
            if (p) { c.path = p; if (f) c.arriveFn = () => { c.sleeping = Math.random() < 0.7; c.wait = 6 + Math.random() * 8; }; }
          }
        }
      }
      sleepy = c.sleeping;
      const key = id + c.dir + fr + (sleepy ? 's' : ''); if (c.key !== key) { c.key = key; setAsset(c.g, catAsset(id, c.dir, fr, sleepy)); }
      c.g.position.y = 0.1 + c.g.position.z * 0.01 + 0.001;
    }
    // crops
    for (let i = 0; i < S.plots.length; i++) { const p = S.plots[i]; if (p.type && p.stage < 3 && p.water > 0) { p.t += dt; if (p.t >= GROW) { p.stage++; p.t = 0; p.water = 0; drawPlot(i); if (p.stage >= 3) { spawnFloat('✨', plotG[i].position, 1.1); say('✨ ¡Algo está listo para cosechar!', 2600); } else say('🌱 Ha crecido. Vuelve a regarlo.', 2200); } } }
    // energy regen slowly while resting
    acc += dt; if (acc > 1) { acc = 0; for (const id of ['el', 'ella']) if (!chars[id].busy && S.energy[id] < 100) S.energy[id] = Math.min(100, S.energy[id] + 0.3); updateHUD(); }
    if (toastT > 0) { toastT -= dt * 1000; if (toastT <= 0) toast.classList.remove('on'); }
    // mundo: salida de casa, puente y patos
    for (const id of ['el', 'ella']) {
      const ch2 = chars[id]; const [cx2, cz2] = cellOf(ch2.g.position);
      if (ch2.where === 'casa' && cz2 >= 20 && cx2 >= 13 && cx2 <= 17 && !ch2.busy && !ch2.path.length) goWorld(id, 'rio');
      else if (ch2.where === 'rio' && cz2 >= 22) mission('puente');
      else if (ch2.where === 'rio' && cz2 <= 7 && cx2 >= RIO.x0 + 15 && cx2 <= RIO.x0 + 21 && !ch2.busy && !ch2.path.length) goWorld(id, 'mat');
      else if (ch2.where === 'rio' && cx2 >= RIO.x0 + 32 && cz2 >= 11 && cz2 <= 13 && !ch2.busy && !ch2.path.length) goWorld(id, 'box');
    }
    for (const dk of ducks) { const nx = dk.g.position.x + dk.v * dt; dk.g.position.x = nx > RIO.x0 + 35 ? RIO.x0 + 1 : nx; dk.g.position.y = 0.1 + dk.z * 0.01 + Math.sin(clock * 2 + dk.z) * 0.03; }
    updateCam(dt);
    renderer.setClearColor((chars[active].where === 'mat' || chars[active].where === 'box') ? 0x14141a : 0x3f7a35);
    renderer.render(scene, cam);
    // overlay tags
    for (const id of ['el', 'ella']) { const vis = chars[id].where === chars[active].where; tag[id].style.display = vis ? '' : 'none'; const [x, y] = toScreen(chars[id].g.position, 2.5); tag[id].style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; tag[id].classList.toggle('on', active === id); }
    for (const id of ['lola', 'tinto']) { tag[id].style.display = chars[active].where === 'casa' ? '' : 'none'; const [x, y] = toScreen(cats[id].g.position, 1.4); tag[id].style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; }
    const bc = chars[active].busy; if (bc) { const [x, y] = toScreen(chars[active].g.position, 2.4); prog.style.display = 'flex'; prog.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; prog.firstChild.style.width = Math.round(bc.t / bc.dur * 100) + '%'; prog.lastChild.textContent = bc.label; } else prog.style.display = 'none';
    for (let i = fl_.length - 1; i >= 0; i--) { const f = fl_[i]; f.t += dt; const [x, y] = toScreen(f.pos, f.y + f.t * 0.8); f.e.style.transform = `translate(${x}px,${y}px) translate(-50%,-100%)`; f.e.style.opacity = String(Math.max(0, 1 - f.t / 1.4)); if (f.t > 1.4) { f.e.remove(); fl_.splice(i, 1); } }
  }
  updateHUD(); raf = requestAnimationFrame(loop);
  const api = { S, chars, cats, setActive, openShop, openMissions, startPlace, cancelPlace, say, mission, drawPlot, scene, cam, openEnding, zoom: n => { zi = n; }, camT, skipIntro() { S.started = true; intro.style.display = 'none'; updateHUD(); }, openCook, mount: root, dbgPick: (x,y)=>{const r=pick({clientX:x,clientY:y});return {ref:r.ref&&(r.ref.kind+':'+(r.ref.f?r.ref.f.type:r.ref.id||r.ref.i)),pt:r.pt&&[r.pt.x,r.pt.z]};}, addFurn(type,x,z,r){const f={uid:S.nextUid++,type,x,z,r};S.furn.push(f);placeMesh(f);rebuildBlocked();} };
  api.goWorld = goWorld; api.RIO = RIO; api.ducks = ducks;
  window.__game = api;
  return () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); stopMusic(); };
}
