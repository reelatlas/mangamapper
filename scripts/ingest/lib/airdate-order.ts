// Air-date order gate (rule G54, 2026-08-26 — A-11, the second /add-rule
// exercise). AFL inherits date typos: a row a year or more OUT OF ORDER
// against its neighbours is a wrong date, not a broadcast quirk, and an
// honest gap beats a wrong date (P6). This is the ONE mechanism behind the
// write gate (filterEpisodeRows), the standing-row healer
// (assert-overrides.ts) and the audit classes (airdate_regression /
// airdate_withheld) — never re-derive it at a call site (P2).
//
// The walk, over rows in number order (number ≤ 0 is a special numbered
// into the run, N7 — skipped as both subject and neighbour):
//   a REGRESSION is a dated row earlier than the last kept dated row;
//   ruled deviations (AIRDATE_ORDER_ACK, G54) are never regressions;
//   a regression deeper than THRESHOLD days names an OUTLIER —
//     the predecessor, when it jumped > THRESHOLD off its own predecessor
//     and the run resumes from the regressing row (gto 31: 2014 between
//     2000-04-30 and 2000-05-14), or
//     the regressing row, when what follows does not continue from it (a
//     lone early date, or the last row);
//   the outlier's date is WITHHELD (stored NULL). When neither row is an
//   outlier — a whole block changes era (kenshin-2023 25-27 carry 1996
//   titles and dates; beyblade-x 41-44 are 2001) — nothing is withheld:
//   the audit reports it and research decides (R1). Shallow regressions
//   (≤ THRESHOLD) are never withheld; they are the review queue.
import { isAirdateOrderAcked } from './rulings/air-date-order';

export const AIRDATE_REGRESSION_THRESHOLD_DAYS = 365;

const DAY = 86_400_000;
const days = (a: string, b: string) => Math.round((Date.parse(a) - Date.parse(b)) / DAY);

export type DatedRow = { number: number; air_date?: string | null };

export type AirdateWithheld = { number: number; date: string; against: number; againstDate: string; days: number };
export type AirdateRegression = { number: number; date: string; against: number; againstDate: string; days: number };

export type AirdateOrderResult = {
  /** rows whose date the gate withholds (deep regressions with a nameable outlier) */
  withheld: AirdateWithheld[];
  /** every unruled regression left standing (the review queue) */
  regressions: AirdateRegression[];
};

// One pass names outliers against the rows that stand; removing an outlier
// can expose the next one (dbz-kai 106 hides behind 108 until 108 goes), so
// the walk runs to a FIXED POINT — the write gate, the healer and the
// audit all see the same final answer, and the healer converges in one run.
export const airdateOrderWalk = (seriesId: string, rows: readonly DatedRow[]): AirdateOrderResult => {
  const withheld: AirdateWithheld[] = [];
  let standing: readonly DatedRow[] = rows;
  for (;;) {
    const pass = airdateOrderPass(seriesId, standing);
    if (!pass.withheld.length) return { withheld, regressions: pass.regressions };
    withheld.push(...pass.withheld);
    const drop = new Set(pass.withheld.map((w) => w.number));
    standing = standing.filter((r) => !drop.has(r.number));
  }
};

const airdateOrderPass = (seriesId: string, rows: readonly DatedRow[]): AirdateOrderResult => {
  const withheld: AirdateWithheld[] = [];
  const regressions: AirdateRegression[] = [];
  const dated = rows
    .filter((r) => r.number > 0 && r.air_date && !Number.isNaN(Date.parse(r.air_date)))
    .map((r) => ({ number: r.number, date: r.air_date as string }))
    .sort((a, b) => a.number - b.number);
  const kept: { number: number; date: string }[] = [];
  const dropped = new Set<number>();
  for (let i = 0; i < dated.length; i++) {
    const r = dated[i];
    const next = dated[i + 1];
    // re-evaluate r against the kept chain until it is consistent or judged
    for (;;) {
      const prev = kept[kept.length - 1];
      if (!prev) break;
      const back = days(prev.date, r.date);
      if (back <= 0 || isAirdateOrderAcked(seriesId, r.number)) break;
      if (back <= AIRDATE_REGRESSION_THRESHOLD_DAYS) {
        regressions.push({ number: r.number, date: r.date, against: prev.number, againstDate: prev.date, days: back });
        break;
      }
      const prevPrev = kept[kept.length - 2];
      // an OUTLIER disagrees with BOTH its neighbours; the other row fits its own
      const prevFitsPast = !prevPrev || Math.abs(days(prev.date, prevPrev.date)) <= AIRDATE_REGRESSION_THRESHOLD_DAYS;
      const runResumesFromR = !!next && Math.abs(days(next.date, r.date)) <= AIRDATE_REGRESSION_THRESHOLD_DAYS;
      if (!prevFitsPast && runResumesFromR) {
        withheld.push({ number: prev.number, date: prev.date, against: r.number, againstDate: r.date, days: back });
        dropped.add(prev.number);
        kept.pop();
        continue; // r now faces prevPrev
      }
      if (prevFitsPast && !runResumesFromR) {
        withheld.push({ number: r.number, date: r.date, against: prev.number, againstDate: prev.date, days: back });
        dropped.add(r.number);
        break;
      }
      // block change (both sides consistent: kenshin-2023 25-27) or an
      // alternating block (neither side consistent: dbz-kai 101-114 mixes
      // JP and US dates row by row) — the gate cannot name the outlier;
      // report, keep, research decides (R1)
      regressions.push({ number: r.number, date: r.date, against: prev.number, againstDate: prev.date, days: back });
      break;
    }
    if (!dropped.has(r.number)) kept.push(r);
  }
  return { withheld, regressions };
};

/** Apply the gate: returns the rows with withheld dates set to null, plus what was withheld. */
export const withholdAirdateRegressions = <T extends DatedRow>(seriesId: string, rows: T[]): { rows: T[]; withheld: AirdateWithheld[] } => {
  const { withheld } = airdateOrderWalk(seriesId, rows);
  if (!withheld.length) return { rows, withheld };
  const drop = new Set(withheld.map((w) => w.number));
  return { rows: rows.map((r) => (drop.has(r.number) && r.air_date ? { ...r, air_date: null } : r)), withheld };
};
