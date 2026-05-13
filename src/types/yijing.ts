/** Yin or Yang polarity of a single line */
export type LinePolarity = 'yang' | 'yin'

/** A single yao (line) in a hexagram */
export interface Yao {
  position: number
  polarity: LinePolarity
  isChanging: boolean
}

/** The 6 coin values from a single toss (3 coins) */
export interface CoinTossResult {
  coins: [number, number, number]
  sum: number
  polarity: LinePolarity
  isChanging: boolean
}

/** A complete hexagram (6 lines) */
export interface Hexagram {
  yaos: Yao[]
  wenNumber: number | null
  name: string
  upperTrigram: string
  lowerTrigram: string
  guaCi: string
  liuChong?: boolean
  liuHe?: boolean
}

/** The result of a divination session */
export interface DivinationResult {
  original: Hexagram
  changed: Hexagram | null
  changingPositions: number[]
  timestamp: Date
  originalNajia: NajiaData | null
  changedNajia: NajiaData | null
}

/** Input mode for hexagram generation */
export type DivinationMode = 'coin' | 'manual'

/** Six Relations (六亲) */
export type LiuQin = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼'

/** Five Elements */
export type WuXing = '金' | '木' | '水' | '火' | '土'

/** Earthly Branch */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

/** Na Jia info for a single line */
export interface NajiaLine {
  liuQin: LiuQin
  diZhi: DiZhi
  wuXing: WuXing
  tianGan: string
  isShi: boolean    // 世爻
  isYing: boolean   // 应爻
}

/** Palace info for a hexagram */
export interface PalaceInfo {
  name: string           // e.g. "乾宫"
  rootElement: WuXing    // 宫属五行
  position: number       // 1-8 within palace
  type: string           // 本宫/一世/二世/三世/四世/五世/游魂/归魂
  isYouHun: boolean
  isGuiHun: boolean
  shiPosition: number    // 世爻位置 (1-6)
  yingPosition: number   // 应爻位置 (1-6)
}

/** Complete Na Jia data for a hexagram */
export interface NajiaData {
  lines: NajiaLine[]
  palace: PalaceInfo
  fuCang: (NajiaLine | undefined)[]  // 伏藏: sparse, only positions with hidden lines have data
}
