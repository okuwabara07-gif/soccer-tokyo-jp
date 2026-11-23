import * as THREE from 'three';
export { THREE };
export const W = 1080, H = 1920;
const PR = Number(new URLSearchParams(location.search).get('pr') || 2);

export const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: new URLSearchParams(location.search).get('aa')!=='0', preserveDrawingBuffer: true });
renderer.setPixelRatio(PR); renderer.setSize(W, H, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1a2a); scene.fog = new THREE.Fog(0x0b1a2a, 35, 80);
export const cam = new THREE.PerspectiveCamera(48, W / H, 0.1, 200);
scene.add(new THREE.HemisphereLight(0xe6f2ff, 0x2a5a2a, 1.0));
const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(6, 20, 8); sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16 }); sun.shadow.bias = -0.0005;
scene.add(sun);

// ---------- pitch ----------
function pitchTex() {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 2048; const g = cv.getContext('2d');
  for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? '#3f9140' : '#368236'; g.fillRect(0, i * 102.4, 2048, 102.4); }
  // grass noise
  for (let i = 0; i < 60000; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},0.035)`; g.fillRect(Math.random() * 2048, Math.random() * 2048, 3, 3); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.MeshLambertMaterial({ map: pitchTex() }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
export function line(x1, z1, x2, z2, w = 0.12) {
  const L = Math.hypot(x2 - x1, z2 - z1);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, L), new THREE.MeshBasicMaterial({ color: 0xf4f4f4 }));
  m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(x2 - x1, z2 - z1); m.position.set((x1 + x2) / 2, 0.011, (z1 + z2) / 2); scene.add(m);
}
export function circleLine(x, z, r) { const m = new THREE.Mesh(new THREE.RingGeometry(r - 0.06, r + 0.06, 96), new THREE.MeshBasicMaterial({ color: 0xf4f4f4 })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.011, z); scene.add(m); }
// stands with crowd dots
function crowdTex() {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 256; const g = cv.getContext('2d');
  g.fillStyle = '#18263b'; g.fillRect(0, 0, 2048, 256);
  const cols = ['#c94b4b', '#3b6fc9', '#e0e0e0', '#e9b23b', '#2a3a55', '#5a6a85'];
  for (let i = 0; i < 9000; i++) { g.fillStyle = cols[(Math.random() * cols.length) | 0]; g.globalAlpha = 0.55; g.fillRect(Math.random() * 2048, 20 + Math.random() * 236, 5, 6); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const standMat = new THREE.MeshLambertMaterial({ map: crowdTex() });
export function stand(x, z, ry, len = 90) { const s = new THREE.Mesh(new THREE.BoxGeometry(len, 9, 2), standMat); s.position.set(x, 3.5, z); s.rotation.y = ry; s.rotation.x = 0; scene.add(s); }
export function goal(z, dir = 1) { // goal at z, opening toward -dir*z
  const m = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const post = (x) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.44, 12), m); p.position.set(x, 1.22, z); p.castShadow = true; scene.add(p); };
  post(-3.66); post(3.66);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7.32, 12), m); bar.rotation.z = Math.PI / 2; bar.position.set(0, 2.44, z); scene.add(bar);
}

// ---------- players ----------
const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, metalness: 0 });
export function player(shirt, shorts, socks = shirt) {
  const root = new THREE.Group(); const body = new THREE.Group(); root.add(body);
  const skin = M(0xd9a77c), hair = M(0x2a1d14);
  const add = (geo, mat, parent, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const hips = new THREE.Group(); hips.position.y = 0.92; body.add(hips);
  add(new THREE.CylinderGeometry(0.27, 0.25, 0.28, 20), M(shorts), hips, 0, 0.02, 0);
  const torso = new THREE.Group(); hips.add(torso);
  const t = add(new THREE.CapsuleGeometry(0.27, 0.42, 8, 20), M(shirt), torso, 0, 0.45, 0); t.scale.z = 0.72;
  const head = new THREE.Group(); head.position.set(0, 1.05, 0); torso.add(head);
  add(new THREE.SphereGeometry(0.19, 28, 20), skin, head, 0, 0, 0);
  const h = add(new THREE.SphereGeometry(0.2, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), hair, head, 0, 0.02, -0.02); h.rotation.x = -0.35;
  add(new THREE.SphereGeometry(0.045, 12, 10), skin, head, 0, -0.01, 0.19); // nose → shows facing
  const legs = [], arms = [];
  for (const s of [-1, 1]) {
    const lp = new THREE.Group(); lp.position.set(0.13 * s, 0, 0); hips.add(lp);
    add(new THREE.CapsuleGeometry(0.1, 0.34, 6, 14), skin, lp, 0, -0.22, 0);
    add(new THREE.CapsuleGeometry(0.085, 0.34, 6, 14), M(socks), lp, 0, -0.6, 0);
    add(new THREE.BoxGeometry(0.15, 0.1, 0.3), M(0x111111), lp, 0, -0.87, 0.05);
    legs.push(lp);
    const ap = new THREE.Group(); ap.position.set(0.36 * s, 0.72, 0); torso.add(ap);
    add(new THREE.CapsuleGeometry(0.075, 0.46, 6, 14), M(shirt), ap, 0, -0.28, 0);
    add(new THREE.SphereGeometry(0.075, 12, 10), skin, ap, 0, -0.6, 0);
    arms.push(ap);
  }
  // facing wedge on ground
  const sh = new THREE.Shape(); sh.moveTo(-0.32, 0.45); sh.lineTo(0.32, 0.45); sh.lineTo(0, 1.05); sh.closePath();
  const wedge = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false }));
  wedge.rotation.x = -Math.PI / 2; wedge.rotation.z = Math.PI; wedge.position.y = 0.022; root.add(wedge);
  root.userData = { hips, torso, head, legs, arms, wedge }; scene.add(root); return root;
}
export function pose(p, { run = 0, phase = 0, crouch = 0, lean = 0, stride = 0, head = 0, kick = 0 } = {}) {
  const u = p.userData; u.hips.position.y = 0.92 - crouch * 0.16;
  u.torso.rotation.x = crouch * 0.32 + lean;
  u.head.rotation.y = head;
  const a = Math.sin(phase) * run;
  u.legs[0].rotation.x = a - crouch * 0.25; u.legs[1].rotation.x = -a - crouch * 0.25 + stride + kick;
  u.legs[0].rotation.z = -crouch * 0.12; u.legs[1].rotation.z = crouch * 0.12;
  u.arms[0].rotation.x = -a * 0.8; u.arms[1].rotation.x = a * 0.8;
  u.arms[0].rotation.z = -0.18 - crouch * 0.35; u.arms[1].rotation.z = 0.18 + crouch * 0.35;
}
// facing: rotation.y such that model +z points to direction (dx,dz)
export const face = (dx, dz) => Math.atan2(dx, dz);

// ---------- ball ----------
function ballTex() {
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = 256; const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#111';
  for (let i = 0; i < 16; i++) { const x = (i * 137) % 512, y = 20 + (i * 83) % 216; g.beginPath(); for (let k = 0; k < 5; k++) { const an = k * 2 * Math.PI / 5; g.lineTo(x + 22 * Math.cos(an), y + 22 * Math.sin(an)); } g.fill(); }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}
export function makeBall() { const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 32, 24), new THREE.MeshStandardMaterial({ map: ballTex(), roughness: 0.5 })); b.castShadow = true; scene.add(b); return b; }
export function placeBall(b, x, z, y = 0.13) { b.position.set(x, y, z); b.rotation.set(z * 3.5, 0, -x * 3.5); }

// ---------- ground decals ----------
export const dmat = (c, o = 0) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, depthWrite: false, side: THREE.DoubleSide });
export function decal(geo, color, y = 0.025) { const m = new THREE.Mesh(geo, dmat(color)); m.rotation.x = -Math.PI / 2; m.position.y = y; const g = new THREE.Group(); g.add(m); scene.add(g); g.userData.m = m; return g; }
export function setOp(g, o) { g.traverse(c => { if (c.material) c.material.opacity = o; }); }
export function arrowGeo(len = 3, w = 0.32, head = 0.75) { const s = new THREE.Shape(); s.moveTo(-w, 0); s.lineTo(w, 0); s.lineTo(w, len); s.lineTo(head, len); s.lineTo(0, len + head * 1.5); s.lineTo(-head, len); s.lineTo(-w, len); s.closePath(); return new THREE.ShapeGeometry(s); }
// arrow pointing along (dx,dz) on ground: shape is drawn along +y which maps to -z after rotation.x=-PI/2
export function aimArrow(g, x, z, dx, dz) { g.position.set(x, 0, z); g.userData.m.rotation.z = Math.atan2(-dx, -dz); }
export function crossGeo(s = 1) { const g = new THREE.Group(); for (const r of [0.785, -0.785]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(0.4 * s, 2.4 * s), dmat(0xffffff)); b.rotation.x = -Math.PI / 2; b.rotation.z = r; b.position.y = 0.03; g.add(b); } scene.add(g); return g; }
export function coneGeo(r = 6, ang = 0.9) { return new THREE.CircleGeometry(r, 48, Math.PI / 2 - ang / 2, ang); }

// ---------- helpers ----------
export const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ss = (a, b, t) => { const x = cl((t - a) / (b - a)); return x * x * (3 - 2 * x); };
export const lerp = (a, b, k) => a + (b - a) * k;
export const fade = (t, a, b, f = 0.3) => Math.min(ss(a, a + f, t), 1 - ss(b - f, b, t));
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export function camKeys(keys) {
  return t => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1][0]) i++; const [t0, p0, l0] = keys[i], [t1, p1, l1] = keys[i + 1]; const k = ss(t0, t1, t); cam.position.copy(p0).lerp(p1, k); cam.lookAt(l0.clone().lerp(l1, k)); };
}

// ---------- overlay ----------
const $ = id => document.getElementById(id);
export function ovOp(id, o) { $(id).style.opacity = o; }
const labs = {};
export function label(key, cls, text, pos, op) {
  let d = labs[key]; if (!d) { d = document.createElement('div'); document.getElementById('labs').appendChild(d); labs[key] = d; }
  d.className = 'lab ' + cls; d.textContent = text;
  const v = pos.clone().project(cam); d.style.left = ((v.x + 1) / 2 * W) + 'px'; d.style.top = ((1 - v.y) / 2 * H) + 'px'; d.style.opacity = v.z < 1 ? op : 0;
}
function setHTML(el, s) { if (el.dataset.s !== s) { el.innerHTML = s; el.dataset.s = s; } }
export function chapters(t, steps) { // steps: [a,b,html]
  const bars = document.querySelectorAll('#bar i');
  steps.forEach(([a, b, s], i) => { bars[i].style.width = (cl((t - a) / (b - a)) * 100) + '%'; if (t >= a && t < b) setHTML($('step'), s); });
}
export function timed(id, t, list, inner) { // list: [a,b,html,(class)]
  let op = 0; const el = inner ? $(id).querySelector(inner) : $(id);
  for (const [a, b, s, cls] of list) if (t >= a && t < b) { op = fade(t, a, b, 0.25); setHTML(el, s); if (cls !== undefined) $(id).className = 'ov ' + cls; }
  ovOp(id, op);
}
