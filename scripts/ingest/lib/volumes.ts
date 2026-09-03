// The ONE volume derivation (P2): an anchor's volume is the boundary table's
// volume for its END chapter (the catalog convention; V1/V2 make the table the
// volume instrument). Every apply script inlined a `volOf` before 2026-09-03;
// the healer re-derives standing rows so anchor_volume_mismatch reads 0.
export type VolumeBound = { volume: number; chapter_start: number; chapter_end: number | null };

export function volumeForChapter(bounds: VolumeBound[], chapter: number): number | null {
  const hit = bounds.find((b) => Number(b.chapter_start) <= chapter && (b.chapter_end == null || chapter <= Number(b.chapter_end)));
  return hit ? Number(hit.volume) : null;
}
