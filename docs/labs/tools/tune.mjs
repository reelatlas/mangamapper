// Hand-nudges on top of the roll. The seed keeps every hue it can; only the
// collisions the validator flagged move, and each move is reasoned in the doc.
function hex(h, s, l) {
  s /= 100; l /= 100;
  const k = m => (m + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = m => Math.round(255 * (l - a * Math.max(-1, Math.min(k(m) - 3, 9 - k(m), 1))));
  return '#' + [f(0), f(8), f(4)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
const rel = c => { const v = parseInt(c, 16) / 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
const lum = h => .2126 * rel(h.slice(1, 3)) + .7152 * rel(h.slice(3, 5)) + .0722 * rel(h.slice(5, 7));
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

const V = {
  glasshouse: {
    ground: '#171A14', card: '#21251D', line: '#383B35', ink: '#D6DAD2', dim: '#808C73',
    t: [['canon', 205, 58, 60], ['mixed', 130, 52, 58], ['filler', 32, 62, 66], ['anime', 275, 55, 68], ['manga', 78, 58, 60]],
  },
  fairground: {
    ground: '#141A16', card: '#1C2620', line: '#3E4741', ink: '#CDD5D0', dim: '#7B8E82',
    t: [['canon', 193, 68, 66], ['mixed', 288, 66, 65], ['filler', 340, 68, 64], ['anime', 240, 60, 70], ['manga', 80, 72, 59]],
  },
  anaglyph: {
    ground: '#0E0C0B', card: '#191514', line: '#544240', ink: '#D5CECD', dim: '#8E7D7B',
    t: [['canon', 352, 76, 61], ['mixed', 300, 62, 64], ['filler', 265, 58, 68], ['anime', 192, 68, 62], ['manga', 155, 55, 55]],
  },
};

for (const [name, v] of Object.entries(V)) {
  const hs = v.t.map(x => x[1]).sort((a, z) => a - z);
  let min = 360;
  for (let i = 0; i < hs.length; i++) {
    const d = Math.abs(hs[(i + 1) % hs.length] - hs[i]);
    min = Math.min(min, Math.min(d, 360 - d));
  }
  console.log(`-- ${name} --  min hue sep ${min} deg  ${min < 25 ? 'FAIL' : 'ok'}`);
  console.log(`  ground ${v.ground}  card ${v.card}  line ${v.line}  ink ${v.ink}  dim ${v.dim}`);
  for (const [role, h, s, l] of v.t) {
    const c = hex(h, s, l);
    const cr = +ratio(c, v.ground).toFixed(2);
    console.log(`   ${role.padEnd(7)} ${c}  h${String(h).padStart(3)}  contrast ${String(cr).padStart(5)}${cr < 3 ? '  LOW' : ''}`);
  }
  console.log();
}
