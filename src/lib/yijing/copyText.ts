import type { DivinationResult } from '../../types/yijing'
import { HEXAGRAM_DATA } from './hexagrams'
import { getDateTimePillars } from './datetime'

/** Get palace type label: 本宫/一世/二世/.../游魂/归魂 */
function getPalaceTypeLabel(position: number, isYouHun: boolean, isGuiHun: boolean): string {
  if (isYouHun) return '游魂'
  if (isGuiHun) return '归魂'
  const types = ['本宫', '一世', '二世', '三世', '四世', '五世']
  return types[position - 1] ?? ''
}

/** Format one hexagram section (6 lines, top to bottom) for text copy */
function formatHexagramSection(
  result: DivinationResult,
  isChanged: boolean,
): string {
  const hexagram = isChanged ? result.changed! : result.original
  const najia = isChanged ? result.changedNajia : result.originalNajia
  const lines: string[] = []

  const entry = hexagram.wenNumber ? HEXAGRAM_DATA.find(h => h.wenNumber === hexagram.wenNumber) : null
  const shortName = entry?.name ?? hexagram.name
  lines.push(hexagram.name + (shortName !== hexagram.name ? `（${shortName}）` : ''))

  if (najia?.palace) {
    const p = najia.palace
    const typeLabel = getPalaceTypeLabel(p.position, p.isYouHun, p.isGuiHun)
    let label = p.name
    if (typeLabel) label += ` ${typeLabel}`
    if (!isChanged && hexagram.liuChong) label += ' 六冲'
    if (!isChanged && hexagram.liuHe) label += ' 六合'
    lines.push(label)
  }

  // Lines top to bottom (position 6 → 1)
  for (let pos = 6; pos >= 1; pos--) {
    const yao = hexagram.yaos.find(y => y.position === pos)!
    const lineNajia = najia?.lines[pos - 1]
    const fuCang = najia?.fuCang?.[pos - 1]

    if (lineNajia) {
      let text = `${lineNajia.liuQin} ${lineNajia.diZhi}${lineNajia.wuXing}`
      if (lineNajia.isShi) text += ' 世'
      if (lineNajia.isYing) text += ' 应'
      if (yao.isChanging) text += yao.polarity === 'yang' ? ' ○' : ' ×'
      if (fuCang) {
        text = `（伏 ${fuCang.liuQin}${fuCang.diZhi}${fuCang.wuXing}）${text}`
      }
      lines.push(text)
    }
  }

  return lines.join('\n')
}

/** Generate full copy text for a divination result */
export function generateCopyText(result: DivinationResult, question: string): string {
  const dt = getDateTimePillars(result.timestamp)
  const parts: string[] = []

  // AI prompt preamble
  parts.push('你是一位精通京房易传、增删卜易及卜筮正宗的传统六爻大师，为用户提供条理清晰、客观中肯的解法。请根据以下起卦信息，详细解读卦象，给出客观、专业的分析与建议。要求：')
  parts.push('1. 分析本卦卦义及整体趋势')
  parts.push('2. 根据占问之事确定用神')
  parts.push('3. 重点关注世爻、应爻、动爻、用神爻的旺衰与作用关系，描述事情发展脉络')
  parts.push('4. 结合青龙、朱雀、勾陈、腾蛇、白虎、玄武对现状进行细节描绘')
  parts.push('5. 给出事态发展的吉凶预测。若有应期，根据应期规则预测')
  parts.push('6. 给出明确的结论和建议。')
  parts.push('7. 给出人道关怀，或提醒六爻仅为预测工具等')
  parts.push('')

  // Time and question
  parts.push(`${dt.yearPillar}${dt.monthPillar}${dt.dayPillar}（旬空：${dt.shunKong[0]}${dt.shunKong[1]}），问${question}。摇得卦如下：`)
  parts.push('')

  // 本卦
  parts.push('【本卦】')
  parts.push(formatHexagramSection(result, false))
  parts.push('')

  // 变卦
  if (result.changed) {
    parts.push('【变卦】')
    parts.push(formatHexagramSection(result, true))
  }

  return parts.join('\n')
}
