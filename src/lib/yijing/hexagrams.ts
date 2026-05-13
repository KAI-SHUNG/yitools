import type { LinePolarity } from '../../types/yijing'
import { TRIGRAMS } from './trigrams'

export interface HexagramEntry {
  wenNumber: number
  name: string
  fullName: string
  upper: string
  lower: string
  guaCi: string
  liuChong?: boolean  // 六冲卦
  liuHe?: boolean     // 六合卦
}

/** King Wen sequence: all 64 hexagrams */
export const HEXAGRAM_DATA: HexagramEntry[] = [
  { wenNumber: 1,  name: '乾', fullName: '乾为天', upper: 'qian', lower: 'qian', guaCi: '乾：元亨利贞。', liuChong: true },
  { wenNumber: 2,  name: '坤', fullName: '坤为地', upper: 'kun',  lower: 'kun',  guaCi: '坤：元亨，利牝马之贞。', liuChong: true },
  { wenNumber: 3,  name: '屯', fullName: '水雷屯', upper: 'kan',  lower: 'zhen', guaCi: '屯：元亨利贞，勿用有攸往，利建侯。' },
  { wenNumber: 4,  name: '蒙', fullName: '山水蒙', upper: 'gen',  lower: 'kan',  guaCi: '蒙：亨。匪我求童蒙，童蒙求我。' },
  { wenNumber: 5,  name: '需', fullName: '水天需', upper: 'kan',  lower: 'qian', guaCi: '需：有孚，光亨，贞吉，利涉大川。' },
  { wenNumber: 6,  name: '讼', fullName: '天水讼', upper: 'qian', lower: 'kan',  guaCi: '讼：有孚窒惕，中吉，终凶。利见大人，不利涉大川。' },
  { wenNumber: 7,  name: '师', fullName: '地水师', upper: 'kun',  lower: 'kan',  guaCi: '师：贞，丈人吉，无咎。' },
  { wenNumber: 8,  name: '比', fullName: '水地比', upper: 'kan',  lower: 'kun',  guaCi: '比：吉。原筮元永贞，无咎。' },
  { wenNumber: 9,  name: '小畜', fullName: '风天小畜', upper: 'xun',  lower: 'qian', guaCi: '小畜：亨。密云不雨，自我西郊。' },
  { wenNumber: 10, name: '履', fullName: '天泽履', upper: 'qian', lower: 'dui',  guaCi: '履：履虎尾，不咥人，亨。' },
  { wenNumber: 11, name: '泰', fullName: '地天泰', upper: 'kun',  lower: 'qian', guaCi: '泰：小往大来，吉亨。', liuHe: true },
  { wenNumber: 12, name: '否', fullName: '天地否', upper: 'qian', lower: 'kun',  guaCi: '否：否之匪人，不利君子贞，大往小来。', liuHe: true },
  { wenNumber: 13, name: '同人', fullName: '天火同人', upper: 'qian', lower: 'li',   guaCi: '同人：同人于野，亨，利涉大川，利君子贞。' },
  { wenNumber: 14, name: '大有', fullName: '火天大有', upper: 'li',   lower: 'qian', guaCi: '大有：元亨。' },
  { wenNumber: 15, name: '谦', fullName: '地山谦', upper: 'kun',  lower: 'gen',  guaCi: '谦：亨，君子有终。' },
  { wenNumber: 16, name: '豫', fullName: '雷地豫', upper: 'zhen', lower: 'kun',  guaCi: '豫：利建侯行师。' },
  { wenNumber: 17, name: '随', fullName: '泽雷随', upper: 'dui',  lower: 'zhen', guaCi: '随：元亨利贞，无咎。' },
  { wenNumber: 18, name: '蛊', fullName: '山风蛊', upper: 'gen',  lower: 'xun',  guaCi: '蛊：元亨，利涉大川。先甲三日，后甲三日。' },
  { wenNumber: 19, name: '临', fullName: '地泽临', upper: 'kun',  lower: 'dui',  guaCi: '临：元亨利贞。至于八月有凶。' },
  { wenNumber: 20, name: '观', fullName: '风地观', upper: 'xun',  lower: 'kun',  guaCi: '观：盥而不荐，有孚颙若。' },
  { wenNumber: 21, name: '噬嗑', fullName: '火雷噬嗑', upper: 'li',   lower: 'zhen', guaCi: '噬嗑：亨，利用狱。' },
  { wenNumber: 22, name: '贲', fullName: '山火贲', upper: 'gen',  lower: 'li',   guaCi: '贲：亨，小利有攸往。' },
  { wenNumber: 23, name: '剥', fullName: '山地剥', upper: 'gen',  lower: 'kun',  guaCi: '剥：不利有攸往。' },
  { wenNumber: 24, name: '复', fullName: '地雷复', upper: 'kun',  lower: 'zhen', guaCi: '复：亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。' },
  { wenNumber: 25, name: '无妄', fullName: '天雷无妄', upper: 'qian', lower: 'zhen', guaCi: '无妄：元亨利贞。其匪正有眚，不利有攸往。', liuChong: true },
  { wenNumber: 26, name: '大畜', fullName: '山天大畜', upper: 'gen',  lower: 'qian', guaCi: '大畜：利贞，不家食吉，利涉大川。' },
  { wenNumber: 27, name: '颐', fullName: '山雷颐', upper: 'gen',  lower: 'zhen', guaCi: '颐：贞吉。观颐，自求口实。' },
  { wenNumber: 28, name: '大过', fullName: '泽风大过', upper: 'dui',  lower: 'xun',  guaCi: '大过：栋桡，利有攸往，亨。' },
  { wenNumber: 29, name: '坎', fullName: '坎为水', upper: 'kan',  lower: 'kan',  guaCi: '坎：习坎，有孚，维心亨，行有尚。', liuChong: true },
  { wenNumber: 30, name: '离', fullName: '离为火', upper: 'li',   lower: 'li',   guaCi: '离：利贞，亨。畜牝牛，吉。', liuChong: true },
  { wenNumber: 31, name: '咸', fullName: '泽山咸', upper: 'dui',  lower: 'gen',  guaCi: '咸：亨，利贞，取女吉。', liuHe: true },
  { wenNumber: 32, name: '恒', fullName: '雷风恒', upper: 'zhen', lower: 'xun',  guaCi: '恒：亨，无咎，利贞，利有攸往。', liuHe: true },
  { wenNumber: 33, name: '遁', fullName: '天山遁', upper: 'qian', lower: 'gen',  guaCi: '遁：亨，小利贞。' },
  { wenNumber: 34, name: '大壮', fullName: '雷天大壮', upper: 'zhen', lower: 'qian', guaCi: '大壮：利贞。', liuChong: true },
  { wenNumber: 35, name: '晋', fullName: '火地晋', upper: 'li',   lower: 'kun',  guaCi: '晋：康侯用锡马蕃庶，昼日三接。' },
  { wenNumber: 36, name: '明夷', fullName: '地火明夷', upper: 'kun',  lower: 'li',   guaCi: '明夷：利艰贞。' },
  { wenNumber: 37, name: '家人', fullName: '风火家人', upper: 'xun',  lower: 'li',   guaCi: '家人：利女贞。' },
  { wenNumber: 38, name: '睽', fullName: '火泽睽', upper: 'li',   lower: 'dui',  guaCi: '睽：小事吉。' },
  { wenNumber: 39, name: '蹇', fullName: '水山蹇', upper: 'kan',  lower: 'gen',  guaCi: '蹇：利西南，不利东北。利见大人，贞吉。' },
  { wenNumber: 40, name: '解', fullName: '雷水解', upper: 'zhen', lower: 'kan',  guaCi: '解：利西南，无所往，其来复吉。有攸往，夙吉。' },
  { wenNumber: 41, name: '损', fullName: '山泽损', upper: 'gen',  lower: 'dui',  guaCi: '损：有孚，元吉，无咎，可贞，利有攸往。', liuHe: true },
  { wenNumber: 42, name: '益', fullName: '风雷益', upper: 'xun',  lower: 'zhen', guaCi: '益：利有攸往，利涉大川。', liuHe: true },
  { wenNumber: 43, name: '夬', fullName: '泽天夬', upper: 'dui',  lower: 'qian', guaCi: '夬：扬于王庭，孚号有厉，告自邑，不利即戎，利有攸往。' },
  { wenNumber: 44, name: '姤', fullName: '天风姤', upper: 'qian', lower: 'xun',  guaCi: '姤：女壮，勿用取女。' },
  { wenNumber: 45, name: '萃', fullName: '泽地萃', upper: 'dui',  lower: 'kun',  guaCi: '萃：亨。王假有庙，利见大人，亨，利贞。用大牲吉，利有攸往。' },
  { wenNumber: 46, name: '升', fullName: '地风升', upper: 'kun',  lower: 'xun',  guaCi: '升：元亨，用见大人，勿恤，南征吉。' },
  { wenNumber: 47, name: '困', fullName: '泽水困', upper: 'dui',  lower: 'kan',  guaCi: '困：亨，贞，大人吉，无咎。有言不信。' },
  { wenNumber: 48, name: '井', fullName: '水风井', upper: 'kan',  lower: 'xun',  guaCi: '井：改邑不改井，无丧无得，往来井井。' },
  { wenNumber: 49, name: '革', fullName: '泽火革', upper: 'dui',  lower: 'li',   guaCi: '革：已日乃孚，元亨利贞，悔亡。' },
  { wenNumber: 50, name: '鼎', fullName: '火风鼎', upper: 'li',   lower: 'xun',  guaCi: '鼎：元吉，亨。' },
  { wenNumber: 51, name: '震', fullName: '震为雷', upper: 'zhen', lower: 'zhen', guaCi: '震：亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。', liuChong: true },
  { wenNumber: 52, name: '艮', fullName: '艮为山', upper: 'gen',  lower: 'gen',  guaCi: '艮：艮其背，不获其身，行其庭，不见其人，无咎。', liuChong: true },
  { wenNumber: 53, name: '渐', fullName: '风山渐', upper: 'xun',  lower: 'gen',  guaCi: '渐：女归吉，利贞。' },
  { wenNumber: 54, name: '归妹', fullName: '雷泽归妹', upper: 'zhen', lower: 'dui',  guaCi: '归妹：征凶，无攸利。' },
  { wenNumber: 55, name: '丰', fullName: '雷火丰', upper: 'zhen', lower: 'li',   guaCi: '丰：亨，王假之，勿忧，宜日中。' },
  { wenNumber: 56, name: '旅', fullName: '火山旅', upper: 'li',   lower: 'gen',  guaCi: '旅：小亨，旅贞吉。' },
  { wenNumber: 57, name: '巽', fullName: '巽为风', upper: 'xun',  lower: 'xun',  guaCi: '巽：小亨，利有攸往，利见大人。', liuChong: true },
  { wenNumber: 58, name: '兑', fullName: '兑为泽', upper: 'dui',  lower: 'dui',  guaCi: '兑：亨，利贞。', liuChong: true },
  { wenNumber: 59, name: '涣', fullName: '风水涣', upper: 'xun',  lower: 'kan',  guaCi: '涣：亨。王假有庙，利涉大川，利贞。' },
  { wenNumber: 60, name: '节', fullName: '水泽节', upper: 'kan',  lower: 'dui',  guaCi: '节：亨。苦节不可贞。' },
  { wenNumber: 61, name: '中孚', fullName: '风泽中孚', upper: 'xun',  lower: 'dui',  guaCi: '中孚：豚鱼吉，利涉大川，利贞。' },
  { wenNumber: 62, name: '小过', fullName: '雷山小过', upper: 'zhen', lower: 'gen',  guaCi: '小过：亨，利贞。可小事，不可大事。飞鸟遗之音，不宜上宜下，大吉。' },
  { wenNumber: 63, name: '既济', fullName: '水火既济', upper: 'kan',  lower: 'li',   guaCi: '既济：亨小，利贞。初吉终乱。', liuHe: true },
  { wenNumber: 64, name: '未济', fullName: '火水未济', upper: 'li',   lower: 'kan',  guaCi: '未济：亨。小狐汔济，濡其尾，无攸利。', liuHe: true },
]

