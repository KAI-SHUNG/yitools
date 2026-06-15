import type { LinePolarity, DiZhi, WuXing, LiuQin, NajiaLine, PalaceInfo, NajiaData } from '../../types/yijing'

// ─── Trigram Line Patterns (bottom to top) ───

export const TRIGRAM_LINES: Record<string, [LinePolarity, LinePolarity, LinePolarity]> = {
  qian: ['yang', 'yang', 'yang'],
  dui:  ['yang', 'yang', 'yin'],
  li:   ['yang', 'yin',  'yang'],
  zhen: ['yang', 'yin',  'yin'],
  xun:  ['yin',  'yang', 'yang'],
  kan:  ['yin',  'yang', 'yin'],
  gen:  ['yin',  'yin',  'yang'],
  kun:  ['yin',  'yin',  'yin'],
}

// ─── Na Jia: Heavenly Stems ───

export const TRIGRAM_STEMS: Record<string, { inner: string; outer: string }> = {
  qian: { inner: '甲', outer: '壬' },
  dui:  { inner: '丁', outer: '丁' },
  li:   { inner: '己', outer: '己' },
  zhen: { inner: '庚', outer: '庚' },
  xun:  { inner: '辛', outer: '辛' },
  kan:  { inner: '戊', outer: '戊' },
  gen:  { inner: '丙', outer: '丙' },
  kun:  { inner: '乙', outer: '癸' },
}

// ─── Na Jia: Earthly Branches (bottom to top) ───

