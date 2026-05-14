const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// ─── Year Pillar ───
// Uses 立春 (~Feb 4) as year boundary

function yearPillar(date: Date): { gan: string; zhi: string } {
  let year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // Before 立春 (Feb 4), use previous year
  if (month < 2 || (month === 2 && day < 4)) year--
  return {
    gan: TIAN_GAN[(year - 4) % 10],
    zhi: DI_ZHI[(year - 4) % 12],
  }
}

// ─── Month Pillar ───
// Month 地支: 寅(1月=立春) to 丑(12月)
// Month 天干: 五虎遁 (based on year 天干)

const WU_HU_DUN = [
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3], // 甲/己年
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5], // 乙/庚年
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7], // 丙/辛年
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 丁/壬年
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], // 戊/癸年
]

function lunarMonthIndex(date: Date): number {
  // Returns 0-11 for 寅月 to 丑月
  const m = date.getMonth() + 1
  const d = date.getDate()
  // Simplified: use solar terms approximation
  // 立春(Feb 4) = 寅月(0), 惊蛰(Mar 6) = 卯月(1), etc.
  const termDates = [4, 6, 5, 5, 6, 7, 7, 8, 8, 8, 7, 7] // approximate day of month for each 立春..小寒
  let idx = m - 2 // Feb=0, Mar=1, ...
  if (idx < 0) idx += 12
  // Check if before the solar term
  if (d < termDates[m - 1 < 0 ? m - 1 + 12 : m - 1]) idx = (idx - 1 + 12) % 12
  return idx
}

function monthPillar(date: Date): { gan: string; zhi: string } {
  // Adjust for pre-立春
  let adjYear = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  if (m < 2 || (m === 2 && d < 4)) adjYear--
  const ygi = (adjYear - 4) % 10
  const dunRow = WU_HU_DUN[ygi % 5]
  const monthIdx = lunarMonthIndex(date)
  return {
    gan: TIAN_GAN[dunRow[monthIdx]],
    zhi: DI_ZHI[(monthIdx + 2) % 12], // 寅=index 0 → 地支 index 2
  }
}

// ─── Day Pillar ───
// Uses Gregorian Julian Day Number method

function gregorianJdn(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045
}

function dayPillar(date: Date): { gan: string; zhi: string } {
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const jdn = gregorianJdn(y, m, d)
  // sexagenary index = (JDN + 49) % 60
  // Verified: 1949-10-01=甲子, 2008-05-12=壬子, 2024-02-10=甲辰
  const sex = (jdn + 49) % 60
  return {
    gan: TIAN_GAN[sex % 10],
    zhi: DI_ZHI[sex % 12],
  }
}

// ─── Hour Pillar ───

function hourIndex(date: Date): number {
  const h = date.getHours()
  // 23-1=子(0), 1-3=丑(1), 3-5=寅(2), ..., 21-23=亥(11)
  return Math.floor(((h + 1) % 24) / 2)
}

const HOUR_GAN_TABLE = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1], // 甲/己日
  [2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3], // 乙/庚日
  [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5], // 丙/辛日
  [6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7], // 丁/壬日
  [8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9], // 戊/癸日
]

function hourPillar(date: Date): { gan: string; zhi: string } {
  const dp = dayPillar(date)
  const dayGanIdx = TIAN_GAN.indexOf(dp.gan)
  const dunRow = HOUR_GAN_TABLE[dayGanIdx % 5]
  const hIdx = hourIndex(date)
  return {
    gan: TIAN_GAN[dunRow[hIdx]],
    zhi: DI_ZHI[hIdx],
  }
}

// ─── 旬空 ───
// Each 旬 spans 10 天干 × 10 地支, leaving 2 地支 unused (空亡)
// 旬0(甲子):戌亥 旬1(甲戌):申酉 旬2(甲申):午未
// 旬3(甲午):辰巳 旬4(甲辰):寅卯 旬5(甲寅):子丑

function getShunKong(date: Date): string[] {
  const dp = dayPillar(date)
  const ganIdx = TIAN_GAN.indexOf(dp.gan)
  const zhiIdx = DI_ZHI.indexOf(dp.zhi)
  // The 旬 starts at the 甲 whose 地支 is:
  const startZhi = (zhiIdx - ganIdx + 12) % 12
  // 空亡 = the two 地支 after the 旬's last member (癸 + 9 地支)
  const m1 = (startZhi + 10) % 12
  const m2 = (startZhi + 11) % 12
  return [DI_ZHI[m1], DI_ZHI[m2]]
}

// ─── Public API ───

export interface DateTimePillars {
  date: string         // e.g. "2026年5月13日"
  yearPillar: string   // e.g. "丙午年"
  monthPillar: string  // e.g. "癸巳月"
  dayPillar: string    // e.g. "丁亥日"
  hourPillar: string   // e.g. "丙午时"
  shunKong: string[]   // e.g. ["午", "未"]
  monthZhi: string     // e.g. "巳"
  dayZhi: string       // e.g. "亥"
}

export function getDateTimePillars(date: Date): DateTimePillars {
  const yp = yearPillar(date)
  const mp = monthPillar(date)
  const dp = dayPillar(date)
  const hp = hourPillar(date)
  const sk = getShunKong(date)

  return {
    date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
    yearPillar: `${yp.gan}${yp.zhi}年`,
    monthPillar: `${mp.gan}${mp.zhi}月`,
    dayPillar: `${dp.gan}${dp.zhi}日`,
    hourPillar: `${hp.gan}${hp.zhi}时`,
    shunKong: sk,
    monthZhi: mp.zhi,
    dayZhi: dp.zhi,
  }
}
