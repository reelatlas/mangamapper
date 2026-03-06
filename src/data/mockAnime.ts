import { AnimeSeries, TrackingSite, StreamingService } from '@/types/anime';

export const mockAnimeData: AnimeSeries[] = [
  {
    id: 'one-piece',
    title: 'One Piece',
    japaneseTitle: 'ワンピース',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg',
    currentEpisode: 1122,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 1, anilist: 2 },
    streamingOn: ['crunchyroll', 'netflix'],
    genres: ['Action', 'Adventure', 'Fantasy'],
    synopsis: 'Monkey D. Luffy sets off on an adventure to find the One Piece treasure and become King of the Pirates.',
    episodes: [
      { number: 1122, title: 'The Island of New Beginnings', type: 'canon', mangaMapping: { volume: 108, chapters: '1092' }, airDate: '2024-12-15' },
      { number: 1121, title: 'Gear Fifth Unleashed', type: 'canon', mangaMapping: { volume: 108, chapters: '1091' }, airDate: '2024-12-08' },
      { number: 1120, title: 'The Climax of Egghead', type: 'canon', mangaMapping: { volume: 108, chapters: '1090' }, airDate: '2024-12-01' },
      { number: 1119, title: "Saturn's True Power", type: 'canon', mangaMapping: { volume: 107, chapters: '1088-1089' }, airDate: '2024-11-24' },
      { number: 1118, title: "A Navy Admiral's Resolve", type: 'canon', mangaMapping: { volume: 107, chapters: '1087' }, airDate: '2024-11-17' },
    ]
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen',
    japaneseTitle: '呪術廻戦',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1792/138022.jpg',
    currentEpisode: 47,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 2, anilist: 1 },
    streamingOn: ['crunchyroll', 'netflix', 'amazon'],
    genres: ['Action', 'Supernatural', 'School'],
    synopsis: 'Yuji Itadori joins a secret organization of Jujutsu Sorcerers to kill a powerful Curse named Ryomen Sukuna.',
    episodes: [
      { number: 47, title: 'Shinjuku Showdown - Final', type: 'canon', mangaMapping: { volume: 25, chapters: '236' }, airDate: '2024-12-14' },
      { number: 46, title: 'Domain Expansion: Unlimited Void', type: 'canon', mangaMapping: { volume: 25, chapters: '234-235' }, airDate: '2024-12-07' },
      { number: 45, title: 'Gojo vs Sukuna Continues', type: 'canon', mangaMapping: { volume: 25, chapters: '232-233' }, airDate: '2024-11-30' },
      { number: 44, title: 'The Strongest Clash', type: 'canon', mangaMapping: { volume: 24, chapters: '230-231' }, airDate: '2024-11-23' },
      { number: 43, title: 'Bath', type: 'canon', mangaMapping: { volume: 24, chapters: '228-229' }, airDate: '2024-11-16' },
    ]
  },
  {
    id: 'dandadan',
    title: 'DAN DA DAN',
    japaneseTitle: 'ダンダダン',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1150/141957.jpg',
    currentEpisode: 11,
    totalEpisodes: 12,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 3, anilist: 3 },
    streamingOn: ['crunchyroll', 'netflix', 'bilibili'],
    genres: ['Action', 'Comedy', 'Supernatural'],
    synopsis: 'A high school girl who believes in ghosts and a boy who believes in aliens team up after encountering the supernatural.',
    episodes: [
      { number: 11, title: "Turbo Granny's Return", type: 'canon', mangaMapping: { volume: 3, chapters: '23-24' }, airDate: '2024-12-12' },
      { number: 10, title: 'The Acrobatic Silky', type: 'canon', mangaMapping: { volume: 3, chapters: '21-22' }, airDate: '2024-12-05' },
      { number: 9, title: 'Dover Demon Attack', type: 'canon', mangaMapping: { volume: 2, chapters: '19-20' }, airDate: '2024-11-28' },
      { number: 8, title: 'Alien X Files', type: 'canon', mangaMapping: { volume: 2, chapters: '17-18' }, airDate: '2024-11-21' },
      { number: 7, title: 'Serpo Connection', type: 'canon', mangaMapping: { volume: 2, chapters: '15-16' }, airDate: '2024-11-14' },
    ]
  },
  {
    id: 'dragon-ball-daima',
    title: 'Dragon Ball DAIMA',
    japaneseTitle: 'ドラゴンボールダイマ',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1075/143876.jpg',
    currentEpisode: 8,
    totalEpisodes: 20,
    status: 'airing',
    hasManga: false,
    ranking: { mal: 4, anilist: 5 },
    streamingOn: ['crunchyroll', 'netflix'],
    genres: ['Action', 'Adventure', 'Fantasy'],
    synopsis: 'Goku and his friends are turned into children by a mysterious wish and must journey to the Demon Realm.',
    episodes: [
      { number: 8, title: 'The Demon Realm Unveiled', type: 'anime-only-canon', mangaMapping: null, airDate: '2024-12-13' },
      { number: 7, title: 'Mini Warriors Unite', type: 'anime-only-canon', mangaMapping: null, airDate: '2024-12-06' },
      { number: 6, title: 'A New Transformation', type: 'anime-only-canon', mangaMapping: null, airDate: '2024-11-29' },
      { number: 5, title: 'Journey Begins', type: 'anime-only-canon', mangaMapping: null, airDate: '2024-11-22' },
      { number: 4, title: 'The Shrinking Wish', type: 'anime-only-canon', mangaMapping: null, airDate: '2024-11-15' },
    ]
  },
  {
    id: 'blue-lock',
    title: 'Blue Lock',
    japaneseTitle: 'ブルーロック',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1258/126929.jpg',
    currentEpisode: 35,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 5, anilist: 4 },
    streamingOn: ['crunchyroll', 'netflix', 'bilibili'],
    genres: ['Sports', 'Drama', 'Psychological'],
    synopsis: "Japan creates a radical program to forge the world's greatest egotist striker to win the World Cup.",
    episodes: [
      { number: 35, title: 'U-20 Match - Second Half', type: 'canon', mangaMapping: { volume: 14, chapters: '118-119' }, airDate: '2024-12-14' },
      { number: 34, title: 'The Flow State', type: 'canon', mangaMapping: { volume: 14, chapters: '116-117' }, airDate: '2024-12-07' },
      { number: 33, title: "Isagi's Evolution", type: 'canon', mangaMapping: { volume: 13, chapters: '114-115' }, airDate: '2024-11-30' },
      { number: 32, title: 'U-20 Showdown Begins', type: 'canon', mangaMapping: { volume: 13, chapters: '112-113' }, airDate: '2024-11-23' },
      { number: 31, title: 'Before the Battle', type: 'canon', mangaMapping: { volume: 13, chapters: '110-111' }, airDate: '2024-11-16' },
    ]
  },
  {
    id: 'my-hero-academia',
    title: 'My Hero Academia',
    japaneseTitle: '僕のヒーローアカデミア',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1908/135431.jpg',
    currentEpisode: 153,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 6, anilist: 6 },
    streamingOn: ['crunchyroll', 'netflix', 'disney-hulu'],
    genres: ['Action', 'Superhero', 'School'],
    synopsis: 'In a world where most people have superpowers, Izuku Midoriya dreams of becoming a hero despite being born without one.',
    episodes: [
      { number: 153, title: 'Deku vs Shigaraki: Final Act', type: 'canon', mangaMapping: { volume: 40, chapters: '420-421' }, airDate: '2024-12-14' },
      { number: 152, title: 'One For All: Full Power', type: 'canon', mangaMapping: { volume: 40, chapters: '418-419' }, airDate: '2024-12-07' },
      { number: 151, title: "The Heroes' Last Stand", type: 'canon', mangaMapping: { volume: 39, chapters: '416-417' }, airDate: '2024-11-30' },
      { number: 150, title: 'All For One Falls', type: 'canon', mangaMapping: { volume: 39, chapters: '414-415' }, airDate: '2024-11-23' },
      { number: 149, title: 'The Weight of Legacy', type: 'canon', mangaMapping: { volume: 39, chapters: '412-413' }, airDate: '2024-11-16' },
    ]
  },
  {
    id: 'spy-x-family',
    title: 'SPY×FAMILY',
    japaneseTitle: 'SPY×FAMILY',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
    currentEpisode: 37,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 7, anilist: 8 },
    streamingOn: ['crunchyroll', 'netflix', 'disney-hulu'],
    genres: ['Action', 'Comedy', 'Slice of Life'],
    synopsis: 'A spy, an assassin, and a telepath form a fake family, each hiding their true identities from each other.',
    episodes: [
      { number: 37, title: 'Operation Strix: New Mission', type: 'canon', mangaMapping: { volume: 12, chapters: '73' }, airDate: '2024-12-14' },
      { number: 36, title: "Anya's School Festival", type: 'canon', mangaMapping: { volume: 12, chapters: '71-72' }, airDate: '2024-12-07' },
      { number: 35, title: "Bond's Big Day", type: 'filler', mangaMapping: null, airDate: '2024-11-30' },
      { number: 34, title: 'The Tennis Arc', type: 'canon', mangaMapping: { volume: 11, chapters: '69-70' }, airDate: '2024-11-23' },
      { number: 33, title: 'Family Outing', type: 'canon', mangaMapping: { volume: 11, chapters: '67-68' }, airDate: '2024-11-16' },
    ]
  },
  {
    id: 'demon-slayer',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    japaneseTitle: '鬼滅の刃',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    currentEpisode: 55,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 8, anilist: 7 },
    streamingOn: ['crunchyroll', 'netflix', 'hidive'],
    genres: ['Action', 'Supernatural', 'Historical'],
    synopsis: 'Tanjiro Kamado joins the Demon Slayer Corps to avenge his family and cure his demon-turned sister.',
    episodes: [
      { number: 55, title: 'Hashira Training Arc Finale', type: 'canon', mangaMapping: { volume: 16, chapters: '136' }, airDate: '2024-12-15' },
      { number: 54, title: "The Pillars' True Strength", type: 'canon', mangaMapping: { volume: 16, chapters: '134-135' }, airDate: '2024-12-08' },
      { number: 53, title: 'Training with Sanemi', type: 'canon', mangaMapping: { volume: 15, chapters: '132-133' }, airDate: '2024-12-01' },
      { number: 52, title: "Mist Hashira's Guidance", type: 'canon', mangaMapping: { volume: 15, chapters: '130-131' }, airDate: '2024-11-24' },
      { number: 51, title: 'A New Beginning', type: 'canon', mangaMapping: { volume: 15, chapters: '128-129' }, airDate: '2024-11-17' },
    ]
  },
  {
    id: 'bleach-tybw',
    title: 'Bleach: Thousand-Year Blood War',
    japaneseTitle: 'BLEACH 千年血戦篇',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1908/135431.jpg',
    currentEpisode: 39,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 9, anilist: 9 },
    streamingOn: ['disney-hulu', 'hidive'],
    genres: ['Action', 'Supernatural', 'Adventure'],
    synopsis: 'Ichigo Kurosaki faces the Wandenreich, a hidden empire of Quincies, in the final arc of Bleach.',
    episodes: [
      { number: 39, title: 'The Final Battle Begins', type: 'canon', mangaMapping: { volume: 68, chapters: '630-632' }, airDate: '2024-12-14' },
      { number: 38, title: 'Quincy Blood War', type: 'canon', mangaMapping: { volume: 68, chapters: '627-629' }, airDate: '2024-12-07' },
      { number: 37, title: "Ichigo's New Bankai", type: 'canon', mangaMapping: { volume: 67, chapters: '624-626' }, airDate: '2024-11-30' },
      { number: 36, title: 'Soul Society Falls', type: 'canon', mangaMapping: { volume: 67, chapters: '621-623' }, airDate: '2024-11-23' },
      { number: 35, title: 'The Zero Division', type: 'canon', mangaMapping: { volume: 66, chapters: '618-620' }, airDate: '2024-11-16' },
    ]
  },
  {
    id: 're-zero',
    title: 'Re:ZERO -Starting Life in Another World-',
    japaneseTitle: 'Re:ゼロから始める異世界生活',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1286/117120.jpg',
    currentEpisode: 50,
    totalEpisodes: null,
    status: 'airing',
    hasManga: true,
    ranking: { mal: 10, anilist: 10 },
    streamingOn: ['crunchyroll'],
    genres: ['Drama', 'Fantasy', 'Thriller'],
    synopsis: 'Subaru Natsuki is transported to a fantasy world where he discovers he has the power to rewind time upon death.',
    episodes: [
      { number: 50, title: 'The Witch of Envy', type: 'canon', mangaMapping: { volume: 15, chapters: '62-63' }, airDate: '2024-12-11' },
      { number: 49, title: 'Bonds of Sin', type: 'canon', mangaMapping: { volume: 15, chapters: '60-61' }, airDate: '2024-12-04' },
      { number: 48, title: 'Return by Death', type: 'canon', mangaMapping: { volume: 14, chapters: '58-59' }, airDate: '2024-11-27' },
      { number: 47, title: 'The Watchtower', type: 'canon', mangaMapping: { volume: 14, chapters: '56-57' }, airDate: '2024-11-20' },
      { number: 46, title: 'Emilia Camp', type: 'canon', mangaMapping: { volume: 14, chapters: '54-55' }, airDate: '2024-11-13' },
    ]
  },
  // Completed series for search
  {
    id: 'black-clover',
    title: 'Black Clover',
    japaneseTitle: 'ブラッククローバー',
    coverImage: 'https://cdn.myanimelist.net/images/anime/2/88336.jpg',
    currentEpisode: 170,
    totalEpisodes: 170,
    status: 'completed',
    hasManga: true,
    ranking: { mal: 15, anilist: 18 },
    streamingOn: ['crunchyroll', 'amazon'],
    genres: ['Action', 'Fantasy', 'Magic'],
    synopsis: "Asta, born without magic in a world where it's everything, dreams of becoming the Wizard King.",
    episodes: [
      { number: 170, title: 'The Spade Kingdom Assault', type: 'canon', mangaMapping: { volume: 27, chapters: '272-274' }, airDate: '2021-03-30' },
      { number: 169, title: "The Devil's Power", type: 'canon', mangaMapping: { volume: 27, chapters: '270-271' }, airDate: '2021-03-23' },
      { number: 168, title: 'Bonds of Trust', type: 'filler', mangaMapping: null, airDate: '2021-03-16' },
      { number: 167, title: 'Black Bulls United', type: 'canon', mangaMapping: { volume: 26, chapters: '268-269' }, airDate: '2021-03-09' },
      { number: 166, title: "Captain Yami's Stand", type: 'canon', mangaMapping: { volume: 26, chapters: '266-267' }, airDate: '2021-03-02' },
    ]
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    japaneseTitle: 'チェンソーマン',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
    currentEpisode: 12,
    totalEpisodes: 12,
    status: 'completed',
    hasManga: true,
    ranking: { mal: 12, anilist: 11 },
    streamingOn: ['crunchyroll', 'amazon', 'hidive'],
    genres: ['Action', 'Horror', 'Supernatural'],
    synopsis: 'Denji, a young devil hunter, merges with his pet devil Pochita to become Chainsaw Man.',
    episodes: [
      { number: 12, title: 'Katana vs. Chainsaw', type: 'canon', mangaMapping: { volume: 4, chapters: '37-38' }, airDate: '2022-12-27' },
      { number: 11, title: 'Mission Start', type: 'canon', mangaMapping: { volume: 4, chapters: '35-36' }, airDate: '2022-12-20' },
      { number: 10, title: 'Bruised & Battered', type: 'canon', mangaMapping: { volume: 4, chapters: '33-34' }, airDate: '2022-12-13' },
      { number: 9, title: 'From Kyoto', type: 'canon', mangaMapping: { volume: 3, chapters: '30-32' }, airDate: '2022-12-06' },
      { number: 8, title: 'Gunfire', type: 'canon', mangaMapping: { volume: 3, chapters: '27-29' }, airDate: '2022-11-29' },
    ]
  },
  {
    id: 'naruto',
    title: 'Naruto',
    japaneseTitle: 'ナルト',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1141/142503.jpg',
    currentEpisode: 220,
    totalEpisodes: 220,
    status: 'completed',
    hasManga: true,
    ranking: { mal: 20, anilist: 22 },
    streamingOn: ['crunchyroll', 'netflix'],
    genres: ['Action', 'Adventure', 'Martial Arts'],
    synopsis: 'Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage.',
    episodes: [
      { number: 220, title: 'Departure', type: 'filler', mangaMapping: null, airDate: '2007-02-08' },
      { number: 219, title: 'The Ultimate Weapon Reborn', type: 'filler', mangaMapping: null, airDate: '2007-02-01' },
      { number: 135, title: 'The Promise That Could Not Be Kept', type: 'canon', mangaMapping: { volume: 27, chapters: '234-238' }, airDate: '2005-07-13' },
      { number: 134, title: 'The End of Tears', type: 'canon', mangaMapping: { volume: 27, chapters: '231-233' }, airDate: '2005-07-06' },
      { number: 133, title: 'A Plea from a Friend', type: 'canon', mangaMapping: { volume: 26, chapters: '228-230' }, airDate: '2005-06-29' },
    ]
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling',
    japaneseTitle: '俺だけレベルアップな件',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1301/142478.jpg',
    currentEpisode: 12,
    totalEpisodes: 12,
    status: 'completed',
    hasManga: true,
    ranking: { mal: 14, anilist: 13 },
    streamingOn: ['crunchyroll', 'bilibili'],
    genres: ['Action', 'Fantasy', 'Adventure'],
    synopsis: 'Sung Jinwoo, the weakest hunter, gains the power to level up through a mysterious system.',
    episodes: [
      { number: 12, title: 'Arise', type: 'canon', mangaMapping: { volume: 3, chapters: '45-47' }, airDate: '2024-03-30' },
      { number: 11, title: 'A Knight Who Defends an Empty Throne', type: 'canon', mangaMapping: { volume: 3, chapters: '42-44' }, airDate: '2024-03-23' },
      { number: 10, title: 'What Is This, a Picnic?', type: 'canon', mangaMapping: { volume: 3, chapters: '39-41' }, airDate: '2024-03-16' },
      { number: 9, title: "You've Been Hiding Your Skills", type: 'canon', mangaMapping: { volume: 2, chapters: '36-38' }, airDate: '2024-03-09' },
      { number: 8, title: 'This Is Frustrating', type: 'canon', mangaMapping: { volume: 2, chapters: '33-35' }, airDate: '2024-03-02' },
    ]
  },
  {
    id: 'frieren',
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: '葬送のフリーレン',
    coverImage: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
    currentEpisode: 28,
    totalEpisodes: 28,
    status: 'completed',
    hasManga: true,
    ranking: { mal: 11, anilist: 12 },
    streamingOn: ['crunchyroll', 'netflix'],
    genres: ['Adventure', 'Drama', 'Fantasy'],
    synopsis: 'An elf mage begins a journey to understand humanity after her hero party disbands.',
    episodes: [
      { number: 28, title: 'The End of the Journey', type: 'canon', mangaMapping: { volume: 6, chapters: '55-57' }, airDate: '2024-03-22' },
      { number: 27, title: 'The Height of Magic', type: 'canon', mangaMapping: { volume: 6, chapters: '52-54' }, airDate: '2024-03-15' },
      { number: 26, title: 'Privilege of the Young', type: 'canon', mangaMapping: { volume: 5, chapters: '49-51' }, airDate: '2024-03-08' },
      { number: 25, title: 'Sense', type: 'canon', mangaMapping: { volume: 5, chapters: '46-48' }, airDate: '2024-03-01' },
      { number: 24, title: 'Perfect Replica', type: 'canon', mangaMapping: { volume: 5, chapters: '43-45' }, airDate: '2024-02-23' },
    ]
  },
];

