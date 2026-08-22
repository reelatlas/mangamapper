// Our own canonical slugs — app-facing identity (the card's path bar), owned
// by us so AFL renames/alias corruption never leak into URLs or user state.

export function slugify(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/['‘’]/g, '') // JoJo's → jojos, not jojo-s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}
