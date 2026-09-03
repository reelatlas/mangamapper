// Compose RGB→LMS → dichromat → LMS→RGB into one 3x3 so the browser can do
// it in a single feColorMatrix (which already works in linearRGB — the space
// the LMS math assumes).
const RGB2LMS = [[.31399,.63951,.04649],[.15537,.75789,.08670],[.01775,.10945,.87259]];
const LMS2RGB = [[5.47221,-4.6419,.16963],[-1.1252,2.29317,-.1678],[.02980,-.19318,1.16364]];
const SIM = {
  protan: [[0,1.05118294,-.05116099],[0,1,0],[0,0,1]],
  deutan: [[1,0,0],[.9513092,0,.04866992],[0,0,1]],
  tritan: [[1,0,0],[0,1,0],[-.86744736,1.86727089,0]],
};
const mm = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));

for (const [name, S] of Object.entries(SIM)) {
  const M = mm(LMS2RGB, mm(S, RGB2LMS));
  const row = i => M[i].map(v => v.toFixed(5)).join(' ');
  console.log(`${name}:\n  "${row(0)} 0 0  ${row(1)} 0 0  ${row(2)} 0 0  0 0 0 1 0"`);
  // sanity: pure grey must survive unchanged (rows should each sum to ~1)
  console.log(`  row sums: ${M.map(r => r.reduce((a, b) => a + b, 0).toFixed(4)).join(', ')}`);
}