export const TRIGRAM_BRANCHES: Record<string, { inner: DiZhi[]; outer: DiZhi[] }> = {
  qian: { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  dui:  { inner: ['巳', '卯', '丑'], outer: ['亥', '酉', '未'] },
  li:   { inner: ['卯', '丑', '亥'], outer: ['酉', '未', '巳'] },
  zhen: { inner: ['子', '寅', '辰'], outer: ['午', '申', '戌'] },
  xun:  { inner: ['丑', '亥', '酉'], outer: ['未', '巳', '卯'] },
  kan:  { inner: ['寅', '辰', '午'], outer: ['申', '戌', '子'] },
  gen:  { inner: ['辰', '午', '申'], outer: ['戌', '子', '寅'] },
  kun:  { inner: ['未', '巳', '卯'], outer: ['丑', '亥', '酉'] },
}

// ─── Branch → Element ───

const BRANCH_ELEMENT: Record<DiZhi, WuXing> = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

// ─── Eight Palace Data ───

interface PalaceEntry {
  key: string
  name: string
  rootElement: WuXing
  hexagrams: { upper: string; lower: string }[]
}

const PALACES: PalaceEntry[] = [
  {
    key: 'qian', name: '乾宫', rootElement: '金',
    hexagrams: [
      { upper: 'qian', lower: 'qian' },
      { upper: 'qian', lower: 'xun' },
      { upper: 'qian', lower: 'gen' },
      { upper: 'qian', lower: 'kun' },
      { upper: 'xun',  lower: 'kun' },
      { upper: 'gen',  lower: 'kun' },
      { upper: 'li',   lower: 'kun' },
      { upper: 'li',   lower: 'qian' },
    ],
  },
  {
    key: 'dui', name: '兑宫', rootElement: '金',
    hexagrams: [
      { upper: 'dui',  lower: 'dui' },
      { upper: 'dui',  lower: 'kan' },
      { upper: 'dui',  lower: 'kun' },
      { upper: 'dui',  lower: 'gen' },
      { upper: 'kan',  lower: 'gen' },
      { upper: 'kun',  lower: 'gen' },
      { upper: 'zhen', lower: 'gen' },
      { upper: 'zhen', lower: 'dui' },
    ],
  },
  {
    key: 'li', name: '离宫', rootElement: '火',
    hexagrams: [
      { upper: 'li',   lower: 'li' },
      { upper: 'li',   lower: 'gen' },
      { upper: 'li',   lower: 'xun' },
      { upper: 'li',   lower: 'kan' },
      { upper: 'gen',  lower: 'kan' },
      { upper: 'xun',  lower: 'kan' },
      { upper: 'qian', lower: 'kan' },
      { upper: 'qian', lower: 'li' },
    ],
  },
  {
    key: 'zhen', name: '震宫', rootElement: '木',
    hexagrams: [
      { upper: 'zhen', lower: 'zhen' },
      { upper: 'zhen', lower: 'kun' },
      { upper: 'zhen', lower: 'kan' },
      { upper: 'zhen', lower: 'xun' },
      { upper: 'kun',  lower: 'xun' },
      { upper: 'kan',  lower: 'xun' },
      { upper: 'dui',  lower: 'xun' },
      { upper: 'dui',  lower: 'zhen' },
    ],
  },
  {
    key: 'xun', name: '巽宫', rootElement: '木',
    hexagrams: [
      { upper: 'xun', lower: 'xun' },
      { upper: 'xun', lower: 'qian' },
      { upper: 'xun', lower: 'li' },
      { upper: 'xun', lower: 'zhen' },
      { upper: 'qian', lower: 'zhen' },
      { upper: 'li',   lower: 'zhen' },
      { upper: 'gen',  lower: 'zhen' },
      { upper: 'gen',  lower: 'xun' },
    ],
  },
  {
    key: 'kan', name: '坎宫', rootElement: '水',
    hexagrams: [
      { upper: 'kan', lower: 'kan' },
      { upper: 'kan', lower: 'dui' },
      { upper: 'kan', lower: 'zhen' },
      { upper: 'kan', lower: 'li' },
      { upper: 'dui', lower: 'li' },
      { upper: 'zhen', lower: 'li' },
      { upper: 'kun', lower: 'li' },
      { upper: 'kun', lower: 'kan' },
    ],
  },
  {
    key: 'gen', name: '艮宫', rootElement: '土',
    hexagrams: [
      { upper: 'gen', lower: 'gen' },
      { upper: 'gen', lower: 'li' },
      { upper: 'gen', lower: 'qian' },
      { upper: 'gen', lower: 'dui' },
      { upper: 'li',  lower: 'dui' },
      { upper: 'qian', lower: 'dui' },
      { upper: 'xun', lower: 'dui' },
      { upper: 'xun', lower: 'gen' },
    ],
  },
  {
    key: 'kun', name: '坤宫', rootElement: '土',
    hexagrams: [
      { upper: 'kun',  lower: 'kun' },
      { upper: 'kun',  lower: 'zhen' },
      { upper: 'kun',  lower: 'dui' },
      { upper: 'kun',  lower: 'qian' },
      { upper: 'zhen', lower: 'qian' },
      { upper: 'dui',  lower: 'qian' },
      { upper: 'kan',  lower: 'qian' },
      { upper: 'kan',  lower: 'kun' },
    ],
  },
]

// ─── Position → Type Name ───

const POSITION_TYPE = ['', '', '', '', '', '', '游魂', '归魂']

// ─── Position → 世/应 ───

const SHI_POSITIONS = [6, 1, 2, 3, 4, 5, 4, 3]
const YING_POSITIONS = [3, 4, 5, 6, 1, 2, 1, 6]

// ─── Six Relations Lookup ───

const LIU_QIN_MAP: Record<WuXing, Record<WuXing, LiuQin>> = {
  金: { 木: '妻财', 火: '官鬼', 土: '父母', 金: '兄弟', 水: '子孙' },
  木: { 木: '兄弟', 火: '子孙', 土: '妻财', 金: '官鬼', 水: '父母' },
  水: { 木: '子孙', 火: '妻财', 土: '官鬼', 金: '父母', 水: '兄弟' },
  火: { 木: '父母', 火: '兄弟', 土: '子孙', 金: '妻财', 水: '官鬼' },
  土: { 木: '官鬼', 火: '父母', 土: '兄弟', 金: '子孙', 水: '妻财' },
}

// ─── Build lookup map: "upper-lower" → palace index, position ───

const PALACE_MAP = new Map<string, { palaceIdx: number; position: number }>()
for (let pi = 0; pi < PALACES.length; pi++) {
  const palace = PALACES[pi]
  for (let pos = 0; pos < palace.hexagrams.length; pos++) {
    const h = palace.hexagrams[pos]
    PALACE_MAP.set(`${h.upper}-${h.lower}`, { palaceIdx: pi, position: pos })
  }
}

/** Get trigram key from 3 lines (bottom to top) */
function trigramFromLines(lines: [LinePolarity, LinePolarity, LinePolarity]): string | undefined {
  for (const [key, pattern] of Object.entries(TRIGRAM_LINES)) {
    if (pattern[0] === lines[0] && pattern[1] === lines[1] && pattern[2] === lines[2]) {
      return key
    }
  }
  return undefined
}

/** Look up palace info for a hexagram by its 6 polarities (bottom to top) */
export function lookupPalace(yaos: LinePolarity[]): PalaceInfo | undefined {
  if (yaos.length !== 6) return undefined
  const lowerLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[0], yaos[1], yaos[2]]
  const upperLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[3], yaos[4], yaos[5]]
  const lowerKey = trigramFromLines(lowerLines)
  const upperKey = trigramFromLines(upperLines)
  if (!lowerKey || !upperKey) return undefined

  const entry = PALACE_MAP.get(`${upperKey}-${lowerKey}`)
  if (!entry) return undefined

  const palace = PALACES[entry.palaceIdx]
  const pos = entry.position
  const type = POSITION_TYPE[pos]

  return {
    name: palace.name,
    rootElement: palace.rootElement,
    position: pos + 1,
    type,
    isYouHun: pos === 6,
    isGuiHun: pos === 7,
    shiPosition: SHI_POSITIONS[pos],
    yingPosition: YING_POSITIONS[pos],
  }
}