/** Build a lookup map: "upperKey-lowerKey" -> HexagramEntry */
const HEXAGRAM_MAP = new Map<string, HexagramEntry>()
for (const entry of HEXAGRAM_DATA) {
  HEXAGRAM_MAP.set(`${entry.upper}-${entry.lower}`, entry)
}

/** Get trigram key from 3 lines (bottom to top) */
function trigramKeyFromLines(lines: [LinePolarity, LinePolarity, LinePolarity]): string | undefined {
  for (const [key, trigram] of Object.entries(TRIGRAMS)) {
    if (
      trigram.lines[0] === lines[0] &&
      trigram.lines[1] === lines[1] &&
      trigram.lines[2] === lines[2]
    ) {
      return key
    }
  }
  return undefined
}

/** Look up a hexagram by its 6 lines (bottom to top) */
export function lookupHexagram(yaos: LinePolarity[]): HexagramEntry | undefined {
  if (yaos.length !== 6) return undefined
  const lowerLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[0], yaos[1], yaos[2]]
  const upperLines: [LinePolarity, LinePolarity, LinePolarity] = [yaos[3], yaos[4], yaos[5]]
  const lowerKey = trigramKeyFromLines(lowerLines)
  const upperKey = trigramKeyFromLines(upperLines)
  if (!lowerKey || !upperKey) return undefined
  return HEXAGRAM_MAP.get(`${upperKey}-${lowerKey}`)
}
