import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { AnimeSeries, Episode, MappingSummary } from '@/types/anime';
import { usePositionLookup } from './usePositionLookup';

// The inline position instrument's driver model (docs/components/
// position-row.md): rest shows the present position; editing a field makes
// it the driver and derives the others; reset and Esc-undo behave as ruled.

const episodes: Episode[] = [1, 2, 3, 4].map((n) => ({
  number: n,
  title: `Ep ${n}`,
  type: 'canon',
  mangaMapping: { volume: Math.ceil(n / 2), chapters: `${n * 2 - 1}-${n * 2}`, start: n * 2 - 1 },
  airDate: '2020-01-01',
}));

const anime: AnimeSeries = {
  id: 'test',
  title: 'Test',
  japaneseTitle: 'テスト',
  coverImage: '',
  currentEpisode: 4,
  totalEpisodes: 4,
  status: 'finished',
  mangaStatus: 'finished',
  hasManga: true,
  totalVolumes: 2,
  totalChapters: 8,
  mangaStartVolume: null,
  mangaStartChapter: null,
  episodes,
  ranking: { mal: 1, anilist: 1 },
  streamingOn: [],
  genres: [],
  synopsis: '',
};

const mapping: MappingSummary = {
  airedEpisodes: 4,
  sourceType: 'manga' as MappingSummary['sourceType'],
  hasSource: true,
  hasInstrument: true,
  spans: [{ start: 1, end: 4, type: 'canon' }],
  canonCount: 4,
  mixedCount: 0,
  fillerCount: 0,
  fillerPercent: 0,
  tailBadge: null,
  sourceLabel: 'manga',
  continueFrom: null,
  latestKnown: { episode: 4, volume: 2, chapters: '7-8' },
  mangaAheadChapters: 0,
  mangaAheadUnits: 0,
};

describe('usePositionLookup', () => {
  it('rests on the present position: latest aired episode and its vol/ch', () => {
    const { result } = renderHook(() => usePositionLookup(anime, mapping));
    expect(result.current.exploring).toBe(false);
    expect(result.current.fields.ep.display).toBe('4');
    expect(result.current.fields.vol.display).toBe('2');
    expect(result.current.fields.ch.display).toBe('8');
    expect(result.current.markerRest).toBe(true);
    expect(result.current.restEp).toBe(4);
  });

  it('makes the edited field the driver and derives the others', () => {
    const { result } = renderHook(() => usePositionLookup(anime, mapping));
    act(() => result.current.setField('ep', '2'));
    expect(result.current.exploring).toBe(true);
    expect(result.current.fields.ep).toMatchObject({ display: '2', isDriver: true, isDerived: false });
    expect(result.current.fields.ch.isDerived).toBe(true);
    expect(result.current.fields.ch.display).toBe('3'); // the episode's FIRST chapter (hook rule, 2026-08-19)
    expect(result.current.fields.vol.display).toBe('1');
  });

  it('strips non-digits from typed input', () => {
    const { result } = renderHook(() => usePositionLookup(anime, mapping));
    act(() => result.current.setField('ch', '1a2'));
    expect(result.current.fields.ch.display).toBe('12');
  });

  it('reset returns to rest; Esc-undo restores the state captured on focus', () => {
    const { result } = renderHook(() => usePositionLookup(anime, mapping));
    act(() => result.current.setField('ep', '3'));
    act(() => result.current.beginEdit());
    act(() => result.current.setField('ep', '1'));
    act(() => result.current.cancelEdit());
    expect(result.current.fields.ep.display).toBe('3');
    act(() => result.current.reset());
    expect(result.current.exploring).toBe(false);
    expect(result.current.fields.ep.display).toBe('4');
  });

  it('a strip click bumps the keyboard-handoff serial; a field edit does not', () => {
    const { result } = renderHook(() => usePositionLookup(anime, mapping));
    expect(result.current.jumpSerial).toBe(0);
    act(() => result.current.setField('ep', '2'));
    expect(result.current.jumpSerial).toBe(0);
    act(() => result.current.stripClick(3));
    expect(result.current.jumpSerial).toBe(1);
    expect(result.current.fields.ep.display).toBe('3');
  });

  it('without an instrument the manga fields are uneditable dashes', () => {
    const noSource: MappingSummary = { ...mapping, hasInstrument: false, latestKnown: null };
    const { result } = renderHook(() => usePositionLookup({ ...anime, hasManga: false }, noSource));
    expect(result.current.fields.vol).toMatchObject({ display: '—', editable: false, isNull: true });
    expect(result.current.fields.ep.editable).toBe(true);
  });
});
