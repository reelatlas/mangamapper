// T31 / I13 (d) — the seed writer's relation gate, pure (2026-09-06, phase B of the airing programme).
import { describe, expect, it } from 'vitest';
import { seedRelationHold } from './discovery';

describe('seedRelationHold (I13 d + T31)', () => {
  it('a series with a relation and a ruled franchise passes; a relation without the membership is held', () => {
    expect(seedRelationHold({ relation: { to: 'the-prince-of-tennis', kind: 'sequel' } }, 'the-prince-of-tennis', true, 'x')).toBeNull();
    expect(seedRelationHold({ relation: { to: 'the-prince-of-tennis', kind: 'sequel' } }, 'the-prince-of-tennis', false, 'x')).toMatch(/no membership entry/);
  });
  it('neither a relation, a restoration nor newIp — held, and the hold names newIp as the way in for a new IP', () => {
    expect(seedRelationHold({}, null, false, 'x')).toMatch(/newIp: true/);
  });
  it('an explicit NEW IP passes with no relation and franchise null; a contradiction is refused (fail closed)', () => {
    expect(seedRelationHold({ newIp: true }, null, false, 'kill-la-kill')).toBeNull();
    expect(seedRelationHold({ newIp: true, relation: { to: 'y', kind: 'sequel' } }, null, false, 'x')).toMatch(/contradiction/);
    expect(seedRelationHold({ newIp: true, franchise: 'digimon' }, 'digimon', true, 'x')).toMatch(/contradiction/);
  });
  it('a restoration needs no relation (the P40 recreate path is not a discovery proposal)', () => {
    expect(seedRelationHold({ restoration: 'INCIDENT-2026-09-05' }, null, false, 'x')).toBeNull();
  });
});
