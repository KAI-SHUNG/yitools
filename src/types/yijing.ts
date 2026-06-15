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

/** Static reference data for one of the 64 hexagrams (King Wen sequence) */
export interface HexagramEntry {
  wenNumber: number
  name: string           // short name e.g. "乾"
  fullName: string       // full name e.g. "乾为天"
  upper: string          // upper trigram key e.g. "qian"
  lower: string          // lower trigram key e.g. "kun"
  guaCi: string
  liuChong?: boolean     // 六冲卦
  liuHe?: boolean        // 六合卦
}

/** The result of a divination session */
export interface DivinationResult {
  yaos: Yao[]                      // 本卦 6 爻
  entry: HexagramEntry             // 本卦字典数据
  changedYaos: Yao[] | null        // 变卦 6 爻
  changedEntry: HexagramEntry | null  // 变卦字典数据
  changingPositions: number[]
  timestamp: Date
  najia: NajiaData | null          // 本卦纳甲
  changedNajia: NajiaData | null   // 变卦纳甲
}

/** Input mode for hexagram generation */
export type DivinationMode = 'coin' | 'manual'

/** Six Relations (六亲) */
export type LiuQin = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼'

/** Five Elements */
export type WuXing = '金' | '木' | '水' | '火' | '土'

/** Earthly Branch */
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

/** Six Spirits (六神) — assigned per line, starting point determined by day stem */
export type LiuShen = '青龙' | '朱雀' | '勾陈' | '螣蛇' | '白虎' | '玄武'

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
