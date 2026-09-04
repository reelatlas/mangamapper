// T26 / R10 — the annotation vocabulary and shape rules, pure.
import { describe, expect, it } from 'vitest';
import { ADOPTED_BASES, ANNOTATION_KINDS, annotationProblem } from './annotations';

describe('annotationProblem (T26)', () => {
  it('the vocabulary is the seven research kinds, the three T4.2 override kinds, and the T28 recap + unverified kinds and the T26/I41 chain_source kind (2026-09-04)', () => {
    expect([...ANNOTATION_KINDS]).toEqual(['divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged', 'adopted', 'retconned', 'side_source', 'recap', 'unverified', 'chain_source']);
    expect([...ADOPTED_BASES]).toEqual(['author', 'studio', 'community']);
  });
  it('accepts a well-formed research annotation', () => {
    expect(annotationProblem({ series_id: 'claymore', episode: 19, kind: 'divergence', chapters: '54-55', note: 'the closing scene restaged' })).toBeNull();
  });
  it('adopted requires a basis; basis is only for adopted', () => {
    expect(annotationProblem({ series_id: 'black-clover', episode: 130, kind: 'adopted' })).toMatch(/requires basis/);
    expect(annotationProblem({ series_id: 'black-clover', episode: 130, kind: 'adopted', basis: 'author' })).toBeNull();
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'graft', basis: 'studio' })).toMatch(/only for kind 'adopted'/);
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'adopted', basis: 'fans' as never })).toMatch(/not author/);
  });
  it('A45: a key retired by ruling is refused, its neighbours are not', () => {
    expect(annotationProblem({ series_id: 'claymore', episode: 21, kind: 'loose_parallel', chapters: 'ch 57-59', note: 'x' })).toMatch(/retired by ruling/);
    expect(annotationProblem({ series_id: 'claymore', episode: 21, kind: 'divergence', chapters: '57', note: 'x' })).toBeNull();
    expect(annotationProblem({ series_id: 'claymore', episode: 20, kind: 'loose_parallel', chapters: 'x', note: 'x' })).toBeNull();
  });
  it('side_source must name the work — and, since the I41 label gate (2026-09-05), carry its label in chapters; chain_source too', () => {
    expect(annotationProblem({ series_id: 'naruto-shippuden', episode: 452, kind: 'side_source' })).toMatch(/name the work/);
    expect(annotationProblem({ series_id: 'naruto-shippuden', episode: 452, kind: 'side_source', note: 'adapts the Itachi Shinden novel' })).toMatch(/work label in chapters/);
    expect(annotationProblem({ series_id: 'naruto-shippuden', episode: 452, kind: 'side_source', chapters: 'Itachi Shinden: the licensed novel', note: 'adapts the Itachi Shinden novel' })).toBeNull();
    expect(annotationProblem({ series_id: 'trigun', episode: 18, kind: 'chain_source', chapters: 'ch 1-2', note: 'x' })).toMatch(/work label in chapters/);
    expect(annotationProblem({ series_id: 'trigun', episode: 18, kind: 'chain_source', chapters: 'Trigun Maximum: ch 1-2', note: 'x' })).toBeNull();
  });
  it('refuses an unregistered kind (no fourth type sneaks in as an annotation either)', () => {
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'community_canon' as never })).toMatch(/not in the vocabulary/);
  });
});
