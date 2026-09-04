// T26 — a licence is not adoption: the standing predicate, pure. The shapes are
// the rows of the 2026-09-05 adoption sitting (research/batch22/T26-SITTING.md).
import { describe, expect, it } from 'vitest';
import { WEIGHT_BEARING_KINDS, sideSourceStanding, sideSourceStandingProblem, weightBearingTie } from './side-source';

const ties = (kinds: string[], anchored = false) => ({ kinds, anchored });

describe('sideSourceStandingProblem (T26, the adoption sitting)', () => {
  it('the weight-bearing kinds are chain_source, side_story, unverified — slivers are not on the list', () => {
    expect([...WEIGHT_BEARING_KINDS]).toEqual(['chain_source', 'side_story', 'unverified']);
    for (const k of ['graft', 'partial', 'loose_parallel', 'divergence', 'abridged', 'rearranged', 'recap']) expect(weightBearingTie(ties([k]))).toBe(false);
  });
  it('G1 — a canon row whose only tie is a licensed novel fires (shippuden 484: side_source alone)', () => {
    expect(sideSourceStandingProblem('canon', ties(['side_source']))).toMatch(/licence is not adoption/);
    expect(sideSourceStanding('canon', ties(['side_source']))).toBe('filler');
  });
  it('WEIGHT, NOT KIND — the Itachi rows carry graft + side_source and still fire (a sliver weighs nothing)', () => {
    expect(sideSourceStandingProblem('canon', ties(['graft', 'side_source']))).not.toBeNull();
    expect(sideSourceStandingProblem('canon', ties(['abridged', 'side_source']))).not.toBeNull(); // boruto 93-95
    expect(sideSourceStandingProblem('mixed', ties(['divergence', 'side_source']))).not.toBeNull(); // boruto 18 before adopted{author} lands
  });
  it('G2 / G4 — adopted{basis} is the other conjunct: the row keeps its standing', () => {
    expect(sideSourceStandingProblem('canon', ties(['side_source', 'adopted', 'divergence']))).toBeNull(); // DBS Resurrection F
    expect(sideSourceStandingProblem('mixed', ties(['side_source', 'adopted']))).toBeNull(); // boruto 18
  });
  it('G3 — chain_source is canon by definition; a chain work is not a side source', () => {
    expect(sideSourceStandingProblem('mixed', ties(['chain_source', 'divergence']))).toBeNull(); // trigun 18 after the retirement
    expect(sideSourceStandingProblem('canon', ties(['chain_source', 'side_source']))).toBeNull(); // a row naming both a chain work and a novel
  });
  it('FMA 37 — a side_story (the Arakawa bonus chapters) is a weight-bearing tie; the standing holds for T28', () => {
    expect(sideSourceStandingProblem('canon', ties(['side_source', 'side_story']))).toBeNull();
  });
  it('an anchor is the position claim itself — an anchored row with a side_source is never a violation', () => {
    expect(sideSourceStandingProblem('mixed', ties(['side_source'], true))).toBeNull();
    expect(sideSourceStandingProblem('mixed', ties(['side_source', 'unverified']))).toBeNull();
  });
  it('filler + side_source is the one-piece 50 shape — allowed; a row with no side_source is out of scope', () => {
    expect(sideSourceStandingProblem('filler', ties(['side_source']))).toBeNull();
    expect(sideSourceStanding('filler', ties(['side_source']))).toBe('filler');
    expect(sideSourceStandingProblem('canon', ties(['graft']))).toBeNull();
    expect(sideSourceStandingProblem('canon', ties([]))).toBeNull();
    expect(sideSourceStandingProblem(null, ties(['side_source']))).toBeNull();
  });
});