export type StatusFilter = 'all' | 'airing' | 'completed';
export type SortBy = 'popularity' | 'release_date';

export const getFilteredAnime = (
  options: {
    status?: StatusFilter;
    limit?: number;
    sortBy?: SortBy;
  } = {}
): AnimeSeries[] => {
  const { status = 'all', limit = 10, sortBy = 'popularity' } = options;
  
  let filtered = [...mockAnimeData];
  
  // Filter by status
  if (status !== 'all') {
    filtered = filtered.filter(anime => anime.status === status);
  }
  
  // Sort
  if (sortBy === 'popularity') {
    filtered.sort((a, b) => a.ranking.anilist - b.ranking.anilist);
  } else if (sortBy === 'release_date') {
    filtered.sort((a, b) => {
      const aDate = a.episodes[0]?.airDate || '1900-01-01';
      const bDate = b.episodes[0]?.airDate || '1900-01-01';
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
  }
  
  return filtered.slice(0, limit);
};

// Legacy function for backwards compatibility
export const getTopAiringAnime = (
  count: number = 10,
  trackingSite: TrackingSite = 'mal',
  streamingService: StreamingService = 'all'
): AnimeSeries[] => {
  return mockAnimeData
    .filter(anime => anime.status === 'airing')
    .filter(anime => {
      if (streamingService === 'all') return true;
      return anime.streamingOn.includes(streamingService);
    })
    .sort((a, b) => {
      const aRank = trackingSite === 'mal' ? a.ranking.mal : a.ranking.anilist;
      const bRank = trackingSite === 'mal' ? b.ranking.mal : b.ranking.anilist;
      return aRank - bRank;
    })
    .slice(0, count);
};

export const searchAnime = (query: string): AnimeSeries[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockAnimeData.filter(anime =>
    anime.title.toLowerCase().includes(lowercaseQuery) ||
    anime.japaneseTitle.includes(query) ||
    anime.genres.some(genre => genre.toLowerCase().includes(lowercaseQuery))
  );
};

export const getAnimeById = (id: string): AnimeSeries | undefined => {
  return mockAnimeData.find(anime => anime.id === id);
};

export const getAllAnime = (): AnimeSeries[] => {
  return [...mockAnimeData];
};
