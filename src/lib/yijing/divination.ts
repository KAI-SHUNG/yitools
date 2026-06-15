import type { Yao, CoinTossResult, HexagramEntry, DivinationResult, NajiaData, LinePolarity } from '../../types/yijing'
import { lookupHexagram, HEXAGRAM_DATA } from './hexagrams'
import { TRIGRAMS } from './trigrams'
import { getFullNajia } from './najia'

/** Generate a random coin toss result */
export function tossCoins(): CoinTossResult {
  const coins: [number, number, number] = [
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
    Math.random() < 0.5 ? 3 : 2,
  ]
  const sum = coins[0] + coins[1] + coins[2]
  return {
    coins,
    sum,
    polarity: (sum === 7 || sum === 9) ? 'yang' : 'yin',
    isChanging: sum === 6 || sum === 9,
  }
}

/** Interpret a single coin sum into a Yao */
export function sumToYao(sum: number, position: number): Yao {
  return {
    position,
    polarity: (sum === 7 || sum === 9) ? 'yang' : 'yin',
    isChanging: sum === 6 || sum === 9,
  }
}

/** Get trigram key from trigram name */
export function getTrigramKey(name: string): string | undefined {
  return Object.keys(TRIGRAMS).find(key => TRIGRAMS[key].name === name)
}

/** Get Na Jia data for a hexagram given its entry and yaos */
function computeNajia(entry: HexagramEntry, yaos: Yao[]): NajiaData | null {
  const polarities = yaos.map(y => y.polarity)
  return getFullNajia(entry.upper, entry.lower, polarities) ?? null
}

/** Derive the changed hexagram yaos by flipping changing lines */
export function deriveChangedYaos(yaos: Yao[]): Yao[] {
  return yaos.map(yao => ({
    ...yao,
    polarity: yao.isChanging
      ? (yao.polarity === 'yang' ? 'yin' : 'yang')
      : yao.polarity,
    isChanging: false,
  }))
}

/** Complete divination from 6 coin toss sums */
export function performDivination(sums: number[]): DivinationResult {
  const yaos: Yao[] = sums.map((sum, i) => sumToYao(sum, i + 1))
  const polarities = yaos.map(y => y.polarity)
  const entry = lookupHexagram(polarities)!
  const changingPositions = yaos.filter(y => y.isChanging).map(y => y.position)

  let changedYaos: Yao[] | null = null
  let changedEntry: HexagramEntry | null = null
  let changedNajia: NajiaData | null = null

  if (changingPositions.length > 0) {
    changedYaos = deriveChangedYaos(yaos)
    const changedPolarities = changedYaos.map(y => y.polarity)
    changedEntry = lookupHexagram(changedPolarities) ?? null
    if (changedEntry) {
      changedNajia = computeNajia(changedEntry, changedYaos)
    }
  }

  return {
    yaos,
    entry,
    changedYaos,
    changedEntry,
    changingPositions,
    timestamp: new Date(),
    najia: computeNajia(entry, yaos),
    changedNajia,
  }
}

/** Reconstruct a DivinationResult from saved data */
export function reconstructDivination(
  wenNumber: number,
  changingPositions: number[],
  timestamp: Date,
  _changedWenNumber?: number | null,
): DivinationResult | null {
  const entry = HEXAGRAM_DATA.find(h => h.wenNumber === wenNumber)
  if (!entry) return null

  const lowerLines = TRIGRAMS[entry.lower].lines
  const upperLines = TRIGRAMS[entry.upper].lines
  const polarities: LinePolarity[] = [...lowerLines, ...upperLines]

  const yaos: Yao[] = polarities.map((p, i) => ({
    position: i + 1,
    polarity: p,
    isChanging: changingPositions.includes(i + 1),
  }))

  let changedYaos: Yao[] | null = null
  let changedEntry: HexagramEntry | null = null
  let changedNajia: NajiaData | null = null

  if (changingPositions.length > 0) {
    changedYaos = deriveChangedYaos(yaos)
    const changedPolarities = changedYaos.map(y => y.polarity)
    changedEntry = lookupHexagram(changedPolarities) ?? null
    if (changedEntry) {
      changedNajia = computeNajia(changedEntry, changedYaos)
    }
  }

  return {
    yaos,
    entry,
    changedYaos,
    changedEntry,
    changingPositions,
    timestamp,
    najia: computeNajia(entry, yaos),
    changedNajia,
  }
}
