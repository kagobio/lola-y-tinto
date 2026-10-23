// @ts-nocheck
import * as THREE from './three.module.min.js';
export { THREE };

const mats = new Map();
export function mat(color) {
  let m = mats.get(color);
  if (!m) { m = new THREE.MeshLambertMaterial({ color, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 }); mats.set(color, m); }
  return m;
}
export const EDGE = new THREE.LineBasicMaterial({ color: 0x2b2233 });
const geos = new Map(), edges = new Map();
function geo(w, h, d) { const k = w + '|' + h + '|' + d; let g = geos.get(k); if (!g) { g = new THREE.BoxGeometry(w, h, d); geos.set(k, g); } return g; }
function edg(w, h, d) { const k = w + '|' + h + '|' + d; let g = edges.get(k); if (!g) { g = new THREE.EdgesGeometry(geo(w, h, d)); edges.set(k, g); } return g; }
// x,z centre; y = bottom
export function box(p, w, h, d, color, x = 0, y = 0, z = 0, outline) {
  const m = new THREE.Mesh(geo(w, h, d), mat(color));
  m.position.set(x, y + h / 2, z);
  if (outline === undefined) outline = Math.min(w, h, d) >= 0.2 || (w * h * d) > 0.05;
  if (outline) m.add(new THREE.LineSegments(edg(w, h, d), EDGE));
  p.add(m);
  return m;
}
export function cyl(p, r, h, color, x, y, z, rx = 0, rz = 0, seg = 10) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), mat(color));
  m.position.set(x, y + h / 2, z); m.rotation.x = rx; m.rotation.z = rz; p.add(m); return m;
}
export function rgb(c) { return c; }

/* ---------- people ---------- */
export function makePerson(kind) {
  const g = new THREE.Group();
  const him = kind === 'el';
  const skin = him ? 0xd9a07c : 0xe2ab88;
  const hair = 0x1c1520;
  const pants = him ? 0x1a1a22 : 0x7ea0c8;
  const shirt = 0xf4f1ea;
  const legs = [], arms = [];
  for (const s of [-1, 1]) {
    const pv = new THREE.Group(); pv.position.set(s * 0.11, 0.6, 0); g.add(pv);
    box(pv, 0.2, 0.6, 0.22, pants, 0, -0.6, 0, false); legs.push(pv);
    box(pv, 0.21, 0.08, 0.28, him ? 0x2a2a30 : 0xf0f0f0, 0, -0.6, 0.03, false);
    const av = new THREE.Group(); av.position.set(s * 0.3, 1.1, 0); g.add(av);
    box(av, 0.14, 0.48, 0.16, skin, 0, -0.48, 0, false); arms.push(av);
    box(av, 0.16, 0.14, 0.18, shirt, 0, -0.14, 0, false);
  }
  box(g, 0.46, 0.55, 0.28, shirt, 0, 0.6, 0);
  if (him) {
    box(g, 0.47, 0.06, 0.29, 0xc83a3a, 0, 0.62, 0, false);
    const strap = box(g, 0.07, 0.65, 0.04, 0x15151a, 0.03, 0.55, 0.15, false); strap.rotation.z = -0.55;
    box(g, 0.22, 0.08, 0.05, 0xc83a3a, 0, 1.12, 0.14, false);
  } else {
    box(g, 0.47, 0.04, 0.29, 0xe9e5dc, 0, 1.03, 0, false);
    box(g, 0.1, 0.12, 0.08, 0xd5662b, 0.27, 0.6, -0.02, false);
    box(g, 0.04, 0.12, 0.02, 0xd9b45a, 0, 1.0, 0.15, false);
  }
  const head = new THREE.Group(); head.position.set(0, 1.15, 0); g.add(head);
  box(head, 0.36, 0.34, 0.34, skin, 0, 0, 0);
  box(head, 0.4, 0.14, 0.38, hair, 0, 0.27, -0.01, false);
  if (him) {
    box(head, 0.1, 0.1, 0.1, hair, -0.15, 0.3, 0.1, false); box(head, 0.1, 0.1, 0.1, hair, 0.15, 0.3, 0.1, false);
    box(head, 0.1, 0.1, 0.1, hair, 0, 0.36, 0.1, false); box(head, 0.1, 0.1, 0.1, hair, 0.05, 0.34, -0.15, false);
    box(head, 0.28, 0.08, 0.04, 0x3b2a26, 0, 0.0, 0.18, false);
  } else {
    box(head, 0.4, 0.62, 0.1, hair, 0, -0.3, -0.17, false);
    box(head, 0.06, 0.4, 0.3, hair, -0.2, -0.1, -0.02, false); box(head, 0.06, 0.4, 0.3, hair, 0.2, -0.1, -0.02, false);
  }
  box(head, 0.05, 0.06, 0.03, 0x14101a, -0.09, 0.1, 0.17, false); box(head, 0.05, 0.06, 0.03, 0x14101a, 0.09, 0.1, 0.17, false);
  g.userData = { legs, arms, head };
  return g;
}

/* ---------- cats ---------- */
export function makeCat(who) {
  const g = new THREE.Group();
  const fur = 0x2d2a38;
  const body = new THREE.Group(); g.add(body);
  box(body, 0.26, 0.26, 0.5, fur, 0, 0.14, 0, true);
  const legs = [];
  for (const [x, z] of [[-0.08, 0.17], [0.08, 0.17], [-0.08, -0.17], [0.08, -0.17]]) {
    const l = new THREE.Group(); l.position.set(x, 0.15, z); body.add(l);
    box(l, 0.08, 0.15, 0.08, fur, 0, -0.15, 0, false); legs.push(l);
  }
  const tail = new THREE.Group(); tail.position.set(0, 0.28, -0.24); body.add(tail);
  box(tail, 0.07, 0.07, 0.32, fur, 0, 0, -0.14, false).rotation.x = 0.5;
  const head = new THREE.Group(); head.position.set(0, 0.36, 0.27); body.add(head);
  box(head, 0.26, 0.22, 0.22, fur, 0, -0.05, 0.02, true);
  box(head, 0.07, 0.1, 0.05, fur, -0.09, 0.1, 0, false); box(head, 0.07, 0.1, 0.05, fur, 0.09, 0.1, 0, false);
  box(head, 0.06, 0.04, 0.03, 0xe58aa0, -0.09, 0.09, 0.03, false); box(head, 0.06, 0.04, 0.03, 0xe58aa0, 0.09, 0.09, 0.03, false);
  box(head, 0.06, 0.04, 0.02, 0x555060, 0, -0.1, 0.14, false);
  // eyes: Lola both yellow; Tinto one cloudy blue-grey eye)
  const yellow = 0xe8d94a, cloudy = 0xa9c4d8;
  box(head, 0.07, 0.07, 0.03, yellow, 0.08, -0.01, 0.135, false);
  box(head, 0.07, 0.07, 0.03, who === 'tinto' ? cloudy : yellow, -0.08, -0.01, 0.135, false);
  g.userData = { legs, tail, head, body };
  return g;
}
