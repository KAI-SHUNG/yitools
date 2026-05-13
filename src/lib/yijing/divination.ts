import type { Yao, CoinTossResult, Hexagram, DivinationResult, LinePolarity } from '../../types/yijing'
import { lookupHexagram } from './hexagrams'
import { TRIGRAMS } from './trigrams'

/** Generate a random coin toss result using crypto-grade randomness */
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
  }
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
  }
}
