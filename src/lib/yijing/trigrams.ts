import type { LinePolarity } from '../../types/yijing'

export interface Trigram {
  name: string
  lines: [LinePolarity, LinePolarity, LinePolarity]
  element: string
}

export const TRIGRAMS: Record<string, Trigram> = {
  qian: { name: '乾', lines: ['yang', 'yang', 'yang'], element: '天' },
  kun:  { name: '坤', lines: ['yin',  'yin',  'yin'],  element: '地' },
  zhen: { name: '震', lines: ['yang', 'yin',  'yin'],  element: '雷' },
  gen:  { name: '艮', lines: ['yin',  'yin',  'yang'], element: '山' },
  kan:  { name: '坎', lines: ['yin',  'yang', 'yin'],  element: '水' },
  li:   { name: '离', lines: ['yang', 'yin',  'yang'], element: '火' },
  xun:  { name: '巽', lines: ['yin',  'yang', 'yang'], element: '风' },
  dui:  { name: '兑', lines: ['yang', 'yang', 'yin'],  element: '泽' },
}

/** Reverse lookup: trigram name -> key */
export function getTrigramKey(name: string): string | undefined {
  return Object.keys(TRIGRAMS).find(key => TRIGRAMS[key].name === name)
}