/** Get Na Jia data for all 6 lines of a hexagram */
export function getNajiaData(upperTrigram: string, lowerTrigram: string, palace: PalaceInfo): NajiaLine[] {
  const lines: NajiaLine[] = []

  // Lines 1-3: inner (lower) trigram
  const lowerBranches = TRIGRAM_BRANCHES[lowerTrigram]
  const lowerStem = TRIGRAM_STEMS[lowerTrigram]
  for (let i = 0; i < 3; i++) {
    const branch = lowerBranches.inner[i]
    const element = BRANCH_ELEMENT[branch]
    const liuQin = LIU_QIN_MAP[palace.rootElement][element]
    lines.push({
      liuQin,
      diZhi: branch,
      wuXing: element,
      tianGan: lowerStem.inner,
      isShi: i + 1 === palace.shiPosition,
      isYing: i + 1 === palace.yingPosition,
    })
  }

  // Lines 4-6: outer (upper) trigram
  const upperBranches = TRIGRAM_BRANCHES[upperTrigram]
  const upperStem = TRIGRAM_STEMS[upperTrigram]
  for (let i = 0; i < 3; i++) {
    const branch = upperBranches.outer[i]
    const element = BRANCH_ELEMENT[branch]
    const liuQin = LIU_QIN_MAP[palace.rootElement][element]
    lines.push({
      liuQin,
      diZhi: branch,
      wuXing: element,
      tianGan: upperStem.outer,
      isShi: i + 4 === palace.shiPosition,
      isYing: i + 4 === palace.yingPosition,
    })
  }

  return lines
}

// ─── 伏藏 positions per palace ───
// Indexed by PALACES array order: [本宫, 一世, 二世, 三世, 四世, 五世, 游魂, 归魂]
// Rule: 本宫卦某爻的地支五行在当前卦六爻中不出现 → 该位置伏藏
// Order: 乾兑离震巽坎艮坤
const FU_CANG_POSITIONS: number[][][] = [
  // 乾(金)
  [[], [2], [1,2], [1], [1,5], [5], [1], []],
  // 兑(金)
  [[], [], [], [2], [2], [2], [2,4], [4]],
  // 离(火)
  [[], [1,3], [1], [3], [4], [3,4], [3], []],
  // 震(木)
  [[], [1], [1], [2], [2,4], [2,4], [2,4], [4]],
  // 巽(木)
  [[], [3], [3], [3], [], [], [3,5], [5]],
  // 坎(水)
  [[], [], [3], [3], [3], [], [3], []],
  // 艮(土)
  [[], [2,3], [2,3], [3], [5], [5], [3,5], [5]],
  // 坤(土)
  [[], [2], [], [2], [], [2], [2], []],
]

/** Get 伏藏 data: returns sparse array, only positions with hidden lines have data */
export function getFuCang(palace: PalaceInfo, palaceIdx: number): (NajiaLine | undefined)[] {
  const pos = palace.position - 1  // 0-based
  const positions = FU_CANG_POSITIONS[palaceIdx]?.[pos] ?? []

  if (positions.length === 0) return []

  // Root hexagram (本宫卦) Na Jia data
  const root = PALACES[palaceIdx].hexagrams[0]
  const rootPalace: PalaceInfo = {
    ...palace,
    position: 1,
    type: '',
    isYouHun: false,
    isGuiHun: false,
    shiPosition: 6,
    yingPosition: 3,
  }
  const rootLines = getNajiaData(root.upper, root.lower, rootPalace)

  // Build sparse result: only include lines at fu cang positions
  const result: (NajiaLine | undefined)[] = []
  for (let i = 0; i < 6; i++) {
    result.push(positions.includes(i + 1) ? rootLines[i] : undefined)
  }
  return result
}

/** Get complete Na Jia data for a hexagram */
export function getFullNajia(upperTrigram: string, lowerTrigram: string, yaos: LinePolarity[]): NajiaData | undefined {
  if (yaos.length !== 6) return undefined
  const lowerLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[0], yaos[1], yaos[2]]
  const upperLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[3], yaos[4], yaos[5]]
  const lowerKey = trigramFromLines(lowerLines)
  const upperKey = trigramFromLines(upperLines)
  if (!lowerKey || !upperKey) return undefined

  const entry = PALACE_MAP.get(`${upperKey}-${lowerKey}`)
  if (!entry) return undefined

  const palace = lookupPalace(yaos)
  if (!palace) return undefined
  const lines = getNajiaData(upperTrigram, lowerTrigram, palace)
  const fuCang = getFuCang(palace, entry.palaceIdx)
  return { lines, palace, fuCang }
}

