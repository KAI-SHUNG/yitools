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
}

/** The result of a divination session */
export interface DivinationResult {
  original: Hexagram
  changed: Hexagram | null
  changingPositions: number[]
  timestamp: Date
}

/** Input mode for hexagram generation */
export type DivinationMode = 'coin' | 'manual'
