import type { Yao, CoinTossResult, Hexagram, DivinationResult, NajiaData, LinePolarity } from '../../types/yijing'
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

/** Build a Hexagram from 6 yaos (bottom to top) */
export function buildHexagram(yaos: Yao[]): Hexagram | null {
  if (yaos.length !== 6) return null
  const polarities = yaos.map(y => y.polarity)
  const entry = lookupHexagram(polarities)
  if (!entry) return null

  return {
    yaos,
    wenNumber: entry.wenNumber,
    name: entry.fullName,
    upperTrigram: TRIGRAMS[entry.upper].name,
    lowerTrigram: TRIGRAMS[entry.lower].name,
    guaCi: entry.guaCi,
    liuChong: entry.liuChong,
    liuHe: entry.liuHe,
  }
}

/** Get trigram key from trigram name */
function getTrigramKey(name: string): string | undefined {
  return Object.keys(TRIGRAMS).find(key => TRIGRAMS[key].name === name)
}

/** Get Na Jia data for a hexagram */
function computeNajia(hexagram: Hexagram): NajiaData | null {
  const upperKey = getTrigramKey(hexagram.upperTrigram)
  const lowerKey = getTrigramKey(hexagram.lowerTrigram)
  if (!upperKey || !lowerKey) return null
  const polarities = hexagram.yaos.map(y => y.polarity)
  return getFullNajia(upperKey, lowerKey, polarities) ?? null
}

/** Derive the changed hexagram by flipping changing lines */
export function deriveChangedHexagram(original: Hexagram): Hexagram | null {
  const changedYaos: Yao[] = original.yaos.map(yao => ({
    ...yao,
    polarity: yao.isChanging
      ? (yao.polarity === 'yang' ? 'yin' : 'yang')
      : yao.polarity,
    isChanging: false,
  }))
  return buildHexagram(changedYaos)
}

/** Reconstruct a DivinationResult from saved data */
export function reconstructDivination(
  wenNumber: number,
  changingPositions: number[],
  timestamp: Date,
  changedWenNumber?: number | null,
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

  const original = buildHexagram(yaos)
  if (!original) return null

  const changed = changingPositions.length > 0 ? deriveChangedHexagram(original) : null

  return {
    original,
    changed,
    changingPositions,
    timestamp,
    originalNajia: computeNajia(original),
    changedNajia: changed ? computeNajia(changed) : null,
  }
}

/** Complete divination from 6 coin toss sums */
export function performDivination(sums: number[]): DivinationResult {
  const yaos: Yao[] = sums.map((sum, i) => sumToYao(sum, i + 1))
  const original = buildHexagram(yaos)!
  const changingPositions = yaos.filter(y => y.isChanging).map(y => y.position)
  const changed = changingPositions.length > 0 ? deriveChangedHexagram(original) : null

  return {
    original,
    changed,
    changingPositions,
    timestamp: new Date(),
    originalNajia: computeNajia(original),
    changedNajia: changed ? computeNajia(changed) : null,
  }
}
