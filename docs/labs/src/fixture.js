// ══ SYNTHETIC CATALOG — 343 fictional series, seeded and reproducible ══
// Deliberately NOT real titles. A fixture showing a real work beside invented
// chapter mappings would be a false claim about a real thing, which is the one
// claim this product promises never to make. Fictional titles test layout
// identically and carry none of that risk.
// Shape and distribution ARE realistic: title lengths, the long tail of
// episode counts, filler tendency, unadapted tails, and anime-originals with
// no source at all.
function makeCatalog(n) {
  var seed = 0x5eed1e;
  function rnd() {                                  // mulberry32
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
  var pick = function (a) { return a[Math.floor(rnd() * a.length)]; };
  var between = function (a, b) { return a + Math.floor(rnd() * (b - a + 1)); };

  var A = ['Crimson','Hollow','Ashen','Verdant','Gilded','Severed','Quiet','Iron','Pale','Drowned',
    'Lantern','Ember','Thorn','Cradle','Fang','Prism','Wake','Hymn','Salt','Amber',
    'Nine','Vermillion','Glass','Winter','Hallow','Rust','Silent','Bright','Cobalt','Grave',
    'Falling','Second','Last','Northern','Blue','Endless','Broken','Sable','Wandering','Sunless'];
  var B = ['Oath','Choir','Machine','Saint','Compass','Harvest','Gate','Bell','Orchard','Anchor',
    'Signal','Marrow','Pilgrim','Atlas','Requiem','Vessel','Sovereign','Tide','Lament','Reliquary',
    'Verdict','Garden','Lighthouse','Cartographer','Almanac','Ledger','Threshold','Beacon','Foundry','Meridian',
    'Chorus','Archive','Aviary','Bastion','Cipher','Dominion','Errand','Fable','Gallows','Hourglass'];
  var SUF = ['Arc','Chronicle','Saga','Record','Cycle','Tale'];
  var KA = ['ク','リ','ム','ゾ','ン','ホ','ロ','ウ','ア','シ','ェ','ヴ','ァ','デ','ト','ラ','ジ','カ','セ','ノ','ヨ','ミ','ハ','ネ','ル','マ','キ','タ','スイ','ガ'];
  var KJ = ['鋼','影','花','剣','空','海','月','龍','紅','闇','光','風','刃','詩','塔','匣','archive','夜','灰','鐘'];

  function title() {
    var r = rnd();
    if (r < 0.30) return pick(A) + ' ' + pick(B);
    if (r < 0.50) return 'The ' + pick(B) + ' of ' + pick(A);
    if (r < 0.66) return pick(A) + ' no ' + pick(B);
    if (r < 0.78) return pick(A) + ' ' + pick(B) + ': ' + pick(A) + ' ' + pick(SUF);
    if (r < 0.88) return pick(B) + '!';
    return pick(A) + ' ' + pick(B) + ' ' + between(2, 4);
  }
  function jp() {
    var s = '', k = between(3, 6);
    for (var i = 0; i < k; i++) s += rnd() < 0.55 ? pick(KA) : pick(KJ);
    return s.replace(/archive/g, '巻');
  }

  var out = [];
  for (var i = 0; i < n; i++) {
    // episode counts follow a real long tail: mostly cours, a few monsters
    var r = rnd(), ep;
    if (r < 0.46) ep = pick([12, 12, 13, 24, 25, 26]);
    else if (r < 0.74) ep = between(24, 64);
    else if (r < 0.90) ep = between(64, 180);
    else if (r < 0.97) ep = between(180, 500);
    else ep = between(500, 1180);

    var hasManga = rnd() > 0.11;              // ~11% are anime-original
    var filler = rnd() < 0.30 ? rnd() * 0.34 : rnd() * 0.06;   // filler tendency
    var tch = 0, tvol = 0, ch = 0, vol = 0, tail = 0;
    if (hasManga) {
      ch = Math.max(4, Math.round(ep * (1.4 + rnd() * 1.5)));
      tail = rnd() < 0.62 ? between(1, Math.max(2, Math.round(ch * 0.22))) : 0;
      tch = ch + tail;
      tvol = Math.max(1, Math.round(tch / (8 + rnd() * 3)));
      vol = Math.max(1, Math.round(ch / (tch / tvol)));
    }

    // episode-type runs. index 4 = source_only, a ZONE not a type.
    var seq = [], left = ep;
    while (left > 0) {
      var run = Math.min(left, between(3, Math.max(4, Math.round(ep / 6))));
      seq.push([0, run]); left -= run;
      if (left <= 0) break;
      if (rnd() < filler * 2.2) {
        var f = Math.min(left, between(1, Math.max(2, Math.round(ep * filler * 0.5))));
        seq.push([rnd() < 0.72 ? 2 : 3, f]); left -= f;
      } else if (rnd() < 0.16) { seq.push([1, 1]); left -= 1; }
    }
    if (tail > 0) seq.push([4, Math.max(1, Math.round(tail / (tch / ep)))]);

    var fillerCount = seq.reduce(function (a, s) { return a + (s[0] === 2 || s[0] === 3 ? s[1] : 0); }, 0);
    out.push({
      id: 'series-' + (i + 1), nm: title(), jp: jp(),
      ep: ep, hasManga: hasManga, vol: vol, tvol: tvol, ch: ch, tch: tch,
      tail: tail, filler: fillerCount, seq: seq,
      status: rnd() < 0.22 ? 'airing' : 'finished'
    });
  }
  return out;
}
