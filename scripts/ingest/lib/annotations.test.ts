// T26 / R10 — the annotation vocabulary and shape rules, pure.
import { describe, expect, it } from 'vitest';
import { ADOPTED_BASES, ANNOTATION_KINDS, annotationProblem } from './annotations';

describe('annotationProblem (T26)', () => {
  it('the vocabulary is the seven research kinds plus the three T4.2 override kinds', () => {
    expect([...ANNOTATION_KINDS]).toEqual(['divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged', 'adopted', 'retconned', 'side_source']);
    expect([...ADOPTED_BASES]).toEqual(['author', 'studio', 'community']);
  });
  it('accepts a well-formed research annotation', () => {
    expect(annotationProblem({ series_id: 'claymore', episode: 21, kind: 'loose_parallel', chapters: 'ch 57-59', note: 'anime outran the manga' })).toBeNull();
  });
  it('adopted requires a basis; basis is only for adopted', () => {
    expect(annotationProblem({ series_id: 'black-clover', episode: 130, kind: 'adopted' })).toMatch(/requires basis/);
    expect(annotationProblem({ series_id: 'black-clover', episode: 130, kind: 'adopted', basis: 'author' })).toBeNull();
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'graft', basis: 'studio' })).toMatch(/only for kind 'adopted'/);
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'adopted', basis: 'fans' as never })).toMatch(/not author/);
  });
  it('side_source must name the work', () => {
    expect(annotationProblem({ series_id: 'naruto-shippuden', episode: 452, kind: 'side_source' })).toMatch(/name the work/);
    expect(annotationProblem({ series_id: 'naruto-shippuden', episode: 452, kind: 'side_source', note: 'adapts the Itachi Shinden novel' })).toBeNull();
  });
  it('refuses an unregistered kind (no fourth type sneaks in as an annotation either)', () => {
    expect(annotationProblem({ series_id: 'x', episode: 1, kind: 'community_canon' as never })).toMatch(/not in the vocabulary/);
  });
});
